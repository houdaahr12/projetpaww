import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv"; // Load environment variables

import tasksRouter from './tasks.js';

dotenv.config(); // Load .env file variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors({
  origin: 'http://localhost:8080', // URL frontend
  credentials: true,
}));

// Session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,  // Set to true in production
    httpOnly: true, // Prevent client-side access
    maxAge: 3600000, // 1 hour session expiry
  },
}));

app.use('/api', tasksRouter); // Ajout du routeur pour les tâches

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goalgetter",
});

// DB connection verification
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

// Sign-up route
app.post("/signup", async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs !" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, surname, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur !" });
      }
      res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite pendant l'enregistrement !" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Veuillez fournir un email et un mot de passe !" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la connexion !" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Email incorrect ou utilisateur inexistant !" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect !" });
    }

    // Store user info in session
    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    };

    res.status(200).json({ message: `Bienvenue ${user.name} ${user.surname}!` });
  });
});

// Middleware to protect private routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated
  }
  res.status(401).json({ message: "Accès non autorisé. Veuillez vous connecter !" });
}

// Private route
app.get("/private", isAuthenticated, (req, res) => {
  res.json({
    message: `Bienvenue dans l'espace privé, ${req.session.user.name} ${req.session.user.surname}!`,
    user: req.session.user
  });
});

// Check if the user is logged in
app.get('/auth/status', (req, res) => {
  if (req.session.user) {
    return res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    return res.json({ isLoggedIn: false });
  }
});

// Get user data from session
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ userName: req.session.user.name });
  } else {
    res.status(401).json({ message: "Utilisateur non authentifié" });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: "Déconnecté avec succès !" });
  });
});



//Route pour changer les information de l'utilisateur
app.put("/profile", (req, res) => {
  const { name, surname, email, password } = req.body;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  const updates = [];
  const values = [];

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }
  if (surname) {
    updates.push("surname = ?");
    values.push(surname);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }

  function applyUpdates() {
    if (updates.length === 0) {
      return res.status(400).json({ message: "Aucune donnée à mettre à jour." });
    }

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    db.query(sql, values, (err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
      }
      res.json({ message: "Profil mis à jour avec succès !" });
    });
  }

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors du hachage du mot de passe." });
      }
      updates.push("password = ?");
      values.push(hashedPassword);
      applyUpdates();
    });
  } else {
    applyUpdates();
  }
  
});
// route pour avoir les information de l'utilisateur et les Afficher
app.get("/profile", (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  const sql = "SELECT name, surname, email FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération du profil." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Profil non trouvé." });
    }

    res.json(results[0]); // Renvoie les données du profil
  });
});


// Start server
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

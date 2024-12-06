// import express from 'express';
// import db from './db.js'; // Assurez-vous d'avoir la bonne connexion DB
// const router = express.Router();

// // Ajouter une tâche
// router.post('/tasks', (req, res) => {
//   const { task_name, category, due_date, due_time, priority } = req.body;
//   const status = 'pas commencé'; // Statut par défaut

//   // Convertir la date et l'heure en un format datetime
//   let dueDateTime = null;
//   if (due_date && due_time) {
//     dueDateTime = `${due_date} ${due_time}`;
//   } else if (due_date) {
//     dueDateTime = `${due_date} 00:00:00`; // Si pas d'heure, on met l'heure par défaut
//   }

//   // Vérifier si la date d'échéance est dans le passé
//   if (dueDateTime) {
//     const currentDate = new Date();
//     const dueDate = new Date(dueDateTime);
//     if (dueDate < currentDate) {
//       return res.status(400).json({ message: "La date d'échéance ne peut pas être dans le passé." });
//     }
//   }

//   // Insertion de la nouvelle tâche dans la base de données
//   const query = `INSERT INTO tasks (task_name, category, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
//   const values = [task_name, category, dueDateTime, priority, status];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("Erreur lors de l'insertion de la tâche:", err);
//       return res.status(500).json({ message: "Erreur lors de l'insertion de la tâche." });
//     }
//     res.status(201).json({ message: "Tâche insérée avec succès !" });
//   });
// });
// router.get('/tasks', (req, res) => {
//   const query = 'SELECT * FROM tasks';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Erreur lors de la récupération des tâches :", err);
//       return res.status(500).json({ message: "Erreur lors de la récupération des tâches." });
//     }
//     res.status(200).json(results);
//   });
// });
// export default router;

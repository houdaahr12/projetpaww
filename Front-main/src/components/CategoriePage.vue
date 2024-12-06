<template>
  <div class="categories-container">
    <!-- Première ligne de catégories (3 catégories en haut) -->
    <div class="categories-row">
      <!-- Catégorie Travail -->
      <div :class="['category-box', 'travail']">
        <h3>Travail</h3>
        <div v-if="tasks.travail.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.travail" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'travail']" @click="addTask('travail')">Ajouter une tâche</button>
      </div>

      <!-- Catégorie Personnel -->
      <div :class="['category-box', 'personnel']">
        <h3>Personnel</h3>
        <div v-if="tasks.personnel.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.personnel" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'personnel']" @click="addTask('personnel')">Ajouter une tâche</button>
      </div>

      <!-- Catégorie Etude -->
      <div :class="['category-box', 'etude']">
        <h3>Etude</h3>
        <div v-if="tasks.etude.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.etude" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'etude']" @click="addTask('etude')">Ajouter une tâche</button>
      </div>
    </div>

    <!-- Deuxième ligne de catégories (3 catégories en bas) -->
    <div class="categories-row">
      <!-- Catégorie Maison -->
      <div :class="['category-box', 'maison']">
        <h3>Maison</h3>
        <div v-if="tasks.maisons.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.maisons" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'maison']" @click="addTask('maisons')">Ajouter une tâche</button>
      </div>

      <!-- Catégorie Autre -->
      <div :class="['category-box', 'autre']">
        <h3>Autre</h3>
        <div v-if="tasks.autre.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.autre" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'autre']" @click="addTask('autre')">Ajouter une tâche</button>
      </div>

      <!-- Catégorie Loisirs -->
      <div :class="['category-box', 'loisirs']">
        <h3>Loisirs</h3>
        <div v-if="tasks.loisirs.length === 0">Vous n'avez pas de tâche!</div>
        <div v-else>
          <ul>
            <li v-for="task in tasks.loisirs" :key="task.id">{{ task.name }}</li>
          </ul>
        </div>
        <button :class="['button', 'loisirs']" @click="addTask('loisirs')">Ajouter une tâche</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Pour effectuer des requêtes HTTP

export default {
  data() {
    return {
      tasks: {
        travail: [],
        personnel: [],
        etude: [],
        maisons: [],
        autre: [],
        loisirs: []
      }
    };
  },
  mounted() {
    this.loadTasks(); // Charger les tâches au chargement du composant
  },
  methods: {
    // Charger les tâches depuis l'API (connexion à la base de données)
    async loadTasks() {
      try {
        // Requête pour récupérer les tâches par catégorie
        const response = await axios.get('http://localhost:3000/api/tasks'); // Exemple d'API
        this.tasks = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
      }
    },

    // Ajouter une tâche dans la catégorie spécifiée
    async addTask(category) {
      const taskName = prompt('Entrez le nom de la tâche:');
      if (taskName) {
        try {
          // Requête pour ajouter la tâche dans la base de données
          await axios.post('http://localhost:3000/api/tasks', {
            category: category,
            name: taskName
          });
          // Recharger les tâches après ajout
          this.loadTasks();
        } catch (error) {
          console.error("Erreur lors de l'ajout de la tâche :", error);
        }
      }
    }
  }
};
</script>
<style>
.categories-container {
display: flex;
flex-wrap: wrap;
gap: 20px;
margin-left: 250px; /* Espace pour la sidebar */
padding: 20px;
justify-content: center; /* Centrer les catégories */
}

/* Organisation des catégories en lignes */
.categories-row {
display: flex;
flex-wrap: wrap;
justify-content: center;
width: 100%;
gap: 20px;
}

/* Style des catégories */
.category-box {
box-shadow: #181220;
border-radius: 12px;
padding: 20px;
margin: 10px;
flex: 1 1 calc(33.333% - 20px); /* Prend 33% de la largeur avec des marges */
max-width: 300px; /* Limite la largeur maximale de chaque boîte */
box-sizing: border-box;
background-color: #7d5ba6; /* Fond violet doux */
color: #fff; /* Texte blanc pour le contraste */
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
transition: transform 0.3s ease, box-shadow 0.3s ease;
text-align: center;
overflow: hidden; /* Cache le contenu qui dépasse */
}

/* Effet de survol */
.category-box:hover {
transform: translateY(-5px);
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Titre des catégories */
.category-box h3 {
font-size: 1.6rem;
margin-bottom: 15px;
color: #fff;
text-transform: uppercase;
font-weight: bold;
}

/* Liste des tâches */
.category-box ul {
list-style-type: none;
padding: 0;
margin: 0;
}

.category-box ul li {
margin: 8px 0;
font-size: 1rem;
background: rgba(255, 255, 255, 0.1);
padding: 10px;
border-radius: 8px;
transition: background-color 0.3s ease;
}

.category-box ul li:hover {
background-color: rgba(255, 255, 255, 0.2);
}

/* Boutons */
.button {
margin-top: 20px;
padding: 10px 20px;
color: #fff;
font-size: 1rem;
border: none;
border-radius: 8px;
cursor: pointer;
background-color: #5b3f80; /* Couleur bouton plus foncée */
transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
background-color: #6c4c92; /* Couleur survol légèrement plus claire */
transform: scale(1.05);
}

/* Couleur uniforme pour toutes les catégories */
.category-box.travail,
.category-box.personnel,
.category-box.etude,
.category-box.maison,
.category-box.autre,
.category-box.loisirs {
background-color: #7d5ba6;
}

/* Scroll stylisé */
.category-box::-webkit-scrollbar {
width: 8px;
}

.category-box::-webkit-scrollbar-thumb {
background: rgba(255, 255, 255, 0.3);
border-radius: 10px;
}

.category-box::-webkit-scrollbar-thumb:hover {
background: rgba(255, 255, 255, 0.5);
}

/* Media Query */
@media screen and (max-width: 768px) {
.category-box {
  flex: 1 1 100%;
  max-width: none;
}
}

</style>
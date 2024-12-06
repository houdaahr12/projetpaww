<template>
  <div v-if="showMessage" class="task-overview">
    <div class="task-count" v-if="taskCount">
      <i :class="['fa-solid', 'fa-bell', 'bell-icon', { ringing: isRinging }]"></i>
      <span>Vous avez {{ taskCount }} tâche{{ taskCount > 1 ? 's' : '' }} Aujourd'hui!</span>
      <button class="close-btn" @click="hideMessage">
        &times;
      </button>
    </div>

    <div class="container-fluid d-flex align-items-center justify-content-center mt-4" v-else>
      <div class="welcome-text text-center" :class="{ 'animate-fall': animate }">
        <h1 class="display-5 aucun">Aucune tâche ?</h1>
        <p class="lead">C'est le moment idéal pour en ajouter une ! 🚀</p>
      </div>

      <button class="add-btn" @click="goToAddTask">
        +
      </button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      taskCount: 0,
      showMessage: true,
      isRinging: false // Contrôle de l'animation
    };
  },
  created() {
    axios.get('http://localhost:3000/api/tasks/today')
      .then(response => {
        this.taskCount = response.data.taskCount;
      })
      .catch(error => {
        console.error('Error fetching task count:', error);
      });
  },
  mounted() {
    this.isRinging = true;
    setTimeout(() => {
      this.isRinging = false;
    }, 5000); // Arrêter l'animation après 5 secondes
  },
  methods: {
    hideMessage() {
      this.showMessage = false;
    }, 
      goToAddTask() {
      this.$router.push('/add');
    },
  },
  goToAddTask(){

  }
};
</script>

<style scoped>
.task-overview {
  background-color: hsl(268, 70%, 87%);
  color: #491784;
  padding: 1rem;
  border-radius: 20px;
  margin: 20px 150px 50px 300px;
  transition: transform 0.4s ease;
  width: 50%;
  max-width: 600px; /* Adjust this as needed */
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  white-space: nowrap; /* Prevent wrapping inside the container */
  overflow: hidden; /* Hide anything that overflows */
  text-overflow: ellipsis; /* Add ellipsis if text overflows */
}

/* Style en mode sombre */
.dark-mode .task-overview {
  background-color: rgb(55, 54, 56);
  color: rgba(209, 209, 209, 0.858);
}

.dark-mode .bell-icon {
  color: hsl(268, 75%, 67%);
}

.task-count {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  white-space: nowrap; /* Prevent wrapping for the text */
}


.bell-icon {
  margin-right: 0.8rem;
  font-size: 1.8rem;
  cursor: pointer;
  color: hsl(268, 75%, 67%);
  transition: transform 0.1s ease-in-out;
}

/* Animation cloche qui "sonne" */
.ringing {
  animation: ring 0.5s ease-in-out infinite;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
}
}
.close-btn {
  border: none;
  color: #a198ac;
  font-size: 1.8rem;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-left: auto; /* Move close button to the right */
}

.close-btn:hover {
  transform: translateY(-3px) scale(1.05);
  color: #491784;
}

  .small-img {
    width: 50%;  /* Adjust width to your preferred size */
    max-width: 300px;  /* Set a max-width to ensure it doesn't get too large */
    height: auto;
  }

  .hover-animate:hover {
    transform: scale(1.05) rotate(3deg);
    transition: all 0.3s ease;
  }

  .animate-fall {
    animation: fall 1s ease-in-out;
  }
  .add-btn {
  border: none;
  font-size: 3rem;
  color: #ffffff;
  background-color: #491784;
  border-radius: 50%;
  width: 80px; /* Augmenter la taille */
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
  margin-left: 70px;
  margin-bottom: 40px;
}

.add-btn:hover {
  background-color: #7b39b1;
  transform: scale(1.1); /* Effet de zoom lors du survol */
}

  @keyframes fall {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .welcome-text {
    opacity: 0;
    animation: fadeIn 1.5s forwards;
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .aucun{
    font-weight: bold;
    color: #491784;
  }
  .lead{
    color: black;
    font-weight: bold;
  }
  .dark-mode .aucun{
    color: hsl(268, 75%, 67%);;
  }
  .dark-mode .lead{
    color: #d1d1d1db;
  }
</style>

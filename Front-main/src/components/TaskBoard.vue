<template>
  <div>
    <div class="task-board" v-if="taskCount">
      <div 
        v-for="(tasks, status) in sortedTaskStatuses" 
        :key="status" 
        class="task-column"
        @dragover.prevent
        @drop="onDrop($event, status)"
      >
        <div class="header d-flex justify-content-between fw-bold">
          <h2 class="heading">
            {{ statusLabels[status] }}
            <span class="task-count">({{ tasks.length }})</span>
          </h2>
          <button class="add" @click="goToAddTask" title="ajouter tache">+</button>
        </div>

        <div class="task-list">
          <!-- Render tasks using TaskDisplay -->
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskDisplay
              :task="task"
              :show-checkbox="false"
              @trigger-edit="handleEditTask"
              @delete-task="handleDeleteTask"
              @update-task="handleTaskUpdate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- v-else block with minimized image and animation -->
   <div v-else class="no-tasks-message">
      <div class="no-tasks-content">
        <p>Rien à afficher ici</p>
        <img 
          :src="require('@/assets/NoTasksss.webp')" 
          alt="No Tasks" 
          class="img-fluid animated-image" 
        />
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import TaskDisplay from "./TaskDisplay.vue";

export default {
  name: "TaskBoard",
  components: { TaskDisplay },
  data() {
    return {
      draggedTask: null, 
      taskCount: 0,

      taskStatuses: {
        "pas commence": [],
        "en cours": [],
        "termine": [],
      },
      statusLabels: {
        "pas commence": "Pas Commencé",
        "en cours": "En Cours",
        "termine": "Terminé",
      },
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

  computed: {
  sortedTaskStatuses() {
    const priorityOrder = {
      urgent: 1,
      important: 2,
      "moins important": 3,
    };

    const sortTasks = (tasks) => {
      return tasks.sort((a, b) => {
        // Trier par priorité en premier
        const priorityA = priorityOrder[a.priority?.toLowerCase()] || 4; // 4 pour les priorités inconnues
        const priorityB = priorityOrder[b.priority?.toLowerCase()] || 4;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Si les priorités sont identiques, trier par date d'échéance
        const dateA = a.due_date ? new Date(a.due_date) : null;
        const dateB = b.due_date ? new Date(b.due_date) : null;

        if (dateA && !dateB) return -1; // Tâche avec date vient avant tâche sans date
        if (!dateA && dateB) return 1;
        if (!dateA && !dateB) return 0;

        return dateA - dateB; // Dates croissantes
      });
    };

    return Object.keys(this.taskStatuses).reduce((sortedStatuses, status) => {
      sortedStatuses[status] = sortTasks([...this.taskStatuses[status]]);
      return sortedStatuses;
    }, {});
  },
},

  
  methods: {
    async fetchTasksByStatus() {
      try {
        const response = await axios.get("http://localhost:3000/api/tasks-by-status");
        console.log("Fetched tasks:", response.data);
        this.taskStatuses = response.data;
        this.sortTasksByDate(); // Call sorting function after data is fetched

      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    },
     sortTasksByDate() {
      for (const status in this.taskStatuses) {
        this.taskStatuses[status].sort((a, b) => {
          // If a task has no due_date, place it at the bottom
          const dateA = a.due_date ? new Date(a.due_date) : null;
          const dateB = b.due_date ? new Date(b.due_date) : null;

          if (dateA && !dateB) return -1; // Date A exists, B doesn't
          if (!dateA && dateB) return 1;  // Date B exists, A doesn't
          
          // If both have dates, compare them
          return dateA - dateB; // Ascending order (earliest first)
        });}
      },
    onDragStart(event, task) {
    this.draggedTask = task;
    event.dataTransfer.effectAllowed = "move";
    task.dropped = false; // Reset dropped animation
  },

  onDragEnd() {
    if (this.draggedTask) {
      this.draggedTask.dropped = true; // Trigger drop animation
    }
    this.draggedTask = null;
  },

  onDrop(event, newStatus) {
    if (!this.draggedTask) return;

    const oldStatus = this.draggedTask.status;

    if (newStatus !== oldStatus) {
      this.taskStatuses[oldStatus] = this.taskStatuses[oldStatus].filter(
        (task) => task.id !== this.draggedTask.id
      );
      this.draggedTask.status = newStatus;
      this.taskStatuses[newStatus].push(this.draggedTask);
      
      this.draggedTask.dropped = true; // Apply drop animation
      axios
        .put(`http://localhost:3000/api/tasks/${this.draggedTask.id}`, {
          status: newStatus,
        })
        .then(() => console.log("Task status updated successfully."))
        .catch((error) => console.error("Error updating task status:", error));
    }

    this.draggedTask = null;
  
    },
    handleEditTask(task) {
      console.log("Editing task:", task);
    },
    handleDeleteTask(task) {
      console.log("Deleting task:", task);
    },
    handleTaskUpdate(updatedTask) {
      console.log("Updating task:", updatedTask);
    },
    goToAddTask() {
      this.$router.push("/add");
    },
  },
  mounted() {
    this.fetchTasksByStatus();
  },
};
</script>


<style scoped>
.task-board {
  display: flex;
  justify-content: space-between;
  margin: 0 0 50px 120px;
  gap: 1rem;
  padding: 1rem;
  position: relative;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.heading {
  color: #491784;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #491784;
  margin-bottom: 1rem;
  
}
.task-count {
  color: #491784;
  font-size: 14px;
  margin-left: 5px;
  font-weight: normal;
}

.task-column {
  flex: 1;
  background-color: #e4d4f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.task-list {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.add {
  background-color: #491784;
  color: white;
  font-size: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add:hover {
  background-color: #370f66;
}

/* Style for the scrollbar */
.task-list::-webkit-scrollbar {
  width: 8px;
}

.task-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.task-list::-webkit-scrollbar-track {
  background: #f9f9f9;
}

.task-item {
  cursor: grab; 
  transition: transform 0.2s, box-shadow 0.2s;
}




.no-tasks-message {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgba(217, 201, 233, 0.589);
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  margin-left: 300px;
  margin-bottom: 30px;
}

.no-tasks-content {
  display: flex;
  align-items: center; /* Align text and image vertically */
  justify-content: space-between; /* Space out text and image */
  width: 100%;
  max-width: 600px; /* You can adjust the max-width */
}

.no-tasks-message p {
  font-size: 1.5rem;
   color: #491784;
  font-weight: bold;
  margin-right: 20px; /* Space between text and image */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
}

.no-tasks-message p:hover {
  color: #370f66;
  transition: color 0.3s ease;
}

.animated-image {
  width: 100px;
  height: 100px;
  animation: imageZoom 7s ease-in-out infinite; /* Animation lasting 7 seconds */
}

@keyframes imageZoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

</style>


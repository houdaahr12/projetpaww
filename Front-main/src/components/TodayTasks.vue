<template>
  <div class="today-tasks-card" v-if="taskCount">
    <div class="header d-flex justify-content-between align-items-center">
      <h3 class="fw-bold">Tâches d’aujourd’hui</h3>
      <button class="add" @click="goToAddTask">+</button>
    </div>
    <div class="task-list">
      <TaskDisplay
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
        :show-checkbox="true"
        @update-task="updateTaskStatus" 
        @delete-task="handleDeleteTask"
        @trigger-edit="openEditPopup" 
      />
      <EditTask
        v-if="showEditPopup"
        :task="taskToEdit"
        @update-task="updateTaskStatus"
        @close="closeEditPopup"
      />
    </div>
  </div>
</template>

<script>
import TaskDisplay from "./TaskDisplay.vue";
import EditTask from './EditTask.vue';

import axios from 'axios';  // Import axios to make HTTP requests

export default {
  name: 'TodayTasks',
  components: {
    TaskDisplay,
    EditTask
  },
  props: {
    task: Object,
  },
  data() {
    return {
      showEditPopup: false,
      taskToEdit: null,
      taskCount: 0,
      tasks: [],
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
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        this.tasks = response.data;
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  },
  computed: {
    sortedTasks() {
      return [
        ...this.tasks.filter(task => !task.completed),
        ...this.tasks.filter(task => task.completed),
      ];
    },
  },
  methods: {
    goToAddTask() {
      this.$router.push('/add');
    },
    openEditPopup(task) {
      this.taskToEdit = task;
      this.showEditPopup = true;
    },
    closeEditPopup() {
      this.showEditPopup = false;
      this.taskToEdit = null;
    },
    updateTaskStatus(updatedTask) {
      const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks.splice(index, 1, updatedTask);
      }
      axios.put(`http://localhost:3000/api/tasks/${updatedTask.id}`, updatedTask)
        .then(() => {
          console.log("Task updated successfully");
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    },
    handleDeleteTask(task) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      axios.delete(`http://localhost:3000/api/tasks/${task.id}`)
        .then(() => {
          console.log('Task deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting task:', error);
        });
    }
  },
};
</script>

<style>
.today-tasks-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.3rem;
  margin-left: 150px;
  margin-bottom: 30px;
  background: #f7eaff;
  width: 80%;
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.today-tasks-card::-webkit-scrollbar {
  width: var(--w-scrollbar, 8px); /* Default width */
  height: var(--w-scrollbar, 8px);
  border-radius: 9999px;
}

.today-tasks-card::-webkit-scrollbar-track {
  background: #0000;
}

.today-tasks-card::-webkit-scrollbar-thumb {
  background: #0000;
  border-radius: 9999px;
}

.today-tasks-card:hover::-webkit-scrollbar-thumb {
  background: #c1c2c5;
}

.dark-mode .today-tasks-card:hover::-webkit-scrollbar-thumb {
  background: #575656;
}

.dark-mode .today-tasks-card {
  background-color: rgb(55, 54, 56);
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  border: none;
}

.dark-mode .header {
  color: hsl(268, 75%, 67%);
}

.dark-mode button.add {
  background-color: hsl(268, 75%, 67%);
}

.header {
  margin-bottom: 1rem;
  color: #491784;
  font-weight: bolder;
  padding-bottom: 20px;
}

button.add {
  padding: 0.3rem;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: #491784;
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

button.add:hover {
  background: hsl(268, 70%, 60%);
  transform: scale(1.1);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

@media screen and (max-width: 768px) {
  .today-tasks-card {
    margin-left: 15px;
  }
}
</style>

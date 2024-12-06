<template>
  <div class="trash-view">
    <h3>Tâches Supprimées</h3>
    <div v-if="trash.length === 0">
      <p>Aucune tâche supprimée pour le moment.</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="task in trash" :key="task.id">
          <p><strong>{{ task.task_name }}</strong></p>
          <p>{{ task.due_date }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrashView',
  data() {
    return {
      trash: [], // To hold deleted tasks
    };
  },
  mounted() {
    // Fetch the tasks from the trash when this view is loaded
    // This could be from a local array or via an API call if persisted in the backend
    if (localStorage.getItem("trash")) {
      this.trash = JSON.parse(localStorage.getItem("trash"));
    }
  }
};
</script>

<style scoped>
.trash-view {
    margin-left: 350px;
}


</style>
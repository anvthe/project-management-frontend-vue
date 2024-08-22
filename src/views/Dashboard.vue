<template>
  <div class="dashboard">
    <div class="header">
      <button @click="createNewProject" class="create-button">Create New Project</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>

    <div class="content">
      <h2>Project Management System</h2>
      <div class="date-filters">
        <label for="start-date">Start Date: </label>
        <input id="start-date" type="date" v-model="dateRange.start" @change="fetchProjects" />
        <label for="end-date"> End Date: </label>
        <input id="end-date" type="date" v-model="dateRange.end" @change="fetchProjects" />
      </div>
      <table v-if="projects.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Intro</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.intro }}</td>
            <td>{{ project.owner }}</td>
            <td>{{ getStatusLabel(project.status) }}</td>
            <td>
              <button @click="editProject(project.id)">Edit</button>
              <button @click="deleteProject(project.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No projects found for the selected date range.</p>
    </div>

    <ProjectForm v-if="showProjectForm" :projectId="currentProjectId" @success="handleFormSuccess" />
  </div>
</template>

<script>
import ProjectForm from '@/components/ProjectForm.vue';
import api from '@/services/api';

export default {
  components: {
    ProjectForm,
  },
  data() {
    return {
      projects: [],
      showProjectForm: false,
      currentProjectId: null,
      dateRange: {
        start: this.getCurrentMonthStartDate(), // current month start date in yyyy-MM-dd format
        end: this.getCurrentMonthEndDate(),     // current month end date in yyyy-MM-dd format
      },
    };
  },
  methods: {
    getCurrentMonthStartDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    },
    getCurrentMonthEndDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      return `${year}-${month}-${lastDay}`;
    },
    async fetchProjects() {
      try {
        const { start, end } = this.dateRange;
        const response = await api.get(`/api/v1/projects/list?start=${start}&end=${end}`);
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Optionally show a user-friendly message
      }
    },
    getStatusLabel(status) {
      return status === 0 ? 'Pre' : status === 1 ? 'Start' : 'End';
    },
    createNewProject() {
      this.currentProjectId = null;
      this.showProjectForm = true;
    },
    editProject(id) {
      this.currentProjectId = id;
      this.showProjectForm = true;
    },
    async deleteProject(id) {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          await api.delete(`/api/v1/projects/delete/${id}`);
          this.fetchProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          // Optionally show a user-friendly message
        }
      }
    },
    handleFormSuccess() {
      this.showProjectForm = false;
      this.fetchProjects();
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.create-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  margin-right: auto;
}

.create-button:hover {
  background-color: #0056b3;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.date-filters {
  margin-bottom: 20px;
}

h2 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>

<template>
  <div class="form-container">
    <h2>{{ isEditMode ? 'Edit Project' : 'Create Project' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Project Name:</label>
        <input type="text" v-model="form.name" id="name" required />
      </div>

      <div class="form-group">
        <label for="intro">Project Intro:</label>
        <input type="text" v-model="form.intro" id="intro" required />
      </div>

      <div class="form-group">
        <label for="owner">Project Owner:</label>
        <input type="text" v-model="form.owner" id="owner" required />
      </div>

      <div class="form-group">
        <label for="status">Project Status:</label>
        <select v-model="form.status" id="status">
          <option value="0">Pre</option>
          <option value="1">Start</option>
          <option value="3">End</option>
        </select>
      </div>

      <div class="form-group" v-if="form.status !== '0'">
        <label for="startDate">Start Date:</label>
        <input type="date" v-model="form.startDate" id="startDate" required />
      </div>

      <div class="form-group" v-if="form.status === '3'">
        <label for="endDate">End Date:</label>
        <input type="date" v-model="form.endDate" id="endDate" required />
      </div>

      <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  props: {
    projectId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: '',
        intro: '',
        owner: '',
        status: '0',
        startDate: '',
        endDate: '',
      },
      errorMessage: '',
    };
  },
  computed: {
    isEditMode() {
      return this.projectId !== null;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.isEditMode) {
          await api.put(`/api/v1/projects/edit/${this.projectId}`, this.form);
        } else {
          await api.post('/api/v1/projects/create', this.form);
        }
        this.$emit('success');
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      }
    },
    async fetchProject() {
      if (this.isEditMode) {
        const response = await api.get(`/api/v1/projects/get/${this.projectId}`);
        this.form = response.data;
      }
    },
  },
  mounted() {
    if (this.isEditMode) {
      this.fetchProject();
    }
  },
};
</script>

<style scoped>
.form-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"], input[type="number"], input[type="date"], textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>

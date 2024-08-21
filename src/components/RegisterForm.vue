<template>
  <div class="form-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>

      <div class="form-group">
        <label for="username">Email or Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>

      <button type="submit">Register</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      name: '',
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await api.post('/auth/register', {
          name: this.name,
          username: this.username,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Registration successful:', response.data);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"], input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
}
</style>

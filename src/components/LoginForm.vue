<template>
  <div class="form-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Email or Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>

      <button type="submit">Login</button>
      
      <!-- Display error message if any -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import api from '@/services/api'; // Ensure this path is correct

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        // Make the API call to login
        const response = await api.post('/auth/login', {
          username: this.username,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Debugging: Log the full response
        console.log('Login response data:', response.data);

        // The response data is the token itself, not an object
        const token = response.data;

        console.log('Received token:', token);

        // Validate the token format
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
          throw new Error('Invalid token received');
        }

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Navigate to the dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        // Handle errors and display appropriate message
        console.error('Login failed:', error.response?.status, error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
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

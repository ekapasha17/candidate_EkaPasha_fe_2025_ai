<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div class="max-w-md w-full mx-4">
        <!-- Login Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p class="text-gray-600">
              Sign in to access the Social Media Content Generator
            </p>
          </div>
  
          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="input-field"
                placeholder="Enter your username"
                :disabled="authStore.loading"
              />
            </div>
  
            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="input-field"
                placeholder="Enter your password"
                :disabled="authStore.loading"
              />
            </div>
  
            <!-- Error Message -->
            <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{{ authStore.error }}</p>
            </div>
  
            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-primary w-full py-3"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">
                Signing in...
              </span>
              <span v-else>
                Sign In
              </span>
            </button>
          </form>
  
          <!-- Demo Credentials -->
          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Username:</strong> administrator1x</p>
              <p><strong>Password:</strong> 1xpassword</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../stores/auth.js'
  
  export default {
    name: 'Login',
    setup() {
      const authStore = useAuthStore()
      return { authStore }
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      async handleLogin() {
        // Clear any previous errors
        this.authStore.clearError()
        
        // Attempt login
        const result = await this.authStore.login(this.form.username, this.form.password)
        
        if (result.success) {
          // Redirect to dashboard
          this.$router.push('/dashboard')
        }
        // Error handling is done in the store
      }
    },
    mounted() {
      // Clear any previous auth errors when component loads
      this.authStore.clearError()
    }
  }
  </script>
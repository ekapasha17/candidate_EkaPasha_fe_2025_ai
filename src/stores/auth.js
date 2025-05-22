import { defineStore } from 'pinia'
import { userService } from '../services/database.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null
  },

  actions: {
    // Initialize auth state from localStorage
    initializeAuth() {
      const storedUser = localStorage.getItem('user')
      const storedAuth = localStorage.getItem('isAuthenticated')
      
      if (storedUser && storedAuth === 'true') {
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
      }
    },

    // Login action
    async login(username, password) {
      this.loading = true
      this.error = null

      try {
        // Authenticate with database
        const user = await userService.authenticateUser(username, password)
        
        if (user) {
          // Store user data (without password)
          const userData = { id: user.id, username: user.username }
          
          this.user = userData
          this.isAuthenticated = true
          
          // Persist to localStorage
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('isAuthenticated', 'true')
          
          return { success: true }
        } else {
          this.error = 'Invalid username or password'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = 'Authentication failed. Please try again.'
        console.error('Login error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Logout action
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
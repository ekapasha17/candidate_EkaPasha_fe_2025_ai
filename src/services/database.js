import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Database service for campaigns
export const campaignService = {
  // Get all campaigns
  async getAllCampaigns() {
    try {
      const response = await api.get('/campaigns')
      return response.data
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      throw error
    }
  },

  // Get campaign by ID
  async getCampaignById(id) {
    try {
      console.log('Fetching campaign with ID:', id) // Debug log
      
      // First try direct ID route
      try {
        const response = await api.get(`/campaigns/${id}`)
        console.log('Campaign data received via direct route:', response.data)
        return response.data
      } catch (directError) {
        console.log('Direct route failed, trying query parameter approach...')
        
        // Fallback: use query parameter to find by ID
        const response = await api.get(`/campaigns?id=${id}`)
        console.log('Query response:', response.data)
        
        if (response.data && response.data.length > 0) {
          console.log('Campaign found via query:', response.data[0])
          return response.data[0]
        } else {
          throw new Error(`Campaign with ID ${id} not found`)
        }
      }
    } catch (error) {
      console.error('Error fetching campaign:', error)
      throw error
    }
  },

  // Create new campaign
  async createCampaign(campaignData) {
    try {
      const response = await api.post('/campaigns', campaignData)
      return response.data
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  },

  // Update campaign
  async updateCampaign(id, campaignData) {
    try {
      console.log('Updating campaign with ID:', id)
      
      // For campaigns with string IDs (1, 2, 3), use direct PUT
      if (typeof id === 'string' || id <= 3) {
        try {
          const response = await api.put(`/campaigns/${id}`, campaignData)
          console.log('Campaign updated successfully via PUT:', response.data)
          return response.data
        } catch (error) {
          console.error('PUT failed for ID:', id, error)
          throw error
        }
      } else {
        // For campaigns with numeric IDs, this shouldn't happen with clean DB
        throw new Error(`Cannot update campaign with numeric ID ${id}. Please use string IDs.`)
      }
      
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  },

  // Delete campaign
  async deleteCampaign(id) {
    try {
      await api.delete(`/campaigns/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw error
    }
  }
}

// Database service for tones
export const toneService = {
  async getAllTones() {
    try {
      const response = await api.get('/tones')
      return response.data
    } catch (error) {
      console.error('Error fetching tones:', error)
      throw error
    }
  }
}

// Database service for users (authentication)
export const userService = {
  async authenticateUser(username, password) {
    try {
      const response = await api.get('/users')
      const users = response.data
      const user = users.find(u => u.username === username && u.password === password)
      return user || null
    } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
    }
  }
}

export default {
  campaignService,
  toneService,
  userService
}
import axios from 'axios'
import { productionDataService } from './productionData.js'

// Explicit production detection for Vercel
const isVercel = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') || 
  window.location.hostname.includes('vercel.com') ||
  !window.location.hostname.includes('localhost')
)

const isLocalDev = typeof window !== 'undefined' && 
  window.location.hostname === 'localhost' && 
  window.location.port === '5173'

// Force production mode for all non-local environments
const isProduction = !isLocalDev

console.log('🚀 Database Service Environment Detection:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  port: typeof window !== 'undefined' ? window.location.port : 'server',
  isVercel,
  isLocalDev,
  isProduction,
  mode: isProduction ? '📱 PRODUCTION (localStorage)' : '🛠️ DEVELOPMENT (JSON-server)'
})

// Only create API client for local development
const api = isLocalDev ? axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
}) : null

// Database service for campaigns
export const campaignService = {
  // Get all campaigns
  async getAllCampaigns() {
    if (isProduction || !api) {
      return await productionDataService.getAllCampaigns()
    }
    
    try {
      const response = await api.get('/campaigns')
      return response.data
    } catch (error) {
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.getAllCampaigns()
    }
  },

  // Get campaign by ID
  async getCampaignById(id) {
    if (isProduction || !api) {
      return await productionDataService.getCampaignById(id)
    }
    
    try {
      console.log('Fetching campaign with ID:', id)
      
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
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.getCampaignById(id)
    }
  },

  // Create new campaign
  async createCampaign(campaignData) {
    if (isProduction || !api) {
      return await productionDataService.createCampaign(campaignData)
    }
    
    try {
      const response = await api.post('/campaigns', campaignData)
      return response.data
    } catch (error) {
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.createCampaign(campaignData)
    }
  },

  // Update campaign
  async updateCampaign(id, campaignData) {
    if (isProduction || !api) {
      return await productionDataService.updateCampaign(id, campaignData)
    }
    
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
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.updateCampaign(id, campaignData)
    }
  },

  // Delete campaign
  async deleteCampaign(id) {
    if (isProduction || !api) {
      return await productionDataService.deleteCampaign(id)
    }
    
    try {
      await api.delete(`/campaigns/${id}`)
      return true
    } catch (error) {
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.deleteCampaign(id)
    }
  }
}

// Database service for tones
export const toneService = {
  async getAllTones() {
    if (isProduction || !api) {
      return await productionDataService.getAllTones()
    }
    
    try {
      const response = await api.get('/tones')
      return response.data
    } catch (error) {
      console.warn('JSON-server not available, using localStorage')
      return await productionDataService.getAllTones()
    }
  }
}

// Database service for users (authentication)
export const userService = {
  async authenticateUser(username, password) {
    console.log('🔐 Authentication Request:', { username, isProduction, isVercel })
    
    // ALWAYS use localStorage in production/Vercel
    if (isProduction) {
      console.log('✅ Using PRODUCTION authentication (localStorage)')
      return await productionDataService.authenticateUser(username, password)
    }
    
    // Only use JSON-server in local development
    console.log('🛠️ Using DEVELOPMENT authentication (JSON-server)')
    try {
      if (!api) {
        throw new Error('API not available')
      }
      const response = await api.get('/users')
      const users = response.data
      const user = users.find(u => u.username === username && u.password === password)
      return user || null
    } catch (error) {
      console.warn('⚠️ JSON-server not available, falling back to localStorage')
      return await productionDataService.authenticateUser(username, password)
    }
  }
}

export default {
  campaignService,
  toneService,
  userService
}
// Image Service for managing AI-generated images
// Note: Direct download blocked by CORS, using proxy approach

export const imageService = {
    // Create a proxy URL for AI images that works around CORS
    async downloadAndSaveImage(imageUrl, campaignId, campaignName) {
      try {
        
        // Generate unique filename
        const timestamp = Date.now()
        const cleanCampaignName = campaignName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        const filename = `campaign-${campaignId}-${cleanCampaignName}-${timestamp}.png`
        const localPath = `/assets/generated/${filename}`
        
        // Store URL mapping for later retrieval
        const imageData = {
          filename: filename,
          localPath: localPath,
          originalUrl: imageUrl,
          timestamp: timestamp,
          campaignId: campaignId,
          campaignName: campaignName
        }
        
        // Save mapping to localStorage
        this.saveImageMapping(filename, imageData)
        
        return localPath
        
      } catch (error) {
        console.error('Error processing image:', error)
        // Fallback to original URL if processing fails
        return imageUrl
      }
    },
    
    // Save image mapping to localStorage
    saveImageMapping(filename, imageData) {
      try {
        const existingMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}')
        existingMappings[filename] = imageData
        localStorage.setItem('imageMappings', JSON.stringify(existingMappings))

      } catch (error) {
        console.error('Error saving image mapping:', error)
      }
    },
    
    // Get image mapping from localStorage
    getImageMapping(filename) {
      try {
        const existingMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}')
        return existingMappings[filename] || null
      } catch (error) {
        console.error('Error getting image mapping:', error)
        return null
      }
    },
    
    // Get usable image URL
    getImageUrl(imagePath) {
      // If it's already a full URL, return as-is
      if (imagePath && imagePath.startsWith('http')) {
        return imagePath
      }
      
      // If it's a local path, try to get original URL from mapping
      if (imagePath && imagePath.startsWith('/assets/generated/')) {
        const filename = imagePath.split('/').pop()
        const mapping = this.getImageMapping(filename)
        
        if (mapping && mapping.originalUrl) {
          // Check if URL is still fresh (less than 1.5 hours old)
          const hoursOld = (Date.now() - mapping.timestamp) / (1000 * 60 * 60)
          
          if (hoursOld < 1.5) {

            return mapping.originalUrl
          } else {

            // Return placeholder for expired images
            return '/api/placeholder/1024/1024'
          }
        }
      }
      
      // Fallback to placeholder
      return '/api/placeholder/1024/1024'
    },
    
    // Clean up old mappings
    cleanOldMappings(maxAgeHours = 24) {
      try {
        const existingMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}')
        const now = Date.now()
        const maxAge = maxAgeHours * 60 * 60 * 1000
        
        let cleaned = 0
        Object.keys(existingMappings).forEach(filename => {
          const mapping = existingMappings[filename]
          if (now - mapping.timestamp > maxAge) {
            delete existingMappings[filename]
            cleaned++
          }
        })
        
        localStorage.setItem('imageMappings', JSON.stringify(existingMappings))
        
        if (cleaned > 0) {

        }
        
      } catch (error) {
        console.error('Error cleaning old mappings:', error)
      }
    },
    
    // Get all stored image mappings (for debugging)
    getAllMappings() {
      try {
        return JSON.parse(localStorage.getItem('imageMappings') || '{}')
      } catch (error) {
        console.error('Error getting all mappings:', error)
        return {}
      }
    }
  }
  
  export default imageService
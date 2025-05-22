shouldShowLogo() {
    // Show logo overlay for brand branding (always show brand initial)
    return this.campaign && this.campaign.brand
  },
  
  getImageUrl(imagePath) {
    if (!imagePath) return null
    return imageService.getImageUrl(imagePath)
  },<template>
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ campaign?.campaignName || 'Campaign Details' }}</h1>
          <p class="text-sm text-gray-600">
            {{ campaign?.brand }} • {{ campaign?.topic }} • 
            <span :class="getStatusBadgeClass(campaign?.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ campaign?.status }}
            </span>
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            v-if="canEdit && !editMode"
            @click="toggleEditMode"
            class="btn-secondary"
          >
            Edit Campaign
          </button>
          
          <button 
            v-if="canEdit && editMode"
            @click="saveChanges"
            class="btn-primary"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          
          <button 
            v-if="canEdit && editMode"
            @click="resetChanges"
            class="btn-secondary"
          >
            Cancel
          </button>
          
          <button 
            @click="$router.push('/dashboard')"
            class="btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Loading State -->
  <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-gray-600">Loading campaign details...</p>
    </div>
  </div>

  <!-- Main Content -->
  <main v-else-if="campaign" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Left Column: Instagram Preview -->
      <div class="space-y-6">
        <!-- Instagram Post Preview -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Instagram Preview</h2>
          
          <!-- Instagram Post Mockup -->
          <div class="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
            <!-- Post Header -->
            <div class="flex items-center p-3 border-b border-gray-100">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {{ campaign.brand.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="font-semibold text-sm">{{ campaign.brand }}</p>
                <p class="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
            
            <!-- Post Image -->
            <div class="relative bg-gray-100 aspect-square">
              <img 
                v-if="getImageUrl(campaign.image)"
                :src="getImageUrl(campaign.image)" 
                :alt="campaign.campaignName"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm">No image available</p>
                </div>
              </div>
              
              <!-- Logo Overlay (if logo exists and is valid) -->
              <div v-if="shouldShowLogo()" class="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full p-1 shadow-lg">
                <div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">
                    {{ campaign.brand.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Post Actions -->
            <div class="p-3">
              <div class="flex items-center space-x-4 mb-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              
              <!-- Caption -->
              <div class="text-sm">
                <p class="font-semibold">{{ campaign.brand }}</p>
                <p class="mt-1 whitespace-pre-wrap">{{ formatCaption(campaign.caption) }}</p>
              </div>
              
              <!-- Engagement Info -->
              <div class="mt-2 text-xs text-gray-500">
                <p>{{ getRandomLikes() }} likes</p>
                <p>{{ getTimeAgo(campaign.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Content Editor -->
      <div class="space-y-6">
        <!-- Campaign Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Campaign Information</h2>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Target Audience:</span>
              <span class="font-medium">{{ campaign.target }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tone:</span>
              <span class="font-medium capitalize">{{ campaign.tone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Scheduled:</span>
              <span class="font-medium">{{ formatDateTime(campaign.schedule) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Created:</span>
              <span class="font-medium">{{ formatDateTime(campaign.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Caption Editor -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Caption Editor</h2>
            <button 
              @click="enhanceCaption" 
              class="btn-secondary text-sm"
              :disabled="enhancing"
            >
              <span v-if="enhancing">Enhancing...</span>
              <span v-else>✨ Enhance with AI</span>
            </button>
          </div>
          
          <!-- Caption Textarea -->
          <div class="space-y-4">
            <textarea
              v-model="editableCaption"
              :disabled="!editMode"
              class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              :class="{ 'bg-gray-50': !editMode }"
              placeholder="Your Instagram caption..."
            ></textarea>
            
            <!-- Text Formatting Buttons (if in edit mode) -->
            <div v-if="editMode" class="flex items-center space-x-2">
              <button @click="addFormatting('**', '**')" class="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                <strong>B</strong>
              </button>
              <button @click="addFormatting('_', '_')" class="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                <em>I</em>
              </button>
              <button @click="addEmoji('😊')" class="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                😊
              </button>
              <button @click="addEmoji('🔥')" class="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                🔥
              </button>
              <button @click="addEmoji('💯')" class="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                💯
              </button>
            </div>
            
            <!-- Character Count -->
            <div class="text-right text-sm text-gray-500">
              {{ editableCaption.length }} characters
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="canEdit && editMode" class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="deleteCampaign"
              class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              :disabled="saving"
            >
              Delete Campaign
            </button>
          </div>
        </div>

        <!-- Read-only Notice -->
        <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-yellow-800">Read-only Content</h3>
              <p class="text-sm text-yellow-700 mt-1">
                This campaign has been posted and cannot be edited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Error State -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-red-600">Campaign not found or failed to load.</p>
      <button @click="$router.push('/dashboard')" class="btn-primary mt-4">
        Back to Dashboard
      </button>
    </div>
  </div>
</div>
</template>

<script>
import { campaignService } from '../services/database.js'
import { openaiService } from '../services/openai.js'
import { imageService } from '../services/imageService.js'

export default {
name: 'CampaignDetail',
data() {
  return {
    campaign: null,
    loading: true,
    editMode: false,
    editableCaption: '',
    originalCaption: '',
    saving: false,
    enhancing: false,
    logoPreview: null
  }
},
computed: {
  canEdit() {
    return this.campaign?.status === 'draft' || this.campaign?.status === 'scheduled'
  }
},
methods: {
  async loadCampaign() {
    try {
      const id = this.$route.params.id
      console.log('=== LOADING CAMPAIGN DETAIL ===')
      console.log('Route params:', this.$route.params)
      console.log('Campaign ID from route:', id)
      
      if (!id) {
        throw new Error('No campaign ID provided in route')
      }
      
      console.log('Calling campaignService.getCampaignById with ID:', id)
      this.campaign = await campaignService.getCampaignById(id)
      
      console.log('Campaign loaded successfully:', this.campaign)
      
      this.editableCaption = this.campaign.caption || ''
      this.originalCaption = this.campaign.caption || ''
      
      // Load logo preview if exists
      if (this.campaign.logo) {
        this.logoPreview = this.campaign.logo
      }
      
    } catch (error) {
      console.error('=== ERROR LOADING CAMPAIGN ===')
      console.error('Error loading campaign:', error)
      console.error('Error message:', error.message)
      console.error('Current route:', this.$route)
      this.campaign = null
    } finally {
      this.loading = false
    }
  },
  
  toggleEditMode() {
    this.editMode = !this.editMode
    if (!this.editMode) {
      // If exiting edit mode, reset changes
      this.resetChanges()
    }
  },
  
  async saveChanges() {
    if (!this.editMode) return
    
    this.saving = true
    
    try {
      const updatedCampaign = {
        ...this.campaign,
        caption: this.editableCaption
      }
      
      await campaignService.updateCampaign(this.campaign.id, updatedCampaign)
      this.campaign.caption = this.editableCaption
      this.originalCaption = this.editableCaption
      this.editMode = false
      
      alert('Changes saved successfully!')
      
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Error saving changes. Please try again.')
    }
    
    this.saving = false
  },
  
  resetChanges() {
    this.editableCaption = this.originalCaption
  },
  
  async enhanceCaption() {
    this.enhancing = true
    
    try {
      const result = await openaiService.enhanceContent('caption', this.editableCaption)
      
      if (result.success) {
        this.editableCaption = result.enhanced
      } else {
        alert('Failed to enhance caption: ' + result.error)
      }
      
    } catch (error) {
      console.error('Error enhancing caption:', error)
      alert('Error enhancing caption. Please try again.')
    }
    
    this.enhancing = false
  },
  
  async deleteCampaign() {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }
    
    try {
      await campaignService.deleteCampaign(this.campaign.id)
      alert('Campaign deleted successfully!')
      this.$router.push('/dashboard')
      
    } catch (error) {
      console.error('Error deleting campaign:', error)
      alert('Error deleting campaign. Please try again.')
    }
  },
  
  addFormatting(startTag, endTag) {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = this.editableCaption.substring(start, end)
    
    const newText = this.editableCaption.substring(0, start) + 
                   startTag + selectedText + endTag + 
                   this.editableCaption.substring(end)
    
    this.editableCaption = newText
  },
  
  addEmoji(emoji) {
    this.editableCaption += emoji
  },
  
  formatCaption(caption) {
    if (!caption) return ''
    // Basic formatting - convert **text** to bold, _text_ to italic
    return caption
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
  },
  
  formatDateTime(dateString) {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString()
  },
  
  getTimeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h`
    return `${Math.floor(diffHours / 24)}d`
  },
  
  getRandomLikes() {
    // Generate consistent random likes based on campaign ID
    const seed = this.campaign?.id || 1
    return Math.floor((seed * 347) % 900) + 100
  },
  
  getStatusBadgeClass(status) {
    switch (status) {
      case 'posted':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-orange-100 text-orange-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },
  
  handleImageError(event) {
    console.warn('Image failed to load:', event.target.src)
    // Could add fallback image here
  },
  
  shouldShowLogo() {
    // Show logo overlay for brand branding (always show brand initial)
    return this.campaign && this.campaign.brand
  },
  
  getImageUrl(imagePath) {
    if (!imagePath) return null
    return imageService.getImageUrl(imagePath)
  }
},

async mounted() {
  await this.loadCampaign()
}
}
</script>
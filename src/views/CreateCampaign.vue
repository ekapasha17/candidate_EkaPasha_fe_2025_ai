<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Create New Campaign</h1>
              <p class="text-sm text-gray-600">
                Create engaging social media content with AI assistance
              </p>
            </div>
            
            <button 
              @click="$router.push('/dashboard')"
              class="btn-secondary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- Campaign Details Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Campaign Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Brand Name -->
              <FormField
                id="brand"
                label="Brand/Company Name"
                type="text"
                v-model="form.brand"
                placeholder="Enter brand name"
                help-text="The name of your brand or company"
              />
              
              <!-- Campaign Name -->
              <FormField
                id="campaignName"
                label="Campaign Name"
                type="text"
                v-model="form.campaignName"
                placeholder="Enter campaign name"
                help-text="A descriptive name for this campaign"
              />
            </div>
            
            <!-- Campaign Description -->
            <div class="mt-6">
              <FormField
                id="description"
                label="Campaign Description"
                type="textarea"
                v-model="form.description"
                placeholder="Describe what this campaign is about..."
                :rows="3"
                help-text="Provide a detailed description of your campaign goals and message"
              />
            </div>
          </div>
  
          <!-- Content Strategy Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Content Strategy</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Target Audience -->
              <FormField
                id="target"
                label="Target Audience"
                type="text"
                v-model="form.target"
                placeholder="e.g., Young professionals, fitness enthusiasts"
                help-text="Describe your ideal audience for this campaign"
              />
              
              <!-- Post Topic -->
              <FormField
                id="topic"
                label="Post Topic"
                type="text"
                v-model="form.topic"
                placeholder="e.g., Product Launch, Event Promotion"
                help-text="What is the main topic or theme of this post?"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <!-- Tone Selection -->
              <FormField
                id="tone"
                label="Post Tone"
                type="select"
                v-model="form.tone"
                :options="tones"
                placeholder="Select tone style"
                help-text="Choose the tone that matches your brand personality"
              />
              
              <!-- Schedule -->
              <FormField
                id="schedule"
                label="Posting Schedule"
                type="datetime-local"
                v-model="form.schedule"
                help-text="When do you plan to post this content?"
              />
            </div>
          </div>
  
          <!-- Brand Assets Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Brand Assets</h2>
            
            <div class="space-y-6">
              <!-- Logo Upload -->
              <FormField
                id="logo"
                label="Company Logo"
                type="file"
                accept="image/*"
                @file-selected="handleLogoUpload"
                help-text="Upload your company logo (PNG, JPG, or SVG format)"
              />
              
              <!-- Logo Preview -->
              <div v-if="logoPreview" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                <div class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <img 
                    :src="logoPreview" 
                    :alt="form.brand + ' logo'"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                @click="saveDraft"
                class="btn-secondary"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : 'Save as Draft' }}
              </button>
              
              <button
                type="button"
                @click="handleSubmit"
                class="btn-primary"
                :class="{ 'opacity-50': !isFormValid || generating }"
                :disabled="generating"
              >
                <span v-if="generating" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating AI Content...
                </span>
                <span v-else>
                  🤖 Generate Content with AI
                </span>
              </button>
            </div>
            
            <!-- Form Validation Message -->
            <p v-if="!isFormValid && showValidationError" class="text-red-600 text-sm mt-2">
              Please fill in all required fields before generating content.
            </p>
          </div>
  
        </form>
      </main>
    </div>
  </template>
  
  <script>
  import FormField from '../components/ui/FormField.vue'
  import { toneService, campaignService } from '../services/database.js'
  import { openaiService } from '../services/openai.js'
  
  export default {
    name: 'CreateCampaign',
    components: {
      FormField
    },
    data() {
      return {
        form: {
          brand: '',
          campaignName: '',
          description: '',
          target: '',
          topic: '',
          tone: '',
          schedule: '',
          logo: null
        },
        tones: [],
        logoPreview: null,
        saving: false,
        generating: false,
        showValidationError: false
      }
    },
    computed: {
      isFormValid() {
        const isValid = !!(this.form.brand && 
               this.form.campaignName && 
               this.form.description && 
               this.form.target && 
               this.form.topic && 
               this.form.tone && 
               this.form.schedule)
        
        // Debug logging (remove this later)
        console.log('Form validation:', {
          brand: !!this.form.brand,
          campaignName: !!this.form.campaignName,
          description: !!this.form.description,
          target: !!this.form.target,
          topic: !!this.form.topic,
          tone: !!this.form.tone,
          schedule: !!this.form.schedule,
          isValid: isValid
        })
        
        return isValid
      }
    },
    methods: {
      async loadTones() {
        try {
          this.tones = await toneService.getAllTones()
        } catch (error) {
          console.error('Error loading tones:', error)
        }
      },
      
      handleLogoUpload(file) {
        this.form.logo = file
        
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.logoPreview = e.target.result
          }
          reader.readAsDataURL(file)
        } else {
          this.logoPreview = null
        }
      },
      
      async saveDraft() {
        // Force validation check  
        this.showValidationError = false
        
        // Check required fields for draft (we can be more lenient for drafts)
        if (!this.form.brand || !this.form.campaignName) {
          this.showValidationError = true
          alert('Please provide at least a Brand Name and Campaign Name to save as draft.')
          return
        }
        
        this.saving = true
        
        try {
          // Get all existing campaigns to determine next ID
          const existingCampaigns = await campaignService.getAllCampaigns()
          const existingIds = existingCampaigns.map(c => parseInt(c.id)).filter(id => !isNaN(id))
          const nextId = Math.max(...existingIds, 0) + 1
          
          const campaignData = {
            id: nextId, // Force the ID we want
            brand: this.form.brand,
            campaignName: this.form.campaignName,
            description: this.form.description,
            target: this.form.target,
            topic: this.form.topic,
            tone: this.form.tone,
            schedule: this.form.schedule,
            logo: this.form.logo,
            status: 'draft', // Explicitly set as draft
            caption: '',
            image: '',
            postedAt: null,
            createdAt: new Date().toISOString()
          }
          
          await campaignService.createCampaign(campaignData)
          
          // Success feedback
          alert('Draft saved successfully!')
          this.$router.push('/dashboard')
          
        } catch (error) {
          console.error('Error saving draft:', error)
          alert('Error saving draft. Please try again.')
        }
        
        this.saving = false
      },
      async handleSubmit() {
        console.log('handleSubmit called - AI Generation')
        
        // Force validation check
        this.showValidationError = false
        
        // Simple validation check
        if (!this.form.brand) {
            alert('Please enter a Brand/Company Name')
            return
        }
        
        if (!this.form.campaignName) {
            alert('Please enter a Campaign Name')
            return
        }
        
        if (!this.form.description) {
            alert('Please enter a Campaign Description')
            return
        }
        
        if (!this.form.target) {
            alert('Please enter a Target Audience')
            return
        }
        
        if (!this.form.topic) {
            alert('Please enter a Post Topic')
            return
        }
        
        if (!this.form.tone) {
            alert('Please select a Post Tone')
            return
        }
        
        if (!this.form.schedule) {
            alert('Please select a Posting Schedule')
            return
        }
        
        // If we get here, form is valid
        this.generating = true
        console.log('=== STARTING AI CONTENT GENERATION ===')
        
        try {
            // Get all existing campaigns to determine next ID
            const existingCampaigns = await campaignService.getAllCampaigns()
            const existingIds = existingCampaigns.map(c => parseInt(c.id)).filter(id => !isNaN(id))
            const nextId = Math.max(...existingIds, 0) + 1
            
            console.log('=== CALLING OPENAI SERVICE ===')
            console.log('Form data being sent to AI:', this.form)
            
            // Generate AI content
            const aiResult = await openaiService.generateContent(this.form)
            
            console.log('=== AI SERVICE RESPONSE ===')
            console.log('AI Result:', aiResult) // Debug: see the full result
            
            if (!aiResult.success) {
            console.error('=== AI GENERATION FAILED ===')
            console.error('AI Generation failed:', aiResult.error)
            throw new Error(aiResult.error)
            }
            
            console.log('=== AI GENERATION SUCCESSFUL ===')
            console.log('Generated Caption:', aiResult.data.caption)
            console.log('Generated Image URL:', aiResult.data.image)
            
            // Create campaign with AI-generated content
            const campaignData = {
            id: nextId,
            brand: this.form.brand,
            campaignName: this.form.campaignName,
            description: this.form.description,
            target: this.form.target,
            topic: this.form.topic,
            tone: this.form.tone,
            schedule: this.form.schedule,
            logo: this.form.logo,
            status: 'draft',
            caption: aiResult.data.caption,
            image: aiResult.data.image,
            postedAt: null,
            createdAt: new Date().toISOString()
            }
            
            console.log('=== SAVING CAMPAIGN WITH AI CONTENT ===')
            console.log('Campaign data with AI content:', campaignData)
            
            const result = await campaignService.createCampaign(campaignData)
            console.log('Campaign saved successfully:', result)
            
            alert('🎉 AI Content Generated Successfully!\n\nYour campaign has been created with AI-generated caption and image.')
            this.$router.push('/dashboard')
            
        } catch (error) {
            console.error('=== ERROR IN AI GENERATION PROCESS ===')
            console.error('Full error object:', error)
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
            
            // Fallback: create campaign without AI content
            console.log('=== FALLING BACK TO NON-AI CAMPAIGN ===')
            try {
            const existingCampaigns = await campaignService.getAllCampaigns()
            const existingIds = existingCampaigns.map(c => parseInt(c.id)).filter(id => !isNaN(id))
            const nextId = Math.max(...existingIds, 0) + 1
            
            const fallbackCampaign = {
                id: nextId,
                brand: this.form.brand,
                campaignName: this.form.campaignName,
                description: this.form.description,
                target: this.form.target,
                topic: this.form.topic,
                tone: this.form.tone,
                schedule: this.form.schedule,
                logo: this.form.logo,
                status: 'draft',
                caption: 'AI content generation failed. Please edit this caption manually.',
                image: '/api/placeholder/1024/1024',
                postedAt: null,
                createdAt: new Date().toISOString()
            }
            
            await campaignService.createCampaign(fallbackCampaign)
            alert('⚠️ AI generation failed: ' + error.message + '\n\nCampaign saved as draft for manual editing.')
            this.$router.push('/dashboard')
            
            } catch (fallbackError) {
            console.error('Fallback save also failed:', fallbackError)
            alert('❌ Error: Could not generate AI content or save campaign. Please check your API key and try again.')
            }
        }
        
        this.generating = false
        }
    },
    
    async mounted() {
      await this.loadTones()
      
      // Set default schedule to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      this.form.schedule = tomorrow.toISOString().slice(0, 16)
    }
  }
  </script>
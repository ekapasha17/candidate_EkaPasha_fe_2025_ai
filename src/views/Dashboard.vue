<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">
                Social Media Content Generator
              </h1>
              <p class="text-sm text-gray-600">
                Welcome back, {{ authStore.user?.username }}!
              </p>
            </div>
            
            <div class="flex items-center space-x-4">
              <button
                @click="$router.push('/create')"
                class="btn-primary"
              >
                Create Campaign
              </button>
              
              <button
                @click="handleLogout"
                class="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p class="text-2xl font-bold text-gray-800">{{ campaigns.length }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Posted</p>
                <p class="text-2xl font-bold text-green-600">{{ postedCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Scheduled</p>
                <p class="text-2xl font-bold text-orange-600">{{ scheduledCount }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                ⏰ 
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Drafts</p>
                <p class="text-2xl font-bold text-gray-600">{{ draftCount }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                📝
              </div>
            </div>
          </div>
        </div>
  
        <!-- Recent Campaigns -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Recent Campaigns</h2>
              <p class="text-sm text-gray-500">Showing latest {{ Math.min(campaigns.length, 5) }} of {{ campaigns.length }} campaigns</p>
            </div>
            <button 
              @click="loadCampaigns" 
              class="text-sm btn-secondary"
              :disabled="loading"
            >
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
          
          <div v-if="loading" class="p-6">
            <p class="text-gray-600">Loading campaigns...</p>
          </div>
          
          <div v-else-if="campaigns.length === 0" class="p-6">
            <p class="text-gray-600">No campaigns found. Create your first campaign!</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div 
              v-for="campaign in campaigns.slice(0, 5)" 
              :key="campaign.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-800">
                    {{ campaign.campaignName }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ campaign.brand }} • {{ campaign.topic }}
                  </p>
                  <p class="text-sm text-gray-500 line-clamp-2">
                    {{ campaign.description }}
                  </p>
                </div>
                
                <div class="ml-6 flex items-center space-x-3">
                  <span 
                    :class="getStatusBadgeClass(campaign.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ campaign.status }}
                  </span>
                  
                  <button 
                    @click="$router.push(`/campaign/${campaign.id}`)"
                    class="btn-secondary text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../stores/auth.js'
  import { campaignService } from '../services/database.js'
  
  export default {
    name: 'Dashboard',
    setup() {
      const authStore = useAuthStore()
      return { authStore }
    },
    data() {
      return {
        campaigns: [],
        loading: true
      }
    },
    computed: {
      postedCount() {
        const count = this.campaigns.filter(c => c.status === 'posted').length
        console.log('Posted campaigns:', count)
        return count
      },
      scheduledCount() {
        const count = this.campaigns.filter(c => c.status === 'scheduled').length
        console.log('Scheduled campaigns:', count)
        return count
      },
      draftCount() {
        const count = this.campaigns.filter(c => c.status === 'draft').length
        console.log('Draft campaigns:', count)
        return count
      }
    },
    methods: {
      async loadCampaigns() {
        try {
          this.loading = true
          const campaignsData = await campaignService.getAllCampaigns()
          
          console.log('Raw campaigns count:', campaignsData.length)
          console.log('Raw campaigns data sample:', campaignsData.slice(0, 2))
          
          // Sort campaigns by creation date (newest first) 
          this.campaigns = campaignsData.sort((a, b) => {
            // Use createdAt for sorting (most reliable)
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt)
            }
            // Fallback to ID comparison (convert strings to numbers)
            const idA = parseInt(a.id) || 0
            const idB = parseInt(b.id) || 0
            return idB - idA
          })
          
          console.log('Sorted campaigns:', this.campaigns.slice(0, 3).map(c => ({ 
            id: c.id, 
            name: c.campaignName, 
            created: c.createdAt,
            status: c.status 
          })))
          console.log('Total campaigns after sorting:', this.campaigns.length)
          
        } catch (error) {
          console.error('Error loading campaigns:', error)
        } finally {
          this.loading = false
        }
      },
      
      handleLogout() {
        this.authStore.logout()
        this.$router.push('/login')
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
      }
    },
    
    async mounted() {
      await this.loadCampaigns()
    },
    
    async activated() {
      // Reload campaigns when component is activated (for keep-alive)
      await this.loadCampaigns()
    }
  }
  </script>
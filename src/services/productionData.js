// Production data service using localStorage for demo purposes

const DEFAULT_CAMPAIGNS = [
    {
      id: "1",
      brand: "EcoWear",
      campaignName: "Summer Collection Launch",
      description: "Introducing our sustainable summer collection",
      schedule: "2023-06-20T09:00:00",
      target: "Young adults interested in sustainable fashion",
      topic: "Product Launch",
      tone: "casual",
      logo: "/assets/logos/ecowear.png",
      caption: "Summer just got eco-friendly! 🌞♻️ Introducing our new summer collection made from 100% recycled materials. Be cool while keeping the planet cool too. #EcoWear #SustainableFashion",
      image: "/api/placeholder/1024/1024",
      status: "posted",
      postedAt: "2023-06-20T09:05:23",
      createdAt: "2023-06-20T08:55:00.000Z"
    },
    {
      id: "2",
      brand: "TechHub",
      campaignName: "Annual Developer Conference",
      description: "Promoting our annual conference for developers",
      schedule: "2023-07-15T10:00:00",
      target: "Software developers and tech enthusiasts",
      topic: "Event Promotion",
      tone: "professional",
      logo: "/assets/logos/techhub.png",
      caption: "Save the date: TechHub Developer Conference 2023 is coming! Join us for two days of cutting-edge workshops, inspiring keynotes, and networking opportunities. Early bird tickets available now. #TechHubConf #DevCon2023",
      image: "/api/placeholder/1024/1024",
      status: "scheduled",
      postedAt: null,
      createdAt: "2023-07-14T15:30:00.000Z"
    },
    {
      id: "3",
      brand: "FitLife",
      campaignName: "New Protein Shake",
      description: "Launching our new protein shake flavors",
      schedule: "2023-06-10T08:30:00",
      target: "Fitness enthusiasts and gym-goers",
      topic: "Product Launch",
      tone: "friendly",
      logo: "/assets/logos/fitlife.png",
      caption: "Fuel your workout with our NEW protein shake flavors! 💪 Now available in Tropical Mango and Chocolate Mint. 20g of protein, no added sugar, and tastes amazing! Which flavor are you trying first? #FitLife #ProteinShake",
      image: "/api/placeholder/1024/1024",
      status: "posted",
      postedAt: "2023-06-10T08:35:12",
      createdAt: "2023-06-10T08:25:00.000Z"
    }
  ]
  
  const DEFAULT_TONES = [
    { id: "friendly", name: "Friendly", description: "Warm and approachable" },
    { id: "casual", name: "Casual", description: "Relaxed and informal" },
    { id: "modern", name: "Modern", description: "Contemporary and innovative" },
    { id: "professional", name: "Professional", description: "Formal and business-like" },
    { id: "humorous", name: "Humorous", description: "Funny and entertaining" }
  ]
  
  export const productionDataService = {
    // Initialize data if not exists
    initializeData() {
      if (!localStorage.getItem('campaigns')) {
        localStorage.setItem('campaigns', JSON.stringify(DEFAULT_CAMPAIGNS))
      }
      if (!localStorage.getItem('tones')) {
        localStorage.setItem('tones', JSON.stringify(DEFAULT_TONES))
      }
    },
  
    // Campaign operations
    async getAllCampaigns() {
      this.initializeData()
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      return new Promise(resolve => setTimeout(() => resolve(campaigns), 100))
    },
  
    async getCampaignById(id) {
      this.initializeData()
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      const campaign = campaigns.find(c => c.id == id)
      if (!campaign) {
        throw new Error(`Campaign with ID ${id} not found`)
      }
      return new Promise(resolve => setTimeout(() => resolve(campaign), 100))
    },
  
    async createCampaign(campaignData) {
      this.initializeData()
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      
      // Generate new ID
      const maxId = campaigns.reduce((max, c) => Math.max(max, parseInt(c.id) || 0), 0)
      const newId = String(maxId + 1)
      
      const newCampaign = {
        ...campaignData,
        id: newId,
        createdAt: new Date().toISOString()
      }
      
      campaigns.push(newCampaign)
      localStorage.setItem('campaigns', JSON.stringify(campaigns))
      
      return new Promise(resolve => setTimeout(() => resolve(newCampaign), 100))
    },
  
    async updateCampaign(id, campaignData) {
      this.initializeData()
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      const index = campaigns.findIndex(c => c.id == id)
      
      if (index === -1) {
        throw new Error(`Campaign with ID ${id} not found`)
      }
      
      campaigns[index] = { ...campaigns[index], ...campaignData }
      localStorage.setItem('campaigns', JSON.stringify(campaigns))
      
      return new Promise(resolve => setTimeout(() => resolve(campaigns[index]), 100))
    },
  
    async deleteCampaign(id) {
      this.initializeData()
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      const filteredCampaigns = campaigns.filter(c => c.id != id)
      localStorage.setItem('campaigns', JSON.stringify(filteredCampaigns))
      
      return new Promise(resolve => setTimeout(() => resolve(true), 100))
    },
  
    // Tone operations
    async getAllTones() {
      this.initializeData()
      const tones = JSON.parse(localStorage.getItem('tones') || '[]')
      return new Promise(resolve => setTimeout(() => resolve(tones), 100))
    },
  
    // User authentication
    async authenticateUser(username, password) {
      const users = [{ id: 1, username: "administrator1x", password: "1xpassword" }]
      const user = users.find(u => u.username === username && u.password === password)
      return new Promise(resolve => setTimeout(() => resolve(user || null), 100))
    }
  }
import axios from 'axios'
import { imageService } from './imageService.js'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

// Create axios instance for OpenAI API
const openaiApi = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const openaiService = {
  // Generate caption using GPT-4o-mini
  async generateCaption(campaignData) {
    try {
      // Create a detailed prompt based on campaign data
      const prompt = this.createCaptionPrompt(campaignData)
      
      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional social media content creator specializing in Instagram posts. Create engaging, authentic captions that drive engagement and match the specified tone and brand voice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const caption = response.data.choices[0].message.content.trim()
      return { success: true, caption }
      
    } catch (error) {
      console.error('Error generating caption:', error)
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate caption' 
      }
    }
  },

  // Generate image using DALL-E 3
  async generateImage(campaignData) {
    try {
      // Create a detailed image prompt
      const prompt = this.createImagePrompt(campaignData)
      
      const response = await openaiApi.post('/images/generations', {
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      })

      const imageUrl = response.data.data[0].url
      return { success: true, imageUrl }
      
    } catch (error) {
      console.error('Error generating image:', error)
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate image' 
      }
    }
  },

  // Generate both caption and image
  async generateContent(campaignData) {
    try {
      
      // Generate both caption and image in parallel
      const [captionResult, imageResult] = await Promise.all([
        this.generateCaption(campaignData),
        this.generateImage(campaignData)
      ])

      if (!captionResult.success || !imageResult.success) {
        return {
          success: false,
          error: captionResult.error || imageResult.error
        }
      }

      
      // Download and save image locally
      try {
        const localImagePath = await imageService.downloadAndSaveImage(
          imageResult.imageUrl,
          Date.now(), // temporary ID, will be replaced with actual campaign ID
          campaignData.campaignName
        )
        
        return {
          success: true,
          data: {
            caption: captionResult.caption,
            image: localImagePath, // Use local path instead of DALL-E URL
            originalImageUrl: imageResult.imageUrl, // Keep original for reference
            variations: [
              {
                caption: captionResult.caption,
                image: localImagePath
              }
            ]
          }
        }
      } catch (downloadError) {
        console.error('Image download failed, using original URL:', downloadError)
        
        // Fallback to original URL if download fails
        return {
          success: true,
          data: {
            caption: captionResult.caption,
            image: imageResult.imageUrl, // Fallback to original DALL-E URL
            originalImageUrl: imageResult.imageUrl,
            variations: [
              {
                caption: captionResult.caption,
                image: imageResult.imageUrl
              }
            ]
          }
        }
      }
      
    } catch (error) {
      console.error('Error in generateContent:', error)
      return {
        success: false,
        error: 'Failed to generate content'
      }
    }
  },

  // Create caption prompt based on campaign data
  createCaptionPrompt(campaignData) {
    const { brand, campaignName, description, target, topic, tone } = campaignData
    
    return `Create an engaging Instagram caption for:

Brand: ${brand}
Campaign: ${campaignName}
Description: ${description}
Target Audience: ${target}
Topic: ${topic}
Tone: ${tone}

Requirements:
- Write in ${tone} tone - be genuinely ${tone}, not formal
- Include 3-5 relevant emojis naturally in the text
- Add 5-8 relevant hashtags at the end
- Include a clear call-to-action
- Keep it 2-3 sentences plus hashtags
- Make it feel natural and ${tone}
- Focus on ${topic} for ${target}

Example format:
[Engaging sentence with emoji] [Second sentence with details and emoji] [Call to action with emoji]

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

Write ONLY the caption, nothing else.`
  },

  // Create image prompt based on campaign data
  createImagePrompt(campaignData) {
    const { brand, campaignName, description, topic, tone } = campaignData
    
    // Map tone to visual style
    const visualStyles = {
      'friendly': 'warm, welcoming, bright colors, smiling people',
      'casual': 'relaxed, informal, natural lighting, everyday settings',
      'modern': 'sleek, contemporary, minimalist, clean lines, trendy',
      'professional': 'polished, sophisticated, corporate, clean, high-quality',
      'humorous': 'playful, colorful, fun, creative, whimsical'
    }
    
    const style = visualStyles[tone] || 'professional, high-quality'
    
    return `Create a professional Instagram post image for:

Brand: ${brand}
Campaign: ${campaignName}
Topic: ${topic}
Description: ${description}

Visual style: ${style}
Requirements:
- High-quality, Instagram-ready
- Professional photography style
- Clean composition
- Brand-appropriate colors
- No text overlay (will be added separately)
- ${tone} mood and feeling
- Suitable for ${topic}
- 1024x1024 square format

Focus on creating a visually appealing image that represents the campaign concept clearly and professionally.`
  },

  // Enhance existing content
  async enhanceContent(contentType, content) {
    try {
      let prompt = ''
      
      if (contentType === 'caption') {
        prompt = `Improve this Instagram caption while keeping the same tone and message:

"${content}"

Make it more engaging by:
- Adding appropriate emojis
- Improving the call-to-action
- Enhancing readability
- Keeping the same tone and brand voice
- Adding relevant hashtags if missing

Return only the improved caption, no explanations.`
      }
      
      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional social media content editor. Improve content while maintaining its original tone and message.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const enhanced = response.data.choices[0].message.content.trim()
      return { success: true, enhanced }
      
    } catch (error) {
      console.error('Error enhancing content:', error)
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to enhance content' 
      }
    }
  }
}

export default openaiService
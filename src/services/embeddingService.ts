// Service for generating embeddings and finding similar posts
// Uses OpenAI's embedding API (text-embedding-3-small model)

export interface Embedding {
  embedding: number[]
  postId: string
}

// Generate embedding for a post's text content
export async function generateEmbedding(text: string): Promise<number[]> {
  // For now, we'll use a simple approach with OpenAI's API
  // You'll need to set VITE_OPENAI_API_KEY in your .env file
  
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    // Fallback: return a simple hash-based embedding for development
    console.warn('OpenAI API key not found. Using fallback embedding.')
    return generateFallbackEmbedding(text)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Fallback to simple embedding
    return generateFallbackEmbedding(text)
  }
}

// Fallback embedding generator (simple hash-based)
// This is not as good as real embeddings but works without API
function generateFallbackEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/)
  const embedding = new Array(384).fill(0)
  
  words.forEach((word, i) => {
    const hash = word.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0)
    }, 0)
    
    const index = Math.abs(hash) % 384
    embedding[index] += 1 / (i + 1)
  })
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0)
}

// Calculate cosine similarity between two embeddings
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    return 0
  }

  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    magnitude1 += embedding1[i] * embedding1[i]
    magnitude2 += embedding2[i] * embedding2[i]
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

// Generate embedding text from a post
export function getPostEmbeddingText(post: {
  title: string
  description: string
  category?: string
  tags: string[]
}): string {
  const parts = [
    post.title,
    post.description,
    post.category || '',
    post.tags.join(' '),
  ]
  return parts.filter(Boolean).join(' ')
}


import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function getRateLimiter() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    return null
  }

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  })
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean
  remaining: number
  limit: number
}> {
  const ratelimit = getRateLimiter()

  if (!ratelimit) {
    return { success: true, remaining: 999, limit: 999 }
  }

  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    remaining: result.remaining,
    limit: result.limit,
  }
}

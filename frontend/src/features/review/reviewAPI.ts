import type { Review } from '@/types/Review'

import { reviews } from './reviewData'

export async function getReviews(): Promise<Review[]> {
  return reviews
}

import type { Domain } from '@/types/Domain'

import { domains } from './domainData'

export async function getDomains(): Promise<Domain[]> {
  return domains
}

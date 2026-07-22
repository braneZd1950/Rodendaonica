import { env } from '../config/env'
import { createHttpApi } from './implementations/http/createHttpApi'
import { createMockApi } from '../mock/createMockApi'
import type { AppApi } from './contracts'

/**
 * Jedinstvena API točka za cijelu aplikaciju.
 * U developmentu: VITE_API_MODE=mock
 * U produkciji: VITE_API_MODE=http + VITE_API_BASE_URL
 */
export const api: AppApi = env.isMock ? createMockApi() : createHttpApi()

export type { AppApi }

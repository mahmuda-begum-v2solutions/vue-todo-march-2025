import type { filters } from '@/constants/constants'

export type Mode = 'Add' | 'Update'

export type filterKey = (typeof filters)[number]
export type statusKey = Exclude<filterKey, 'All'>

export type TodoItem = {
  id: number
  text: string
  description: string
  date: number
  status: statusKey
}

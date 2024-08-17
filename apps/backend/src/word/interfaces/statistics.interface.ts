export interface Statistics {
  items: Chunk[]
  challengingCount: number
}

export interface Chunk {
  total: number
  page: number
  learnedCount: number
}

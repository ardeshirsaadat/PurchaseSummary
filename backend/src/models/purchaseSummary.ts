import { purchaseItem } from "./purchaseItemCreate"

export interface purchaseSummary {
  userId: string
  itemsPurchases:purchaseItem[]
  total: number
}
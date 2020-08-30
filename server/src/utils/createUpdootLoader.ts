import DataLoader from 'dataloader'
import { User } from '../entities/User'
import { Updoot } from '../entities/Updoot'

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any)

      const updootidsToUpdoot: Record<string, Updoot> = {}
      updoots.forEach((updoot) => {
        updootidsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot
      })

      return keys.map((key) => updootidsToUpdoot[`${key.userId}|${key.postId}`])
    }
  )

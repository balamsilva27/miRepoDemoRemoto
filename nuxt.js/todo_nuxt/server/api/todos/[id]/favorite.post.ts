import { toggleFavorite } from '../../../utils/todoStore'

export default defineEventHandler((event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const updated = toggleFavorite(id)
  if (!updated) {
    throw createError({ statusCode: 404, message: 'Todo not found' })
  }
  return updated
})
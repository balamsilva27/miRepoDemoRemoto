import { deleteTodo } from '../../utils/todoStore'

export default defineEventHandler((event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const deleted = deleteTodo(id)
  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Todo not found' })
  }
  return { success: true }
})
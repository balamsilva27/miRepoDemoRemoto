import { updateTodo } from '../../utils/todoStore'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody(event)
  const updated = updateTodo(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, message: 'Todo not found' })
  }
  return updated
})
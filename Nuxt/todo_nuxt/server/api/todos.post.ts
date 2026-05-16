import { addTodo } from '../utils/todoStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.title || typeof body.title !== 'string') {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }
  return addTodo(body.title.trim())
})
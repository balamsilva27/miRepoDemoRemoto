import { getTodos } from '../utils/todoStore'

export default defineEventHandler(() => {
  return getTodos()
})
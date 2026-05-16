interface Todo {
  id: number
  title: string
  completed: boolean
  favorite: boolean
  createdAt: string
}

let todos: Todo[] = [
  { id: 1, title: 'Learn Nuxt', completed: false, favorite: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Build a todo app', completed: false, favorite: false, createdAt: new Date().toISOString() }
]

let nextId = 3

export const getTodos = () => todos

export const addTodo = (title: string): Todo => {
  const todo: Todo = {
    id: nextId++,
    title,
    completed: false,
    favorite: false,
    createdAt: new Date().toISOString()
  }
  todos.push(todo)
  return todo
}

export const updateTodo = (id: number, updates: Partial<Todo>): Todo | null => {
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) return null
  todos[index] = { ...todos[index], ...updates }
  return todos[index]
}

export const deleteTodo = (id: number): boolean => {
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) return false
  todos.splice(index, 1)
  return true
}

export const toggleTodo = (id: number): Todo | null => {
  const todo = todos.find(t => t.id === id)
  if (!todo) return null
  todo.completed = !todo.completed
  return todo
}

export const toggleFavorite = (id: number): Todo | null => {
  const todo = todos.find(t => t.id === id)
  if (!todo) return null
  todo.favorite = !todo.favorite
  return todo
}
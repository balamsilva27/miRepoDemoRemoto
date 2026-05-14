interface Todo {
  id: number
  title: string
  completed: boolean
  favorite: boolean
  createdAt: string
}

export const useTodos = () => {
  const todos = useState<Todo[]>('todos', () => [])
  const isLoading = useState<boolean>('todos-loading', () => false)
  const error = useState<string | null>('todos-error', () => null)

  const fetchTodos = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error('Failed to fetch todos')
      todos.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  const addTodo = async (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      favorite: false,
      createdAt: new Date().toISOString()
    }
    todos.value.push(newTodo)
  }

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      Object.assign(todo, updates)
    }
  }

  const deleteTodo = async (id: number) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const toggleCompleted = async (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const toggleFavorite = async (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.favorite = !todo.favorite
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted,
    toggleFavorite
  }
}
<script setup lang="ts">
const { todos, isLoading, error, fetchTodos, addTodo, updateTodo, deleteTodo, toggleCompleted, toggleFavorite } = useTodos()

const newTodoTitle = ref('')
const editingId = ref<number | null>(null)
const editingTitle = ref('')
const filter = ref<'all' | 'pending' | 'completed' | 'favorites'>('all')

onMounted(() => {
  fetchTodos()
})

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return
  await addTodo(newTodoTitle.value)
  newTodoTitle.value = ''
}

const startEdit = (todo: { id: number; title: string }) => {
  editingId.value = todo.id
  editingTitle.value = todo.title
}

const saveEdit = async () => {
  if (editingId.value === null) return
  await updateTodo(editingId.value, { title: editingTitle.value })
  editingId.value = null
  editingTitle.value = ''
}

const cancelEdit = () => {
  editingId.value = null
  editingTitle.value = ''
}

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'pending':
      return todos.value.filter(t => !t.completed)
    case 'completed':
      return todos.value.filter(t => t.completed)
    case 'favorites':
      return todos.value.filter(t => t.favorite)
    default:
      return todos.value
  }
})
</script>

<template>
  <div class="container">
    <h1>Todo App</h1>

    <div class="add-todo">
      <input
        v-model="newTodoTitle"
        type="text"
        placeholder="New task..."
        @keyup.enter="handleAddTodo"
      />
      <button @click="handleAddTodo">Add</button>
    </div>

    <div class="filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
      <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">Pending</button>
      <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">Completed</button>
      <button :class="{ active: filter === 'favorites' }" @click="filter = 'favorites'">Favorites</button>
    </div>

    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="todo-list">
      <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item" :class="{ completed: todo.completed }">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleCompleted(todo.id)"
        />

        <template v-if="editingId === todo.id">
          <input v-model="editingTitle" type="text" @keyup.enter="saveEdit" @keyup.escape="cancelEdit" />
          <button @click="saveEdit">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </template>
        <template v-else>
          <span class="title" @dblclick="startEdit(todo)">{{ todo.title }}</span>
          <button
            class="favorite-btn"
            :class="{ active: todo.favorite }"
            @click="toggleFavorite(todo.id)"
          >
            {{ todo.favorite ? '★' : '☆' }}
          </button>
          <button class="edit-btn" @click="startEdit(todo)">Edit</button>
          <button class="delete-btn" @click="deleteTodo(todo.id)">Delete</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-todo button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-todo button:hover {
  background: #45a049;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filters button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: red;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: #999;
}

.todo-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.title {
  flex: 1;
  cursor: pointer;
}

.todo-item input[type="text"] {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ccc;
}

.favorite-btn.active {
  color: #ff9800;
}

.edit-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
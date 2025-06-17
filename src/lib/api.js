const BASE_URL = 'https://jsonplaceholder.typicode.com' 

// === Todos Methods ===
export const fetchTodos = async () => { // get all todos
  const res = await fetch(`${BASE_URL}/todos`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export const fetchTodoById = async (id) => { //fetch specific todo item
  const res = await fetch(`${BASE_URL}/todos/${id}`)
  if (!res.ok) throw new Error('Failed to fetch todo')
  return res.json()
}
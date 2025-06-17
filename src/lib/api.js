const BASE_URL = 'https://jsonplaceholder.typicode.com' 

// === Todos Methods ===
export const fetchTodos = async () => { // get all todos
  const res = await fetch(`${BASE_URL}/todos`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}


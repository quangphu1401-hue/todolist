'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const API_URL = 'http://localhost:3001/todos'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo.trim() }),
      })

      if (!response.ok) throw new Error('Failed to add todo')
      const todo = await response.json()
      setTodos([todo, ...todos])
      setNewTodo('')
      setError(null)
    } catch (err) {
      setError('Không thể thêm todo. Vui lòng thử lại.')
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
      setError(null)
    } catch (err) {
      setError('Không thể cập nhật todo. Vui lòng thử lại.')
      console.error('Error updating todo:', err)
    }
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(todos.filter(todo => todo.id !== id))
      setError(null)
    } catch (err) {
      setError('Không thể xóa todo. Vui lòng thử lại.')
      console.error('Error deleting todo:', err)
    }
  }

  return (
    <div className="container">
      <h1>📝 Todo List</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm công việc mới..."
          className="todo-input"
        />
        <button type="submit" className="todo-button">
          Thêm
        </button>
      </form>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">Chưa có công việc nào. Hãy thêm công việc mới!</div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="todo-checkbox"
              />
              <div className="todo-text">
                <div>{todo.title}</div>
                <div style={{ fontSize: 12, color: '#777', marginTop: 4 }}>
                  Thêm lúc: {formatDateTime(todo.createdAt)}
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  note?: string
  workTime?: string
  createdAt: string
  updatedAt: string
}

const API_URL = 'http://localhost:3001/todos'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newNote, setNewNote] = useState('')
  const [workDate, setWorkDate] = useState('')
  const [workTimeStart, setWorkTimeStart] = useState('')
  const [workTimeEnd, setWorkTimeEnd] = useState('')
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

  const formatWorkTime = () => {
    if (!workDate) return undefined
    
    let timeStr = ''
    if (workTimeStart && workTimeEnd) {
      timeStr = `${workTimeStart} - ${workTimeEnd}`
    } else if (workTimeStart) {
      timeStr = workTimeStart
    }
    
    if (timeStr) {
      // Format date: DD/MM/YYYY
      const date = new Date(workDate)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${timeStr} ngày ${day}/${month}/${year}`
    } else {
      // Chỉ có ngày
      const date = new Date(workDate)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `ngày ${day}/${month}/${year}`
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const workTimeFormatted = formatWorkTime()
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: newTodo.trim(),
          note: newNote.trim() || undefined,
          workTime: workTimeFormatted || undefined
        }),
      })

      if (!response.ok) throw new Error('Failed to add todo')
      const todo = await response.json()
      setTodos([todo, ...todos])
      setNewTodo('')
      setNewNote('')
      setWorkDate('')
      setWorkTimeStart('')
      setWorkTimeEnd('')
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Thêm công việc mới..."
            className="todo-input"
          />
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ghi chú (tùy chọn)..."
            className="todo-input"
            style={{ fontSize: '14px' }}
          />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="todo-input"
              style={{ fontSize: '14px', flex: '1 1 150px', minWidth: '150px' }}
            />
            <input
              type="time"
              value={workTimeStart}
              onChange={(e) => setWorkTimeStart(e.target.value)}
              className="todo-input"
              style={{ fontSize: '14px', flex: '0 0 100px', minWidth: '100px' }}
              placeholder="Từ giờ"
            />
            <span style={{ color: '#666' }}>đến</span>
            <input
              type="time"
              value={workTimeEnd}
              onChange={(e) => setWorkTimeEnd(e.target.value)}
              className="todo-input"
              style={{ fontSize: '14px', flex: '0 0 100px', minWidth: '100px' }}
              placeholder="Đến giờ"
            />
          </div>
        </div>
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
                {todo.workTime && (
                  <div style={{ fontSize: 13, color: '#e67e22', marginTop: 4, fontWeight: 500 }}>
                    ⏰ {todo.workTime}
                  </div>
                )}
                {todo.note && (
                  <div style={{ fontSize: 13, color: '#667eea', marginTop: 4, fontStyle: 'italic' }}>
                    📝 {todo.note}
                  </div>
                )}
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


import { useState, useEffect } from 'react'
import TodoItem from './TodoItem.jsx'
import { useAuth } from './context/AuthContext.jsx'

function TodoList({ apiUrl }) {
  const { username, accessToken, logout } = useAuth();
  const [todoList, setTodoList] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  async function fetchTodoList() {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodoList(data);
      }
    } catch (err) {
      setTodoList([]);
    }
  }

  useEffect(() => {
    fetchTodoList();
  }, [username]);

  async function toggleDone(id) {
    const toggle_api_url = `${apiUrl}${id}/toggle/`
    try {
      const response = await fetch(toggle_api_url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodoList(todoList.map(todo => todo.id === id ? updatedTodo : todo));
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function addNewTodo() {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 'title': newTitle }),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodoList([...todoList, newTodo]);
        setNewTitle("");
      }
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  }

  async function deleteTodo(id) {
    const delete_api_url = `${apiUrl}${id}/`
    try {
      const response = await fetch(delete_api_url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        setTodoList(todoList.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function addNewComment(todoId, newComment) {
    try {
      const url = `${apiUrl}${todoId}/comments/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 'message': newComment }),
      });
      if (response.ok) {
        await fetchTodoList();
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  }

  return (
    <>
      {username && (
        <div>
          <p>Welcome {username}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      <h1>Todo List</h1>
      <ul>
        {todoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            addNewComment={addNewComment}
          />
        ))}
      </ul>
      New: <input type="text" value={newTitle} onChange={(e) => { setNewTitle(e.target.value) }} />
      <button onClick={() => { addNewTodo() }}>Add</button>
    </>
  )
}

export default TodoList;

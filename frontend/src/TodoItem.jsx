import { useState, useEffect } from 'react'

function TodoItem({ todo, fetchTodoList, toggleDone, deleteTodo }) {
  const [newComment, setNewComment] = useState("");

  const TODOLIST_API_URL = 'http://localhost:5000/api/todos/';

  async function addNewComment(todoId) {
    try {
      const url = `${TODOLIST_API_URL}${todoId}/comments/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        await fetchTodoList();
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  }

  return (
    <li>
      <span className={todo.done ? "done" : ""}>{todo.title}</span>

      <button onClick={() => toggleDone(todo.id)}>Toggle</button>
      <button onClick={() => deleteTodo(todo.id)}>❌</button>

      {todo.comments?.length > 0 && (
        <>
          <b>Comments:</b>
          <ul>
            {todo.comments.map(comment => (
              <li key={comment.id}>{comment.message}</li>
            ))}
          </ul>
        </>
      )}

      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => addNewComment(todo.id)}>
          Add Comment
        </button>
      </div>
    </li>
  );
}

export default TodoItem;

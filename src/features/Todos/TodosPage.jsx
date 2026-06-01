// src/features/Todos/TodosPage.jsx
import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList.jsx";

// Destructuring the token prop passed down from App.jsx
function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  
  // New UI feedback states required by the assignment
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // 1. GET ROUTE: Fetch todos from database on mount or when token changes
  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError(""); // Clear old errors
      
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token, // Security token for authorization
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch tasks from server.');
        }

        const data = await response.json();
        // The API wraps our array inside a "tasks" property
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

  // 2. POST ROUTE: Add todo with Optimistic Update
  async function addTodo(todoTitle) {
    // Create a temporary local todo object to show the user immediately
    const temporaryTodo = {
      id: `temp-${Date.now()}`, // Temporary unique ID
      title: todoTitle,
      isCompleted: false,
    };

    // OPTIMISTIC UPDATE: Update UI instantly before server replies
    setTodoList((previous) => [temporaryTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) {
        throw new Error('Could not save todo to database.');
      }

      const savedTodo = await response.json();
      
      // SUCCESS: Swap out the temporary local todo with the permanent server todo (which has the real DB id)
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === temporaryTodo.id ? savedTodo : todo))
      );
    } catch (err) {
      setError(err.message);
      // ROLLBACK: Remove the temporary todo if the database write failed
      setTodoList((previous) => previous.filter((todo) => todo.id !== temporaryTodo.id));
    }
  }

  // 3. PATCH ROUTE: Complete todo with Rollback capability
  const completeTodo = async (id) => {
    // Find and save original todo in case we need to undo our changes
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    // OPTIMISTIC UPDATE: Assume success and flip checkbox instantly
    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) {
        throw new Error('Could not update task status on server.');
      }
    } catch (err) {
      setError(err.message);
      // ROLLBACK: Revert state back to the original database data
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  };

  // 4. PATCH ROUTE: Update/Edit existing todo title
  function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    // OPTIMISTIC UPDATE: Show edited text instantly
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
    );

    async function sendUpdate() {
      try {
        const response = await fetch(`/api/tasks/${editedTodo.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save edited title to server.');
        }
      } catch (err) {
        setError(err.message);
        // ROLLBACK: Revert back to original title if save fails
        setTodoList((previous) =>
          previous.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo))
        );
      }
    }

    sendUpdate();
  }

  return (
    <div>
      {/* Dynamic Error Section with Clear button */}
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <p>{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}

      {/* Loading indicator section */}
      {isTodoListLoading && <p style={{ color: 'blue' }}>Loading your items...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;
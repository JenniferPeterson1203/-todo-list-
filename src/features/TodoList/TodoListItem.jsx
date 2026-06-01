import React from 'react'
import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from '../../utils/todoValidation';

const TodoListItem = ({todo, onCompleteTodo, onUpdateTodo}) => {
  // Controls whether user is editing
const [isEditing, setIsEditing] = useState(false);

// Stores temporary edited title
const [workingTitle, setWorkingTitle] = useState(todo.title);


// Updates text while typing
function handleEdit(event) {
  setWorkingTitle(event.target.value);
}

// Cancels editing
function handleCancel() {
  setWorkingTitle(todo.title);
  setIsEditing(false);
}


function handleUpdate(event) {
  // Stop form refresh
  event.preventDefault();

  // Exit if not editing
  if (!isEditing) {
    return;
  }

  // Update todo
  onUpdateTodo({
    ...todo,
    title: workingTitle,
  });

  // Exit edit mode
  setIsEditing(false);
}

  return (
<li>

  {/* This ternary checks if we are editing */}
  <form onSubmit={handleUpdate}>

  {isEditing ? (
    
    // TRUE -> show edit input
    <>
      <TextInputWithLabel
        elementId={`todo-${todo.id}`}
        labelText="Edit Todo"
        value={workingTitle}
        
        // updates state while typing
        onChange={handleEdit}
        />

      <button
        type="button"
        
        // exits edit mode
        onClick={handleCancel}
        >
        Cancel
      </button>
      <button type="submit"
      disabled={!isValidTodoTitle(workingTitle)}
      >
  Update
</button>
    </>

) : (
  
  // FALSE -> show normal todo
  <>
      {/* checkbox */}
      
<label htmlFor="">

      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
        />
        </label>

      {/* clicking title enters edit mode */}
      <span onClick={() => setIsEditing(true)}>
        {todo.title}
      </span>
    </>
    
  )}

  </form>
</li>
  )
}

export default TodoListItem
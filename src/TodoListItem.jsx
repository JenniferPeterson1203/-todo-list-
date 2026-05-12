import React from 'react'


const TodoListItem = ({todo, onCompleteTodo}) => {

  return (
    <li>
      {/* This checkbox here will control if the todo was completed */}
      <input type="checkbox" 
      //checked = true if it is completed
      checked = {todo.isCompleted}

      //when clicked, mark todo completed
      onChange = {()=> onCompleteTodo(todo.id)}
      />
      {/* Here is where we are actually showing the todo */}
      {todo.title}
      </li>
  )
}

export default TodoListItem
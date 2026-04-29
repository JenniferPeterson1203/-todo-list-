import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';



function App() {
const [todoList, setTodoList] = useState([]); // start with an empty array so that user adds todos

function addTodo(todoTitle){
  // create a new to do object
  const newTodo = {
    id: Date.now(), // this is a nuilt in fx to get a unique id based on the timestamp
    title: todoTitle,
  }

  // update the state using the previous state safely
  setTodoList((previous)=> [newTodo,...previous])
}

  return (
    <div>

      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList}/>
 
    </div>
  )
}

export default App
import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';



function App() {
const [todoList, setTodoList] = useState([]); // start with an empty array so that user adds todos

function addTodo(todoTitle){
  // create a new to do object
  const newTodo = {
    id: Date.now(), // this is a built in fx to get a unique id based on the timestamp
    title: todoTitle,

    //every todo should start as NOT completed
    isCompleted: false
  }

  // update the state using the previous state safely
  setTodoList((previous)=> [newTodo,...previous])
}

const completeTodo =(id)=>{
  setTodoList((previous)=>
  previous.map((todo)=> {
    //if this is the todo that we clicked
    if(todo.id == id){
      return {
        ...todo, //copy the old todo
        isCompleted: true // mark the todo as complete
      }
    }
    return todo
  }))
}

  return (
    <div>

      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList}
      onCompleteTodo={completeTodo}/> {/* pass the function over to todolist as a prop */}
 
    </div>
  )
}

export default App
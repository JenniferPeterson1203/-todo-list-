import { useRef } from "react"

const TodoForm = ({onAddTodo}) => {
  // keeps refernce to the input so we focus on it later
  const inputRef = useRef();

  const handleAddTodo = (event)=>{
    event.preventDefault(); //this stops the page from refresh when the form is submitted

    //grab the value from the input field
    const todoTitle = event.target.todoTitle.value.trim();

    //only add if the input is NOT empty
    if (todoTitle){
      onAddTodo(todoTitle); //send the data to the parent component

      event.target.reset(); // this clears the text input field

      inputRef.current.focus(); // this keeps the cursor in the input
    }
  }



return (
  <form onSubmit={handleAddTodo}>
    <label htmlFor="todoTitle">Todo</label>

    <input
      ref={inputRef}
      type="text"
      id="todoTitle"
      name="todoTitle" // IMPORTANT: this here is what allows event.target.todoTitle
      placeholder="Todo text"
      required
    />

    <button type="submit">
      Add Todo
    </button>
  </form>
);
}

export default TodoForm
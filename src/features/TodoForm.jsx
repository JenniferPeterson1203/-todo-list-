import { useRef, useState } from "react"
import { isValidTodoTitle } from "../utils/todoValidation";
import TextInputWithLabel from "../shared/TextInputWithLabel";

const TodoForm = ({onAddTodo}) => {
  // keeps refernce to the input so we focus on it later
  const inputRef = useRef();

  //this stores what the user is typing
  const [workingTodoTitle, setWorkingTodoTitle] = useState("")


  const handleAddTodo = (event)=>{
    event.preventDefault(); //this stops the page from refresh when the form is submitted

    //grab the value from the input field
    const todoTitle = event.target.todoTitle.value.trim();

    //only add if the input is NOT empty
    if (todoTitle){
      onAddTodo(todoTitle); //send the data to the parent component

      // event.target.reset(); // this clears the text input field

      // inputRef.current.focus(); // this keeps the cursor in the input

      //we can now clear the input field by updating the state upon submission
      setWorkingTodoTitle("")
    }
  }



return (
  <form onSubmit={handleAddTodo}>
<TextInputWithLabel
  elementId="todoTitle"
  labelText="Todo"
  value={workingTodoTitle}
  onChange={(event) => setWorkingTodoTitle(event.target.value)}
  inputRef={inputRef}
/>

    <button type="submit"
    // disable if empty or only spaces 
    disabled={!isValidTodoTitle(workingTodoTitle)}
    >
      Add Todo
    </button>
  </form>
);
}

export default TodoForm
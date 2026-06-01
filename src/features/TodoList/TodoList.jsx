import TodoListItem from "./TodoListItem";

const TodoList = ({ todoList, onCompleteTodo, onUpdateTodo }) => {
  //Create a filtered version of todos
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);


  

  return (
    <>
      {/* If there are NO todos, show a message instead of an empty list */}

      {!filteredTodoList.length ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {/* Iterate through the todos array and list each item */}
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}

            />
          ))}
        </ul>
      )}
    </>
  );
};

export default TodoList;

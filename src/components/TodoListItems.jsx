import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function TodoListItem({ todo, onEdit, onDelete }) {
  return (
    <li className="md:p-4 p-2 border rounded shadow-sm hover:bg-gray-50  bg-white flex justify-between items-center transition">
      <Link to={`/todos/${todo.id}`} className="flex-1">
        <span className="text-sm font-medium">{todo.title}</span>
      </Link>

      <div className="flex flex-col md:flex-row md:gap-2 items-center">
        <span
          className={`text-xs px-2 py-1 rounded mx-2 ${
            todo.completed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {todo.completed ? "Completed" : "Incomplete"}
        </span>
        <Separator orientation="vertical" />

        <div className="flex flex-col md:flex-row md:gap-1">
          <Button variant="ghost" onClick={() => onEdit(todo)}>Edit</Button>

          <Button variant="destructive" onClick={() => onDelete(todo)}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export default TodoListItem;

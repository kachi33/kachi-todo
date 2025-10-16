import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList";
import TodoDetail from "./pages/TodoDetail";
import NotFound from "./pages/NotFound";


function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="todos/:id" element={<TodoDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

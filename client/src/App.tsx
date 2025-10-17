import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList";
import Lists from "./pages/Lists";
import TodoDetail from "./pages/TodoDetail";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="todos/:id" element={<TodoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

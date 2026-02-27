import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css'
import TodoList from './TodoList.jsx'
import LoginForm from './LoginForm.jsx'
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const TODOLIST_API_URL = 'http://localhost:5000/api/todos/';
  const LOGIN_URL = 'http://localhost:5000/api/login/';

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoList apiUrl={TODOLIST_API_URL} />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={<LoginForm loginUrl={LOGIN_URL} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

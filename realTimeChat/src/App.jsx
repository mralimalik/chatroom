import AuthForm from "./page/AuthForm/AuthForm";
import AllUsers from "./page/AllUsers/AllUsers";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
function App() {
  return (
    <Router>
      <AuthContextProvider>
        <ChatContextProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<AuthForm />} />
              <Route path="/users" element={<AllUsers />} />
            </Routes>
          </div>
        </ChatContextProvider>
      </AuthContextProvider>
    </Router>
  );
}

export default App;

import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, loading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) return <h2>Loading...</h2>;

  if (!user) {
    return showRegister ? (
      <Register setShowRegister={setShowRegister} />
    ) : (
      <Login setShowRegister={setShowRegister} />
    );
  }

  return <Dashboard />;
}

export default App;
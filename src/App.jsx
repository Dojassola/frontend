import { useState, useEffect } from "react";
import Login from "./pages/Login";
import VagasPublicas from "./pages/VagasPublicas";
import AdminPage from "./pages/AdminPage";
import FuncionarioPage from "./pages/FuncionarioPage";
import UserDashboard from "./pages/UserDashboard";
import UserAccountSettings from "./pages/UserAccountSettings";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("vagas");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setPage("vagas");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    setPage("login");
  };

  return (
    <div>
      <nav>
        <button onClick={() => setPage("vagas")}>Vagas Públicas</button>
        {isAuthenticated && (
          <>
            {userRole === "admin" && (
              <>
                <button onClick={() => setPage("admin")}>Admin</button>
                <button onClick={() => setPage("funcionario")}>
                  Funcionario
                </button>
                <button onClick={() => setPage("userdashboard")}>
                  Minha Conta
                </button>
                <button onClick={() => setPage("accountsettings")}>
                  Configurações
                </button>
              </>
            )}
            {userRole === "funcionario" && (
              <>
                <button onClick={() => setPage("funcionario")}>
                  Funcionario
                </button>
                <button onClick={() => setPage("userdashboard")}>
                  Minha Conta
                </button>
                <button onClick={() => setPage("accountsettings")}>
                  Configurações
                </button>
              </>
            )}
            {(userRole === "aluno" || userRole === "professor") && (
              <>
                <button onClick={() => setPage("userdashboard")}>
                  Minha Conta
                </button>
                <button onClick={() => setPage("accountsettings")}>
                  Configurações
                </button>
              </>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!isAuthenticated && (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </nav>
      {page === "login" && !isAuthenticated && <Login onLogin={handleLogin} />}
      {page === "vagas" && <VagasPublicas />}
      {isAuthenticated && userRole === "admin" && page === "admin" && (
        <AdminPage />
      )}
      {isAuthenticated &&
        (userRole === "admin" || userRole === "funcionario") &&
        page === "funcionario" && <FuncionarioPage />}
      {isAuthenticated &&
        (userRole === "admin" ||
          userRole === "funcionario" ||
          userRole === "aluno" ||
          userRole === "professor") &&
        page === "userdashboard" && <UserDashboard />}
      {isAuthenticated &&
        (userRole === "admin" ||
          userRole === "funcionario" ||
          userRole === "aluno" ||
          userRole === "professor") &&
        page === "accountsettings" && <UserAccountSettings />}
    </div>
  );
}

export default App;

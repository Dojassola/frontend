import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

function Login({ onLogin }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        cpf,
        senha,
      });
      const data = res.data;
      if (res.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        if (data.usuario && data.usuario.funcao) {
          localStorage.setItem("role", data.usuario.funcao);
          onLogin(data.usuario.funcao);
        } else {
          setError("Função do usuário não encontrada.");
        }
      } else {
        setError(data.mensagem || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.mensagem || "Network error");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Login;

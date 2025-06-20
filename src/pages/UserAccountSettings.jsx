import { useEffect, useState } from "react";
import axios from "axios";

const UserAccountSettings = () => {
  const [user, setUser] = useState({ nome: "", cpf: "", funcao: "" });
  const [form, setForm] = useState({ nome: "", senha: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/usuario", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setForm({ nome: res.data.nome, senha: "" });
        })
        .catch(() => setError("Erro ao carregar dados do usuário."));
    }
  }, [token]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `http://localhost:3000/usuario/${user.id}`,
        {
          nome: form.nome,
          senha: form.senha || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Informações atualizadas com sucesso!");
      setForm({ ...form, senha: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar informações");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    )
      return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:3000/usuario/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Conta excluída com sucesso!");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir conta");
    }
  };

  return (
    <div className="container">
      <h1>Configurações da Conta</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "limegreen" }}>{success}</div>}
      <form onSubmit={handleUpdate} style={{ marginBottom: 24 }}>
        <label>
          Nome:
          <br />
          <input
            name="nome"
            value={form.nome}
            onChange={handleInput}
            required
          />
        </label>
        <br />
        <label>
          CPF:
          <br />
          <input value={user.cpf} disabled />
        </label>
        <br />
        <label>
          Nova Senha:
          <br />
          <input
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleInput}
            placeholder="Deixe em branco para não alterar"
          />
        </label>
        <br />
        <button type="submit">Atualizar Informações</button>
      </form>
      <button
        onClick={handleDelete}
        style={{ background: "#c0392b", color: "#fff" }}
      >
        Excluir Conta
      </button>
    </div>
  );
};

export default UserAccountSettings;

import { useEffect, useState } from "react";
import { useCrudHandlers } from "../handlers/crudHandlers";
import axios from "axios";
import { API_BASE_URL } from "../api";

const UserAccountSettings = () => {
  const [user, setUser] = useState({ nome: "", cpf: "", funcao: "" });
  const [form, setForm] = useState({
    nome: "",
    senha: "",
    cpf: "",
    funcao: "",
  });
  const token = localStorage.getItem("token");
  const {
    error,
    setError,
    success,
    fieldErrors,
    handleUpdateUser,
    handleDeleteOwnAccount,
  } = useCrudHandlers(token);

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE_URL}/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setForm({
            nome: res.data.nome,
            senha: "",
            cpf: res.data.cpf,
            funcao: res.data.funcao,
          });
        })
        .catch(() => setError("Erro ao carregar dados do usuário."));
    }
  }, [token, setError]);

  const handleInput = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleUpdate = (e) => {
    e.preventDefault();
    handleUpdateUser(
      user.id,
      { ...form, funcao: user.funcao, senha: form.senha || undefined },
      () => setForm((f) => ({ ...f, senha: "" }))
    );
  };
  const handleDelete = () =>
    handleDeleteOwnAccount(user.id, () =>
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
      }, 1500)
    );

  return (
    <div className="container">
      <h1>Configurações da Conta</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {fieldErrors.length > 0 && (
        <div style={{ color: "red", marginBottom: 12 }}>
          <b>Erros no formulário:</b>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {fieldErrors.map((err, idx) => (
              <li key={idx}>
                {err.msg}{" "}
                {err.path ? (
                  <span style={{ fontStyle: "italic" }}>({err.path})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
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
          <input name="cpf" value={form.cpf} onChange={handleInput} required />
        </label>
        <br />
        <label>
          Função:
          <br />
          <input name="funcao" value={form.funcao} disabled />
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

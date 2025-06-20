import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const FuncionarioPage = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [tab, setTab] = useState("users");
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    senha: "",
    funcao: "aluno",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userVehicles, setUserVehicles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchVehicles();
      fetchRelatorios();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/usuario/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/veiculo/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
    } catch (err) {
      setVehicles([]);
    }
  };

  const fetchRelatorios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/relatorio/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRelatorios(res.data);
    } catch (err) {
      setRelatorios([]);
    }
  };

  const fetchUserVehicles = async (userId) => {
    if (!userId) return setUserVehicles([]);
    try {
      const res = await axios.get(`${API_BASE_URL}/veiculo/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserVehicles(
        res.data.filter(
          (v) => v.dono?.id === Number(userId) || v.dono_id === Number(userId)
        )
      );
    } catch {
      setUserVehicles([]);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_BASE_URL}/usuario`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuário cadastrado com sucesso!");
      setForm({ nome: "", cpf: "", senha: "", funcao: "aluno" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar usuário");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE_URL}/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuário deletado!");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao deletar usuário");
    }
  };

  const handleSaida = async (relatorioId) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(`${API_BASE_URL}/relatorio/saida/${relatorioId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Saída registrada com sucesso!");
      fetchRelatorios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar saída");
    }
  };

  const pendentes = relatorios.filter((r) => !r.saida);

  return (
    <div className="container">
      <h1>Dashboard do Funcionário</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("users")}>Usuários</button>
        <button onClick={() => setTab("vehicles")}>Veículos</button>
        <button onClick={() => setTab("relatorios")}>Relatórios</button>
        <button onClick={() => setTab("pendentes")}>Pendentes</button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "limegreen" }}>{success}</div>}
      {tab === "users" && (
        <div>
          <h2>Lista de Usuários</h2>
          <form onSubmit={handleRegister} style={{ marginBottom: 24 }}>
            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleInput}
              required
            />
            <input
              name="cpf"
              placeholder="CPF"
              value={form.cpf}
              onChange={handleInput}
              required
            />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={handleInput}
              required
            />
            <select
              name="funcao"
              value={form.funcao}
              onChange={handleInput}
              required
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>
            <button type="submit">Cadastrar</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Função</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.funcao}</td>
                  <td>{u.cpf}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "vehicles" && (
        <div>
          <h2>Lista de Veículos</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Dono ID</th>
                <th>Dono Nome</th>
                <th>Dono CPF</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.placa}</td>
                  <td>{v.modelo || "-"}</td>
                  <td>{v.dono?.id || v.dono_id || "-"}</td>
                  <td>{v.dono?.nome || "-"}</td>
                  <td>{v.dono?.cpf || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "relatorios" && (
        <div>
          <h2>Lista de Relatórios</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSuccess("");
              try {
                await axios.post(
                  `${API_BASE_URL}/relatorio/entrada`,
                  {
                    veiculo_id: form.veiculo_id,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                setSuccess("Relatório criado com sucesso!");
                setForm({ ...form, veiculo_id: "" });
                fetchRelatorios();
              } catch (err) {
                setError(
                  err.response?.data?.message || "Erro ao criar relatório"
                );
              }
            }}
            style={{ marginBottom: 24 }}
          >
            <div style={{ marginBottom: 12 }}>
              <b>Opção 1: Selecionar veículo diretamente</b>
              <br />
              <select
                name="veiculo_id"
                value={form.veiculo_id || ""}
                onChange={handleInput}
                style={{ marginRight: 8 }}
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Opção 2: Selecionar usuário e depois veículo</b>
              <br />
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  fetchUserVehicles(e.target.value);
                  setForm({ ...form, veiculo_id: "" });
                }}
                style={{ marginRight: 8 }}
              >
                <option value="">Selecione um usuário</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.cpf})
                  </option>
                ))}
              </select>
              <select
                name="veiculo_id"
                value={form.veiculo_id || ""}
                onChange={handleInput}
                disabled={!selectedUserId || userVehicles.length === 0}
              >
                <option value="">Selecione um veículo do usuário</option>
                {userVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.modelo}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Criar Relatório de Entrada</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Veículo</th>
                <th>Entrada</th>
                <th>Saída</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.veiculo?.placa || "-"} </td>
                  <td>{r.entrada}</td>
                  <td>{r.saida || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "pendentes" && (
        <div>
          <h2>Relatórios Pendentes (Sem Saída)</h2>
          <ul>
            {pendentes.length === 0 ? (
              <li>Nenhum relatório pendente.</li>
            ) : (
              pendentes.map((r) => (
                <li key={r.id}>
                  Relatório #{r.id} - Veículo: {r.veiculo?.placa || "-"} -
                  Entrada: {r.entrada}
                  <button
                    style={{ marginLeft: 12 }}
                    onClick={() => handleSaida(r.id)}
                  >
                    Registrar Saída
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FuncionarioPage;

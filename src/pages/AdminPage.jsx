import { useEffect, useState } from "react";
import { useCrudHandlers } from "../handlers/crudHandlers.js";
import {
  fetchUsers,
  fetchVehicles,
  fetchRelatorios,
  fetchUserVehicles,
} from "../handlers/fetchers.js";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [tab, setTab] = useState("users");
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    senha: "",
    funcao: "aluno",
    veiculo_id: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userVehicles, setUserVehicles] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({ placa: "", dono_id: "" });
  const token = localStorage.getItem("token");

  const {
    error,
    setError,
    success,
    setSuccess,
    fieldErrors,
    setFieldErrors,
    handleRegisterUser,
    handleDeleteUser,
    handleCreateVehicle,
    handleDeleteVehicle,
    handleCreateRelatorio,
    handleDeleteRelatorio,
    handleSaida,
    handleUpdateUser,
  } = useCrudHandlers(token, {
    fetchUsers: () => fetchUsers(token, setUsers),
    fetchVehicles: () => fetchVehicles(token, setVehicles),
    fetchRelatorios: () => fetchRelatorios(token, setRelatorios),
  });

  useEffect(() => {
    if (token) {
      fetchUsers(token, setUsers);
      fetchVehicles(token, setVehicles);
      fetchRelatorios(token, setRelatorios);
    }
  }, []);

  const handleFetchUserVehicles = (userId) => {
    fetchUserVehicles(token, userId, setUserVehicles);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVehicleInput = (e) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  const pendentes = relatorios.filter((r) => !r.saida);

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("users")}>Usuários</button>
        <button onClick={() => setTab("vehicles")}>Veículos</button>
        <button onClick={() => setTab("relatorios")}>Relatórios</button>
        <button onClick={() => setTab("pendentes")}>Pendentes</button>
      </div>
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
      {success && (
        <div style={{ color: "#27ae60", marginBottom: 12 }}>{success}</div>
      )}
      {tab === "users" && (
        <div>
          <h2>Lista de Usuários</h2>
          {/* User Edit Section */}
          <UserEditSection users={users} handleUpdateUser={handleUpdateUser} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegisterUser(form, () =>
                setForm({
                  nome: "",
                  cpf: "",
                  senha: "",
                  funcao: "aluno",
                  veiculo_id: "",
                })
              );
            }}
            style={{ marginBottom: 24 }}
          >
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
              <option value="funcionario">Funcionário</option>
              <option value="admin">Administrador</option>
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
                    <button onClick={() => handleDeleteUser(u.id)}>
                      Deletar
                    </button>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateVehicle(vehicleForm, () =>
                setVehicleForm({ placa: "", dono_id: "" })
              );
            }}
            style={{ marginBottom: 24 }}
          >
            <input
              name="placa"
              placeholder="Placa"
              value={vehicleForm.placa}
              onChange={handleVehicleInput}
              required
            />
            <select
              name="dono_id"
              value={vehicleForm.dono_id}
              onChange={handleVehicleInput}
              required
            >
              <option value="">Selecione o dono</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.cpf})
                </option>
              ))}
            </select>
            <button type="submit">Cadastrar Veículo</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Dono ID</th>
                <th>Dono Nome</th>
                <th>Dono CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.placa}</td>
                  <td>{v.dono?.id || v.dono_id || "-"}</td>
                  <td>{v.dono?.nome || "-"}</td>
                  <td>{v.dono?.cpf || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      style={{ background: "#c0392b", color: "#fff" }}
                    >
                      Deletar
                    </button>
                  </td>
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
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRelatorio({ veiculo_id: form.veiculo_id }, () =>
                setForm({ ...form, veiculo_id: "" })
              );
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
                    {v.placa}
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
                  handleFetchUserVehicles(e.target.value);
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
                    {v.placa}
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.veiculo?.placa || "-"} </td>
                  <td>{r.entrada}</td>
                  <td>{r.saida || "-"}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (!r.saida) {
                          alert(
                            "Não é permitido deletar um relatório sem saída registrada. Por favor, registre a saída antes de deletar."
                          );
                          return;
                        }
                        handleDeleteRelatorio(r.id);
                      }}
                      style={{ background: "#c0392b", color: "#fff" }}
                    >
                      Deletar
                    </button>
                  </td>
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
                    onClick={() => handleSaida(r.veiculo?.id || r.veiculo_id)}
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

function UserEditSection({ users, handleUpdateUser }) {
  const [selectedId, setSelectedId] = useState("");
  const [editForm, setEditForm] = useState({
    nome: "",
    cpf: "",
    funcao: "aluno",
    senha: "",
  });
  useEffect(() => {
    if (selectedId) {
      const user = users.find((u) => u.id == selectedId);
      if (user)
        setEditForm({
          nome: user.nome,
          cpf: user.cpf,
          funcao: user.funcao,
          senha: "",
        });
    }
  }, [selectedId, users]);
  const handleInput = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  return (
    <div
      style={{
        marginBottom: 24,
        border: "1px solid #444",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h3>Editar Usuário</h3>
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Selecione um usuário</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nome} ({u.cpf})
          </option>
        ))}
      </select>
      {selectedId && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser(selectedId, editForm, () =>
              setEditForm({ ...editForm, senha: "" })
            );
          }}
          style={{ marginTop: 12 }}
        >
          <input
            name="nome"
            value={editForm.nome}
            onChange={handleInput}
            placeholder="Nome"
            required
          />
          <input
            name="cpf"
            value={editForm.cpf}
            onChange={handleInput}
            placeholder="CPF"
            required
          />
          <select
            name="funcao"
            value={editForm.funcao}
            onChange={handleInput}
            required
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>
          <input
            name="senha"
            value={editForm.senha}
            onChange={handleInput}
            placeholder="Nova senha (opcional)"
            type="password"
          />
          <button type="submit">Salvar Alterações</button>
        </form>
      )}
    </div>
  );
}

export default AdminPage;

import { useEffect, useState } from "react";
import { useCrudHandlers } from "../handlers/crudHandlers.js";
import {
  fetchUsers,
  fetchVehicles,
  fetchRelatorios,
  fetchUserVehicles,
} from "../handlers/fetchers.js";

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
    veiculo_id: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userVehicles, setUserVehicles] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({ placa: "", dono_id: "" });
  const [selectedDonoId, setSelectedDonoId] = useState("");
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

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVehicleInput = (e) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  const handleFetchUserVehicles = (userId) => {
    fetchUserVehicles(token, userId, setUserVehicles);
  };

  const handleDonoSelect = (e) => {
    setSelectedDonoId(e.target.value);
    setVehicleForm({ ...vehicleForm, dono_id: e.target.value });
  };

  const pendentes = relatorios.filter((r) => !r.saida);

  return (
    <div className="container">
      <h1>Dashboard do Funcionário</h1>
      <div className="tab-buttons">
        <button onClick={() => setTab("users")}>Usuários</button>
        <button onClick={() => setTab("vehicles")}>Veículos</button>
        <button onClick={() => setTab("relatorios")}>Relatórios</button>
        <button onClick={() => setTab("pendentes")}>Pendentes</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {fieldErrors.length > 0 && (
        <div className="field-errors">
          <b>Erros no formulário:</b>
          <ul>
            {fieldErrors.map((err, idx) => (
              <li key={idx}>
                {err.msg}{" "}
                {err.path ? (
                  <span className="error-path">({err.path})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {success && <div className="success-message">{success}</div>}
      {tab === "users" && (
        <div>
          <h2>Lista de Usuários</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegisterUser(form, () =>
                setForm({ nome: "", cpf: "", senha: "", funcao: "aluno" })
              );
            }}
            className="form"
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
            </select>
            <button type="submit">Cadastrar</button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Função</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.funcao}</td>
                  <td>{u.cpf}</td>
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
              const formToSend = {
                ...vehicleForm,
                dono_id: selectedDonoId ? Number(selectedDonoId) : "",
              };
              handleCreateVehicle(formToSend, () =>
                setVehicleForm({ placa: "", dono_id: "" })
              );
            }}
            className="form"
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
              value={selectedDonoId}
              onChange={handleDonoSelect}
              required
            >
              <option value="">Selecione o dono</option>
              {users.map((dono) => (
                <option key={dono.id} value={dono.id}>
                  {dono.nome} ({dono.cpf})
                </option>
              ))}
            </select>
            <button type="submit">Cadastrar Veículo</button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
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
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRelatorio({ veiculo_id: form.veiculo_id }, () =>
                setForm({ ...form, veiculo_id: "" })
              );
            }}
            className="form"
          >
            <div className="form-section">
              <b>Opção 1: Selecionar veículo diretamente</b>
              <br />
              <select
                name="veiculo_id"
                value={form.veiculo_id || ""}
                onChange={handleInput}
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-section">
              <b>Opção 2: Selecionar usuário e depois veículo</b>
              <br />
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  handleFetchUserVehicles(e.target.value);
                  setForm({ ...form, veiculo_id: "" });
                }}
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
          <table className="table">
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
                      className="delete-button"
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
                    className="register-button"
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

export default FuncionarioPage;

import { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [tab, setTab] = useState("users");
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
      const res = await axios.get("http://localhost:3000/usuario/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/veiculo/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
    } catch (err) {
      setVehicles([]);
    }
  };

  const fetchRelatorios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/relatorio/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRelatorios(res.data);
    } catch (err) {
      setRelatorios([]);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("users")}>Usuários</button>
        <button onClick={() => setTab("vehicles")}>Veículos</button>
        <button onClick={() => setTab("relatorios")}>Relatórios</button>
      </div>
      {tab === "users" && (
        <div>
          <h2>Lista de Usuários</h2>
          <table>
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
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Usuário ID</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td>{v.usuarioId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "relatorios" && (
        <div>
          <h2>Lista de Relatórios</h2>
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
                  <td>{r.veiculoId}</td>
                  <td>{r.entrada}</td>
                  <td>{r.saida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

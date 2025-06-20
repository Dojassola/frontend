import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const UserDashboard = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE_URL}/veiculo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((vehRes) => {
          setVehicles(vehRes.data);
        })
        .catch(() => setVehicles([]));
      axios
        .get(`${API_BASE_URL}/relatorio`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((relRes) => {
          setRelatorios(relRes.data);
        })
        .catch(() => setRelatorios([]))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div className="container">
      <h1>Minha Conta</h1>
      {loading && <div>Carregando...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        <>
          <h2>Meus Veículos</h2>
          {vehicles.length === 0 ? (
            <p>Nenhum veículo cadastrado.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.placa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h2 style={{ marginTop: 32 }}>Meus Relatórios</h2>
          {relatorios.length === 0 ? (
            <p>Nenhum relatório encontrado.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placa do Veículo</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                </tr>
              </thead>
              <tbody>
                {relatorios.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.veiculo?.placa || "-"}</td>
                    <td>{r.entrada}</td>
                    <td>{r.saida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;

import { useEffect, useState } from 'react';
import axios from 'axios';

function VagasPublicas() {
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get('http://localhost:3000/estacionamento')
      .then(res => {
        setEstacionamentos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar estacionamentos.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Bem-vindo ao Sistema de Estacionamento</h1>
      <h2 style={{ textAlign: 'center' }}>Vagas Públicas</h2>
      {loading && <div style={{ textAlign: 'center' }}>Carregando...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vagas Totais</th>
              <th>Vagas Ocupadas</th>
              <th>Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {estacionamentos.map(estacionamento => (
              <tr key={estacionamento.id}>
                <td>{estacionamento.id}</td>
                <td>{estacionamento.vagas}</td>
                <td>{estacionamento.vagas_ocupadas}</td>
                <td>{estacionamento.vagas - estacionamento.vagas_ocupadas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ textAlign: 'center', marginTop: 32, color: '#f7c873' }}>
        <p>Faça login para acessar funcionalidades exclusivas!</p>
      </div>
    </div>
  );
}
export default VagasPublicas;

import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export function useCrudHandlers(token, fetchers = {}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  const handleRegisterUser = async (form, after) => {
    setError("");
    setSuccess("");
    setFieldErrors([]);
    try {
      await axios.post(`${API_BASE_URL}/usuario`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuário cadastrado com sucesso!");
      if (after) after();
      if (fetchers.fetchUsers) fetchers.fetchUsers();
    } catch (err) {
      if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
      else setError(err.response?.data?.message || "Erro ao cadastrar usuário");
    }
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE_URL}/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Usuário deletado!");
      if (fetchers.fetchUsers) fetchers.fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao deletar usuário");
    }
  };

  const handleUpdateUser = async (userId, form, after) => {
    setError("");
    setSuccess("");
    setFieldErrors([]);
    try {
      await axios.put(`${API_BASE_URL}/usuario/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Informações atualizadas com sucesso!");
      if (after) after();
      if (fetchers.fetchUsers) fetchers.fetchUsers();
    } catch (err) {
      if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
      else
        setError(
          err.response?.data?.message || "Erro ao atualizar informações"
        );
    }
  };

  const handleDeleteOwnAccount = async (userId, after) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    )
      return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE_URL}/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Conta excluída com sucesso!");
      if (after) after();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir conta");
    }
  };

  const handleCreateVehicle = async (vehicleForm, after) => {
    setError("");
    setSuccess("");
    setFieldErrors([]);
    try {
      if (vehicleForm.dono_id) {
        await axios.post(
          `${API_BASE_URL}/veiculo/${vehicleForm.dono_id}`,
          { placa: vehicleForm.placa },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/veiculo`, vehicleForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccess("Veículo cadastrado com sucesso!");
      if (after) after();
      if (fetchers.fetchVehicles) fetchers.fetchVehicles();
    } catch (err) {
      if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
      else setError(err.response?.data?.message || "Erro ao cadastrar veículo");
    }
  };
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este veículo?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE_URL}/veiculo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Veículo deletado!");
      if (fetchers.fetchVehicles) fetchers.fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao deletar veículo");
    }
  };

  const handleCreateRelatorio = async (relatorioForm, after) => {
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_BASE_URL}/relatorio/entrada`, relatorioForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Relatório criado com sucesso!");
      if (after) after();
      if (fetchers.fetchRelatorios) fetchers.fetchRelatorios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar relatório");
    }
  };
  const handleDeleteRelatorio = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este relatório?"))
      return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_BASE_URL}/relatorio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Relatório deletado!");
      if (fetchers.fetchRelatorios) fetchers.fetchRelatorios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao deletar relatório");
    }
  };
  const handleSaida = async (relatorioId) => {
    if (!window.confirm("Registrar saída para este relatório?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `${API_BASE_URL}/relatorio/saida/${relatorioId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Saída registrada com sucesso!");
      if (fetchers.fetchRelatorios) fetchers.fetchRelatorios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar saída");
    }
  };

  return {
    error,
    setError,
    success,
    setSuccess,
    fieldErrors,
    setFieldErrors,
    handleRegisterUser,
    handleDeleteUser,
    handleUpdateUser,
    handleDeleteOwnAccount,
    handleCreateVehicle,
    handleDeleteVehicle,
    handleCreateRelatorio,
    handleDeleteRelatorio,
    handleSaida,
  };
}

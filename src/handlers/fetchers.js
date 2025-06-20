import axios from "axios";
import { API_BASE_URL } from "../api";

export const fetchUsers = async (token, setUsers) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/usuario/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  } catch (err) {
    setUsers([]);
  }
};

export const fetchVehicles = async (token, setVehicles) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/veiculo/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVehicles(res.data);
  } catch (err) {
    setVehicles([]);
  }
};

export const fetchRelatorios = async (token, setRelatorios) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/relatorio/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRelatorios(res.data);
  } catch (err) {
    setRelatorios([]);
  }
};

export const fetchUserVehicles = async (token, userId, setUserVehicles) => {
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

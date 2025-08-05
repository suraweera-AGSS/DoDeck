import axios from 'axios';

// const API = 'http://localhost:5000/api/tasks'; // Static base URL(In development)
const API = `${import.meta.env.VITE_API_BASE_URL}/api/tasks`;  // Dynamic base URL (In production)

export const getTasks = (token) =>
    axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const createTask = (data, token) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const updateTask = (id, data, token) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteTask = (id, token) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

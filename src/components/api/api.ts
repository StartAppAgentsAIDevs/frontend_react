import axios from 'axios';

// Экземпляр axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

export { api };
import axios from "axios";

const URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

export const api = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
});
import axios from "axios"

const api = axios.create({
    baseURL: "https://chatter-gp0v.onrender.com/api",
    withCredentials: true
})

export default api
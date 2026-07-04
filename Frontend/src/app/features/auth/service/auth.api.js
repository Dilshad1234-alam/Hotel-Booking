import axios from 'axios'

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})


export async function register({ fullname, email, password, contact, address, role }) {

    const response = await authApiInstance.post("/register", {
        fullname,
        email,
        password,
        contact,
        address,
        role
    })
    return response.data
}

export async function login({ email, password }) {
    
    const response = await authApiInstance.post("/login", {
        email,
        password
    })
    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")
    return response.data
}

export async function logout() {
    const response = await authApiInstance.get("/logout")
    return response.data
}
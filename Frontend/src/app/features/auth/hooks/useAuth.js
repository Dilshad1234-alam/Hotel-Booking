import { useDispatch } from "react-redux"
import { setUser, setError, setLoading } from "../state/auth.slice"
import { login, register, getMe, logout } from '../service/auth.api'


export const useAuth = () => {
    
    const dispatch = useDispatch()

    async function handleRegister({ fullname, email, password, contact, address, role }) {
        
        const data = await register({ fullname, email, password, contact, address, role })

        dispatch(setUser(data.user))

        return data.user
    }

    async function handleLogin({ email, password }) {
        
        const data = await login({ email, password })

        dispatch(setUser(data.user))

        return data.user
    }

    async function handleGetMe() {
      try {
        dispatch(setLoading(true));

        const data = await getMe();
        dispatch(setUser(data.user));

        return data.user;
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    }

    async function handleLogout() {
      try {
        dispatch(setLoading(true))
        await logout()
        dispatch(setUser(null))
      } finally {
        dispatch(setLoading(false))
      }
    }


    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    }
}
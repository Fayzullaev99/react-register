import axios from '../api/axios'
import useAuth from './useAuth'

function useLogOut() {
    const {setAuth} = useAuth()
    const logout = async ()=>{
        setAuth({})
        try {
            const response = await axios('/logout',{
                withCredentials:true
            })
        } catch (err) {
            console.log(err);
        }
    }
  return logout
}

export default useLogOut
import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/config"
import { useDispatch, useSelector } from "react-redux"
import { setAuthLoading, setUserData } from "../redux/userSlice"
import axiosInstance from "../api/axiosInstance"

const useCurrentUser= () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
    
    useEffect(()=>{

        const fetchUser = async() =>{
            try {

                const token = localStorage.getItem('token');
                    if (!token) {
                    dispatch(setUserData(null));
                    dispatch(setAuthLoading(false));
                    return;
                    }

                dispatch(setAuthLoading(true))
                const result = await axiosInstance.get('/api/user/current')

                dispatch(setUserData(result.data));
            } catch (error) {
                console.log(error);
                localStorage.removeItem('token');
                dispatch(setUserData(null));
            } finally{
                dispatch(setAuthLoading(false))
            }
        }
        fetchUser()
    },[])
}

export default useCurrentUser
import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/config"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice"
import axiosInstance from "../api/axiosInstance"

const useOtherUsers= () => {
    const dispatch = useDispatch();
    const {userData}= useSelector(state=> state.user);
    useEffect(()=>{
        const fetchUser = async() =>{
            try {

                const token = localStorage.getItem('token');
                    if (!token) {
                    dispatch(setUserData(null));
                    dispatch(setAuthLoading(false));
                    return;
                }

                const result = await axiosInstance.get('/api/user/others')

                dispatch(setOtherUsers(result.data));
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
    },[userData])
}

export default useOtherUsers
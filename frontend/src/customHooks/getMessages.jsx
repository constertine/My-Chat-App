import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/config"
import { useDispatch, useSelector } from "react-redux"
import { setMessages, setMessagesLoading } from "../redux/messageSlice"
import axiosInstance from "../api/axiosInstance"

const getMessage= () => {
    const dispatch = useDispatch();
    const {userData, selectedUser}= useSelector(state=> state.user);
    useEffect(()=>{
        const fetchMessages = async() =>{
            try {
                const token = localStorage.getItem('token');
                    if (!token) {
                    dispatch(setUserData(null));
                    dispatch(setAuthLoading(false));
                    return;
                    }

                dispatch(setMessagesLoading(true));
                const result = await axiosInstance.get(`/api/message/get/${selectedUser._id}`)

                dispatch(setMessages(result.data));
            } catch (error) {
                console.log("nigesh");
                console.log(error);
            } finally{
                dispatch(setMessagesLoading(false)); 
            }
        }
        fetchMessages()
    },[selectedUser])
}

export default getMessage
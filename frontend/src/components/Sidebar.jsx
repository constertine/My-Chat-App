import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg"
import { LuUserSearch } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Sidebar(){
    const {userData,otherUsers,onlineUsers,searchData} = useSelector(state => state.user);
    const [search,setSearch] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {selectedUser} = useSelector(state => state.user);
    const [input , setInput] = useState("");

    const handleLogout = async() => {
        try {
            let result = await axiosInstance.get('/api/auth/logout')

            localStorage.removeItem('token');
            dispatch(setUserData(null));
            dispatch(setOtherUsers(null));
            navigate("/login");
        } catch (error) {
            localStorage.removeItem('token');
            console.log(error);
        }
    }

    const handleSearch = async() => {
        try {
            let result = await axiosInstance.get(`/api/user/search?query=${input}`)

            dispatch(setSearchData(result.data));
            
        } catch (error) {
            console.log(error);
        }
    }

    const crossHandler = () => {
        setInput("");
        setSearch(false)
    }

    const searchHandler = (user) => {
        dispatch(setSelectedUser(user));
        setSearch(false);
        setInput("");
    };


    useEffect(() => {
        if(input){
         handleSearch();
        }
    },[input])

   
    return (
        <div className={`relative overflow-hidden lg:w-[35%] w-full h-full bg-slate-200 lg:block ${!selectedUser ? "block" : "hidden"}`}>

            <div onClick={handleLogout} className="z-[200] bg-[#20c7ff] w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg mt-[10px] cursor-pointer fixed bottom-[20px] left-[10px]">
                <CiLogout className="absolute w-[40px] h-[40px]" />
            </div>
            
            {search && input.length > 0 && 
                 <div className="z-[150] bg-white absolute flex top-[235px] w-[80%] max-h-[300px] overflow-y-auto 
                           flex-col gap-[10px] rounded-xl shadow-xl p-[10px]" >
                                {
                                    searchData?.map((user) => (
                                    <div onClick={() => searchHandler(user)} className="w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-gray-500 shadow-lg rounded-full cursor-pointer hover:bg-[#b2ccdf]">
                                        <div className="relative rounded-full shadow-gray-500 bg-white shadow-lg">
                                            <div className="bg-white w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                                                <img src={user.image || dp} className="h-[100%]" />
                                            </div>
                                            {onlineUsers?.includes(user._id) &&
                                            <span className="w-[13px] h-[13px] rounded-full bg-green-400 absolute bottom-[6px] right-[-1px] shadow-gray-400 shadow-sm"></span>}
                                        </div>

                                            <h1 className="text-gray-800 text-[20px] font-semibold">{user.name || user.userName}</h1>
                                    </div>
                                    ))
                                }
                           </div> 
            }
           

            <div className="w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]">

                <h1 className="text-white font-bold text-[30px]">
                    Chit-Chat
                </h1>

                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-bold text-[25px]">Heyy , {userData.name || "User"}</h1>
                    <div onClick={() => navigate("/profile")} className="bg-white cursor-pointer w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg">
                       <img src={userData.image || dp} className="h-[100%]" />
                    </div>
                </div>

                <div className="w-full flex items-center gap-[20px] overflow-y-auto py-[15px]">

                    {!search && <div onClick={() => setSearch(true)} className="bg-white w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg mt-[10px] cursor-pointer">
                        <LuUserSearch className="w-[40px] h-[40px]" />
                    </div>
                    }

                    {search && 
                        <form className="relative w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px]">
                           <LuUserSearch className="w-[30px] h-[30px]" />
                           <input onChange={(e) => setInput(e.target.value)} value={input} className="outline-none w-full h-full p-[10px] outline-0 border-0 text-[17px]" type="text" placeholder="Search Users..." />
                           <RxCross2 onClick={crossHandler} className="w-[30px] h-[30px] cursor-pointer"/>

                           

                        </form>

                    }
                    {!search &&  otherUsers?.length > 0 && otherUsers.map((user) => (
                        onlineUsers?.includes(user._id) &&
                        <div onClick={() => dispatch(setSelectedUser(user))}  className="cursor-pointer relative rounded-full shadow-gray-500 bg-white shadow-lg mt-[10px]">
                            <div className="bg-white w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                                <img src={user.image || dp} className="h-[100%]" />
                            </div>
                            <span className="w-[13px] h-[13px] rounded-full bg-green-400 absolute bottom-[6px] right-[-1px] shadow-gray-400 shadow-sm"></span>
                        </div>
                    )) }
                    
                    
                </div>

            </div>
            
            <div className="w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
                
                {otherUsers?.length > 0 && 
                    otherUsers.map((user) => (
                        <div onClick={() => dispatch(setSelectedUser(user))} className="w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-gray-500 shadow-lg rounded-full cursor-pointer hover:bg-[#b2ccdf]">
                        <div className="relative rounded-full shadow-gray-500 bg-white shadow-lg">
                            <div className="bg-white w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                                <img src={user.image || dp} className="h-[100%]" />
                            </div>
                            {onlineUsers?.includes(user._id) &&
                            <span className="w-[13px] h-[13px] rounded-full bg-green-400 absolute bottom-[6px] right-[-1px] shadow-gray-400 shadow-sm"></span>}
                        </div>

                            <h1 className="text-gray-800 text-[20px] font-semibold">{user.name || user.userName}</h1>
                        </div>
                    
                    ))
                }

            </div>
            
            
        </div>
    )
}

export default Sidebar;
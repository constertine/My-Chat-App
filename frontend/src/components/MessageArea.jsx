import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import { RiEmojiStickerLine } from "react-icons/ri";
import { setSelectedUser } from "../redux/userSlice";
import { FaImages } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { addMessage, setMessages } from "../redux/messageSlice";
import { getSocket } from "../socket/socket";
import axiosInstance from "../api/axiosInstance";


function MessageArea(){
   
    const {selectedUser,userData,onlineUsers} = useSelector(state => state.user);
    const {messages , messagesLoading}= useSelector(state => state.message); 
    const dispatch = useDispatch();
    const [showPicker , setShowPicker] = useState(false);
    const [input,setInput] = useState("");
    const emojiRef = useRef(null);
    const [frontendImage ,setFrontendImage] = useState(null);
    const [backendImage , setBackendImage] = useState(null);
    const image = useRef(null);

    const handleImage = (e) => {
        let file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file))
    }
    
    const handleSendMessage= async(e) => {
        e.preventDefault();
        if(input.length == 0 && backendImage == null){
            return;
        }
        try {
          let formData  = new FormData();
          formData.append("message", input);

          if(backendImage){
            formData.append("image", backendImage) 
          }
          let result = await axiosInstance.post(`/api/message/send/${selectedUser._id}`,formData
           
          )

          dispatch(addMessage(result.data));


        //   console.log(result);
          setInput("");
          setFrontendImage(null);
          setBackendImage(null);
        }catch(error){
            console.log(error);
        }
        
    }

    const onEmojiClick = (emojiData) => {
        setInput(prevInput => prevInput+emojiData.emoji)
    }

    const handleNewMessage = (mess) => {
        if (mess.sender !== userData._id) {
            dispatch(addMessage(mess));
        }
    };

        
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (mess) => {
            dispatch(addMessage(mess));
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [selectedUser]); 


    
    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
            setShowPicker(false);
            }
        }

        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
}, [showPicker]);

    
    return(
        <div className={`lg:w-[70%] ${selectedUser ? "flex" :"hidden"} lg:block w-full h-full bg-slate-200 border-l-2 border-gray-300`}>
           
           {selectedUser && 
           <div className="relative w-full h-[100vh] flex flex-col">
           <div className="gap-[20px] w-full h-[100px] bg-[rgb(32,199,255)] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px]">
                <div onClick={() => dispatch(setSelectedUser(null))} className="cursor-pointer">
                    <FaArrowLeftLong className="w-[35px] h-[35px] text-gray-600" />
                </div>

            <div className="relative rounded-full shadow-gray-500 bg-white shadow-lg">
                <div className="bg-white w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                    <img src={selectedUser.image || dp} className="h-[100%]" />
                 </div>
                    {onlineUsers?.includes(selectedUser._id) &&
                    <span className="w-[13px] h-[13px] rounded-full bg-green-400 absolute bottom-[6px] right-[-1px] shadow-gray-400 shadow-sm"></span>}
            </div>

                <h1 className="text-gray-900 font-semibold text-[27px]">
                    {selectedUser?.name || selectedUser?.userName || "User"}
                </h1>
            </div>

           <div className="px-[20px] w-full h-[75%] flex flex-col py-[30px] overflow-auto gap-[20px]">
            {showPicker && 
                <div ref={emojiRef} className="absolute bottom-[110px] left-[20px]"><EmojiPicker onEmojiClick={onEmojiClick} height={350} width={250} className="z-[100] shadow-lg" /></div>
            }
            

            {messagesLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : ( messages &&
                messages?.map((mess) => (
                    mess.sender == userData._id ? 
                    <SenderMessage image={mess.image} message={mess.message} />
                    :
                    <ReceiverMessage image={mess.image} message={mess.message}  />       
                ))
            )}


           </div>

           </div>

           }
           


           {!selectedUser && 
           <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="text-gray-800 font-bold text-[50px]">Welcome To Chit-Chat !!</h1>
            <span className="text-[25px] font-thin">Chat Friendly</span>
           </div>}

           {selectedUser && <div className="lg:w-[70%] fixed bottom-[20px] w-full h-[100px] flex items-center justify-center">
             <img src={frontendImage} className="absolute w-[80px] bottom-[90px] right-[20%] rounded-lg shadow-gray-400 shadow-lg" />
             <form onSubmit={handleSendMessage} className="relative flex items-center gap-[20px] w-[95%] lg:w-[75%] h-[60px] bg-[#1797c2] rounded-full shadow-gray-400 shadow-lg">
                
                <div className="w-[25px] h-[25px] text-white ml-[15px]">
                    <RiEmojiStickerLine onClick={() => setShowPicker(prev => ! prev)} className="cursor-pointer w-[30px] h-[30px]" />         
                </div>

                <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />
                <input onChange={(e) => setInput(e.target.value) } value={input} type="text" placeholder="Message" className="outline-none ml-2 placeholder-white w-full h-[95%] bg-transparent rounded-full text-white" />

                <div className="flex gap-[5px]">
                    <FaImages  onClick={() => image.current.click()} className="cursor-pointer w-[30px] h-[30px] text-white mr-[10px]" />
                    {input.length >0 && <button><IoMdSend className="cursor-pointer w-[30px] h-[30px] text-white mr-[10px]" /></button>}
                </div>
        
             </form>
           </div>
           }
        </div> 
    )
}

export default MessageArea
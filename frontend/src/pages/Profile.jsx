import React, { useRef, useState } from "react";
import dp from "../assets/dp.jpg"
import { TbCameraUp } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config/config";
import { setUserData } from "../redux/userSlice";
import axiosInstance from "../api/axiosInstance";


function Profile(){
    let {userData} = useSelector(state=>state.user);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let [name,setName] = useState(userData.name || "");
    let [frontendImage , setFrontendImage] = useState(userData.image || dp);
    let [backendImage , setBackendImage] = useState(null);
    const [saving , setSaving] = useState(false);

    let image = useRef(null);

    const handleImage = (e) => {
      let file = e.target.files[0];
      
      setBackendImage(file);
      let preview = URL.createObjectURL(file);
      setFrontendImage(preview);

    }

    const handleProfile = async(e) => {
      
      e.preventDefault();
      setSaving(true);
      try {
        let formData = new FormData();
        formData.append("name", name);

        if(backendImage){
          formData.append("image", backendImage);
        }

        let result = await axiosInstance.put(`/api/user/profile`, formData)

        setSaving(false);
        dispatch(setUserData(result.data))
        navigate("/")

      } catch (error) {
        console.log(error);
        setSaving(false);
      }

    } 

    return(

        <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center">
            <div className="fixed left-[250px] top-[100px]">
                <FaArrowLeftLong onClick={() => navigate("/")} className="w-[30px] h-[30px] text-gray-600 cursor-pointer" />
            </div>
            <div onClick={() => image.current.click()} className="relative w-[200px] h-[200px] rounded-full bg-white border-2 border-[#20c7ff] shadow-gray-400 shadow-lg overflow-hidden">
                <div className="w-[100%] h-[100%] flex justify-center items-center">
                    <img src={frontendImage} className="h-[100%]" />
                </div>
                <TbCameraUp className="cursor-pointer absolute bottom-[5px] right-[84px] w-[30px] h-[30px]" />
            </div>

            
                <form onSubmit={handleProfile} className="w-[95%] mt-[50px] max-w-[500px] flex flex-col items-center justify-center gap-[20px]">

                  <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>

                  <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter Your Name" className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px]
                    bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]" />

                  <input type="text" readOnly value={userData?.userName} className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px]
                    bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-300 text-[19px]" />

                  <input type="email" readOnly value={userData?.email} className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px]
                    bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-300 text-[19px]" />

                  <button className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] mt-[20px] w-[150px] font-semibold hover:bg-[#76d0ee] hover:shadow-none"  disabled={saving }>{saving? "Saving..." : "Save Profile"}</button>
                </form>
            
                
            
            
        </div>
    )
}

export default Profile
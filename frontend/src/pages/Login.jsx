import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config/config";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";
import axiosInstance from "../api/axiosInstance";

function Login(){
    const navigate = useNavigate();

    const [show,setShow] = useState(false);

    function showHandler(){
        if(show == false){
            setShow(true);
        }

        else{
            setShow(false);
        }
    }

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [loading , setLoading] = useState(false);
    const [err,setErr] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let result = await axiosInstance.post('/api/auth/login',{
                email,password
            })

         localStorage.setItem('token', result.data.token);
            dispatch(setUserData(result.data.user));

            dispatch(setSelectedUser(null))
            // console.log(result);
            setLoading(false);
            setErr("");
            setEmail("");
            setPassword("");
            navigate("/")

            // window.location.reload();
        } catch (error) {
            console.log(error);
            setLoading(false);
            setErr(error.response.data.message);
        }
    }

    return(
        <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
            <div className="w-full max-w-[500px] h-[610px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
                <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center mb-2">
                    <h1 className="text-gray-600 font-bold text-[30px]">Login to <span className="text-white">Chit Chat</span>
                    
                    </h1>

                </div>

                <h1 className="text-gray-600 font-bold text-[30px] mx-auto">Welcome <span className="text-[#20c7ff]">Back !!</span>
                    
                </h1>
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-[20px] items-center">
                    
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" 
                    className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px]
                    bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
                    />

                    <div className="relative w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200 shadow-lg">
                        <input onChange={(e)=> setPassword(e.target.value)} value={password} type={`${show? "text" : "password"}`} placeholder="Password"  
                            className="w-full h-full outline-none px-[20px] py-[10px]
                            bg-white text-gray-700 text-[19px]"
                        />
                        <span onClick={showHandler} className="absolute top-3 right-3 text-slate-400 font-semibold">{`${show? "Hide" : "Show"}`}</span>

                    </div> 

                    {err && <p className="text-red-500 font-bold">*{err}</p>}

                    <button className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] mt-[20px] w-[150px] font-semibold hover:bg-[#76d0ee] hover:shadow-none" disabled={loading} >
                    {loading?"Loading" : "Login"}
                    </button>
                    
                    <p className="cursor-pointer ">Don't Have An Account ? <span className="text-[#20c7ff] text-bold" onClick={() => navigate("/signup")}>Sign Up</span></p>

                </form>
            </div>
        </div>
    )
}
export default Login;
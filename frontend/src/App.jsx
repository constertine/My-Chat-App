import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import useCurrentUser from "./customHooks/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useOtherUsers from "./customHooks/getOtherUsers";
import {io}  from "socket.io-client"
import { serverUrl } from "./config/config";
import { initSocket } from "./socket/socket";
import { setOnineUsers} from "./redux/userSlice";
import Spinner from "./components/Spinner";



function App(){
 
    const {userData,authLoading} = useSelector(state=>state.user);
    const dispatch = useDispatch();

    useCurrentUser();
    useOtherUsers();
  

    useEffect(() => {
      if (userData) {
        const socketio = initSocket(userData._id);

        socketio.on("getOnlineUsers", (users) => {
          dispatch(setOnineUsers(users));
        });

      }
    }, [userData]);

    if(authLoading){
      return <Spinner/>
    }

    return(
      <div>
        <Routes>
          <Route path="/signup" element={!userData ? <SignUp/> : <Navigate to="/profile" />} />
          <Route path="/login" element={!userData? <Login/> : <Navigate to="/" />} />
          <Route path="/" element={userData ? <Home/> : <Navigate to="/login" />} />
          <Route path="/profile" element={userData ? <Profile/> : <Navigate to="/signup" />} />
          
        </Routes>
      </div>
    )
}

export default App;
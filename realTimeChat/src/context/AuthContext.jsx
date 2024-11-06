import {useState,useEffect, createContext, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




export  const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const userData= useRef(null);

    const [name, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const setUserDataLocal=(currentUserData)=>{
            userData.current=currentUserData;
           const parsedData = JSON.stringify(currentUserData);
           console.log(parsedData)
            localStorage.setItem("User",parsedData)
    }
    const getUserDataLocal = async() => {
        const storedUser =localStorage.getItem("User");
        if (storedUser) {
           let data = JSON.parse(storedUser);
           userData.current = data;
          console.log("Got the current user data from local" , userData);
            navigate("/users");
        }else{
          navigate("/");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const userData = {
          name,
          email,
          password,
        };
    
        try {
          const response = await axios.post(
            "http://localhost:3000/users/register",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          console.log("Registration successful:", response.data);
          setUserDataLocal(response.data)
          navigate("/users"); // Navigate to AllUsers page after successful registration

          
          setFullName("");
          setEmail("");
          setPassword("");
        } catch (error) {
          // Check if the error response is available
          if (error.response) {
            // setErrorMessage(error.response.data.message || "Registration failed");
          } else {
            // setErrorMessage("An error occurred. Please try again later.");
          }
        }
      };
    
      const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const userData = {
          email,
          password,
        };
    
        try {
          console.log("login start")
          const response = await axios.post(
            "http://localhost:3000/users/logInUser",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("login after post")

          if (response.status === 200) {
            console.log("Login successful:", response.data);
            setUserDataLocal(response.data)
            navigate("/users");
            setFullName("");
            setEmail("");
            setPassword("");
          console.log("login after end")

          }
        } catch (error) {

          // Check if the error response is available
          if (error.response) {
            console.log(error.response);
            
            // setErrorMessage(error.response.data.message || "Registration failed");
          } else {
            console.log(error);

            // setErrorMessage("An error occurred. Please try again later.");
          }
        }
      };



    useEffect(() => {
        getUserDataLocal();
    }, [])
    

    return (
        <AuthContext.Provider value={{userData,setFullName,setEmail,setPassword,handleRegister,handleLogin,getUserDataLocal,}}>{children} </AuthContext.Provider> 
    );

}



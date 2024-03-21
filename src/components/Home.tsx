import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JWT_TOKEN_STORAGE_KEY } from "../constants";
import axios from "../api/axios";
import { User } from "../models/user";
import { Roles } from "../models/role";

const Home = ({user}: {user: User | null}) => {
  const navigate = useNavigate();  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const JWT_TOKEN = localStorage.getItem(JWT_TOKEN_STORAGE_KEY);
  const [adminAccess, setAdminAccess] = useState();
  const [userAccess, setUserAccess] = useState();

  useEffect(() => {
    const config = {
      headers: { 
        "Authorization": `Bearer ${JWT_TOKEN}`
      }
    };

    const getAccess = async () => {
      try {
        if (user.authorities.some(role => role.authority === Roles.Admin)) {
          let response = await axios.get('/admin/', config);
          setAdminAccess(response.data);
        }
        let response = await axios.get('/user/', config);
        setUserAccess(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getAccess();

  }, []);
  
  return (user &&
    <div className="text-center">
      <div>
        <div>ID: {user.userId}</div>
        <div>Username: {user.username}</div>
        <div>Roles:&nbsp;
          {user.authorities
            .map(role => role.authority)
            .join(", ")
          }
        </div>
      </div>
      
      <div>{adminAccess && adminAccess}</div>
      <div>{userAccess && userAccess}</div>
    </div>
  )
}

export default Home
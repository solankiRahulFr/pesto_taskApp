import axios from "axios";
const BaseUrlDev = "/api/" 

const createUserService = async (userObj) => {
    const response = await axios.post(BaseUrlDev +"users", userObj);
    return response.data
}

const loginUserService = async (userObj) => {
    const response = await axios.put(BaseUrlDev +"login", userObj);
    return response.data
}


const updatePassword = async (pasObj)=>{
    const response  = await axios.post(BaseUrlDev+"users/updatePassword", pasObj);
    return response.data;
}

const userServices = {createUserService, loginUserService, updatePassword} 
export default userServices
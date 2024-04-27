import axios from "axios";
import Cookies from 'js-cookie';
const BaseUrlDev = "/api/";

let token = Cookies.get('token');



const getAllUserTask = async (id)=>{
    const res = await axios.get(BaseUrlDev +'task/'+id);
    return res.data
}


const createTask = async (taskObj) =>{
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const res = await axios.post(BaseUrlDev +'task/', taskObj, config)
  return res.data
}

const updateTask = async (id, taskObj) =>{
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const res = await axios.put(BaseUrlDev +'task/'+id, taskObj, config)
  return res.data
}

const deleteTask = async (id) =>{
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const res = await axios.delete(BaseUrlDev +'task/'+id, config)
  return res.data
}


const taskService = {getAllUserTask, createTask, updateTask, deleteTask}

export default taskService
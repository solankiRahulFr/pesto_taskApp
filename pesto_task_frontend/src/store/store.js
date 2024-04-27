import { readable, writable } from 'svelte/store';
import Cookies from 'js-cookie';

// Store to keep track of screen width
export const screenWidth = readable(window.innerWidth, (set) => {
    const updateWidth = () => set(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
    });


export const toastStore = writable({message:"Default", type:"alert-info", showToasterStore:false})

export const userDetails = writable(JSON.parse(localStorage.getItem("user")));

export const authorization = writable(Cookies.get('token')) 


// export const userTaskTodo = writable([])
// export const userTaskInprogress = writable([])
// export const userTaskDone = writable([])
export const allTask = writable([])


export const filterTasks = writable([])
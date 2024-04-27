<script>
    import * as yup from 'yup';
    import { createEventDispatcher } from 'svelte';
    import {toastStore} from './../store/store';
    import userServices from './../services/user';

  // Variable and assignments
    const dispatch = createEventDispatcher();
    let showPassword = false;
    let newUser = {
        name:"",
        email:"",
        password:""
    }
    let errors = {}

    // new user schema for validation
    const newUserSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email:yup.string().required("Email is required").email("Email is invalid").matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid Email'),
        password: yup.string().required("Password is required").min(6, 'Must be exactly 6 digits'),
    })

    // password input
    const handlePasswordInput = (event)=>{
        newUser = {...newUser, password:event.target.value}
    }

// handler to validate form
    const formValidation = async () =>{
        try {
          await newUserSchema.validate(newUser, { abortEarly: false });
          return {};
        } catch (err) {
          return err.inner.reduce((acc, err) => {
            return { ...acc, [err.path]: err.message };
          }, {});
        }
    }

// register handler creating the user if valid and alerting, if no raising the error message
    const registerUserHandler = async () =>{
        errors = await formValidation();
        let isValid = newUserSchema.isValidSync(newUser)
        if(isValid){
          try{
            const response = await userServices.createUserService(newUser)
            dispatch("loginChange");
            toastStore.set({message:"User created successfuly", type:"alert-success", showToasterStore : true});
            toastStore.set({message:"Redirecting to Login", type:"alert-info", showToasterStore : true});
          }catch(exception){
            toastStore.set({message:`Exception:${exception.response.data.error}`, type:"alert-error", showToasterStore : true});
          }
         
        }
    }


</script>

<div class="card card-side bg-base-100 shadow-xl md:w-1/3">
    <form on:submit|preventDefault={registerUserHandler} class="w-full">
    <div class="card-body">
        <h2 class="card-title mb-3">Register to manage your task</h2>
        <label class="input input-bordered flex items-center gap-2 {(errors && errors.email) && "input-error"}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
          <input type="text" class="grow" placeholder="Email*" bind:value={newUser.email}/>
        </label>
        {#if errors.email}
        <span class="text-red-700 text-xs error">{errors.email}</span>
      {/if}
        <label class="input input-bordered flex items-center gap-2 {(errors && errors.name) && "input-error"}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
          <input type="text" class="grow" placeholder="Name*" bind:value={newUser.name}/>
        </label>
        {#if errors.name}
          <span class="text-red-700 text-xs error">{errors.name}</span>
        {/if}
        <label class="input input-bordered flex items-center gap-2 {(errors && errors.password) && "input-error"}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
          <input type={showPassword?"text":"password"} class="grow" placeholder="Password*" on:input={handlePasswordInput} autocomplete="on"/>
          <button type="button" on:click={()=>{showPassword=!showPassword}} style={showPassword && 'display: none'}>
            <svg id="Layer_1"  class="w-4 h-4 opacity-70"  fill="currentColor" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
          </button> 
          <button type="button" on:click={()=>{showPassword=!showPassword}} style={!showPassword && 'display: none'}>
            <svg id="Layer_2" class="w-4 h-4 opacity-70" fill="currentColor" data-name="Layer 2"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
          </button>
        </label>
        {#if errors.password}
        <span class="text-red-700 text-xs error">{errors.password}</span>
      {/if}
          <div class="card-actions justify-center">
            <button class="btn btn-primary btn-block" type="submit">Register</button>
            <button class="underline text-sm" on:click={()=>dispatch('loginChange')}>Already a tasker ? Login</button>
          </div>
    </div>
    </form>
  </div> 
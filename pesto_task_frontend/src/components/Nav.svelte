<script>
    import { authorization, userDetails, toastStore } from "../store/store";
    import Cookies from 'js-cookie';
    import userService from "./../services/user";

    // Variable and assignments
    export let isauth;
    let theme = "light";
    let errors = {};
    let newP="", oldP="";
    let changePasModal = false, showPasswordNew=false, showPasswordNewCon=false;
    const htmlTagMainTheme = window.document.querySelector('html');
    const toggleTheme = () =>{
        if(theme === 'light') theme='dark'
        else theme = 'light'
    }
    let user={};

    // rective assignments to re-render
    $:user = $userDetails;
    $:htmlTagMainTheme.setAttribute('data-theme', theme);

// logout the user removing the token from cookie and user details form the local storage
  const logoutHandle=()=>{
    Cookies.remove('token')
    window.localStorage.removeItem("user");
    $authorization = ""
  }

  // password input handler
  const handlePasswordInput = (event) =>{
    if(event.target.id == "newPassword") newP=event.target.value
    else oldP=event.target.value
  }

  // handler to valisdate and change the password
  const handleChangePassword = async () =>{
    if(newP !== "" && newP !== ""){
      if(newP.length<6 || oldP.length<6){
        if(newP.length<6) errors = {...errors, newPassword:"Password must atleast 6 char"} 
        else if(oldP.length<6) errors = {...errors, oldPassword:"Password must atleast 6 char"}
        else errors = {}
      }else{
        try {
            const res = await userService.updatePassword({userId: user.id, oldPassword:oldP, newPassword:newP})
            changePasModal = false;
            oldP = "";
            newP ="";
            errors={}
            toastStore.set({message:"Password updated successfuly", type:"alert-success", showToasterStore : true});

        } catch (error) {
                toastStore.set({message: `Exception:${error.response.data.error}`,type: "alert-error",showToasterStore: true});
        }
      }        
    }else{
      if(newP === "") errors = {...errors, newPassword:"Must not be empty"}
      else if(oldP === "") errors = {...errors, oldPassword:"Must not be empty"}
      else errors = {}
    }
  }

</script>


<div class="navbar bg-base-100">
  <div class="flex-1">
    <h1 class="text-xl font-serif font-semibold">TASKER.</h1>
  </div>
   

  <label class="swap swap-rotate mr-1">
    <input type="checkbox" class="theme-controller" value="synthwave" on:click={toggleTheme}/>
    <svg class="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
    <svg class="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
  </label>
    {#if isauth && user}
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
          <div class="w-10 bg-neutral text-neutral-content rounded-full">
            <span class="text-md">{user.name.split(" ").map(n=>n[0]).join('').toUpperCase()}</span>
          </div>
        </div>
        <ul class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li class="font-semibold">{user.name}</li>
          <li class="font-semibold">{user.email}</li>
          <li><button id="dropMenu" type='button' on:click={()=>{changePasModal=true}}>Settings</button></li>
          <li><button type='button' on:click={logoutHandle}>Logout</button>
        </ul>
      </div>
    </div>


    <dialog id="my_modal_pass" class="modal" class:modal-open={changePasModal}>
      <div class="modal-box">
        <h3 class="font-bold text-lg">Change pasword</h3>
        <div class="modal-action w-full">
          <form class="w-full flex flex-col gap-2">
              <label class="input input-bordered flex items-center gap-2 {(errors && errors.oldPassword) && "input-error"}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input id="oldPassword" type={showPasswordNew?"text":"password"} class="grow" placeholder="Old password*" value={oldP} on:input={handlePasswordInput} autocomplete="on"/>
                <button type="button" on:click={()=>{showPasswordNew=true}} style={showPasswordNew && 'display: none'}>
                  <svg id="Layer_1"  class="w-4 h-4 opacity-70"  fill="currentColor" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
                </button> 
                <button type="button" on:click={()=>{showPasswordNew=false}} style={!showPasswordNew && 'display: none'}>
                  <svg id="Layer_2" class="w-4 h-4 opacity-70" fill="currentColor" data-name="Layer 2"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
                </button>
              </label>
              <label class="input input-bordered flex items-center gap-2 {(errors && errors.newPassword) && "input-error"}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input id="newPassword" type={showPasswordNewCon?"text":"password"} class="grow" placeholder="New password*" on:input={handlePasswordInput} autocomplete="on" value={newP}/>
                <button type="button" on:click={()=>{showPasswordNewCon=true}} style={showPasswordNewCon && 'display: none'}>
                  <svg id="Layer_1"  class="w-4 h-4 opacity-70"  fill="currentColor" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
                </button> 
                <button type="button" on:click={()=>{showPasswordNewCon=false}} style={!showPasswordNewCon && 'display: none'}>
                  <svg id="Layer_2" class="w-4 h-4 opacity-70" fill="currentColor" data-name="Layer 2"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
                </button>
              </label>
              {#if errors.newPassword || errors.oldPassword}
              <span class="text-red-700 text-xs error">{errors.newPassword}</span>
            {/if}
            <div class="flex justify-end gap-4">
              <button class="btn" type="button" on:click={()=>changePasModal = false}>Close</button>
              <button type="button" class="btn btn-info" on:click={handleChangePassword}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
    {/if}
 
  </div>

 
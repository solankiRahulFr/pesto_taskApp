
<script>
  import Register from "./Register.svelte";
  import Login from "./Login.svelte";

  let showLogin = false;

  // toggle to change resgister and user page
  const togglogin=()=>{
    showLogin = !showLogin
  }
</script>


{#if showLogin}
  <Register on:loginChange={togglogin}/>
{:else}
  <Login on:loginChange={togglogin}/>
{/if}

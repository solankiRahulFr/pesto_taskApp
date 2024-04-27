<script>
  import Body from "./components/Body.svelte";
  import Nav from "./components/Nav.svelte";
  import Auth from "./components/Auth.svelte";
  import Toaster from "./components/Toaster.svelte";
  import { authorization } from "./store/store";
  
  let auth;

  $: auth = $authorization;
</script>

<Nav isauth={auth} />
{#if auth}
  <Body />
{:else}
  <div class="flex items-center justify-center w-full gap-2">
    <Auth />
  </div>
{/if}

<Toaster />

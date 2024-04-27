<script>
    import { toastStore } from "../store/store";
    export const toast= $toastStore;
    // toaster component fot the app showing for 3 seconds

    $:{if($toastStore.showToasterStore) setTimeout(()=>{$toastStore.showToasterStore=false;}, 3000)}

</script>

<div class="toast toast-end {!$toastStore.showToasterStore && "hidden"}">
    <div class="{$toastStore.type} alert">
      <span>{$toastStore.message}</span>
    </div>
  </div>
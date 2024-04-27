<script>
  import { onMount } from "svelte";
  import {
  allTask,
    screenWidth,
    toastStore,
    userDetails,
  } from "./../store/store";
  import StatusContainer from "./StatusContainer.svelte";
  import Filter from "./Filter.svelte";
  import taskService from "./../services/task";
  import TaskCreate from "./TaskCreate.svelte";

  // Variable and assignments
  let user = {};
  let isMobile = false;
  let showTask = false;
  let userTaskTodo=[], userTaskInprogress=[], userTaskDone=[];
  const breakpoint = 678; // Threshold for mobile layout
  let status = ["To Do", "In progress", "Done"];
  let activeTabIndex = 1;


  // Function to determine layout based on screen width
  function determineLayout(width) {
    isMobile = width <= breakpoint;
  }

  // loading all the task when user present
  onMount(async () => {
    try {
      const response = await taskService.getAllUserTask(user.id);
      allTask.set(response)
      showTask = true;
    } catch (exception) {
      toastStore.set({
        message: `Exception:${exception.response.data.error}`,
        type: "alert-error",
        showToasterStore: true,
      });
    }
  });

  // Grabbing the reactivity to render dynamically
  $: determineLayout($screenWidth);
  $: user = $userDetails;
  $:userTaskTodo = $allTask.filter((task) => task.status.toLowerCase() === "to do")
  $:userTaskInprogress = $allTask.filter((task) => task.status.toLowerCase() === "in progress")
  $:userTaskDone = $allTask.filter((task) => task.status.toLowerCase() === "done")

</script>


<main class="mx-5">
  <div class="flex justify-between gap-2 items-start">
    <div>
      <TaskCreate/>
    </div>
    <div class="flex justify-end w-full justify-items-start content-start items-start self-start">
      <Filter />
    </div>
  </div>

  {#if showTask}
    {#if isMobile}
      <!-- Mobile layout with tab containers -->
      <div role="tablist" class="tabs tabs-boxed">
        {#each status as stat, index (stat)}
          <button
            id="tabs"
            role="tab"
            class="tab"
            class:tab-active={activeTabIndex === index}
            on:click={() => (activeTabIndex = index)}>{stat}</button
          >
        {/each}
      </div>
      <div class="mt-2">
        {#if activeTabIndex == 0}
          {#each userTaskTodo as todo (todo.id)}
            <StatusContainer task={todo} />
          {/each}
        {:else if activeTabIndex == 1}
          {#each userTaskInprogress as inp (inp.id)}
            <StatusContainer task={inp} />
          {/each}
        {:else}
          {#each userTaskDone as done (done.id)}
            <StatusContainer task={done} />
          {/each}
        {/if}
      </div>
    {:else}
      <!-- Desktop layout with flex row -->
      <div class="flex space-between">
        <div class="card flex-item rounded-md h-[calc(100vh-10rem)]">
          <h3 class="text-center">To Do</h3>
          <div class="mt-2 flex flex-col gap-2 overflow-y-auto h-lvh" id="scrollStyle">
            {#each userTaskTodo as todo (todo.id)}
            <StatusContainer task={todo} />
          {/each}
          </div>
        </div>
        <div class="card flex-item rounded-md">
          <h3 class="text-center">In progress</h3>
          <div class="mt-2 flex flex-col gap-2">
            {#each userTaskInprogress as inp (inp.id)}
            <StatusContainer task={inp} />
          {/each}
          </div>
        </div>
        <div class="card flex-item rounded-md">
          <h3 class="text-center">Done</h3>
          <div class="mt-2 flex flex-col gap-2">
            {#each userTaskDone as done (done.id)}
            <StatusContainer task={done} />
          {/each}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  .flex-item {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 5px;
  }

  /* Common styles */
  @media (min-width: 678px) {
    .tabs-container {
      display: none;
    }
  }


  #scrollStyle::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #ffffff;
	border-radius: 8px;
}

#scrollStyle::-webkit-scrollbar
{
	width: 8px;
	background-color: transparent;
  border-radius: 8px;
}

#scrollStyle::-webkit-scrollbar-thumb
{
	border-radius: 8px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #a09f9f;
}
</style>

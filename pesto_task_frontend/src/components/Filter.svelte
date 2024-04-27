<script>
  import { debounce, sortBy } from 'lodash-es';
  import { allTask, filterTasks, userDetails } from '../store/store';
  import { onMount } from 'svelte';
  import taskService from '../services/task';

  // VAriable and assignments
  let searchInput = ""
  let noSort = [];
  let filterPriority = ['high', 'medium', 'low']
  let sortValue = "default"
  let user = {};
 
// getting all the task as a copy for filtering and not using server for basic task filtering
  onMount(async ()=>{
    const response = await taskService.getAllUserTask(user.id);
    filterTasks.set(response)
    noSort = response;
  })

// Sort function sorting on the selected values
  const sortHandler= () =>{
    switch (sortValue) {
      case "priHigh":
        allTask.set(sortBy($allTask, task =>{
          const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
          return priorityOrder[task.priority];
        }))
        break;
      case "priLow":
        allTask.set(sortBy($allTask, task =>{
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
          return priorityOrder[task.priority];
        }))
        break;
      case "dueDateClose":
        allTask.set(sortBy($allTask, task => new Date(task.dueDate)))
        break;
      case "dueDateFar":
        allTask.set(sortBy($allTask, task => new Date(task.dueDate)).reverse())
        break;   
      case "default":
        allTask.set(noSort)
        break;   
      default:
        break;
    }
  }

  // debounce function to filter the content every 3ms
  const search = debounce(() => {
    if(searchInput) allTask.set($filterTasks.filter(task=> task.title.toLowerCase().includes(searchInput.toLowerCase())))
    else allTask.set($filterTasks)
  }, 300);

// reactivity handling
$: user = $userDetails;
$: if(searchInput){ search() }else{allTask.set($filterTasks) }
$: if(filterPriority) allTask.set($filterTasks.filter(task=> filterPriority.includes(task.priority.toLowerCase())))
$: if(sortValue){sortHandler()} else {allTask.set($filterTasks)}

</script>

<label
  class="input input-bordered input-sm md:input-md flex items-center gap-2 w-full mb-2 md:w-1/2"
>
  <input type="text" class="grow" placeholder="Search by title" bind:value={searchInput}/>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    class="w-4 h-4 opacity-70"
    ><path
      fill-rule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clip-rule="evenodd"
    /></svg
  >
</label>

<div class="dropdown dropdown-bottom dropdown-end ml-2">
  <div tabindex="-1" role="button" class="btn btn-sm md:btn-md">Filter</div>
  <div
    tabindex="-1"
    class="dropdown-content z-[1] card w-64 shadow-xl bg-base-100"
  >
    <div class="card-body">
      <h3 class="text-md">Priority</h3>
      <div class="form-control ml-3">
        <label class="label cursor-pointer p-0 py-1">
          <span class="label-text">High</span>
          <input type="checkbox" checked class="checkbox checkbox-sm" value="high" bind:group={filterPriority}/>
        </label>
        <label class="label cursor-pointer p-0 py-1">
          <span class="label-text">Medium</span>
          <input type="checkbox" checked class="checkbox checkbox-sm" value="medium" bind:group={filterPriority}/>
        </label>
        <label class="label cursor-pointer p-0 py-1">
          <span class="label-text">Low</span>
          <input type="checkbox" checked class="checkbox checkbox-sm" value="low" bind:group={filterPriority}/>
        </label>
      </div>
      <h3 class="text-md">Sort by</h3>
      <label class="form-control w-full max-w-xs">
        <select class="select select-bordered" bind:value={sortValue}>
          <option value="default" selected>Default</option>
          <option value="dueDateClose">Due date - close</option>
          <option value="dueDateFar">Due date - far</option>
          <option value="priLow">Priority - low to high</option>
          <option value="priHigh">Priority - high to low</option>
        </select>
      </label>
    </div>
  </div>
</div>


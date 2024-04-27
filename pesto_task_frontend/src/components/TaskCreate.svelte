
<script>
  import * as yup from 'yup';
  import taskService from '../services/task';
  import { allTask, toastStore, userDetails } from '../store/store';
  

  // Variable and assignments
  let errors = {}
  let isModalOpen = false;
  let user = {}
  let newTaskDetails = {
    description: "",
    dueDate: "",
    user: "",
    priority: "",
    reminder: "",
    status: "",
    title: ""
  }

// rectivity assignment
  $:user = $userDetails;

// new task for validation
  const taskSchema = yup.object().shape({
    title:yup.string().required("Title is required"),
    status:yup.string().required("Status is required")
    })

  // handler to validate form
  const formValidation = async () =>{            
        try {
          await taskSchema.validate(newTaskDetails, { abortEarly: false });
          if(newTaskDetails.dueDate){
          let dDate = new Date(newTaskDetails.dueDate)
          if(newTaskDetails.reminder){
            let remDate = new Date(newTaskDetails.reminder.substring(0, 10))
            if(remDate>dDate) errors = {...errors, reminder:"Reminder should be before due date"}
            else errors = {};
          }
        }else{
          if(newTaskDetails.reminder)errors = {...errors, reminder:"Due date must be set to put reminder"}
          else errors = {};
        }} catch (err) {
          errors = err.inner.reduce((acc, err) => {return { ...acc, [err.path]: err.message }}, {});
        }
    }

 // creting the task if the title and staus are valid
  const handleTaskCreate = async () => {
      formValidation();
      let task = {...newTaskDetails};
      if(task.dueDate) task = {...task, dueDate:new Date(newTaskDetails.dueDate).toISOString()}
      if(task.reminder) task = {...task, reminder:new Date(newTaskDetails.reminder).toISOString()}
      let isValid = taskSchema.isValidSync(task)
      if(isValid && !errors.reminder && !errors.dueDate){
        try{
          const response = await taskService.createTask(task);
          newTaskDetails = {
                        description: "",
                        dueDate: "",
                        user: "",
                        priority: "",
                        reminder: "",
                        status: "",
                        title: ""
                      }
          isModalOpen = false;
          const responseAllTask = await taskService.getAllUserTask(user.id);
          allTask.set(responseAllTask)
          toastStore.set({message:"Task created successfuly", type:"alert-success", showToasterStore : true});
        }catch(exc){
          toastStore.set({message:`Exception:${exc.response.data.error}`, type:"alert-error", showToasterStore : true});
        }     
      }
  }


</script>




<div class="tooltip tooltip-right" data-tip="Add new Task">
<button class="btn btn-sm md:btn-md btn-primary btn-circle " on:click={()=>{isModalOpen=true}}>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
</button>
</div>
<dialog id="my_modal_1" class="modal" class:modal-open={isModalOpen}>
<div class="modal-box">
  <h3 class="font-bold text-lg flex justify-between">Create Task</h3>
  <form on:submit|preventDefault={handleTaskCreate}>
  <label class="form-control w-full ">
      <div class="label">
        <span class="label-text">Title*</span>
      </div>
      <input type="text" placeholder="Title of the task" class="input input-bordered w-full {(errors && errors.title) && "input-error"}" bind:value={newTaskDetails.title} />
  </label>
  {#if errors.title}
      <span class="text-red-700 text-xs error">{errors.title}</span>
    {/if}
  <div class="flex gap-2">
    <div class="w-full">
      <label class="form-control w-full">
        <div class="label">
            <span class="label-text">Status*</span>
          </div>
          <select class="select select-bordered select-sm w-full {(errors && errors.email) && "select-error"}" bind:value={newTaskDetails.status}>
            <option value="to do">To do</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
    </label>
      {#if errors.status}
      <span class="text-red-700 text-xs error">{errors.status}</span>
    {/if}
    </div>
      <label class="form-control w-full">
          <div class="label">
              <span class="label-text">Priority</span>
            </div>
            <select class="select select-bordered select-sm w-full" bind:value={newTaskDetails.priority}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
      </label>
  </div>

  
  <label class="form-control">
      <div class="label">
        <span class="label-text">Description</span>
      </div>
      <textarea class="textarea textarea-bordered h-24" placeholder="Description" bind:value={newTaskDetails.description}></textarea>
    </label>
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Due Date</span>
      </div>
      <input type="Date" placeholder="Type here" class="input input-bordered w-full {(errors && errors.dueDate) && "input-error"}"  bind:value={newTaskDetails.dueDate}/>
  </label>
  {#if errors.dueDate}
  <span class="text-red-700 text-xs error">{errors.dueDate}</span>
{/if}
  <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Reminder</span>
      </div>
      <input type="datetime-local" placeholder="Type here" class="input input-bordered w-full {(errors && errors.reminder) && "input-error"}"  bind:value={newTaskDetails.reminder}/>
  </label>
  {#if errors.reminder}
  <span class="text-red-700 text-xs error">{errors.reminder}</span>
{/if}
  <div class="modal-action">
    
      <!-- if there is a button in form, it will close the modal -->
      <button class="btn btn-primary" type="submit">Create</button>
      <button class="btn btn-neutral" type='button' on:click={()=>isModalOpen = false}>Close</button>
  </div>
</form>
</div>
</dialog>
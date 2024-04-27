<script>
  import * as yup from "yup";
  import taskService from "../services/task";
  import { allTask, toastStore, userDetails } from "../store/store";

  // Variable and assignments
  export let task = {};
  let isModalOpen = false,
    isalertDelete = false;
  let taskDetails = {};
  let errors = {};
  let user;
  $: user = $userDetails;
  taskDetails = {
    ...task,
    status: task.status.trim().toLowerCase(),
    priority: task.priority.trim().toLowerCase(),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : null,
    reminder: task.reminder
      ? new Date(task.reminder).toISOString().slice(0, 16)
      : null,
    createdAt: new Date(task.createdAt).toDateString(),
  };

  // new task for validation
  const taskSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    status: yup.string().required("Status is required"),
  });

  // handler to validate form
  const formValidation = async () => {
    try {
      await taskSchema.validate(taskDetails, { abortEarly: false });
      if (taskDetails.dueDate) {
        let dDate = new Date(taskDetails.dueDate);
        if (taskDetails.reminder) {
          let remDate = new Date(taskDetails.reminder.substring(0, 10));
          if (remDate > dDate)
            errors = {
              ...errors,
              reminder: "Reminder should be before due date",
            };
          else errors = {};
        }
      } else {
        if (taskDetails.reminder)
          errors = {
            ...errors,
            reminder: "Due date must be set to put reminder",
          };
        else errors = {};
      }
    } catch (err) {
      errors = err.inner.reduce((acc, err) => {
        return { ...acc, [err.path]: err.message };
      }, {});
    }
  };

  // updating the task and re rendering the task display
  const handleTaskUpdate = async () => {
    formValidation();
    let updateTask = { ...taskDetails };
    if (task.dueDate)
      updateTask = {
        ...updateTask,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
      };
    if (task.reminder)
      updateTask = {
        ...updateTask,
        reminder: new Date(taskDetails.reminder).toISOString(),
      };
    let isValid = taskSchema.isValidSync(updateTask);
    if (isValid && !errors.reminder && !errors.dueDate) {
      try {
        const response = await taskService.updateTask(task.id, updateTask);
        isModalOpen = false;
        const responseAllTask = await taskService.getAllUserTask(user.id);
        allTask.set(responseAllTask);
        toastStore.set({
          message: "Task updated successfuly",
          type: "alert-success",
          showToasterStore: true,
        });
      } catch (error) {
        toastStore.set({
          message: `Exception:${error.response.data.error}`,
          type: "alert-error",
          showToasterStore: true,
        });
      }
    }
  };

  // deleting the task after comfirmation and re render the display
  const handleDeleteTask = async () => {
    try {
      const response = await taskService.deleteTask(task.id);
      isalertDelete = false;
      const responseAllTask = await taskService.getAllUserTask(user.id);
      allTask.set(responseAllTask);
      toastStore.set({
        message: "Task Deleted successfuly",
        type: "alert-success",
        showToasterStore: true,
      });
    } catch (error) {
      toastStore.set({
        message: `Exception:${error.response.data.error}`,
        type: "alert-error",
        showToasterStore: true,
      });
    }
  };
</script>

<button
  class="btn w-full p-2 h-fit"
  on:click={() => {
    isModalOpen = true;
  }}
>
  <div class="w-full flex justify-between gap-2">
    <div class="text-left">
      <h1 class="text-md">{taskDetails.title}</h1>
      {#if taskDetails.dueDate}
        <p class="text-xs font-light">Due Date : {taskDetails.dueDate}</p>
      {/if}
    </div>
    <div>
      <div
        class="badge badge-sm text-nowrap"
        class:badge-error={taskDetails.priority === "high"}
        class:badge-warning={taskDetails.priority === "medium"}
        class:badge-info={taskDetails.priority === "low"}
      >
        Priority : {taskDetails.priority}
      </div>
    </div>
  </div></button
>

<dialog id="my_modal_1" class="modal" class:modal-open={isModalOpen}>
  <div class="modal-box">
    <h3 class="font-bold text-lg flex justify-between">
      Task <span class="text-xs font-light">{taskDetails.createdAt}</span>
    </h3>
    <form on:submit|preventDefault={handleTaskUpdate}>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Title</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
          bind:value={taskDetails.title}
        />
      </label>
      {#if errors.title}
        <span class="text-red-700 text-xs error">{errors.title}</span>
      {/if}
      <div class="flex gap-2">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Status</span>
          </div>
          <select
            class="select select-bordered select-sm w-full"
            bind:value={taskDetails.status}
          >
            <option value="to do">To do</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        {#if errors.status}
          <span class="text-red-700 text-xs error">{errors.status}</span>
        {/if}
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Priority</span>
          </div>
          <select
            class="select select-bordered select-sm w-full"
            bind:value={taskDetails.priority}
          >
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
        <textarea
          class="textarea textarea-bordered h-24"
          placeholder="Bio"
          bind:value={taskDetails.description}
        ></textarea>
      </label>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Due Date</span>
        </div>
        <input
          type="Date"
          placeholder="Type here"
          class="input input-bordered w-full"
          bind:value={taskDetails.dueDate}
        />
      </label>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Reminder</span>
        </div>
        <input
          type="datetime-local"
          placeholder="Type here"
          class="input input-bordered w-full"
          bind:value={taskDetails.reminder}
        />
      </label>
      <div class="modal-action flex justify-between">
        <div>
          <button
            class="btn btn-error"
            type="button"
            on:click={() => {
              isalertDelete = true;
            }}>Delete</button
          >
        </div>
        <!-- if there is a button in form, it will close the modal -->
        <div>
          <button class="btn btn-primary" type="submit">Update</button>
          <button
            class="btn btn-neutral"
            type="button"
            on:click={() => (isModalOpen = false)}>Close</button
          >
        </div>
      </div>
    </form>
  </div>
</dialog>

<dialog id="my_modal_2" class="modal" class:modal-open={isalertDelete}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Are you sure you want to detele task "{task.title}" ?</p>
    <div class="modal-action">
      <form method="dialog">
        <button
          class="btn"
          type="button"
          on:click={() => (isalertDelete = false)}>Close</button
        >
        <button type="button" class="btn btn-error" on:click={handleDeleteTask}
          >Yes</button
        >
      </form>
    </div>
  </div>
</dialog>

# Tasker

A simple task management app where you can add tasks under three statuses: "to do", "in progress", and "done". Users can also assign priority tags (high, medium, low) to tasks and set due dates and reminders. User is able to filter the task as well.

![image](https://github.com/solankiRahulFr/pesto_taskApp/assets/99829859/59a8c6b6-c090-4d96-88bc-118006e1696e)

![image](https://github.com/solankiRahulFr/pesto_taskApp/assets/99829859/9623c749-2872-4357-b095-e702dc6200be)

![image](https://github.com/solankiRahulFr/pesto_taskApp/assets/99829859/94a2c3bc-768a-48cd-9a38-a4aa0a8e0474)

# App is hosted on render for verification.(it may take some time to open)

### Want to test without creating a user use (email: testuser3@tasker.com, password: 333333) on login form.

https://pesto-taskapp.onrender.com/

## Feature

* Registering and Login.(token is saved in cookies and user details are saved in localstorage after login)
* Organize tasks under three statuses: "to do", "in progress", and "done".
* Set priority tags for tasks: high, medium, low.
* Specify due dates and reminders (backend functionality not implemented) for tasks.
* Update and delete tasks.
* Filter and sort the tasks according to priority and Due date. (Implementing debounce for the filter search for every 3ms)
* toggle the theme to dark/light.  

## Tech

**Sevlte, Node(express) and MongoDB**

## Setup local

1. Clone the repository:
   `
   git clone https://github.com/solankiRahulFr/pesto_taskApp.git
   `
   
3. Install dependencies
   `
    cd pest_task_backend
    npm install
   `
   
4. Start the server
   `
   npm run dev
   `



## Usage

* Create an account or log in if authentication is implemented.
* Add tasks with title, description, status, priority, due date, and reminder.
* Organize tasks under different statuses: "to do", "in progress", and "done".
* Update or delete tasks as needed.

## Contributing

If you have any suggestions, improvements, or feature requests, feel free to open an issue or create a pull request.

License
This project is licensed under the MIT License.


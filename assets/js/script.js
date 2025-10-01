let tasks = [];
const todoInput = document.getElementById("todoInput");
const prioritySelect = document.getElementById("prioritySelect");
const todoList = document.getElementById("todoList");
const STORAGE_KEY = 'todoTasks'; 

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

function addTask() {
    const taskText = todoInput.value.trim();
    
    const priority = Number(prioritySelect.value);

    if (taskText === "" || priority === -1) {
        
        Swal.fire({
            icon: "error",
            title: "Invalid Input",
            text: "Please enter a task and select a priority.",
        });
        return;
    }

    const task = {
        id: new Date().toISOString(),
        text: taskText,
        priority: priority,
        completed: false
    };

    tasks.push(task);
    todoInput.value = "";
    prioritySelect.value = "-1";

    saveTasks();
    renderTasks();
}

function editTask(id){
     
    renderTasks();
}

function sortTask(priority){

    task.sort((a,b) => a.task - b.task) 
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();
    renderTasks();
}

function getPriorityLabel(priority) {
    switch (priority) {
        case 1: return "High";
        case 2: return "Medium";
        case 3: return "Low";
        default: return "Unknown";
    }
}

function getBgColorClass(priority) {
    switch (priority) {
        case 1: return "badge-high";
        case 2: return "badge-medium";
        case 3: return "badge-low";
        default: return "badge-medium";
    }
}

function renderTasks() {
    
    if (tasks.length === 0) {
        todoList.innerHTML = `
                <div class="empty-state">
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
        return;
    }

    let html = "";
    
    for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        html += `
                <div class="todo-item p-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="todo-text mb-1">${t.text}</p>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge ${getBgColorClass(t.priority)}">
                                ${getPriorityLabel(t.priority)}
                            </span>
                            <button class="btn btn-sm btn-danger" onclick="deleteTask('${t.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="deleteTask('${t.id}')">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }

    todoList.innerHTML = html;
}

loadTasks();
let tasks = [];
let currentSort = 'default';
const todoInput = document.getElementById("todoInput");
const prioritySelect = document.getElementById("prioritySelect");
const sortSelect = document.getElementById("sortSelect");
const todoList = document.getElementById("todoList");
const STORAGE_KEY = 'todoTasks';

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

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

function toggleCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
}
 function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { value: newText } =  Swal.fire({
        title: "Edit Task",
        input: "text",
        inputLabel: "New Task Description",
        inputValue: task.text,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!';
            }
        }
    });

    if (newText) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
        Swal.fire('Updated!', 'Your task has been updated.', 'success');
    }
}


function deleteTask(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            Swal.fire(
                'Deleted!',
                'Your task has been deleted.',
                'success'
            );
        }
    });
}

function handleSortChange() {
    currentSort = sortSelect.value;
    renderTasks();
}

function getSortedTasks() {
    let sortedTasks = [...tasks]; 
    switch (currentSort) {
        case 'high':
            sortedTasks.sort((a, b) => a.priority - b.priority);
            break;
        case 'low':
            sortedTasks.sort((a, b) => b.priority - a.priority);
            break;
        case 'default':
        default:
            sortedTasks.sort((a, b) => new Date(b.id) - new Date(a.id));
            break;
    }
    return sortedTasks;
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
    const tasksToRender = getSortedTasks(); 
    let html = "";
    for (let i = 0; i < tasksToRender.length; i++) {
        const t = tasksToRender[i];
        const completedClass = t.completed ? 'completed' : '';
        html += `
                <div class="todo-item p-3 mb-3 d-flex align-items-center ${completedClass}">
                    <div class="form-check me-3">
                        <input class="form-check-input" type="checkbox" 
                                onclick="toggleCompletion('${t.id}')" ${t.completed ? 'checked' : ''}>
                    </div>
                    <div class="flex-grow-1">
                        <p class="todo-text mb-0">${t.text}</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                        <span class="badge ${getBgColorClass(t.priority)}">
                            ${getPriorityLabel(t.priority)}
                        </span>
                        <button class="btn btn-sm btn-edit" onclick="editTask('${t.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-delete" onclick="deleteTask('${t.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
    }
    todoList.innerHTML = html;
}

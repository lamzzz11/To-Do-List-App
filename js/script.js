// Local State Array
let tasks = [];

// DOM Elements Selection
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');

const todoTableBody = document.getElementById('todoTableBody');
const doneList = document.getElementById('doneList');
const btnDeleteAll = document.getElementById('btnDeleteAll');

const todoCount = document.getElementById('todoCount');
const doneCount = document.getElementById('doneCount');
const emptyTodoMsg = document.getElementById('emptyTodoMsg');
const emptyDoneMsg = document.getElementById('emptyDoneMsg');

// Initialize Real-time Date & App Startup
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderTime();
    setDefaultDueDate();
    renderTasks();
});

// Update Header Day & Date Automatically
function updateHeaderTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    document.getElementById('currentDay').textContent = days[now.getDay()];
    document.getElementById('currentDate').textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Set default deadline to today (+ 1 hour)
function setDefaultDueDate() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    dueDateInput.value = now.toISOString().slice(0, 16);
}

// Add New Task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        title: taskText,
        priority: priority,
        createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        dueDate: dueDate,
        isDone: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    setDefaultDueDate();
    renderTasks();
});

// Check if Task is Overdue
function isOverdue(dueDateString) {
    if (!dueDateString) return false;
    return new Date() > new Date(dueDateString);
}

// Render Interface Tasks
function renderTasks() {
    todoTableBody.innerHTML = '';
    doneList.innerHTML = '';

    const activeTasks = tasks.filter(t => !t.isDone);
    const completedTasks = tasks.filter(t => t.isDone);

    // Update Counters
    todoCount.textContent = activeTasks.length;
    doneCount.textContent = completedTasks.length;

    // Toggle Empty Messages
    emptyTodoMsg.style.display = activeTasks.length === 0 ? 'block' : 'none';
    emptyDoneMsg.style.display = completedTasks.length === 0 ? 'block' : 'none';

    // Render Active To-Do Rows
    activeTasks.forEach(task => {
        const tr = document.createElement('tr');
        const overdue = isOverdue(task.dueDate);

        tr.innerHTML = `
            <td>
                <input type="checkbox" onchange="toggleDone(${task.id})">
            </td>
            <td style="font-weight: 500;">${task.title}</td>
            <td>
                <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
            </td>
            <td>
                <small style="color: var(--text-secondary);">Dibuat: ${task.createdAt}</small><br>
                ${overdue 
                    ? `<span class="badge badge-overdue">Late / Overdue</span>` 
                    : `<small style="color: var(--primary-color);">Deadline: ${new Date(task.dueDate).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</small>`
                }
            </td>
            <td>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
            </td>
        `;
        todoTableBody.appendChild(tr);
    });

    // Render Completed Tasks (Done Column)
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'done-item';
        li.innerHTML = `
            <span>✓ ${task.title}</span>
            <button class="btn-delete" onclick="deleteTask(${task.id})">✕</button>
        `;
        doneList.appendChild(li);
    });
}

// Toggle Complete Status
function toggleDone(id) {
    tasks = tasks.map(task => {
        if (task.id === id) task.isDone = !task.isDone;
        return task;
    });
    renderTasks();
}

// Delete Single Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// Delete All Tasks
btnDeleteAll.addEventListener('click', () => {
    if (tasks.length === 0) return;
    if (confirm('Yakin ingin menghapus seluruh daftar To-Do?')) {
        tasks = [];
        renderTasks();
    }
});
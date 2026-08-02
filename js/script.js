// Local State Array & Default User State
let tasks = [];
let userProfile = {
  name: "Ahmad Darussalam",
  role: "Software Engineer",
  avatar: "assets/images/profile.jpg",
};

// DOM Elements
const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");

const todoTableBody = document.getElementById("todoTableBody");
const doneList = document.getElementById("doneList");
const btnDeleteAll = document.getElementById("btnDeleteAll");
const btnDeleteAllDone = document.getElementById("btnDeleteAllDone");

const todoCount = document.getElementById("todoCount");
const doneCount = document.getElementById("doneCount");
const emptyTodoMsg = document.getElementById("emptyTodoMsg");
const emptyDoneMsg = document.getElementById("emptyDoneMsg");

const btnEditProfile = document.getElementById("btnEditProfile");
const profileModal = document.getElementById("profileModal");
const btnCancelProfile = document.getElementById("btnCancelProfile");
const btnSaveProfile = document.getElementById("btnSaveProfile");

const inputName = document.getElementById("inputName");
const inputRole = document.getElementById("inputRole");
const inputAvatarFile = document.getElementById("inputAvatarFile");

document.addEventListener("DOMContentLoaded", () => {
  startRealtimeClock();
  setDefaultDueDate();
  renderTasks();
});

function startRealtimeClock() {
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("digitalClock").textContent =
      `${hours}:${minutes}:${seconds}`;

    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    document.getElementById("currentDay").textContent = days[now.getDay()];
    document.getElementById("currentDate").textContent =
      `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

btnEditProfile.addEventListener("click", () => {
  inputName.value = userProfile.name;
  inputRole.value = userProfile.role;
  inputAvatarFile.value = "";
  profileModal.style.display = "flex";
});

btnCancelProfile.addEventListener("click", () => {
  profileModal.style.display = "none";
});

btnSaveProfile.addEventListener("click", () => {
  const newName = inputName.value.trim();
  const newRole = inputRole.value.trim();
  const file = inputAvatarFile.files[0];

  if (newName) userProfile.name = newName;
  if (newRole) userProfile.role = newRole;

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      userProfile.avatar = e.target.result;
      document.getElementById("userAvatar").src = userProfile.avatar;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById("userName").textContent = userProfile.name;
  document.getElementById("userRole").textContent = userProfile.role;

  profileModal.style.display = "none";
});

function setDefaultDueDate() {
  const now = new Date();
  dueDateInput.value = now.toISOString().split("T")[0];
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const priority = document.querySelector(
    'input[name="priority"]:checked',
  ).value;
  const dueDate = dueDateInput.value;

  if (!taskText) return;

  const now = new Date();
  const createdFormatted =
    now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const newTask = {
    id: Date.now(),
    title: taskText,
    priority: priority,
    createdAt: createdFormatted,
    dueDate: dueDate,
    completedAt: null,
    isDone: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  setDefaultDueDate();
  renderTasks();
});

function isOverdue(dueDateString) {
  if (!dueDateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dueDateString);
  return today > deadline;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

function renderTasks() {
  todoTableBody.innerHTML = "";
  doneList.innerHTML = "";

  const activeTasks = tasks.filter((t) => !t.isDone);
  const completedTasks = tasks.filter((t) => t.isDone);

  todoCount.textContent = activeTasks.length;
  doneCount.textContent = completedTasks.length;

  emptyTodoMsg.style.display = activeTasks.length === 0 ? "block" : "none";
  emptyDoneMsg.style.display = completedTasks.length === 0 ? "block" : "none";

  activeTasks.forEach((task) => {
    const tr = document.createElement("tr");
    tr.className = "animated-row";
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
                ${
                  overdue
                    ? `<span class="badge badge-overdue">Late / Overdue</span>`
                    : `<small style="color: var(--primary-color);">Deadline: ${formatDate(task.dueDate)}</small>`
                }
            </td>
            <td>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
            </td>
        `;
    todoTableBody.appendChild(tr);
  });

  completedTasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "done-card-item animated-row";
    div.innerHTML = `
            <div class="done-item-info">
                <span class="done-item-title">${task.title}</span>
                <div class="done-item-meta">
                    <span class="badge-status-done">Done</span>
                    <small style="color: var(--text-secondary);">Selesai pada: ${task.completedAt}</small>
                </div>
            </div>
            <button class="btn-edit-profile" onclick="toggleDone(${task.id})">↩ Undo</button>
        `;
    doneList.appendChild(div);
  });
}

function toggleDone(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isNowDone = !task.isDone;
      const now = new Date();
      const doneFormatted =
        now.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      return {
        ...task,
        isDone: isNowDone,
        completedAt: isNowDone ? doneFormatted : null,
      };
    }
    return task;
  });
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

btnDeleteAll.addEventListener("click", () => {
  if (tasks.filter((t) => !t.isDone).length === 0) return;
  if (confirm("Yakin ingin menghapus seluruh daftar To-Do aktif?")) {
    tasks = tasks.filter((t) => t.isDone);
    renderTasks();
  }
});

btnDeleteAllDone.addEventListener("click", () => {
  if (tasks.filter((t) => t.isDone).length === 0) return;
  if (
    confirm("Yakin ingin menghapus seluruh riwayat tugas yang Selesai/Done?")
  ) {
    tasks = tasks.filter((t) => !t.isDone);
    renderTasks();
  }
});

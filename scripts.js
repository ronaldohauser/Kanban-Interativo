let taskIdCounter = 0;
let selectedTask = null;

function addTask(column, taskText = null) {
    const input = document.getElementById(`${column}-input`);
    const text = taskText ? taskText : input.value.trim();
    if (text === "") return;

    const task = document.createElement("div");
    task.className = "kanban-item";
    task.id = `task-${taskIdCounter++}`;
    task.draggable = true;
    task.onclick = () => selectTask(task);
    task.ondragstart = dragStart;

    const taskContent = document.createElement("span");
    taskContent.textContent = text;

    task.appendChild(taskContent);
    document.getElementById(`${column}-items`).appendChild(task);
    input.value = "";
    saveTasks();
    updateTaskCounts();
}

function selectTask(task) {
    if (selectedTask) {
        selectedTask.classList.remove('selected');
    }
    selectedTask = task;
    task.classList.add('selected');
}

function deleteSelectedTask(column) {
    if (selectedTask && selectedTask.parentElement.id === `${column}-items`) {
        if (confirm("Tem certeza que deseja deletar essa tarefa?")) {
            selectedTask.remove();
            saveTasks();
            updateTaskCounts();
            selectedTask = null;
        }
    }
}

function editSelectedTask(column) {
    if (selectedTask && selectedTask.parentElement.id === `${column}-items`) {
        const newText = prompt("Editar tarefa:", selectedTask.textContent);
        if (newText !== null) {
            selectedTask.querySelector("span").textContent = newText;
            saveTasks();
        }
    }
}

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const task = document.getElementById(id);
    if (event.target.classList.contains('kanban-items')) {
        event.target.appendChild(task);
        saveTasks();
        updateTaskCounts();
    }
}

function saveTasks() {
    const columns = document.querySelectorAll('.kanban-column');
    const data = {};
    columns.forEach(column => {
        const columnId = column.id;
        const tasks = [];
        column.querySelectorAll('.kanban-item span').forEach(task => {
            tasks.push(task.textContent);
        });
        data[columnId] = tasks;
    });
    localStorage.setItem('kanbanData', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    if (!data) return;
    Object.keys(data).forEach(columnId => {
        const tasks = data[columnId];
        tasks.forEach(taskText => {
            addTask(columnId, taskText);
        });
    });
    updateTaskCounts();
}

function updateTaskCounts() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        const count = column.querySelectorAll('.kanban-item').length;
        column.querySelector('.task-count').textContent = count;
    });
}

document.querySelectorAll('.kanban-items').forEach(column => {
    column.ondragover = dragOver;
    column.ondrop = drop;
});

window.onload = loadTasks;

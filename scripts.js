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
    task.ondblclick = () => editTask(task);

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
        const confirmation = confirm("Tem certeza que deseja deletar essa tarefa?");
        if (confirmation) {
            selectedTask.remove();
            saveTasks();
            updateTaskCounts();
            selectedTask = null;
        }
    }
}

function deleteTaskWithKey(event) {
    if (event.key === "Delete" || event.key === "del") {
        deleteSelectedTask('todo');
        deleteSelectedTask('in-progress');
        deleteSelectedTask('done');
    }
}

function editSelectedTask(column) {
    if (selectedTask && selectedTask.parentElement.id === `${column}-items`) {
        editTask(selectedTask);
    }
}

function editTask(task) {
    const newText = prompt("Editar tarefa:", task.querySelector("span").textContent);
    if (newText !== null) {
        task.querySelector("span").textContent = newText;
        saveTasks();
    }
}

function handleKeyPress(event, column) {
    if (event.key === "Enter") {
        addTask(column);
    }
}

function changeTaskColor(color) {
    if (selectedTask) {
        selectedTask.style.backgroundColor = color;
        saveTasks();
    } else {
        alert("Selecione uma tarefa para mudar a cor.");
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
        column.querySelectorAll('.kanban-item').forEach(task => {
            const taskText = task.querySelector("span").textContent;
            const taskColor = task.style.backgroundColor;
            tasks.push({ text: taskText, color: taskColor });
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
        tasks.forEach(task => {
            addTask(columnId, task.text);
            const addedTask = document.getElementById(`task-${taskIdCounter - 1}`);
            if (task.color) {
                addedTask.style.backgroundColor = task.color;
            }
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

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });

    const todoInput = document.getElementById('todo-input');
    const inProgressInput = document.getElementById('in-progress-input');
    const doneInput = document.getElementById('done-input');

    todoInput.addEventListener('keypress', (event) => handleKeyPress(event, 'todo'));
    inProgressInput.addEventListener('keypress', (event) => handleKeyPress(event, 'in-progress'));
    doneInput.addEventListener('keypress', (event) => handleKeyPress(event, 'done'));

    document.addEventListener('keydown', deleteTaskWithKey);
});

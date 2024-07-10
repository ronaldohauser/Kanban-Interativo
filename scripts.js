let taskIdCounter = 0;
let selectedTask = null;

// Função para adicionar tarefa
function addTask(column, taskText = null) {
    const input = document.getElementById(`${column}-input`);
    const text = taskText ? taskText : input.value.trim();
    if (text === "") return;

    // Criar novo elemento de tarefa
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

// Função para selecionar tarefa
function selectTask(task) {
    if (selectedTask) {
        selectedTask.classList.remove('selected');
    }
    selectedTask = task;
    task.classList.add('selected');
}

// Função para deletar tarefa selecionada
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

// Função para editar tarefa selecionada
function editSelectedTask(column) {
    if (selectedTask && selectedTask.parentElement.id === `${column}-items`) {
        editTask(selectedTask);
    }
}

// Função para editar tarefa
function editTask(task) {
    const newText = prompt("Editar tarefa:", task.querySelector("span").textContent);
    if (newText !== null) {
        task.querySelector("span").textContent = newText;
        saveTasks();
    }
}

// Função para iniciar arrastar tarefa
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
}

// Função para arrastar tarefa
function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

// Função para soltar tarefa
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

// Função para salvar tarefas no LocalStorage
function saveTasks() {
    const columns = document.querySelectorAll('.kanban-column');
    const data = {};
    columns.forEach(column => {
        const columnId = column.id;
        const tasks = [];
        column.querySelectorAll('.kanban-item').forEach(task => {
            const taskText = task.querySelector("span").textContent;
            tasks.push({ text: taskText });
        });
        data[columnId] = tasks;
    });
    localStorage.setItem('kanbanData', JSON.stringify(data));
}

// Função para carregar tarefas do LocalStorage
function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    if (!data) return;
    Object.keys(data).forEach(columnId => {
        const tasks = data[columnId];
        tasks.forEach(task => {
            addTask(columnId, task.text);
        });
    });
    updateTaskCounts();
}

// Função para atualizar contagem de tarefas
function updateTaskCounts() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        const count = column.querySelectorAll('.kanban-item').length;
        column.querySelector('.task-count').textContent = count;
    });
}

// Eventos ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });
});

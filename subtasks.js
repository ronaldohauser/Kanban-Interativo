function addSubtask(taskId) {
    const taskElement = document.getElementById(taskId);
    const subtaskText = prompt("Digite o texto da Subtask:");
    if (subtaskText) {
        const subtaskList = taskElement.querySelector('.subtasks');
        const newSubtask = document.createElement('li');
        newSubtask.textContent = subtaskText;
        newSubtask.onclick = () => editSubtask(newSubtask);
        subtaskList.appendChild(newSubtask);
        saveTasks(); // Salvar as subtasks no localStorage
    }
}

function editSubtask(subtask) {
    const newText = prompt("Editar subtask:", subtask.textContent);
    if (newText !== null) {
        subtask.textContent = newText;
        saveTasks();
    }
}

function deleteSubtask(subtask) {
    const confirmation = confirm("Tem certeza que deseja deletar essa subtask?");
    if (confirmation) {
        subtask.remove();
        saveTasks();
    }
}

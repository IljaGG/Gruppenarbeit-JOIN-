let currentDraggedElement;

async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
    updateHTML();
}


function updateHTML() {
    updateContainer('toDo');
    updateContainer('inProgress');
    updateContainer('testing');
    updateContainer('done');
}


function updateContainer(container) {
    let filteredTask = allTasks.filter(t => t['status'] == container);
    document.getElementById(container).innerHTML = ``;
    for (let i = 0; i < filteredTask.length; i++) {
        //Damit ID bei Drag and Drop wieder bei Null anfängt und nicht bei 1
        let task = filteredTask[i];
        let id = filteredTask[i]['id'] - 1;
        let date = filteredTask[i]['dueDate'];
        let formattedDate = new Date(date).toLocaleDateString('en-US')
        document.getElementById(container).innerHTML += HTMLTemplateTasks(i, task, id, formattedDate, filteredTask)
    }
}


function startDragging(id) {     // Weist die jeweilige Id, dem zu verschiebenen Element zu.
    currentDraggedElement = id;
}


function allowDrop(ev) {     // Verändert das Standarverhalten des Elements. Es wird z.B. Draggable. 
    ev.preventDefault();
}


function moveTo(status) {   // Sorgt dafür, dass das Element Draggable wird, indem die entsprechende category zugewiesen wird.
    allTasks[currentDraggedElement]['status'] = status
    backend.setItem('tasks', allTasks);
    updateHTML();
}


function highlight(category) {
    document.getElementById(category).classList.add('highlight');
}


function removeHighlight(category) {
    document.getElementById(category).classList.remove('highlight');
}

function HTMLTemplateTasks(i, task, id, formattedDate, filteredTask) {
    return /*html*/ `
            <div class="taskContainer" draggable="true" ondragstart="startDragging(${id})">
                <div class="spaceBetween">
                    <div>
                        <div class="taskID">Task ${task['id']}</div>
                        <div class="priority marginTop ${task['urgency']}">${task['urgency']}</div>
                    </div>
                    <div class="calendar marginTop">
                        <img class="marginRight" src="./img/calendar.png" alt="calendar">
                        <div>
                            <div class="dueDate">${formattedDate}</div>
                        </div>
                    </div>
                </div>
                <div id="assignedUser" class="assignedTo">
                    ${HTMLTemplateAssigendTo(filteredTask, i)}
                </div>
            </div>
    `;
}

function HTMLTemplateAssigendTo(filteredTask, i){
    let content = '';
    for (let j = 0; j < filteredTask[i]['assignedTo'].length; j++) {
        let user = filteredTask[i]['assignedTo'][j];
        content += /*html*/ `
        <div class="assignedToImgContainer">
            <p>${user}</p>
        </div>
        `
    }
    return content
}
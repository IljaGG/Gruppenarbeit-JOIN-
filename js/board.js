let currentDraggedElement;

async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
    updateHTML();
}

/**
 * This function calls another function for filling the HTML container
 */
function updateHTML() {
    updateContainer('toDo');
    updateContainer('inProgress');
    updateContainer('testing');
    updateContainer('done');
}

/**
 * This function filters the tasks to the respective container
 * e.g. all tasks with status = toDo are filled in the toDo-Section 
 * @param {string} container -- the ID of the HTML container
 */
function updateContainer(container) {
    let filteredTask = allTasks.filter(t => t['status'] == container);
    document.getElementById(container).innerHTML = ``;
    for (let i = 0; i < filteredTask.length; i++) {
        let task = filteredTask[i];
        //because of the zero-based index, 1 has to be subtracted
        let id = filteredTask[i]['id'] - 1;
        let date = filteredTask[i]['dueDate'];
        //change the unix timestamp to en-US-timestamp
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


/**
 * This function returns the content for the container
 * @param {number} i -- the number of the current element in the for-loop is used for the index of the filterd array 
 * @param {string} task -- current task of the array
 * @param {string} id -- ID-1 for drag and drop --> doesn´t work with i because this changes after dragging and dropping (filtered array changes)
 * @param {string} formattedDate
 * @param {string} filteredTask -- filtered Array (in total 4 different status)
 * @returns {string} --HTML content
 */
function HTMLTemplateTasks(i, task, id, formattedDate, filteredTask) {
    return /*html*/ `
            <div class="taskContainer" style="${styleBorderTop(task['category'])}" draggable="true" ondragstart="startDragging(${id})">
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

/**
 * This function returns the content for the assigned user. Because one than more user can be assigend to a task, a inner loop is needed
 * @param {number} i -- the number of the current element in the for-loop of the FILTERD array
 * @param {string} filteredTask -- filtered Array (in total 4 different status)
 * @returns {string} --HTML content
 */
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


/**
 * This function styles the color of the border corresponding to the category
 * @param {string} category -- category of the task
 */
function styleBorderTop(category){
    if (category == 'Marketing'){
        return `border-top: 4px solid #AF5784;`
    } else if (category == 'Product') {
        return `border-top: 4px solid #0E8179;`
    } else if (category == 'Sale') {
        return `border-top: 4px solid #6A39AB;`
    } else {
        return `border-top: 4px solid black;`
    }
}
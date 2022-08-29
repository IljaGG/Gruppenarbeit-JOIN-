let currentDraggedElement;

async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
    await setDragAndDropId();
    updateHTML();
}

/**
 * This function is used to set the id of every task dynamically
 * This is important if any task is deleted because the drag and drop depends of the length of the array
 * If a task is deleted, the id starts counting from zero
 */
function setDragAndDropId() {
    for (let i = 0; i < allTasks.length; i++) {
        allTasks[i]['dragAndDropId'] = i;
    }
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
        let date = filteredTask[i]['dueDate'];
        //change the unix timestamp to en-US-timestamp
        let formattedDate = new Date(date).toLocaleDateString('en-US')
        document.getElementById(container).innerHTML += HTMLTemplateTasks(i, task, formattedDate, filteredTask)
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
 * @param {string} formattedDate
 * @param {string} filteredTask -- filtered Array (in total 4 different status)
 * @returns {string} --HTML content
 */
function HTMLTemplateTasks(i, task, formattedDate, filteredTask) {
    return /*html*/ `
            <div class="taskContainer" style="${styleBorderTop(task['category'])}" draggable="true" ondragstart="startDragging(${task['dragAndDropId']})">
                <div class="spaceBetween">
                    <div>
                        <div class="taskID">Task ${task['taskId']}</div>
                        <div class="priority marginTop ${task['urgency']}">${task['urgency']}</div>
                    </div>
                    <div class="toogleDescription" id="toggle${task['dragAndDropId']}"> 
                        <div id="description${task['dragAndDropId']}" class="singleDescription" contenteditable="true">
                            ${task['description']}
                        </div>
                        <div class="task-icons description">
                            <span onclick="closeDescription(${task['dragAndDropId']})" class="material-icons close">
                                close
                            </span>
                            <span onclick="overwriteDescription(${task['dragAndDropId']})"  class="material-icons done">
                                done
                            </span>  
                        </div>
                    </div>
                    <div class="calendar marginTop">
                        <img class="marginRight" src="./img/calendar.png" alt="calendar">
                        <div>
                            <div class="dueDate">${formattedDate}</div>
                        </div>
                    </div>
                </div>
                <div class="spaceBetween end">
                    <div id="assignedUser" class="assignedToImgContainerMain noPadding">
                        ${HTMLTemplateAssigendTo(filteredTask, i)}
                    </div>
                    <div class="task-icons">
                        <span onclick="toggleSlide(${task['dragAndDropId']})"  id="note" class="material-symbols-outlined">
                            description
                        </span>
                        <img onclick="deleteBacklogCard(${task['dragAndDropId']})" class="trash" src="./img/trash.png" alt="Trash">
                    </div>
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
function HTMLTemplateAssigendTo(filteredTask, i) {
    let content = '';
    for (let j = 0; j < filteredTask[i]['assignedTo'].length; j++) {
        let user = filteredTask[i]['assignedTo'][j];
        content += /*html*/ `
        <img class="assignedToImgContainer objectFit backlogStyle noPadding" src="./img/${user}" alt="">
        `
    }
    return content
}


/**
 * This function styles the color of the border corresponding to the category
 * @param {string} category -- category of the task
 */
function styleBorderTop(category) {
    if (category == 'Marketing') {
        return `border-top: 4px solid #AF5784;`
    } else if (category == 'Product') {
        return `border-top: 4px solid #0E8179;`
    } else if (category == 'Sale') {
        return `border-top: 4px solid #6A39AB;`
    } else {
        return `border-top: 4px solid black;`
    }
}

/**
 * This function is used to delete a task from the board
 *  * @param {string} id -- makes sure the selected card is deleted
 */
function deleteBacklogCard(id) {
    allTasks.splice(id, 1);
    backend.setItem('tasks', allTasks);
    setDragAndDropId();
    updateHTML();
}

/**
 * This function is used to toogle the slidebar of the task description
 *  * @param {string} id -- id of the div-element from a task
 */
function toggleSlide(id) {
    let div = document.getElementById('toggle' + id)
    if (div.classList.contains('open')) {
        div.classList.remove('open')
    } else {
        div.classList.add('open')
    }
}

/**
 * This function is used to close the dialog of the description and reset the values
 *  * @param {string} id -- id of the current element
 */
function closeDescription(id) {
    let oldDescription = allTasks[id]['description'];
    let container = document.getElementById('description' + id);
    container.innerHTML = oldDescription;
    //close the dialog
    toggleSlide(id);
}

/**
 * This function is used to update the description of a task 
 *  * @param {string} id -- id of the current element
 */
function overwriteDescription(id) {
    let container = document.getElementById('description' + id);
    allTasks[id]['description'] = container.innerHTML;
    backend.setItem('tasks', allTasks);
    updateHTML();
}


/**
 * This function is used to show and hide the responsive Navbar.
 *  
 */
 function openMenu() {
    let navbar = document.getElementById('navbar');
    let columnContainer = document.getElementById('columnContainer');
    let imgMenu = document.getElementById('imgMenu');

    imgMenu.addEventListener('click', () => {
        navbar.classList.toggle('d-flex');
        columnContainer.classList.toggle('d-none');
    });
}

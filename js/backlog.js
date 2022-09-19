async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
    await setDragAndDropId();
    render();
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
 * This function is used to pull all backlog-tasks from the array allTasks into backlogcards.
 */
function render() {
    backlogInfo = document.getElementById('backlogCardInfo');
    backlogTasks = document.getElementById('backlogTasks');
    backlogTasks.innerHTML = '';
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');

    for (let i = 0; i < filteredTask.length; i++) {
        let backlogTask = filteredTask[i];
        let id = filteredTask[i]['dragAndDropId'];

        backlogTasks.innerHTML += `
    <div class="backlogCard">
       <div id="tiny-color" class="${backlogTask['category']}"></div>
       <div class="assignedToImgContainerMain noPadding max-width">
        <div>${HTMLTemplateAssigendTo(i, filteredTask)}</div>
       </div>
       <div class="centered max-width">${backlogTask['category']}</div>
       <div class="description-width text-align-right max-width">${backlogTask['description']}</div>
       <div class="zoom" onclick="showInfo(${id})"> <img src="img/zoom.png" title="Show Info"> </div>
       <div class="trash" onclick="deleteBacklogCard(${id})"> <img src="img/trash.png" title="Delete Task"> </div>
       <div class="send" onclick="addToDos(${id})"> <img src="img/send.png" title="Send to Board"> </div>
    </div>
    `
    }
}


function showInfo(i) {
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');
    backlogInfo = document.getElementById('backlogCardInfo');
    headlines = document.getElementById('headlines');
    backlogTasks = document.getElementById('backlogTasks');
    backlogInfo.classList.remove('d-none');
    headlines.classList.add('d-none');
    backlogTasks.classList.add('d-none');
    backlogInfo.innerHTML = `${returnBacklogInfoHTML(filteredTask, i)}`;
}


function closeInfo() {
    backlogInfo = document.getElementById('backlogCardInfo');
    headlines = document.getElementById('headlines');
    backlogTasks = document.getElementById('backlogTasks');
    backlogInfo.classList.add('d-none');
    headlines.classList.remove('d-none');
    backlogTasks.classList.remove('d-none');
}


function returnBacklogInfoHTML(filteredTask, i) {
    return `
    <div class="backlogInfo">
        <form onsubmit="updateBacklogCard(${i}); return false">
            <div class="title">
                <h2>TITLE</h2>
                <input id="backlogTaskTitle" type="text" value="${filteredTask[i]['title']}">
            </div>
            <div class="dueDate">
                <h2>DUE DATE</h2>
                <input value="${filteredTask[i]['dueDate']}" id="backlogTaskDueDate" type="text" onfocus="(this.type='date')">
            </div> <br>
            <div class="category">
                <h2>CATEGORY</h2>
                    <select id="backlogTaskCategory">
                        <option value="" disabled selected hidden>${filteredTask[i]['category']}</option>
                        <option>Marketing</option>
                        <option>Product</option>
                        <option>Sale</option>
                    </select>
            </div>
            <div class="urgency">
                <h2>URGENCY</h2>
                <select id="backlogTaskUrgency">
                    <option value="" disabled selected hidden>${filteredTask[i]['urgency']}</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
            <div class="description">
                <h2>DESCRIPTION</h2>
                <textarea id="backlogTaskDescription" required="" maxlength="180">${filteredTask[i]['description']}</textarea>
            </div>
            <div class="assignedTo">
                <h2>ASSIGNED TO</h2>
                <div>${HTMLTemplateAssigendTo(i, filteredTask)}
            </div>
            <div class="buttonContainerBacklog">  
                <button class="cancelButton cancelButton:hover" onclick="closeInfo()"> Cancel </button>
                <button class="createTaskButton createTaskButton:hover"> Save </button>
            </div>
        </form>
    </div>
    `
}


async function updateBacklogCard(i) {
    allTasks[i]['title'] = document.getElementById('backlogTaskTitle').value;
    allTasks[i]['dueDate'] = document.getElementById('backlogTaskDueDate').value;
    allTasks[i]['category'] = document.getElementById('backlogTaskCategory').value;
    allTasks[i]['urgency'] = document.getElementById('backlogTaskUrgency').value;
    allTasks[i]['description'] = document.getElementById('backlogTaskDescription').value;
    setDragAndDropId();
    await backend.setItem('tasks', allTasks);
    window.location.href = 'backlog.html';
}


function getValuesForBacklogTasks() {
    let title = document.getElementById('backlogTaskTitle');
    let category = document.getElementById('backlogTaskCategory');
    let description = document.getElementById('taskDescription');
    let dueDate = document.getElementById('backlogTaskDueDate');
    let createdDate = new Date().getTime(); //only text-format could be safed in storage --> change object to getTime (UnixTimestamp since 01.01.1970)
    let urgency = document.getElementById('backlogTaskUrgency');
    let assignedTo = selectedUser;
    return [title, category, description, dueDate, createdDate, urgency, assignedTo]
}


function updateBacklogTask(taskStatus) {
    [title, category, description, dueDate,
        createdDate, urgency, assignedTo] = getValuesForBacklogTasks();
    let task = {
        'taskId': getNextId(),
        'dragAndDropId': '',
        'title': title.value,
        'category': category.value,
        'status': taskStatus,
        'description': description.value,
        'dueDate': dueDate.value,
        'createdDate': createdDate,
        'urgency': urgency.value,
        'assignedTo': assignedTo,
    };
    allTasks.push(task);
    backend.setItem('tasks', allTasks)
}


/**
 * This function returns the content for the assigned user. Because one than more user can be assigend to a task, a inner loop is needed
 * @param {number} filteredTask -- the number of the current element in the for-loop of the FILTERD array
 * @returns {string} --HTML content
 */
function HTMLTemplateAssigendTo(i, filteredTask) {
    let content = '';
    for (let j = 0; j < filteredTask[i]['assignedTo'].length; j++) {
        let user = filteredTask[i]['assignedTo'][j];
        content += /*html*/ ` 
            <img class="assignedToImgContainer objectFit backlogStyle" src="./img/${user}" alt="">
        `
    }
    return content
}

/**
 * This function is used to delete the current backlogcard
 *  * @param {string} i -- makes sure, the current card is deleted
 */

function deleteBacklogCard(i) {
    allTasks.splice(i, 1);
    backend.setItem('tasks', allTasks);
    setDragAndDropId();
    render();
}


function addToDos(i) {
    allTasks[i]['status'] = 'toDo';
    backend.setItem('tasks', allTasks);
    render();
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
        backlogMainContainer.classList.toggle('d-none');
    });
}


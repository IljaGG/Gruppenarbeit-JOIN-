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
    if (allTasks.filter(t => t['status'] == 'backlog').length == 0) {
        let headlines = document.getElementById('headlines');
        headlines.classList.add('d-none');
        backlogTasks.innerHTML = `<div class="emptyBacklogCard">No tasks in backlog</div>`;
    } else {
        for (let i = 0; i < filteredTask.length; i++) {
            let backlogTask = filteredTask[i];
            let id = filteredTask[i]['dragAndDropId'];
                backlogTasks.innerHTML += `
                <div class="backlogCard">
                <div id="tiny-color" class="${backlogTask['category']}"></div>
                <div class="assignedToImgContainerMain noPadding max-width">
                <div>${HTMLTemplateAssigendTo(filteredTask, i)}</div>
                </div>
                <div class="centered max-width">${backlogTask['category']}</div>
                <div class="description-width text-align-right max-width">${backlogTask['description']}</div>
                <div class="zoom" onclick="showInfo(${filteredTask, i})"> <img src="img/zoom.png" title="Show Info"> </div>
               <div class="trash" onclick="deleteBacklogCard(${id})"> <img src="img/trash.png" title="Delete Task"> </div>
               <div class="send" onclick="addToDos(${i})"> <img src="img/send.png" title="Send to Board"> </div>
            </div>
            `
        }
    }
        
}

/**
 * This function filters the status 'backlog' and displays all informations from a backlogcard in an overlayed window
 * @param {number} i 
 */
function showInfo(i) {
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');
    backlogInfo = document.getElementById('backlogCardInfo');
    headlines = document.getElementById('headlines');
    backlogTasks = document.getElementById('backlogTasks');
    backlogInfo.classList.remove('d-none');
    headlines.classList.add('d-none');
    backlogTasks.classList.add('d-none');
    backlogInfo.innerHTML = `${returnBacklogInfoHTML(filteredTask, i)}`;
    checkSelectedUser(filteredTask, i);
}

/**
 * This function closes backlogcards info-window
 */
function closeInfo() {
    backlogInfo = document.getElementById('backlogCardInfo');
    headlines = document.getElementById('headlines');
    backlogTasks = document.getElementById('backlogTasks');
    backlogInfo.classList.add('d-none');
    headlines.classList.remove('d-none');
    backlogTasks.classList.remove('d-none');
}

/**
 * This function returns HTMl into the showInfo function
 * @param {string} filteredTask -- filters for status 'backlog'
 * @param {number} i 
 * @returns HTML content
 */
function returnBacklogInfoHTML(filteredTask, i) {
    return `
        <div class="backlogInfo">
            <form onsubmit="updateBacklogCard(${filteredTask, i}); return false">
                <div class="left-half">
                ${returnTitleHTML(filteredTask, i)}
                ${returnCategoryHTML(filteredTask, i)}
                ${returnDescriptionHTML(filteredTask, i)} 
                </div>
                <div class="right-half ">
                ${returnDueDateHTML(filteredTask, i)}
                ${returnUrgencyHTML(filteredTask, i)}   
                ${returnAssignedToHTML(filteredTask, i)}   
                <div class="buttonContainerBacklog">  
                    <button type="button" class="cancelButton cancelButton:hover" onclick="closeInfo()"> Cancel </button>
                    <button class="createTaskButton createTaskButton:hover"> Save </button>
                </div>
                </div>
            </form>
        </div>`
}

function checkSelectedUser(filteredTask, i) {
    selectedUser = [];
    for (let j = 0; j < filteredTask[i]['assignedTo'].length; j++) {
        let currentUser = filteredTask[i]['assignedTo'][j];
        fillSelectedUser(currentUser);
    }
}

function fillSelectedUser(currentUser) {
    let userID = document.getElementById('Backlog-' + currentUser);
    userID.classList.add('avatar-selected');
    selectedUser.push(currentUser);
}

/**
 * This function updates the BacklogCard changes
 * @param {number} i -- the number of the current element in the for-loop of the FILTERD array
 */
async function updateBacklogCard(i) {
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');
    filteredTask[i]['title'] = document.getElementById('backlogTaskTitle').value;
    filteredTask[i]['dueDate'] = document.getElementById('backlogTaskDueDate').value;
    filteredTask[i]['category'] = document.getElementById('backlogTaskCategory').value;
    filteredTask[i]['urgency'] = document.getElementById('backlogTaskUrgency').value;
    filteredTask[i]['description'] = document.getElementById('backlogTaskDescription').value;
    filteredTask[i]['assignedTo'] = selectedUser;
    setDragAndDropId();
    await backend.setItem('tasks', allTasks);
    closeInfo();
    render();
}


/**
 * This function returns the content for the assigned user. Because one than more user can be assigend to a task, a inner loop is needed
 * @param {number} filteredTask -- the number of the current element in the for-loop of the FILTERD array
 * @returns {string} --HTML content
 */
//alte function zum laufen bringen
function HTMLTemplateAssigendTo(filteredTask, i) {
    let content = '';
    for (let j = 0; j < filteredTask[i]['assignedTo'].length; j++) {
        let user = filteredTask[i]['assignedTo'][j];
        content += /*html*/ ` 
            <img class="assignedToImgContainerBacklog objectFit backlogStyle" src="./img/${user}" alt="">
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

/**
 * This function sends the backlogcard to the board
 * @param {number} i 
 */
function addToDos(i) {
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');
    filteredTask[i]['status'] = 'toDo';
    backend.setItem('tasks', allTasks);
    render();
}


/**
 * This function is used to show and hide the responsive Navbar.
 *  
 */
function openMenu() {
    let navbar = document.getElementById('navbar');
    let imgMenu = document.getElementById('imgMenu');

    imgMenu.addEventListener('click', () => {
        navbar.classList.toggle('d-flex');
        backlogMainContainer.classList.toggle('d-none');
    });
}


/**
 * This function returns HTML-content
 * @param {string} filteredTask 
 * @param {number} i 
 * @returns HTML content
 */
function returnTitleHTML(filteredTask, i) {
    return `
    <div class="title">
        <h2>TITLE</h2>
        <input id="backlogTaskTitle" type="text" value="${filteredTask[i]['title']}">
    </div>
    `
}


/**
 * This function returns HTML-content
 * @param {string} filteredTask 
 * @param {number} i 
 * @returns HTML content
 */
function returnDueDateHTML(filteredTask, i) {
    return `
         <div class="dueDate">
            <h2>DUE DATE</h2>
            <input value="${filteredTask[i]['dueDate']}" id="backlogTaskDueDate" type="text" onfocus="(this.type='date')">
        </div> <br>`
}


/**
 * This function returns HTML-content
 * @param {string} filteredTask 
 * @param {number} i 
 * @returns HTML content
 */
function returnCategoryHTML(filteredTask, i) {
    return `
    <div class="category">
        <h2>CATEGORY</h2>
            <select id="backlogTaskCategory">
                <option value="${filteredTask[i]['category']}" disabled selected hidden>${filteredTask[i]['category']}</option>
                <option>Marketing</option>
                <option>Product</option>
                <option>Sale</option>
            </select>
    </div>`
}


/**
 * This function returns HTML-content
 * @param {string} filteredTask 
 * @param {number} i 
 * @returns HTML content
 */
function returnDescriptionHTML(filteredTask, i) {
    return `
    <div class="description">
        <h2>DESCRIPTION</h2>
        <textarea id="backlogTaskDescription" required="" maxlength="180">${filteredTask[i]['description']}</textarea>
    </div>
    `
}


/**
 * This function returns HTML-content
 * @param {string} filteredTask 
 * @param {number} i 
 * @returns HTML content
 */
function returnUrgencyHTML(filteredTask, i) {
    return `
    <div class="urgency">
        <h2 class="urgecy-h2">URGENCY</h2>
        <select id="backlogTaskUrgency">
            <option value="${filteredTask[i]['urgency']}" disabled selected hidden>${filteredTask[i]['urgency']}</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
    </div>
    `
}


/**
 * This function returns HTML-content
 * @returns HTML content
 */
function returnAssignedToHTML() {
    return `
    <div class="assignedTo">
        <h2>ASSIGNED TO</h2>
        <div class="assignedToImgContainerMain">
            <img id="Backlog-TP.png" onclick="selectUser('Backlog-','TP.png',0)" class="assignedToImgContainer objectFit"
                src="./img/TP.png" alt="TP.png">
            <img id="Backlog-IG.png" onclick="selectUser('Backlog-','IG.png',1)" class="assignedToImgContainer objectFit"
                src="./img/IG.png" alt="IG.png">
            <img id="Backlog-VW.png" onclick="selectUser('Backlog-','VW.png',2)" class="assignedToImgContainer objectFit"
                src="./img/VW.png" alt="VW.png">
            <img id="Backlog-RD.png" onclick="selectUser('Backlog-','RD.png',3)" class="assignedToImgContainer objectFit"
                src="./img/RD.png" alt="RD.png">
        </div>
    </div>
    `
}


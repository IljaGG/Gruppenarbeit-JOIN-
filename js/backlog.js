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
function setDragAndDropId(){
    for (let i = 0; i < allTasks.length; i++) {
        allTasks[i]['dragAndDropId'] = i;
    }
}

/**
 * This function is used to pull all backlog-tasks from the array allTasks into backlogcards.
 */
function render() {
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
       <div class="trash" onclick="deleteBacklogCard(${id})"> <img src="img/trash.png" title="Delete Task"> </div>
       <div class="send" onclick="addToDos(${id})"> <img src="img/send.png" title="Send to Board"> </div>
    </div>
    `
    }
}

/**
 * This function returns the content for the assigned user. Because one than more user can be assigend to a task, a inner loop is needed
 * @param {number} filteredTask -- the number of the current element in the for-loop of the FILTERD array
 * @returns {string} --HTML content
 */
 function HTMLTemplateAssigendTo(i, filteredTask){
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

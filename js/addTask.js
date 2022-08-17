let selectedUser = [];
let allTasks = [];
let inicialTaskID = 1;

async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
}

/**
 * This function is used to select the "assigned to"-User. More than one user can be selected
 * @param {string} pickedUser -- the ID of the current User is used to push them into the currentUser-Array
 */
function selectUser(pickedUser) {
    let user = document.getElementById(pickedUser);
    user.classList.toggle('avatar-selected');
    if (selectedUser.includes(pickedUser)) {
        //if a user is clicked twice it should be deleted from the array
        selectedUser = selectedUser.filter(a => a != pickedUser);
    } else {
        //push the selected user into the array if the value isn´t available yet
        selectedUser.push(pickedUser)
    }
}

/**
 * This function is used to check if a user is assigned to a task.
 * If at least one user is selected, the overlay for the next option will pop up,
 * otherwise the form-Element isn´t be submitted
 */
function createTask() {
    //manual check if a task is assigend to a user
    let selectedUserCounter = checkIfUserIsSelected();
    if (selectedUserCounter == 0) {
        overlay('overlayUser');
        return false
    } else {
        overlay('overlayTaskBordBacklog');
    }
}

/**
 * This function is used to create the Task and add it to the storage
 *  * @param {string} taskStatus -- after creating a task the user is asked to push the task into backlog or toDo
 */
function addTask(taskStatus) {
    [title, category, description, dueDate,
        createdDate, urgency, assignedTo] = getValuesForTasks();
    let task = {
        'id': getNextId(),
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
 * This function is used return the ID for the next task for the array
 */
function getNextId(){
    if (allTasks.length === 0) {
        return inicialTaskID;
    } else if (getLastID() === 0) {
        return inicialTaskID++
    } else {
        let lastTaskID = getLastID()
        return lastTaskID
    }
}

/**
 * This function is used return the ID of the last element in the array
 */
function getLastID(){
    let lastTaskID = allTasks[allTasks.length - 1]['id'];
    lastTaskID++
    return lastTaskID
}

/**
 * This function is used to return the ids and/or values of the input fields for the current task
 */
function getValuesForTasks() {
    let title = document.getElementById('taskTitle');
    let category = document.getElementById('taskCategory');
    let description = document.getElementById('taskDescription');
    let dueDate = document.getElementById('taskDueDate');
    let createdDate = new Date().getTime(); //only text-format could be safed in storage --> change object to getTime (UnixTimestamp since 01.01.1970)
    let urgency = document.getElementById('taskUrgency');
    let assignedTo = selectedUser;
    return [title, category, description, dueDate, createdDate, urgency, assignedTo]
}

/**
 * This function is used to reset the input fields after creating a task
 * It is used after creating a task or when a task is being cancelled
 */
function resetInputFields() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskCategory').value = 'Marketing';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskUrgency').value = 'High';
    //reset all the selected users 
    let resetSelectedUser = document.getElementsByClassName('assignedToImgContainer');
    for (let i = 0; i < resetSelectedUser.length; i++) {
        resetSelectedUser[i].classList.remove('avatar-selected')
    }
    selectedUser = [];
}

/**
 * This function is used to check if a user is seleced
 * This is done by checking if the class name 'avatar-seleced' is assigned to the elements
 */
function checkIfUserIsSelected() {
    let user = document.getElementsByClassName('assignedToImgContainer');
    let selectedUserCounter = 0;
    for (let i = 0; i < user.length; i++) {
        if (user[i].classList.contains('avatar-selected')) {
            selectedUserCounter++;
        }
    }
    return selectedUserCounter
}

/**
 * This function is used to put the user through the process after clicking the button 'CREATE TASK'
 * @param {string} id -- the ID of the container where the display-property should be changed
 */
function overlay(id) {
    let container = document.getElementById(id);
    if (container.style.display == 'flex') {
        container.style.display = 'none'
    } else {
        container.style.display = 'flex'
    }
}

/**
 * This function is used to redirect the user to a certain url 
 * @param {string} url -- relative URL where the page is located
 */
function redirection(url){
    location.href = url
}


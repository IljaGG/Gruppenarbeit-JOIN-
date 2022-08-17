async function init() {
    await downloadFromServer();
    allTasks = await backend.getItem('tasks') || [];
    render();
}

/**
 * This function is used to pull all backlog-tasks from the array allTasks into backlogcards.
 */
function render() {
    backlogTasks = document.getElementById('backlogTasks');
    backlogTasks.innerHTML = '';
    let filteredTask = allTasks.filter(t => t['status'] == 'backlog');

    for (let i = 0; i < filteredTask.length; i++) {
        let backlogTask = allTasks[i];
        
        backlogTasks.innerHTML += `
    <div class="backlogCard">
       <div id="tiny-color" class="${backlogTask['category']}"></div>
       <div class="description-width">${backlogTask['assignedTo']}</div>
       <div class="centered">${backlogTask['category']}</div>
       <div class="description-width text-align-right">${backlogTask['description']}</div>
       <div> <img src="img/trash.png"> </div>
    </div>
    `
    }
}



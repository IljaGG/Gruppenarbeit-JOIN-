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
        document.getElementById(container).innerHTML += HTMLTemplate(task, id)
    }
}


function startDragging(id) {     // Weist die jeweilige Id, dem zu verschiebenen Element zu.
    currentDraggedElement = id;
    console.log(currentDraggedElement)
}


function allowDrop(ev) {     // Verändert das Standarverhalten des Elements. Es wird z.B. Draggable. 
    ev.preventDefault();
}


function moveTo(status) {   // Sorgt dafür, dass das Element Draggable wird, indem die entsprechende category zugewiesen wird.
    //update in dem Array auf die neue Kategorie
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


///////////// HTML Templates /////////////
function HTMLTemplate(task, id) {
    return `
        <div class="draggedElement" draggable="true" ondragstart="startDragging(${id})">
          <p class="textCenter">${task['id']}</p>
        </div>
    `;
}

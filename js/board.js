let tasks = [
    {
        'id': 0,
        'title': 'laufen',
        'category': 'toDo',
    },


    {
        'id': 1,
        'title': 'gehen',
        'category': 'inProgress',
    },


    {
        'id': 2,
        'title': 'spazieren',
        'category': 'testing',
    },


    {
        'id': 3,
        'title': 'noch mehr spazieren',
        'category': 'done',
    },
];


function updateHTML() {
    let toDo = tasks.filter(t => t['category'] == 'toDo');
    document.getElementById('toDo').innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        const toDoColumn = toDo[i];
        document.getElementById('toDo').innerHTML += templateToDoTask(toDo, toDoColumn);
    }


    let inProgress = tasks.filter(p => p['category'] == 'inProgress');
    document.getElementById('inProgress').innerHTML = ``;
    for (let i = 0; i < inProgress.length; i++) {
        const inProgressColumn = inProgress[i];
        document.getElementById('inProgress').innerHTML += templateInProgressTask(inProgress, inProgressColumn);
    }


    let testing = tasks.filter(te => te['category'] == 'testing');
    document.getElementById('testing').innerHTML = ``;
    for (let i = 0; i < testing.length; i++) {
        const testingColumn = testing[i];
        document.getElementById('testing').innerHTML += templateTestingTask(testing, testingColumn);
    }


    let done = tasks.filter(d => d['category'] == 'done');
    document.getElementById('done').innerHTML = ``;
    for (let i = 0; i < done.length; i++) {
        const doneColumn = done[i];
        document.getElementById('done').innerHTML += templateDoneTask(done, doneColumn);
    }
}


let currentDraggedElement;


function startDragging(id) {     // Weist die jeweilige Id, dem zu verschiebenen Element zu.
    currentDraggedElement = id;
}


function allowDrop(ev) {     // Verändert das Standarverhalten des Elements. Es wird z.B. Draggable. 
    ev.preventDefault();
}


function moveTo(category) {   // Sorgt dafür, dass das Element Draggable wird, indem die entsprechende category zugewiesen wird.
    tasks[currentDraggedElement]['category'] = category;
    updateHTML();
}


function highlight(category) {
    document.getElementById(category).classList.add('highlight');
}


function removeHighlight(category) {
    document.getElementById(category).classList.remove('highlight');
}


///////////// HTML Templates /////////////
function templateToDoTask(toDo, toDoColumn) {
    return `
        <div class="draggedElement" draggable="true" ondragstart="startDragging(${toDoColumn['id']})">
          <p class="textCenter">${toDoColumn['title']}</p>
        </div>
    `;
}


function templateInProgressTask(inProgress, inProgressColumn) {
    return `
        <div class="draggedElement" draggable="true" ondragstart="startDragging(${inProgressColumn['id']})">
          <p class="textCenter">${inProgressColumn['title']}</p>
        </div>
    `;
}


function templateTestingTask(testing, testingColumn) {
    return `
        <div class="draggedElement" draggable="true" ondragstart="startDragging(${testingColumn['id']})">
          <p class="textCenter">${testingColumn['title']}</p>
        </div>
    `;
}


function templateDoneTask(done, doneColumn) {
    return `
        <div class="draggedElement" draggable="true" ondragstart="startDragging(${doneColumn['id']})">
          <p class="textCenter">${doneColumn['title']}</p>
        </div>
    `;
}
///////////// HTML Templates /////////////



async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');    //////// Greift bzw. fragt nach allen Elemente mit "w3-include-html".  //////// 
    for (let i = 0; i < includeElements.length; i++) {           //////// Standar for-schleife ////////      
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");  //////// templatesHTML/header.html //////// 
        let response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();        //////// Abfrage ob Datei gefunden wurde oder nicht. //////// 
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

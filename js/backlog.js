async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    backend.setItem('Test', 'Hallo')
    render();
    console.log(users);
    
}


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

function render() {
    backlogTasks = document.getElementById('backlogTasks');
    backlogTasks.innerHTML = '';

   

    for (let i = 0; i < allTasks.length; i++) {
        const backlogTask = allTasks[i];
        backlogTasks.innerHTML += `
       <div class="backlogCard">${backlogTask['assignedTo']}</div>
        `
    }
}




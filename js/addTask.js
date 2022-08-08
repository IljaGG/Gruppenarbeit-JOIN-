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



function createTask() {
    
}
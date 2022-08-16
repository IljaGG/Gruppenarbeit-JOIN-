let users = [];
let newUser = [];
let loggedIn = true;



// setURL('https://gruppe-292-join.developerakademie.net/smallest_backend_ever');


async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem(`${users}`)) || [];
    backend.setItem('Test', 'Hallo')

    console.log(users);
}


function getId(theId) {
    return document.getElementById(theId);
}


function login() {
    let actualUser = getId('userName').value;
    let password = getId('password').value;
    let loggedUser = JSON.parse(localStorage.getItem('newUser'));

}


function getRegistrated() {
    let actualUser = getId('userName').value;
    let password = getId('password').value;
    let email = getId('email').value;

    let loggedUser = JSON.parse(localStorage.getItem('newUser'));

    if (loggedUser === null) {
        newUser = [{
            'user': actualUser,
            'password': password,
            'email': email
        }];
        saveInLocalStorage(newUser);
        window.location.href = './addTask.html';
    }

    if (loggedUser[0].user === actualUser && loggedUser[0].password === password && loggedUser[0].email === email) {
        let error = getId('errorMessage');
        error.innerHTML = '';
        error.innerHTML += createErrorBox();
    }

}


function createErrorBox() {
    return /*html*/ `
    <div class = "errorBox"><span>This User already exists</span></div>
`
}


function saveInLocalStorage(newUser) {
    newUser = JSON.stringify(newUser)
    localStorage.setItem('newUser', newUser);
}


function showRegistrateSection() {
    let registration = document.getElementById('registrate');
    document.getElementById('loginBtn').style = 'display: none';
    document.getElementById('registerBtn').style = 'display: none';
    registration.innerHTML = '';
    registration.innerHTML += /*html*/ `
        <input required type="email" id="email" minlength="3" placeholder="Enter Email" name="email">
        <button class="btn" id="registerBtn" type="submit" required onclick="getRegistrated()">Registrieren</button>
    `
}


function checkIfUserIsLoggedIn() {

    if (localStorage.getItem("loggedInKey") === null) {
        window.location.href = './index.html'
        // localStorage.setItem('loggedInKey', `${loggedIn}`);
    } else {
        window.location.href = './addTask.html'
    }
}


function guestLogin() {
    if (localStorage.getItem("loggedInKey") === null) {
        localStorage.setItem('loggedInKey', `${loggedIn}`)
    }

    window.location.href = './addTask.html';
}


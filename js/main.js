let newUser = [];
let loggedIn = true;

/**
 * This Function is a simplified spelling for document.getElementById
 * @param {string} theId is used for the actual Id
 * @returns document.getElementById();
 */
function getId(theId) {
    return document.getElementById(theId);
}


function login() {
    let actualUser = getId('userName').value;
    let password = getId('password').value;
    let loggedUser = JSON.parse(localStorage.getItem('newUser'));

}

/**
 * This function is used for checking or setting the registration
 */
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
        setDefault();
        window.location.href = './board.html';
    }


    if (loggedUser[0].user === actualUser && loggedUser[0].password === password && loggedUser[0].email === email) {
        let error = getId('errorMessage');
        error.innerHTML = '';
        error.innerHTML += createErrorBox();
    }

}

/**
 * This function returns an html part wich is used for an error message
 * @returns html part
 */
function createErrorBox() {
    return /*html*/ `
    <div class = "errorBox"><span><b>This User already exists</b></span></div>
`
}

/**
 * This function is for setting an User in Local Storage and as soon as possible in the backend
 * @param {string} newUser 
 */
function saveInLocalStorage(newUser) {
    newUser = JSON.stringify(newUser)
    localStorage.setItem('newUser', newUser);
}

/**
 * shows the html part for the Registration Section
 */
function showRegistrateSection() {
    let registration = getId('registrate');
    getId('loginBtn').style = 'display: none';
    getId('registerBtn').style = 'display: none';
    registration.innerHTML = '';
    registration.innerHTML += /*html*/ `
        <input required type="email" id="email" minlength="3" placeholder="Enter Email" name="email">
        <button class="btn" id="registerBtn" type="submit" required onclick="getRegistrated()">Register</button>
    `
}

/**
 * This function is for checking if the User is logged In or not so that he can´t evade the Login Section
 */
function checkIfUserIsLoggedIn() {
    if (localStorage.getItem("loggedInKey") === null) {
        window.location.href = './index.html'
    }
}

/**
 * A simple Guest Login
 */
function guestLogin() {
    setDefault();
    window.location.href = './board.html';
}

/**
 * This function is for setting an default variable to the local storage
 * and as soon as possible in the backend for The checkIfUserIsLoggedIn Function
 */
function setDefault() {
    if (localStorage.getItem("loggedInKey") === null) {
        localStorage.setItem('loggedInKey', loggedIn);
    }
}
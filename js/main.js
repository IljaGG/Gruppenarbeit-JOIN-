let newUser = [];
let loggedIn = true;


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
        window.location.href = './board.html';
    }


    if (loggedUser[0].user === actualUser && loggedUser[0].password === password && loggedUser[0].email === email) {
        let error = getId('errorMessage');
        error.innerHTML = '';
        error.innerHTML += createErrorBox();
    }

}


function createErrorBox() {
    return /*html*/ `
    <div class = "errorBox"><span><b>This User already exists</b></span></div>
`
}


function saveInLocalStorage(newUser) {
    newUser = JSON.stringify(newUser)
    localStorage.setItem('newUser', newUser);
}


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


function checkIfUserIsLoggedIn() {

    if (localStorage.getItem("loggedInKey") === null) {
        window.location.href = './index.html'
    } else {
        localStorage.setItem('loggedInKey', `${loggedIn}`);
        window.location.href = './board.html'
    }
}


function guestLogin() {
    if (localStorage.getItem("loggedInKey") === null) {
        localStorage.setItem('loggedInKey', loggedIn);
    }

    window.location.href = './board.html';
}


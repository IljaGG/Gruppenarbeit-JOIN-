let users = [];


setURL('https://gruppe-292-join.developerakademie.net/smallest_backend_ever');


async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    backend.setItem('Test', 'Hallo')

    console.log(users);
}


/**
 * This function shows the Login Section.
 */
function showLogin() {
    document.getElementById('main').classList.add('d-none');
    let login = document.getElementById('login');
    login.classList.add('login')
    login.innerHTML = '';
    login.innerHTML += createLogin();
    window.stop();
}

/**
 * 
 * @returns This function returns the html part for the login Section.
 */
function createLogin() {
    return /*html*/ `
    <div class="loginContainer">
        <div class="loginLeftside">
            <img src="./img/joinlogo.png" alt="joinlogo">
        </div>

        <form class="rightSide" id="rightSide">
            <label class="userInfo" id="loginUser" for="uname"><b>Username</b></label>
            <input required type="text" minlength="8" placeholder="Enter Username" name="uname" >

            <label class="userInfo" id="password" for="psw"><b>Password</b></label>
            <input required type="password" minlength ="8"placeholder="Enter Password" name="psw" >

            <button class="loginBtn" onsubmit="checkLogin()" >Login</button>
            <button class="registerBtn" onclick="register()" >Registrieren</button>
        </form>
    </div>
`;
}

/**
 * This Function shows the Register Section
 */
function register() {
    let register = document.getElementById('rightSide');
    register.innerHTML = '';
    register.innerHTML += createRegister();
}

/**
 * 
 * @returns This Function creates The Html Part of the Register Section
 */
function createRegister() {
    return /*html*/ `
    <label class="userInfo" id="loginUser" for="uname"><b>Username</b></label>
    <input required type="text" minlength="8" placeholder="Enter Username" name="uname" >
    <label class="userInfo" id="email" for="uname"><b>Email</b></label>
    <input required type="email" minlength="8" placeholder="Enter Email" name="email" >
    <label class="userInfo" id="password" for="psw"><b>Password</b></label>
    <input required type="password" minlength ="8"placeholder="Enter Password" name="psw" >

    <button class="registerBtn" onclick="getRegistrated()" >Registrieren</button>
`;
}


function checkLogin() {
    let guest = {
        'name': 'guest',
        'password': 'test'
    }
    document.getElementById('login').classList.add('d-none');
    document.getElementById('main').classList.remove('d-none');


    let loginUser = document.getElementById('loginUser').value;
    let password = document.getElementById('password').value;
}
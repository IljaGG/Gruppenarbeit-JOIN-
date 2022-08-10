let users = [];


setURL('https://gruppe-292-join.developerakademie.net/smallest_backend_ever');


async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    backend.setItem('Test', 'Hallo')

    console.log(users);
}


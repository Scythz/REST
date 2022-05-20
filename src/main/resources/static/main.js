const url = 'http://localhost:8080/api/admin/users/';
const urlRoles = 'http://localhost:8080/api/admin/roles/';
const container = document.querySelector('.usersTbody');
const newUserForm = document.getElementById('newUserForm');
const editUserForm = document.getElementById('editUserForm');
const deleteUserForm = document.getElementById('deleteUserForm');
const btnCreate = document.getElementById('new-user-tab');
const adminPageBtn = document.getElementById('admin-page-btn')
const userPageBtn = document.getElementById('user-page-btn')
const newRoles = document.getElementById('newRoles');
let result = '';

let editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
let deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
const editId = document.getElementById('editId');
const editName = document.getElementById('editName');
const editLastName = document.getElementById('editLastName');
const editAge = document.getElementById('editAge');
const editUsername = document.getElementById('editUsername');
const editPassword = document.getElementById('editPassword');
const editRoles = document.getElementById('editRoles');

const delId = document.getElementById('delId');
const delName = document.getElementById('delName');
const delLastName = document.getElementById('delLastName');
const delAge = document.getElementById('delAge');
const delUsername = document.getElementById('delUsername');
const delRoles = document.getElementById('delRoles');

const newName = document.getElementById('newName');
const newLastName = document.getElementById('newLastName');
const newAge = document.getElementById('newAge');
const newUsername = document.getElementById('newUsername');
const newPassword = document.getElementById('newPassword');

let rolesArr = [];


let option = '';

const renderUsers = (users) => {
    users.forEach(user => {
        let roles = '';
        user.roles.forEach(
            role => {
                r = role.name.substring(5);
                roles += r + ' ';
            }
        );
        result += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.username}</td>
                <td>
                ${roles}
                </td>
                <td><a class="btnEdit btn btn-success btn-sm">Edit</a></td>
                <td><a class="btnDelete btn btn-danger btn-sm">Delete</a></td>
            </tr>
            `
    })
    container.innerHTML = result;
}

const renderRoles = (roles) => {
    rolesOptions = '';
    roles.forEach(role => {
        rolesOptions += `
            <option value = ${role.id}>${role.name.slice(5)}</option>
            `
        rolesArr.push(role);
    })
    newRoles.innerHTML = rolesOptions;
    editRoles.innerHTML = rolesOptions;
    delRoles.innerHTML = rolesOptions;
}


fetch(url)
    .then(res => res.json())
    .then(data => renderUsers(data))
    .catch(error => console.log(error));

let allRoles;

fetch(urlRoles)
    .then(res => res.json())
    .then(data => {
        allRoles = data;
        renderRoles(allRoles)
    });


const refreshListOfUsers = () => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            result = '';
            renderUsers(data)
        })
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// DELETE user

on(document, 'click', '.btnDelete', e => {
    const row = e.target.parentNode.parentNode;
    idForm = row.children[0].innerHTML;
    const nameForm = row.children[1].innerHTML;
    const lastNameForm = row.children[2].innerHTML;
    const AgeForm = row.children[3].innerHTML;
    const UsernameForm = row.children[4].innerHTML;

    delId.value = idForm;
    delName.value = nameForm;
    delLastName.value = lastNameForm;
    delAge.value = AgeForm;
    delUsername.value = UsernameForm;
    deleteUserModal.show();
})

// EDIT user

let idForm = 0;
on(document, 'click', '.btnEdit', e => {
    const row = e.target.parentNode.parentNode;
    idForm = row.children[0].innerHTML;
    const nameForm = row.children[1].innerHTML;
    const lastNameForm = row.children[2].innerHTML;
    const AgeForm = row.children[3].innerHTML;
    const UsernameForm = row.children[4].innerHTML;

    editId.value = idForm;
    editName.value = nameForm;
    editLastName.value = lastNameForm;
    editAge.value = AgeForm;
    editUsername.value = UsernameForm;
    editPassword.value = ''
    editRoles.options.selectedIndex = -1;
    editUserModal.show();

})

// NEW USER TAB BUTTON

btnCreate.addEventListener('click', () => {
    newName.value = ''
    newLastName.value = '';
    newAge.value = ''
    newUsername.value = '';
    newPassword.value = '';
    newRoles.options.selectedIndex = -1;
});


// DELETE SUBMIT

deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/admin/" + delId.value, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    })
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(refreshListOfUsers);
    deleteUserModal.hide();
});

// CREATE NEW USER SUBMIT

newUserForm.addEventListener('submit', (e) => {
    let rolesJ = [];
    e.preventDefault();
    const selectedOpts = [...newRoles.options]
        .filter(x => x.selected)
        .map(x => x.value);

    selectedOpts.forEach(
        role => {
            rolesJ.push(rolesArr[role - 1])
        }
    );

    const fetchFunction = async () => {
        const fetchedData = await
            fetch("http://localhost:8080/api/admin/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName.value,
                    lastName: newLastName.value,
                    age: newAge.value,
                    username: newUsername.value,
                    password: newPassword.value,
                    roles: rolesJ
                })
            });

        if (!fetchedData.ok) {
            fetchedData.json()
                .then(data => alert(data.message))
        }
        return fetchedData;
    }

    fetchFunction()
        .then(response => response.json())
        .catch(err => console.log(err))
        .then(refreshListOfUsers);
    const navtab1 = document.getElementById('all-users-tab');
    const navtab2 = document.getElementById('new-user-tab');
    const tab1 = document.getElementById('all-users');
    const tab2 = document.getElementById('new-user');

    navtab1.setAttribute("class", "nav-link active");
    navtab2.setAttribute("class", "nav-link");
    tab1.setAttribute("class", "tab-pane fade active show");
    tab2.setAttribute("class", "tab-pane fade");

})

// EDIT USER SUBMIT

editUserForm.addEventListener('submit', (e) => {
    let rolesJ = [];
    e.preventDefault();
    const selectedOpts = [...editRoles.options]
        .filter(x => x.selected)
        .map(x => x.value);

    selectedOpts.forEach(
        role => {
            rolesJ.push(rolesArr[role - 1])
        }
    );

    const fetchFunction = async () => {
        const fetchedData = await fetch("http://localhost:8080/api/admin/" + idForm, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editId.value,
                name: editName.value,
                lastName: editLastName.value,
                age: editAge.value,
                username: editUsername.value,
                password: editPassword.value,
                roles: rolesJ
            })
        });

        if (!fetchedData.ok) {
            fetchedData.json()
                .then(data => alert(data.message))
        }
        return fetchedData;
    }
    fetchFunction()
        .then(response => response.json)
        .then(refreshListOfUsers)
    editUserModal.hide();
})
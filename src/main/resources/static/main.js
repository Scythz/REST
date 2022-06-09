let result = '',
    editUserModal = new bootstrap.Modal(document.getElementById('editUserModal')),
    deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal')),
    rolesArr = [];

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
    document.querySelector('.usersTbody').innerHTML = result;
}

const renderRoles = (roles) => {
    rolesOptions = '';
    roles.forEach(role => {
        rolesOptions += `
            <option value = ${role.id}>${role.name.slice(5)}</option>
            `
        rolesArr.push(role);
    })
    document.getElementById('newRoles').innerHTML = rolesOptions;
    document.getElementById('editRoles').innerHTML = rolesOptions;
    document.getElementById('delRoles').innerHTML = rolesOptions;
}


fetch('http://localhost:8080/api/admin/users/')
    .then(res => res.json())
    .then(data => renderUsers(data))
    .catch(error => console.log(error));

let allRoles;

fetch('http://localhost:8080/api/admin/roles/')
    .then(res => res.json())
    .then(data => {
        allRoles = data;
        renderRoles(allRoles)
    });


const refreshListOfUsers = () => {
    fetch('http://localhost:8080/api/admin/users/')
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

//_________________________DELETE USER
//____________________________________

on(document, 'click', '.btnDelete', e => {
    const row = e.target.parentNode.parentNode;
    idForm = row.children[0].innerHTML;
    const nameForm = row.children[1].innerHTML;
    const lastNameForm = row.children[2].innerHTML;
    const AgeForm = row.children[3].innerHTML;
    const UsernameForm = row.children[4].innerHTML;

    document.getElementById('delId').value = idForm;
    document.getElementById('delName').value = nameForm;
    document.getElementById('delLastName').value = lastNameForm;
    document.getElementById('delAge').value = AgeForm;
    document.getElementById('delUsername').value = UsernameForm;
    deleteUserModal.show();
})

//_________________________EDIT USER
//__________________________________

let idForm = 0;
on(document, 'click', '.btnEdit', e => {
    const row = e.target.parentNode.parentNode;
    idForm = row.children[0].innerHTML;
    const nameForm = row.children[1].innerHTML;
    const lastNameForm = row.children[2].innerHTML;
    const AgeForm = row.children[3].innerHTML;
    const UsernameForm = row.children[4].innerHTML;

    document.getElementById('editId').value = idForm;
    document.getElementById('editName').value = nameForm;
    document.getElementById('editLastName').value = lastNameForm;
    document.getElementById('editAge').value = AgeForm;
    document.getElementById('editUsername').value = UsernameForm;
    document.getElementById('editPassword').value = ''
    document.getElementById('editRoles').options.selectedIndex = -1;
    editUserModal.show();

})

//_________________________NEW USER CLEANER
//_________________________________________

document.getElementById('new-user-tab').addEventListener('click', () => {
    document.getElementById('newName').value = ''
    document.getElementById('newLastName').value = '';
    document.getElementById('newAge').value = ''
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newRoles').options.selectedIndex = -1;
});


//_________________________DELETE USER SUBMIT
//___________________________________________

document.getElementById('deleteUserForm').addEventListener('submit', (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/admin/" + document.getElementById('delId').value, {
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

//_________________________CREATE USER SUBMIT
//___________________________________________

document.getElementById('newUserForm').addEventListener('submit', (e) => {
    let rolesJ = [];
    e.preventDefault();
    const selectedOpts = [...document.getElementById('newRoles').options]
        .filter(x => x.selected)
        .map(x => x.value);
    console.log(selectedOpts)
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
                    name: document.getElementById('newName').value,
                    lastName: document.getElementById('newLastName').value,
                    age: document.getElementById('newAge').value,
                    username: document.getElementById('newUsername').value,
                    password: document.getElementById('newPassword').value,
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

//_________________________EDIT USER SUBMIT
//_________________________________________

document.getElementById('editUserForm').addEventListener('submit', (e) => {
    let rolesJ = [];
    e.preventDefault();
    const selectedOpts = [...document.getElementById('editRoles').options]
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
                id: document.getElementById('editId').value,
                name: document.getElementById('editName').value,
                lastName: document.getElementById('editLastName').value,
                age: document.getElementById('editAge').value,
                username: document.getElementById('editUsername').value,
                password: document.getElementById('editPassword').value,
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
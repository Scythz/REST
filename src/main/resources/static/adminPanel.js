var users, roles;

function searchUser(id) {
    return users.find(user => user.id == id);
}

function editModal(id) {
    let user = searchUser(id);
    $("#editID").val(user.id);
    $("#editFirstName").val(user.firstName);
    $("#editLastName").val(user.lastName);
    $("#editAge").val(user.age);
    $("#editUsername").val(user.username);
    $("#editPassword").val("");
    $("#editRoles").empty();
    roles.forEach(role => {
        $("#editRoles").append(
            "<option value=".concat(role.name,
                (user.roles.some(r => r.id === role.id) ? " selected" : ""),
                ">", role.name + "</option>")
        );
    });
}

function editSubmit() {
    let form = $("#editForm");
    $.ajax({
        type: form.attr("method"),
        url: form.attr("action"),
        data: form.serialize(),
        success: function (response) {
            users = users.map(user => {
                if (user.id == $("#editID").val()) {
                    user = response;
                }
                return user;
            });
            updateTable();
        }
    })
}

function deleteModal(id) {
    let user = searchUser(id);
    $("#deleteID").val(user.id);
    $("#deleteFirstName").val(user.firstName);
    $("#deleteLastName").val(user.lastName);
    $("#deleteAge").val(user.age);
    $("#deleteUsername").val(user.username);
    $("#deleteRoles").empty();
    roles.forEach(role => {
        $("#deleteRoles").append(
            "<option value=".concat(role.name,
                (user.roles.some(r => r.id === role.id) ? " selected" : ""),
                ">", role.name + "</option>")
        );
    });
}

function deleteSubmit() {
    let form = $("#deleteForm");
    $.ajax({
        type: form.attr("method"),
        url: form.attr("action") + $("#deleteID").val(),
        data: form.serialize(),
        success: function () {
            users = users.filter(user => user.id != $("#deleteID").val());
            updateTable();
        }
    })
}

function addSubmit() {
    let form = $("#addForm");
    $.ajax({
        type: form.attr("method"),
        url: form.attr("action"),
        data: form.serialize(),
        success: function (response) {
            $("#all-tab").trigger("click");
            form.trigger("reset");
            users.push(response);
            updateTable();
        }
    })
}

function updateTable() {
    $("#addRoles").empty();
    roles.forEach(role => {
        $("#addRoles").append("<option value=" + role.name + ">" + role.name + "</option>");
    });

    $("#usersTable").empty();
    users.forEach(user => {
        $("#usersTable").append("<tr>" +
            "<td>" + user.id + "</td>" +
            "<td>" + user.firstName + "</td>" +
            "<td>" + user.lastName + "</td>" +
            "<td>" + user.age + "</td>" +
            "<td>" + user.username + "</td>" +
            "<td>" + user.rolesAsString + "</td>" +
            "<td><button class='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalEdit' onclick='editModal(" + user.id + ")' style='color: white'>Edit</button></td>" +
            "<td><button class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#modalDelete' onclick='deleteModal(" + user.id + ")' style='color: white'>Delete</button></td>" +
            "</tr>");
    });
}

function pullData() {
    fetch("/api/admin/roles/").then(response => {
        response.json().then(allRoles => {
            roles = allRoles;
            fetch("/api/admin/users/").then(response => {
                response.json().then(allUsers => {
                    users = allUsers;
                    updateTable();
                });
            });
        });
    });
}
pullData();
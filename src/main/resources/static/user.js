function pullPage() {
    fetch("/api/user").then(response => {
        response.json().then(user => {
            if (!user.roles.some(r => r.name === "ROLE_ADMIN")) {
                $("#admin").remove();
            }
            $("#id").text(user.id);
            $("#firstName").text(user.name);
            $("#lastName").text(user.lastName);
            $("#age").text(user.age);
            $("#username").text(user.username);
            $("#roles").text(user.rolesAsString);
        });
    });
}

pullPage()
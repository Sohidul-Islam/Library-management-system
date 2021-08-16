$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;

    var usersTable = $("#users-table").DataTable({
        paging: true,
        select: false,
        lengthChange: true,
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "All"],
        ],
        columnDefs: [
            {
                targets: [3],
                orderable: false,
            },
        ],
    });

    getUsers(userData);

    function getUsers(userData) {
        $.ajax({
            type: "get",
            url: "/users/find-user",
            dataType: "json",
            headers: { "x-access-token": userData.token },
            success: function (response) {
                setUsers(response.users);
            },
            error: function (response) {
                customAlert(response.responseJSON);
            },
        });
    }
    function setUsers(users) {
        $.each(users, function (key, user) {
            btnText = `<div class="btn-group btn-group-sm btn-user-group-list" role="group" id="" aria-label="table buttons">
            <a class="btn btn-outline-primary" id="view-user" href="/users/${user.user_id}/view"><i class="fas fa-eye"></i></a>
            `;
            if (userData.role == "admin") {
                btnText =
                    btnText +
                    `
                    <button class="btn btn-outline-success" id="edit-user"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-outline-danger" id="delete-user" value="${user.user_id}"><i class="far fa-trash-alt"></i></button>
                    <button class="btn btn-outline-info" id="promote-user" value="${user.user_id}"><i class="fas fa-book-reader"></i></button>
                </div>`;
            }
            usersTable.row
                .add([
                    `<h4>${user.user_id}</h4>`,
                    `
                    <a href="/users/${user.user_id}/view">
                        <div class="media d-flex align-items-center">
                        <div class="avatar avatar-xl mr-2">
                            <div class="">
                            <img class="rounded-circle img-fluid" src="/upload/${user.user_img}" alt="" width="30">
                            </div>
                        </div>
                        <div class="media-body">
                            <h5 class="mb-0 fs--1">${user.user_name}</h5>
                        </div>
                        </div>
                    </a>
                `,
                    `<a href="mailto:ricky@example.com">${user.email}</a>`,
                    btnText,
                ])
                .draw(false);
        });
    }

    $("#users-table").on("click", "#promote-user", function () {
        let user_id = $(this).val();
        swal.fire({
            title: "Are you sure?",
            text: "You want to promote him to author!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#209f84;",
            confirmButtonText: "Yes, promote him!",
            closeOnConfirm: !1,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/users/promote-user",
                    type: "POST",
                    data: {
                        user_id,
                        url: currentUrl,
                    },
                    dataType: "json",
                    success: function (response) {
                        customAlert(response);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        swal.fire("Error deleting!", "Please try again", "error");
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    });
    $("#users-table").on("click", "#delete-user", function () {
        let user_id = $(this).val();
        swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: !1,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/users/delete-user",
                    type: "POST",
                    data: {
                        user_id,
                        url: currentUrl,
                    },
                    dataType: "json",
                    success: function (response) {
                        customAlert(response);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        swal.fire("Error deleting!", "Please try again", "error");
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    });
});

function customAlert(params) {
    Swal.fire({
        icon: params.type,
        title: params.title,
        html: `<div class="mb-2">${params.message} </div><a class=" btn btn-outline-${params.btnType}" href="${params.link}">${params.link_text}</a>`,
        showConfirmButton: false,
    });
}

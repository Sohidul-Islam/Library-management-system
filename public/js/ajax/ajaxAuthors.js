$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;

    var authorsTable = $("#authors-table").DataTable({
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

    getAuthors(userData);

    function getAuthors(userData) {
        $.ajax({
            type: "get",
            url: "/authors/find-author",
            dataType: "json",
            headers: { "x-access-token": userData.token },
            success: function (response) {
                console.log(response);
                setAuthors(response.authors);
            },
            error: function (response) {
                customAlert(response.responseJSON);
            },
        });
    }
    function setAuthors(authors) {
        $.each(authors, function (key, author) {
            btnText = `<div class="btn-group btn-group-sm btn-author-group-list" role="group" id="" aria-label="table buttons">
            <a class="btn btn-outline-primary" id="view-author" href="/authors/${author.author_id}/view"><i class="fas fa-eye"></i></a>
            `;
            if (userData.role == "admin") {
                btnText =
                    btnText +
                    `
                    <button class="btn btn-outline-success" id="edit-user"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-outline-danger" id="delete-user" value="${author.author_id}"><i class="far fa-trash-alt"></i></button>
                </div>`;
            }
            authorsTable.row
                .add([
                    `<h4>${author.author_id}</h4>`,
                    `
                    <a href="/authors/${author.author_id}/view">
                        <div class="media d-flex align-items-center">
                        <div class="avatar avatar-xl mr-2">
                            <div class="">
                            <img class="rounded-circle img-fluid" src="/upload/${author.author_img}" alt="" width="30">
                            </div>
                        </div>
                        <div class="media-body">
                            <h5 class="mb-0 fs--1">${author.user_name}</h5>
                        </div>
                        </div>
                    </a>
                `,
                    `<a href="mailto:ricky@example.com">${author.email}</a>`,
                    btnText,
                ])
                .draw(false);
        });
    }

    $("#authors-table").on("click", "#delete-user", function () {
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
                    url: "/authors/delete-user",
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

$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;

    var categoryTable = $("#category-table").DataTable({
        paging: true,
        select: false,
        lengthChange: true,
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "All"],
        ],
        columnDefs: [
            {
                targets: [2],
                orderable: false,
            },
        ],
    });

    $.ajax({
        url: "/category/find-category",
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-access-token", userData.token);
        },
        success: function (response) {
            if (response.catagories.length > 0) {
                setCategory(response.catagories);
            } else {
            }
        },
        error: function (error) {
            console.log(error);
            if (error.tokenCheck === "expired_token" || error.tokenCheck === "no_token") {
                customAlert(error);
            }
        },
    });

    $("#category-table tbody").on("click", "#edit-category", function () {
        var currentRow = $(this).closest("tr");
        var col1 = currentRow.find("td:eq(1)").text();
        var col0 = currentRow.find("td:eq(0)").text();
        myDisplay(
            (fields = {
                col0,
                col1,
            })
        );
        async function myDisplay(fields) {
            try {
                const { value: formValues } = await Swal.fire({
                    title: "Edit Category",
                    html: `<input id="swal-input1" class="swal2-input" value= "${fields.col0}" readonly> <input id="swal-input2" class="swal2-input" value= "${fields.col1}">`,
                    focusConfirm: false,
                    preConfirm: () => {
                        return { category_id: document.getElementById("swal-input1").value, category_name: document.getElementById("swal-input2").value };
                    },
                });

                if (formValues) {
                    updateCategory(formValues);
                }
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving data.",
                });
            }
        }
    });

    $("#category-table").on("click", "#delete-category", function () {
        let category_id = $(this).val();
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
                    url: "/category/delete-category",
                    type: "POST",
                    data: {
                        category_id,
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
    $("#category-table").on("click", "#delete-category", function () {
        let category_id = $(this).val();
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
                    url: "/category/delete-category",
                    type: "POST",
                    data: {
                        category_id,
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

    $("#insert-category").on("click", function () {
        const { value: category } = Swal.fire({
            title: "Enter category name",
            input: "text",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                } else {
                    addCategory(value);
                }
            },
        });
    });

    function updateCategory(value) {
        $.ajax({
            url: "/category/update-category",
            method: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            data: {
                category_id: value.category_id,
                category_name: value.category_name,
                url: currentUrl,
            },
            dataType: "json",
            success: function (response) {
                customAlert(response);
            },
            error: function (error) {
                console.log(error);
                if (error.tokenCheck === "expired_token" || error.tokenCheck === "no_token") {
                    customAlert(error);
                }
            },
        });
    }
    function addCategory(value) {
        console.log("from add ", value);
        $.ajax({
            url: "/category/add-category",
            method: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            data: {
                category_name: value,
                url: currentUrl,
            },
            dataType: "json",
            success: function (response) {
                customAlert(response);
            },
            error: function (error) {
                console.log(error);
                if (error.tokenCheck === "expired_token" || error.tokenCheck === "no_token") {
                    customAlert(error);
                }
            },
        });
    }

    function setCategory(data) {
        $.each(data, function (key, category) {
            btnText = " ";

            if (userData.role == "admin") {
                btnText =
                    btnText +
                    `<div class="btn-group btn-group-sm btn-category-group-list" role="group" id="" aria-label="table buttons">
                    <button class="btn btn-outline-success" id="edit-category"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-outline-danger" id="delete-category" value="${category.category_id}"><i class="far fa-trash-alt"></i></button>
                </div>`;
            }
            categoryTable.row.add([`<h4>${category.category_id}</h4>`, `<h5 class="mb-0 fs--1">${category.category_name}</h5>`, btnText]).draw(false);
        });
    }

    function customAlert(params) {
        Swal.fire({
            icon: params.type,
            title: params.title,
            html: `<div class="mb-2">${params.message} </div><a class=" btn btn-outline-${params.btnType}" href="${params.link}">${params.link_text}</a>`,
            showConfirmButton: false,
        });
    }
});

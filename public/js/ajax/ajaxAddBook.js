$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;

    getCategory(userData);

    function getCategory(userData) {
        $.ajax({
            type: "get",
            url: "/category/find-category",
            dataType: "json",
            headers: { "x-access-token": userData.token },
            success: function (response) {
                console.log(response);
                setCategories(response.catagories);
            },
            error: function (error) {
                console.log(error);
                customAlert(error);
            },
        });
    }
    function setCategories(catagories) {
        let html = `<option value="0">Choose one</option>`;
        $.each(catagories, function (key, category) {
            html = html + `<option value="${category.category_id}">${category.category_name}</option>`;
        });
        $("#category_id").append(html);
    }
});

function customAlert(params) {
    Swal.fire({
        icon: params.type,
        title: params.title,
        html: `<div class="mb-2">${params.message} </div><a class=" btn btn-outline-${params.btnType}" href="${params.link}">${params.link_text}</a>`,
        showConfirmButton: false,
    });
}

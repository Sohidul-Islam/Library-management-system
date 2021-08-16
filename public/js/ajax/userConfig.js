$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData && window.location.href != "http://localhost:4000/sign-in") {
        customAlert({
            type: "error",
            title: "No user Found",
            message: "please log into your account",
            link: "/sign-in",
            link_text: "Sign in",
        });
    }

    let userImg;
    if (userData.role == "admin") {
        userImg = userData.admin_img;
        $("#userFullName").text(`${userData.admin_name}`);
        $("#userProfileImg").attr("src", `/upload/${userImg}`);
        $("#userRole").text(`${userData.role}`);
        $("#myReview").hide();
        $("#btn-add-review-list").hide();
    } else if (userData.role == "user") {
        userImg = userData.user_img;
        $("#userFullName").text(`${userData.user_name}`);
        $("#userProfileImg").attr("src", `/upload/${userImg}`);
        $("#userRole").text(`${userData.role}`);
        $(".admin-sidebar").hide();
        $("#insert-category").hide();
    }
});

function customAlert(params) {
    Swal.fire({
        icon: params.type,
        title: params.title,
        html: `<div class="mb-2">${params.message} </div><a class=" btn btn-outline-${params.type}" href="${params.link}">${params.link_text}</a>`,
        showConfirmButton: false,
    });
}

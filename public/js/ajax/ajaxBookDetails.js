$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;
    let item_id = $("#item_id").val(),
        currentPage = 1,
        bookName = $("#bookName").val();
    $(".access_token").val(userData.token);
    $(".user_id").val(userData.user_id);
    $("#url").val(currentUrl);
    localStorage.setItem(
        "bookData",
        JSON.stringify({
            item_id,
            bookName,
        })
    );

    $.ajax({
        url: "/item-reviews/published-review",
        method: "post",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-access-token", userData.token);
        },
        data: {
            item_id,
            currentPage,
        },
        success: function (response) {
            if (response.reviews && response.reviews.length > 0) {
                setReview(response.reviews);
                setPagination(response);
            } else {
                $("#navpills-1").html(`
                    <div class="card review-table">
                        <div class="media">
                            <div class="media-body">
                                <h3 class="fs-20 text-denger font-w600 mb-3">Sorry, No review Found!</h3>
                            </div>
                        </div>
                    </div>
                    `);
                $("#paginationText").html("");
            }
        },
        error: function (error) {
            console.log(error);
            if (error.tokenCheck === "expired_token" || error.tokenCheck === "no_token") {
                customAlert(error);
            }
        },
    });

    if (userData.role == "user") {
        $.ajax({
            url: "/item-reviews/find-user-review",
            method: "post",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            data: {
                item_id,
                user_id: userData.user_id,
            },
            success: function (response) {
                console.log(response);
                if (response.type == "success") {
                    $("#btn-add-review-list").hide();
                    setMyReview(response.review);
                } else {
                    $("#btn-add-review-list").show();
                    $("#myReview").hide();
                }
            },
            error: function (error) {
                console.log(error);
                if (error.tokenCheck === "expired_token" || error.tokenCheck === "no_token") {
                    customAlert(error);
                }
            },
        });
    }

    $("#item_review_btn").click(function (e) {
        e.preventDefault();
        var data = $("#addNewReviewForm").serializeArray();
        $.ajax({
            url: "/item-reviews/add-review",
            method: "post",
            data: data,
            success: function (response) {
                customAlert(response);
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error,
                });
            },
        });
    });
    $("#item_review_btn").click(function (e) {
        e.preventDefault();
        var data = $("#addNewReviewForm").serializeArray();
        $.ajax({
            url: "/item-reviews/add-review",
            method: "post",
            data: data,
            success: function (response) {
                customAlert(response);
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error,
                });
            },
        });
    });

    $("#item_review_update_btn").click(function (e) {
        e.preventDefault();
        var data = $("#updateReviewForm").serializeArray();
        $.ajax({
            url: "/item-reviews/update-review",
            method: "post",
            data: data,
            success: function (response) {
                customAlert(response);
            },
            error: function (error) {
                // Swal.fire({
                //     icon: "error",
                //     title: "Oops...",
                //     text: error,
                // });
            },
        });
    });

    function setMyReview(review) {
        $("#review_id").val(review.review_id);
        $("textarea#updateReview_text").val(review.review_text);
        $(`#update_doctor_rate-${review.review_star}`).attr("checked", true);
        html = "";
        var review_star = "";
        for (let i = 0; i < 5; i++) {
            if (review.review_star > 0) {
                review_star = review_star + '<i class="fa fa-star text-orange"></i>';
            } else {
                review_star = review_star + '<i class="fa fa-star text-gray"></i>';
            }
            review.review_star--;
        }
        html =
            html +
            `
        <div class="card review-table">
            <div class="media">
                <div class="media-body">
                    <h3 class="fs-20 text-black font-w600 mb-3">${userData.user_name}
                        <span class="star-review ml-3 d-inline-block">${review_star}</span>
                    </h3>
                    <p>${review.review_text}</p>
                    <span class="fs-15">${review.review_date}</span>
                </div>
                <div class="media-footer d-flex align-self-center">
                    <div class="edit ml-auto myReviewDelete">
                        <button  class="btn btn-outline-danger" id="confirmDelete">DELETE</button>
                        <button  class="btn btn-outline-success ml-2" data-toggle="modal" data-target="#updateReviewModal" id="updateReview">UPDATE</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        $("#navpills-2").html(html);
    }

    $("#navpills-2").delegate("#confirmDelete", "click", function () {
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
                    url: "/item-reviews/delete-review",
                    type: "POST",
                    data: {
                        review_id: $("#review_id").val(),
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
                console.log("from here ");
            }
        });
    });

    function setReview(reviews) {
        let html = "";
        $.each(reviews, function (key, review) {
            var review_star = "";
            for (let i = 0; i < 5; i++) {
                if (review.review_star > 0) {
                    review_star = review_star + '<i class="fa fa-star text-orange"></i>';
                } else {
                    review_star = review_star + '<i class="fa fa-star text-gray"></i>';
                }
                review.review_star--;
            }
            // var string = item.item_name;
            // var length = 22;
            // var trimmedString = item.item_name.length > 22 ? item.item_name.substring(0, 22 - 4) + "..." : item.item_name;
            // ${item.item_name.length > 22 ? item.item_name.substring(0, 22 - 3) + "..." : item.item_name}
            html =
                html +
                `
                <div class="card review-table">
                    <div class="media">
                        <img class="mr-3 img-fluid rounded" width="110" src="/upload/${review.user_img}" alt="${review.user_name}" />
                        <div class="media-body">
                            <h3 class="fs-20  font-w600 mb-3">
                                <span class= "text-black">${review.user_name}</span>
                                ${review_star}
                            </h3>
                            <p>${review.review_text}</p>
                            <span class="fs-15">${review.review_date}</span>
                        </div>
                    </div>
                </div>
                `;
        });
        $("#navpills-1").html(html);
    }

    function setPagination(params) {
        let html = "";
        let pageItems = "";
        let leftIndicator = "";
        let rightIndicator = "";
        let paginationHelper = "";

        for (let i = 1; i <= params.numPages; i++) {
            if (i == params.current) {
                pageItems = pageItems + `<li class="page-item active"><button disabled="disabled" class="page-link" value="${i}">${i}</button></li>`;
            } else {
                pageItems = pageItems + `<li class="page-item "><button class="page-link" value="${i}">${i}</button></li>`;
            }
        }

        if (params.numPages > 0) {
            if (params.current <= 1) {
                leftIndicator =
                    leftIndicator + `<li class="page-item page-indicator"><button disabled="disabled" class="page-link" value="${params.current - 1}"> <i class="la la-angle-left"></i></button></li>`;
            } else {
                leftIndicator = leftIndicator + `<li class="page-item page-indicator"><button class="page-link" value="${params.current - 1}"> <i class="la la-angle-left"></i></button></li>`;
            }
            if (params.current >= params.numPages) {
                rightIndicator =
                    rightIndicator +
                    `<li class="page-item page-indicator"><button disabled="disabled" class="page-link" value="${params.current + 1}"> <i class="la la-angle-right"></i></button></li>`;
            } else {
                rightIndicator = rightIndicator + `<li class="page-item page-indicator"><button class="page-link" value="${params.current + 1}"> <i class="la la-angle-right"></i></button></li>`;
            }
        }

        html =
            html +
            `
<nav class="ml-auto">
    <ul class="pagination pagination-gutter pagination-danger">
        ${leftIndicator}
        ${pageItems}
        ${rightIndicator}
    </ul>
</nav>
`;

        $("#paginationText").html(html);
    }
});

$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;
    getReviews("/item-reviews/find-review");

    $("#reviews-content").on("click", "#delete-review", function () {
        let review_id = $(this).val();
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
                        review_id,
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

    $("#paginationText").on("click", ".page-link", function () {
        let page = $(this).val();
        let text = $("#newOltToggle").text();
        console.log(text);

        if ($("#navpills-1").hasClass("active")) {
            if (text == "Newest") {
                getReviews(`/item-reviews/find-review?orderBy=review_date&sort_order=desc&page=${page}`);
            } else {
                getReviews(`/item-reviews/find-review?orderBy=review_date&sort_order=asc&page=${page}`);
            }
        }
        if ($("#navpills-2").hasClass("active")) {
            if (text == "Newest") {
                getReviews(`/item-reviews/find-review?filterBy=review_status&filterData=1&orderBy=review_date&sort_order=desc&page=${page}`);
            } else {
                getReviews(`/item-reviews/find-review?filterBy=review_status&filterData=1&orderBy=review_date&sort_order=asc&page=${page}`);
            }
        }
    });
    $("#reviews-content").on("click", "#edit-review", function () {
        if ($(this).hasClass("btn-outline-success")) {
            // $(this).removeClass("btn-outline-success");
            // $(this).addClass("btn-outline-light");
            // $(this).text("UNPUBLISH");
            sendPublish({ review_id: $(this).val(), review_status: "published" });
        } else {
            // $(this).addClass("btn-outline-success");
            // $(this).removeClass("btn-outline-light");
            // $(this).text("PUBLISH");
            sendPublish({ review_id: $(this).val(), review_status: "not_published" });
        }
    });
    function sendPublish(params) {
        $.ajax({
            url: "/item-reviews/update-review_status",
            method: "POST",
            data: params,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            success: function (response) {
                if (response.type == "success") {
                    if ($("#edit-review").hasClass("btn-outline-success")) {
                        $("#edit-review").removeClass("btn-outline-success");
                        $("#edit-review").addClass("btn-outline-light");
                        $("#edit-review").text("UNPUBLISH");
                    } else {
                        $("#edit-review").addClass("btn-outline-success");
                        $("#edit-review").removeClass("btn-outline-light");
                        $("#edit-review").text("PUBLISH");
                    }
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

    $("#published-review").on("click", function () {
        getReviews("/item-reviews/find-review?filterBy=review_status&filterData=1");
    });

    $("#newest").on("click", function () {
        $("#newOltToggle").text("Newest");
        if ($("#navpills-1").hasClass("active")) {
            getReviews("/item-reviews/find-review?orderBy=review_date&sort_order=desc");
        }
        if ($("#navpills-2").hasClass("active")) {
            getReviews("/item-reviews/find-review?filterBy=review_status&filterData=1&orderBy=review_date&sort_order=desc");
        }
    });

    $("#oldest").on("click", function () {
        $("#newOltToggle").text("Oldest");
        if ($("#navpills-1").hasClass("active")) {
            getReviews("/item-reviews/find-review?orderBy=review_date&sort_order=asc");
        }
        if ($("#navpills-2").hasClass("active")) {
            getReviews("/item-reviews/find-review?filterBy=review_status&filterData=1&orderBy=review_date&sort_order=asc");
        }
    });

    function getReviews(url) {
        $.ajax({
            url: url,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            success: function (response) {
                if (response.reviews.length > 0) {
                    setReviews(response);
                    console.log(response);
                    setPagination(response);
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
    }

    function setPagination(params) {
        let html = "";
        let pageItems = "";
        let leftIndicator = "";
        let rightIndicator = "";

        for (let i = 1; i <= params.numPages; i++) {
            if (i == params.current) {
                pageItems = pageItems + `<li class="page-item active"><button disabled="disabled" class="page-link" value="${i}">${i}</button></li>`;
            } else {
                pageItems = pageItems + `<li class="page-item "><button class="page-link" value="${i}">${i}</button></li>`;
            }
        }

        if (params.current <= 1) {
            leftIndicator =
                leftIndicator + `<li class="page-item page-indicator"><button disabled="disabled" class="page-link" value="${params.current - 1}"> <i class="la la-angle-left"></i></button></li>`;
        } else {
            leftIndicator = leftIndicator + `<li class="page-item page-indicator"><button class="page-link" value="${params.current - 1}"> <i class="la la-angle-left"></i></button></li>`;
        }

        if (params.current >= params.numPages) {
            rightIndicator =
                rightIndicator + `<li class="page-item page-indicator"><button disabled="disabled" class="page-link" value="${params.current + 1}"> <i class="la la-angle-right"></i></button></li>`;
        } else {
            rightIndicator = rightIndicator + `<li class="page-item page-indicator"><button class="page-link" value="${params.current + 1}"> <i class="la la-angle-right"></i></button></li>`;
        }

        html =
            html +
            `
        <p >Showing ${params.perPage} from ${params.totalItem} data</p>
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

    function setReviews(data) {
        let html = "";
        $.each(data.reviews, function (key, review) {
            let review_star = "";
            if (review.review_star) {
                for (let i = 0; i < 5; i++) {
                    if (review.review_star > 0) {
                        review_star = review_star + '<i class="fa fa-star text-orange"></i>';
                    } else {
                        review_star = review_star + '<i class="fa fa-star text-gray"></i>';
                    }
                    review.review_star--;
                }
            }
            let review_status_text = "";
            if (review.review_status != "published") {
                review_status_text =
                    review_status_text +
                    `
                <button class="btn btn-outline-danger" id="delete-review" value="${review.review_id}">DELETE</button>
                <button class="btn btn-outline-success ml-2" id="edit-review" value="${review.review_id}">PUBLISH</button>
                `;
            } else {
                review_status_text =
                    review_status_text +
                    `
                <button class="btn btn-outline-danger" id="delete-review" value="${review.review_id}">DELETE</button>
                <button class="btn btn-outline-light ml-2" id="edit-review" value="${review.review_id}">UNPUBLISH</button>
                `;
            }
            html =
                html +
                `
                <div class="card review-table">
                    <div class="media">
                        
                        <img class="mr-3 img-fluid rounded align-self-center" src="/upload/${review.user_img}" alt="${review.user_img}" width="110" />
                        <div class="media-body">
                            <p class="mb-1 fs-14"><strong>Book Title:</strong> <a href="users/${review.item_id}/view">${review.item_name}</a></p>
                            <p>${review.review_text}</p>
                            <h3 class="fs-20 text-black font-w600 mb-3">
                                <a href="users/${review.user_id}/view">${review.user_name}</a>
                                <span class="star-review ml-3 d-inline-block">
                                ${review_star}
                                </span>
                            </h3>
                            <span class="fs-15">${review.review_date}</span>
                        </div>
                        <div class="media-footer d-flex align-self-center">
                            <div class="edit ml-2">
                                ${review_status_text}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if ($("#navpills-1").hasClass("active")) {
            $("#navpills-1").html(html);
        }
        if ($("#navpills-2").hasClass("active")) {
            $("#navpills-2").html(html);
        }
    }

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

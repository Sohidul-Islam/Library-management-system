$(document).ready(function () {
    var userData = JSON.parse(localStorage.getItem("userData"));
    var currentUrl = window.location.href;
    let findData = "";
    $("#searchBook").val("");
    let findBy = "";
    let sortOrder = "asc",
        currentPage = 1,
        status = "all";

    getItems("/books/find-book");
    $("#paginationText").on("click", ".page-link", function () {
        currentPage = $(this).val();
        getItems();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });
    $("#free_book").on("click", function () {
        currentPage = 1;
        sortOrder = "asc";
        if (status == "Free") {
            status = "all";
        } else {
            status = "Free";
        }
        getItems();
    });
    $("#paid_book").on("click", function () {
        currentPage = 1;
        sortOrder = "asc";
        if (status == "Paid") {
            status = "all";
        } else {
            status = "Paid";
        }
        getItems();
    });
    $("#newest").on("click", function () {
        currentPage = 1;
        sortOrder = "desc";
        $("#newOltToggle").text("Newest");
        getItems();
    });
    $("#searchIcon").on("click", function () {
        currentPage = 1;
        getItems();
    });

    $("#oldest").on("click", function () {
        currentPage = 1;
        sortOrder = "asc";
        $("#newOltToggle").text("Oldest");
        getItems();
    });

    $("#searchBook").blur(function () {
        findData = $("#searchBook").val();
    });

    $("#select_none").on("click", function () {
        $("#filterDataToggle").text($("#select_none").val());
        findBy = "";
    });
    $("#title").on("click", function () {
        $("#filterDataToggle").text($("#title").val());
        currentPage = 1;
        sortOrder = "asc";
        findBy = "item_name";
        getItems();
    });
    $("#author").on("click", function () {
        $("#filterDataToggle").text($("#author").val());
        currentPage = 1;
        sortOrder = "asc";
        findBy = "author_name";
        getItems();
    });

    $("#edition").on("click", function () {
        $("#filterDataToggle").text($("#edition").val());
        currentPage = 1;
        sortOrder = "asc";
        findBy = "edition";
        getItems();
    });
    $("#language").on("click", function () {
        $("#filterDataToggle").text($("#language").val());
        currentPage = 1;
        sortOrder = "asc";
        findBy = "language";
        getItems();
    });
    $("#isbn").on("click", function () {
        $("#filterDataToggle").text($("#isbn").val());
        currentPage = 1;
        sortOrder = "asc";
        findBy = "isbn";
        getItems();
    });
    function getItems() {
        let url = "/books/find-book";
        fullUrl = `${url}?orderBy=updated_at&sortOrder=${sortOrder}&page=${currentPage}&status=${status}&findData=${findData}&findBy=${findBy}`;

        $.ajax({
            url: fullUrl,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("x-access-token", userData.token);
            },
            success: function (response) {
                if (response.items && response.items.length > 0) {
                    setBooks(response.items);
                    setPagination(response);
                } else {
                    $("#booksRender").html(`<div class="alert alert-danger col-xl-12 col-lg-12 col-md-12 col-sm-12" role="alert" ><h1>Sorry, No Book Found!</h1></div>`);
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
    }

    function setPagination(params) {
        let html = "";
        let pageItems = "";
        let leftIndicator = "";
        let rightIndicator = "";
        let paginationHelper = "";
        if (params.start + params.perPage > params.totalItem) {
            paginationHelper = paginationHelper + `<p >Showing ${params.start + 1} to ${params.totalItem} of ${params.totalItem} entries </p>`;
        } else {
            paginationHelper = paginationHelper + `<p >Showing ${params.start + 1} to ${params.start + params.perPage} of ${params.totalItem} entries </p>`;
        }

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
            ${paginationHelper} 
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

function setBooks(items) {
    console.log(items);
    let html = "";

    $.each(items, function (key, item) {
        var review_star = "";
        if (item.avg_rating) {
            console.log(item.avg_rating);
            for (let i = 0; i < 5; i++) {
                if (item.avg_rating > 0) {
                    review_star = review_star + '<i class="fa fa-star text-orange"></i>';
                } else {
                    review_star = review_star + '<i class="fa fa-star text-gray"></i>';
                }
                item.avg_rating--;
            }
        } else {
            review_star =
                review_star +
                `<i class="fa fa-star text-gray"></i><i class="fa fa-star text-gray"></i><i class="fa fa-star text-gray"></i><i class="fa fa-star text-gray"></i><i class="fa fa-star text-gray"></i>`;
        }

        var string = item.item_name;
        var length = 22;
        var trimmedString = item.item_name.length > 22 ? item.item_name.substring(0, 22 - 4) + "..." : item.item_name;
        html =
            html +
            `
            <div class="col-xl-3 col-lg-6 col-md-4 col-sm-6">
                <div class="card">
                    <div class="card-body">
                        <div class="new-arrival-product">
                            <div class="new-arrivals-img-contnent">
                                <img class="img-fluid" src="upload/${item.cover}" alt="" />
                                <div class="img-backdrop"></div>
                                <div class="btn-box">
                                    <div class="btn-group text-center">
                                        <a class="btn btn-outline-info  " role="button" href="/books/${
                                            item.item_id
                                        }/view" data-toggle="tooltip" data-placement="bottom" title="view book"><i class="fa fa-eye"></i></a>
                                        <a class="btn btn-outline-warning" role="button" href="" data-toggle="tooltip" data-placement="bottom" title="read book"><i class="fas fa-book-open"></i></a>
                                        <a class="btn btn-outline-warning" role="button" href="/pdf/eng_grammar.pdf" data-toggle="tooltip" data-placement="bottom" title="download this book"><i class="fa fa-download"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="new-arrival-content text-left mt-3">
                                <h4><i class="fas fa-book"></i> ${item.item_name.length > 22 ? item.item_name.substring(0, 22 - 3) + "..." : item.item_name}</h4>
                                <h6><i class="fas fa-user"></i> ${item.author_name.length > 24 ? item.author_name.substring(0, 24 - 3) + "..." : item.author_name}</h6>
                                <h6><strong>Edition</strong>: ${item.edition}</h6>
                                <h6><strong>Language</strong>: ${item.language}</h6>
                                <ul class="star-rating float-right">
                                    ${review_star}
                                </ul>
                                <span class="price float-left"><span class="badge badge-lg light badge-danger">${item.status == "Free" ? item.status : "$" + item.status}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    $("#booksRender").html(html);
}

function customAlert(params) {
    Swal.fire({
        icon: params.type,
        title: params.title,
        html: `<div class="mb-2">${params.message} </div><a class=" btn btn-outline-${params.btnType}" href="${params.link}">${params.link_text}</a>`,
        showConfirmButton: false,
    });
}

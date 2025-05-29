$(function () {
    let currentPage = 0;
    const pageSize = 20;

    const regex = /\d/;
    let maxRs = parseInt($('#rs').text().match(regex)[0]);

    let isLoading = false;

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150) {
            // Gần cuối trang (cách bottom 150px)
            loadMoreData();
        }
    });

    function loadMoreData() {
        if (isLoading) return;

        isLoading = true;

        let temp = JSON.parse(sessionStorage.getItem('tourstemp'));
        console.log(temp);
        currentPage++;
        console.log('CP'+currentPage);

        for (let i = currentPage * pageSize; i < (currentPage + 1) * pageSize; i++) {
            displayTourCard(temp[i]);
            if (i == maxRs - 1)
                return;
        }

        isLoading = false;
    }

    function displayTourCard(tour) {
        let card = $('<div class="col-12 col-md-5 col-lg-5 col-xl-12 card shadow-primary mb-4 fix-height" style="min-height: 280px;"></div>');

        // const placesToVisit = tour.tour.placesToVisit;
        if(tour==null) return;

        let tourName = tour.tour.tourName;
        if (tourName.length > 150)
            tourName = tourName.substring(0, 140) + "...";


        let placesToVisitSub = tour.tour.placesToVisit;
        if (placesToVisitSub.length > 40)
            placesToVisitSub = placesToVisitSub.substring(0, 40) + "...";

        let price = formatNumberWithDots(Math.round((tour.discount.discountUnit == "%") ?
            tour.adultTourPrice * (1 - tour.discount.discountValue / 100)
            :
            tour.adultTourPrice - tour.discount.discountValue));

        let adultTourPrice = formatNumberWithDots(Math.round(tour.adultTourPrice));

        tourName = splitString(tourName, 90);

        //d-flex  h-100
        const htmlToInsert = `
                <div class="row">
                    <div class="col-12 col-xl-3 packages-img rounded-0 img-filter h-lg-100 w-30 img-lg-width pe-0 ps-0">
                        <img class="card-img-top object-fit-cover w-30" src="${tour.tour.firstImageUrl}"
                                            alt="Card image">
                                        <span class="d-block text-primary bg-white rounded-2 tag-img px-3 py-2">${tour.tour.category.categoryName}</span>
                    </div>
                    <div class="col-12 col-xl-7 card-content px-3 mt-3 mt-lg-3 px-lg-2 my-lg-2 w-md-100">
                                        <h5 class="text-primary fw-bold text-justify py-0 my-0 tour-title-lite">${tourName}</h5>
                                        <div class="d-xl-flex justify-content-between py-0 my-2">
                                            <div class="d-flex">
                                                <i class="bi bi-ticket-fill text-primary me-2"></i>
                                                <p class="fs-6 text-primary fw-bold py-0 my-0">${tour.tourUnitId}
                                                </p>
                                            </div>
                                            <div class="d-flex mt-2 mt-lg-0">
                                                <i class="bi bi-life-preserver text-primary me-2"></i>
                                                <p class="fs-6 text-primary fw-bold py-0 my-0">${tour.festival.festivalName}</p>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-between py-0 my-0">
                                            <p class="heading6 text-dark mb-2"><i class="bi bi-clock-fill me-2"></i>${tour.tour.duration}</p>
                                            <i class="bi bi-airplane-fill text-dark rotate-45"></i>
                                        </div>
                                        <p class="mb-2 heading6 text-dark pt-0"><i class="bi bi-geo-alt-fill me-2"></i><span
                                                class="text-dark">${tour.tour.departurePlace}</span></p>
                                        <div class="d-xl-flex justify-content-between">
                                            <p class="mb-2 heading6 text-dark pt-0"><i
                                                    class="bi bi-flag-fill me-2"></i><span class="text-dark">${placesToVisitSub}</span></p>
                                            <p
                                                class="mb-0 heading6 text-end text-primary text-decoration-line-through fw-bold opacity-75">
                                                ${adultTourPrice} đ</p>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <p class="mb-2 heading6 text-dark pt-0"><i class="bi bi-amd me-2"></i>
                                                <span class="text-primary span-bold">Còn ${tour.availableCapacity} chỗ</span>
                                            </p>
                                            <p class="heading-price text-end text-primary">${price} đ</p>
                                        </div>
                                    </div>
                                </div>
            `;

        card.html(htmlToInsert);

        card.on({
            'click': function () {
                localStorage.setItem("foundtour", JSON.stringify(tour));
                window.location.href = "tourunit.html";
            }
        })
        // card.addEventListener('click', () => {
        //     // Khi bấm vào thì hiện chi tiết
        //     detailTitle.textContent = tour.title;
        //     detailPrice.textContent = `Giá: ${tour.price.toLocaleString()} VND`;
        //     detailDesc.textContent = `Mô tả: ${tour.description}`;
        //     detailFull.textContent = `Chi tiết: ${tour.details}`;
        //     detailBox.style.display = 'block';
        // });
        // let cardContainer = $('<div class="col-12 col-md-6 col-lg-12"></div>');
        $('#card-list').append(card);
        // tourList.appendChild(card);
    }

    function formatNumberWithDots(numberString) {
        numberString = numberString + "";
        // Loại bỏ các dấu chấm hiện có (nếu có) để đảm bảo xử lý đúng
        const cleanedString = numberString.replace(/\./g, '');

        // Chuyển chuỗi thành số
        const number = parseInt(cleanedString, 10);

        // Kiểm tra xem có phải là số hợp lệ không
        if (isNaN(number)) {
            return "Không phải là số hợp lệ";
        }

        // Sử dụng toLocaleString để định dạng với dấu chấm phân cách hàng nghìn
        return number.toLocaleString('vi-VN');
    }

    function splitString(s, len) {
        if (s.length > len) {
            return s.substring(0, len) + '...'
        }
        return s;
    }

    $('#btnApply, #btnFind2, #btnFind, #btnBook, #bookNow').click(function () {
        currentPage = 0;
    })

})
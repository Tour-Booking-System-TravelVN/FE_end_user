document.addEventListener('DOMContentLoaded', function () {
    $('#btnFind, #btnBookNow').click(function () {
        let keywords = $('#keywords').val();
        let departure_date = $('#start_date').val();
        let price = $('#price').val();
        let data = {
            "keywords": keywords,
            "departure_date": departure_date,
            "price": price,
            "page": 0
        }
        localStorage.setItem("data", JSON.stringify(data));


        data = JSON.parse(localStorage.getItem("data"));
        // localStorage.removeItem("data");
        console.log(data);

        const baseUrl = 'http://localhost:8080/tourunit/foundtourlist';
        const params = new URLSearchParams();
        params.append('keywords', keywords);
        params.append('departure_date', departure_date);
        params.append('price', price);
        params.append('page', 0);

        const apiUrlWithParams = `${baseUrl}?${params.toString()}`;

        fetch(apiUrlWithParams, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
            //,
            //body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.code == 0) {
                    localStorage.setItem("foundtours", JSON.stringify(data));
                    $('#card-list').html("");
                    if (!window.location.pathname.includes("/foundtourlist.html"))
                        window.location.href = "foundtourlist.html";
                    let result = JSON.parse(localStorage.getItem("foundtours"));

                    sessionStorage.setItem('tourstemp', JSON.stringify(result.result));

                    $("#rs").text(result.message);
                    let tours = result.result;

                    let index = 0;
                    for (let tour of tours) {
                        console.log("Tour index:", index);
                        displayTourCard(tour);
                        index++;
                        if (index == 20) break;
                    }
                    // tours.forEach(tour => {
                    //     displayTourCard(tour)
                    // });
                }
            })
            .catch((error) => {
                console.log('Error: ', error);
            })
    })

    function displayTourCard(tour) {
        let card = $('<div class="card shadow-primary mb-4" style="height: 280px;"></div>');

        // const placesToVisit = tour.tour.placesToVisit;

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

        const htmlToInsert = `
                <div class="d-flex h-100">
                    <div class="packages-img rounded-0 img-filter h-100 w-30 img-lg-width">
                        <img class="card-img-top object-fit-cover h-100" src="${tour.tour.firstImageUrl}"
                                            alt="Card image">
                                        <span class="d-block text-primary bg-white rounded-2 tag-img px-3 py-2">${tour.tour.category.categoryName}</span>
                                    </div>
                                    <div class="card-content my-2 mx-3 w-100">
                                        <h5 class="text-primary fw-bold text-justify py-0 my-0 tour-title-lite">${tourName}</h5>
                                        <div class="d-flex justify-content-between py-0 my-2">
                                            <div class="d-flex">
                                                <i class="bi bi-ticket-fill text-primary me-2"></i>
                                                <p class="heading5 text-primary fw-bold py-0 my-0">${tour.tourUnitId}
                                                </p>
                                            </div>
                                            <div class="d-flex">
                                                <i class="bi bi-life-preserver text-primary me-2"></i>
                                                <p class="heading5 text-primary fw-bold py-0 my-0">${tour.festival.festivalName}</p>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-between py-0 my-0">
                                            <p class="heading6 text-dark mb-2"><i class="bi bi-clock-fill me-2"></i>${tour.tour.duration}</p>
                                            <i class="bi bi-airplane-fill text-dark rotate-45"></i>
                                        </div>
                                        <p class="mb-2 heading6 text-dark pt-0"><i class="bi bi-geo-alt-fill me-2"></i><span
                                                class="text-dark">${tour.tour.departurePlace}</span></p>
                                        <div class="d-flex justify-content-between">
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
                                            <p class="heading3 text-end text-primary">${price} đ</p>
                                        </div>
                                    </div>
                                </div>
            `;

        card.html(htmlToInsert);

        card.on({
            'click': function () {
                localStorage.setItem("foundtour", JSON.stringify(tour));
                if (sessionStorage.getItem("tourChoiced"))
                    sessionStorage.removeItem("tourChoiced");
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

})



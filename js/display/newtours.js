import { buildUrl, getPrice, formatNumberWithDots, splitString } from "../utils/utils.js"

$(function () {

    fetch(buildUrl("http://localhost:8080/tourunit/foundtourlist", { type: 3 }), {
        method: "GET",
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 0) {
                let tourUnits = data.result;
                tourUnits.forEach(tourUnit => {
                    displayTour(tourUnit);
                });

                $('#more-nt').click(function(){
                    localStorage.setItem('foundtours', JSON.stringify(data));
                    // window.location.href = "foundtourlist.html";
                })
            }
        })
        .catch(error => {
            console.log("ERROR: ", error);
        })

    function displayTour(tourUnit) {
        let tour = tourUnit.tour;
        let adultTourPrice = tourUnit.adultTourPrice;
        adultTourPrice = formatNumberWithDots(adultTourPrice);

        let discountPrice = getPrice(tourUnit.adultTourPrice, tourUnit.discount)
        let tourName = tour.tourName;
        tourName = splitString(tourName, 80);

        let item = `
            <div class="packages-item rounded shadow-primary mb-3 me-3">
                    <div class="packages-img">
                        <img src="${tour.firstImageUrl}" class="rounded-top object-fit-cover h-100" alt="Image">
                        <div class="discount">${tourUnit.discount.discountName}</div>
                    </div>
                    <div class="packages-content bg-light rounded-bottom">
                        <div class="p-3 pb-0 d-grid gap-0">
                            <h5 class="mb-3 text-primary fw-bold text-justify tour-title">${tourName}</h5>
                            <div class="d-flex justify-content-between pb-0 mb-0">
                                <p class="heading6 text-dark mb-2"><i class="bi bi-clock-fill me-2"></i>${tour.duration}</p>
                                <i class="bi bi-airplane-fill text-dark rotate-45"></i>
                            </div>
                            <p class="mb-2 heading6 text-dark pt-0"><i class="bi bi-geo-alt-fill me-2"></i>Khởi hành:
                                <span class="text-primary">${tour.departurePlace}</span>
                            </p>
                            <p
                                class="mb-0 heading6 text-end text-primary text-decoration-line-through fw-bold opacity-75">
                                ${adultTourPrice} đ</p>
                            <p class="heading4 text-end text-primary">${discountPrice} đ</p>
                        </div>
                    </div>
                </div>
        `;

        // Tạo phần tử từ chuỗi HTML
        let $item = $(item);
        $('#newtours-caro').append($item);
        $item.click(function(){
            localStorage.setItem('foundtour', JSON.stringify(tourUnit));
            if(sessionStorage.getItem("tourChoiced"))
                sessionStorage.removeItem("tourChoiced");
            window.location.href = "tourunit.html";
        })
    }

    setTimeout(function () {
        // packages carousel
        $(".packages-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            center: false,
            dots: false,
            loop: true,
            margin: 25,
            nav: true,
            navText: [
                '<i class="bi bi-arrow-left"></i>',
                '<i class="bi bi-arrow-right"></i>'
            ],
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 2
                },
                1200: {
                    items: 3
                }
            }
        });
    }, 1500)
})
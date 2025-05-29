import { buildUrl, formatDate, formatNumberWithDots, splitString } from "../utils/utils.js"

$(function () {
    fetch(buildUrl("http://localhost:8080/booking/mytours", { status: 'opw', page: 0 }), {
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
                let bookings = data.result.content;
                bookings.forEach(booking => {
                    displayBooking(booking, true);
                });
            }
        })
        .catch(error => {
            console.log("ERROR: ", error);
        })

    fetch(buildUrl("http://localhost:8080/booking/mytours", { status: 'done', page: 0 }), {
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
                let bookings = data.result.content;
                bookings.forEach(booking => {
                    displayBooking(booking, false);
                });
            }
        })
        .catch(error => {
            console.log("ERROR: ", error);
        })


    function displayBooking(booking, tab1) {
        let classColor = 'text-dark';
        let status = 'Undefined';
        if (booking.status == 'O') {
            classColor = 'text-info';
            status = 'Đang đi';
        } else if (booking.status == 'P') {
            classColor = 'text-success';
            status = 'Chuẩn bị đi';
        } else if (booking.status == 'W') {
            classColor = 'text-danger';
            status = 'Chờ hủy';
        } else if (booking.status == 'D') {
            classColor = 'text-primary';
            status = 'Đã đi';
        }

        let tourUnit = booking.tourUnit;
        let tour = tourUnit.tour;

        let departureDate = formatDate(tourUnit.departureDate);
        let returnDate = formatDate(tourUnit.returnDate);
        let totalAmount = formatNumberWithDots(booking.totalAmount);

        let tourName = splitString(tour.tourName, 70);

        const item = $(`<div class="col-12 col-md-6 col-lg-4 px-2 mt-2"></div>`);
        item.append(`
                <div class="card shadow-primary">
                    <div class="packages-img">
                        <img class="card-img-top object-fit-cover h-100" src="${tour.firstImageUrl}"
                            alt="Card image">
                    </div>

                    <div class="card-body">
                        <h5 class="mb-3 text-primary fw-bold text-justify tour-title-lite">${tourName}</h5>
                        <div class="d-flex justify-content-between pb-0 mb-0">
                            <div class="d-flex">
                                <i class="bi bi-ticket-fill text-primary me-2"></i>
                                <p class="heading5 text-primary fw-bold">${tourUnit.tourUnitId}</p>
                            </div>
                            <div class="d-flex">
                                <i class="bi bi-ticket-perforated-fill rotate-45 text-primary me-2 me-lg-4 me-xl-2"></i>
                                <p class="heading5 text-primary fw-bold">${booking.bookingId}</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between pb-0 mb-0">
                            <p class="heading6 text-dark mb-2"><i class="bi bi-clock-fill me-2"></i>${tour.duration}</p>
                            <p class="heading6 text-dark">${departureDate} - ${returnDate}</p>
                        </div>
                        <p class="mb-2 heading6 text-dark pt-0"><i class="bi bi-amd me-2"></i>Trạng thái:
                            <span class="${classColor} span-bold">${status}</span></p>
                        <p class="heading4 text-end text-primary">${totalAmount} đ</p>
                    </div>
                </div>
                `)
        $(item).click(function () {
            sessionStorage.setItem('bookingChoiced', JSON.stringify(booking));
            window.location.href = 'bookingdetail.html';
        })
        if (tab1) {
            $('#opwList').append(item);
        } else {
            $('#dList').append(item);
        }
    }
})
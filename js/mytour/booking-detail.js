import { buildUrl, formatDate, formatNumberWithDots, splitString, convertNewlineToBr } from "../utils/utils.js"

$(function () {

    let booking = JSON.parse(sessionStorage.getItem('bookingChoiced'));

    let foundtour = booking.tourUnit;
    let category = foundtour.tour.category;
    let tour = foundtour.tour;

    let tourName = tour.tourName;
    if (tourName.length > 150)
        tourName = tourName.substring(0, 140) + "...";


    let placesToVisitSub = tour.placesToVisit;
    // if (placesToVisitSub.length > 50)
    //     placesToVisitSub = placesToVisitSub.substring(0, 50) + "...";

    let discount = foundtour.discount;

    let adultTourPrice = getPrice(foundtour.adultTourPrice);
    let toddlerTourPrice = getPrice(foundtour.toddlerTourPrice);
    let childTourPrice = getPrice(foundtour.childTourPrice);

    let privateRoom = formatNumberWithDots(Math.round(foundtour.privateRoomPrice))

    //Breadcrumb + h3
    $("#category-breadcrumb").text(category.categoryName);
    $(".tourname").text(tour.tourName);
    $(".tourname").eq(0).text(tourName);


    //Carousel
    let imageSet = tour.imageSet;

    let index = 0;
    let activeClass = 'active choose';
    imageSet.forEach(img => {
        let carousel_item = $('<div class="carousel-item w-100" style="height: 70vh;"></div>');

        carousel_item.html(`
                    <img src="${img.url}" class="object-fit-cover w-100 h-100" alt="...">
                `);

        $('#carousel-list').append(carousel_item);

        let thumbnail_item = $('<div class="h-100 owl-thumb"></div>');
        thumbnail_item.html(`
                <img src="${img.url}" class="thumbnail-img object-fit-cover w-100 h-100 ${activeClass}"
                                    data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}">
                `);
        $('#carousel-thumbnail').append(thumbnail_item);

        // let btncarou = $(`<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}"
        //                         aria-current="true"></button>`);
        if (index == 0) {
            carousel_item.addClass('active');
            activeClass = '';
        }


        // $('#carousel-btn').append(btncarou);
        index++;
    });


    let discount_tag = $('<div class="tour-offer bg-info fw-bold fs-5"></div>');
    discount_tag.text(discount.discountName);
    $('#carousel-list').append(discount_tag);

    // //Calendar

    // let currentMonthIndex;
    // let currentYearValue;

    // function generateCalendar(year, month) {
    //     currentMonthIndex = month;
    //     currentYearValue = year;

    //     //obj thời gian hiện tại
    //     const today = new Date();

    //     //Tháng, năm, ngày hiện tại
    //     const currentMonth = month;
    //     const currentYear = year;
    //     const currentDate = (today.getMonth() === month && today.getFullYear() === year) ? today.getDate() : -1; // Lấy ngày hiện tại nếu đang ở tháng hiện tại

    //     // const monthYearElement = document.getElementById("month-year");
    //     // const calendarBodyElement = document.getElementById("calendar-body");

    //     // const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    //     //     "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    //     // monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    //     // Lấy thông tin tháng trước
    //     //obj thời gian ngày cuối tháng trước
    //     const prevMonth = new Date(currentYear, currentMonth, 0);
    //     //Ngày tháng trước
    //     const daysInPrevMonth = prevMonth.getDate();
    //     //Thứ của ngày đầu tháng này
    //     const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    //     //Ví dụ: ngày 30 ngày 4 - ngày đầu tháng 5 thứ năm (4)
    //     //Tạo hàng
    //     let row1 = $('<div class="row pt-3 gap-3 gap-3"></div>');

    //     //Con thoi
    //     let shuttle = 0;
    //     let flag = false;

    //     // Hiển thị các ngày cuối tháng trước
    //     for (let i = firstDayOfMonth - 1; i > 0; i--) {
    //         const day = daysInPrevMonth - i + 1; //30-3+1=28 => Để hiện từ thứ 2
    //         let cell = $(`<div class="text-muted text-center fs-5 fw-bold col cell-day cell-day">
    //                                         ${day}
    //                                         <p class="heading7 text-danger"><small></small></p>
    //                                     </div>`)
    //         row1.append(cell);
    //         shuttle++;
    //     }

    //     let row2 = $('<div class="row pt-3 gap-3 gap-3"></div>');
    //     // Hiển thị các ngày của tháng hiện tại
    //     //Ví dụ: 15/5/2025
    //     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


    //     //Duyệt từ ngày 1 đến ngày 31/5
    //     for (let day = 1; day <= daysInMonth; day++) {
    //         let dayClass = "text-dark";
    //         if (day < currentDate) {
    //             dayClass = "text-muted";
    //         } else if (day === currentDate && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
    //             dayClass = "text-dark"; // Thêm class 'today' nếu muốn đánh dấu ngày hiện tại
    //         }
    //         // if(true)
    //         let cell = (`<div class="${dayClass} text-center fs-5 fw-bold col cell-day cell-day">
    //                                         ${day}
    //                                         <p class="heading7 text-danger"><small></small></p>
    //                                     </div>`);
    //         //Tăng chỉ số con thoi
    //         shuttle++;
    //         if (!flag) {
    //             //Nếu chưa đầy hàng 1 => Thêm ô
    //             row1.append(cell);

    //             //Đầy hàng 1. => Đóng hàng 1 và thêm vào lịch. Reset con thoi
    //             if (shuttle == 7) {
    //                 flag = true;
    //                 shuttle = 0;
    //                 $('.face-before').append(row1);
    //             }
    //         } else {
    //             //Thêm ô
    //             row2.append(cell);
    //             //Đầy hàng 1
    //             //Đầy hàng sau
    //             if (shuttle == 7) {
    //                 //Reset con thoi
    //                 shuttle = 0;
    //                 //Đưa hàng vào lịch
    //                 $('.face-before').append(row2);
    //                 //Tạo hàng mới
    //                 row2 = $('<div class="row pt-3 gap-3 gap-3"></div>');
    //             }
    //         }
    //     }

    //     // Lấy thông tin tháng sau
    //     const daysLeft = 35 - (firstDayOfMonth + daysInMonth);//35-(4+31) // Giả sử hiển thị tối đa 35 ô (5 hàng)
    //     for (let i = 1; i <= daysLeft + 1; i++) { //i<=1. Vì Chủ nhật ở cuối
    //         let cell = (`<div class="text-muted text-center fs-5 fw-bold col cell-day cell-day">
    //             ${i}
    //             <p class="heading7 text-danger"><small></small></p>
    //         </div>`);

    //         //Thêm ô vào hàng
    //         row2.append(cell);
    //     }

    //     //Thêm hàng vào lịch
    //     $('.face-before').append(row2);
    //     $('.face-before').find(".cell-day").css('min-height', '76px');
    // }

    // // Khởi tạo lịch với tháng và năm hiện tại khi trang tải
    // const initialDate = new Date();
    // generateCalendar(initialDate.getFullYear(), initialDate.getMonth());

    //Price box
    $('#de-re-date').text(formatDate(foundtour.departureDate) + " - " + formatDate(foundtour.returnDate));
    $('#departure-date').text(formatDate(foundtour.departureDate));
    $('.adultTourPrice').text(adultTourPrice + " đ");
    $('#childTourPrice').text(childTourPrice + " đ");
    $('#toddlerTourPrice').text(toddlerTourPrice + " đ");
    $('#babyTourPrice').text(foundtour.babyTourPrice + " đ");
    $('#privateRoomPrice').text(privateRoom + " đ");

    $('#aQ').text('x ' + booking.adultNumber);
    $('#cQ').text('x ' + booking.childNumber);
    $('#tQ').text('x ' + booking.toddlerNumber);
    $('#bQ').text('x ' + booking.babyNumber);
    $('#pQ').text('x ' + booking.privateRoomNumber);

    //Additional Info
    $('#targetAudience').text(tour.targetAudience);
    $('#cuisine').text(tour.cuisine);
    $('#idealTime').text(tour.idealTime);

    $('#description').html(convertNewlineToBr(tour.description));

    $('#inclusions').html(convertNewlineToBr(tour.inclusions));
    $('#exclusions').html(convertNewlineToBr(tour.exclusions));

    $('#note').html(convertNewlineToBr(booking.note));

    //Companion Customer
    let companionCustomerSet = booking.companionCustomerSet;

    companionCustomerSet.forEach(item => {
        $('#companions').append(`
            <div class="card-body rounded-1 text-primary fs-5 fw-bold border border-primary mb-2 col-5">
                ${item.fullName}
            </div>
            `)
    })

    //Tour-Program => Viết API vào

    //Ratings => Viết API vào

    //Right Side
    $('#totalAmount').text(formatNumberWithDots(booking.totalAmount) + ' đ');
    $('#bookingid').text(booking.bookingId);

    let classColor = 'text-dark';
    let status = 'Undefined';
    if (booking.status == 'O') {
        $('#btnCancelTour').addClass('d-none');
        $('#btnRating').addClass('d-none');
        classColor = 'text-info';
        status = 'Đang đi';
    } else if (booking.status == 'P') {
        $('#btnRating').addClass('d-none');
        classColor = 'text-success';
        status = 'Chuẩn bị đi';
    } else if (booking.status == 'W') {
        $('#btnCancelTour').addClass('d-none');
        $('#btnRating').addClass('d-none');
        classColor = 'text-danger';
        status = 'Chờ hủy';
    } else if (booking.status == 'D') {
        $('#btnCancelTour').addClass('d-none');
        classColor = 'text-primary';
        status = 'Đã đi';

        //fetch nữa
        fetch(buildUrl("http://localhost:8080/rating/rating-tour/check", { tourUnitId: foundtour.tourUnitId }), {
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
                    if(!data.result)
                        $('#btnRating').addClass('d-none');
                }
            })
            .catch(error => {
                console.log("ERROR: ", error);
            })
        // $('#btnRating').addClass('d-none');
    }

    $('#status').text(status).addClass(classColor);

    $('#tourUnitId').text(foundtour.tourUnitId);
    $('#duration').text(tour.duration);
    $('#departurePlace').text(tour.departurePlace);
    $('#placesToVisit').text(placesToVisitSub);
    $('#availableCapacity').text("Còn " + foundtour.availableCapacity + " chỗ");

    $('#categoryName').text(category.categoryName);
    $('#ca-description').text(category.description);

    let festival = foundtour.festival;
    if (festival == null) {
        $('#festivalName').parent().parent().hide();
    } else {
        $('#festivalName').text(festival.festivalName);
        $('#fes-description').text(festival.description);
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

    function getPrice(price) {
        return formatNumberWithDots(Math.round((discount.discountUnit == "%") ?
            price * (1 - discount.discountValue / 100)
            :
            price - discount.discountValue))
    }

    function formatDate(isoDate) {
        // Kiểm tra định dạng đầu vào
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(isoDate)) {
            return "Định dạng ngày không hợp lệ (yyyy-mm-dd)";
        }

        const parts = isoDate.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        return `${ day } / ${ month } / ${ year }`;
    }

    setTimeout(function () {
        $(".sm-img-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 600,
            center: true,
            dots: true,
            loop: true,
            margin: 5,
            nav: false,
            autoplayTimeout: 3000,
            navText: [
                '<i class="bi bi-arrow-left"></i>',
                '<i class="bi bi-arrow-right"></i>'
            ],
            responsiveClass: false,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 3
                },
                992: {
                    items: 4
                },
                1200: {
                    items: 5
                }
            }
        });


        //Xử lý owl
        let owl = $(".owl-carousel");
        let nextSlide = function () {
            //Phần tử đang đươc chọn
            let point = $('.thumbnail-img').filter('.choose');

            // Tìm phần tử cha thực sự trong Owl Carousel
            let parent = point.closest('.owl-item');

            // Nếu index không hợp lệ, đặt parent là phần tử đầu tiên
            if (parent.length === 0 || parent.index() === -1) {
                parent = $('.owl-item').first();
            }

            point.removeClass('choose');
            parent.next().find('.thumbnail-img').addClass('choose');
        };

        let slideInterval = setInterval(nextSlide, 3100);

        // Hàm đặt lại interval
        function resetInterval() {
            clearInterval(slideInterval); // Xóa interval cũ
            slideInterval = setInterval(nextSlide, 3100); // Đặt lại interval mới
        }

        $('.thumbnail-img').click(function () {
            $('.thumbnail-img').removeClass('choose');
            $(this).addClass('choose');
            resetInterval();
        });
        $('.carousel-control-prev').click(function () {
            //Phần tử đang đươc chọn
            let point = $('.thumbnail-img').filter('.choose');

            // Tìm phần tử cha thực sự trong Owl Carousel
            let parent = point.closest('.owl-item');

            //Nếu cha nằm ngoài danh sách (về đầu thì cần quay lại cuối)
            if (parent.index() == -1) {
                parent = $('.owl-item').last();
            }

            point.removeClass('choose');
            parent.prev().find('.thumbnail-img').addClass('choose');
            resetInterval()
        });
        $('.carousel-control-next').click(function () {
            //Phần tử đang đươc chọn
            let point = $('.thumbnail-img').filter('.choose');

            // Tìm phần tử cha thực sự trong Owl Carousel
            let parent = point.closest('.owl-item');

            // Nếu index không hợp lệ, đặt parent là phần tử đầu tiên
            if (parent.length === 0 || parent.index() === -1) {
                parent = $('.owl-item').first();
                console.log("Fixed parent index:", parent.index());
            }

            point.removeClass('choose');
            parent.next().find('.thumbnail-img').addClass('choose');
            resetInterval();
        });
        $('#carouselExampleIndicators').hover(function () {
            //Khi hover chuột vào carousel xóa interval và dừng owl carousel
            clearInterval(slideInterval);
            owl.trigger("stop.owl.autoplay");
        }, function () {
            //Mở lại interval và owl carousel
            resetInterval();
            owl.trigger("play.owl.autoplay", [3000]); // Tiếp tục với tốc độ 3 giây
        });
    }, 1000);
})
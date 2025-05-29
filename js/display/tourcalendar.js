import { buildUrl, formatDate, formatIsoDate, formatNumberWithK, formatNumberWithDots, getPrice, getPriceToCell } from "../utils/utils.js"

$(function () {

    let foundtour = JSON.parse(localStorage.getItem("foundtour"));
    let tourId = foundtour.tour.tourId;

    //Lấy ra các tháng và năm của tour có thể đặt
    fetch(`http://localhost:8080/tour/calendar/${tourId}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.code == 0) {
                let rs = data.result;
                rs.forEach((item, index) => {
                    displayRadio(item, index);
                });
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        })

    function displayRadio(item, index) {
        let month = item.month;
        month = month < 10 ? '0' + month : month;
        let year = item.year;

        let radioId = `radio_${index}`;
        let card = $('<div class="ps-0 mb-3"></div>')
        let checked = "";
        if (index == 0) {
            checked = "checked";
            generateCalendar(parseInt(month)-1, year);
            getTourUnitCalendar(month, year, tourId);
        }
        card.html(`
            <input type="radio" class="btn-check" name="optradio" ${checked} value="${month}/${year}" id="${radioId}" autocomplete="off">
            <label class="btn btn-outline-primary py-2 w-100 optradio" for="${radioId}">${month}/${year}</label>
        `)
        $('#monthYearBox').append(card);
    }

    //Calendar

    let currentMonthIndex;
    let currentYearValue;

    //Tạo lịch
    // function generateCalendar(month, year) {
    //     $('.face-before').empty();
    //     $('.face-before').append(`
    //             <div class="row pt-3 gap-3">
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T2</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T3</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T4</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T5</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T6</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">T7</div>
    //                                     <div class="text-primary text-center fs-5 fw-bold col">CN</div>
    //                                 </div>
    //         `)
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


        //Duyệt từ ngày 1 đến ngày 31/5
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
    //     const daysLeft = 35 - (firstDayOfMonth + daysInMonth);//35-(4+31) // Giả sử hiển thị tối đa 35 ô (6 hàng)
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

    function generateCalendar(month, year) {
        // Xóa nội dung cũ trong lịch (div chứa lịch)
        $('.face-before').empty();
    
        // Thêm hàng tiêu đề các ngày trong tuần (Thứ 2 → Chủ nhật)
        $('.face-before').append(`
            <div class="row pb-3 pb-md-0 pt-3 g-0 gap-md-3">
                <div class="text-primary text-center rfs-calendar fw-bold col">T2</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">T3</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">T4</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">T5</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">T6</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">T7</div>
                <div class="text-primary text-center rfs-calendar fw-bold col">CN</div>
            </div>
        `);
    
        // Lấy ngày hôm nay để đánh dấu
        const today = new Date();
        const currentDate = (today.getMonth() === month && today.getFullYear() === year) ? today.getDate() : -1;
    
        // Xác định thứ của ngày 1 trong tháng (CN = 0, T2 = 1, ...)
        const firstDay = new Date(year, month, 1).getDay();
    
        // Tổng số ngày trong tháng hiện tại
        const daysInMonth = new Date(year, month + 1, 0).getDate();
    
        // Tổng số ngày trong tháng trước
        const daysInPrevMonth = new Date(year, month, 0).getDate();
    
        let calendarCells = [];
    
        // ======= 1. Thêm các ngày của **tháng trước** để lấp đầy dòng đầu =======
        // Số ngày tháng trước cần hiển thị để dòng đầu tiên bắt đầu từ Thứ 2
        let prevDays = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = daysInPrevMonth - prevDays + 1; i <= daysInPrevMonth; i++) {
            calendarCells.push({
                day: i,
                muted: true  // đánh dấu là ngày của tháng trước
            });
        }
    
        // ======= 2. Thêm các ngày **trong tháng hiện tại** =======
        for (let i = 1; i <= daysInMonth; i++) {
            calendarCells.push({
                day: i,
                today: i === currentDate // đánh dấu nếu là ngày hiện tại
            });
        }
    
        // ======= 3. Thêm các ngày của **tháng sau** để đủ 42 ô (6 hàng) =======
        while (calendarCells.length < 42) {
            calendarCells.push({
                day: calendarCells.length - (prevDays + daysInMonth) + 1,
                muted: true  // đánh dấu là ngày của tháng sau
            });
        }
    
        // ======= 4. Render lịch: chia thành các hàng 7 ngày (tương ứng 1 tuần) =======
        for (let i = 0; i < calendarCells.length; i += 7) {
            let row = $('<div class="row pt-0 pt-md-3 g-0 gap-md-3"></div>');
            for (let j = i; j < i + 7; j++) {
                const cellInfo = calendarCells[j];
                // Áp dụng class để phân biệt ngày hiện tại, ngày mờ (tháng khác)
                let cls = cellInfo.muted ? 'text-muted' : 'text-dark';
    
                row.append(`
                    <div class="${cls} text-center rfs-calendar fw-bold col cell-day">
                        ${cellInfo.day}
                        <p class="heading7 text-danger"><small></small></p>
                    </div>
                `);
            }
            $('.face-before').append(row);
        }
    
        // Đảm bảo các ô ngày có chiều cao tối thiểu đồng đều
        $('.face-before').find(".cell-day").css('min-height', '76px');
    }    
    

    // Khởi tạo lịch với tháng và năm hiện tại khi trang tải
    // const initialDate = new Date();
    // generateCalendar(initialDate.getFullYear(), initialDate.getMonth());

    //Lấy các đơn vị tour theo tháng, năm, mã tour
    function getTourUnitCalendar(monthInput, yearInput, tourIdInput) {
        fetch(buildUrl("http://localhost:8080/tourunit/calendar", { month: monthInput, year: yearInput, tourid: tourIdInput }), {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.code == 0) {
                    let rs = data.result; //rs tương đương tourUnits
                    sessionStorage.setItem("tourUnits", JSON.stringify(rs));
                    rs.forEach((item, index) => {
                        displayCellDay(item, index);
                    });
                }
            })
            .catch(error => {
                console.log('Error: ', error);
            })
    }

    let flag = true;

    //Hiển thị ô lịch
    function displayCellDay(item, index) {
        if(index == 0 && flag){
            if(!sessionStorage.getItem("tourChoiced"))
                sessionStorage.setItem("tourChoiced", JSON.stringify(item));
            flag = false;
        }

        let departureDate = item.departureDate;
        let day = departureDate.split('-').pop();
        day = parseInt(day);
        console.log(day);

        let cellFilled = $('.face-before').find('.cell-day').filter(function () {
            return $(this).text().trim() === day + "";
        });
        cellFilled.find('small').first().text(getPriceToCell(item.adultTourPrice, item.discount));

        cellFilled.click(function(){
            // sessionStorage.removeItem("tourChoiced");
            sessionStorage.setItem("tourChoiced", JSON.stringify(item));
            displayRightSideAndPriceBox(item);
            $('.face-before').toggleClass('d-none');
            $('.face-after').toggleClass('d-none');
        })
    }

    $('.face-before').addClass('d-none');
    $('.face-after').removeClass('d-none');

    $('#back').css('cursor', 'pointer');
    $('#back, #btnOtherDays').click(function () {
        if($(".face-before").hasClass("d-none")){
            $('.face-before').toggleClass('d-none');
            $('.face-after').toggleClass('d-none');
        }
    })

    //Hiệu ứng
    $('#monthYearBox').on('click', '.optradio', function () {
        $('.optradio').removeClass('active');
        $(this).addClass('active');
        console.log($(this).prev().val());
        let temp = $(this).prev().val().split("/");
        getTourUnitCalendar(parseInt(temp[0]), parseInt(temp[1]), tourId);
        generateCalendar(parseInt(temp[0])-1, parseInt(temp[1]));
        if($(".face-before").hasClass("d-none")){
            $('.face-before').toggleClass('d-none');
            $('.face-after').toggleClass('d-none');
        }
    })

    $('.face-before').on('mouseenter', '.cell-day', function () {
        if ($(this).find('small').text() != "")
            $(this).addClass('border-cell-day');
    });

    $('.face-before').on('mouseleave', '.cell-day', function () {
        if ($(this).find('small').text() != "")
            $(this).removeClass('border-cell-day');
    });

    //Hiển thị
    function displayRightSideAndPriceBox(tourChoiced) {
        $('#discount').text(tourChoiced.discount.discountName);
        console.log("DISCOUNT: ",tourChoiced.discount.discountName);
        let adultTourPrice = getPrice(tourChoiced.adultTourPrice, tourChoiced.discount);
        let toddlerTourPrice = getPrice(tourChoiced.toddlerTourPrice, tourChoiced.discount);
        let childTourPrice = getPrice(tourChoiced.childTourPrice, tourChoiced.discount);

        let privateRoom = formatNumberWithDots(Math.round(tourChoiced.privateRoomPrice))

        $('#de-re-date').text(formatDate(tourChoiced.departureDate) + " - " + formatDate(tourChoiced.returnDate));
        $('#departure-date').text(formatDate(tourChoiced.departureDate));
        $('.adultTourPrice').text(adultTourPrice + " đ");
        $('#childTourPrice').text(childTourPrice + " đ");
        $('#toddlerTourPrice').text(toddlerTourPrice + " đ");
        $('#babyTourPrice').text(tourChoiced.babyTourPrice + " đ");
        $('#privateRoomPrice').text(privateRoom + " đ");

        $('#tourUnitId').text(tourChoiced.tourUnitId);
        // $('#duration').text(tour.duration);
        // $('#departurePlace').text(tour.departurePlace);
        // $('#placesToVisit').text(placesToVisitSub);
        $('#availableCapacity').text("Còn " + tourChoiced.availableCapacity + " chỗ");

        // $('#categoryName').text(category.categoryName);
        // $('#ca-description').text(category.description);

        let festival = tourChoiced.festival;
        if (festival == null) {
            $('#festivalName').parent().parent().hide();
        } else {
            $('#festivalName').text(festival.festivalName);
            $('#fes-description').text(festival.description);
        }
    }
})
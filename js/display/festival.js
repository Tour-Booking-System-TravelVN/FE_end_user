$(function () {

    fetch("http://localhost:8080/festival/carousel", {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 0) {
                let festivals = data.result;
                festivals.forEach(element => {
                    displayFestival(element);
                });
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        })

    function displayFestival(festival) {
        let item = $('<div class="text-center mx-2"></div>');
        item.html(`<button class="btn btn-outline-primary rounded-pill py-2 my-1 btn-festival" style="min-width=250px;">${festival.festivalName}</button>`)
        $('.festival-carousel').append(item);
    }

    setTimeout(function () {
        let items = $(".festival-carousel").children();
        items = items.children();
        let maxwidth = items.eq(0).width();
        items.each((index, element) => {
            if(index != 0){
                maxwidth = maxwidth > $(element).width() ? maxwidth : $(element).width();
            }
        })
        items.width(maxwidth);

        $(".festival-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 600,
            center: true,
            dots: true,
            loop: true,
            margin: 150,
            nav: false,
            // navText : [
            //     '<i class="bi bi-arrow-left"></i>',
            //     '<i class="bi bi-arrow-right"></i>'
            // ],
            responsiveClass: true,
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
                    items: 6
                }
            }
        });
    }, 500);
})
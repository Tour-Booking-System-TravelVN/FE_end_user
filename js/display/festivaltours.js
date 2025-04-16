import { buildUrl } from "../utils/utils.js"
$(function () {
    $('.festival-carousel').on('click', '.btn-festival', function () {
        fetch(buildUrl("http://localhost:8080/tourunit/foundtourlist", { type: 5, festival:$(this).text() }), {
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
                    localStorage.setItem('foundtours', JSON.stringify(data));
                    sessionStorage.setItem('tourstemp', JSON.stringify(data.result));
                    window.location.href = "foundtourlist.html";
                }
            })
            .catch(error => {
                console.log("ERROR: ", error);
            })
    })
    // $('.btn-festival, .national-item').click(function () {
    //     // window.location.href = "foundtourlist.html";
    // });
})
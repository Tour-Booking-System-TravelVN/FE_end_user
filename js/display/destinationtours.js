import { buildUrl } from "../utils/utils.js"
$(function () {
    $('.destination-img').click(function () {
        let destination = $(this).find('a').text();

        fetch(buildUrl("http://localhost:8080/tourunit/foundtourlist", { keywords: destination, price: "0-Infinity"}), {
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
                    sessionStorage.setItem('tourstemp', JSON.stringify(data.result));
                    window.location.href = "foundtourlist.html";
                }
            })
            .catch((error) => {
                console.log('Error: ', error);
            })
    })
})

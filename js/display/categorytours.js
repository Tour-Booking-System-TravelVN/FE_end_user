import { buildUrl } from "../utils/utils.js"
$(function () {
    $('.national-item').on('click', function () {
        let categoryName = $(this).find('h5').eq(0).text().split(' ').slice(1).join(' ');
        // console.log(categoryName);
        fetch(buildUrl("http://localhost:8080/tourunit/foundtourlist", { type: 4, category: categoryName}), {
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

    $('#category-breadcrumb').click(function(){
        let categoryName = $(this).text();
        // console.log(categoryName);
        fetch(buildUrl("http://localhost:8080/tourunit/foundtourlist", { type: 4, category: categoryName}), {
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
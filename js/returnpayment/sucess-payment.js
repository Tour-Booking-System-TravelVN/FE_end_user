$(function () {

    const baseUrl = 'http://localhost:8080/booking/';
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const orderCode = params.get("orderCode");
    const status = params.get("status");

    console.log("Mã thanh toán:", code);
    console.log("Mã đơn hàng:", orderCode);
    console.log("Trạng thái:", status);

    const apiUrlWithParams = `${baseUrl}${orderCode}`;

    fetch(apiUrlWithParams, {
        method: 'GET',
        credentials: 'include',
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
                $('#bookingid').text(data.result);
            }
        })
        .catch((error) => {
            console.log('Error: ', error);
        })
})
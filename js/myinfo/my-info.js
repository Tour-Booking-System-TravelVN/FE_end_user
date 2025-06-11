import { formatDate } from ".././utils/utils.js"

$(function () {

    let nullString = '[Trống]';

    fetch("http://localhost:8080/customer/myinfo", {
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
                let account = data.result;
                let customer = account.c;

                console.log(customer);

                $('.customer-info-unique').eq(0).text(customer.firstname + " " + customer.lastname);
                $('#c-fullName').val($('.customer-info-unique').eq(0).text());

                $('#email').text(account.email);
                $('#c-email').val(account.email);

                $('#username').text(account.username);
                $('#c-username').val(account.username);

                $('#dob').text(formatDate(customer.dateOfBirth));
                $('#c-dob').val(customer.dateOfBirth);

                $('#gender').text(customer.gender ? 'Nữ' : 'Nam');
                customer.gender ? $('#female').prop('checked', true) : $('#male').prop('checked', true);

                $('#nationality').text((customer.nationality == null || customer.nationality == "") ? nullString : customer.nationality);
                if (customer.nationality != null) {
                    let options = $('#select-natio').children();
                    options.prop('selected', 'false');
                    options.each((index, element) => {
                        if ($(element).text() == customer.nationality)
                            $(element).prop('selected', true);
                    });
                    // console.log($('#select-natio').val());
                }

                $('.address').text((customer.address == null || customer.address == "") ? nullString : customer.address);
                $('#c-address').val(customer.address);

                $('#phonenumber').text((customer.phoneNumber == null || customer.phoneNumber == "") ? nullString : customer.phoneNumber);
                $('#c-phone').val(customer.phoneNumber);

                $('#ci').text(displayText(customer.citizenId));
                $('#c-ci').val(customer.citizenId);

                $('#passport').text(displayText(customer.passport));
                $('#c-passport').val(customer.passport);
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        })

    function displayText(param) {
        let rs = (param == null || param == "") ? nullString : param;
        return rs;
    }

    // $("#btnChange, #btnUpdate").click(function(){
    //     console.log('Có click tôi');
    //     $(this).toggleClass('d-none');
    //     $(this).siblings().toggleClass('d-none');
    // })

    $("#btnChange, #btnCancel").click(function(){
        $(this).toggleClass('d-none');
        $(this).siblings().toggleClass('d-none');
        $('.customer-info').toggleClass('d-none');
        $('.customer-info').next().toggleClass('d-none');
        $('.customer-info-unique').toggleClass('d-none');

    });
    // $("#btnUpdate").click(function(){
    //     $(this).toggleClass('d-none');
    //     $(this).siblings().toggleClass('d-none');
    //     $('.customer-info').removeClass('d-none');

    // });

    $('#myinfo-form').find('input, textarea').addClass('text-dark');
})
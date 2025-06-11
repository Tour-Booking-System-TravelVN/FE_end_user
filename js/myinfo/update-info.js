import {
    validateFullName, validateAgeRange, validateAddressLite, validateEmail, validatePhoneNumberLite,
    validateCILite, validatePassportLite
} from "../validate.js"

import { splitFullName, formatDate } from "../utils/utils.js"

$(function () {
    let nullString = '[Trống]';
    (function () {
        $('#c-fullName').on("input", function () {
            if (!validateFullName($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Họ và tên chỉ chứa ký tự chữ và khoảng trắng. Từ 5 đến 50 ký tự.');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-dob').on("input", function () {
            if (!validateAgeRange($(this).val(), 15, 125)) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Người từ 15 đến 125 tuổi mới được đặt tour');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-address').on("input", function () {
            if (!validateAddressLite($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Địa chỉ nếu được nhập thì phải hơn 20 ký tự và không quá 255 ký tự.');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-email').on("input", function () {
            if (!validateEmail($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Email không hợp lệ');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-phone').on("input", function () {
            if (!validatePhoneNumberLite($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Số điện thoại không hợp lệ');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-ci').on("input", function () {
            if (!validateCILite($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Căn cước không hợp lệ.');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#c-passport').on("input", function () {
            if (!validatePassportLite($(this).val())) {
                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().text('Hộ chiếu không hợp lệ');
            } else {
                $(this).removeClass("is-invalid");
                $(this).addClass("is-valid");
            }
        })

        $('#btnUpdate').on('click', function (e) {
            const form = document.getElementById('updateInfoForm');

            const html5Valid = form.checkValidity();
            const hasInvalid = $('#updateInfoForm').find('.is-invalid').length > 0;

            const toast = new bootstrap.Toast($('#liveToast')[0]);
            const toast2 = new bootstrap.Toast($('#liveToast2')[0]);
            if (!html5Valid || hasInvalid) {
                // e.preventDefault(); // nếu dùng type="submit" thì cần
                // console.warn("Form không hợp lệ, không gửi dữ liệu");

                // Cho hiển thị validate UI (nếu có dùng Bootstrap 5)
                $('#updateInfoForm').removeClass('needs-validated');
                form.classList.add('was-validated');


                $('#toastPwd2').text("Hãy kiểm tra lại thông tin nhập vào.");
                toast2.show();
                return;
            }

            let arr = splitFullName($("#c-fullName").val());
            let firstname = arr[0];
            let lastname = arr[1];

            // Nếu hợp lệ thì tiến hành gửi
            fetch('http://localhost:8080/customer/myinfo/update', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": $('#c-email').val(),
                    "c": {
                        "firstname": firstname,
                        "lastname": lastname,
                        "dob": $('#c-dob').val(),
                        "gender": parseInt($('input[name="gender"]:checked').val()),
                        "nationality": $('#c-nationality').val(),
                        "citizenid": $('#c-ci').val(),
                        "passport": $('#c-passport').val(),
                        "phonenumber": $('#c-phone').val(),
                        "note": null,
                        "address": $('#c-address').val()
                    }
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.code == 0) {
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

                                    let fullName = customer.firstname + " " + customer.lastname;
                                    $('.customer-info-unique').eq(0).text(fullName);
                                    $('#fullname').text(fullName);
                                    
                                    localStorage.setItem("fullname", fullName);
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
                                    $('.c-address').val(customer.address);

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

                        $('#toastPwd2').text("Cập nhật thông tin thành công.");
                        toast2.show();
                        $(this).toggleClass('d-none');
                        $(this).siblings().toggleClass('d-none');
                        $('.customer-info').toggleClass('d-none');
                        $('.customer-info').next().toggleClass('d-none');
                        $('.customer-info-unique').toggleClass('d-none');
                    } else {
                        $('#toastPwd').text(data.message);
                        toast.show();
                    }
                })
                .catch((error) => {
                    // window.location.href = "500.html";
                    console.error('Error2:', error);
                    // window.location.href = "500.html";
                });
        })
    })();

    function displayText(param) {
        let rs = (param == null || param == "") ? nullString : param;
        return rs;
    }
});
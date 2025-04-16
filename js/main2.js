import { validateFullName, validateEmail, validateAge, validateUsername, validatePwd } from "./validate.js";

document.addEventListener('DOMContentLoaded', function () {
    var header_auth = document.getElementById("header-auth");

    fetch('http://localhost:8080/auth/introspect', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code != 0) {
                unauthen();
                return;
            }

            //Xác minh được token
            if (data.result.valid) {
                authen();
                return;
            } 

            let fullname = localStorage.getItem('fullname');
            console.log('Fullname: ', fullname);
            //Không có fullname trong storage
            if (!fullname || fullname.trim() === "") {
                let currentPath = window.location.pathname;
                let restrictedPages = ["/mytour.html", "/bookingdetail.html", "/myinfo.html", "/success.html", "/bookingtour.html"];

                if (restrictedPages.includes(currentPath)) {
                    window.location.href = "index.html"; // Chuyển về trang index
                } else {
                    console.log("Không cần chuyển hướng.");
                }
                unauthen();
                return;
            }

            // fetch('http://localhost:8080/auth/refresh', {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({})
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(data);
            //         if (data.result.role != 'CUSTOMER') {
            //             alert('Trang web chỉ dành cho khách hàng!');
            //             unauthen();
            //             return;
            //         }
            //         if (data.code != 0) {
            //             let currentPath = window.location.pathname;
            //             let restrictedPages = ["/mytour.html", "/bookingdetail.html", "/myinfo.html", "/success.html", "/bookingtour.html"];

            //             if (restrictedPages.includes(currentPath)) {
            //                 window.location.href = "index.html"; // Chuyển về trang index
            //             }
            //         }
            //         // localStorage.setItem("token", data.result.token);  // Lưu token vào localStorage
            //         localStorage.setItem("fullname", data.result.fullname);  // Lưu thông tin người dùng vào localStorage
            //         authen();
            //     })
            //     .catch((error) => {
            //         console.error('Error1:', error);
            //         unauthen();
            //         // window.location.href = "index.html";
            //     })
        })
        .catch((error) => {
            // window.location.href = "500.html";
            let currentPath = window.location.pathname;
            let restrictedPages = ["/mytour.html", "/bookingdetail.html", "/myinfo.html", "/success.html", "/bookingtour.html"];

            if (restrictedPages.includes(currentPath)) {
                window.location.href = "index.html"; // Chuyển về trang index
            } else {
                console.log("Không cần chuyển hướng.");
            }

            console.error('Error2:', error);
            unauthen();

            // let fullname = localStorage.getItem('fullname');
            // console.log('Fullname: ', fullname);
            // //Không có fullname trong storage
            // if (!fullname || fullname.trim() === "") {
            //     unauthen();
            //     return;
            // }



            // fetch('http://localhost:8080/auth/refresh', {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({})
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(data);
            //         if (data.result.role != 'CUSTOMER') {
            //             alert('Trang web chỉ dành cho khách hàng!');
            //             unauthen();
            //             return;
            //         }
            //         if (data.code != 0) {
            //             let currentPath = window.location.pathname;
            //             let restrictedPages = ["/mytour.html", "/bookingdetail.html", "/myinfo.html", "/success.html"];

            //             if (restrictedPages.includes(currentPath)) {
            //                 window.location.href = "index.html"; // Chuyển về trang index
            //             }
            //         }
            //             // localStorage.setItem("token", data.result.token);  // Lưu token vào localStorage
            //             localStorage.setItem("fullname", data.result.fullname);  // Lưu thông tin người dùng vào localStorage
            //             authen();
            //         })
            //     .catch((error) => {
            //         console.error('Error1:', error);
            //         window.location.href = "index.html";
            //     })
            // window.location.href = "500.html";
        });

    //Authen người dùng
    function authen() {
        // document.querySelectorAll('.header-unauth').forEach(element => {
        //     element.classList.add("d-none");
        // });
        // header_auth.classList.remove("d-none");

        document.getElementById('fullname').textContent = localStorage.getItem('fullname');
    }

    //unAuthen người dùng
    function unauthen() {
        document.querySelectorAll('.header-unauth').forEach(element => {
            element.classList.remove("d-none");
        });
        header_auth.classList.add("d-none");
        localStorage.removeItem('fullname');
        // localStorage.clear();
    }

    document.getElementById('btnRegister').addEventListener('click',
        function () {
            if (!(document.getElementById('registerForm')?.checkValidity()) || document.querySelector('#registerForm .is-invalid')) return;

            let username = document.getElementById('floatingUsername').value;
            let password = document.getElementById('floatingPassword').value;

            let fullname = document.getElementById('floatingFullName').value.trim();

            fullname = fullname.split(' ');
            let temp = document.getElementById('floatingFullName').value.trim();
            let lastname = fullname.pop();
            let firstname = fullname.join(' ');

            let dob = document.getElementById('floatingDob').value;
            let gender = parseInt(document.querySelector('input[name=optradio]:checked').value);

            let c = { firstname: firstname, lastname: lastname, dob: dob, gender: gender };

            let email = document.getElementById('floatingEmail').value;
            let status = "OFF";

            let useraccount = { username: username, password: password, c: c, status: status, email: email };

            console.log(useraccount);
            fetch('http://localhost:8080/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    useraccount
                )
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code == 0) {
                        document.getElementById("register").addEventListener("hidden.bs.modal", function () {
                            document.activeElement.blur(); // Bỏ focus khỏi phần tử đang focus
                        });

                        let modal = bootstrap.Modal.getInstance(document.getElementById("register")); // Lấy instance của modal
                        modal.hide(); // Ẩn modal

                        // document.querySelectorAll('.header-unauth').forEach(element => {
                        //     element.classList.add("d-none");
                        // });

                        // header_auth.classList.remove("d-none");

                        document.getElementById('fullname').textContent = temp;

                        //localStorage.setItem("token", data.result.token);  // Lưu token vào localStorage
                        // localStorage.setItem("fullname", fullname);  // Lưu thông tin người dùng vào localStorage
                    }
                    console.log("Data: ", data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });

    document.getElementById('btnLogout').addEventListener('click', function () {
        console.log("Kích logout");
        fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {}
                // { "token": localStorage.getItem("token") }
            )
        })
            .then(response => response.json())
            .then(data => {
                if (data.code == 0) {
                    let currentPath = window.location.pathname;
                    let restrictedPages = ["/mytour.html", "/bookingdetail.html", "/myinfo.html", "/success.html"];

                    if (restrictedPages.includes(currentPath)) {
                        window.location.href = "index.html"; // Chuyển về trang index
                    } else {
                        console.log("Không cần chuyển hướng.");
                    }

                    // localStorage.removeItem("token");
                    localStorage.removeItem("fullname");
                    // header_auth.classList.add("d-none");

                    // document.querySelectorAll('.header-unauth').forEach(element => {
                    //     element.classList.remove("d-none");
                    // });

                    // document.querySelector("#header-auth").classList.add("d-none");
                    unauthen();
                    // Nếu đang ở các trang cụ thể thì chuyển hướng về index
                }
                console.log("Data: ", data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    document.getElementById('btnLogin').addEventListener('click', function () {
        if (!(document.getElementById('loginForm')?.checkValidity()) || document.querySelector('#loginForm .is-invalid')) return;

        let username = document.getElementById('floatingUsernameLogin').value;
        let password = document.getElementById('floatingPasswordLogin').value;

        fetch('http://localhost:8080/auth/token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { "username": username, "password": password }
            )
        })
            .then(response => response.json())
            .then(data => {
                if (data.code == 0) {
                    if (data.result.role != 'CUSTOMER') {
                        alert('Trang web chỉ dành cho khách hàng!');
                        return;
                    }

                    document.getElementById("login").addEventListener("hidden.bs.modal", function () {
                        document.activeElement.blur(); // Bỏ focus khỏi phần tử đang focus
                    });

                    let modal = bootstrap.Modal.getInstance(document.getElementById("login")); // Lấy instance của modal
                    modal.hide(); // Ẩn modal                        

                    document.querySelectorAll('.header-unauth').forEach(element => {
                        element.classList.add("d-none");
                    });
                    header_auth.classList.remove("d-none");
                    authen();

                    document.getElementById('fullname').textContent = data.result.fullname;

                    // localStorage.setItem("token", data.result.token);  // Lưu token vào localStorage
                    localStorage.setItem("fullname", data.result.fullname);  // Lưu thông tin người dùng vào localStorage
                }
                console.log("Status: ", data.status);
                console.log("Code: ", data.code);
                console.log("Data: ", data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    (function () {
        'use strict'

        // Lấy form
        const form = document.getElementById('registerForm');
        // Lấy trường họ và tên
        const fullNameInput = document.getElementById('floatingFullName');

        // Thêm event listener cho sự kiện 'input' (khi giá trị trường thay đổi)
        fullNameInput.addEventListener('input', function () {
            // Kiểm tra tính hợp lệ của trường
            if (!this.checkValidity() || !validateFullName(fullNameInput.value)) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                $(this).next().next().text('Họ và tên chỉ chứa ký tự chữ và khoảng trắng. Từ 5 đến 50 ký tự.')
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });

        //Kiểm tra email
        $('#floatingEmail').on({
            'input': function () {
                if (!validateEmail($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Email không hợp lệ');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        //Kiểm tra tuổi
        $('#floatingDob').on({
            'input': function () {
                if (!validateAge($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Ngày sinh không hợp lệ');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        //Kiểm tra tên đăng nhập
        $('#floatingUsername').on({
            'input': function () {
                if (!validateUsername($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Tên đăng nhập gồm 8 đến 40 ký tự chữ hoặc số.');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        //Kiểm tra mật khẩu
        $('#floatingPassword').on({
            'input': function () {
                if (!validatePwd($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Mật khẩu từ 6 đến 20 ký tự.');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        // Ngăn chặn submit form nếu không hợp lệ (vẫn giữ lại logic submit khi hợp lệ)
        // form.addEventListener('submit', function (event) {
        //     if (!form.checkValidity()) {
        //         event.preventDefault();
        //         event.stopPropagation();
        //     }
        //     form.classList.add('was-validated');
        // }, false);
    })();

    (function () {
        'use strict'

        // Lấy form
        const form = document.getElementById('loginForm');

        //Kiểm tra tên đăng nhập
        $('#floatingUsernameLogin').on({
            'input': function () {
                if (!validateUsername($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Tên đăng nhập gồm 8 đến 40 ký tự chữ hoặc số.');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        //Kiểm tra mật khẩu
        $('#floatingPasswordLogin').on({
            'input': function () {
                if (!validatePwd($(this).val())) {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                    $(this).next().next().text('Mật khẩu từ 6 đến 20 ký tự.');
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
            }
        })

        // Ngăn chặn submit form nếu không hợp lệ (vẫn giữ lại logic submit khi hợp lệ)
        // form.addEventListener('submit', function (event) {
        //     if (!form.checkValidity()) {
        //         event.preventDefault();
        //         event.stopPropagation();
        //     }
        //     form.classList.add('was-validated');
        // }, false);
    })();
});

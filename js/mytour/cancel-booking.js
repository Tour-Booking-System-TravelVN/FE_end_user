
$(function () {
    let booking = JSON.parse(sessionStorage.getItem('bookingChoiced'));
    let bookingId = booking.bookingId;

    const toast2 = new bootstrap.Toast($('#liveToast2')[0]);
    

    $('#btnContinue').click(function () {
        const modal = bootstrap.Modal.getInstance($('#cancelTour')[0]);
        fetch(`http://localhost:8080/booking/cancel/${bookingId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                if(data.code == 0){
                    if(data.result){
                        $('#toastPwd2').html("Đã gửi yêu cầu hủy tour.<br>Nhân viên sẽ liên hệ với bạn sớm nhất để xác nhận.");
                        toast2.show();
                        $('#btnCancelTour').addClass('d-none');
                        modal.hide();
                        $('#status').text('Chờ hủy');
                        $('#status').removeClass('text-success');
                        $('#status').addClass('text-danger');
                    } else {
                        $('#toastPwd2').text("Có lỗi xảy ra. Không thể hủy tour.");
                        toast2.show();
                    }
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            })
    })
})
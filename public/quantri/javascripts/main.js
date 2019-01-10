// // setTimeout(() => {
// //     kendo.alert('Có lỗi xảy ra trong quá trình tải ứng dụng, vui lòng liên hệ Quản trị viên. Xin lỗi vì sự bất tiện này');
// // }, 10000);
// $(document).ready(function () {
//     $("#menu").kendoMenu();

$(document).ready(function () {
    var wndChangePwd;
    $('#changepwd').click(function (e) {
        e.preventDefault();
        if (!wndChangePwd) {
            $('<div/>', {
                id: "wndChangePwd"
            }).appendTo(document.body);
            $('#wndChangePwd').html(`<div class="k-popup-edit-form k-window-content k-content">
                <div class="k-edit-form-container">
                <div class="k-edit-label">
                    <label for="oldPwd">M&#x1EAD;t kh&#x1EA9;u c&utilde;</label>
                </div>
                <div data-container-for="oldPwd" class="k-edit-field">
                    <input type="text" name="oldPwd" class="k-input k-textbox"/>
                </div>
                <div class="k-edit-label">
                    <label for="pwd">M&#x1EAD;t kh&#x1EA9;u m&#x1EDB;i</label>
                </div>
                <div data-container-for="pwd" class="k-edit-field">
                    <input type="password" name="pwd" class="k-input k-textbox"/>
                </div>
                <div class="k-edit-label">
                    <label for="newPwd">Nh&#x1EAD;p l&#x1EA1;i m&#x1EAD;t kh&#x1EA9;u m&#x1EDB;i</label>
                </div>
                <div data-container-for="newPwd" class="k-edit-field">
                    <input type="password" name="newPwd" class="k-input k-textbox"/>
                </div>
                <div class="k-edit-buttons k-state-default"><a role="button" href="javascript:void(0)" class="k-button k-button-icontext k-primary k-grid-update"> <span class="k-icon k-i-check"> </span>Cập nhật</a><a role="button" href="javascript:void(0)" class="k-button k-button-icontext k-grid-cancel"> <span class="k-icon k-i-cancel"> </span>Hủy</a></div>
                </div>
            </div>
            </div>`)
            wndChangePwd = $('#wndChangePwd').kendoWindow({
                title: "Đổi mật khẩu",
                position: {
                    top: '10%',
                    left: 'calc(50% - 200px)'
                },
                visible: false,
                actions: [
                    "Close"
                ],

            }).data("kendoWindow");
            $('#wndChangePwd .k-primary').click(function () {

                const oldPwd = $("#wndChangePwd input[name='oldPwd']").val();
                const pwd = $("#wndChangePwd input[name='pwd']").val();
                const newPwd = $("#wndChangePwd input[name='newPwd']").val();
                if (!oldPwd || !pwd || !newPwd)
                    alert('Vui lòng điền đầy đủ thông tin')
                else if (pwd !== newPwd)
                    alert('Mật khẩu mới không giống nhau');
                else {
                    kendo.ui.progress($('#wndChangePwd'), true);
                    $.post('/session').done(function (user) {
                        if (user.Password !== oldPwd)
                            kendo.alert('Mật khẩu cũ không chính xác');
                        else {
                            $.ajax({
                                type: 'put',
                                url: '/quantri/rest/sys_account',
                                data: {
                                    ID: user.ID,
                                    Password: newPwd
                                },
                                dataType: 'json',
                                success: function (results) {
                                    wndChangePwd.close();
                                    alert('Đổi mật khẩu thành công');
                                },
                                error: function (err) {
                                    alert('Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại');
                                }
                            })
                        }
                        kendo.ui.progress($('#wndChangePwd'), false);
                    })
                }
            })
            $('#wndChangePwd .k-grid-cancel').click(function () {
                wndChangePwd.close();
            })
        }
        wndChangePwd.open();
    })
    $('#main-menu').metisMenu();
    $("#sideNav").click(function () {
        if ($(this).hasClass('closed')) {
            $('.navbar-side').css("left","0px")
            $(this).removeClass('closed');
            $('#page-wrapper').css("margin-left","260px")

        } else {
            $(this).addClass('closed');
            $('.navbar-side').css("left","-260px")
            $('#page-wrapper').css("margin-left",0)
        }
    });
    // $("#sideNav").click();
});
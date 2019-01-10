var grid
$(document).ready(function () {
    grid = $('#table').kendoGrid({
            toolbar: [{
                name: "create",
                text: 'Thêm'
            }],
            dataSource: {
                transport: {
                    destroy: {
                        url: '/quantri/rest/sys_grouplayer',
                        dataType: 'json',
                        type: 'delete'
                    },
                    update: {
                        url: '/quantri/rest/sys_grouplayer',
                        dataType: 'json',
                        type: 'put'
                    },
                    create: {
                        url: '/quantri/rest/sys_grouplayer',
                        dataType: "json",
                        type: 'post'
                    },
                    read: {
                        url: '/quantri/rest/sys_grouplayer',
                        dataType: "json"
                    },
                    // parameterMap: function (data, type) {
                    //     if (type == "create") {
                    //         // send the created data items as the "models" service parameter encoded in JSON
                    //         return {
                    //             ID: data.ID,
                    //             Title: data.Title,
                    //             Url: data.Url,
                    //             GroupID: data.GroupID.ID,
                    //             NumericalOder: data.NumericalOder
                    //         }
                    //     }
                    //     return data;
                    // }
                },
                schema: {
                    model: {
                        id: "ID"
                    }
                },
                pageSize: 10
            },
            pageable: true,
            sortable:true,
            resizable: true,
            pageable: {
                pageSizes: true,
                messages: {
                    display: "{0} - {1} của {2}",
                    empty: "Không có dữ liệu",
                    page: "Trang",
                    allPages: "Tất cả",
                    of: "của {0}",
                    itemsPerPage: "",
                    first: "Chuyển đến trang đầu",
                    previous: "Chuyển đến trang cuối",
                    next: "Tiếp theo",
                    last: "Về trước",
                    refresh: "Tải lại"
                }
            },
            editable: "inline",
            columns: [{
                field: 'ID',
                title: 'Mã',
            }, {
                field: 'Name',
                title: 'Tên hiển thị'
            }, {
                field: 'action',
                title: 'Tác vụ',
                width: 270,
                command: [{
                    name: 'edit',
                    iconClass: '',
                    text: {
                        edit: "Chỉnh sửa",
                        cancel: "Hủy",
                        update: "Cập nhật"
                    }
                }, {
                    name: 'destroy',
                    iconClass: '',
                    text: 'Xóa'
                }],

            }]
        })
        .data('kendoGrid');

})
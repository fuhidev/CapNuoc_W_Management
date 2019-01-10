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
                        url: '/quantri/rest/sys_layer',
                        dataType: 'json',
                        type: 'delete'
                    },
                    update: {
                        url: '/quantri/rest/sys_layer',
                        dataType: 'json',
                        type: 'put'
                    },
                    create: {
                        url: "/quantri/rest/sys_layer",
                        dataType: "json",
                        type: 'post'
                    },
                    read: {
                        url: '/quantri/rest/sys_layer',
                        dataType: "json"
                    },
                    parameterMap: function (data, type) {
                        if (type == "create") {
                            // send the created data items as the "models" service parameter encoded in JSON
                            return {
                                ID: data.ID,
                                Title: data.Title,
                                Url: data.Url,
                                GroupID: data.GroupID.ID,
                                NumericalOder: data.NumericalOder
                            }
                        }
                        return data;
                    }
                },
                schema: {
                    model: {
                        id: "ID"
                    }
                },
                pageSize: 10
            },
            pageable: true,
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
            sortable: true,
            resizable: true,
            columns: [{
                field: 'ID',
                title: 'Mã',
            }, {
                field: 'Title',
                title: 'Tên hiển thị'
            }, {
                field: 'Url',
                title: 'Đường dẫn'
            }, {
                field: 'GroupID',
                title: 'Nhóm',
                editor: categoryDropDownEditor
            }, {
                field: 'NumericalOder',
                title: 'Thứ tự'
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

function categoryDropDownEditor(container, options) {
    $('<input required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            dataSource: {
                transport: {
                    read: {
                        url: "/quantri/rest/sys_grouplayer",
                        dataType: "json"
                    }
                },
            }
        });
}
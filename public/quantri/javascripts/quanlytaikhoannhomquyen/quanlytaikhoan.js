var grid, wndLayer = {
        container: null,
        table: null
    },
    wndCapability = {
        container: null,
        table: null
    },
    wndLogger, wndTab, wndContent;
$(document).ready(function () {
    renderWnd();
    grid = $('#table').kendoGrid({
            toolbar: [{
                name: "create",
                text: 'Thêm tài khoản'
            }],
            dataSource: {
                group: [{
                    field: 'RoleName'
                }],
                transport: {
                    destroy: {
                        url: '/quantri/rest/sys_account',
                        dataType: 'json',
                        type: 'delete'
                    },
                    update: {
                        url: '/quantri/rest/sys_account',
                        dataType: 'json',
                        type: 'put'
                    },
                    create: {
                        url: "",
                        dataType: "json",
                        type: 'post'
                    },
                    read: {
                        url: location.href + '&t=danhsach',
                        dataType: "json"
                    },
                    parameterMap: function (data, type) {
                        if (type == "create") {
                            // send the created data items as the "models" service parameter encoded in JSON
                            return {
                                Username: data.Username,
                                DisplayName: data.DisplayName,
                                Password: data.Password,
                                Role: data.Role.ID
                            }
                        }
                        return data;
                    }
                },
                schema: {
                    model: {
                        id: "Username",
                        fields: {
                            Password: {
                                validation: {
                                    required: true
                                }
                            }
                        }
                    }
                },
                pageSize: 10,
                error: function (a) {
                    $('#table').data("kendoGrid").cancelChanges();
                    kendo.alert('Thao tác không thành công, vui lòng kiểm tra lại khóa ngoại!');
                }
            },
            sortable:true,
            resizable: true,
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
            columns: [{
                field: 'Username',
                title: 'Tên tài khoản',
            }, {
                field: 'DisplayName',
                title: 'Tên hiển thị'
            }, {
                field: 'Password',
                title: 'Mật khẩu',
                template: "&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;",
                editor: function (container, options) {
                    $('<input data-text-field="' + options.field + '" ' +
                            'class="k-input k-textbox" ' +
                            'type="password" ' +
                            'data-value-field="' + options.field + '" ' +
                            'data-bind="value:' + options.field + '"/>')
                        .appendTo(container)
                }
            }, {
                field: 'Role',
                title: 'Quyền',
                editor: categoryDropDownEditor
            }, {
                hidden: true,
                field: 'RoleName',
                title: 'Quyền'
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
                }, {
                    name: 'logger',
                    iconClass: '',
                    text: 'Nhật ký',
                    click: loggerClickHandler
                }],

            }]
        })
        .data('kendoGrid');

})

function loggerClickHandler(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    let username = dataItem.Username;
    wndLogger.center().open();
    $.post(`/rest/sys_logger_capability/query`, {
        where: `username='${username}'`,
        order: 'ThoiGian DESC'
    }).done(result => {
        let dataSource = result;
        renderTable(wndCapability, [{
            field: 'TacVu',
            title: "Tác vụ"
        }, {
            field: 'ThoiGian',
            title: "Thời gian"
        }], dataSource);
    })
    $.post(`/rest/sys_logger_layer/query`, {
        where: `username='${username}'`,
        order: 'ThoiGian DESC'
    }).done(result => {
        let dataSource = result;
        renderTable(wndLayer, [{
            field: 'TacVu',
            title: "Tác vụ"
        }, {
            field: 'LopDuLieu',
            title: "Lớp dữ liệu"
        }, {
            field: 'ThuocTinh',
            title: "Thuộc tính"
        }, {
            field: 'ThoiGian',
            title: "Thời gian"
        }], dataSource, {
            username: username
        });
    })

}

function renderWnd() {

    wndContent = $('<div/>').appendTo(document.body)
    wndTab = $('<div/>', {
        html: `<ul>
        <li class="k-state-active">
        Nhật ký chức năng
        </li>
        <li>
        Nhật ký dữ liệu
        </li>
    </ul>
    `
    }).appendTo(wndContent);

    wndCapability.container = $('<div/>').appendTo(wndTab)
    wndLayer.container = $('<div/>').appendTo(wndTab)
    wndTab.kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
    wndLogger = wndContent.kendoWindow({
        width: "700px",
        title: "Nhật ký",
        visible: false,
        actions: [
            "Minimize",
            "Maximize",
            "Close"
        ],
    }).data("kendoWindow");
}

function renderTable(window, columns, dataSource, options = {}) {
    if (!window.table) {
        window.table = $("<div/>").appendTo(window.container);
        window.table = window.table.kendoGrid({
            messages: {
                commands: {
                    excel: 'Báo cáo kết quả truy vấn'
                }
            },
            toolbar: ["excel"],
            excel: {
                allPages: true,
                fileName: "Nhật ký truy cập " + (window.table === wndLayer.table ? "lớp dữ liệu" : "chức năng") + ` của tài khoản ${options.username}.xlsx`,
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            columnMenu: {
                messages: {
                    sortAscending: "Tăng dần",
                    sortDescending: "Giảm dần",
                    filter: "Lọc",
                    columns: "Cột"
                }
            },
            groupable: false,
            sortable: true,
            pageable: {
                pageSizes: 10,
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
            columns: columns,
        }).data("kendoGrid");
    }
    window.table.setDataSource(new kendo.data.DataSource({
        data: dataSource,
        pageSize: 5
    }));
    window.table.refresh();
}

function categoryDropDownEditor(container, options) {
    $('<input required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            dataSource: {
                transport: {
                    read: {
                        url: "/quantri/rest/sys_role",
                        dataType: "json"
                    }
                },
            }
        });
}
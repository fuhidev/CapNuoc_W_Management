var grid, listbox;

function toggleAll(target, group, fieldName) {
    // e = window.event;
    var checked = $(target).prop('checked');
    if (grid) {
        grid.dataSource
            .data()
            .filter(f => f.LayerGroup === group)
            .forEach(function (d) {
                d.set(fieldName, checked);
            });
    }
}
$(document).ready(function () {
    listbox = $('#listbox').kendoListBox({
        dataTextField: 'DisplayName',
        dataValueField: 'ID',
        dataSource: new kendo.data.DataSource({
            sort: {
                field: "DisplayName",
                dir: "asc"
            },
            transport: {
                read: {
                    url: "/quantri/rest/sys_account",
                    dataType: "json"
                }
            }
        }),
        change: function (e) {
            let dataItem = listbox.dataItem(listbox.select());
            grid.setDataSource(new kendo.data.DataSource({
                group: [{
                    field: 'LayerGroup',
                }],
                sort: {
                    field: "LayerName",
                    dir: "asc"
                },
                transport: {
                    destroy: {
                        type: 'delete',
                        url: '/quantri/rest/sys_layer_account',
                        dataType: 'json'
                    },
                    update: {
                        type: 'put',
                        url: '/quantri/rest/sys_layer_account',
                        dataType: 'json'
                    },
                    read: {
                        url: location.href + `&t=danhsach&account=${dataItem.Username}`,
                        dataType: "json"
                    },
                },
                pageSize: 10,
                schema: {
                    model: {
                        id: 'ID',
                        fields: {
                            ID: {
                                editable: false
                            },
                            LayerName: {
                                editable: false
                            },
                            IsEdit: {
                                type: 'boolean'
                            },
                            IsView: {
                                type: 'boolean'
                            },
                            IsCreate: {
                                type: 'boolean'
                            },
                            IsDelete: {
                                type: 'boolean'
                            }
                        }
                    }
                }
            }));
        }
    }).data('kendoListBox');
    grid = $('#table').kendoGrid({
        toolbar: [{
            name: 'save',
            text: 'Lưu thay đổi'
        }, {
            template: '<a class="k-button" id="btnToolbar" href="javascript:void(0)" >Cập nhật</a>'
        }],
        editable: 'incell',
        sortable: true,
        resizable: true,
        pageable: true,
        pageable: {
            pageSizes: true,
            messages: {
                display: "Số dòng: {2}",
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
        columns: [{
            field: 'ID',
            hidden: true
        }, {
            field: 'LayerGroup',
            title: 'Nhóm dữ liệu',
            groupHeaderTemplate: '#= value # | Tạo <input type="checkbox" onclick="toggleAll(this,\'#= value #\',\'IsCreate\')"/> | Xem <input type="checkbox" onclick="toggleAll(this,\'#= value #\',\'IsView\')"/> | Xóa <input type="checkbox" onclick="toggleAll(this,\'#= value #\',\'IsDelete\')"/> | Sửa <input type="checkbox" onclick="toggleAll(this,\'#= value #\',\'IsEdit\')" />',
            hidden: true
        }, {
            field: 'LayerName',
            title: 'Tên',
            sortable:true
        }, {
            field: 'IsCreate',
            title: 'Tạo',
            width: 80,
            template: "#= IsCreate ? 'Có' : 'Không' #"
        }, {
            field: 'IsView',
            title: 'Xem',
            width: 80,
            template: "#= IsView ? 'Có' : 'Không' #"
        }, {
            field: 'IsDelete',
            title: 'Xóa',
            width: 80,
            template: "#= IsDelete ? 'Có' : 'Không' #"
        }, {
            field: 'IsEdit',
            title: 'Sửa',
            width: 80,
            template: "#= IsEdit ? 'Có' : 'Không' #"
        }, {
            field: 'OutFields',
            title: 'Thuộc tính',
            width: 120
        }, {
            field: 'Definition',
            title: 'Truy vấn',
            width: 120
        }]
    }).data('kendoGrid');

    $('#btnToolbar').click(function (e) {
        kendo.ui.progress($('#table'), true)
        let id = listbox.dataItem(listbox.select())['Username'];
        $.post('', {
            Account: id
        }).done(function (e) {
            if (e === 'no-update') {

            } else {
                grid.dataSource.read();
                grid.refresh();
                kendo.ui.progress($('#table'), false)
            }
        }).fail(function (err) {
            kendo.ui.progress($('#table'), false)
        })
    })
})
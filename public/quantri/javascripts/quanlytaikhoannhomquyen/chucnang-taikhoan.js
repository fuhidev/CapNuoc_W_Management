$(document).ready(function () {
    var listbox0, listbox1, listbox2;
    let currentListBox2, currentListBox1;
    var dataItemsListBox = {
        add: [],
        remove: []
    };
    var listbox0 = $('#listbox0').kendoListBox({
        dataTextField: 'DisplayName',
        dataValueField: 'Username',
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
            let dataItem = listbox0.dataItem(listbox0.select());
            kendo.ui.progress($('#listbox1'), true)
            $.get(location.href + `&t=danhsach&table=capability&account=${dataItem.Username}`)
                .done(function (rows) {
                    listbox1.setDataSource(new kendo.data.DataSource({
                        sort: {
                            field: "Name",
                            dir: "asc"
                        },
                        data: rows
                    }));
                    currentListBox1 = rows;
                    kendo.ui.progress($('#listbox1'), false)
                })
            kendo.ui.progress($('#listbox2'), true)
            $.get(location.href + `&t=danhsach&table=capability_account&account=${dataItem.Username}`)
                .done(function (rows) {
                    listbox2.setDataSource(new kendo.data.DataSource({
                        sort: {
                            field: "Name",
                            dir: "asc"
                        },
                        data: rows.Capabilities
                    }));
                    currentListBox2 = rows.Capabilities;
                    kendo.ui.progress($('#listbox2'), false)
                })
        }
    }).data('kendoListBox');
    var listbox1 = $('#listbox1').kendoListBox({
        toolbar: {
            tools: ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
        },
        dataTextField: 'Name',
        dataValueField: 'ID',
        connectWith: 'listbox2',
    }).data('kendoListBox');
    var listbox2 = $('#listbox2').kendoListBox({
        dataTextField: 'Name',
        dataValueField: 'ID',
        add: function (e) {
            dataItemsListBox.add = e.dataItems;
            console.log(e);
        },
        remove: function (e) {
            dataItemsListBox.remove = e.dataItems;
        }
    }).data('kendoListBox');
    var viewModel = kendo.observable({
        isEnabled: true,
        btnUpdateClick: function (e) {
            this.set('isEnabled', false);
            kendo.ui.progress($('body'), true)
            let adds = [],
                removes = [];
            let account = listbox0.dataItem(listbox0.select()).Username;
            let dataItemListBox1 = listbox1.dataSource.data(),
                dataItemListBox2 = listbox2.dataSource.data();
            for (const item of dataItemListBox1) {
                let isValid = currentListBox1.some(function (s) {
                    return s.ID === item.ID
                })
                if (!isValid)
                    removes.push({
                        Capability: item.ID,
                        Account: account
                    });
            }
            for (const item of dataItemListBox2) {
                let isValid = currentListBox2.some(function (s) {
                    return s.ID === item.ID
                })
                if (!isValid)
                    adds.push({
                        Capability: item.ID,
                        Account: account
                    });
            }
            let promises = []
            for (const item of adds) {
                promises.push($.post('/quantri/rest/sys_capability_account', item));
            }
            for (const item of removes) {
                promises.push($.ajax({
                    url: '/quantri/rest/sys_capability_account',
                    type: 'delete',
                    data: {
                        where: `ACCOUNT = '${item['Account']}' AND CAPABILITY = '${item['Capability']}'`
                    }
                }));
            }
            Promise.all(promises)
                .then(_ => {
                    viewModel.set('isEnabled', true);
                    kendo.ui.progress($('body'), false);
                    adds.forEach(f => currentListBox2.push({
                        ID: f.Capability,
                        Name: null
                    }));
                })
                .catch(_ => {
                    viewModel.set('isEnabled', true);
                    kendo.ui.progress($('body'), false);
                })
        },
        change: function (e) {
            console.log("event: change");
        },
        dataBound: function (e) {
            console.log("event: dataBound");
        },
        reorder: function (e) {
            console.log("event: reorder");
        },
        remove: function (e) {
            console.log("event: remove");
        },
        accounts: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/quantri/rest/sys_account",
                    dataType: "json"
                }
            }
        })
    });
    kendo.bind($("#listbox"), viewModel);
    $("#context-menu").kendoContextMenu({
        target: "#listbox2-container",
        filter: ".k-item.k-state-selected[role='option']",
        select: function (e) {
            try {
                const
                    action = $(e.item).children(".k-link").text(),
                    account = listbox0.dataItem(listbox0.select()).ID;
                switch (action) {
                    case 'Chọn là chức năng chính':

                        let primaryCapability = listbox2.dataItem(listbox2.select()).ID;
                        $.ajax({
                            url: '/quantri/rest/sys_capability_account',
                            dataType: 'json',
                            type: 'PUT',
                            data: {
                                IsPrimary: true,
                                where: `ACCOUNT = ${account} AND Capability = '${primaryCapability}'`
                            },
                            success: function (result) {
                                kendo.alert('Cập nhật thành công');
                            }
                        });
                        break;
                    case 'Xem chức năng chính':
                        $.ajax({
                            url: `/rest/sys_capability_account?where=ACCOUNT = ${account} AND ISPRIMARY = 1`,
                            dataType: 'json',
                            type: 'GET',
                            success: function (result) {
                                let id = result[0].Capability,
                                    selectItem;
                                for (const item of listbox2.items()) {
                                    let dataItem = listbox2.dataItem(item);
                                    if (dataItem.Username === id) {
                                        listbox2.select(item);
                                        break;
                                    }
                                }
                            }
                        })
                        break;

                    default:
                        break;
                }
            } catch (error) {
                throw error
            }

        }
    });

})
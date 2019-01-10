var appRoute = [{
    id: 'QLTKNQ-LDL',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=lop-du-lieu',
    title: "Quản lý lớp dữ liệu"
  },
  {
    id: 'QLTKNQ-QLTK',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=tai-khoan',
    title: "Quản lý tài khoản"
  },
  {
    id: 'QLTKNQ-QLNQ',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=nhom-quyen',
    title: "Quản lý nhóm quyền"
  },
  {
    id: 'QLTKNQ-QLKNTC-CN-Q',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=chuc-nang-quyen',
    title: "Quản lý chức năng quyền"
  },
  {
    id: 'QLTKNQ-QLKNTC-CN-TK',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=chuc-nang-tai-khoan',
    title: "Quản lý chức năng tài khoản"
  },
  {
    id: 'QLTKNQ-QLKNTC-LDL-Q',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=lop-du-lieu-quyen',
    title: "Quản lý lớp dữ liệu quyền"
  },
  {
    id: 'QLTKNQ-QLKNTC-LDL-TK',
    url: 'quan-ly-tai-khoan-nhom-quyen?m=lop-du-lieu-tai-khoan',
    title: "Quản lý lớp dữ liệu tài khoản"
  },
  {
    id: 'TL',
    url: '',
    title: ""
  }
]

function find(id) {
  if (!id) return null;
  return appRoute.find(f => {
    return f.id === id;
  })
}

function findByUrl(url) {
  if (!url) return null;
  return appRoute.find(f => {
    return f.url === url;
  })
}
module.exports.datas = appRoute;
module.exports.find = find;
module.exports.findByUrl = findByUrl;
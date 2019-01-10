const Database = require('./Database');
class Logger extends Database{
  constructor(params) {
    super(params);
  }
  static create(params) {
    return new Logger(params);
  }
  log(username,tacvu,lopdulieu,thuoctinh,thoigian){
    this.query(`INSERT INTO SYS_LOGGER_LAYER (USERNAME,TACVU,LOPDULIEU,THUOCTINH,THOIGIAN) 
    VALUES('${username}',N'${tacvu}','${lopdulieu}','${thuoctinh}','${thoigian.getMonth()+1}-${thoigian.getDate()}-${thoigian.getFullYear()}')`)
  }
  logs(values){
    let insertSql = [];
    for (const item of values) {
      insertSql.push(`INSERT INTO SYS_LOGGER_LAYER (USERNAME,TACVU,LOPDULIEU,THUOCTINH) 
      VALUES('${item.username}',N'${item.tacVu}','${item.lopDuLieu}','${item.thuocTinh}')`)
    }
    this.query(insertSql.join(';'))
  }
  capabilityLogs(values){
    let insertSql = [];
    for (const item of values) {
      insertSql.push(`INSERT INTO SYS_LOGGER_CAPABILITY (USERNAME,TACVU) 
      VALUES('${item.username}',N'${item.tacVu}')`)
    }
    this.query(insertSql.join(';'))
  }
}
module.exports = Logger;
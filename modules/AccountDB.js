const Database = require('./Database');
class AccountManager extends Database {
  constructor(params) {
    super(params);
  }
  static create(params) {
    return new AccountManager(params);
  }
  getAllGroupRole() {
    return this.select('SELECT * FROM SYS_GroupRole');
  }
  getAll() {
    return this.select("SELECT DisplayName,Username,Password,Role,SYS_ROLE.NAME AS RoleName FROM SYS_ACCOUNT INNER JOIN SYS_ROLE ON SYS_ROLE.ID = SYS_ACCOUNT.ROLE");
  }
  getRoleByUsername(username) {
    return new Promise((resolve, reject) => {
      this.getByUsername(username).then(res => {
        if (res)
          resolve(res.role)
        else
          resolve(null);
      }).catch(err => reject(err));
    });
  }
  getByUsername(username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT ACCOUNT.*,SYS_ROLE.NAME AS RoleName, SYS_ROLE.GROUPROLE as GroupRole FROM SYS_ACCOUNT as ACCOUNT, SYS_ROLE  WHERE  ACCOUNT.ROLE = SYS_ROLE.ID AND USERNAME = '${username}'`;
      this.select(sql).then(recordset => {
        let account = recordset[0];
        if (account) {
          resolve(account)
          //this.close();
        } else {
          //this.close();
          resolve(null);
        }

      }).catch(err => {
        reject(err);
        //this.close();
      })

    });
  }
  async isUser(username, password) {
    const results = await this.select(
      `SELECT * FROM SYS_ACCOUNT WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`
    );
    if (results && results.length > 0) {
      var user = results[0];
      const capas = await this.select(`SELECT Capability FROM SYS_Capability_Account WHERE ACCOUNT = '${username}'`)
      user.Capabilities = capas.map(m => m.Capability);
      return user;
    } else {
      return null;
    }
  }
  changePassword(id, newPassword) {
    return this.query(`UPDATE SYS_ACCOUNT SET PASSWORD='${newPassword}' WHERE ID = ${id}`);
  }
  update(account) {
    let updates = [];
    if (account['displayName']) updates.push(`displayName = N'${account['displayName']}'`)
    if (account['role']) updates.push(`role = '${account['role']}'`)
    return this.query(`UPDATE SYS_ACCOUNT SET ${updates.join(',')} WHERE ID='${account.id}'`);
  }
  getById(id) {
    return this.select(`SELECT displayName,username,password,role FROM SYS_ACCOUNT WHERE id=${id} `)
  }
  getRoleById(id) {
    return this.select(`SELECT id,name FROM SYS_ROLE  WHERE id='${id}'`)
  }
  getAllRole() {
    return this.select('SELECT SYS_Role.ID,SYS_Role.Name,GroupRole,SYS_GroupRole.Name as GroupRoleName FROM SYS_ROLE  INNER JOIN SYS_GroupRole ON SYS_GroupRole.ID = SYS_ROLE.GROUPROLE');
  }
  add(account) {
    return this.query(`INSERT INTO SYS_ACCOUNT(USERNAME,PASSWORD,ROLE) VALUES('${account.username}','${account.password}','${account.role}')`);
  }
  delete(id) {
    return this.query(`DELETE FROM SYS_ACCOUNT WHERE ID=${id}`);
  }
}
module.exports = AccountManager
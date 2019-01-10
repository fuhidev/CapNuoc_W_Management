const Database = require('./Database');
var db = new Database();
module.exports = {
  getByRole: function (role) {
    return new Promise((resolve, reject) => {
      let promises = [];
      promises.push(db.select(`SELECT * FROM SYS_CAPABILITY`))
      promises.push(db.select(`SELECT Capability FROM SYS_Capability_Role WHERE ROLE = '${role}'`));
      Promise.all(promises).then(function (results) {
        let capabilities = results[0],
          roleCapability = results[1];
        let returns = [];
        for (const capability of capabilities) {
          let isSome = roleCapability.some(function (s) {
            return s['Capability'] === capability['ID']
          });
          if (!isSome)
            returns.push(capability);
        }
        resolve(returns);

      }).catch(function (err) {
        reject(err);
      })
    });
  }
}
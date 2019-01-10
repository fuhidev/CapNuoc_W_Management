const config = {
  user: 'vinhlong',
  password: 'Vinhlong@2019',
  server: '103.74.116.95',
  database: 'VWA_System',
};
let sql = require('mssql');
class Database {
  static create(params) {
    return new Database(params);
  }
  async getColumns(table) {
    return this.select(`SELECT 
      c.name 'ColumnName',
      t.Name 'DataType',
      c.max_length 'MaxLength',
      c.precision ,
      c.scale ,
      c.is_nullable,
      C.is_identity 'IsIdentity',
      ISNULL(i.is_primary_key, 0) 'PrimaryKey'
  FROM    
      sys.columns c
  INNER JOIN 
      sys.types t ON c.user_type_id = t.user_type_id
  LEFT OUTER JOIN 
      sys.index_columns ic ON ic.object_id = c.object_id AND ic.column_id = c.column_id
  LEFT OUTER JOIN 
      sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
  WHERE
      c.object_id = OBJECT_ID('${table}')`);
  }
  async query(query) {
    let pool = new sql.ConnectionPool(config);
    try {
      await pool.connect();
      let result = await pool.request().query(query);
      return result;
    } catch (error) {
      throw error;
    } finally {
      pool.close();
    }
  }
  async select(query) {
    return (await this.query(query)).recordset;
  }
}
module.exports = Database;
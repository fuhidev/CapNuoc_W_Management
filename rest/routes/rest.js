var express = require('express');
var router = express.Router();
var db = require('../../modules/Database').create();

function getTableName(url) {
    let table = url.replace(/\//g, '').replace('quantrirest', '');
    return table;
}
// A GET to the root of a resource returns a list of that resource
router.get('/', function (req, res) {
    let table = getTableName(req.baseUrl);
    console.log(table);
    let sql = `SELECT TOP 1000 * FROM ${table}`;
    if (req.query['where'])
        sql += ' WHERE ' + req.query['where']
    else if (req.params['where'])
        sql += ' WHERE ' + req.params['where']
    db.query(sql).then(rows => {
        res.write(JSON.stringify(rows.recordsets[0]));
        res.end();
    }).catch(function (err) {
        res.write('Có lỗi xảy ra');
        res.end();
    })
});
router.post('/query', function (req, res) {
    let table = getTableName(req.baseUrl);
    let sql = `SELECT TOP 1000 * FROM ${table}`;
    if (req.body['where'])
        sql += ' WHERE ' + req.body['where']
    if (req.body['order']) {
        sql += ' ORDER BY ' + req.body['order'];
    }
    db.query(sql).then(rows => {
        res.status(200).send(rows.recordset);
    }).catch(function (err) {
        res.status(400).send();
        res.end();
    })
});
// A POST to the root of a resource should create a new object
router.post('/', function (req, res) {
    let table = getTableName(req.baseUrl);
    let values = [];
    db.getColumns(table).then(function (columns) {
        let columnNames = columns.filter(function (f) {
            return f['IsIdentity'] !== 1;
        }).map(function (m) {
            return m['ColumnName'].toUpperCase()
        });
        let keys = [];
        for (const key in req.body) {
            let keyUpper = key.toUpperCase();
            if (columnNames.indexOf(keyUpper) !== -1) {
                let column = columns.find(function (f) {
                    return f['ColumnName'].toUpperCase() === keyUpper
                });
                let value;
                if ((column['DataType'] === 'varchar'))
                    value = `'${req.body[key]}'`;
                else if ((column['DataType'] === 'nvarchar')) value = `N'${req.body[key]}'`;
                else if (column['DataType'] === 'bit') {
                    let tmp = req.body[key];
                    if (tmp === true || tmp == "true")
                        tmp = 1;
                    else tmp = 0
                    value = tmp;
                } else value = req.body[key];
                keys.push(keyUpper);
                values.push(value)
            }
        }
        db.query(`INSERT INTO ${table}(${keys.join(',')}) VALUES(${values.join(',')})`).then(function (result) {
            res.status(200).send(req.body);
        }).catch(function () {
            res.status(400).send();
        })
    })

});
router.put('/', function (req, res) {
    let table = getTableName(req.baseUrl);
    let updates = [];
    db.getColumns(table).then(function (columns) {
        let columnNames = columns.map(function (f) {
            return f['ColumnName'].toUpperCase();
        });
        for (const key in req.body) {
            let column = columns.find(function (f) {
                return f['ColumnName'].toUpperCase() === key.toUpperCase()
            });
            if (!column || (column && column.PrimaryKey) || key === 'where') continue;
            if (columnNames.indexOf(key.toUpperCase()) !== -1) {

                let value;
                if (column['DataType'] === 'varchar')
                    value = `'${req.body[key]}'`;
                else if (column['DataType'] === 'nvarchar') value = `N'${req.body[key]}'`;
                else if (column['DataType'] === 'bit') {
                    let tmp = req.body[key];
                    if (tmp === true || tmp == "true")
                        tmp = 1;
                    else tmp = 0
                    value = tmp;
                } else value = req.body[key];
                updates.push(`${key} = ${value}`)
            }
        }
        if (updates.length > 0) {
            let where;
            if (req.body['where']) {
                where = req.body['where'];
            } else {
                let column = columns.find(function (f) {
                    return f['PrimaryKey'] === true
                });
                const idValue = req.body[column.ColumnName];
                if (idValue) {
                    let whereValue;
                    if ((column['DataType'] === 'varchar'))
                        whereValue = `'${idValue}'`;
                    else if ((column['DataType'] === 'nvarchar'))
                        whereValue = `N'${idValue}'`;
                    else whereValue = idValue;
                    where = `${column.ColumnName} = ${whereValue}`
                    db.query(`UPDATE ${table} SET ${updates.join(', ')} WHERE ${where}`).then(function () {
                        res.status(200).send(req.body);
                    }).catch(function () {
                        res.status(400).send();
                    })
                } else {
                    res.status(400).send('Không tìm thấy Khóa chính');
                }
            }
        } else {
            res.status(200).send(req.body);
        }
    })

});
// We specify a param in our path for the GET of a specific object
router.get('/:id', function (req, res) {});
// Similar to the GET on an object, to update it we can PATCH
router.patch('/', function (req, res) {
    let table = getTableName(req.baseUrl);
    db.query(`SELECT * FROM ${table}`).then(rows => {
        res.status(200).send(rows);
    }).catch(function (err) {
        res.status(400).send(err);
    })
});
// Delete a specific object
router.delete('/', function (req, res) {
    let table = getTableName(req.baseUrl);
    let where = req.body['where'];
    db.getColumns(table).then(function (columns) {
        let columnId = columns.find(function (f) {
            return f['PrimaryKey'] == 1;
        });
        if (!columnId) res.status(400).send('Không tìm thấy khóa chính');
        let id = req.body[columnId.ColumnName];
        if (!id) res.status(400).send('Không tìm thấy giá trị khóa chính');
        let whereStm;
        if (where) {
            whereStm = where;
        } else {
            if (columnId) {
                if ((columnId['DataType'] === 'varchar'))
                    id = `'${id}'`;
                else if ((columnId['DataType'] === 'nvarchar'))
                    id = `N'${id}'`;
                whereStm = `${columnId.ColumnName} = ${id}`
            } else {
                res.status(400).send('Không tìm thấy khóa chính');
            }
        }
        if (!whereStm)
            res.status(400).send();
        let sql = `DELETE FROM ${table} WHERE ${whereStm}`;
        db.query(sql).then(function () {
            res.status(200).send(req.body);
        }).catch(function (err) {
            res.status(400).send(err);
        })
    });
});
module.exports = router;
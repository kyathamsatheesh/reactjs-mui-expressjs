const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

const multer = require('multer');
const upload = multer({dest: './upload'})

app.get('/api/customers', (req, res) => {
    console.log("&********");
    connection.query(
        "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    console.log("39::Post:-");
    let sql = 'INSERT INTO CUSTOMER(src,name,birthday,gender,job,isDeleted) VALUES (?, ?, ?, ?, ?, 0)';//now(),
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    console.log("123:-"+image);
    console.log("123:-"+name);
    console.log("123:-"+birthday);
    console.log("123:-"+gender);
    console.log("123:-"+job);
    let params = [image, name, birthday, gender, job];
    console.log("39::sql:-"+sql);
    connection.query(sql, params, 
        (err, rows, fields) => {
            res.send(rows);
        })
})

app.delete('/api/customers/:id', (req,res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params, 
        (err, rows, fields) => {
            res.send(rows);
        })

})
app.listen(5000, () => console.log(`Listening on port ${port}`));
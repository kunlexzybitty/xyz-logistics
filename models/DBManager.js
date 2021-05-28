const mysql = require("mysql2");

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    multipleStatements: false,
});

mysqlConnection.connect((err) => {
    if (!err) {
       console.log("DB Connected");
    } else {
       console.log("DB Connection Failed");
       process. exit()
    }
 });

module.exports ={

    createNewDelivery:((Reference,PackageName)=>
    {
       return new Promise((resolve,reject)=>{

        mysqlConnection.query(
                "INSERT into "+process.env.DB_PREFIX+"delivery (rxd_reference,rxd_package) values(?,?)",
                [
                    Reference,
                    PackageName
                ],
                (err, results) => {
                  if (!err) resolve();
                  else  reject();
            });
       });
    }),

    updateDeliveryStatus:((Status,Reference)=>
    {
        return new Promise((resolve,reject)=>{

            mysqlConnection.query(
            "UPDATE "+process.env.DB_PREFIX+"delivery set rxd_status=? where rxd_reference=?",
            [
                Status,
                Reference
            ],
            (err, results) => {
              if (!err) resolve();

              else  reject();
            });
        });
    }),

    fetchDeliveryRecord:((Reference)=>
    {
        return new Promise((resolve,reject)=>{

            mysqlConnection.query(
            "SELECT rxd_id,rxd_package,rxd_status,rxd_date_created from "+process.env.DB_PREFIX+"delivery where rxd_reference=?",
            [
                Reference
            ],
            (err, results) => {
               if (!err) resolve(results);
               else  reject();

           });
        });
    }),

    createDeliveryStamp:((DeliveryId,Status)=>
    {
        return new Promise((resolve,reject)=>{

            mysqlConnection.query(
            "INSERT into "+process.env.DB_PREFIX+"delivery_stamp (rxds_delivery,rxds_status) values(?,?)",
            [
                DeliveryId,
                Status
            ],
            (err, results) => {
            if (!err) resolve();
            else  reject();
            });
        });
    }),

    fetchDeliveryStamp:((DeliveryId)=>
    {
        return new Promise((resolve,reject)=>{

            mysqlConnection.query(
            "SELECT rxds_status,rxds_date from "+process.env.DB_PREFIX+"delivery_stamp where rxds_delivery=?",
            [
                DeliveryId
            ],
            (err, results) => {
            if (!err) resolve(results);
            else  reject();

            });
         });
    })

};

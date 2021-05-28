const mysql = require("mysql2");
require('dotenv').config();

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    multipleStatements: false,
});

console.log(">> Running build script");

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("DB Connected");

        var sql = "CREATE TABLE `"+process.env.DB_PREFIX+"delivery` (\n" +
            "  `rxd_id` int NOT NULL AUTO_INCREMENT,\n" +
            "  `rxd_reference` varchar(15) NOT NULL,\n" +
            "  `rxd_package` varchar(200) DEFAULT NULL,\n" +
            "  `rxd_status` enum('IN_TRANSIT','PICKED_UP','WAREHOUSE','DELIVERED') DEFAULT 'IN_TRANSIT',\n" +
            "  `rxd_date_created` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`rxd_id`),\n" +
            "  KEY `reference` (`rxd_reference`)\n" +
            ") ENGINE=InnoDB AUTO_INCREMENT=1;";

        mysqlConnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Delivery Table created");


            var sql = "CREATE TABLE `"+process.env.DB_PREFIX+"delivery_stamp` (\n" +
                "  `rxds_id` int NOT NULL AUTO_INCREMENT,\n" +
                "  `rxds_delivery` int NOT NULL,\n" +
                "  `rxds_status` enum('IN_TRANSIT','PICKED_UP','WAREHOUSE','DELIVERED') DEFAULT NULL,\n" +
                "  `rxds_date` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
                "  PRIMARY KEY (`rxds_id`),\n" +
                "  KEY `rxd_delivery_fx_idx` (`rxds_delivery`),\n" +
                "  CONSTRAINT `rxd_delivery_fx` FOREIGN KEY (`rxds_delivery`) REFERENCES `rx_delivery` (`rxd_id`)\n" +
                ") ENGINE=InnoDB AUTO_INCREMENT=1;";

            mysqlConnection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Delivery Stamp Table created");

                console.log("Build completed");
                process.exit();
            });


        });




    } else {
        console.log("DB Connection Failed");
        process. exit()
    }
});

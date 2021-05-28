let AuthValidator = require("../middleware/AuthValidator");
let db = require("../models/DBManager");
let xssFilter = require("xss");
let dateFormat = require("moment");

exports.FetchDelivery=(req,res)=> {

    AuthValidator.validate(req, res).then(() => {

        //Parse data
        var reference = req.params.Reference || "";

        //Strip excess value to max and strip html script tag
        reference= xssFilter(reference.substring(0,15));

        if(reference.length<1) return  res.status(200).json({Status:"ERR_DELIVERY_REFERENCE",Message: 'Delivery reference is required'});


        db.fetchDeliveryRecord(reference).then((record)=> {
            if (record.length == 0) return res.status(200).json({
                Status: "NO_RECORD",
                Message: 'Delivery reference does not exist'
            });

            var DLRecord = record[0];
            var hasBeenPicked = false;
            var hasBeenDelivered = false;

            db.fetchDeliveryStamp(DLRecord.rxd_id).then((recordStamp) => {

                var Stamps={};
                //Check if package has been picked up or delivered
                recordStamp.forEach((v, k) => {
                    if (v.rxds_status === "PICKED_UP") hasBeenPicked = true;
                    if (v.rxds_status === "DELIVERED") hasBeenDelivered = true;

                    if(!Stamps[v.rxds_status]) Stamps[v.rxds_status]=[];
                    var formattedDate= dateFormat(v.rxds_date).format("YYYY-MM-DD HH:mm:ss");

                    Stamps[v.rxds_status].push(formattedDate);
                });

                res.status(200).json({
                    Status: "OK",
                    Message: 'Record found',
                    PackageName:DLRecord.rxd_package,
                    HasBeenPicked:hasBeenPicked,
                    HasBeenDelivered:hasBeenDelivered,
                    DeliveryStatus:DLRecord.rxd_status,
                    DateCreated:dateFormat(DLRecord.rxd_date_created).format("YYYY-MM-DD HH:mm:ss"),
                    Stamps:Stamps
                });

            }).catch((err)=>{
                res.status(200).json({Status:"ERR",Message: 'Could not retrieve record'+err});
            });
        })


    })
};

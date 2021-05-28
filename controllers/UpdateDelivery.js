let AuthValidator = require("../middleware/AuthValidator");
let db = require("../models/DBManager");
let xssFilter = require("xss");

exports.UpdateDelivery=(req,res)=>{

    AuthValidator.validate(req,res).then(()=> {

        //Parse data
        var status = req.body.Status || "";
        var reference = req.params.Reference || "";

        //Match status value
        if(!["IN_TRANSIT","PICKED_UP","WAREHOUSE","DELIVERED"].includes(status)) return res.status(200).json({ Status: "ERR_DELIVERY_STATUS",  Message: 'Invalid delivery status' });

        //Strip excess value to max and strip html script tag
        reference= xssFilter(reference.substring(0,15));

        if(reference.length<1) return  res.status(200).json({Status:"ERR_DELIVERY_REFERENCE",Message: 'Delivery reference is required'});


        db.fetchDeliveryRecord(reference).then((record)=>{
            if(record.length==0) return  res.status(200).json({Status:"NO_RECORD",Message: 'Delivery reference does not exist'});

            var DLRecord=record[0];
            var hasBeenPicked=false;
            var hasBeenDelivered=false;

            db.fetchDeliveryStamp(DLRecord.rxd_id).then((record)=>{

                //Check if package has been picked up or delivered
                record.forEach((v,k)=>{
                    if(v.rxds_status==="PICKED_UP") hasBeenPicked=true;
                    if(v.rxds_status==="DELIVERED") hasBeenDelivered=true;
                 });


                if(hasBeenPicked && status==="PICKED_UP") return  res.status(200).json({Status:"ERR_DELIVERY_DUPLICATE_PICKEDUP",Message: 'Package has already been picked up'});
                if(hasBeenDelivered && status==="DELIVERED") return  res.status(200).json({Status:"ERR_DELIVERY_STATUS_DELIVERY",Message: 'Package has already been delivered'});

                db.updateDeliveryStatus(status,reference).then(()=>{

                    //create delivery stamp
                    db.createDeliveryStamp(DLRecord.rxd_id,status).then().catch();

                    res.status(200).json({Status:"OK",Message: 'Delivery status updated'});

                }).catch(()=>{
                    res.status(200).json({Status:"ERR",Message: 'Failed to change delivery status'});
                });

           });


        }).catch (()=>{
           res.status(200).json({Status:"ERR",Message: 'Could not retrieve record'});
        })

    })

};
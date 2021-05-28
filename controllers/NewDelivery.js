let AuthValidator = require("../middleware/AuthValidator");
let db = require("../models/DBManager");
let xssFilter = require("xss");


exports.NewDelivery=(req,res)=>{

    AuthValidator.validate(req,res).then(()=>{

        //Parse data
        var package_name =req.body.PackageName||"";

        //Strip excess value to max and strip html script tag
        package_name= xssFilter(package_name.substring(0,200));

        if(package_name.length<1) return  res.status(200).json({Status:"ERR_PACKAGE_NAME",Message: 'Package name is required'});

        //Generate Tracking Reference
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var reference = '';
        for (var i = 15; i > 0; --i) reference += chars[Math.floor(Math.random() * chars.length)];

        db.createNewDelivery(reference,package_name).then(()=>{
            res.status(200).json({Status:"OK",Message: 'Delivery record created',Reference:reference});
        }).catch (()=>{
            res.status(200).json({Status:"ERR",Message: 'Record was not created'});
        })

    });

};
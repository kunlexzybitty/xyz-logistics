module.exports = app =>
{
    let NewDeliveryController = require("../controllers/NewDelivery");
    let TrackDeliveryController = require("../controllers/TrackDelivery");
    let UpdateDeliveryController = require("../controllers/UpdateDelivery");


    //New Delivery Route
    app.post('/delivery', NewDeliveryController.NewDelivery);

    //Update Delivery Status
    app.put('/delivery/:Reference', UpdateDeliveryController.UpdateDelivery);

    //Track Delivery
    app.get('/delivery/:Reference', TrackDeliveryController.FetchDelivery);


   //Override Global Error handler
    function errorHandler(err, req, res, next) {
        if (typeof (err) === 'string') {
            // Application error
            return res.status(400).json({Status: "ERR_400", Message: "Request was not processed"});
        }

        // default to 500 server error
        return res.status(500).json({Status: "ERR_500", Message: "An error occurred, try again later"});
    }

}

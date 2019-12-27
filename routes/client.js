const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Booking         = require('../models/booking')

//=======================
//Booking VIths
//=======================

//walks bookingcode view
router.get("/new",async (req,res)=>{
    booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
    res.render("client/new",{booking,})
})

//book post
router.post("/",(req,res)=>{
    console.log(req.body.client)
    res.redirect("/booking")
})

module.exports = router
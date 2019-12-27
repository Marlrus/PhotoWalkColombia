const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Booking         = require('../models/booking')

//=======================
//Booking VIths
//=======================

//walks bookingcode view
router.get("/new",async (req,res)=>{
    booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
    res.render("walks/book",{booking,})
})

//book post
router.post("/",(req,res)=>{
    console.log(req.body.user)
    res.redirect("/walks")
})

module.exports = router
const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

//============================
//Booking routes
//============================

//Index
router.get("/",async(req,res)=>{
    try {
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth()+1)
        // console.log(date)
        // console.log(new Date(endDate))
        bookings = await Booking.find({
            date: {
                $gte: date,
                $lte: endDate
            }
        }).sort({date: 'asc'}).populate('walk')
        // console.log(bookings)
        //_id is good
        // res.send('Index Render')
        res.render("booking/index", {bookings, endDate: new Date(endDate)})
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    
})

//walks show
router.get("/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
        res.render("booking/show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/booking")
    }
})

module.exports = router
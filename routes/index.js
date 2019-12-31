const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

//===================================
//Index Routes
//===================================

router.get("/",(req,res)=>{
    res.render("landing")
})

router.get("/about",(req,res)=>{
    res.render("about")
})

router.get("/faq",(req,res)=>{
    res.render("faq")
})
router.get("/contact",(req,res)=>{
    res.render("contact")
})

//USER PANEL WORKING CODE
router.get("/user", async(req,res)=>{
    try {
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth() + 1)
        let [runningBookings,recentBookings] = await Promise.all([
            Booking.find({
                date: {
                    $gte: date,
                    $lte: endDate
                }
            }).sort({ date: 'asc' }).populate('walk'),
            Booking.find({pickup : {$ne: true},personalized:{$ne:true}}).limit(5).populate({path: 'walk',}).populate('meetingPoint').sort({dateCreated: 'desc'})
        ])
        console.log(runningBookings)
        res.render('user/index',{runningBookings, recentBookings,})
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

//Index
router.get("/booking",async(req,res)=>{
    try {
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth()+1)
        // console.log(date)
        // console.log(new Date(endDate))
        bookings = await Booking.find({
            date: {
                $gte: date,
                $lte: endDate
            },
            personalized : {$ne: true}
        }).sort({date: 'asc'}).populate('walk')
        // console.log(bookings)
        //_id is good
        // res.send('Index Render')
        res.render("index", {bookings, endDate: new Date(endDate)})
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    
})

//booking show (CLIENT)
router.get("/booking/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
        // console.log(booking)

        res.render("show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/booking")
    }
})

module.exports = router
const   express             = require('express'),
        router              = express.Router({mergeParams: true}),
        //MODELS
        Walk                = require("../../../models/walk"),
        Booking             = require('../../../models/booking'),
        MeetingPoint        = require('../../../models/meetingPoint'),
        Client              = require('../../../models/client'),
        //ROUTES
        meetingPointRoutes  = require('./meetingPoint'),
        walkRoutes          = require('./walk'),
        bookingRoutes       = require('./booking')


//ROUTE MIDDLEWARE
router.use("/booking", bookingRoutes)
router.use("/meetingPoint", meetingPointRoutes)
router.use("/walk", walkRoutes)

//USER PANEL WORKING CODE
router.get("/", async(req,res)=>{
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

module.exports = router
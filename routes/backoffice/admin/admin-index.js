const   express             = require('express'),
        router              = express.Router({mergeParams: true}),
        //MODELS
        Models          = require('../../../models')
        Walk            = Models.Walk,
        Booking         = Models.Booking,
        MeetingPoint    = Models.MeetingPoint,
        Client          = Models.Client
        //ROUTES
        meetingPointRoutes  = require('./meetingPoint-routes'),
        walkRoutes          = require('./walk-routes'),
        bookingRoutes       = require('./booking-admin-routes')


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
            }).sort({ date: 'asc' }),
            Booking.find({pickup : {$ne: true},personalized:{$ne:true}}).limit(5).sort({date_created: 'desc'})
        ])
        console.log(runningBookings)
        console.log(recentBookings)
        res.render('backoffice/admin/index',{runningBookings, recentBookings,})
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

module.exports = router
const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../../models/walk"),
        Booking         = require('../../models/booking'),
        MeetingPoint    = require('../../models/meetingPoint'),
        //ROUTES
        bookingsRoutes  = require('./bookings-routes')

//ROUTE REQUIRING
router.use("/booking", bookingsRoutes)

//===================================
//Index Routes
//===================================

router.get("/",(req,res)=>{
    res.render("frontEnd/index")
})

router.get("/about",(req,res)=>{
    res.render("frontEnd/about")
})

router.get("/faq",(req,res)=>{
    res.render("frontEnd/faq")
})
router.get("/contact",(req,res)=>{
    res.render("frontEnd/contact")
})


module.exports = router
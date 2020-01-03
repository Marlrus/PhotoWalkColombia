const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../../models/walk"),
        Booking         = require('../../models/booking'),
        MeetingPoint    = require('../../models/meetingPoint'),
        //ROUTES
        adminRoutes  = require('./admin')

//ROUTE MIDDLEWARE
router.use("/admin", adminRoutes)

//USER ROUTES

router.get("/",(req,res)=>{
    res.send('This will be the User page')
})

module.exports = router
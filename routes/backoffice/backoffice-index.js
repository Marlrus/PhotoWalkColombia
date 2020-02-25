const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Models          = require('../../models')
        Walk            = Models.Walk,
        Booking         = Models.Booking,
        MeetingPoint    = Models.MeetingPoint,
        Client          = Models.Client
        //ROUTES
        adminRoutes  = require('./admin/admin-index')

//ROUTE MIDDLEWARE
router.use("/admin", adminRoutes)

//USER ROUTES

router.get("/",(req,res)=>{
    res.send('This will be the User page')
})

module.exports = router
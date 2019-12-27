const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

router.get("/", async(req,res)=>{
    try {
        let [booking,walk,meetingPoint] = await Promise.all([
            Booking.find({}),
            Walk.find({}),
            MeetingPoint.find({}),
        ])
        res.render('user/index',{booking, walk, meetingPoint,})
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

module.exports = router
const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')


//NEW Meeting Point
router.get('/new',(req,res)=>{
    res.render("meetingPoint/new")
})

//CREATE Meeting Point
router.post('/',async(req,res)=>{
    try {
        req.body.meetingPoint.currentVersion = true
        req.body.meetingPoint.description = req.sanitize(req.body.meetingPoint.description)
        console.log(req.body.meetingPoint)
        const meetingPoint = await MeetingPoint.create(req.body.meetingPoint)
        console.log(meetingPoint)
        res.redirect('/user')
    } catch (err) {
        console.log(err)
        res.send('error')
    }
})

module.exports = router
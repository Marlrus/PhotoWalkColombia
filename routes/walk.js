const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

//NEW WALK
router.get("/new",(req,res)=>{
    res.render("walk/new")
})

//WALK POST
router.post("/",async(req,res)=>{
    try {
        req.body.walk.currentVersion = true
        req.body.walk.shortDescription = req.sanitize(req.body.walk.shortDescription)
        req.body.walk.description = req.sanitize(req.body.walk.description)
        console.log(req.body.walk)
        const walk = await Walk.create(req.body.walk)
        console.log(walk)
        res.redirect('/user')
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

module.exports = router
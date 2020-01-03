const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../../../../models/walk"),
        Booking         = require('../../../../models/booking'),
        MeetingPoint    = require('../../../../models/meetingPoint'),
        Client          = require('../../../../models/client')

//WALK Routes
//NEW WALK
router.get("/new",async(req,res)=>{
    try {
        res.render("backEnd/admin/walk/new")
    } catch (err) {
        console.log(err)
        res.send('ERROR')
    }
})

//SHOW
router.get('/:walk_id',async(req,res)=>{
    const walk = await Walk.findById(req.params.walk_id)
    if (!walk){
        res.status(404).send(`Path not found`)
    } else {
        const bookings = await Booking.find({_id: walk.usedInBooking}).sort({date: 'asc'})
        const edits = await Walk.find({currentVersion : false})
        // console.log('==============REFRESH===========')
        // console.log(edits)
        res.render('backEnd/admin/walk/show',{walk, bookings, edits,})
    }
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
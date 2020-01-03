const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../../../../models/walk"),
        Booking         = require('../../../../models/booking'),
        MeetingPoint    = require('../../../../models/meetingPoint'),
        Client          = require('../../../../models/client')

//MEETING POINT Routes
//NEW Meeting Point
router.get('/new',(req,res)=>{
    res.render("meetingPoint/new")
})

//SHOW

router.get('/:meetingPoint_id',async(req,res)=>{
    const meetingPoint = await MeetingPoint.findById(req.params.meetingPoint_id)
    if (!meetingPoint){
        res.status(404).send(`Path not found`)
    } else {
        const bookings = await Booking.find({_id: meetingPoint.usedInBooking}).sort({date: 'asc'})
        const edits = await MeetingPoint.find({currentVersion : false})
        // console.log('==============REFRESH===========')
        // console.log(edits)
        res.render('meetingPoint/show', {meetingPoint, bookings, edits,})
    }
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
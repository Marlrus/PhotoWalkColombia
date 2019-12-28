const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

//============================
//Booking routes
//============================

//NEW Booking
router.get('/new',async(req,res)=>{
    const [walks,meetingPoints] = await Promise.all ([
        Walk.find({currentVersion:true}).sort({dateCreated: 'desc'}),
        MeetingPoint.find({currentVersion:true, name:{$ne: 'Pickup'}}).sort({dateCreated: 'desc'})
    ])
    // console.log(walks)
    // console.log(meetingPoints)
    res.render('booking/new',{walks,meetingPoints,})
})

//POST Booking
router.post('/',async(req,res)=>{
    try {
        if (req.body.booking.pickup === 'true' || req.body.booking.meetingPoint === 'true'){
            req.body.booking.pickup = true
            const meetingPoint = await MeetingPoint.findOne({name: 'Pickup', currentVersion: true})
            req.body.booking.meetingPoint = meetingPoint
        } else {
            req.body.booking.pickup = false
            const meetingPoint = await MeetingPoint.findById(req.body.booking.meetingPoint)
            req.body.booking.meetingPoint = meetingPoint
        }
        // console.log(req.body.booking.meetingPoint)
        const [booking,walk,meetingPoint] = await Promise.all ([
            Booking.create(req.body.booking),
            Walk.findById(req.body.booking.walk),
            MeetingPoint.findById(req.body.booking.meetingPoint)
        ])
        // console.log(meetingPoint)
        walk.usedInBooking.push(booking)
        walk.save()
        meetingPoint.usedInBooking.push(booking)
        meetingPoint.save()
        console.log(booking)
        // res.send('Booking POST')
        res.redirect(`/booking/${booking._id}`)
    } catch (err) {
        console.log(err)
        res.send('ERROR')
    }
})

//OLD CODE
// //walks create POST
// //WORKING MUST CLEAN WITH MODEL MIDDLEWARE
// router.post("/off",async(req,res)=>{
//     //ONLY 1 WALK PER NAME! 
//     // if(Walk.find({name:req.body.walk.name})){
//     //     // req.flash('error', `Error: A walk for ${req.body.walk.name} already exists.`)
//     //     res.redirect('back')
//     // }
//     console.log(req.body.booking.pickup)
//     if(req.body.booking.pickup==='true'){
//         req.body.booking.pickup = true
//     }else{
//         req.body.booking.pickup = false
//     }
//     req.body.walk.currentVersion = true
//     req.body.walk.description = req.sanitize(req.body.walk.description)
//     isoDate = `${req.body.booking.date}T${req.body.booking.startTime}:00`
//     req.body.booking.date = new Date(isoDate)
//     let [walk,booking,meetingPoint] = await Promise.all([
//         Walk.create(req.body.walk),
//         Booking.create(req.body.booking),
//         MeetingPoint.create(req.body.meetingPoint)
//     ]) 
//     // walk.currentVersion = true
//     // walk.save()
//     meetingPoint.save()
//     //added name to model change header to refer to bookings instead of walk themselves
//     booking.walk.push(walk._id)
//     booking.meetingPoint.push(meetingPoint._id)
//     booking.save()
//     console.log(booking)
//     // res.send('Walk Show')
//     res.redirect(`/booking/${booking._id}`)
// })



module.exports = router
const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')


//USER PANEL
router.get("/", async(req,res)=>{
    try {
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth() + 1)
        let [bookings,walks,meetingPoints] = await Promise.all([
            Booking.find({
                date: {
                    $gte: date,
                    $lte: endDate
                }
            }).sort({ date: 'asc' }).populate('walk'),
            Walk.find({}).sort({dateCreated: 'desc'}),
            MeetingPoint.find({}).sort({dateCreated: 'desc'}),
        ])
        // console.log(booking)
        // console.log(walk)
        // console.log(meetingPoint)
        res.render('user/index',{bookings, walks, meetingPoints,})
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

//NEW WALK
router.get("/walk/new",(req,res)=>{
    res.render("walk/new")
})

//WALK POST
router.post("/walk",async(req,res)=>{
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

//NEW Meeting Point
router.get('/meetingPoint/new',(req,res)=>{
    res.render("meetingPoint/new")
})

//CREATE Meeting Point
router.post('/meetingPoint',async(req,res)=>{
    try {
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

//NEW Booking
router.get('/booking/new',async(req,res)=>{
    const [walks,meetingPoints] = await Promise.all ([
        Walk.find({currentVersion:true}).sort({dateCreated: 'desc'}),
        MeetingPoint.find({currentVersion:true}).sort({dateCreated: 'desc'})
    ])
    // console.log(walks)
    // console.log(meetingPoints)
    res.render('booking/new',{walks,meetingPoints,})
})

//POST Booking
router.post('/booking',async(req,res)=>{
    const booking = await Booking.create(req.body.booking)
    console.log(booking)
    res.redirect(`/booking/${booking._id}`)
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
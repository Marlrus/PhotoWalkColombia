const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../models/walk"),
        Booking         = require('../models/booking'),
        MeetingPoint    = require('../models/meetingPoint')

//============================
//Booking routes
//============================

//Index
router.get("/",async(req,res)=>{
    try {
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth()+1)
        // console.log(date)
        // console.log(new Date(endDate))
        bookings = await Booking.find({
            date: {
                $gte: date,
                $lte: endDate
            }
        }).sort({date: 'asc'}).populate('walk')
        // console.log(bookings)
        //_id is good
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    // res.send('Index Render')
    res.render("booking/index", {bookings,})
})

//walks new
router.get("/new",(req,res)=>{
    res.render("booking/new")
})

//walks create POST
//WORKING MUST CLEAN WITH MODEL MIDDLEWARE
router.post("/",async(req,res)=>{
    //ONLY 1 WALK PER NAME! 
    // if(Walk.find({name:req.body.walk.name})){
    //     // req.flash('error', `Error: A walk for ${req.body.walk.name} already exists.`)
    //     res.redirect('back')
    // }
    console.log(req.body.booking.pickup)
    if(req.body.booking.pickup==='true'){
        req.body.booking.pickup = true
    }else{
        req.body.booking.pickup = false
    }
    req.body.walk.currentVersion = true
    req.body.walk.description = req.sanitize(req.body.walk.description)
    isoDate = `${req.body.booking.date}T${req.body.booking.startTime}:00`
    req.body.booking.date = new Date(isoDate)
    let [walk,booking,meetingPoint] = await Promise.all([
        Walk.create(req.body.walk),
        Booking.create(req.body.booking),
        MeetingPoint.create(req.body.meetingPoint)
    ]) 
    // walk.currentVersion = true
    // walk.save()
    meetingPoint.save()
    //added name to model change header to refer to bookings instead of walk themselves
    booking.walk.push(walk._id)
    booking.meetingPoint.push(meetingPoint._id)
    booking.save()
    console.log(booking)
    // res.send('Walk Show')
    res.redirect(`/booking/${booking._id}`)
})

//walks show
router.get("/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
        res.render("booking/show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/booking")
    }
})

module.exports = router
const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Walk            = require("../../../models/walk"),
        Booking         = require('../../../models/booking'),
        MeetingPoint    = require('../../../models/meetingPoint'),
        Client          = require('../../../models/client')

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
            },
            personalized : {$ne: true}
        }).sort({date: 'asc'}).populate('walk')
        // console.log(bookings)
        //_id is good
        // res.send('Index Render')
        res.render("frontEnd/bookings/index", {bookings, endDate: new Date(endDate)})
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    
})

//booking show (CLIENT)
router.get("/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
        // console.log(booking)

        res.render("frontEnd/bookings/show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/booking")
    }
})

//walks bookingcode view
router.get("/:_id/new",async (req,res)=>{
    booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
    res.render("frontEnd/bookings/new",{booking,})
})

//book post
router.post("/:_id", async(req,res)=>{
    console.log('getting here')
    try {
        req.body.client.confirmation = true
        const client = await Client.create(req.body.client)
        const booking = await Booking.findById(req.params._id)
        booking.clients.push(client._id)
        booking.bookedSpots++
        if(booking.bookedSpots === booking.spots){
            booking.closed = true
        }
        booking.save()
        client.booking.push(booking)
        if(booking.pickup === true || booking.personalized === true){
            const meetingPoint = await MeetingPoint.create(req.body.meetingPoint)
            meetingPoint.usedInBooking.push(booking._id)
            meetingPoint.save()
            client.meetingPoint.push(meetingPoint._id)
        }
        client.save()
        console.log(booking)
        res.redirect(`/booking/${req.params._id}`)
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

module.exports = router
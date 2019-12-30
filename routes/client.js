const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Booking         = require('../models/booking'),
        Client          = require('../models/client'),
        MeetingPoint    = require('../models/meetingPoint')

//=======================
//Booking VIths
//=======================

//walks bookingcode view
router.get("/new",async (req,res)=>{
    booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
    res.render("client/new",{booking,})
})

//book post
router.post("/", async(req,res)=>{
    try {
        req.body.client.confirmation = true
        const client = await Client.create(req.body.client)
        const booking = await Booking.findById(req.params._id)
        booking.clients.push(client)
        booking.bookedSpots++
        if(booking.bookedSpots === booking.spots){
            booking.closed = true
        }
        booking.save()
        client.booking.push(booking)
        if(booking.pickup === true){
            const meetingPoint = await MeetingPoint.create(req.body.meetingPoint)
            meetingPoint.usedInBooking.push(booking)
            meetingPoint.save()
            client.meetingPoint.push(meetingPoint)
        }
        client.save()
        // console.log(booking)
        res.redirect(`/booking/${req.params._id}`)
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

//ROUTE FOR CONFIRMATION FUTURE FEATURE EMAIL SENDS TO THIS PATH

module.exports = router
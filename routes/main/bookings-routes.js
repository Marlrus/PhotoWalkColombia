const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        passport        = require('passport')
        Models          = require('../../models')
        Walk            = Models.Walk,
        Booking         = Models.Booking,
        MeetingPoint    = Models.MeetingPoint,
        Client          = Models.Client

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
        }).sort({date: 'asc'})
        // console.log(bookings)
        //_id is good
        // res.send('Index Render')
        res.render("main/bookings/index", {bookings, endDate: new Date(endDate)})
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    
})

//GO TO CONSENT SCREEN
router.get('/google',passport.authenticate('google',{
    scope: ['profile','email']
}))

//GOOGLE REDIRECT
router.get('/google/redirect', passport.authenticate('google'),(req,res)=>{
    // res.send(req.user)
    // req.flash('success', `Bienvenido devuelta ${req.user.primer_nombre}!`)
    res.redirect('back')
})

//BOOKING CART
router.get('/cart',(req,res)=>{
    res.render('main/bookings/cart')
})

//booking show (CLIENT)
router.get("/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id)
        // console.log(booking)
        res.render("main/bookings/show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/booking")
    }
})

//walks bookingcode view (REMOVED)
// router.get("/:_id/new",async (req,res)=>{
//     booking = await Booking.findById(req.params._id)
//     res.render("main/bookings/new",{booking,})
// })

//book post
router.post("/:_id", async(req,res)=>{
    console.log('getting here')
    try {
        req.body.client.confirmation = true
        const client = await Client.create(req.body.client)
        const booking = await Booking.findById(req.params._id)
        booking.clients.push(client._id)
        booking.booked_spots++
        if(booking.booked_spots === booking.spots){
            booking.closed = true
        }
        booking.save()
        client.booking.push(booking)
        if(booking.pickup === true || booking.personalized === true){
            const meetingPoint = await MeetingPoint.create(req.body.meetingPoint)
            meetingPoint.bookings.push(booking._id)
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
const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Models          = require('../../../models')
        Walk            = Models.Walk,
        Booking         = Models.Booking,
        MeetingPoint    = Models.MeetingPoint,
        Client          = Models.Client

//============================
//Booking routes
//============================

//NEW Booking
router.get('/new',async(req,res)=>{
    const [walks,meetingPoints] = await Promise.all ([
        Walk.find({latest_version:true}).sort({date_created: 'desc'}),
        MeetingPoint.find({latest_version:true, name:{$ne: 'Pickup'}}).sort({date_created: 'desc'})
    ])
    // console.log(walks)
    // console.log(meetingPoints)
    res.render('backoffice/admin/booking/new',{walks,meetingPoints,})
})

//NEW PERSONALIZED
router.get('/new/personalized',async(req,res)=>{
    res.render('backoffice/admin/booking/personalizedNew')
})

//POST PERSONALIZED
router.post('/personalized',async(req,res)=>{
    req.body.booking.personalized = true
    req.body.booking.date=`${req.body.booking.date} ${req.body.booking.end_time}`
    const [booking,walk,meetingPoint] = await Promise.all([
        Booking.create(req.body.booking),
        Walk.create(req.body.walk),
        MeetingPoint.create(req.body.meetingPoint)
    ])
    await Promise.all ([
        booking.walk.push(walk._id),
        booking.meetingPoint.push(meetingPoint._id),
        walk.bookings.push(booking._id),
        meetingPoint.bookings.push(booking._id)
    ])
    await Promise.all ([
        booking.save(),
        walk.save(),
        meetingPoint.save()
    ])
    // console.log(booking)
    // console.log(walk)
    // console.log(meetingPoint)
    res.redirect(`/booking/${booking._id}`)
})

//NEW SEASONAL
router.get('/new/seasonal',async(req,res)=>{
    res.send('Seasonal Form')
})

//SHOW NEW
router.get('/:_id',async(req,res)=>{
    try {
        //FUCKING MADE ITTT!!!!
        const booking = await Booking.findById(req.params._id)
        console.log(booking)
        if (!booking){
            res.status(404).send(`Path not found`)
        } else {
            res.render('backoffice/admin/booking/show', {booking,})
        }
    } catch (err) {
        console.log(err)
        res.send(`ERROR: ${err}`)
    }
})
// //SHOW OLD ROUTE
// router.get('/:_id',async(req,res)=>{
//     try {
//         //FUCKING MADE ITTT!!!!
//         const booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint').populate({
//             path: 'clients',
//             populate: [{
//                 path: 'meetingPoint',
//                 model: 'MeetingPoint'
//             }]
//         })
//         if (!booking){
//             res.status(404).send(`Path not found`)
//         } else {
//         res.render('backoffice/admin/booking/show', {booking,})
//         }
//     } catch (err) {
//         console.log(err)
//         res.send(`ERROR: ${err}`)
//     }
// })

//POST Booking
router.post('/',async(req,res)=>{
    try {
        // TEMP APPROVAL ADDED
        req.body.booking.approved = true
        // Set up for date to be created using end_time hour. For Cron to close properly
        req.body.booking.date=`${req.body.booking.date} ${req.body.booking.end_time}`
        let meetingPoint = {}
        let walk = {}
        if (req.body.booking.pickup === 'true'){
            req.body.booking.pickup = true
            [meetingPoint,walk] = await Promise.all([
                MeetingPoint.findOne({name: 'Pickup', latest_version: true}),
                Walk.findById(req.body.walk_id)
            ])
        } else {
            // req.body.booking.pickup = false
            [meetingPoint,walk] = await Promise.all([
                MeetingPoint.findById(req.body.meetingPoint_id),
                Walk.findById(req.body.walk_id)
            ]) 
        }
        // console.log(meetingPoint)
        // console.log(walk)
        //Make the bojects aprt of req.body.booking to save a push
        req.body.booking.meetingPoint = meetingPoint
        req.body.booking.walk = walk
        req.body.booking.name = walk.name
        req.body.booking.image = walk.image
        req.body.booking.description = walk.description
        req.body.booking.short_description = walk.short_description
        const booking = await Booking.create(req.body.booking)
        console.log('===== After booking creation =====')
        //Create booking object for walk
        const bookingObj = {
            _id: booking._id,
            date: booking.date,
            price: booking.price,
            spots: booking.spots,
            booked_spots: booking.booked_spots,
            name: booking.name
        }
        console.log('===== Before Push Promise =====')
        //Push everything in
        await Promise.all([
            walk.bookings.push(bookingObj),
            meetingPoint.bookings.push(bookingObj),
        ])
        await Promise.all([
            walk.save(),
            meetingPoint.save(),
        ])
        console.log('===== Booking Created =====')
        console.log(booking)
        console.log('===== Walk Updated =====')
        console.log(walk)
        console.log('===== MeetingPoint Updated =====')
        console.log(meetingPoint)
        res.redirect(`/booking/${booking._id}`)
    } catch (err) {
        console.log(err)
        res.send('ERROR')
    }
})



module.exports = router
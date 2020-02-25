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
        Walk.find({currentVersion:true}).sort({dateCreated: 'desc'}),
        MeetingPoint.find({currentVersion:true, name:{$ne: 'Pickup'}}).sort({dateCreated: 'desc'})
    ])
    // console.log(walks)
    // console.log(meetingPoints)
    res.render('backEnd/admin/booking/new',{walks,meetingPoints,})
})

//NEW PERSONALIZED
router.get('/new/personalized',async(req,res)=>{
    res.render('backEnd/admin/booking/personalizedNew')
})

//POST PERSONALIZED
router.post('/personalized',async(req,res)=>{
    req.body.booking.personalized = true
    req.body.booking.date=`${req.body.booking.date} ${req.body.booking.endTime}`
    const [booking,walk,meetingPoint] = await Promise.all([
        Booking.create(req.body.booking),
        Walk.create(req.body.walk),
        MeetingPoint.create(req.body.meetingPoint)
    ])
    await Promise.all ([
        booking.walk.push(walk._id),
        booking.meetingPoint.push(meetingPoint._id),
        walk.usedInBooking.push(booking._id),
        meetingPoint.usedInBooking.push(booking._id)
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

//SHOW
router.get('/:_id',async(req,res)=>{
    try {
        //FUCKING MADE ITTT!!!!
        const booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint').populate({
            path: 'clients',
            populate: [{
                path: 'meetingPoint',
                model: 'MeetingPoint'
            }]
        })
        if (!booking){
            res.status(404).send(`Path not found`)
        } else {
        res.render('backEnd/admin/booking/show', {booking,})
        }
    } catch (err) {
        console.log(err)
        res.send(`ERROR: ${err}`)
    }
})

//POST Booking
router.post('/',async(req,res)=>{
    try {
        // TEMP APPROVAL ADDED
        req.body.booking.approved = true
        // Set up for date to be created using endTime hour. For Cron to close properly
        req.body.booking.date=`${req.body.booking.date} ${req.body.booking.endTime}`
        let meetingPoint = {}
        if (req.body.booking.pickup === 'true'){
            req.body.booking.pickup = true
            meetingPoint = await MeetingPoint.findOne({name: 'Pickup', currentVersion: true})
            req.body.booking.meetingPoint = meetingPoint
        } else {
            // req.body.booking.pickup = false
            meetingPoint = await MeetingPoint.findById(req.body.booking.meetingPoint)
            req.body.booking.meetingPoint = meetingPoint
        }
        // console.log(req.body.booking.meetingPoint)
        console.log(meetingPoint)
        const [booking,walk] = await Promise.all ([
            Booking.create(req.body.booking),
            Walk.findById(req.body.booking.walk)
            // MeetingPoint.findById(req.body.booking.meetingPoint)
        ])
        await Promise.all([
            walk.usedInBooking.push(booking._id),
            meetingPoint.usedInBooking.push(booking._id)
        ])
        await Promise.all([
            walk.save(),
            meetingPoint.save()
        ])
        res.redirect(`/booking/${booking._id}`)
    } catch (err) {
        console.log(err)
        res.send('ERROR')
    }
})



module.exports = router
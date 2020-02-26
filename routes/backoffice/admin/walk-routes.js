const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Models          = require('../../../models')
        Walk            = Models.Walk,
        Booking         = Models.Booking,
        MeetingPoint    = Models.MeetingPoint,
        Client          = Models.Client

//WALK Routes
//NEW WALK
router.get("/new",async(req,res)=>{
    try {
        res.render("backoffice/admin/walk/new")
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
        const bookings = await Booking.find({_id: walk.bookings}).sort({date: 'asc'})
        const edits = await Walk.find({latest_version : false})
        // console.log('==============REFRESH===========')
        // console.log(edits)
        res.render('backoffice/admin/walk/show',{walk, bookings, edits,})
    }
})

//WALK POST
router.post("/",async(req,res)=>{
    try {
        console.log(req.body)
        req.body.walk.latest_version = true
        req.body.walk.short_description = req.sanitize(req.body.walk.short_description)
        req.body.walk.description = req.sanitize(req.body.walk.description)
        console.log(req.body.walk)
        const walk = await Walk.create(req.body.walk)
        console.log(walk)
        res.redirect('/admin')
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
})

module.exports = router
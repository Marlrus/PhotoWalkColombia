const   express             = require("express"),
        app                 = express(),
        bodyParser          = require("body-parser"),
        methodOverride      = require("method-override"),
        mongoose            = require("mongoose"),
        expSanitizer        = require("express-sanitizer"),
        flash               = require("connect-flash"),
        CronJob             = require('cron').CronJob


//ROUTE REQUIRING
const   frontEndRoutes      = require('./routes/frontEnd'),
        backEndRoutes       = require('./routes/backEnd'),
        bookingRoutes       = require('./routes/booking'),
        // clientRoutes        = require('./routes/client'),
        walkRoutes          = require('./routes/walk'),
        meetingPointRoutes  = require('./routes/meetingPoint')
                


const   Walk            = require("./models/walk"),
        Booking         = require('./models/booking'),
        MeetingPoint    = require('./models/meetingPoint')
        
app.use(bodyParser.urlencoded({extended:true}))    

require("dotenv").config()
app.set("view engine","ejs")
app.use(express.static(`${__dirname}/public`))
app.use(methodOverride("_method"))
app.use(expSanitizer())
app.use(flash())

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() =>{
    console.log(`Mongoose Connected to: ${mongoose.connection.name}`)
}).catch(err =>{
    console.log(`ERROR: ${err.message}`)
})
//Get Walk names

//Locals
app.use(async (req,res,next)=>{
    //finds visible walks and only gets name ;D
    let date = new Date()
    let endDate = new Date().setMonth(date.getMonth()+1)
    const bookingDropdown = await Booking.find({
        personalized: {$ne: true},
        date: {
            $gte: date,
            $lte: endDate
        }
    }).sort({date: 'asc'}).populate('walk')
    // Being Called Twice
    // console.log(bookingDropdown)
    res.locals.bookingDropdown = bookingDropdown
    // res.locals.error = req.flash('error')
    // res.locals.error = req.flash('success')
    next()
})

//RUN EVERY 1minutes (Future = run at midnight)
new CronJob('0 */1 * * * *', async ()=> {
    //Find OPEN Bookings, check if they should be closed, close them
    console.log(`=====Running every minute======== ${new Date(Date.now())}`)
    const bookings = await Booking.find({closed : {$ne:true}})
    let today = new Date()
    bookings.forEach(booking=>{
        if (today>booking.date){
            booking.closed = true
            console.log('Closing Booking')
            booking.save()
        }else{
            console.log('Still open')
        }
    })
}, null, true, 'America/Bogota');

app.use("/", frontEndRoutes)
app.use("/user", backEndRoutes)
// app.use("/booking/:_id/client", clientRoutes)
app.use("/user/booking", bookingRoutes)
app.use("/user/walk", walkRoutes)
app.use("/user/meetingPoint", meetingPointRoutes)

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))
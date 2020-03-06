const   express             = require("express"),
        app                 = express(),
        bodyParser          = require("body-parser"),
        methodOverride      = require("method-override"),
        mongoose            = require("mongoose"),
        expSanitizer        = require("express-sanitizer"),
        flash               = require("connect-flash"),
        CronJob             = require('cron').CronJob,
        passport            = require('passport'),
        cookieSession       = require('cookie-session')
        
//Body Parser
app.use(bodyParser.urlencoded({extended:true}))    
//Locals
let bookingDropdown = []
app.use(async (req,res,next)=>{
    //Now sent through CRON
    res.locals.bookingDropdown = bookingDropdown
    // res.locals.error = req.flash('error')
    // res.locals.error = req.flash('success')
    next()
})

//DOTENV REQUIRE
require("dotenv").config()

//PASSPORT CONFIG REQUIRE
require('./config/google-passport-setup')

//COOKIE SESSION CONFIG
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY]
}))

//EJS VIEW ENGINE
app.set("view engine","ejs")
//STATIC DIRECTORY
app.use(express.static(`${__dirname}/public`))
//METHOD OVERRIDE
app.use(methodOverride("_method"))
//SANITIZER
app.use(expSanitizer())
//CONNECT FLASH
app.use(flash())

//PASSPORT INITIALIZE
app.use(passport.initialize())
app.use(passport.session())

//ROUTE REQUIRING
const   frontEndRoutes      = require('./routes/main/frontEnd-index'),
        backEndRoutes       = require('./routes/backoffice/backoffice-index')
//ROUTE USE
app.use("/", frontEndRoutes)
app.use("/", backEndRoutes)
                
//MODEL REQUIRING
const   Walk            = require("./models/walk"),
        Booking         = require('./models/booking'),
        MeetingPoint    = require('./models/meetingPoint')

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() =>{
    console.log(`Mongoose Connected to: ${mongoose.connection.name}`)
}).catch(err =>{
    console.log(`ERROR: ${err.message}`)
})

//RUN EVERY 1minutes (Future = run at midnight)
new CronJob('*/30 * * * * *', async ()=> {
    //Find OPEN Bookings, check if they should be closed, close them
    console.log(`=====Running every 30s======== ${new Date(Date.now())}`)
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
    //finds visible walks and only gets name ;D SENDS TO RES.Locals
    let endDate = new Date().setMonth(today.getMonth()+1)
    bookingDropdown = await Booking.find({
        personalized: {$ne: true},
        date: {
            $gte: today,
            $lte: endDate
        }
    }).sort({date: 'asc'}).populate('walk')
    // Being Called Twice
    console.log('Sent bookings to dropdown')
}, null, true, 'America/Bogota');

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))
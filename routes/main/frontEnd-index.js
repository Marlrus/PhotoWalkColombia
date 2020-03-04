const   express         = require('express'),
        router          = express.Router({mergeParams: true}),
        Models          = require('../../models'),
        Lead            = Models.Lead,
        nodemailer      = require('nodemailer')
        //ROUTES
        bookingsRoutes  = require('./bookings-routes')

//ROUTE REQUIRING
router.use("/booking", bookingsRoutes)

//===================================
//Index Routes
//===================================

router.get("/",(req,res)=>{
    res.render("main/index")
})

//Mail send POST
router.post('/lead',async(req,res)=>{
    const transporter = nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        }
    })
    req.body.lead.origin = 'Webpage Home Form'
    const lead = await Lead.create(req.body.lead)
    const today = new Date(Date.now())
    try {
        console.log(lead)
        console.log('Creating Mail Options')
        //Use photowalkscol@gmail.com for final implementation
        let mailOptions = { 
            from: 'leads@photowalkscol.com', 
            to: 'julian.franco.f@gmail.com',
            subject: `${lead.email}: ${lead.subject}`,
            text: `Lead email: ${lead.email}

Message sent on: ${today.toLocaleDateString('es-ES',{dateStyle: 'full', timeStyle: 'full'})}

${lead.message}`
        }
        console.log(mailOptions)
        // Sending Mail
        // console.log(`Sending Mail! (Currently Disabled)`)
        console.log('Sending Mail!')
        await transporter.sendMail(mailOptions, (err)=>{
            console.log('SENDING EMAIL')
        })
        // req.flash('success',`Email successfuly sent to ${lead.email}`)
        res.redirect('back')
    } catch (err) {
        console.log(`ERROR FOUND: ${err}`)
        // req.flash('error',`Email could not be sent, please try again.`)
        res.redirect('back')
    }
})

router.get("/about",(req,res)=>{
    res.render("main/about")
})

router.get("/faq",(req,res)=>{
    res.render("main/faq")
})
router.get("/contact",(req,res)=>{
    res.render("main/contact")
})


module.exports = router
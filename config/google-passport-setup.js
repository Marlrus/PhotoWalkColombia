const   passport        = require('passport'),
        GoogleStrategy  = require('passport-google-oauth20'),
        Client          = require('../models/client')

//DOT ENV
require('dotenv').config()

//Serialize Stuff into cookie
passport.serializeUser((client, done)=>{
    done(null,client._id);
})

//Desirialize Find user based on cookie
passport.deserializeUser(async (_id, done)=>{
    const foundClient = await Client.findById(_id)
    done(null,foundClient)
})

//GOOGLE STRATEGY
passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL:'/booking/google/redirect',
        clientID: process.env.GOOGLE_CLI_ID,
        clientSecret: process.env.GOOGLE_CLI_SECRET
    },async (accessToken,refreshToken,profile,done)=>{
        console.log(`
    ==============================
    IN THE GoogleStrategy
    ==============================
    `)
        // console.log(profile)
        //Check if User exists
        const existingClient = await Client.findOne({email: profile._json.email})
        //Handle User existance
        if (existingClient){
            // console.log(profile)
            console.log(`Client Exists: ${existingClient.primer_nombre}`)
            done(null,existingClient)
        } else {
            console.log('No Client Found')
            console.log(profile)
            let today = new Date(Date.now())
            //Save to mongoDB REFACTORED
            const newClient = await Client.create({
                name: profile.name.givenName,
                family_name: profile.name.familyName,
                locale: profile._json.locale,
                auth:{
                    google: true,
                    external_id: profile.id,
                    verified_email: true,
                },
                profile_image: profile._json.picture,
                email: profile._json.email,
                date_created: {
                    month: today.getMonth(),
                    year: today.getFullYear()
                }
            })
            console.log(`New client created: ${newClient}`)
            done(null,newClient)
        }
    })
)
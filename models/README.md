# Booking Model Relationships V0 (Dec 28 2019)

The main model is the booking, it has ties to every other model. It has ties to it's respective walk (left as an array in case that there are multiple walks in one booking in the future). It has ties to it's meeting point(s) for the same reason as above. It has ties to the clients that are involved in that booking. There is a fringe case in which the booking is a pickup style booking, where each client adds his own booking. 

# Fringe Case handler (pickup)

The way I handled this was by adding a field for meetingPoint inside the client model, which would get pushed in to the model if the template for a pickup booking was filled by the client. It was done this way to have the client info all together without having to call the meeting point by author. This way we can have a client info display that has all the info independetly, the booking and the meeting point if it exists.

# FUTURE Auth after MVP 

Once the MVP is through, Auth will be added, which will alter the model to include an author field and users must be created (Locally first) to make the booking and filter content created by the client and content created by the user. A new User model must be created, with an array of bookings.
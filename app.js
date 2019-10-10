let express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
seedDB();




// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "This is a huge granite hill; no bathrooms; no water; Beautiful granite!"
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     });

// let campgrounds = [
//     {name: "Salmon Crek", image: "https://specials-images.forbesimg.com/imageserve/960743598/960x0.jpg?fit=scale"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
//     {name: "Mountain Goat's Rest", image: "https://www.floridastateparks.org/sites/default/files/styles/single/public/media/image/FSP_Wekiva-5693_STEdg3mimRVebehjzluF8ls18q0ABlZBh_0.jpg?itok=doP4jJMZ"}
// ];

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description: desc};
    // campgrounds.push(newCampground);

    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//================================
// COMMENTS ROUTES
//=================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) =>{
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res) =>{
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) =>{
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) =>{
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
    // create new comment

    // connect new comment to campground
    // redirect to campground showpage
})

app.listen(3000, function(req, res) {
    console.log("YelpCamp running!");
});
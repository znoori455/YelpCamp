let express = require("express");
let app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    let campgrounds = [
        {name: "Salmon Crek", image: "https://specials-images.forbesimg.com/imageserve/960743598/960x0.jpg?fit=scale"},
        {name: "Granite Hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
        {name: "Mountain Goat's Rest", image: "https://www.floridastateparks.org/sites/default/files/styles/single/public/media/image/FSP_Wekiva-5693_STEdg3mimRVebehjzluF8ls18q0ABlZBh_0.jpg?itok=doP4jJMZ"}
    ];
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(3000, function(req, res) {
    console.log("YelpCamp running!");
});
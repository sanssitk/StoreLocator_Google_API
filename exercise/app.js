const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const Store = require("./api/models/store")

const port = process.env.port || 3000;
const dbKey = process.env.DB_KEY

// Database connection
mongoose.connect(`mongodb+srv://sanjay_stha:${dbKey}@store-locator.jgru5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// End Points
app.use(express.json({
    limit: "5mb"
}));

app.post("/api/stores", (req, res) => {
    let dbStores = req.body;

    //Saving data to MondoDb atlas
    // var store = new Store({
    //     storeName: "Test",
    //     phoneNumber: "4568946613",
    //     location: {
    //         type: "Point",
    //         coordinates: [-118.376354, 34.063584],
    //     }
    // })
    // store.save();
    res.status(200).send(dbStores);
});

app.delete("/api/stores", (req, res) => {
    res.send("You deleted")
})

app.get("/", (req, res) => {
    res.send("Hello google")
});

app.listen(port, () => {
    console.log(`Listening on Localhost:${port}`)
})
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const axios = require("axios")
require("dotenv").config();
const Store = require("./api/models/store")
const GoogleMapServices = require("./api/services/googleMapsService");
const googleMapServices = new GoogleMapServices;

const port = process.env.port || 3000;
const dbKey = process.env.DB_KEY

// Database connection
mongoose.connect(`mongodb+srv://sanjay_stha:${dbKey}@store-locator.jgru5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// middleware to convert json to javascript objects
// End Points
app.use(express.json({
    limit: "5mb"
}));

// Middleware to allow access-control
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.post("/api/stores", (req, res) => {
    let dbStores = [];
    let stores = req.body;
    //Saving data to MondoDb atlas
    stores.map((store) => {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: "Point",
                coordinates: [store.coordinates.longitude, store.coordinates.latitude],
            }
        })
    })
    Store.create(dbStores, (err, stores) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(stores)
    });
});

app.get("/api/stores", (req, res) => {
    const zipCode = req.query.zip_code;
    googleMapServices.getCoordinates(zipCode)
        .then((coordinates) => {
            Store.find({
                location: {
                    $near: {
                        $maxDistance: 3000,
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates,
                        }
                    }
                }
            }, (err, stores) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.status(200).send(stores)
                }
            })
        }).catch((err) => {
            console.log(err)
        })
});

app.delete("/api/stores", (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err)
    })
})

app.listen(port, () => {
    console.log(`Listening on Localhost:${port}`)
})
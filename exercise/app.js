const express = require("express");
const app = express();

const port = process.env.port || 3000;


app.use(express.json({limit: "5mb"}));

app.post("/api/stores", (req, res) => {
    let dbStores = req.body;
    res.status(200).send(dbStores);
});

app.get("/", (req, res) => {
    res.send("Hello google")
});

app.listen(port, () => {
    console.log(`Listening on Localhost:${port}`)
})
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

const options = {
    root: path.join(__dirname, "public")
};

//tillhandahåll statiska resurser (javascript, css, bilder etc.)
app.use(express.static("public/static"));

//tillhandahåll index.html
app.get(/^\/(?!static).*/, (req, res) => {
    res.sendFile("index.html", options);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
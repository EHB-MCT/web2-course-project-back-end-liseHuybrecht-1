//RUN SERVER, VERY IMPORTANT
app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

const express = require("express");
const fs = require("fs/promises");
const app = express();
const port = 3000;

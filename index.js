//RUN SERVER, VERY IMPORTANT
const { log } = require("console");
const express = require("express");
const fs = require("fs/promises");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require("mongodb");
const { all } = require("axios");
const uri =
	"mongodb+srv://lihuybrecht_db_user:<db_password>@cluster0.rnhnurl.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		//const allUsers = x;
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);

app.use(express.static("publicFolder"));
app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`app listening on port http://localhost:${port}`);
});

app.get("/", async (req, res) => {
	try {
		res.redirect("/info.html");
		//console.log("hello");
		//res.send("hello");

		const buffer = await fs.readFile("", { encode: "utf8" });
	} catch (error) {
		res.status(500).send("Server error, try again later");
	}
});

app.get("/acounts", async (req, res) => {
	const buffer = await fs.readFile("acounts.json");
	const data = JSON.parse(buffer);

	res.send(data[req.query.id]);
});

app.get("/allAcounts", async (req, res) => {
	const buffer = await fs.readFile("acounts.json");
	const data = JSON.parse(buffer);

	res.send(data);
});

app.post("/addUser", async (req, res) => {
	if (
		!req.body.id ||
		!req.body.userNumber ||
		!req.body.firstName ||
		!req.body.lastName ||
		!req.body.email ||
		!req.body.password
	) {
		res.status(400).send("missing info");
	}

	const buffer = await fs.readFile("acounts.json");
	const data = JSON.parse(buffer);

	data[req.body.id] = {
		id: req.body.id,
		userNumber: req.body.userNumber,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
	};
	console.log(data);

	await fs.writeFile("acounts.json", JSON.stringify(data));

	res.status(201).send("upload succesful");
});
app.delete("/deleteUser", async (req, res) => {});
//app.put;

//RUN SERVER, VERY IMPORTANT
const { log, error } = require("console");
const express = require("express");
const fs = require("fs/promises");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 10000;
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require("mongodb");
const { all } = require("axios");

const password = process.env.MONGODB_PASSWORD;

const URI = process.env.MONGODB_URI;

const uri = `mongodb+srv://lihuybrecht_db_user:${password}@cluster0.rnhnurl.mongodb.net/?appName=Cluster0`;

//console.log(process.env.MONGODB_URI);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

app.use(express.static("publicFolder"));
async function run() {
	try {
		//const allUsers = x;
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!",
		);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);

app.use(bodyParser.json());

/*app.get("/", (req, res) => {
	res.send("Backend is running!");
});*/

app.listen(port, () => {
	console.log(`app listening on port https://easy-animals.onrender.com`);
	console.log(port);
	console.log(`GET /acounts - Get all acounts`);
	//console.log(` MONGO_URI: ${process.env.MONGODB_URI}`);
	//console.log(process.env.YOUR_VARIABLE_NAME);
});

app.get("/", async (req, res) => {
	try {
		res.redirect("info.html");

		const buffer = await fs.readFile("", { encode: "utf8" });
	} catch (error) {
		res.status(500).send("Server error, try again later");
	}
});

app.get("/acount", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");

		const accounts = await collection.findOne({}).toArray();

		res.status(200).send(accounts);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get account", value: error });
	}
});

app.get("/allAcounts", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");
		const accounts = await collection.find({}).toArray();

		res.status(200).send(accounts);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get all accounts", value: error });
	}
});

app.use(express.json());
app.post("/addUser", async (req, res) => {
	try {
		const bcrypt = require("bcrypt");
		const { firstName, lastName, email, password } = req.body;
		console.log(req.body);

		if (!firstName || !lastName || !email || !password) {
			//return res.status(400);
			//.json({ error: "firstname, lastname, email and password required" });
			return res.status(400).send("missing info");
		}

		const collection = client.db("allAcounts").collection("acounts");

		const existingUsers = await collection.findOne({ email });

		console.log("hello1");

		if (existingUsers) {
			return res.status(409).json({ error: "Email already exists" });
		}

		//import bcrypt from "bcrypt";
		console.log("hello2");

		const hashedPassword = await bcrypt.hash(password, 10);

		await collection.insertOne({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		});
		console.log("hello3");

		return res.status(201).send("upload succesful");
		//res.status(201).json(userWithoutPassword);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
});

app.put("/updateAccount", async (req, res) => {
	try {
		const bcrypt = require("bcrypt");
		const { firstName, lastName, email, password } = req.body;
		console.log(req.body);

		const collection = client.db("allAcounts").collection("acounts");

		if (existingUsers) {
			return res.status(409).json({ error: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await collection.insertOne({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		});

		return res.status(201).send("upload succesful");
		//res.status(201).json(userWithoutPassword);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
});

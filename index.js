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

app.use(express.static("publicFolder"));
app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`app listening on port https://easy-animals.onrender.com`);
	console.log(port);
	console.log(`GET /acounts - Get all acounts`);
	//console.log(` MONGO_URI: ${process.env.MONGODB_URI}`);
	//console.log(process.env.YOUR_VARIABLE_NAME);
});

app.get("/acounts", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");
		const accounts = await collection.find(firstName).toArray();

		res.status(200).send(accounts);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get all accounts", value: error });
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

		if (existingUsers) {
			return res.status(409).json({ error: "Email already exists" });
		}

		//import bcrypt from "bcrypt";

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
		console.log("Error, unable to create new user");
		res.status(500).json({ error });
	}
});

app.put("/updateAccount", async (req, res) => {
	try {
		const { id, firstName, lastName, email, password } = req.body;

		const users = await readUsers();

		if (users.some((u) => u.email === email)) {
			return res.status(409).json({ error: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = {
			id: Date.now().toString,
			firstName,
			lastName,
			email,
			password: hashedPassword,
		};

		users.push(newUser);
		await writeUsers(users);

		const { password: _, ...userWithoutPassword } = newUser;
		res.status(201).send("upload succesful");
		//res.status(201).json(userWithoutPassword);
	} catch (error) {
		console.log("Error, unable to create new user");
		//res.status(500).json({ error: "failed to create new user" });
		res.status(500).send({ error: "Failed to upload new user", value: error });
	}
});

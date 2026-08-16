//RUN SERVER, VERY IMPORTANT
const { log, error } = require("console");
const express = require("express");
const fs = require("fs/promises");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 10000;
const bodyParser = require("body-parser");

const cors = require("cors");

app.use(
	cors({
		origin: "https://ehb-mct.github.io", ///web2-course-project-front-end-liseHuybrecht-1
		credentials: true,
	}),
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

//app.use(express.static("publicFolder"));
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
	} catch (error) {
		//finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
		//}
		console.error(error);
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
	//try {
	res.redirect("info.html");

	//const buffer = await fs.readFile("", { encode: "utf8" });
	//} catch (error) {
	//res.status(500).send("Server error, try again later");
	//}
});

app.get("/account", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");

		const account = await collection.findOne({ email: req.query.email });

		if (!account) {
			return res.status(404).send({ error: "Account not found" });
		}

		res.status(200).send(account);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get account", value: error });
	}
});

app.get("/allAccounts", async (req, res) => {
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
		const { /*firstName, lastName,*/ email, password } = req.body;
		console.log(req.body);

		if (/*!firstName || !lastName || */ !email || !password) {
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
		/*if (!existingUsers) {
			return res.status(401).json({ error: "Incorrect email or password" });
		}*/

		//import bcrypt from "bcrypt";
		console.log("hello2");

		const hashedPassword = await bcrypt.hash(password, 10);

		await collection.insertOne({
			//firstName,
			//lastName,
			email,
			password: hashedPassword,
			complete1: "no",
			complete2: "no",
			complete3: "no",
			complete4: "no",
			complete5: "no",
			complete6: "no",
			complete7: "no",
			complete8: "no",
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

app.post("/login", async (req, res) => {
	try {
		const bcrypt = require("bcrypt");

		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: "Email and password are required",
			});
		}

		const collection = client.db("allAcounts").collection("acounts");

		const account = await collection.findOne({ email });

		if (!account) {
			return res.status(401).json({
				error: "Incorrect email or password",
			});
		}

		const passwordCorrect = await bcrypt.compare(password, account.password);

		if (!passwordCorrect) {
			return res.status(401).json({
				error: "Incorrect email or password",
			});
		}

		res.status(200).json({
			message: "Login successful",
			email: account.email,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			error: "Could not log in",
		});
	}
});

/*app.put("/updateAccount", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");

		const account = await collection.findOne({ email: req.query.email });

		if (!account) {
			return res.status(404).send({ error: "Account not found" });
		}

		const bcrypt = require("bcrypt");
		const { firstName, lastName, email, password } = req.body;
		console.log(req.body);

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
		//res.status(500).send({ error: "Could not update account", value: error });
	}
});*/

app.use(express.json());

app.patch("/updateAccountFirstName", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");

		const account = await collection.findOne({ email: req.query.email });

		if (!account) {
			return res.status(404).send({ error: "Account not found" });
		}

		//console.log(req.body);

		const result = await collection.updateOne(
			{ email: req.query.email },
			{ $set: req.body },
		);
		//console.log(req.query.firstName);

		res.json(result);
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
});

app.patch("/updateDone", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAcounts").collection("acounts");
		//const collection2 = client.db("allAnimals").collection("animals");

		const email = req.query.email;
		const animalId = Number(req.query.animalId);
		const newValue = req.query.complete;

		if (!Number.isInteger(animalId)) {
			return res.status(400).json({ error: "Invalid animal ID" });
		}

		if (newValue !== "yes" && newValue !== "no") {
			return res.status(400).json({
				error: "complete must be either 'yes' or 'no'",
			});
		}

		//const animalId = Number(req.query.animalId);
		const completeField = `complete${animalId}`;

		const result = await collection.updateOne(
			{ email: email },
			{
				$set: {
					[completeField]: newValue,
				},
			},
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({
				error: "Account not found",
			});
		}

		res.json({
			message: `${completeField} updated`,
			animalId: animalId,
			[completeField]: newValue,
		});

		//const animal = await animal.findOne({ id: animalId });

		/*if (!animal) {
			return res.status(404).json({ error: "Animal not found" });
		}*/

		/*const result = await collection.updateOne({ email: email });

		if (result.matchedCount === 0) {
			return res.status(404).json({
				error: "Account not found",
			});
		}

		res.json({
			message: "complete1 updated",
			complete1: newValue,
		});*/

		// Create the field name, e.g. "complete7"
		//const completeField = `complete${animal.id}`;

		// Update the account
		/**const result = await accounts.updateOne(
			{ email: email },
			{
				$set: {
					[completeField]: newValue,
				},
			},
		);*/

		if (result.matchedCount === 0) {
			return res.status(404).json({
				error: "Account not found",
			});
		}

		/*res.json({
			message: `${completeField} updated`,
			animalId: animal.id,
			[completeField]: newValue,
		});*/
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
});

app.delete("/deleteAccount", async (req, res) => {
	/*try {
		await client.connect();

		const { firstName, lastName, email, password } = req.body;

		const collection = client.db("allAcounts").collection("acounts");

		const account = await collection.findOne({ id: req.query.id });

		if (!account) {
			return res.status(404).send({ error: "Account not found" });
		}

		res.status(200).send(account);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get account", value: error });
	}*/

	console.log("DELETE route reached", req.query._id);
	try {
		const { _id } = req.query;

		//const db = { firstName, lastName, _id, email, password };

		const collection = client.db("allAcounts").collection("acounts");

		const result = await collection.deleteOne({ _id: new ObjectId(_id) });

		if (result.deletedCount === 0)
			return res.status(404).json({
				message: "account not found",
			});

		res.status(200).json({ message: "Account deleted successfully" });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
});

app.get("/specificAnimal", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAnimals").collection("animals");

		const animal = await collection.findOne({ animal: req.query.animal });

		if (!animal) {
			return res.status(404).send({ error: "Animal not found" });
		}

		res.status(200).send(animal);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get animal", value: error });
	}
});

app.get("/allAnimals", async (req, res) => {
	try {
		await client.connect();

		const collection = client.db("allAnimals").collection("animals");
		const animals = await collection.find({}).toArray();

		res.status(200).send(animals);
	} catch (error) {
		console.log(error);

		res.status(500).send({ error: "Could not get all animals", value: error });
	}
});

app.get("/complete", async (req, res) => {
	try {
		await client.connect();

		const accounts = client.db("allAcounts").collection("acounts");
		const account = await accounts.findOne(
			{ email: req.query.email },
			{ projection: { password: 0 } },
		);

		if (!account) {
			return res.status(404).send({ error: "Account not found" });
		}

		res.send(account);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

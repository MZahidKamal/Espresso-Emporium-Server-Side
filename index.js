const express = require('express') //Default from Express.js
const app = express() //Default from Express.js
const port = process.env.PORT || 3000 //Default from Express.js but partially modified
const cors = require('cors') //From CORS Middleware
require('dotenv').config() //From dotenv package
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb'); //From MongoDB Connection String
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ktxyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; //From MongoDB Connection String


app.use(cors()) //From CORS Middleware
app.use(express.json()) //From built-in Middleware of Express.js
app.use(express.urlencoded({extended: true})) //From built-in Middleware of Express.js


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        /* CONNECT THE CLIENT TO THE MONGODB SERVER */
        await client.connect();
        const database = client.db("espressoEmporiumCoffeeDB");

        /* CREATING (IF NOT PRESENT) / CONNECTING THE COLLECTION NAMED "coffeeCollection" AND ACCESS IT */
        const coffeeCollection = database.collection("coffeeCollection");

        app.get('/coffees', async (req, res) => {
            // Execute query
            const cursor = coffeeCollection.find();
            const results = await cursor.toArray();
            res.status(200).send(results);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            // Query for a coffee that has this specific id
            const query = { _id: new ObjectId(id)};
            // Execute query and get result
            const result = await coffeeCollection.findOne(query);
            res.status(200).send(result);
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.status(201).send(result);
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const newCoffee = req.body;
            // Create a filter for coffee with this specific id
            const filter = { _id: new ObjectId(id)};
            /* Set the upsert option to insert a document if no documents match the filter */
            const options = { upsert: true };
            // Specify the update to set a value for the plot field
            const updateDoc = {
                $set: {
                    name: newCoffee.name,
                    chef: newCoffee.chef,
                    supplier: newCoffee.supplier,
                    taste: newCoffee.taste,
                    category: newCoffee.category,
                    details: newCoffee.details,
                    photo: newCoffee.photo,
                },
            };
            // Update the first document that matches the filter
            const result = await coffeeCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            /* Delete the first document in the "coffeeCollection" collection that matches the specified query document */
            const query = { _id: new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })


        /* CREATING (IF NOT PRESENT) / CONNECTING THE COLLECTION NAMED "userCollection" AND ACCESS IT */
        const userCollection = database.collection("userCollection");

        app.get('/users', async (req, res) => {
            // Execute query
            const cursor = userCollection.find();
            const results = await cursor.toArray();
            res.status(200).send(results);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.status(201).send(result);
        })





















        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Espresso Emporium Server is running!')
})


app.listen(port, () => {
    console.log(`Espresso Emporium Server app listening on port ${port}`)
})

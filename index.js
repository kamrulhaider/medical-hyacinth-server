const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhqd6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('medical-hyacinth');
        const doctorsCollection = database.collection('doctors');
        const appointmentCollection = database.collection('appointments');
        console.log('database connected')

        // GET API
        app.get('/doctors', async (req, res) => {
            const cursor = doctorsCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // POST API
        app.post('/appointment', async (req, res) => {
            const appointment = req.body;
            console.log('hit the post api', appointment);
            const result = await appointmentCollection.insertOne(appointment);
            // console.log(result);
            res.json(result)
        });

    }
    finally {
        // await client.close();
    }

};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Medical watch!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

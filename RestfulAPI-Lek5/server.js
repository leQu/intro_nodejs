const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { validateUser } = require('./middleware/validation');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'restful_api';
let db, users;

// Funktion för att connecta och starta server
async function startServer() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);
        users = db.collection('users');

        console.log('Connected to MongoDB');
        console.log('Database name:', db.databaseName);

        const count = await users.countDocuments();
        console.log('Users in collection:', count);

        // Start servern EFTER databasen är klar
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

//.....................ROUTES...................

// GET /users - hämta alla users
app.get('/users', async (req, res) => {
    try {
        const allaanv = await users.find().toArray();
        res.json(allaanv);
    } catch (error) {
        console.error("GET /users error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /users - skapa nya användare
app.post('/users', validateUser, async (req, res) => {
    try {
        const nyanv = {
            name: req.body.name,
            email: req.body.email,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const resultat = await users.insertOne(nyanv);

        res.status(201).json({
            message: 'User created',
            userId: resultat.insertedId
        });

    } catch (error) {
        console.error("POST /users error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /users/:id - hämta en specifik user
app.get('/users/:id', async (req, res) => {
    try {
        const anv1 = await users.findOne({ _id: new ObjectId(req.params.id) });
        if (!anv1) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(anv1);
    } catch (error) {
        console.error("GET /users/:id error:", error);
        res.status(500).json({ error: 'Invalid user ID' });
    }
});

// GET /users/name/:name - hämta user med namn (case-insensitive)
app.get('/users/name/:name', async (req, res) => {
    try {
        const nameParam = req.params.name;
        const resultat = await users.find({
            name: { $regex: `^${nameParam}$`, $options: 'i' } // case-insensitive match
        }).toArray();

        if (resultat.length === 0) {
            return res.status(404).json({ message: "No users found with that name" });
        }

        res.json(resultat);

    } catch (error) {
        console.error("GET /users/name/:name error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT /users/:id - uppdatera user
app.put('/users/:id', validateUser, async (req, res) => {
    try {
        const resultat = await users.updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    updatedAt: new Date()
                }
            }
        );

        if (resultat.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated' });

    } catch (error) {
        console.error("PUT /users/:id error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE /users/:id - ta bort user
app.delete('/users/:id', async (req, res) => {
    try {
        const resultat = await users.deleteOne({ _id: new ObjectId(req.params.id) });

        if (resultat.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted' });

    } catch (error) {
        console.error("DELETE /users/:id error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

//.............. START SERVER .............
startServer();

const express = require('express');
const redis = require('redis');
const app = express();

// Use Local Memurai settings (No password needed by default)
const client = redis.createClient({
    socket: {
        host: '127.0.0.1', // This points to your PC
        port: 6379         // The default Memurai port
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log("✅ Successfully connected to LOCAL Memurai!");
    } catch (err) {
        console.error("❌ Connection failed. Is Memurai running?", err);
    }
}

connectRedis();

app.get('/', (req, res) => {
    res.send('Good evening! Your local Redis is ready.');
});

// A test route to see it in action
app.get('/test', async (req, res) => {
    await client.set('status', 'Redis is working offline!');
    const value = await client.get('status');
    res.send(`Data from Memurai: ${value}`);
});

app.listen(8080, () => {
    console.log("Server started on http://localhost:8080");
});

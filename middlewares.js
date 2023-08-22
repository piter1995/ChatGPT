import { MongoClient } from "mongodb";
import { RATE_LIMIT, PERIOD, ALLOWED_USER_AGENTS, MONGO_URI } from "./config.js";

const client = new MongoClient(MONGO_URI);
const rateLimit = new Map();
let usersSet = new Set(); // to hold userIDs

// Connect to MongoDB and populate up your usersSet with userIDs
client.connect()
    .then((client) => {
        const usersCollection = client.db("Your DB Name").collection("Your users collection name");
        usersCollection.find({}, { userId: 1 }).toArray((err, users) => {
            if (err) throw err;

            // populate up the usersSet
            users.forEach(user => usersSet.add(user.userId));
            console.log('Users fetched into memory.');
        });
    }).catch(err => console.error(err));

async function corsMiddleware(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
};

async function rateLimitMiddleware(req, res, next) {
    let ip = req.headers['CF-Connecting-IP'] || req.headers['cf-connecting-ip'] || req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
    let userAgent = req.headers['user-agent'] || '';
    
    if (!ALLOWED_USER_AGENTS.some(agent => userAgent.includes(agent))) {
        return res.status(403).send({ status: false, message: 'User Agent not matching' });
    } 

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { requests: 1, lastRequestTime: Date.now() });
    } else {
        const currentTime = Date.now();
        const timeSinceLastRequest = currentTime - rateLimit.get(ip).lastRequestTime;
        if (timeSinceLastRequest > PERIOD) {
            rateLimit.set(ip, { requests: 1, lastRequestTime: currentTime });
        } else {
            let updatedCount = rateLimit.get(ip).requests + 1;
            if (updatedCount > RATE_LIMIT) {
                return res.status(429).send({ status: false, message: 'Too many requests, please try again later.' });
            }
            rateLimit.set(ip, { requests: updatedCount, lastRequestTime: rateLimit.get(ip).lastRequestTime });
        }
    }
    next();
};

async function validateUserMiddleware(req, res, next) {
    const userId = req.headers['userid'];
    if (!userId) {
        return res.status(400).send({ status: false, message: 'No user ID provided.' });
    }

    // Check usersSet first
    if (usersSet.has(userId)) {
        console.log(`User ID -> ${userId} ...`);
        next();
    } else {
        // If not found, check database
        const usersCollection = client.db("Your DB Name").collection("Your users collection name");
        const user = await usersCollection.findOne({ userId: userId });

        // Can't find user in database, invalid userId
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found.' });
        }

        // Found user and add it to usersSet, then go next middleware
        usersSet.add(userId);
        console.log(`User ID -> ${userId} ...`);
        next();
    }
}

export { corsMiddleware, rateLimitMiddleware, validateUserMiddleware };
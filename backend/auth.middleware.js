import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        console.log('🔍 Auth Check:');
        console.log('  - Cookies token:', req.cookies.token ? '✅ Found' : '❌ Not found');
        console.log('  - Auth header:', req.headers.authorization ? '✅ Found' : '❌ Not found');
        console.log('  - Token:', token ? '✅ Found' : '❌ Not found');

        if (!token) {
            console.error('❌ No token provided');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);

        if (isBlackListed) {
            console.error('❌ Token is blacklisted (user logged out)');
            res.cookie('token', '');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified for user:', decoded.email);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).send({ error: 'Unauthorized User' });
    }
}
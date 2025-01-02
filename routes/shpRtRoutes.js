import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();


let shiprocketToken = null; // Store token in memory
let tokenExpiry = null; // Track token expiration

// Shiprocket API Credentials
const SHIPROCKET_EMAIL = process.env.SHPRT_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHPRT_PWD;

// Function to Generate Shiprocket Token
async function getShiprocketToken() {
    // If token exists and hasn't expired, return the existing token
    if (shiprocketToken && tokenExpiry > Date.now()) {
        return shiprocketToken;
    }

    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD
        });

        shiprocketToken = response.data.token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000); // Set token expiry time
        return shiprocketToken;
    } catch (error) {
        console.error("Error generating Shiprocket token:", error);
        throw new Error("Failed to authenticate with Shiprocket");
    }
}

// Route to Track Order
router.post('/track-order', async (req, res) => {
    const { awb_id } = req.body;

    try {
        const token = await getShiprocketToken();
        const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb_id}`, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Tracking Error:", error);
        res.status(500).json({ error: "Failed to fetch tracking details" });
    }
});

export default router
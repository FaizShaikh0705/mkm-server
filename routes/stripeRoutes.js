import express from 'express'
const router = express.Router()
import dotenv from 'dotenv';
dotenv.config();


const KEY = process.env.STRIPE_KEY
import Stripe from 'stripe'

const stripe = Stripe(KEY);


router.post("/payment", async (req, res) => {
  // console.log("key", KEY);
  try {
    // Create a Source from the token
    const source = await stripe.sources.create({
      type: 'card',
      token: req.body.tokenId,
    });
    const paymentIntent = await stripe.paymentIntents.create(
      {
        source: source.id,
        amount: req.body.amount,
        currency: "inr",
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
        } else {
          res.status(200).json(paymentIntent, stripeRes);
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});


export default router


import Stripe from 'stripe';
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

const stripe = new Stripe('sk_test_51IO6K4EzFPWXmudi7UESySTV0T7K7z5h0w4H6RoAyHcy8nkEdKjbOVGft6NP4a6r91Y0lSCqoBqlLeIjkdMhXqKT00EZSMFS0N');
// process stripe payment => /api/v1/payment/process

export const processStripePayment = catchAsyncErrors( async (req, res, next)=>{
    const paymentIntention=await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:'usd',
        metadata:{integration_check:'accept_a_payment'}
    });
    res.status(200).json({
        success:true,
        client_secret:paymentIntention.client_secret
    })
})

export const sendStripeApiKey = catchAsyncErrors( async (req, res, next)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })
})
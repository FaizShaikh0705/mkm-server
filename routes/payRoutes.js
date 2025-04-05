import express from 'express'
import { ObjectId } from 'mongodb';
const router = express.Router()
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from './verifyToken.js'
import { Product } from '../models/productModel.js';
import Razorpay from 'razorpay';
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js';
import User from '../models/userModel.js';
import Dlvry from '../models/dlvryModel.js'

import axios from 'axios';

// const Razorpay = require('razorpay');

// const razorpay = new Razorpay({
//   key_id: 'rzp_live_Z2ygAX91qci4VB',
//   key_secret: 'SoKwxgfYxthb83b5FlURuzbm',
// });

const razorpay = new Razorpay({
  key_id: 'rzp_test_VQfmQIrPReEgQm',
  key_secret: '5EBwJ6UWdQqmEi4idcpYzg3n',
});
//CREATE

// router.post("/", verifyTokenAndAdmin, async (req, res) => {
// router.post("/", async (req, res) => {

//     const newProduct = new Product(req.body);

//     try {
//         const savedProduct = await newProduct.save();
//         res.status(200).json(savedProduct);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//UPDATE
// router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
router.put("/:id", async (req, res) => {

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
// router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
// router.get("/find/:id", async (req, res) => {
router.get("/find/:id", async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/invoice/:id", async (req, res) => {
  try {
    // var request = require('request');
    // var options = {
    //   'method': 'GET',
    //   'url': 'https://api.razorpay.com/v1/invoices/'+req.params.id,
    //   'headers': {
    //   }
    // };
    // request(options, function (error, response) {

    //   if (error){
    //     console.log(error);
    //   }
    //   res.status(200).json(response);
    // });
    // const product = await Product.findById(req.params.id);

    razorpay.invoices.fetch("inv_NQ2ddJig4shS1X", (err, order) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create payment order' });
      }

      // The 'order' object contains details including 'id' (order ID) and 'amount' among others
      // const paymentLink = "order.short_url";

      console.log(order);
      // console.log(err);

      // Send the paymentLink to the client or use it in your application
      res.json(order);
    });

  } catch (err) {
    res.status(500).json(err);
  }
});



const calcGst = (gstPercnt, totPric) => {

  let number = Math.round(totPric - totPric / (gstPercnt / 100 + 1));
  const decimalPart = number % 1;
  if (decimalPart >= 0.5) {
    return Math.ceil(number);
  } else {
    return Math.floor(number);
  }
  // return dbObj.gstNumber * (prPric /100);
}

//GET ALL PRODUCTS
// router.get("/", async (req, res) => {
// router.get("/", async (req, res) => {
router.post("/", verifyToken, async (req, res) => {

  const qNew = req.body;
  // const apiKey = 'rzp_test_VQfmQIrPReEgQm';
  // const apiSecret = '5EBwJ6UWdQqmEi4idcpYzg3n';

  const apiKey = 'rzp_test_VQfmQIrPReEgQm';
  const apiSecret = '5EBwJ6UWdQqmEi4idcpYzg3n';
  // console.log(qNew);
  var line_items = [];
  var ord_items = [];
  var pobjIds = [];
  var idsSelVarnt = {};
  var qtysIds = {};
  var itemCupnDisc = {};
  var cupnDiscTot = 0;
  var cupnMaxDisc = 0;

  const dlvr = await Dlvry.find().limit(1);

  var delChrgs = 120;
  if (dlvr.length) {
    dlvr[0]["allIndiaRate"] ? delChrgs = dlvr[0]["allIndiaRate"] : false;
    (qNew.shippingAddress.shippingpostalCode).startsWith('400') ? delChrgs = (dlvr[0]["mumbaiRate"] || 80) : false;
    (qNew.shippingAddress.shippingpostalCode).startsWith('700') ? delChrgs = (dlvr[0]["northeastRate"] || 120) : false;
  }
  var totalTax = 0;
  var gTotal = 0;
  var gQuan = 0;

  for (let i = 0; i < req.body.products.length; i++) {
    const elem = req.body.products[i];
    pobjIds.push(new ObjectId(elem["productId"]));
    // idsSelVarnt[elem["productId"]+elem["selectedVariantName"]] = elem["selectedVariantName"];
    // qtysIds[elem["productId"]+elem["selectedVariantName"]] = elem["quantity"];
  }

  if (qNew.couponCode) {

    const coupon = await Coupon.findOne({ couponCode: qNew.couponCode });

    if (coupon) {

      let itemSel = (coupon.SelectedProduct == "All Products") ? "all" : coupon.SelectedProduct;

      if (coupon.discountPercentage) {

        itemCupnDisc[itemSel] = { "percent": coupon.discountPercentage, "flat": 0, "max": coupon.maximumDiscount };

      } else {

        itemCupnDisc[itemSel] = { "percent": 0, "flat": coupon.flatAmount, "max": coupon.maximumDiscount };

      }
      cupnMaxDisc = parseInt(coupon.maximumDiscount);
    }
  }


  const products = await Product.find({ _id: { $in: pobjIds } });
  // console.log(products);
  for (let i = 0; i < req.body.products.length; i++) {
    const elem = req.body.products[i];
    let dbObj = (products.filter(obj => obj._id == elem.productId))[0];
    // console.log(dbObj);
    let prPric = elem["selectedVariantName"] == dbObj.postVariantName1 ? parseInt(dbObj.postPriceName) : parseInt(dbObj.postPriceName2);
    let itmDesc = (dbObj.productCode ? "hsn #" + dbObj.productCode : "");
    // let itmTax = dbObj.gstNumber ? dbObj.gstNumber * (prPric /100) * elem.quantity : 0;
    let itmTax = dbObj.gstNumber ? calcGst(dbObj.gstNumber, prPric) * elem.quantity : 0;
    // console.log("here--------",dbObj.gstNumber * (prPric /100));

    if (itmTax) {
      totalTax += itmTax;
      // console.log((qNew.shippingAddress.shippingpostalCode).startsWith('400'));
      if ((qNew.shippingAddress.shippingpostalCode).startsWith('400')) {
        itmDesc = itmDesc + "+\nCGST Rs." + Math.round(parseInt(itmTax) / 2) + " + SGST Rs. " + Math.round(parseInt(itmTax) / 2);
      } else {
        itmDesc = itmDesc + " + IGST Rs." + parseInt(itmTax);
      }
    }

    if (itemCupnDisc[dbObj.postTopicName] || itemCupnDisc["all"]) {
      let itmDisc = 0;
      let obj = itemCupnDisc["all"] ? itemCupnDisc["all"] : itemCupnDisc[dbObj.postTopicName];
      if (obj["percent"]) {
        let perc = obj["percent"] * (prPric / 100);
        let max = obj["max"];
        perc >= max ? itmDisc = max : itmDisc = perc;

      } else {
        itmDisc = obj["flat"];
      }
      // itmDisc = parseInt(elem.quantity) * parseInt(itmDisc);
      prPric -= parseFloat(itmDisc);
      cupnDiscTot += parseFloat(elem.quantity) * parseFloat(itmDisc);
      // console.log("here--------",itmDisc);
    }
    prPric = Math.round(prPric);
    gTotal += prPric * parseInt(elem.quantity);
    gQuan += parseInt(elem.quantity);
    line_items.push({
      // "name": dbObj.postTopicName +" "+elem.selectedVariantName,
      "name": dbObj.postTopicName,
      "description": itmDesc,
      "amount": prPric * 100,
      "currency": "INR",
      "quantity": elem.quantity
    });

    ord_items.push({
      productId: dbObj._id,
      quantity: elem.quantity,
      postImage: dbObj.postImage,
      postTopicName: dbObj.postTopicName,
      postLongDetail: dbObj.postLongDetail,
      selectedVariantName: elem.selectedVariantName,
      weight: 55,
      height: 55,
      length: 55,
      breadth: 55,
      selectedVariantPrice: prPric,
      gstNumber: dbObj.gstNumber ? dbObj.gstNumber : "No GST",
      productCode: dbObj.productCode ? dbObj.productCode : "No Pcode",
      itemTax: itmTax,
    });

  }
  if (cupnDiscTot) {
    cupnDiscTot > cupnMaxDisc ? cupnDiscTot = cupnMaxDisc : true;
  }
  cupnDiscTot = Math.round(cupnDiscTot);

  line_items.push({
    "name": "Delivery Charges",
    "description": "-",
    "amount": delChrgs * 100,
    "currency": "INR",
    "quantity": "1"
  });

  // line_items.push({
  //   "name": "Total Tax",
  //   "description": "GST",
  //   "amount": totalTax * 100,
  //   "currency": "INR",
  //   "quantity": "1"
  // });
  // return res.status(200).json(line_items);


  gTotal += delChrgs;
  //--------------------------------------------------------------

  try {

    var orderData = {
      userId: qNew.userId,
      firstName: qNew.firstName,
      lastName: qNew.lastName,
      products: ord_items,
      email: qNew.email,
      couponCode: qNew.couponCode,
      contact: qNew.contact,
      amount: gTotal - cupnDiscTot,
      discount: cupnDiscTot,
      quantity: gQuan,
      mop: "online",
      deliveryCharge: delChrgs,
      billingAddress: qNew.billingAddress,
      address: qNew.billingAddress,
      shippingAddress: qNew.shippingAddress,
      status: 'pending',
    };


    let discDesc = "";
    if (cupnDiscTot) {
      discDesc = "Dicount of Rs." + cupnDiscTot.toString() + "/- applied on Rs." + (gTotal + cupnDiscTot).toString() + "/- by " + qNew.couponCode;
    }

    const user = await User.findById(qNew.userId);

    // return res.status(200).json(user.razorpayId);


    if (user.razorpayId) {
      try {
        // await razorpay.customers.edit(user.razorpayId,{
        //   email: user.razorpayId+"@changable.com",
        //   contact: "1222131213",
        //   name:user.email,
        // });
        const currentTimestampMillis = Date.now();
        const rzpUsr = {
          email: user.razorpayId + String(currentTimestampMillis) + "@changable.com",
          contact: String(currentTimestampMillis),
          name: "user.name",
        }

        const response = await axios({
          method: 'put',
          url: `https://api.razorpay.com/v1/customers/${user.razorpayId}`,
          data: rzpUsr,
          auth: {
            username: apiKey,
            password: apiSecret
          }
        });
      } catch (e) {

        console.log(req);
        console.log("\n\n\n\n\n");
        console.log(e.toString());

      }
      // return res.status(200).json({"products":"assa"});
    }

    const orderOptions = {
      "type": "invoice",
      "description": "Issued By : " + qNew.firstName + " " + qNew.lastName,
      "partial_payment": false,
      "customer": {
        "name": qNew.firstName + " " + qNew.lastName,
        "contact": qNew.contact,
        "email": qNew.email,
        "billing_address": {
          "line1": qNew.billingAddress.billingline1,
          "line2": qNew.billingAddress.billingline2,
          "zipcode": qNew.billingAddress.billingpostalCode,
          "city": qNew.billingAddress.billingcity,
          "state": qNew.billingAddress.billingstate,
          "country": "in"
        },
        "shipping_address": {
          "line1": "Name: " + qNew.shippingAddress.shippingfirstName + " " + qNew.shippingAddress.shippinglastName + "\nContact: " + qNew.shippingAddress.shippingcontact + "\nAddress: " + qNew.shippingAddress.shippingline1,
          "line2": qNew.shippingAddress.shippingline2,
          "zipcode": qNew.shippingAddress.shippingpostalCode,
          "city": qNew.shippingAddress.shippingcity,
          "state": qNew.shippingAddress.shippingstate,
          "country": "IN"
        }
      },
      "line_items": line_items,
      "sms_notify": 0,
      "email_notify": 0,
      "currency": "INR",
      "comment": discDesc,
      "expire_by": parseInt(new Date().getTime() / 1000) + (86400 * 30),
      "notes": {
        "key1": "New order placed"
      }
    };

    const url = 'https://api.razorpay.com/v1/invoices';

    // Send POST request to create an invoice
    axios.post(url, orderOptions, {
      auth: {
        username: apiKey,
        password: apiSecret
      }
    })
      .then(async (order) => {

        const razorpayId = order.data.customer_id;

        // const user_id = '5eb985d440bd2155e4d788e2';
        const updatedUser = await User.findByIdAndUpdate(qNew.userId, { razorpayId: razorpayId }, {
          new: false, // Return the updated document
          runValidators: true // Ensure validation rules are applied
        });

        const count = await Order.countDocuments();

        orderData["orderId"] = (count + 1).toString().padStart(6, '0');
        orderData["rzpid"] = order.data.id;

        const newOrder = new Order(orderData);
        newOrder.save();
        return res.status(200).json(order.data);
        // console.log('Invoice Created:', response.data);
      })
      .catch(error => {
        console.error('Error creating invoice:', error.response ? error.response.data : error.message);
      });


    // razorpay.invoices.create(orderOptions, async(err, order) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).json({ error: 'Failed to create payment order' });
    //   }
    //   const razorpayId = order.customer_id;
    //   await User.findByIdAndUpdate(qNew.userId,{$set: { razorpayId },},);
    //   // const paymentLink = order.short_url;
    //   // console.log(order);
    //   // console.log(err);
    //   // Send the paymentLink to the client or use it in your application
    //   // res.json({ paymentLink });
    //   const count = await Order.countDocuments();
    //   orderData["orderId"] = (count+1).toString().padStart(6, '0');
    //   orderData["rzpid"] = order.id;

    //   const newOrder = new Order(orderData);
    //   await newOrder.save();
    //   return res.status(200).json(order);
    // });


    // let products;

    // if (qNew) {
    //     products = await Product.find().sort({ createdAt: -1 }).limit(1);
    // } else if (qCategory) {
    //     products = await Product.find({
    //         categories: {
    //             $in: [qCategory],
    //         },
    //     });
    // } else {
    //     products = await Product.find();
    // }

    // res.status(200).json({"products":"assa"});

    for (let i = 0; i < ord_items.length; i++) {
      const productId = ord_items[i].productId;
      const quantityOrdered = parseInt(ord_items[i].quantity);

      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantityOrdered } }, // assuming 'postQty' is your stock field
        { new: true }
      );
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

export default router
import express from 'express'
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import handleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';

export const createOrder = handleAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;
   const orderDetails = await Order.create({shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user.id});
   if(!orderDetails){
    return next(new handleError("Plz enter the order details",400));
   }
   else{
    res.status(200).json({
        success:true,
        orderDetails
    })
   }
})

export const getSingleOrder = handleAsyncError(async(req,res,next)=>{
    const singleOrder = await Order.findById(req.params.id).populate("user","name email");
    if(!singleOrder){
        return next(new handleError("Product did not found",400))
    }
    res.status(200).json({
        success:true,
        singleOrder
    })

})

export const allMyOrders = handleAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new handleError("No orders",400));
    }
    res.status(200).json({
        success:true,
        orders
    })
})

export const getAllOrders = handleAsyncError(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(ele=>{
        totalAmount+=ele.totalPrice;
    })
    if(!orders){
        return next(new handleError("No orders,400"));
    }
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

export const updateOrderStatus = handleAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("No order found",400));
    }
    if(order.orderStatus==="Delivered"){
      return next(new handleError("The Order has been delivered",400));
    }
    await Promise.all(order.orderItems.map((items)=>updateQuantity(items.product,items.quantity)));
    order.orderStatus=req.body.status;
    
    if(order.orderStatus==="Delivered"){
        order.deliveredAt=Date.now()
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        order
    })
})

async function updateQuantity(id,quantity){
  const product = await Product.findById(id);
  if(!product){
    return next(new handleError("No product found",400))
  }
  product.stock=product.stock-quantity;
  await product.save({validateBeforeSave:false})
}

export const deleteOrder = handleAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("Order is not found in database",400))
    }
    if(order.orderStatus!=="Delivered"){
        return next(new handleError("Order is under processing and cannot be deleted",400))
    }
    //const orderList = Order.map((ele)=>ele._id!==order._id);
    // const filteredOrder = await Order.findByIdAndDelete(req.params.id);
    await Order.deleteOne({id:req.params._id});
    res.status(200).json({success:true,message:"Product deleted successfully"})

})
import express from 'express'
import Product from '../models/productModel.js'
import handleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import apiFunctionality from '../utils/apiFunctionality.js';
export const createProducts = handleAsyncError(async(req,res,next)=>{
    req.body.user=req.user.id;
    const product = await Product.create(req.body);
 res.status(200).json({success:true,product:product})
})
export const getAllProducts = handleAsyncError(async(req,res,next)=>{
    const resultPerPage=4;
    const ApiFunction1 = new apiFunctionality(Product.find(),req.query).search().filter();
    //console.log(req.query);
    //console.log(apiFunction);
    const ApiFunction2 = ApiFunction1.query.clone();
    const TotalDocuments = await ApiFunction2.countDocuments();
    console.log(TotalDocuments);
    const TotalPages = Math.ceil(TotalDocuments/resultPerPage);
    const page= Number(req.query.page) ||1;
    if(page>TotalPages && TotalDocuments>0){
        return next(new handleError("Page limit exceeded",404))
    }
    ApiFunction1.pagination(resultPerPage);
    const products= await ApiFunction1.query;
    if(!products || products.length===0){
        return next(new handleError("No result found",404));
    }
    res.status(200).json({message:"All Products",products,TotalDocuments,TotalPages,resultPerPage})
})

export const updateProduct = handleAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new handleError("Product Not Found",404));
        //return res.status(500).json({"message":"ID not found"})
    }
  product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({success:true,"products":product})
    console.log(req.params.id);
})

export const updateProductforReview = handleAsyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),comment
    }
    const product = await Product.findById(productId);
    console.log(product);
    const productExists = product.reviews.find(review=>review.user.toString()===req.user.id.toString());
     if(!productId){
        return next(new handleError("The given product does not exists",400));
    }
    if(productExists){
          product.reviews.forEach(review=>{
            if(review.user.toString()===req.user._id.toString()){
                review.rating=Number(rating),
                review.comment=comment
            }    
          })
    }
    else{
        product.reviews.push(review);
       }
    product.numOfReviews=product.reviews.length;
    let sum=0;
    product.reviews.forEach((ele)=>{
        sum=(ele.rating);
        console.log(sum);
    })
    product.ratings=product.reviews.length>0?sum/product.reviews.length:0;
    await product.save({validateBeforeSave:false});
           res.status(200).json({
            success:true,
            product
          })
})
export const getProductReviews = handleAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if (!product){
                 return next(new handleError("The given product does not exists",400));
    }
    else{
        res.status(200).json({
            success:true,
            message:product.reviews

        })
    }
})
export const deleteProductReviews = handleAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new handleError("The given product does not exists",400));
    }
    const revi = product.reviews.filter(ele=>ele._id.toString()!==req.query.id.toString());
    const numOfReviews=revi.length;
    let sum=0;
    revi.forEach((ele)=>{
        sum+=(ele.rating);
        console.log(sum);
    })
    const ratings=revi.length>0?sum/revi.length:0;
    const updatedProducts = await Product.findByIdAndUpdate(req.query.productId,{reviews:revi,numOfReviews,ratings},{new:true,runValidators:true})
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully",
        updatedProducts
    })

})
export const deleteProduct = handleAsyncError(async(req,res,next)=>{
     let product = await Product.findById(req.params.id);
    if(!product){
        return next(new handleError("Product Not Found",404));
    }
  product = await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true,"products":product})
})
export const getSingleProduct = handleAsyncError(async(req,res,next)=>{
   let product = await Product.findById(req.params.id);
    if(!product){
        return next(new handleError("Product Not Found",404));
    }
    res.status(200).json({success:true,product:product})   
})
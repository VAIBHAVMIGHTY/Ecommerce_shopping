import React from 'react'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import CheckoutPath from './CheckoutPath'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import '../CartStyles/Payment.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
const Payment = () => {
    const orderItem=JSON.parse(sessionStorage.getItem('orderItem'))
    const {user}=useSelector(state=>state.user)
    const {shippingInfo}=useSelector(state=>state.cart)
    
    const completePayment=async(amount)=>{
        const {data:keyData}=await axios.get('/api/v1/getKey',{ withCredentials: true });
        const {key}=keyData;
        console.log("Sending amount:", amount);
        const {data:orderData}=await axios.post('/api/v1/payment/process',{amount},{ withCredentials: true });
        const {order}=orderData;
        console.log(order.amount)
        console.log(order);
        var options = {
               key,
              amount:order.amount, 
                "currency": "INR",
                "name": "ShopEasy", 
                "description": "Transaction",
                "image": "https://example.com/your_logo",
                "order_id": order.id, 
                "callback_url": "/api/v1/paymentVerification",
                "prefill": {
                    "name": user.name,
                    "email": user.email,
                    "contact":shippingInfo.phoneNumber
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
               console.log(options)
                var rzp1 = new Razorpay(options);
                rzp1.open();
            }
  return (
    <>
      <PageTitle title="Payment Processing"/>
      <Navbar/>
      <CheckoutPath activePath={2}/>
      <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">Go Back</Link>
        <button className="payment-btn" onClick={()=>completePayment(orderItem.total)}>Pay ({orderItem.total})</button>
      </div>
      <Footer/>
    </>
  )
}

export default Payment

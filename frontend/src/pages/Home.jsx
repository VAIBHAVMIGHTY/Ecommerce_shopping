import React, { useEffect } from 'react'
import Footer from '../components/Footer.jsx'
import '../pageStyles/Home.css'
import Navbar from '../components/Navbar.jsx'
import ImageSlider from '../components/ImageSlider.jsx'
import Product from '../components/Product.jsx'
import PageTitle from '../components/PageTitle.jsx'
import Loader from '../components/Loader.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeErrors } from '../features/products/productSlice'
import { toast } from 'react-toastify'

const Home = () => {
    const {loading,error,products,productCount}=useSelector((state)=>state.product);
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(getProduct({keyword:""}))
    },[dispatch]);
    useEffect(()=>{
      if(error){
        toast.error(error.message,{position:'top-center',autoClose:3000});
        dispatch(removeErrors())
      }
    },[dispatch,error])
  return (
    <>
   {loading?<Loader/>: <>
    <PageTitle title="Home-All Products"/>
    <Navbar/>
    <ImageSlider/>
    <div className="home-container">
     <h2 className="home-heading">Trending Now</h2>
     <div className="home-product-container">
        {products.map((product,index)=>(
            <Product product={product} key={index}/>
        ))} 
        
     </div>
   </div>
   <Footer/>
    </>}
    </>
   
  )
}

export default Home

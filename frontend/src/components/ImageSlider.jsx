import React, { useEffect, useState } from 'react'
import '../componentStyles/ImageSlider.css';
const images=[
    './images/banner1.jpg',
    './images/banner2.jpg',
    './images/banner3.jpg',
    './images/banner4.jpg'
]
const ImageSlider = () => {
    const [currentIndex,setCurrentIndex]=useState(0);
    useEffect(()=>{
        const interval = setInterval(()=>{
     setCurrentIndex((prev)=>(prev+1)%images.length)
        },6000)
        return ()=>clearInterval(interval);
    },[])
  return (
    <div className="image-slider-container">
        <div className="slider-images" style={{transform:`translateX(-${currentIndex*100}%)`}}>
            {images.map((image,index)=>(
                <div className="slider-item" key={index}>
                 <img src={image} alt={`Slide ${index+1}`} />
                </div>
            ))}
            {/* <div className="slider-item">
                <img src="./images/banner1.jpg" alt="" />
            </div> */}
        </div>
        <div className="slider-dots">
            {images.map((_,index)=>(<span key={index} className={`dot ${index===currentIndex?'active':""}`} onClick={()=>setCurrentIndex(index)}/>))}
        </div>
    </div>
  )
}
export default ImageSlider

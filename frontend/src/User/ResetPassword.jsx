import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice'
import { toast } from 'react-toastify'
const ResetPassword = () => {
      const {success,loading,error}=useSelector(state=>state.user);
        const dispatch=useDispatch();
        const navigate=useNavigate()
    const [password,setNewPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const {token}=useParams();
    const ResetPasswordSubmit=(e)=>{
   e.preventDefault();
    const data={
        password,
        confirmPassword
    }
    dispatch(resetPassword({token,userData:data}))
    }
         useEffect(()=>{
               if(error){
                   toast.error(error,{position:'top-center',autoClose:3000});
                   dispatch(removeErrors())
               }
           },[dispatch,error])
              useEffect(()=>{
                   if(success){
                       toast.success("Password Reset Successfully",{position:'top-center',autoClose:3000});
                       dispatch(removeSuccess());
                       navigate('/login')
                   }
               },[dispatch,success])
  return (
    <>
    <Navbar/>
    <PageTitle title="Reset Password"/>
        <div className='container form-container'>
      <div className="form-content">
            <form className="form" onSubmit={ResetPasswordSubmit}>
                <h2>Reset Password</h2>
               <div className="input-group">
                    <input type='password' name="password" placeholder="New Password" value={password} onChange={(e)=>setNewPassword(e.target.value)}/>
                </div>
                <div className="input-group">
                    <input type='password' name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                </div>
                <button className='authBtn'>Reset Password</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default ResetPassword

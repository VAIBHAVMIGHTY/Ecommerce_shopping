import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'

export const getProduct= createAsyncThunk('product/getProduct',async({keyword,page=1,category},{rejectWithValue})=>{
    try{
        let link='/api/v1/products?page='+page;
        if(category){
            link+=`&category=${category}`;
        }
        if(keyword){
            link+=`&keyword=${keyword}`;
        }
        // const link=keyword?`/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`:`api/v1/products?page=${page}`;
        //const link='/api/v1/products';
        const {data} = await axios.get(link);
        console.log(data);
        return data;
        
    }
    catch(error){
      return rejectWithValue(error.response?.data || 'An Error occurred')
    }
})
export const getProductDetails= createAsyncThunk('product/getProductDetails',async(id,{rejectWithValue})=>{
    try{
        const link=`/api/v1/product/${id}`;
        const {data} = await axios.get(link);
        console.log(data);
        return data;
        
    }
    catch(error){
      return rejectWithValue(error.response?.data || 'An Error occurred')
    }
})
const productSlice=createSlice({
    name:'product',
    initialState:{
        products:[],
        productCount:0,
        loading:false,
        error:null,
        product:null,
        resultPerPage:4,
        TotalPages:0
    },
    reducers:{
    removeErrors:(state)=>{
        state.error=null;
    }
    },
    extraReducers:builder=>{
        builder.addCase(getProduct.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getProduct.fulfilled,(state,action)=>{
            console.log("The added data",action.payload);
            state.loading=false;
            state.error=null;
            state.products=action.payload.products;
            state.productCount=action.payload.productCount;
            state.resultPerPage=action.payload.resultPerPage;
            state.TotalPages=action.payload.TotalPages
        })
        .addCase(getProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Something went wrong';
            state.products=[]
        })
         builder.addCase(getProductDetails.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
          .addCase(getProductDetails.fulfilled,(state,action)=>{
            console.log("The added data",action.payload);
            state.loading=false;
            state.error=null;
            state.product=action.payload.product;
        })
         .addCase(getProductDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Something went wrong'
        })

    }
    
})

export const {removeErrors}=productSlice.actions;
export default productSlice.reducer

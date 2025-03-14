"use client"; 

import { Provider } from "react-redux";
import store from "@/store/store";
import axios from "axios";
import { useEffect } from "react";


export default function RootLayout({ children }) {

  const getcurrentuser=async()=>{
     try{
      const response=await axios.get('/api/users/getcurrentuser');
      console.log(" the response is ",response)
     }
     catch(error){
      console.log(error);
     }
  }
  useEffect(()=>{
    getcurrentuser();
  })

  return (
    <Provider store={store}>
      <div className="grid lg:grid-cols-[350px,1fr] md:grid-cols-[290px,1fr] h-dvh max-h-dvh bg-slate-100 text-black ">
    
       {children}
       
      </div>
    </Provider>
  );
}

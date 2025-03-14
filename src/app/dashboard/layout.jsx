"use client"; 

import { Provider } from "react-redux";
import store from "@/store/store";


export default function RootLayout({ children }) {


  return (
    <Provider store={store}>
      <div className="grid lg:grid-cols-[350px,1fr] md:grid-cols-[290px,1fr] h-dvh max-h-dvh bg-slate-100 text-black ">

       
      </div>
    </Provider>
  );
}

"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice"


export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/getcurrentuser");
      if (response.data.success) {
        // User is authenticated, set user data in Redux store
        dispatch(login(response.data.data));
        setLoading(false);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error fetching current user:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    getCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if (loading) {
    return <Loading />;
  }

  return (
      <div className="h-screen flex">
        <div className="h-[60px] md:pl-56 lg:pl-64 fixed insert-y-0 w-full bg-white z-50">
          {/* <Navbar/> */}
        </div>
        <div className="hidden md:flex w-56 lg:w-64 h-full flex-col fixed insert-y-0 z-50 ">
          {/* <Sidebar/> */}
        </div>
        <div className="md:ml-56 lg:ml-64 mt-[60px] w-full bg-gray-900">{children}</div>
      </div>
    
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

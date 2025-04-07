'use client';
import React, { use, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import NewProjectModal from './_components/NewProjectModal';
import { useDispatch } from 'react-redux';
import { addProject } from "../../../store/userSlice";

function Page() {
    const [isSubmitting,setisSubmitting]=useState(false);
    const router= useRouter();
    const dispatch=useDispatch();
    const handleProjectSummit=async(data)=>{
        try{
            setisSubmitting(true);
            const response= await axios.post(`/api/projects`,data);
            toast.success(response.data.message||" new Project is Created Successfully");
            dispatch(addProject(response.data.data))
            router.push(`/dashboard/projects/${response.data.data._id}`)
        }
        catch(err){
            toast.error(err.response?.data.message||"something went wrong !");
        }
        finally{
            setisSubmitting(false);
        }
    }
  return (
    <div className='h-full min-h-fit bg-gray-900 pt-[60px]'>
      <NewProjectModal onSubmit={handleProjectSummit} isSubmitting={isSubmitting}/>
    </div>
  )
}

export default Page

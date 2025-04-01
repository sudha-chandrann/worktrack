'use client';
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TeamCreateForm from './_components/TeamCreateForm';

function Page() {
    const [isSubmitting,setisSubmitting]=useState(false);
    const router= useRouter();
    const handleProjectSummit=async(data)=>{
        try{
            setisSubmitting(true);
            const response= await axios.post(`/api/teams`,data);
            toast.success(response.data.message||" new tean is Created Successfully");
            router.push(`/projects/${response.data.data.projectId}`)
        }
        catch(err){
            toast.error(err.response?.data.message||"something went wrong !");
        }
        finally{
            setisSubmitting(false);
        }
    }
  return (
    <div className='h-full min-h-fit bg-gray-900 flex items-center justify-center'>
      <TeamCreateForm onSubmit={handleProjectSummit} isSubmitting={isSubmitting}/>
    </div>
  )
}

export default Page

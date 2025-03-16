'use client';
import React, { useState } from 'react'
import NewProjectModal from './_components/ProjectForm'

function Page() {
    const [isSubmitting,setisSubmitting]=useState(false);
    const handleProjectSummit=async()=>{
        try{
            setisSubmitting(true);

        }
        catch(err){
            console.log(err);
        }
        finally{
            setisSubmitting(false);
        }
    }
  return (
    <div className=' bg-gray-900'>
      <NewProjectModal onSubmit={handleProjectSummit} isSubmitting={isSubmitting}/>
    </div>
  )
}

export default Page

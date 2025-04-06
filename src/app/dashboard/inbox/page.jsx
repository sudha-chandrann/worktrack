'use client'
import axios from 'axios';
import { PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import NewTodoModal from "./_components/NewTodoModal"

function Page() {
  const inboxid=useSelector((state)=>state.user.inbox);
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
  const [isloading,setisloading]=useState(false);
  const [isError,setisError]=useState(false);
  const [data,setdata]=useState(null);
  const [isSubmitting,setisisSubmitting]=useState(false);

  const getInboxtodos= async()=>{
    try{
      setisloading(true);
      const response=await axios.get('/api/users/getuserinbox');
      setdata(response.data.data);
    }
    catch(error){
      setisError(true);
      toast.error(error.response.data.message||" something went wrong!")
    }
    finally{
      setisloading(false);
    }
  }
  
  useEffect(()=>{
    getInboxtodos()
  },[inboxid])


   // Group todos by due date
  const groupTodosByDate = (todos) => {
    if (!todos) return {};
    
    return todos.reduce((acc, todo) => {
      let dateKey = 'No Due Date';
      
      if (todo.dueDate) {
        const today = new Date();
        const dueDate = new Date(todo.dueDate);
        
        // Reset time part for comparison
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          dateKey = 'Overdue';
        } else if (diffDays === 0) {
          dateKey = 'Today';
        } else if (diffDays === 1) {
          dateKey = 'Tomorrow';
        } else if (diffDays <= 7) {
          dateKey = 'This Week';
        } else {
          dateKey = 'Later';
        }
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(todo);
      return acc;
    }, {});
  };
  
    // Sort groups by priority order
    const sortedGroups = [
      'Overdue',
      'Today',
      'Tomorrow',
      'This Week',
      'Later',
      'No Due Date'
    ];

    const handleUpdateTodo=async(id,updateData)=>{
     try{
        const response= await axios.patch(`/api/projects/${inboxid}/todos/${id}`,updateData);
        toast.success(response.data.message||"Todo is Updated Successfully");
        getInboxtodos()
      }
      catch(error){
        console.log(" the error in updating todo ",error);
        toast.error(error.response?.data?.message||"Something went wrong")
      }
    }

    const handleDeleteTodo=async(id)=>{
      try{
        const response= await axios.delete(`/api/projects/${inboxid}/todos/${id}`);
        toast.success(response.data.message||"Todo is deleted Successfully");
        getInboxtodos()
      }
      catch(error){
        console.log(" the error in updating todo ",error);
        toast.error(error.response?.data?.message||"Something went wrong")
      }
    }

  const handleCreateTodo=async(data)=>{
        try{
            setisisSubmitting(true);
            const response= await axios.post(`/api/projects/${inboxid}`,data)
            toast.success(response.data.message)
            getInboxtodos()
        }
        catch(error){
           toast.error(error.response?.data?.message||"Something went wrong !")
        }
        finally{
            setisisSubmitting(false);
            setIsNewTodoModalOpen(false);
        }
        
   }

    const groupedTodos = data ? groupTodosByDate(data) : {};
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <button
            onClick={() => setIsNewTodoModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Task
          </button>
        </header>
        {
          isloading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          ): isError ?  (
            <div className="bg-red-900 text-white p-4 rounded-lg">
              Failed to load inbox tasks. Please try again.
            </div>
          ):(
            <div className='space-y-6'>
             {
              sortedGroups.map(group => {
                if (!groupedTodos[group] || groupedTodos[group].length === 0) return null;
                 return (
                  <div key={group} className="space-y-3">
                    <h2 className={`text-lg font-medium ${
                    group === 'Overdue' ? 'text-red-400' : 
                    group === 'Today' ? 'text-yellow-400' : 
                    'text-blue-400'
                  }`}>
                    {group}
                  </h2>
                  <div className="space-y-2">

                  </div>
                  </div>
                 )
              })}
           {Object.keys(groupedTodos).length === 0 && (
              <div className="text-center p-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400">Your inbox is empty. Add a task to get started!</p>
              </div>
            )}
            </div>
          )
        }
        </div>
        {isNewTodoModalOpen && (
        <NewTodoModal
          onClose={() => setIsNewTodoModalOpen(false)}
          onSubmit={handleCreateTodo}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default Page

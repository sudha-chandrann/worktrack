"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import React from "react";


function AlertBox({
  children,
  onConfirm,
}) {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
             {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-900 border border-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
            This action cannot be undone.This will permanently delete this task . You will not be able to recover this data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction className=" bg-indigo-700 hover:bg-indigo-800 text-white" onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AlertBox;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../../components/ui/select";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import toast from "react-hot-toast";

export default function AddMemberModal({ isOpen, onClose, teamId }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available users when modal opens
  useEffect(() => {
    if (isOpen && teamId) {
      setIsLoading(true);
      fetchAvailableUsers();
      
      setSelectedUserIds([]);
      setRole("member");
      setSearchTerm("");
      setError("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, teamId]);

  // Fetch users not in the team
  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(`/api/teams/${teamId}/available-users`);
      
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      } else {
        setError(response.data.message || "Unable to retrieve available users");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load available users");
      console.error("Error fetching available users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term - computed value, not state
  const filteredUsers = availableUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.fullName?.toLowerCase().includes(searchLower)
    );
  });

  // Handle user selection with multi-select functionality
  const handleUserToggle = (userId) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedUserIds.length === 0) {
      setError("Please select at least one user to invite to the team");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Handle sending multiple invitations
      const promises = selectedUserIds.map(userId => 
        axios.post(`/api/teams/${teamId}/members`, {
          memberId:userId,
          role
        })
      );
      
      const results = await Promise.allSettled(promises);
      const failures = results.filter(result => result.status === 'rejected');
      
      if (failures.length === 0) {
        // All invitations sent successfully
        toast.success(`Successfully sent invitations to ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? 's' : ''}.`,);
        onClose();
      } else {
        setError(`Failed to send ${failures.length} of ${selectedUserIds.length} invitations`);
        
        // Show toast for successful ones
        const successCount = results.filter(result => result.status === 'fulfilled').length;
        if (successCount > 0) {
          toast.success(`Successfully sent ${successCount} invitation${successCount !== 1 ? 's' : ''}.`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send team invitations");
      console.error("Error sending team invitations:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Select or deselect all visible users
  const handleSelectAll = () => {
    if (filteredUsers.length === 0) return;
    
    const allSelected = filteredUsers.every(user => 
      selectedUserIds.includes(user._id)
    );
    
    if (allSelected) {
      // If all are selected, deselect all filtered users
      setSelectedUserIds(prev => 
        prev.filter(id => !filteredUsers.some(user => user._id === id))
      );
    } else {
      // Otherwise, select all filtered users
      const filteredIds = filteredUsers.map(user => user._id);
      setSelectedUserIds(prev => {
        const newSelection = [...prev];
        filteredIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Computed properties for checkbox states - not state variables
  const allFilteredSelected = filteredUsers.length > 0 && 
    filteredUsers.every(user => selectedUserIds.includes(user._id));
    
  const someFilteredSelected = filteredUsers.some(user => 
    selectedUserIds.includes(user._id)
  ) && !allFilteredSelected;

  // Handle dialog close properly
  const handleDialogClose = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search input */}
          <div className="space-y-2">
            <Label htmlFor="search-users">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-users"
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* User list with multi-select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Available Users</Label>
              {filteredUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all" 
                    checked={allFilteredSelected}
                    ref={checkbox => {
                      if (checkbox) {
                        // Set indeterminate property directly on DOM element
                        checkbox.indeterminate = someFilteredSelected;
                      }
                    }}
                    onCheckedChange={() => handleSelectAll()}
                  />
                  <Label htmlFor="select-all" className="text-xs text-muted-foreground cursor-pointer">
                    {allFilteredSelected ? "Deselect All" : "Select All"}
                  </Label>
                </div>
              )}
            </div>
            
            <div className="border rounded-md">
              {isLoading ? (
                <div className="flex justify-center items-center p-4 h-64">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground h-64 flex items-center justify-center">
                  {searchTerm ? "No users matching your search criteria" : "No available users found"}
                </div>
              ) : (
                <ScrollArea className="h-64">
                  <div className="divide-y">
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        className={`flex items-center p-3 transition-colors hover:bg-muted ${
                          selectedUserIds.includes(user._id) ? 'bg-muted/50' : ''
                        }`}
                      >
                        <Checkbox
                          id={`user-${user._id}`}
                          checked={selectedUserIds.includes(user._id)}
                          onCheckedChange={() => handleUserToggle(user._id)}
                        />
                        <div 
                          className="ml-3 cursor-pointer flex-grow"
                          onClick={() => handleUserToggle(user._id)}
                        >
                          <div className="font-medium">
                            {user.fullName || user.username}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
          
          {/* Role selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role Assignment</Label>
            <Select
              value={role}
              onValueChange={value => setRole(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {role === "admin" ? 
                "Administrators can manage team members and settings." : 
                "Members can access team resources but cannot modify team settings."}
            </p>
          </div>
          
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedUserIds.length === 0}
              className={isSubmitting ? "opacity-80" : ""}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : `Invite ${selectedUserIds.length ? selectedUserIds.length : ""} User${selectedUserIds.length !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
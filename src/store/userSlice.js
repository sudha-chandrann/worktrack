import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  username: null,
  fullName:null,
  email: null,
  projects: [],
  teams:[],
  inbox:'',
  _id:null
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {  
      state.status = true;
      state._id=action.payload._id;
      state.username = action.payload.username;
      state.fullName=action.payload.fullName;
      state.email = action.payload.email;
      state.projects = action.payload.projects;
      state.teams = action.payload.teams;
      state.inbox=action.payload.inbox;
    },
    authlogout: (state) => {
      state.status = false;
      state.username = null;
      state.fullName=null;
      state.email = null;
      state.projects = [];
      state.teams=[];
      state.inbox='';
      state._id=null;
    },
    setProjects: (state, action) => {
        state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(project => project._id !== action.payload);
    }
  },
});

export const { login, authlogout ,setProjects,addProject,removeProject} = UserSlice.actions;
export default UserSlice.reducer;




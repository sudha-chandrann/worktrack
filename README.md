# WorkTrack

**WorkTrack** is a collaborative project management tool designed to help teams and individuals efficiently manage their tasks. It enables seamless project tracking, task assignment, prioritization, and real-time communication. Whether you're managing a team project or organizing personal tasks, WorkTrack makes productivity effortless.

## Features

### Team Collaboration
- Create and manage projects within a team.
- Only team leaders can assign tasks to team members.
- Set deadlines and prioritize tasks for better project management.
- Team members can comment and communicate on each task and subtask.

### Task Management
- Assigned users can create subtasks to break down their work.
- Add detailed descriptions to todos and subtodos.
- Commenting feature available for both todos and subtodos.
- **(Upcoming Feature)** AI-powered task description suggestions.

### Personal Projects
- Users can create personal projects to manage individual tasks outside of the team environment.

## Installation

To install and run WorkTrack on your local machine, follow these steps:

### Clone the Repository
```bash
git clone https://github.com/sudha-chandrann/worktrack.git
```

### Navigate to the Project Directory
```bash
cd todotracker
```

### Set Up Environment Variables
Create a `.env` file in the root directory and provide the following environment variables:
```plaintext
PORT=your_port_number
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=your_cors_origin
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry_time
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry_time
```

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm start
```

## Usage

### Creating a Project
Team leaders can create projects and assign tasks to team members.

### Managing Tasks
Once assigned, users can:
- Create subtasks
- Add descriptions
- Set priorities
- Communicate via comments

### Personal Use
Users can manage their personal projects separately from team projects.

## Technologies Used

### Frontend
- Next.js
- Tailwind CSS

### Backend
- Next js api
- MongoDB

### Real-time Communication
- Socket.IO

### Authentication
- JWT (JSON Web Token)

## Contribution Guidelines
We welcome contributions to improve WorkTrack! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.


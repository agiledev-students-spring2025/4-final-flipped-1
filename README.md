# Flipped
## **Project Title**  
**Flipped**  

Filpped Team 1

## **Tech Stack**
### Frontend
- **Framework**: React.js
- **State Management**: React Hooks
- **Routing**: React Router
- **Styling**: CSS3, Flexbox, Grid
- **HTTP Client**: Axios
- **UI Components**: Custom Components
- **Build Tool**: Docker

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: RESTful API
- **Containerization**: Docker

### DevOps
- **Container Orchestration**: Docker Compose
- **Version Control**: Git
- **CI/CD**: Manual Deployment
- **Cloud Platform**: DigitalOcean
- **Web Server**: Nginx (Production)

### Development Tools
- **Code Editor**: VS Code
- **Package Manager**: npm
- **Version Control**: Git
- **API Testing**: Postman
- **Database Management**: MongoDB Compass

## **Project Link**
http://165.227.97.236:8080/

## **Project Description**  
Flipped is a schedule management application that combines a calendar, to-do list, and filpped pomodoro timer. It is designed to help users efficiently manage their schedules while improving their mobile phone usage habits.  

In modern society, mobile devices are essential tools, but excessive phone usage can disrupt productivity and daily routines. Flipped integrates a **flipping-based timer** with **calendar scheduling and task management** to encourage focused work sessions and structured breaks. By promoting self-discipline and mindful phone usage, the app helps users maintain better time management and healthier digital habits.  

## **Project Objectives**  
The goal of Flipped is to:  
- Help users **effectively plan and manage** their daily tasks.  
- Improve **productivity and time management skills**.  
- Foster **healthier mobile device usage habits**.  

## **Target Users**  
Flipped is designed for:  
- **Students, researchers, and professionals** who need a structured way to manage their schedules and focus on tasks.  
- **Individuals struggling with excessive phone usage** who want to develop better self-discipline. 

## **Team Members**:

Xinwei Xie(xx2185)

Feiluan Feng(ff2171)

Chuqiao Huang(ch3807)

Larisa Li(rl4737)


## **How? - Main Features**  

#### **1. Flip for Time Focus**  
- Users **set a focus goal** and **flip their phone** to start a timer automatically. When the user lifts up the phone, the timing will automatically pause, and shows user the focused period.
- Encourages self-discipline by keeping users away from distractions.
- Users are able to check their Focus period in the statistics page in **daily, weekly or monthly formats**.

#### **2. Calendar with To-Do List**  
- Users can view their schedules in **daily, weekly or monthly formats**.  
- Integration with a **task manager** allows users to create, edit, and track tasks. Help users **stay on top of deadlines**.
- 

## Directly access

Please visit: http://165.227.97.236:8080/ for directly access.

## **Project Set Up**  

Local Manual Setup

#### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ or v16+ recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/) for version control


Open your terminal and navigate to your 
If you would like to access our database for development use, please contact us for getting the .env file.

## Docker Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- Node.js and npm (for development)

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a `.env` file in the root directory with the following content:
```env
MONGODB_URI=mongodb://admin:secret@mongodb:27017/flipped?authSource=admin
JWT_SECRET=your_jwt_secret_here
```

3. Start the application:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

### Server Deployment

1. SSH into your server and clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a `.env` file with production settings:
```env
MONGODB_URI=mongodb://xxx
JWT_SECRET=xxx
```

3. Build and start the containers:
```bash
docker-compose up -d --build
```

4. Configure your web server (Nginx/Apache) to proxy requests to the frontend container.

### Environment Variables

#### Frontend (.env in front-end directory)
```env
REACT_APP_API_URL=http://localhost:3001
```

#### Backend (.env in root directory)
```env
MONGODB_URI=mongodb://admin:secret@mongodb:27017/flipped?authSource=admin
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

### Docker Compose Services

- **front-end**: React application running on port 8080
- **back-end**: Node.js API server running on port 3001
- **mongodb**: MongoDB database running on port 27017

### Common Commands

- Start all services:
```bash
docker-compose up -d
```

- Stop all services:
```bash
docker-compose down
```

- View logs:
```bash
docker-compose logs -f
```

- Rebuild and restart:
```bash
docker-compose up -d --build
```

### Troubleshooting

1. If MongoDB connection fails:
   - Check if MongoDB container is running
   - Verify credentials in .env file
   - Check network connectivity between containers

2. If frontend can't connect to backend:
   - Verify REACT_APP_API_URL in frontend .env
   - Check if backend container is running
   - Ensure CORS is properly configured

3. If containers won't start:
   - Check port conflicts
   - Verify Docker and Docker Compose versions
   - Check system resources

### Development Workflow

1. Make code changes in your local environment
2. Test changes locally using `docker-compose up --build`
3. Commit changes to version control
4. Deploy to server using `docker-compose up -d --build`

### Security Considerations

1. Always use strong passwords for MongoDB
2. Keep JWT_SECRET secure and unique
3. Use HTTPS in production
4. Regularly update dependencies
5. Monitor container logs for suspicious activity






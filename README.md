# Capstone Project Introduction

AppointMe is an easy-to-use appointment booking website that connects people with professional service providers. There are two main types of users on this platform: Service Providers and Regular Users. Service providers, like doctors or chartered accountants, can join our platform to create listings for their services. They can set up their availability by creating specific dates and time slots, making it simple for users to see when they are free. Regular users can access these services and book an appointment conveniently. The service provider is notified in his dashboard when the user books an appointment. The Service providers can either approve or decline the booking. After that, a notification is sent to the user informing them about the service provider's decision, thus making the whole process efficient and easy to follow.

## Prerequisites

Before running the app, make sure you have a couple of things ready:

- Node.js installed on your machine. If you haven’t installed it yet, you can grab it (https://nodejs.org/).
- A MongoDB database to connect to.

## Getting Started

Let's get your local setup up and running with a few simple steps!

First, you'll want to clone the repository to your local machine. Open your terminal and run:

- git clone https://github.com/Anetiafaber/Capstone.git

- Next, install the node_modules using "npm install"

- Create a .env file in the root of both the server and client folder

- inside server/.env file add

MONGO_URI = Your_MongoDB_Connection_String  
PORT = 5000

- inside client/.env file add

REACT_APP_API_URL=http://localhost:5000

## Running the Server and Client

To start the server and client, navigate to each directory and run the respective command:

1. **Start the Server:**
   cd server  
   node server.js

   - You can also run:  
     npm start

2. **Start the Client:**  
   cd client  
   npm start

Once both the server and client are running, you should be able to access the application in the browser!

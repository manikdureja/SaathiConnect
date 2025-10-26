# SaathiConnect 🤝

A full-stack MERN application dedicated to the health, safety, and community connection of senior citizens.

[![Deploy](https://img.shields.io/badge/Deploy-Render-000?style=for-the-badge&logo=render)](https://saathiconnect.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📖 Overview

**SaathiConnect** (meaning "Companion Connect") is a comprehensive web platform designed to support senior citizens by providing a digital ecosystem for their health and social needs. It bridges the gap between patients, doctors, and hospitals, ensuring that vital medical information is accessible when it matters most, while also fostering a sense of community.

This project is built with the MERN stack (MongoDB, Express, React, Node.js) and is deployed on Render.

## ✨ Key Features

* **Authentication:** Secure, role-based JWT authentication for Patients, Doctors, and Hospitals.
* **Comprehensive Medical Profiles:** Patients can manage their complete health profile, including:
    * Blood Group, Height, Weight, BMI
    * Allergies & Chronic Conditions
    * Current Medications
    * Emergency Contact Information
* **QR Code Medical Access:** Each patient is assigned a unique QR code. When scanned (e.g., by a hospital or first responder), this code displays their vital, non-sensitive medical information for emergency situations.
* **Report Management:** Users can upload and store their medical reports (like PDFs or images).
* **Doctor-Patient Chat:** A real-time chat system allowing patients to connect with registered doctors for consultations.
* **Community Feed:** A social feed where users can create posts, share thoughts, and connect with other members of the community.
* **SOS/Alerts:** (Implementation in progress) Features for location sharing and sending SOS alerts to emergency contacts.

## 🚀 Tech Stack

### Frontend
* **React (Vite):** A fast, modern React framework.
* **Shadcn/UI & Tailwind CSS:** For a beautiful, responsive, and accessible component library.
* **`wouter`:** A minimalist router for React.
* **`lucide-react`:** For clean and simple icons.

### Backend
* **Node.js:** JavaScript runtime for the server.
* **Express:** A minimal and flexible Node.js web application framework.
* **MongoDB:** A NoSQL database for storing all application data.
* **Mongoose:** An elegant object data modeling (ODM) library for MongoDB and Node.js.
* **JWT (jsonwebtoken):** For generating and verifying secure authentication tokens.
* **`bcryptjs`:** For hashing user passwords.
* **`multer`:** Middleware for handling `multipart/form-data`, used for file uploads.

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* `npm` or `yarn`
* [MongoDB](https://www.mongodb.com/try/download/community) (a local instance) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

### 1. Backend Setup

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create the environment file (see section below)
touch .env

# 4. Run the development server
npm run dev


### 1. Frontend  Setup

# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Create the environment file (see section below)
touch .env

# 4. Run the development client
npm run dev

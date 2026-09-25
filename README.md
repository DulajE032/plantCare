# 🌿 PlantCare

## Intelligent Plant Disease Classification Platform

PlantCare is an AI-powered plant disease classification platform designed to help farmers, home gardeners, researchers, and agricultural professionals identify plant diseases from leaf images.

The system combines **deep learning, image processing, a RESTful backend, and a modern web interface** to provide disease predictions, confidence scores, treatment recommendations, preventive guidance, and diagnosis history.

The platform is designed as a modular full-stack system consisting of a frontend application, FastAPI backend, PostgreSQL database, and AI-based plant disease classification component.

---

## 📌 Overview

Plant diseases can significantly affect crop productivity and quality. In many situations, early identification is difficult because farmers may not have immediate access to agricultural experts.

PlantCare addresses this problem by allowing users to upload or capture an image of a plant leaf. The image is processed and analyzed using a trained deep learning model. The system then provides a predicted disease, confidence score, and relevant treatment and prevention information.

### Core Workflow

```text
Plant Leaf Image
       │
       ▼
Image Upload
       │
       ▼
Image Validation
       │
       ▼
Image Preprocessing
       │
       ▼
AI Disease Classification
       │
       ▼
Disease Prediction
       │
       ▼
Confidence Score
       │
       ▼
Treatment & Prevention Information
       │
       ▼
Diagnosis History
```

---

## 🎯 Objectives

The main objectives of PlantCare are to:

* Develop an AI-based plant disease classification system.
* Identify diseases from plant leaf images.
* Provide disease prediction results with confidence scores.
* Provide treatment and prevention recommendations.
* Maintain users' diagnosis history.
* Provide role-based access to system functionality.
* Provide administrative management capabilities.
* Build a scalable REST API for communication between the frontend and backend.
* Evaluate the performance of the trained machine learning model.

---

## ✨ Key Features

### 🌱 Plant Disease Detection

Users can upload plant leaf images and obtain an AI-generated disease classification.

### 🤖 AI-Based Classification

The system uses deep learning and computer vision technologies to analyze plant images and classify potential diseases.

### 📊 Confidence Score

Prediction results include a confidence value representing the model's estimated confidence in the classification.

### 💊 Treatment Recommendations

After identifying a disease, the system can provide corresponding treatment information.

### 🛡️ Prevention Guidance

Users can access preventive measures and disease-management information.

### 📚 Diagnosis History

Previous predictions can be stored and accessed through the user's history.

### 👨‍🌾 User Dashboard

Users can manage their account, submit images, view predictions, and access previous diagnoses.

### 👨‍💼 Administrative Dashboard

Administrators can manage users, crops, diseases, and other system information.

### 🔐 Authentication & Authorization

The backend supports JWT-based authentication and role-based access control.

### 📱 Responsive Application

The frontend provides an interface for interacting with the disease classification platform.

### 🐳 Containerized Deployment

Docker configuration is included to simplify application deployment and environment setup.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │  Web Application     │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │                      │
                    │ Authentication       │
                    │ Business Logic       │
                    │ API Endpoints        │
                    │ AI Integration       │
                    └───────┬───────┬──────┘
                            │       │
                ┌───────────┘       └────────────┐
                ▼                                ▼
       ┌────────────────┐               ┌─────────────────┐
       │  PostgreSQL    │               │ AI Classification│
       │    Database    │               │     Model       │
       └────────────────┘               └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion
* Axios

### Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* JWT Authentication
* Uvicorn

### Database

* PostgreSQL

### Artificial Intelligence

* PyTorch
* Torchvision
* OpenCV
* NumPy
* Pillow

### Development & Deployment

* Git
* GitHub
* Docker
* Docker Compose
* UV
* Vercel

---

## 📂 Project Structure

```text
plantCare/
│
├── backend/
│   ├── app/
│   ├── ...
│   └── main.py
│
├── plant-disease-frontend/
│   ├── ...
│   └── package.json
│
├── Document/
│
├── Group_10_M1_Proposal.pdf
├── PlantCare_M6_G10_Final_Presentation.pdf
├── PlantCare_M6_G10_Final_Report.pdf
│
├── docker-compose.yml
├── implementation_plan.md
├── integration_guide.md
├── task.md
├── .gitignore
└── README.md
```

The repository also contains project documentation and academic project deliverables.

---

## 👥 User Roles

### User / Farmer

Users can:

* Register an account
* Log in securely
* Upload plant images
* Obtain disease predictions
* View treatment information
* View prevention information
* Access diagnosis history

### Agricultural Expert

The platform is designed to support agricultural experts with capabilities such as:

* Reviewing disease information
* Providing recommendations
* Supporting farmers
* Managing agricultural knowledge

### Administrator

Administrators can manage:

* Users
* Crops
* Diseases
* Articles
* System information
* Reports

---

## 🔐 Security

PlantCare is designed with several security mechanisms, including:

* JWT-based authentication
* Password hashing
* Role-based authorization
* Input validation
* Secure API communication
* File-upload validation
* Protected administrative endpoints

Authentication and authorization are handled through the backend API.

---

## 🤖 AI Disease Classification

The AI component follows an image-classification pipeline:

```text
Input Image
     │
     ▼
Image Validation
     │
     ▼
Preprocessing
     │
     ▼
Feature Extraction
     │
     ▼
Deep Learning Model
     │
     ▼
Disease Classification
     │
     ▼
Confidence Score
```

Potential deep learning architectures documented for the project include:

* EfficientNet
* MobileNet
* ResNet
* Vision Transformer
* ConvNeXt

The project documentation identifies datasets such as **PlantVillage**, **PlantDoc**, and other plant-disease datasets as possible sources for model development.

---

## 🗄️ Data Management

The system is designed to maintain information related to:

### Users

* User ID
* Name
* Email
* Password
* Role
* Account creation information

### Crops

* Crop name
* Scientific name

### Diseases

* Disease name
* Associated crop
* Symptoms
* Treatment
* Prevention

### Predictions

* User
* Predicted disease
* Confidence score
* Image
* Prediction date

### Articles

* Title
* Description
* Author
* Publication information

---

## 🔌 REST API

The backend exposes RESTful endpoints for communication between the frontend and server.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Disease Prediction

```text
POST /api/predict
GET  /api/history
GET  /api/history/{id}
```

### Diseases

```text
GET /api/diseases
GET /api/diseases/{id}
```

### Articles

```text
GET  /api/articles
POST /api/articles
```

### Administration

```text
GET  /api/admin/users
GET  /api/admin/reports
POST /api/admin/diseases
```

These endpoints are documented in the current repository README.

---

## 🖥️ Main Application Pages

The platform includes functionality for:

* Landing Page
* User Registration
* User Login
* Dashboard
* Plant Image Upload
* Disease Prediction
* Disease Details
* Prediction History
* Articles
* User Profile
* Settings
* Administrative Dashboard

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DulajE032/plantCare.git
cd plantCare
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment.

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the database migrations:

```bash
alembic upgrade head
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The API will then be available through the local development server.

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd plant-disease-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend can then be accessed through the local development URL displayed by Next.js.

---

## 🐳 Docker

The repository includes Docker configuration for running project services in containers.

To start the configured services:

```bash
docker compose up --build
```

To stop the services:

```bash
docker compose down
```

---

## 📊 Model Evaluation

The AI model can be evaluated using standard classification metrics:

| Metric         | Purpose                                    |
| -------------- | ------------------------------------------ |
| Accuracy       | Overall classification correctness         |
| Precision      | Correctness of positive predictions        |
| Recall         | Ability to identify relevant disease cases |
| F1-Score       | Balance between precision and recall       |
| Inference Time | Time required to generate a prediction     |

These metrics can be used to evaluate the effectiveness and practical performance of the disease classification model.

---

## 🔮 Future Enhancements

Potential future improvements include:

* Real-time camera-based disease detection
* Offline AI inference
* Weather-based disease-risk prediction
* Fertilizer recommendations
* Pest detection
* Voice-based assistance
* Plant-care chatbot
* IoT sensor integration
* Satellite-based crop monitoring
* Additional crop and disease classes

---

## 📚 Project Documentation

Additional project documentation is available in the repository, including:

* Project proposal
* Final report
* Final presentation
* Implementation plan
* Integration guide
* Development tasks

---

## 🎓 Academic Project

**Project:** PlantCare – Intelligent Plant Disease Classification Platform

**Institution:** Faculty of Engineering, University of Peradeniya

**Project Team:**

* Dulaj Ashen
* Minhaj Ali
* Tharaka
* Rinushan

The repository identifies the work as an academic Computer Engineering project.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🌿 Project Summary

PlantCare combines **artificial intelligence, computer vision, web technologies, and database systems** to create a practical plant disease identification platform.

By connecting an AI-based image classification system with a RESTful backend and user-facing application, PlantCare provides a structured platform for plant disease diagnosis, information management, and agricultural decision support.

---

### Project Repository

[GitHub Repository](https://github.com/DulajE032/plantCare)

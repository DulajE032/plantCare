<div align="center">

# 🌿 EcoVision

### Intelligent Plant Disease Classification Platform

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=26&duration=3000&pause=1000&color=2ECC71&center=true&vCenter=true&width=700&lines=AI-Powered+Plant+Disease+Classification;Flutter+%7C+FastAPI+%7C+PyTorch;Smart+Agriculture+Platform;Empowering+Farmers+with+Artificial+Intelligence" />

<p>
An AI-powered platform that helps farmers identify plant diseases instantly using deep learning,
providing accurate diagnosis, treatment recommendations, and crop health management through
Flutter Mobile/Desktop applications and a FastAPI backend.
</p>

<img src="https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter"/>
<img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi"/>
<img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python"/>
<img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql"/>
<img src="https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=for-the-badge&logo=pytorch"/>
<img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>

</div>
<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&height=280&color=0:16A34A,100:22C55E&text=EcoVision&fontAlign=50&fontAlignY=40&fontSize=70&fontColor=ffffff&desc=Intelligent%20Plant%20Disease%20Classification%20Platform&descAlign=50&descAlignY=65"/>
</p>

## 🌱 About EcoVision

EcoVision is an AI-powered smart agriculture platform designed to assist farmers,
researchers, and agricultural experts in identifying plant diseases from leaf images.

Using state-of-the-art deep learning models, EcoVision provides instant disease
classification, confidence scores, treatment recommendations, and preventive measures
through an intuitive Flutter application powered by a FastAPI backend.

The platform aims to improve crop productivity, reduce disease spread, and promote
sustainable farming practices using modern artificial intelligence technologies.




## 🌱 Overview

The **Intelligent Plant Disease Classification Platform** is an AI-powered mobile and web application designed to help farmers, home gardeners, and agricultural professionals quickly identify plant diseases using images of plant leaves. Users can capture or upload a photo of a plant leaf, and the system uses a deep learning model to classify the disease and provide treatment recommendations, preventive measures, and disease management guidance.

The platform consists of:

* **Flutter Mobile Application (Android, iOS)**
* **Flutter Desktop Application (Windows, macOS, Linux)**
* **FastAPI Backend**
* **PostgreSQL Database**
* **AI Model for Plant Disease Classification**
* **Admin Dashboard**

---

# Problem Statement

Plant diseases significantly reduce crop yield and quality. Many farmers, especially in rural areas, lack immediate access to agricultural experts, leading to delayed diagnosis and ineffective treatment.

An intelligent platform capable of automatically identifying plant diseases from leaf images can assist farmers in making timely decisions, reducing crop losses, and improving agricultural productivity.

---

# Objectives

### Main Objective

Develop an AI-powered plant disease classification platform that accurately detects plant diseases from leaf images and provides treatment recommendations through mobile and desktop applications.

### Specific Objectives

* Develop an image classification model for plant disease detection.
* Build a Flutter application for Android, iOS, and Desktop.
* Develop a FastAPI backend for secure communication.
* Store diagnosis history and user information.
* Generate treatment recommendations.
* Provide disease prevention guidelines.
* Build an administrative dashboard.
* Evaluate model performance.

## ✨ Features

- 📸 AI-Based Plant Disease Classification
- 🌿 Instant Disease Diagnosis
- 📊 Confidence Score Prediction
- 💊 Treatment Recommendations
- 🛡 Disease Prevention Tips
- 📚 Diagnosis History
- 👨‍🌾 Farmer Dashboard
- 👩‍💼 Admin Dashboard
- 📱 Flutter Mobile Application
- 💻 Flutter Desktop Application
- ⚡ FastAPI REST API
- 🔒 JWT Authentication
- ☁ Cloud Ready Architecture

# System Architecture

```
                Flutter Mobile
                     │
                Flutter Desktop
                     │
                 REST API
                     │
                FastAPI Backend
                     │
     ┌───────────────┼────────────────┐
     │               │                │
 PostgreSQL     AI Classification   File Storage
 Database          Model
```

---

# Technology Stack

## Frontend

* Flutter
* Dart
* Material Design

---

## Backend

* FastAPI
* Python 3.12+
* SQLAlchemy
* Alembic
* Pydantic
* JWT Authentication

---

## Database

* PostgreSQL

---

## AI

* PyTorch
* TensorFlow (Optional)
* OpenCV
* NumPy
* Pillow
* Torchvision

---

## Deployment

* Docker
* Nginx
* Azure / AWS / Railway

---

# Project Structure

```
plant-disease-platform/

│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ai/
│   │   ├── uploads/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── Dockerfile
│
├── flutter_app/
│   ├── android/
│   ├── ios/
│   ├── linux/
│   ├── windows/
│   ├── macos/
│   ├── lib/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── models/
│   │   ├── services/
│   │   ├── providers/
│   │   └── main.dart
│   └── pubspec.yaml
│
├── ai_model/
│   ├── dataset/
│   ├── training/
│   ├── models/
│   ├── inference.py
│   └── train.py
│
├── docs/
│
└── README.md
```

---

# User Roles

## Farmer

* Register
* Login
* Upload plant images
* View diagnosis
* View treatment
* Save history

---

## Agricultural Expert

* Verify diagnoses
* Provide recommendations
* Answer farmer questions
* Publish disease articles

---

## Administrator

* Manage users
* Manage crops
* Manage diseases
* View reports
* Manage AI model

---

# AI Workflow

```
Upload Image
      │
      ▼
Image Validation
      │
      ▼
Image Preprocessing
      │
      ▼
Deep Learning Model
      │
      ▼
Disease Prediction
      │
      ▼
Confidence Score
      │
      ▼
Treatment Recommendation
      │
      ▼
Store Result
```

---

# Database Tables

### Users

* id
* full_name
* email
* password
* role
* created_at

---

### Crops

* id
* crop_name
* scientific_name

---

### Diseases

* id
* disease_name
* crop_id
* symptoms
* treatment
* prevention

---

### Predictions

* id
* user_id
* disease_id
* confidence
* image_path
* prediction_date

---

### Articles

* id
* title
* description
* author
* created_at

---

# AI Model

### Recommended Models

* EfficientNet-B0 ⭐
* MobileNetV3 ⭐⭐⭐
* ResNet50
* Vision Transformer (ViT)
* ConvNeXt

---

# Dataset

Recommended datasets:

* PlantVillage Dataset
* PlantDoc Dataset
* Kaggle Plant Disease Dataset

Example classes:

```
Apple Scab

Apple Black Rot

Corn Rust

Tomato Early Blight

Tomato Late Blight

Tomato Mosaic Virus

Tomato Leaf Mold

Potato Early Blight

Potato Late Blight

Pepper Bacterial Spot

Healthy Leaves
```

---

# REST API

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

---

## Prediction

```
POST /api/predict

GET /api/history

GET /api/history/{id}
```

---

## Diseases

```
GET /api/diseases

GET /api/diseases/{id}
```

---

## Articles

```
GET /api/articles

POST /api/articles
```

---

## Admin

```
GET /api/admin/users

GET /api/admin/reports

POST /api/admin/diseases
```

---

# Flutter Screens

* Splash Screen
* Login
* Register
* Home
* Camera
* Gallery
* Prediction Result
* Disease Details
* History
* Favorites
* Notifications
* Profile
* Settings
* About

---

# Future Enhancements

* Real-time camera detection
* Offline AI inference
* Weather-based disease risk prediction
* Fertilizer recommendations
* Pest detection
* Voice assistant
* Chatbot for plant care
* IoT sensor integration
* Satellite-based crop monitoring

---

# Security

* JWT Authentication
* Password hashing (bcrypt)
* HTTPS
* Input validation
* Rate limiting
* Secure file uploads
* Role-based authorization

---

# Testing

* Unit Testing
* Integration Testing
* API Testing
* Flutter Widget Testing
* Model Accuracy Evaluation

---

# Performance Metrics

* Accuracy
* Precision
* Recall
* F1-score
* Inference time
* API response time

---

# Installation

## Backend

```bash
git clone https://github.com/your-username/plant-disease-platform.git

cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

## Flutter

```bash
cd flutter_app

flutter pub get

flutter run
```

---

# Expected Outcomes

* Accurate plant disease identification using AI.
* Fast diagnosis through mobile and desktop applications.
* Actionable treatment and prevention recommendations.
* Centralized history of plant health records.
* Improved decision-making for farmers and agricultural experts.
* Reduced crop losses and enhanced agricultural productivity.

---

# License

This project is licensed under the **MIT License**.

---

---

<div align="center">

### 🌿 EcoVision

**Building Smarter Agriculture Through Artificial Intelligence**

Made with ❤️ using Flutter • FastAPI • PyTorch

⭐ If you like this project, don't forget to star the repository!

</div>

## Authors

**Developed by:** Dulaj Ashen,Minhaj ali,tharaka,rinushan
**University:** Faculty of Engineering, University of Peradeniya
**Project Type:** Final Year Software Engineering / Computer Engineering Project
**Technology Stack:** Flutter • FastAPI • PostgreSQL • PyTorch • OpenCV • Docker

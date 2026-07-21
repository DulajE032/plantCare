# 🌿 PlantCare — Complete Task List

## Phase 1: Fix Critical Issues & Seed Data
> **Priority: 🔴 Must Do First | Effort: 1–2 days**

- [ ] **1.1 Seed the diseases database**
  - [ ] Run `python -m app.seed_diseases` to populate all 26 disease records
  - [ ] Verify with `GET /diseases` returns 26 entries

- [ ] **1.2 Remove dead code files**
  - [ ] Delete `backend/app/services/disease_data.py`
  - [ ] Delete `backend/app/services/history_store.py`
  - [ ] Delete `backend/ai_model/inference.py`
  - [ ] Delete `backend/app/data/diseases.json` (if empty/unused)

- [ ] **1.3 Run model evaluation & document accuracy**
  - [ ] Run `python evaluate.py > evaluation_report.txt` in `ai_model/`
  - [ ] Record overall accuracy
  - [ ] Identify weakest classes (lowest F1-score)
  - [ ] Save the classification report in the repo

- [ ] **1.4 Verify end-to-end predict flow**
  - [ ] Test `/predict` with a diseased leaf image → correct diagnosis
  - [ ] Test `/predict` with a healthy leaf image → healthy response
  - [ ] Test with invalid file type (PDF) → proper 400 error
  - [ ] Test with oversized file (>10MB) → proper 400 error

---

## Phase 2: Improve Disease Library Content
> **Priority: 🟠 High | Effort: 3–5 days**

- [ ] **2.1 Write detailed disease info for ALL 26 diseases**
  - [ ] Apple Black Rot — real description, causes, treatments, prevention
  - [ ] Apple Cedar Apple Rust
  - [ ] Cherry Powdery Mildew
  - [ ] Corn Cercospora Leaf Spot (Gray Leaf Spot)
  - [ ] Corn Northern Leaf Blight
  - [ ] Grape Esca (Black Measles)
  - [ ] Grape Leaf Blight (Isariopsis)
  - [ ] Orange Huanglongbing (Citrus Greening)
  - [ ] Peach Bacterial Spot
  - [ ] Pepper Bell Bacterial Spot
  - [ ] Potato Late Blight
  - [ ] Squash Powdery Mildew
  - [ ] Strawberry Leaf Scorch
  - [ ] Tomato Bacterial Spot
  - [ ] Tomato Early Blight
  - [ ] Tomato Leaf Mold
  - [ ] Tomato Septoria Leaf Spot
  - [ ] Tomato Spider Mites
  - [ ] Tomato Target Spot
  - [ ] Tomato Yellow Leaf Curl Virus
  - [ ] Tomato Mosaic Virus
  - [ ] Re-run `python -m app.seed_diseases` after updating `DISEASE_DETAILS`

- [ ] **2.2 Add disease reference images**
  - [ ] Add `imageUrl` column to `Disease` DB model
  - [ ] Create `backend/media/diseases/` folder
  - [ ] Add 1 reference image per disease (26 images)
  - [ ] Update seed script to include image URLs
  - [ ] Update frontend `DiseaseCard` component to display images

- [ ] **2.3 Add scientific/botanical metadata**
  - [ ] Add `scientificName` column to Disease model (pathogen name)
  - [ ] Add `affectedParts` column (leaves, fruit, stems, roots)
  - [ ] Add `spreadMethod` column (wind, water, soil, insects)
  - [ ] Update seed data with scientific info for each disease
  - [ ] Update frontend disease detail page to show new fields

---

## Phase 3: Expand Model — New Crops & Diseases
> **Priority: 🟠 High | Effort: 1–3 weeks**

- [ ] **3.1 Collect new crop datasets**
  - [ ] Download Rice disease dataset (Blast, Brown Spot, Leaf Smut, Bacterial Blight, Healthy)
  - [ ] Download Wheat disease dataset (Stripe Rust, Leaf Rust, Stem Rust, Septoria, Healthy)
  - [ ] Download Mango disease dataset (Anthracnose, Powdery Mildew, Bacterial Canker, Healthy)
  - [ ] Download Banana disease dataset (Black Sigatoka, Panama Disease, Healthy)
  - [ ] Download Citrus disease dataset (Canker, Black Spot, Melanose, Healthy)
  - [ ] *(Optional)* Download Cotton disease dataset
  - [ ] *(Optional)* Download Tea disease dataset
  - [ ] *(Optional)* Download Coffee disease dataset

- [ ] **3.2 Organize dataset into folder structure**
  - [ ] Place new classes in `ai_model/datasset/train/<Class_Name>/`
  - [ ] Place validation images in `ai_model/datasset/valid/<Class_Name>/`
  - [ ] Ensure minimum 500 training images per class
  - [ ] Ensure minimum 100 validation images per class
  - [ ] Verify consistent naming: `CropName___Disease_Name` format

- [ ] **3.3 Improve training script**
  - [ ] Add learning rate scheduler (CosineAnnealingLR)
  - [ ] Add early stopping (patience=5)
  - [ ] Add more augmentations (RandomRotation, GaussianBlur, RandomAffine)
  - [ ] Add class weighting for imbalanced datasets
  - [ ] Add training loss/accuracy curve plotting
  - [ ] Add confusion matrix generation and saving
  - [ ] Increase epochs to 25–30

- [ ] **3.4 Retrain the model**
  - [ ] Run training: `python train.py`
  - [ ] Verify new `class_names.json` includes all new classes
  - [ ] Verify `best_model.pth` is updated
  - [ ] Run evaluation: `python evaluate.py`
  - [ ] Record and compare accuracy (before vs. after)

- [ ] **3.5 Update backend after retraining**
  - [ ] Write `DISEASE_DETAILS` entries for all new diseases
  - [ ] Re-run `python -m app.seed_diseases`
  - [ ] Add reference images for new diseases
  - [ ] Test `/predict` with images of each new class

---

## Phase 4: Model Quality & Robustness
> **Priority: 🟡 Medium | Effort: 1–2 weeks**

- [ ] **4.1 Add confidence threshold handling**
  - [ ] In `predict.py`: if confidence < 60%, add warning in response
  - [ ] Frontend: show "Low confidence — retake photo" alert
  - [ ] Decide minimum confidence to display a result (e.g., 40%)

- [ ] **4.2 Add top-3 predictions**
  - [ ] Update `classifier.py` to return top 3 classes with probabilities
  - [ ] Update `predict.py` response schema to include alternatives
  - [ ] Update frontend result page to show "Other possibilities" section

- [ ] **4.3 Test with real-world images**
  - [ ] Test with phone camera photos (various devices)
  - [ ] Test with complex backgrounds (not plain lab photos)
  - [ ] Test with poor lighting conditions
  - [ ] Test with multiple diseases on one leaf
  - [ ] Document failure cases and edge cases

- [ ] **4.4 Benchmark alternative models**
  - [ ] Train EfficientNet-B0 on same dataset
  - [ ] Train ResNet50 on same dataset
  - [ ] Compare accuracy, inference speed, model size
  - [ ] Select best model for production

- [ ] **4.5 Create model versioning system**
  - [ ] Save each model with version number: `model_v1.pth`, `model_v2.pth`
  - [ ] Track which dataset/classes each version was trained on
  - [ ] Make model path configurable via `.env`

---

## Phase 5: Backend Features (README Promises)
> **Priority: 🟡 Medium | Effort: 1–2 weeks**

- [ ] **5.1 User authentication (JWT)**
  - [ ] Create `User` database model (id, name, email, password_hash, role)
  - [ ] Create `POST /api/auth/register` endpoint
  - [ ] Create `POST /api/auth/login` endpoint (returns JWT)
  - [ ] Create `GET /api/auth/profile` endpoint (protected)
  - [ ] Add password hashing with bcrypt
  - [ ] Add JWT token middleware for protected routes
  - [ ] Link scan history to user accounts

- [ ] **5.2 Admin dashboard API**
  - [ ] Create `GET /api/admin/users` — list all users
  - [ ] Create `GET /api/admin/reports` — usage statistics
  - [ ] Create `POST /api/admin/diseases` — add/edit disease records
  - [ ] Create `DELETE /api/admin/diseases/{id}` — remove disease
  - [ ] Add role-based authorization (farmer vs. admin)

- [ ] **5.3 Articles/Knowledge base API**
  - [ ] Create `Article` database model (id, title, content, author, tags, created_at)
  - [ ] Create `GET /api/articles` — list articles
  - [ ] Create `GET /api/articles/{id}` — article detail
  - [ ] Create `POST /api/articles` — create article (admin/expert only)
  - [ ] Create `PUT /api/articles/{id}` — edit article
  - [ ] Create `DELETE /api/articles/{id}` — delete article

- [ ] **5.4 Set up Alembic migrations**
  - [ ] Initialize Alembic: `alembic init alembic`
  - [ ] Configure `alembic.ini` with database URL
  - [ ] Generate initial migration from existing models
  - [ ] Replace `Base.metadata.create_all` with `alembic upgrade head`

- [ ] **5.5 Write backend tests**
  - [ ] Create `tests/test_predict_endpoint.py` — test predict flow
  - [ ] Create `tests/test_predict_healthy.py` — test healthy plant prediction
  - [ ] Create `tests/test_diseases_endpoint.py` — test disease CRUD
  - [ ] Create `tests/test_history_endpoint.py` — test history endpoints
  - [ ] Create `tests/test_validation.py` — test file validation (type, size)
  - [ ] Create `tests/test_classifier.py` — test model loads and predicts
  - [ ] Run all tests: `pytest tests/ -v`

---

## Phase 6: Frontend Polish & Missing Pages
> **Priority: 🟡 Medium | Effort: 1 week**

- [ ] **6.1 Build missing pages**
  - [ ] Create `/login` page
  - [ ] Create `/register` page
  - [ ] Create `/profile` page
  - [ ] Create `/settings` page
  - [ ] Create `/admin` dashboard page
  - [ ] Create `/articles` listing page
  - [ ] Add navigation links for new pages

- [ ] **6.2 Improve error handling**
  - [ ] Add global error boundary component
  - [ ] Show user-friendly message when backend is unreachable
  - [ ] Add retry logic on API failures
  - [ ] Add offline detection and messaging

- [ ] **6.3 Improve scan UX**
  - [ ] Add camera capture option (not just file upload)
  - [ ] Add image compression before upload
  - [ ] Add upload progress indicator
  - [ ] Support drag-and-drop from clipboard (Ctrl+V)

- [ ] **6.4 Remove mock data dependency**
  - [ ] Remove `mockDiseases` import from home page
  - [ ] Ensure home page works with real API data only
  - [ ] Add proper loading/fallback states

- [ ] **6.5 Frontend testing**
  - [ ] Set up testing framework (Jest + React Testing Library)
  - [ ] Write tests for key components
  - [ ] Write tests for API utility functions

---

## Phase 7: Deployment & DevOps
> **Priority: 🟢 Lower | Effort: 3–5 days**

- [ ] **7.1 Fix Docker Compose**
  - [ ] Fix DB password mismatch (`password` vs `dulaj16376`)
  - [ ] Change backend DB host from `localhost` to `db` (Docker service name)
  - [ ] Add health checks for all services
  - [ ] Add volume mount for model file
  - [ ] Test full stack with `docker-compose up`

- [ ] **7.2 Create proper Dockerfiles**
  - [ ] Backend Dockerfile — multi-stage build, copy model file
  - [ ] Frontend Dockerfile — build Next.js and serve
  - [ ] Optimize image sizes

- [ ] **7.3 Set up CI/CD pipeline**
  - [ ] Create `.github/workflows/test.yml` — run pytest on push
  - [ ] Create `.github/workflows/lint.yml` — run linting
  - [ ] *(Optional)* Add auto-deploy to cloud on push to main

- [ ] **7.4 Production hardening**
  - [ ] Add rate limiting to API endpoints
  - [ ] Add request size limits
  - [ ] Add HTTPS configuration
  - [ ] Add structured logging
  - [ ] Add health check endpoint (`GET /health`)
  - [ ] Set up monitoring/alerting

---

## Quick-Start: What to Do Right Now

```bash
# Step 1: Seed the database (fixes /predict 500 error)
cd d:\clone\pyqt\PlantCare\backend
python -m app.seed_diseases

# Step 2: Delete dead code files
del app\services\disease_data.py
del app\services\history_store.py
del ai_model\inference.py

# Step 3: Run evaluation to know your model accuracy
cd ai_model
python evaluate.py

# Step 4: Test predict endpoint
# Start server: uvicorn app.main:app --reload
# Upload a leaf image via the frontend or curl
```

'use client';

const LeafDoodle = () => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M100 180 C60 160 20 120 30 70 C40 20 90 10 120 40 C150 70 160 130 100 180Z" stroke="#2d5a3d" strokeWidth="2" fill="#b8d4c0" fillOpacity="0.3"/>
    <path d="M100 180 C100 140 95 100 90 60" stroke="#2d5a3d" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M90 100 C75 90 65 75 70 60" stroke="#2d5a3d" strokeWidth="1.5"/>
    <path d="M95 130 C80 120 72 105 78 90" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const VineDoodle = () => (
  <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }} fill="none">
    <path d="M0 50 C50 20 100 80 150 50 C200 20 250 80 300 50" stroke="#4a7c5e" strokeWidth="2"/>
    <circle cx="75" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="150" cy="50" r="6" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
    <circle cx="225" cy="35" r="8" fill="#b8d4c0" stroke="#2d5a3d" strokeWidth="1.5"/>
  </svg>
);

const sections = [
  {
    icon: '',
    title: 'Project Overview',
    color: '#16a34a',
    content: `PlantGuard AI is a full-stack web application that uses deep learning to detect plant diseases from leaf images. Built as a university project for the Web Engineering & AI course at Air University Islamabad, it demonstrates a complete end-to-end AI pipeline — from data collection and model training, to a secure backend API and a modern frontend interface.

The system can classify a plant leaf image into one of 38 disease categories across multiple crop types including tomatoes, potatoes, grapes, corn, apples, strawberries and more. Users register, log in securely, and then upload plant images to receive instant AI-powered diagnoses with confidence scores.`,
  },
  {
    icon: '',
    title: 'Dataset -  How We Got the Data',
    color: '#2d5a3d',
    content: `We used the PlantVillage Dataset, one of the most widely used open-source datasets for plant disease classification. It was obtained from Kaggle using the kagglehub Python library.

The dataset contains over 87,000 high-resolution images of plant leaves — both healthy and diseased — organized into 38 classes. Each class represents a specific plant-disease combination, for example "Tomato Early Blight", "Grape Black Rot", or "Potato Late Blight".

The raw dataset structure was defined and validated using Pydantic models on the backend, ensuring data integrity before feeding into the training pipeline. Images were split into training and validation sets before preprocessing.`,
  },
  {
    icon: '',
    title: 'Data Cleaning & Preprocessing',
    color: '#4a7c5e',
    content: `Before training, the dataset underwent several cleaning and preprocessing steps implemented in preprocess.py:

• Duplicate removal — identical or near-identical images were filtered out
• Image validation — corrupt or unreadable files were excluded from the dataset
• Normalization — pixel values were normalized using ImageNet mean [0.485, 0.456, 0.406] and std [0.229, 0.224, 0.225]
• Resizing — all images were resized to 224×224 pixels to match MobileNetV2's expected input dimensions
• Augmentation — random horizontal flips, rotations, and color jitter were applied during training to improve generalization

These transformations were applied using PyTorch's torchvision.transforms pipeline and are also used at inference time (without augmentation) in the predict.py script.`,
  },
  {
    icon: '',
    title: 'Feature Engineering',
    color: '#1a3a2a',
    content: `Feature engineering for image classification differs from tabular data — the features are extracted automatically by the neural network. However, we implemented several key engineering decisions:

• Transfer Learning — instead of training from scratch, we used MobileNetV2 pre-trained on ImageNet as our base model. This gives the model a strong visual feature extractor out of the box.

• Custom Classifier Head — the final classification layer of MobileNetV2 was replaced with a new Linear layer outputting 38 units (one per disease class), allowing the model to learn disease-specific patterns on top of general visual features.

• Class Index Mapping — a classes.json file was generated mapping integer indices to human-readable class names like "Tomato___Early_blight", making predictions interpretable.

• Softmax Output — the final layer uses Softmax activation to convert raw logits into probability scores, giving us confidence percentages for each prediction.`,
  },
  {
    icon: '',
    title: 'AI Model - MobileNetV2',
    color: '#16a34a',
    content: `We chose MobileNetV2 as our deep learning architecture for several reasons:

Architecture: MobileNetV2 is a lightweight convolutional neural network designed for mobile and embedded vision applications. It uses depthwise separable convolutions and inverted residuals with linear bottlenecks, making it highly efficient while maintaining strong accuracy.

Why MobileNetV2: It offers an excellent accuracy-to-speed ratio. For a web application requiring real-time inference, a model that responds in milliseconds is critical. MobileNetV2 achieves this without sacrificing meaningful accuracy.

Training Setup:
• Framework: PyTorch with torchvision
• Optimizer: Adam
• Loss Function: Cross Entropy Loss
• Input Size: 224×224 RGB images
• Device: CUDA GPU (falls back to CPU)
• Pre-trained weights: ImageNet (weights=None at inference, loaded from checkpoint)

The model was trained for 1 epoch on the full PlantVillage training set, achieving 94.14% validation accuracy — remarkably high for a single epoch, demonstrating the power of transfer learning.

The trained model is saved as best_model.pth and loaded into FastAPI at server startup for zero-latency inference.`,
  },
  {
    icon: '',
    title: 'Model Performance Metrics',
    color: '#7aab8a',
    content: `After training, the model was evaluated on the validation set and the following metrics were computed and saved to history.json in the backend/models/ directory:

• Validation Accuracy: 94.14% — percentage of correctly classified images
• Validation Precision: 93.02% — of all positive predictions, how many were actually correct
• Validation Recall: 92.73% — of all actual positives, how many did we correctly identify
• Validation F1 Score: 92.37% — harmonic mean of precision and recall
• Validation Loss: 0.2021 — cross entropy loss on the validation set
• Training Accuracy: 87.51%
• Training Loss: 0.4990

These metrics are exposed via a dedicated /api/history Next.js API route and visualized on the Model Performance page using radial progress charts and horizontal bar comparisons.`,
  },
  {
    icon: '',
    title: 'Backend — FastAPI',
    color: '#2d5a3d',
    content: `The backend is built with FastAPI, a modern high-performance Python web framework. It serves two purposes: acting as a secure authentication gateway and an AI inference engine.

API Endpoints:
• GET / — Health check confirming the server is running
• POST /register - Accepts username, email, password. Hashes password with Argon2 and stores user in MongoDB
• POST /token - OAuth2 password flow. Validates credentials and returns a signed JWT access token
• POST /predict - Accepts a multipart image upload. Requires JWT authentication. Runs inference and returns top-3 predictions with confidence scores

Security Implementation:
• Passwords are hashed using Argon2 (via passlib) - a modern, memory-hard hashing algorithm
• JWT tokens are signed using HS256 algorithm with a secret key and expire after 60 minutes
• The /predict endpoint uses FastAPI's Depends() dependency injection to verify the JWT on every request - unauthenticated requests are automatically rejected with 401 Unauthorized

Model Loading:
• The MobileNetV2 model is loaded globally during FastAPI startup using the @app.on_event("startup") hook
• This means the model is loaded once into memory and reused for every prediction request - ensuring low-latency inference without reloading the model on each call

CORS:
• Cross-Origin Resource Sharing is configured to allow requests from the Next.js frontend running on localhost:3000`,
  },
  {
    icon: '',
    title: 'Database - MongoDB',
    color: '#1a3a2a',
    content: `MongoDB was chosen as the database for its flexibility with document-based storage - ideal for storing user profiles and future prediction logs without a rigid schema.

Connection: The backend connects to a local MongoDB instance running on mongodb://localhost:27017 using the PyMongo driver.

Database: plantguard
Collection: users

Each user document stores:
• username 
• email 
• password 
• created_at 

MongoDB's flexible document model means we can easily extend user documents in the future to store prediction history, saved diagnoses, or user preferences without schema migrations.

The database runs locally during development using mongod with a custom --dbpath pointing to C:/data/db on Windows.`,
  },
  {
    icon: '',
    title: 'Frontend - Next.js',
    color: '#4a7c5e',
    content: `The frontend is built with Next.js 15 using the App Router architecture. It implements different rendering strategies as required:

Static Generation (SSG/SSR):
• The landing page (/) is a static page - pre-rendered at build time for fast loading
• The About page and Team page are also statically rendered since they contain no dynamic data

Client-Side Rendering (CSR):
• The Dashboard (/dashboard) is fully client-side - it handles dynamic image uploads, real-time inference calls, and JWT token management using React hooks (useState, useEffect)
• The Metrics page fetches training history dynamically from the Next.js API route

Authentication Flow:
• On login, the JWT token received from FastAPI is stored in localStorage
• Every protected page checks for the token on mount - if missing, redirects to /login
• The token is attached as a Bearer header on every prediction API call

Pages Built:
• / - Landing page with hero slider, features, how-it-works section
• /login -  Login form connecting to POST /token
• /register -  Registration form connecting to POST /register
• /dashboard - AI workspace with drag-and-drop image upload and prediction results
• /metrics -  Model performance visualization with radial charts
• /about - Full project documentation
• /team -  Team member profiles

Styling: Pure inline styles with CSS animations - no external CSS framework dependencies, ensuring full control over the nature-themed botanical design.`,
  },
  {
    icon: '',
    title: 'How It All Connects',
    color: '#16a34a',
    content: `Here is the complete data flow from user action to prediction result:

1. User visits the landing page → static HTML served instantly by Next.js
2. User clicks Register → form submits to POST http://localhost:8000/register → FastAPI hashes password with Argon2 → stores user document in MongoDB → returns success
3. User logs in → POST /token with username & password → FastAPI validates against MongoDB → signs a JWT → frontend stores JWT in localStorage
4. User opens Dashboard → useEffect checks localStorage for token → if missing, redirects to /login
5. User uploads plant image → frontend sends multipart/form-data to POST /predict with Authorization: Bearer <token> header
6. FastAPI verifies JWT via Depends(get_current_user) → loads pre-trained MobileNetV2 from memory → runs inference → returns top-3 predictions with confidence scores
7. Frontend displays results — disease name, confidence bar, color-coded severity
8. Metrics page fetches /api/history (Next.js API route) → reads history.json from backend/models/ → visualizes accuracy, precision, recall, F1 as radial charts

Tech Stack Summary:
• Frontend: Next.js 15, React, TypeScript, Tailwind CSS
• Backend: FastAPI, Python, Uvicorn
• AI: PyTorch, MobileNetV2, torchvision
• Database: MongoDB, PyMongo
• Auth: JWT, OAuth2, Argon2 (passlib)
• Dataset: PlantVillage (Kaggle)`,
  },
];

export default function About() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .float-leaf { animation: floatY 6s ease-in-out infinite; }
        .section-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .section-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,58,42,0.1); }
      `}</style>

      <main style={{ backgroundColor: '#faf6f0', minHeight: '100vh' }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: '#1a3a2a', borderBottom: '2px solid #2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px' }}><LeafDoodle /></div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#faf6f0' }}>PlantGuard AI</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
            <a href="/" style={{ color: '#b8d4c0', textDecoration: 'none' }}>Home</a>
            <a href="/team" style={{ color: '#b8d4c0', textDecoration: 'none' }}>Team</a>
            <a href="/metrics" style={{ color: '#b8d4c0', textDecoration: 'none' }}>Metrics</a>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ backgroundColor: '#1a3a2a', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="float-leaf" style={{ position: 'absolute', top: '1rem', left: '2rem', width: '100px', height: '100px', opacity: 0.15 }}><LeafDoodle /></div>
          <div className="float-leaf" style={{ position: 'absolute', top: '1rem', right: '2rem', width: '100px', height: '100px', opacity: 0.15, transform: 'scaleX(-1)' }}><LeafDoodle /></div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: '999px', backgroundColor: '#2d5a3d', color: '#b8d4c0', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
               Project Documentation
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#faf6f0', marginBottom: '1rem' }}>About PlantGuard AI</h1>
            <p style={{ color: '#b8d4c0', fontSize: '1.1rem', lineHeight: 1.7 }}>
              A complete end-to-end AI web application for plant disease detection.
            </p>
          </div>
          <div style={{ width: '100%', height: '40px', marginTop: '2rem' }}><VineDoodle /></div>
        </section>

        {/* Quick stats */}
        <section style={{ backgroundColor: '#e8f0e4', padding: '2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              ['🌿', '38', 'Disease Classes'],
              ['🤖', 'MobileNetV2', 'Architecture'],
              ['📊', '94.14%', 'Val Accuracy'],
              ['🗄️', 'MongoDB', 'Database'],
              ['⚡', 'FastAPI', 'Backend'],
              ['🌐', 'Next.js 15', 'Frontend'],
            ].map(([icon, val, lbl], i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', textAlign: 'center', border: '2px solid #b8d4c0' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3a2a', marginBottom: '0.1rem' }}>{val}</p>
                <p style={{ fontSize: '0.75rem', color: '#7aab8a' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Content sections */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {sections.map((section, i) => (
              <div key={i} className="section-card" style={{ backgroundColor: 'white', borderRadius: '1.5rem', border: '2px solid #b8d4c0', overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{ backgroundColor: section.color, padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#faf6f0', margin: 0 }}>{section.title}</h2>
                </div>
                {/* Section content */}
                <div style={{ padding: '2rem' }}>
                  {section.content.split('\n\n').map((para, j) => (
                    <div key={j} style={{ marginBottom: '1rem' }}>
                      {para.startsWith('•') || para.includes('\n•') ? (
                        <div>
                          {para.split('\n').map((line, k) => (
                            line.startsWith('•') ? (
                              <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                                <span style={{ color: section.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                                <span style={{ fontSize: '0.95rem', color: '#1a3a2a', lineHeight: 1.6 }}>{line.slice(1).trim()}</span>
                              </div>
                            ) : (
                              <p key={k} style={{ fontSize: '0.95rem', color: '#1a3a2a', lineHeight: 1.7, marginBottom: '0.5rem', fontWeight: line.endsWith(':') ? 600 : 400 }}>{line}</p>
                            )
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.95rem', color: '#1a3a2a', lineHeight: 1.7, margin: 0 }}>{para}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section style={{ backgroundColor: '#1a3a2a', padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#faf6f0', marginBottom: '1rem' }}>Ready to Try It?</h2>
          <p style={{ color: '#b8d4c0', marginBottom: '1.5rem' }}>Upload a plant image and get an instant AI diagnosis.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" style={{ backgroundColor: '#7aab8a', color: '#1a3a2a', padding: '12px 28px', borderRadius: '999px', fontWeight: 700, textDecoration: 'none' }}>Get Started 🌱</a>
            <a href="/team" style={{ border: '2px solid #7aab8a', color: '#7aab8a', padding: '12px 28px', borderRadius: '999px', fontWeight: 700, textDecoration: 'none' }}>Meet the Team </a>
          </div>
        </section>

      </main>
    </>
  );
}
# FixIt – The Ultimate Professional Service Marketplace

FixIt is a highly responsive, modern full-stack marketplace strictly architected to bridge the gap between people needing things fixed and verified home service experts. Featuring sophisticated cloud integrations, an AI-powered matching bot, robust websockets, and self-managed account sovereign features, FixIt serves as a production-ready template for a cutting-edge gig economy platform.

## 🚀 Key Features

*   **⚡ Real-Time Booking Sync**: The core of the platform is a Socket.io bridge that dynamically pulls booking modifications (Pending, Accepted, Completed) simultaneously to both the professional's and the customer's dashboard without page reloading. 
*   **☁️ Cloudinary Image Infrastructure**: Fully severing ties with local disk storage, expert profile images are structurally beamed directly to Cloudinary CDN, ensuring maximum speed and security.
*   **🗑️ Account Sovereignty & Cascading Erasure**: Users have absolute control over their data footprint. A comprehensive CRUD interface allows instant profile updates. Furthermore, the "Delete Account" algorithm triggers a database cascade—destroying the primary account, the WorkerProfile, finding and nuking the physical Cloudinary image, and deleting all associated messages and bookings securely.
*   **💬 Secure Real-Time Matrix**: A unified Message Box chat system utilizing Socket rooms mapped strictly to Booking IDs, ensuring completely private client/expert liaison channels. Powered by a MongoDB TTL integration, all chats automatically evaporate after 10 days for absolute privacy.
*   **🤖 AI Matchmaker**: Integrated Mistral-7B AI logic capable of contextualizing a customer's problem in natural language to systematically recommend the optimal local workers based on skills and ratings. 
*   **📱 Precision Responsiveness**: Zero reliance on Tailwind! The UI/UX relies exclusively on an extensively built, premium Custom CSS architecture fully equipped with fluid variables, grid alignments, micro-interactions, and media-queries to ensure flawlessly stunning operation across all mobile and desktop browsers.

## 🛠️ Technology Stack

### Frontend Architecture
*   **Ecosystem**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) Build Tool
*   **Design Framework**: Custom CSS Native Architecture (No generic Tailwind)
*   **Real-time Protocol**: Socket.io-client
*   **HTTP Transporter**: Axios
*   **Routing**: React Router DOM

### Backend Infrastructure
*   **Runtime Engine**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose mapping
*   **Object Storage**: Cloudinary v2 SDK + multer-storage-cloudinary
*   **Security protocols**: JWT Auth Bearer Tokens & BcryptJS Cryptography
*   **Sockets**: Socket.io Stateful Connections
*   **AI Pipeline**: HuggingFace Serverless Inference (Mistral-7B)

## 📦 File Architecture

```text
fix_it/
├── backend/            # Express runtime backbone
│   ├── middleware/     # JWT Protection wrappers
│   ├── models/         # Mongoose strictly typed Schemas (User, WorkerProfile, Booking, Message)
│   ├── routes/         # Stateful API matrices
│   └── server.js       # Core bootstrap & Socket listener config
├── frontend/           # Vite React App
│   ├── src/
│   │   ├── components/ # Granular UI Blocks (Chat.jsx, Navigations)
│   │   ├── context/    # Global Data Lakes (AuthContext, SocketContext)
│   │   ├── pages/      # Master Screen Architectures (Home, Dashboard, WorkerProfile)
│   │   ├── index.css   # Central Nervous System of all App Styling Constraints
│   │   └── App.jsx     # Route Integrations
└── README.md           # Global Index
```

## ⚙️ Deployment Instructions

### 1. Database & Cloud Matrix Setup
- A running MongoDB Atlas URI string.
- A free HuggingFace API key (to enable the AI model).
- A free Cloudinary Access Node (`Cloud Name`, `API Key`, `API Secret`).

### 2. Backend Initialization
1.  Navigate into the backend core container:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Hydrate `.env` variables immediately:
    ```env
    PORT=5000
    MONGODB_URI=your_cluster_string
    JWT_SECRET=your_hyper_secure_key
    HF_API_TOKEN=your_huggingface_access
    FRONTEND_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=your_cloud_identity
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```
4.  Boot the application:
    ```bash
    npm run dev
    ```

### 3. Frontend Initialization
1.  Align into the client terminal:
    ```bash
    cd frontend
    ```
2.  Install module hierarchies:
    ```bash
    npm install
    ```
3.  Inject `.env`: 
    ```env
    VITE_BACKEND_URL=http://localhost:5000
    ```
4.  Deploy local instance:
    ```bash
    npm run dev
    ```

## 📜 Legal 
Licensed safely under the ISC License. Designed for rapid iteration and scalable gig-economy platform frameworks!

# Brokerless Realty — Deployment Guide & Project Structure

This project has been separated into two clean, self-contained directories: **`frontend/`** and **`backend/`**. This structure allows for independent hosting, local development, and scaled production deployments.

---

## 📁 Repository Structure

```
brokerless-main/
├── frontend/           # React + Vite client (deployed to brokerlessrealty.com)
│   ├── src/
│   ├── public/         # Contains sitemap.xml, robots.txt, and static client assets
│   ├── package.json
│   └── vite.config.ts
├── backend/            # Express + Node.js API (deployed to backend.brokerlessrealty.com)
│   ├── src/
│   ├── package.json
│   └── server.js
└── README.md           # This guide
```

---

## 🌐 Deployment Details

### 1. Frontend (`frontend/` ➡️ `brokerlessrealty.com`)
*   **Static Hosting Service**: Deploy to platforms like Vercel, Netlify, Hostinger, Cloudflare Pages, or AWS S3 + CloudFront.
*   **Root Directory for Build**: `/frontend` (if deploying from monorepo root) or build inside the directory.
*   **Build Command**: `npm run build`
*   **Publish/Output Directory**: `dist`
*   **Environment Variables**:
    *   `VITE_API_BASE_URL`: (Optional) Can override the default API base URL (defaults to `https://backend.brokerlessrealty.com`).

### 2. Backend (`backend/` ➡️ `backend.brokerlessrealty.com`)
*   **Node.js Server Hosting**: Deploy to platforms like Render, Heroku, DigitalOcean droplet, AWS EC2, or Hostinger VPS.
*   **Start Command**: `npm start`
*   **Port**: Configured dynamically in `.env` (defaults to `3001`).
*   **Environment Variables**:
    *   Create a `.env` file based on `backend/.env.example` containing:
        *   `PORT`: Port to listen on.
        *   `JWT_SECRET`: Secret key for session/login tokens.
        *   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database details (e.g. MySQL credentials).
        *   `RECEIVER_EMAIL`: Email address to receive tenant and contact inquiries.

---

## 🚀 Running Locally

### Step 1: Start the Backend API
1. Open a terminal and navigate to the backend:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up database credentials in a new `.env` file (you can copy `.env.example`).
4. Start the server:
    ```bash
    npm run dev
    ```

### Step 2: Start the Frontend Client
1. Open a new terminal and navigate to the frontend:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the dev server:
    ```bash
    npm run dev
    ```
4. Access the application in your browser at `http://localhost:5173`.

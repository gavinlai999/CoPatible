# CoPatible

CoPatible is a premium, AI-driven social platform designed to match users into meaningful "Circles" based on deep social intent, current emotional state, and life chapters. Built with a "Privacy First" and "Vibe Second" philosophy, it uses voice-to-vibe analysis to foster authentic connections.

---

## 🌟 Project Overview (v1.0 Completion)

Today, we transformed a conceptual scaffold into a feature-complete MVP. Key accomplishments include:

### **1. AI-Powered "Vibe" Pipeline**
*   **Voice Analytics:** Integrated **ElevenLabs** for high-accuracy transcription and **Groq (Llama 3)** for real-time emotional and social energy extraction.
*   **Matching Engine:** Developed a relational matching logic in **Supabase** that connects users to "Experiences" (Containers) based on AI-extracted social dimensions.

### **2. Mobile App (Expo Router)**
*   **Design System:** Built a custom premium theme from scratch—Warm Off-White backgrounds with Burnt Orange accents.
*   **Advanced UI:** 
    *   **Journey Home:** Dynamic blurred cards with personalized "Match Reasoning".
    *   **Multi-Step Check-In:** Interaction flow for capturing connection needs (Let Loose, Deep Conversation, etc.).
    *   **Circles:** High-fidelity group views showing confirmed guests, their shared vibes, and personal traits.
*   **Native Integration:** Real-time audio recording and binary processing for seamless voice check-ins.

### **3. Backend & Infrastructure**
*   **Express API:** Robust Node.js backend acting as the central nervous system for AI and database coordination.
*   **Supabase Database:** Full relational schema with security policies and rich demo seed data (Go-Karting, Founders Drinks, Jazz Nights).

---

## 🚀 Getting Started

### 1. Backend Setup (`apps/api`)
1.  **Environment:** Create a `.env` file:
    ```env
    SUPABASE_URL=your_url
    SUPABASE_ANON_KEY=your_key
    ELEVENLABS_API_KEY=your_key
    GROQ_API_KEY=your_key
    ```
2.  **Install & Run:**
    ```bash
    npm install
    npm run dev
    ```

### 2. Mobile & Web App (`apps/mobile`)
1.  **Environment:** Create a `.env` file (use your local IP for backend connection if testing on mobile, or localhost if on web):
    ```env
    EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:3000
    ```
2.  **Install:**
    ```bash
    npm install
    ```
3.  **Run for Mobile (iOS/Android):**
    ```bash
    npm run start
    ```
4.  **Run as a Web App:**
    ```bash
    npm run web
    ```
    *The Web app will be accessible at: `http://localhost:8081`*

### 3. Admin Dashboard (`apps/admin`)
1.  **Install & Start:**
    Navigate to the admin app and start the dev server:
    ```bash
    cd apps/admin
    npm install
    npm run dev
    ```
    *The Admin Dashboard will be accessible at: `http://localhost:8082`*

---

## 📱 Running the Demo

### **Option A: Local Wi-Fi (Fastest)**
Scan the QR code in the terminal with the **Expo Go** app while on the same Wi-Fi.

### **Option B: Web App**
Open your browser and navigate to `http://localhost:8081` to view the unified web interface. 

### **Option C: Tunnel Mode (Recommended for Remote Mobile)**
If you are on a restricted network, use the tunnel:
```bash
npx expo start --tunnel
```

---

## 📁 Repository Structure
- `apps/mobile`: Expo Router frontend application.
- `apps/api`: Express.js backend for AI processing.
- `supabase/`: SQL schema, migrations, and seed data.
- `brain/`: Documentation, task tracking, and implementation plans.

**CoPatible is now feature-complete and ready for demonstration.**

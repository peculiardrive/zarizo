# Local Launch Instructions – Zarizo Marketplace

Since the Vercel deployment was failing due to a package version conflict (`react-paystack` vs `React 19`), I've downgraded the project to **React 18** and **Next.js 15.1** (stable versions). 

Follow these steps to get it running on your machine:

### 1️⃣ Install Dependencies
Open your terminal in the project root (`c:\Users\pecul\OneDrive\Documents\Zarizo Marketplace\zarizo`) and run:

```powershell
npm install --legacy-peer-deps
```
> [!NOTE]
> The `--legacy-peer-deps` flag is required because `react-paystack` expects older peer dependencies, but it works perfectly fine with React 18.

---

### 2️⃣ Start Development Server
Once the installation finishes, start the app:

```powershell
npm run dev
```

---

### 3️⃣ View the App
Open your browser and go to:
[http://localhost:3000](http://localhost:3000)

---

### 🚀 Why choose this route?
1. **Instant Feedback**: You'll see the PWA icons and the updated profile page immediately.
2. **Stable Versions**: React 18 is the current standard for many payment libraries, ensuring no runtime crashes during checkout.
3. **PWA Testing**: You can test the "Add to Home Screen" feature directly in Chrome on your desktop.

**Once this is running, let me know, and I can help you test specific features or continue with the Vercel fix.**

# 🛒 Kirana Point — Local Grocery E-Commerce & PWA Platform

> **Your Neighbourhood Kirana Store, Now Online.**  
> High-performance Next.js 14 grocery platform with **₹0 gateway fees via Direct UPI**, **instant WhatsApp order alerts**, **precision GPS delivery pricing**, and **Open Food Facts auto-fill cataloging**.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Key Features

- **💳 Direct UPI Payments (100% Free)**:
  - Universal UPI Intent (`upi://pay`) + App-specific triggers for **Google Pay**, **PhonePe**, and **Paytm**.
  - Dynamic QR code generation for desktop shoppers.
  - Priority Admin Payment Verification queue with live reactive state updates.

- **💬 WhatsApp Order Drafter (`wa.me`)**:
  - Instant 1-click invoice notifications formatted with emoji summaries and order tracking links sent straight to the customer's WhatsApp.

- **📍 Precision Haversine Distance & Delivery Pricing**:
  - Distance computed automatically between store coordinates (**Khamgaon, Dist. Buldhana**) and customer map pin.
  - **Free delivery** for orders $\ge ₹2,000$ or store pickup; ₹5/km (min ₹20) for smaller orders.
  - Interactive Leaflet OpenStreetMap location picker with browser GPS auto-detect.

- **📦 Automated Cataloging via Open Food Facts**:
  - 1-click auto-fill for product descriptions, ingredients, nutrition tables, and barcodes.
  - Competitor price comparison widget (Kirana Point vs Blinkit, Zepto, BigBasket, and JioMart).

- **🔐 Smart Role-Based Authentication**:
  - **Guest-first browsing**: Customers can freely scroll and view products; interactive actions (e.g. Add to Cart / Checkout) smoothly prompt the Login / Registration Portal.
  - **Auto-detected roles**: Instant detection for Store Owner (`pratham@kiranapoint.com`) vs Customers.

---

## 🏪 Store & Owner Configuration

- **Store Owner**: **Pratham Tarde**
- **Address**: **Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303**
- **GPS Coordinates**: `20.6865° N, 76.5654° E`
- **Phone / WhatsApp**: `+91 8208232735`
- **UPI ID**: `8208232735@axl`
- **UPI Payee Name**: `Pratham Tarde (Kirana Point)`

---

## 🔑 Demo Credentials

| Role | Email / ID | Password | Target Page |
|---|---|---|---|
| **Store Owner (Admin)** | `pratham@kiranapoint.com` or `8208232735` | `admin123` | `/admin` (Admin Console) |
| **Customer** | `rahul.sharma@example.com` | `customer123` | `/` (Storefront) |

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Neilarmstrong-00/Kirana-Point.git
   cd Kirana-Point
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file (or copy from `.env.example`):
   ```env
   NEXT_PUBLIC_STORE_NAME="Kirana Point"
   NEXT_PUBLIC_STORE_OWNER="Pratham Tarde"
   NEXT_PUBLIC_STORE_UPI_ID="8208232735@axl"
   NEXT_PUBLIC_STORE_PHONE="918208232735"
   NEXT_PUBLIC_STORE_LAT=20.6865
   NEXT_PUBLIC_STORE_LNG=76.5654
   NEXT_PUBLIC_STORE_ADDRESS="Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303"
   NEXT_PUBLIC_DELIVERY_RATE_PER_KM=5
   NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=2000
   NEXT_PUBLIC_MIN_DELIVERY_CHARGE=20
   NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM=15
   ```

4. **Start the local server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Set the Environment Variables in Vercel project settings (from `.env.example`).
4. Click **Deploy**! 🚀

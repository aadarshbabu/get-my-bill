# 🇮🇳 Get-My-Bill

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active_Development-green.svg)
![Tech](https://img.shields.io/badge/stack-Next.js_14_|_Shadcn_UI-black.svg)

**Get-My-Bill** is an open-source, simplified business management suite designed specifically for Indian micro-businesses and individual service providers.

From **Gyms and Coaching Centers** to **Freelancers and Small Retailers**, Get-My-Bill aims to democratize access to digital compliance and marketing tools without the heavy subscription fees of enterprise software.

## 🚀 Key Features

### 🧾 Compliance & Billing

- **Single-Click E-Invoicing:** Seamlessly generate IRN (Invoice Reference Number) compliant invoices.
- **Integrated E-Way Bills:** Auto-generate E-Way bills directly while creating your e-invoices. No need to switch portals.
- **GST Invoicing:** Create standard B2B and B2C GST-compliant invoices with automatic tax calculations (IGST/CGST/SGST).
- **PDF Generation:** Download professional-looking invoices instantly.

### 📈 Business Management

- **Expense Tracking:** Keep a log of daily business expenses to calculate net profit.
- **Inventory Management:** (Coming Soon) Basic stock tracking for retail users.

### 📣 Marketing & Growth

- **WhatsApp & SMS Marketing:** Send promotional offers, payment reminders, or invoices directly to clients via integrated messaging tools.
- **Customer Database:** Manage your client list (Students, Members, Customers) in one place.

## 🎯 Target Audience

This software is optimized for:

- **Service Industry:** Gyms, Yoga Studios, Coaching/Tuition Centers.
- **Micro Retail:** Kirana stores, Boutiques.
- **Freelancers:** Consultants, Developers, Designers requiring GST bills.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context / Zustand (Proposed)
- **Database:** (To be decided - e.g., PostgreSQL/Supabase/Prisma)

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/get-my-bill.git](https://github.com/your-username/get-my-bill.git)
    cd get-my-bill
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Rename `.env.example` to `.env.local` and configure your keys (Database URL, GST API keys, etc.).

    ```bash
    cp .env.example .env.local
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We welcome contributions from the community! Since this is an Indian-centric open-source project, we specifically look for help with:

1.  **GST Logic:** Improving the accuracy of tax calculations.
2.  **API Integration:** Connecting with government GSP (GST Suvidha Provider) sandboxes.
3.  **UI/UX:** Creating accessible interfaces for non-tech-savvy business owners.

Please read `CONTRIBUTING.md` (coming soon) for details on our code of conduct, and the process for submitting pull requests.

## 🛣️ Roadmap

- [ ] **Phase 1:** Basic GST Invoice UI & PDF Generation.
- [ ] **Phase 2:** Database integration for saving customers/products.
- [ ] **Phase 3:** API Integration for E-Invoicing & E-Way Bills.
- [ ] **Phase 4:** WhatsApp integration (Twilio/Interakt/WATI).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for 🇮🇳 Business

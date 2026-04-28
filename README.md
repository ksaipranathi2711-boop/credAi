# CredAI — React Application

Production-grade React conversion of the CredAI single-file HTML project.

## Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Framework    | React 18 + Vite 5                         |
| Routing      | React Router v6                           |
| Styling      | Tailwind CSS 3 + custom `styles.css`      |
| Charts       | Chart.js 4 + react-chartjs-2             |
| Icons        | lucide-react                              |
| State        | Context API (Auth + Toast)                |
| HTTP         | fetch (api.js) with local fallback        |
| Build        | Vite + PostCSS + Autoprefixer             |

---

## Complete File Structure

```
credai/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
│
└── src/
    ├── main.jsx                       Entry point
    ├── App.jsx                        Root router + providers + layout
    ├── styles.css                     All custom CSS (glassmorphism, blobs, animations)
    │
    ├── components/
    │   ├── AnalyticsCharts.jsx        Doughnut + Bar charts (spending / income)
    │   ├── AssessmentForm.jsx         6-field form, live preview, calculation button
    │   ├── AuthModal.jsx              Controlled login/signup modal
    │   ├── Dashboard.jsx              Analytics dashboard with Line chart
    │   ├── Features.jsx               6-card features grid
    │   ├── Footer.jsx                 Full footer with newsletter, social links
    │   ├── Hero.jsx                   Hero with floating score/factor/loan cards
    │   ├── HowItWorks.jsx             4-step process, card tilt, animated stat counters
    │   ├── LogoSVG.jsx                Animated SVG logo (reusable with unique gradient IDs)
    │   ├── Navbar.jsx                 Fixed nav with auth state, active links
    │   ├── ScoreResult.jsx            Score ring, factors, loan panel, suggestions, charts
    │   └── Testimonials.jsx           3-card testimonial section
    │
    ├── context/
    │   ├── AuthContext.jsx            Global auth state: login, register, logout, history
    │   └── ToastContext.jsx           Global toast system with enter/exit animations
    │
    ├── hooks/
    │   ├── useCountUp.js              IntersectionObserver-triggered number animation
    │   ├── useCursorGlow.js           Custom cursor glow + trailing dot
    │   ├── useParticles.js            Canvas particle + connection line animation
    │   ├── useReveal.js               Scroll reveal (adds .visible to .reveal children)
    │   └── useScrollProgress.js       Scroll-based progress bar value
    │
    ├── pages/
    │   ├── DashboardPage.jsx          /dashboard route wrapper
    │   ├── HistoryPage.jsx            /history — score timeline, profile, CSV export
    │   ├── Home.jsx                   / — composes all sections
    │   └── NotFound.jsx               * — 404 fallback
    │
    └── utils/
        ├── api.js                     Backend API calls (login, register, predict, history)
        ├── creditScore.js             computeCreditScore() — modular, ML-ready engine
        └── storage.js                 localStorage fallback + session + CSV export
```

---

## Quick Start

```bash
# 1. Unzip and enter directory
unzip credai-react.zip && cd credai

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env

# 4. Start dev server
npm run dev
# → http://localhost:3000

# 5. Production build
npm run build
```

---

## Routes

| URL           | Component       | Description                                     |
|---------------|-----------------|-------------------------------------------------|
| `/`           | Home            | Hero → How It Works → Assessment → Features → Dashboard → Testimonials |
| `/dashboard`  | DashboardPage   | Full analytics view with live Chart.js charts   |
| `/history`    | HistoryPage     | Score timeline + profile (requires login)       |
| `*`           | NotFound        | 404 fallback                                    |

---

## Backend Integration

All API calls live in `src/utils/api.js`. Every function has a **local localStorage fallback** — the app runs fully offline without any backend.

### Expected Endpoints

```
POST   /api/auth/login            Body: { email, password }
                                  Returns: { name, token }

POST   /api/auth/register         Body: { name, email, password }
                                  Returns: { token }

POST   /api/predict               Body: { income, expenses, transactions,
                                         mobileUsage, paymentHistory, creditUtil,
                                         previousScore }
                                  Returns: ScoreResult (same shape as computeCreditScore)

POST   /api/history/:email        Body: assessment entry
GET    /api/history/:email        Returns: entry[]
DELETE /api/history/:email        Clears history
```

---

## ML / AI Integration

`src/utils/creditScore.js` exports `computeCreditScore(data)`.

The scoring pipeline is fully modular:

```js
// 1. Weights (swap for ML coefficients)
const WEIGHTS = { savings: 180, paymentHist: 150, ... }

// 2. Risk bands (adjust thresholds for your model)
const RISK_BANDS = [{ min: 750, band: 'EXCELLENT', ... }, ...]

// 3. Drop-in ML replacement: implement apiPredict() in api.js
//    The app uses API result if available, local engine as fallback.
```

---

## Key Design Decisions

- **No Redux** — AuthContext + ToastContext cover all global state cleanly
- **Offline-first** — every API call has a localStorage fallback; signup/login works with no backend
- **Graceful degradation** — API timeout is 3 seconds; local computation kicks in automatically
- **Chart.js registered once** — `ChartJS.register(...)` called at module level in each chart component to avoid duplicate registration errors
- **Unique SVG gradient IDs** — `LogoSVG` accepts an `id` prop to namespace gradient IDs, preventing SVG defs conflicts when logo appears in both Navbar and Footer

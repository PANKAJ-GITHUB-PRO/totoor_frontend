# Tudoor — Mobile & PWA (A to Z)

Yeh guide explain karti hai **kya setup hua hai**, **tum khud kaise chalao**, aur **logo kaise change / bhejo**.

---

## A. Kya kya setup hua? (Summary)

| Cheez | Kya hai | File / folder |
|-------|---------|----------------|
| **PWA** | Website ko phone pe app jaisa install karo (Chrome / Safari) | `vite.config.ts` → `vite-plugin-pwa` |
| **Web manifest** | App name, icons, colors — browser ko batata hai | Build ke baad `dist/manifest.webmanifest` |
| **Service worker** | Offline cache + auto-update on new deploy | Build ke baad `dist/sw.js` |
| **Install banner** | Chrome pe "Install" button, Safari pe "Add to Home Screen" help | `src/components/pwa/InstallPrompt.tsx` |
| **Capacitor** | Same web app ko native Android/iOS app mein wrap | `capacitor.config.ts`, `android/`, `ios/` |
| **PWA icons script** | Ek logo se saari icon sizes banata hai | `scripts/generate-pwa-icons.mjs` |
| **App ID** | Play Store / App Store package name | `com.tudoor.app` |

### Packages jo install hue

- `vite-plugin-pwa` — PWA manifest + service worker
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/app`, `@capacitor/splash-screen`, `@capacitor/status-bar`
- `@capacitor/android`, `@capacitor/ios` — native projects
- `sharp` — logo se icons resize (dev dependency)

### Scripts (`package.json`)

```bash
npm run icons          # logo.png se PWA icons banao
npm run build          # production web + PWA build → dist/
npm run build:mobile   # icons + build + cap sync (store release ke liye)
npm run cap:android    # Android Studio kholo
npm run cap:ios        # Xcode kholo (Mac)
npm run cap:sync       # dist/ ko android/ ios/ mein copy karo
```

---

## B. Logo — kaise use / change / bhejo

### Logo kahan rakha hai?

```
frontend/public/logo.png       ← MAIN SOURCE (yahi replace karo)
frontend/public/favicon.png    ← browser tab icon (optional, same ho sakta hai)
```

Script in files ko **automatic** banata hai:

| File | Size | Use |
|------|------|-----|
| `pwa-192.png` | 192×192 | PWA small icon |
| `pwa-512.png` | 512×512 | PWA large icon |
| `apple-touch-icon.png` | 180×180 | iPhone home screen |
| `maskable-icon-512.png` | 512×512 | Android adaptive icon (safe padding) |

### Logo requirements (best results)

- **Format:** PNG (transparent background best)
- **Size:** Kam se kam **1024×1024** px (square)
- **Design:** Center mein logo, corners khali (maskable icon ke liye)
- **Colors:** Tudoor brand — indigo/mint (#5B5FEF theme)

### Naya logo lagane ke steps

1. Apni nayi image ko save karo: `frontend/public/logo.png` (purani replace)
2. Optional: same file copy as `frontend/public/favicon.png`
3. Terminal:
   ```bash
   cd frontend
   npm run icons
   ```
4. Verify: `public/` folder mein `pwa-192.png`, `pwa-512.png`, etc. update ho gaye
5. Rebuild:
   ```bash
   npm run build:mobile
   ```

### Logo kisi ko kaise bheju (designer / cofounder)?

**Option 1 — File bhejo**
- WhatsApp / email / Drive pe `logo.png` (1024×1024 PNG) bhejo
- Unse bolo: square PNG, transparent bg, logo center mein

**Option 2 — GitHub / repo**
- Wo `frontend/public/logo.png` replace karein → PR bhejein

**Option 3 — Play Store / App Store assets alag**
Store listings ke liye extra chahiye (Capacitor assets tool se bana sakte ho):

```bash
cd frontend
npm install -D @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor "#0B1120" --iconBackgroundColorDark "#0B1120" --splashBackgroundColor "#0B1120" --logoSplashScale 0.3
```
(Pehle `assets/` folder mein `logo.png` ya `icon.png` rakho — docs: Capacitor Assets)

**Store screenshots** alag hain — wo app ke andar se phone screenshot leke Play Console / App Store Connect pe upload karte ho.

---

## C. PWA — Browser se install (Chrome / Safari)

### Kya hota hai?

User tumhari **website** kholta hai → **Install** / **Add to Home Screen** → home screen pe Tudoor icon → app jaisa full-screen khulta hai.

### Tumhe kya karna hai?

#### 1. Local test

```bash
cd frontend
npm run icons
npm run build
npm run preview
```

Browser mein `http://localhost:4173` kholo → Chrome mein address bar mein install icon dikhega.

> **Note:** Real phone pe PWA test ke liye **HTTPS** chahiye. Local pe sirf preview/emulator; live deploy pe proper test.

#### 2. Live deploy (Vercel / Netlify / apna server)

1. `frontend/.env.production` banao:
   ```
   VITE_API_URL=https://YOUR-BACKEND-DOMAIN.com/api
   ```
2. Build:
   ```bash
   npm run build
   ```
3. `dist/` folder deploy karo (Vercel: root `frontend`, build command `npm run build`, output `dist`)

#### 3. User install kaise karega?

| Browser | Steps |
|---------|--------|
| **Chrome (Android)** | Site kholo → bottom banner "Install" **ya** menu ⋮ → "Install app" |
| **Chrome (Desktop)** | Address bar mein install icon |
| **Safari (iPhone)** | Share ↑ → **Add to Home Screen** → Add |

App ke andar bottom banner bhi Safari / Chrome ko guide karta hai (`InstallPrompt` component).

---

## D. Capacitor — Play Store & App Store app

### Concept

```
React app (src/)  →  npm run build  →  dist/ (HTML/JS/CSS)
                                              ↓
                                    Capacitor wrap
                                              ↓
                         android/ folder  |  ios/ folder
                                              ↓
                              Google Play    |  App Store
```

Capacitor ek **WebView** mein tumhara `dist/` load karta hai — same code, native shell.

### Pehli baar (already done in repo)

```bash
cd frontend
npm install
npx cap add android
npx cap add ios
```

Agar clone fresh ho to ye dubara chalao.

### Har nayi release pe

```bash
cd frontend
# .env.production mein live API URL set karo
npm run build:mobile
```

Ye karta hai: icons → vite build → `cap sync` (dist copy to android/ios).

---

## E. Android — Google Play Store (step by step)

### Requirements

- [Android Studio](https://developer.android.com/studio) installed
- Google Play Developer account (**$25 one-time**)
- Backend **HTTPS** pe live

### Steps

1. **Build + sync**
   ```bash
   cd frontend
   npm run build:mobile
   ```

2. **Android Studio kholo**
   ```bash
   npm run cap:android
   ```

3. **Signing key** (pehli baar)
   - Build → Generate Signed Bundle / APK
   - Create new keystore → password save karo (kho gaya to update nahi kar paoge!)
   - Output: **AAB** (Android App Bundle)

4. **Play Console** — [play.google.com/console](https://play.google.com/console)
   - Create app → Name: **Tudoor**
   - Package name: **`com.tudoor.app`** (change mat karo baad mein)
   - Upload AAB
   - Store listing: short description, screenshots, feature graphic, privacy policy URL
   - Content rating questionnaire
   - Internal testing → phir Production

5. **Phone pe test (bina store)**
   ```bash
   npm run cap:run:android
   ```
   USB debugging on phone ya emulator.

---

## F. iOS — App Store (step by step)

### Requirements

- **Mac** computer
- **Xcode** (App Store se free)
- **Apple Developer Program** (**$99/year**)
- Backend **HTTPS**

### Steps

1. Mac pe:
   ```bash
   cd frontend
   npm run build:mobile
   npm run cap:ios
   ```

2. Xcode mein:
   - Team select karo (Apple Developer account)
   - Bundle ID: **`com.tudoor.app`**
   - Signing & Capabilities fix karo

3. **Icons** — `@capacitor/assets` se generate (section B) ya manually Assets.xcassets

4. **Archive**
   - Product → Archive
   - Distribute App → App Store Connect

5. **App Store Connect** — [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - New app → Tudoor
   - Screenshots, description, privacy policy
   - Submit for Review

> Windows pe sirf `ios/` folder bana sakte ho; **build/upload Mac pe hi** hota hai.

---

## G. Environment / API URL (bahut important)

Mobile app aur production PWA **localhost API use nahi kar sakte** (user ke phone pe localhost nahi chalega).

`frontend/.env.production`:

```env
VITE_API_URL=https://api.tudoor.com/api
```

Replace with tumhara real backend URL. Phir:

```bash
npm run build:mobile
```

Backend bhi production pe HTTPS + CORS allow kare tumhare frontend domain ke liye.

---

## H. File map — kya kahan hai

```
frontend/
├── public/
│   ├── logo.png              ← SOURCE LOGO (tum replace karte ho)
│   ├── favicon.png
│   ├── pwa-192.png           ← auto-generated
│   ├── pwa-512.png
│   ├── apple-touch-icon.png
│   └── maskable-icon-512.png
├── scripts/
│   └── generate-pwa-icons.mjs
├── src/
│   ├── components/pwa/InstallPrompt.tsx
│   └── main.tsx              ← PWA SW + Capacitor status bar
├── vite.config.ts            ← PWA plugin config
├── capacitor.config.ts       ← appId, appName, splash
├── index.html                ← Apple PWA meta tags
├── android/                  ← Google Play project
├── ios/                      ← App Store project
├── .env.production.example
└── MOBILE.md                 ← yeh file
```

---

## I. Common problems

| Problem | Fix |
|---------|-----|
| Install button nahi dikha | HTTPS deploy karo; localhost pe limited |
| Safari pe install | Share → Add to Home Screen (manual) |
| App mein API fail | `.env.production` mein sahi `VITE_API_URL` |
| Logo blur | Source logo 1024×1024+ use karo, phir `npm run icons` |
| Android build fail | Android Studio → Sync Gradle, JDK 17 |
| iOS build fail | Mac + Xcode + signing team |

---

## J. Quick checklist (release se pehle)

- [ ] `public/logo.png` final logo
- [ ] `npm run icons`
- [ ] `.env.production` → live `VITE_API_URL`
- [ ] Backend live + HTTPS + CORS
- [ ] `npm run build:mobile`
- [ ] Android: signed AAB test on real device
- [ ] iOS: TestFlight (optional) then App Store
- [ ] Play Store / App Store screenshots + privacy policy URL

---

## App identity (mat badalna store ke baad)

| Field | Value |
|-------|--------|
| App name | Tudoor |
| Bundle / Package ID | `com.tudoor.app` |
| Theme color | `#5B5FEF` |
| Splash background | `#0B1120` |

Change sirf `capacitor.config.ts` mein — **pehli store upload se pehle** final kar lo.

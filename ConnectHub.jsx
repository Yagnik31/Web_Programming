import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ============================================================
   THEME & GLOBAL STYLES
============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #080a0f;
      --bg-2: #0c0e14;
      --panel: #0f1118;
      --panel-2: #0a0c12;
      --border: rgba(255,255,255,0.07);
      --border-hover: rgba(255,255,255,0.14);
      --text: #c8cdd8;
      --text-bright: #edf0f7;
      --muted: #5a6275;
      --white: #ffffff;
      --aurora-1: #6366f1;
      --aurora-2: #8b5cf6;
      --aurora-3: #06b6d4;
      --aurora-4: #0ea5e9;
      --grad: linear-gradient(135deg, #6366f1, #06b6d4);
      --grad-text: linear-gradient(90deg, #a5b4fc, #67e8f9);
      --grad-warm: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
      --radius: 20px;
      --radius-sm: 12px;
      --radius-xs: 8px;
      --shadow-sm: 0 4px 20px rgba(0,0,0,0.3);
      --shadow-md: 0 12px 40px rgba(0,0,0,0.45);
      --shadow-lg: 0 24px 60px rgba(0,0,0,0.55);
      --shadow-glow: 0 0 40px rgba(99,102,241,0.15);
      --font-display: 'Syne', system-ui, sans-serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
      --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
    }

    html { scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.3) transparent; }
    html::-webkit-scrollbar { width: 5px; }
    html::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 999px; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: '';
      position: fixed;
      top: -30vh; left: 50%;
      transform: translateX(-50%);
      width: 80vw; height: 60vh;
      background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
    }

    a { color: inherit; text-decoration: none; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%,100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
    }
    @keyframes shimmer {
      from { background-position: -200% center; }
      to { background-position: 200% center; }
    }
    @keyframes loaderBar {
      to { width: 100%; }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(80px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .gradient-shimmer {
      background: linear-gradient(90deg, var(--aurora-1), var(--aurora-3), var(--aurora-1));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .glass {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      transition: var(--transition);
    }

    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--white); color: #0a0a0a;
      padding: 0.85rem 2rem; border-radius: 999px;
      font-family: var(--font-display); font-weight: 700;
      font-size: 0.9rem; letter-spacing: 0.02em;
      border: none; cursor: pointer;
      transition: var(--transition);
      position: relative; overflow: hidden;
      animation: fadeUp 0.7s 0.3s ease both;
    }
    .btn:hover { color: #fff; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(99,102,241,0.35); background: linear-gradient(135deg,#6366f1,#06b6d4); }
    .btn-solid {
      width: 100%; justify-content: center;
      background: var(--grad); color: white;
      box-shadow: 0 8px 30px rgba(99,102,241,0.3);
    }
    .btn-solid:hover { color: white; box-shadow: 0 16px 40px rgba(99,102,241,0.45); background: linear-gradient(135deg,#4f51d4,#0590aa); }
    .btn-small { padding: 0.4rem 0.85rem; font-size: 0.8rem; width: auto; animation: none; }

    input, select, textarea {
      width: 100%;
      padding: 0.85rem 1.1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-bright);
      font-family: var(--font-body);
      font-size: 0.93rem;
      outline: none;
      transition: var(--transition);
    }
    input:focus, select:focus { border-color: rgba(99,102,241,0.5); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    input.input-error, select.input-error { border-color: rgba(248,113,113,0.6); box-shadow: 0 0 0 3px rgba(248,113,113,0.1); }
    select option { background: #0f1118; }
    input[type="checkbox"] { width: auto; }
    input[type="radio"] { width: auto; }
    input[type="range"] { padding: 0; background: transparent; }

    .error { color: #f87171; font-size: 0.8rem; margin-top: 0.3rem; display: block; min-height: 1rem; }
    .help-text { color: var(--muted); font-size: 0.8rem; margin-top: 0.3rem; display: block; }
    .req { color: #f87171; }
    .muted-note { color: var(--muted); font-size: 0.85rem; margin-top: 0.75rem; font-weight: 300; }

    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { font-size: 0.88rem; font-weight: 500; color: var(--text-bright); }

    .password-wrap { position: relative; }
    .password-wrap span {
      position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
      cursor: pointer; font-size: 1rem; user-select: none;
    }
    .password-wrap input { padding-right: 2.8rem; }

    .radio-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .radio-pill {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; border-radius: 999px;
      border: 1px solid var(--border); cursor: pointer;
      transition: var(--transition); font-size: 0.88rem;
    }
    .radio-pill:has(input:checked) { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.1); color: var(--white); }
    .radio-pill input { display: none; }

    .form-grid { display: flex; flex-direction: column; gap: 1.2rem; }

    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 3rem; height: 68px;
      background: rgba(8,10,15,0.82);
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 100;
    }
    .navbar::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(6,182,212,0.4), transparent);
    }
    .logo { font-weight: 800; color: var(--white); }
    .logo-wrap { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
    .logo-text {
      font-family: var(--font-display); font-weight: 800; font-size: 1.1rem;
      letter-spacing: -0.01em;
      background: var(--grad-text); -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text;
    }
    .nav-links { display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap; }
    .nav-links a {
      color: var(--muted); font-size: 0.875rem; font-weight: 500;
      padding: 0.45rem 0.85rem; border-radius: 999px;
      border: 1px solid transparent; letter-spacing: 0.01em;
      transition: var(--transition); white-space: nowrap; cursor: pointer;
    }
    .nav-links a:hover { color: var(--text-bright); background: rgba(255,255,255,0.05); border-color: var(--border); }
    .nav-links a.active { color: var(--white); background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.35); box-shadow: 0 0 16px rgba(99,102,241,0.12); }
    .nav-user { font-size: 0.875rem; font-weight: 600; color: #a5b4fc; padding: 0 0.5rem; }

    .hero {
      position: relative;
      background: linear-gradient(rgba(8,10,15,0.75), rgba(8,10,15,0.9)),
        url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f") center / cover no-repeat;
      padding: 9rem 4rem 8rem; text-align: center; overflow: hidden;
    }
    .hero::before {
      content: ''; position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 80% 50%, rgba(6,182,212,0.10) 0%, transparent 60%);
      pointer-events: none;
    }
    .hero::after {
      content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
      width: 600px; height: 300px;
      background: radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%);
      filter: blur(40px); animation: pulse 6s ease-in-out infinite;
    }
    .hero-small { padding: 6rem 4rem 5rem; }
    .hero-inner { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }
    .hero h2 {
      font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4.2rem);
      font-weight: 800; color: var(--white); line-height: 1.1;
      letter-spacing: -0.03em; margin-bottom: 1.2rem;
      animation: fadeUp 0.7s ease both;
    }
    .hero h2 span { background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p {
      color: var(--text); font-size: 1.1rem; font-weight: 300;
      max-width: 600px; margin: 0 auto 2.5rem; opacity: 0.9;
      animation: fadeUp 0.7s 0.15s ease both;
    }

    .container { padding: 5rem 4rem; max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
    .section-head { text-align: center; margin-bottom: 3.5rem; }
    .section-title {
      font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem);
      font-weight: 800; color: var(--white); letter-spacing: -0.03em; margin-bottom: 0.6rem;
    }
    .section-subtitle { color: var(--text); font-size: 1rem; font-weight: 300; max-width: 500px; margin: 0 auto 0.4rem; }

    .purpose-image-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem; margin-bottom: 1rem;
    }
    .purpose-card-img {
      position: relative; border-radius: var(--radius); overflow: hidden;
      aspect-ratio: 4/3; cursor: pointer; display: block;
      border: 1px solid var(--border); transition: var(--transition);
    }
    .purpose-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .purpose-card-img span {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 1.5rem 1rem 1rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.75));
      font-family: var(--font-display); font-weight: 700; font-size: 1rem;
      color: var(--white);
    }
    .purpose-card-img:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(99,102,241,0.2); }
    .purpose-card-img:hover img { transform: scale(1.06); }

    .join-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; align-items: start; }
    .join-info { padding: 2.5rem; }
    .join-info h3 { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--white); margin-bottom: 1rem; letter-spacing: -0.02em; }
    .join-info p { color: var(--text); font-weight: 300; margin-bottom: 1.2rem; }
    .join-form { padding: 2.5rem; }
    .checklist { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
    .checklist li { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; color: var(--text-bright); }
    .checklist li::before { content: '✓'; color: #67e8f9; font-weight: 800; font-size: 0.85rem; }

    .checkbox { flex-direction: row; align-items: flex-start; gap: 0.75rem; }
    .checkbox input { margin-top: 0.2rem; flex: 0 0 auto; }
    .checkbox label { font-size: 0.88rem; cursor: pointer; }

    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .about-card { padding: 2rem; }
    .about-card h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--white); margin-bottom: 0.75rem; letter-spacing: -0.02em; }
    .about-card p, .about-card li { font-size: 0.93rem; font-weight: 300; }
    .bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .bullets li::before { content: '→ '; color: #a5b4fc; font-weight: 700; }

    .auth-wrap { max-width: 480px; margin: 0 auto; padding: 2.5rem; }
    .auth-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--white); letter-spacing: -0.03em; margin-bottom: 1.5rem; }

    .contact-layout { display: grid; grid-template-columns: 1fr 1.8fr; gap: 2rem; align-items: start; }
    .contact-info { padding: 2rem; }
    .contact-info h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--white); margin-bottom: 1.2rem; }
    .contact-info p { font-size: 0.93rem; margin-bottom: 0.6rem; }
    .contact-form { padding: 2rem; }
    .contact-form h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--white); margin-bottom: 1.2rem; }
    .map-toolbar { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 1rem; }
    .map-hint { margin-top: 0.9rem; color: #9ca3af; font-size: 0.92rem; }

    .purpose-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
    .purpose-card {
      padding: 2rem; cursor: pointer;
      border: 1px solid var(--border); border-radius: var(--radius);
      background: rgba(255,255,255,0.04); transition: var(--transition);
    }
    .purpose-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.35); box-shadow: var(--shadow-glow); }
    .purpose-card.selected { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.08); }
    .purpose-card h3 { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: var(--white); margin-bottom: 0.5rem; }
    .purpose-card p { font-size: 0.88rem; font-weight: 300; }
    .text-link { color: #a5b4fc; font-size: 0.85rem; display: inline-block; margin-top: 0.8rem; transition: var(--transition); }
    .text-link:hover { color: #67e8f9; }

    .dashboard-body { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px; padding: 2rem 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;
      background: var(--panel-2); border-right: 1px solid var(--border);
      position: sticky; top: 0; height: 100vh;
    }
    .sidebar .logo-text { display: block; font-size: 1.1rem; margin-bottom: 1.5rem; }
    .sidebar nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
    .sidebar nav a {
      display: block; padding: 0.65rem 1rem; border-radius: var(--radius-sm);
      color: var(--muted); font-size: 0.88rem; font-weight: 500;
      transition: var(--transition); cursor: pointer; border: 1px solid transparent;
    }
    .sidebar nav a:hover { color: var(--text-bright); background: rgba(255,255,255,0.05); }
    .sidebar nav a.active {
      color: var(--white); background: rgba(99,102,241,0.12);
      border-color: rgba(99,102,241,0.25);
      border-left: 3px solid; border-image: linear-gradient(180deg,#6366f1,#06b6d4) 1;
    }
    .sidebar .btn { background: rgba(255,255,255,0.06); color: var(--text-bright); border: 1px solid var(--border); font-size: 0.85rem; margin-top: auto; }
    .sidebar .btn:hover { background: rgba(248,113,113,0.15); color: #fca5a5; border-color: rgba(248,113,113,0.3); }
    .main { flex: 1; padding: 2.5rem; overflow-x: hidden; }
    .dashboard-header { padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.35rem; }
    .dashboard-header h1 { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--white); letter-spacing: -0.03em; }
    .dashboard-header p { color: var(--muted); font-size: 0.9rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem; margin-bottom: 2rem; }
    .stat-card {
      padding: 1.5rem; border-radius: var(--radius);
      background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      transition: var(--transition); position: relative; overflow: hidden;
    }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.3); box-shadow: 0 12px 40px rgba(99,102,241,0.12); }
    .stat-card h3 { font-size: 0.78rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem; }
    .stat-card p { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--white); letter-spacing: -0.03em; }
    .saved-box { padding: 2rem; }
    .saved-box h2 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--white); margin-bottom: 1.2rem; }
    .saved-item { padding: 0.9rem 1.1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.03); border: 1px solid var(--border); transition: var(--transition); color: var(--text-bright); font-weight: 500; margin-bottom: 0.6rem; }
    .saved-item:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); transform: translateX(4px); }

    .footer { text-align: center; padding: 3rem 1.5rem; color: var(--muted); font-size: 0.88rem; border-top: 1px solid var(--border); background: var(--panel-2); position: relative; }
    .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(6,182,212,0.25), transparent); }

    .back-to-top {
      position: fixed; right: 1.5rem; bottom: 1.5rem; width: 44px; height: 44px;
      display: grid; place-items: center; border-radius: 50%;
      background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.35);
      color: #a5b4fc; font-weight: 900; font-size: 1.1rem;
      backdrop-filter: blur(10px); box-shadow: 0 8px 30px rgba(99,102,241,0.2);
      transition: var(--transition); z-index: 50; cursor: pointer;
    }
    .back-to-top:hover { background: rgba(99,102,241,0.35); transform: translateY(-3px); }

    .toast {
      position: fixed; bottom: 1.5rem; left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: rgba(15,17,25,0.95); color: var(--text-bright);
      padding: 0.75rem 1.5rem; border-radius: 999px;
      border: 1px solid var(--border-hover); backdrop-filter: blur(16px);
      box-shadow: var(--shadow-lg); font-size: 0.88rem; font-weight: 500;
      z-index: 9999; opacity: 0; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      white-space: nowrap; pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    .loader {
      position: fixed; inset: 0; background: var(--bg);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; font-family: var(--font-display); font-size: 1rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted);
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    .loader.hidden { opacity: 0; visibility: hidden; }
    .loader::after { content: ''; position: absolute; bottom: 0; left: 0; height: 2px; width: 0%; background: var(--grad); animation: loaderBar 0.9s ease-out forwards; }

    .why-columns { color: var(--text); font-weight: 300; line-height: 1.7; margin-bottom: 1.2rem; }

    .search-filter-box { padding: 1rem; margin-top: 1.5rem; }
    .search-filter-box input, .search-filter-box select { max-width: 400px; }

    .nearby-wrap { display: grid; grid-template-columns: 1.35fr 0.95fr; gap: 1.25rem; margin-top: 2rem; align-items: start; }
    .nearby-panel { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.1rem; }
    .nearby-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
    .nearby-item { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.9rem 1rem; border-radius: 14px; cursor: pointer; background: rgba(255,255,255,0.05); transition: transform 0.2s ease, background 0.2s ease; }
    .nearby-item:hover { transform: translateY(-2px); background: rgba(255,255,255,0.09); }
    .chip { white-space: nowrap; padding: 0.35rem 0.7rem; border-radius: 999px; font-size: 0.85rem; background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff; }

    .map-placeholder { width: 100%; min-height: 380px; border-radius: 18px; background: rgba(99,102,241,0.05); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--muted); font-size: 0.9rem; }
    .map-pin { font-size: 2.5rem; }

    @media (max-width: 1024px) {
      .navbar { padding: 0 2rem; }
      .container { padding: 4rem 2rem; }
      .hero { padding: 7rem 2rem 6rem; }
      .hero-small { padding: 5rem 2rem 4rem; }
      .join-layout { grid-template-columns: 1fr; }
      .contact-layout { grid-template-columns: 1fr; }
      .purpose-image-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 900px) {
      .nearby-wrap { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .main { padding: 1.5rem; }
    }
    @media (max-width: 680px) {
      .navbar { padding: 0 1.2rem; }
      .nav-links { gap: 0; }
      .nav-links a { padding: 0.4rem 0.55rem; font-size: 0.8rem; }
      .hero h2 { font-size: 2.2rem; }
      .container { padding: 3rem 1.2rem; }
      .about-grid, .purpose-grid, .purpose-image-grid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr 1fr; }
    }
  `}</style>
);

/* ============================================================
   CONTEXT
============================================================ */
const AppContext = createContext(null);

function useApp() { return useContext(AppContext); }

/* ============================================================
   STORAGE HELPERS
============================================================ */
const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k) => { try { localStorage.removeItem(k); } catch {} },
};

/* ============================================================
   LOGO SVG
============================================================ */
const LogoSVG = () => (
  <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="chGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#chGrad)" strokeWidth="6" opacity="0.95"/>
    <circle cx="60" cy="60" r="40" fill="#0b0d12" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
    <g stroke="url(#chGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#softGlow)">
      <line x1="44" y1="66" x2="60" y2="46"/>
      <line x1="60" y1="46" x2="78" y2="62"/>
      <line x1="44" y1="66" x2="78" y2="62"/>
    </g>
    <g filter="url(#softGlow)">
      <circle cx="60" cy="46" r="6" fill="#ffffff"/>
      <circle cx="44" cy="66" r="6" fill="#ffffff"/>
      <circle cx="78" cy="62" r="6" fill="#ffffff"/>
      <circle cx="58" cy="44" r="1.2" fill="#0b0d12" opacity="0.55"/>
      <circle cx="42" cy="64" r="1.2" fill="#0b0d12" opacity="0.55"/>
      <circle cx="76" cy="60" r="1.2" fill="#0b0d12" opacity="0.55"/>
    </g>
    <text x="60" y="92" textAnchor="middle" fontSize="14" fontFamily="system-ui" fontWeight="800" fill="#e5e7eb" letterSpacing="1">CH</text>
  </svg>
);

/* ============================================================
   TOAST HOOK
============================================================ */
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  return { toast, showToast };
}

/* ============================================================
   NAVBAR
============================================================ */
function Navbar({ page, setPage }) {
  const { currentUser, logout, showToast } = useApp();

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "explore", label: "Explore" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="navbar" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <h1 className="logo">
        <span className="logo-wrap" onClick={() => setPage("home")}>
          <LogoSVG />
          <span className="logo-text">ConnectHub</span>
        </span>
      </h1>
      <nav className="nav-links">
        {links.map(l => (
          <a key={l.id} className={page === l.id ? "active" : ""} onClick={() => setPage(l.id)}>{l.label}</a>
        ))}
        {!currentUser ? (
          <>
            <a className={page === "signup" ? "active" : ""} onClick={() => setPage("signup")}>Sign Up</a>
            <a className={page === "login" ? "active" : ""} onClick={() => setPage("login")}>Login</a>
            <a className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>Dashboard</a>
          </>
        ) : (
          <>
            <span className="nav-user">👤 {currentUser.name}</span>
            <a className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>Dashboard</a>
            <button className="btn btn-small" style={{ animation: "none" }} onClick={() => { logout(); showToast("Logged out!"); }}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

/* ============================================================
   HOME PAGE
============================================================ */
const PURPOSE_CARDS = [
  { label: "Study Partner", img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600" },
  { label: "Project Collaboration", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600" },
  { label: "Friendship", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600" },
  { label: "Emotional Support", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600" },
  { label: "Career Mentorship", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600" },
  { label: "Networking & Communities", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600" },
];

function useFormValidation(rules) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (values) => {
    const errs = {};
    for (const [field, fns] of Object.entries(rules)) {
      for (const fn of fns) {
        const err = fn(values[field], values);
        if (err) { errs[field] = err; break; }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const touch = (field) => setTouched(t => ({ ...t, [field]: true }));
  const touchAll = () => setTouched(Object.fromEntries(Object.keys(rules).map(k => [k, true])));

  return { errors, touched, validate, touch, touchAll };
}

function HomePage({ setPage }) {
  const { currentUser, showToast } = useApp();
  const [form, setForm] = useState({ fullname: currentUser?.name || "", email: currentUser?.email || "", purpose: "", agree: false });
  const [attempts, setAttempts] = useState(0);

  const rules = {
    fullname: [
      v => !v?.trim() ? "Full name is required." : null,
      v => v?.trim().length < 2 ? "Full name must be at least 2 characters." : null,
      v => !/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(v?.trim()) ? "Use only letters and spaces (.'- allowed)." : null,
    ],
    email: [
      v => !v?.trim() ? "Email is required." : null,
      v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address." : null,
    ],
    purpose: [v => !v ? "Please select a purpose." : null],
    agree: [v => !v ? "You must agree to continue." : null],
  };

  const { errors, touched, validate, touch, touchAll } = useFormValidation(rules);

  const handleSubmit = (e) => {
    e.preventDefault();
    touchAll();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (!validate(form)) {
      showToast(`Invalid attempts: ${newAttempts}`);
      return;
    }
    setPage("explore");
  };

  const setPurposeFromCard = (label) => {
    setForm(f => ({ ...f, purpose: label }));
    showToast("You clicked: " + label);
    document.getElementById("join-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top">
      <section className="hero" id="home">
        <div className="hero-inner">
          <h2>
            {currentUser
              ? <>Welcome back, {currentUser.name} <br /><span>Continue your journey</span></>
              : <>Meaningful Connections.<br /><span>Clear Intent.</span></>
            }
          </h2>
          <p>A purpose-driven platform to connect people through academics, support, growth, and long-term intent.</p>
          <button className="btn" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
            <span>Explore Purposes</span>
          </button>
        </div>
      </section>

      <section id="services" className="container">
        <header className="section-head">
          <h2 className="section-title">Choose Your <span className="gradient-shimmer">Purpose</span></h2>
          <p className="section-subtitle">Pick a connection type that matches your intent.</p>
        </header>
        <div className="purpose-image-grid">
          {PURPOSE_CARDS.map(c => (
            <div key={c.label} className="purpose-card-img" onClick={() => setPurposeFromCard(c.label)}>
              <img src={c.img} alt={c.label} loading="lazy" />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="join-form-section" className="container">
        <header className="section-head">
          <h2 className="section-title">Join the <span className="gradient-shimmer">Community</span></h2>
          <p className="section-subtitle">Start here — explore purposes next.</p>
        </header>
        <div className="join-layout">
          <aside className="join-info glass">
            <h3>Why Join?</h3>
            <p>ConnectHub helps people connect based on clear intent and respectful interaction.</p>
            <div className="why-columns">
              <p>The platform supports multiple connection types including academics, project collaboration, emotional support, and professional mentorship. It is designed to reduce confusion, improve match quality, and ensure meaningful interactions.</p>
            </div>
            <ul className="checklist">
              <li>Purpose-based connections</li>
              <li>Privacy-first approach</li>
              <li>Community guidelines enforced</li>
              <li>Clean and simple experience</li>
            </ul>
          </aside>
          <article className="join-form glass">
            <form id="joinForm" className="form-grid" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="fullname">Full Name <span className="req">*</span></label>
                <input id="fullname" type="text" placeholder="Your full name" value={form.fullname}
                  onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))}
                  onBlur={() => { touch("fullname"); validate(form); }}
                  className={(touched.fullname && errors.fullname) ? "input-error" : ""}
                />
                <small className="error">{touched.fullname && errors.fullname}</small>
              </div>
              <div className="field">
                <label htmlFor="email">Email Address <span className="req">*</span></label>
                <input id="email" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onBlur={() => { touch("email"); validate(form); }}
                  className={(touched.email && errors.email) ? "input-error" : ""}
                />
                <small className="error">{touched.email && errors.email}</small>
              </div>
              <div className="field">
                <label htmlFor="purpose">Primary Purpose <span className="req">*</span></label>
                <select id="purpose" value={form.purpose}
                  onChange={e => { setForm(f => ({ ...f, purpose: e.target.value })); touch("purpose"); }}
                  className={(touched.purpose && errors.purpose) ? "input-error" : ""}
                >
                  <option value="" disabled>Select a purpose</option>
                  {["Study Partner","Project Collaboration","Friendship","Emotional Support","Career Mentorship","Networking & Communities"].map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <small className="error">{touched.purpose && errors.purpose}</small>
              </div>
              <div className="field checkbox">
                <input id="agree" type="checkbox" checked={form.agree}
                  onChange={e => { setForm(f => ({ ...f, agree: e.target.checked })); touch("agree"); }}
                />
                <label htmlFor="agree">I agree to the Community Guidelines <span className="req">*</span></label>
                <small className="error">{touched.agree && errors.agree}</small>
              </div>
              <button type="submit" className="btn btn-solid">Continue</button>
              <p className="muted-note">You'll be taken to explore purposes next.</p>
            </form>
          </article>
        </div>
      </section>

      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   ABOUT PAGE
============================================================ */
function AboutPage({ setPage }) {
  return (
    <div>
      <section className="hero hero-small">
        <div className="hero-inner">
          <h2>About <span>ConnectHub</span></h2>
          <p>A purpose-driven platform designed for meaningful and respectful connections.</p>
          <button className="btn" onClick={() => setPage("explore")}><span>Explore Purposes</span></button>
        </div>
      </section>
      <section className="container">
        <div className="about-grid">
          {[
            { title: "Problem", content: <p>Many social platforms promote random or unclear matching. This often leads to low-quality interactions and confusion about user intent.</p> },
            { title: "Solution", content: <p>ConnectHub organizes connections by clear purpose such as academics, emotional support, professional growth, and long-term intent.</p> },
            { title: "Objectives", content: (
              <ul className="bullets">
                <li>Provide clarity through intent-based connection categories</li>
                <li>Promote respectful and safe interaction</li>
                <li>Design a modern UI using HTML and CSS</li>
                <li>Present information clearly using forms and tables</li>
              </ul>
            )},
            { title: "Technology Used", content: (
              <ul className="bullets">
                <li>React (components + hooks)</li>
                <li>CSS3 (grid, layout, glassmorphism)</li>
                <li>Responsive design for mobile and desktop</li>
              </ul>
            )},
          ].map(c => (
            <article key={c.title} className="glass about-card">
              <h3>{c.title}</h3>
              {c.content}
            </article>
          ))}
        </div>
      </section>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   CONTACT PAGE (Map placeholder — Leaflet needs real DOM)
============================================================ */
function ContactPage({ setPage }) {
  const [status, setStatus] = useState('Click "Show Headquarters" to view the office location.');
  const [showPin, setShowPin] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const HQ = [19.0760, 72.8777];

  useEffect(() => {
    if (typeof window === "undefined" || !window.L) return;
    const L = window.L;
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(HQ, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap"
    }).addTo(map);
    mapInstanceRef.current = map;
  }, []);

  const showHQ = () => {
    setShowPin(true);
    setStatus("Headquarters location displayed on map.");
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    if (markerRef.current) mapInstanceRef.current.removeLayer(markerRef.current);
    const icon = L.divIcon({
      className: "", html: `<div style="width:42px;height:42px;background:linear-gradient(135deg,#6366f1,#06b6d4);border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 8px 20px rgba(0,0,0,0.28);"></div>`,
      iconSize: [42, 42], iconAnchor: [21, 42], popupAnchor: [0, -36],
    });
    markerRef.current = L.marker(HQ, { icon }).addTo(mapInstanceRef.current)
      .bindPopup("<b>ConnectHub Headquarters</b><br>Mumbai Office").openPopup();
    mapInstanceRef.current.setView(HQ, 16);
  };

  const resetMap = () => {
    setShowPin(false);
    setStatus('Map reset. Click "Show Headquarters" again.');
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      mapInstanceRef.current.setView(HQ, 12);
    }
  };

  return (
    <div>
      <section className="hero hero-small">
        <div className="hero-inner">
          <h2>Get in <span>Touch</span></h2>
          <p>For feedback, doubts, or suggestions related to this.</p>
          <button className="btn" onClick={() => setPage("home")}><span>Back to Home</span></button>
        </div>
      </section>
      <section className="container">
        <div className="contact-layout">
          <aside className="glass contact-info">
            <h3>Contact Info</h3>
            <p><strong>Email:</strong> support@connecthub.edu</p>
            <p><strong>Company Type:</strong> Mutual Connections</p>
            <p><strong>Working Hours:</strong> 10:00 AM – 6:00 PM</p>
            <p className="muted-note">We usually respond within 24 hours.</p>
          </aside>
          <article className="glass contact-form">
            <h3>Office Headquarters</h3>
            {typeof window !== "undefined" && window.L ? (
              <div ref={mapRef} style={{ width: "100%", height: 360, borderRadius: 18 }} />
            ) : (
              <div className="map-placeholder">
                <div className="map-pin">📍</div>
                <div>Mumbai, Maharashtra, India</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>19.0760° N, 72.8777° E</div>
                {showPin && (
                  <div style={{ padding: "0.5rem 1rem", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, fontSize: "0.88rem", color: "#a5b4fc" }}>
                    📌 ConnectHub Headquarters — Mumbai Office
                  </div>
                )}
              </div>
            )}
            <div className="map-toolbar">
              <button className="btn btn-solid btn-small" style={{ width: "auto", animation: "none" }} onClick={showHQ}>Show Headquarters</button>
              <button className="btn btn-small" style={{ width: "auto", animation: "none" }} onClick={resetMap}>Reset Map</button>
            </div>
            <p className="map-hint">{status}</p>
          </article>
        </div>
      </section>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   EXPLORE PAGE
============================================================ */
const ALL_PURPOSES = [
  { title: "Study Partner", desc: "Connect with learners for shared study sessions and exam preparation." },
  { title: "Project Collaboration", desc: "Find teammates for hackathons, college projects, and skill building." },
  { title: "Friendship", desc: "Meet people for genuine friendships and meaningful conversations." },
  { title: "Emotional Support", desc: "A respectful space for support, encouragement, and listening." },
  { title: "Career Mentorship", desc: "Get guidance from experienced individuals for career direction." },
  { title: "Well-Being & Accountability", desc: "Stay consistent with habits, goals, motivation, and personal growth." },
  { title: "Creative Collaboration", desc: "Work with others on design, content, writing, art, and creativity." },
  { title: "Networking & Communities", desc: "Expand your circle through interests, groups, and professional communities." },
  { title: "Serious Relationship", desc: "Intentional connections focused on long-term commitment." },
  { title: "Life Partner", desc: "Future-focused connections based on values and long-term planning." },
];

const USERS = [
  { name: "Aarav", purpose: "Study Partner", lat: 19.2140, lng: 72.9780 },
  { name: "Meera", purpose: "Study Partner", lat: 19.5000, lng: 73.3000 },
  { name: "Ishaan", purpose: "Project Collaboration", lat: 19.2180, lng: 72.9850 },
  { name: "Sara", purpose: "Friendship", lat: 19.2090, lng: 72.9820 },
  { name: "Rohan", purpose: "Career Mentorship", lat: 19.2240, lng: 72.9950 },
  { name: "Kabir", purpose: "Emotional Support", lat: 19.2160, lng: 72.9880 },
  { name: "Diya", purpose: "Well-Being & Accountability", lat: 19.2120, lng: 72.9800 },
  { name: "Vivaan", purpose: "Creative Collaboration", lat: 19.2260, lng: 72.9920 },
  { name: "Nisha", purpose: "Networking & Communities", lat: 19.2070, lng: 72.9890 },
  { name: "Arjun", purpose: "Serious Relationship", lat: 19.2190, lng: 72.9940 },
  { name: "Kavya", purpose: "Life Partner", lat: 19.2110, lng: 72.9860 },
];

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ExplorePage({ setPage }) {
  const { savedProfiles, saveProfile, removeProfile, showToast } = useApp();
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  const [radius, setRadius] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const activity = storage.get("connecthub_activity");

  const getNearby = useCallback(() => {
    if (!userLocation) return [];
    return USERS
      .filter(u => u.purpose === selectedPurpose)
      .map(u => ({ ...u, dist: distanceKm(userLocation.lat, userLocation.lng, u.lat, u.lng) }))
      .filter(u => u.dist <= radius && u.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortBy === "distance" ? a.dist - b.dist : a.name.localeCompare(b.name));
  }, [userLocation, selectedPurpose, radius, search, sortBy]);

  const nearby = getNearby();

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;
    const L = window.L;
    const center = userLocation ? [userLocation.lat, userLocation.lng] : [19.2140, 72.9780];
    mapInstanceRef.current = L.map(mapRef.current, { scrollWheelZoom: false }).setView(center, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap"
    }).addTo(mapInstanceRef.current);
  }, [userLocation]);

  useEffect(() => {
    if (selectedPurpose) initMap();
  }, [selectedPurpose, initMap]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    markersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    markersRef.current = [];
    nearby.forEach(u => {
      const m = L.marker([u.lat, u.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${u.name}</b><br>${u.purpose}<br>${u.dist.toFixed(1)} km`);
      markersRef.current.push(m);
    });
    if (userLocation) {
      const icon = L.divIcon({ className: "", html: `<div style="width:16px;height:16px;background:#6366f1;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(99,102,241,0.8)"></div>`, iconSize:[16,16], iconAnchor:[8,8] });
      const m = L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(mapInstanceRef.current).bindPopup("You are here");
      markersRef.current.push(m);
    }
  }, [nearby, userLocation]);

  const handleCardClick = (purpose) => {
    setSelectedPurpose(purpose);
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocError(null); },
      () => { setUserLocation({ lat: 19.2140, lng: 72.9780 }); setLocError("Location denied — using default."); }
    );
  };

  const isSaved = (name) => savedProfiles.some(p => p.name === name);

  return (
    <div>
      <section className="hero hero-small">
        <div className="hero-inner">
          <h2>Explore <span>Purposes</span></h2>
          <p>Pick a purpose and connect with people who share the same intent.</p>
          <button className="btn" onClick={() => setPage("home")}><span>Create Profile</span></button>
        </div>
      </section>
      <section className="container">
        <header className="section-head">
          <h2 className="section-title">All Purposes</h2>
          <p className="section-subtitle">Designed to support academic, emotional, social, and professional needs.</p>
          <p className="section-subtitle" style={{ opacity: 0.85 }}>Tip: Click any purpose card to see nearby people on map.</p>
        </header>
        <div className="purpose-grid">
          {ALL_PURPOSES.map(p => (
            <article key={p.title} className={`purpose-card glass${selectedPurpose === p.title ? " selected" : ""}`} onClick={() => handleCardClick(p.title)}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="text-link" onClick={e => { e.stopPropagation(); setPage("home"); }}>Join for this purpose →</span>
            </article>
          ))}
        </div>

        <div className="glass search-filter-box" style={{ marginTop: "1.5rem" }}>
          <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 400, marginBottom: "1rem" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <label style={{ color: "var(--text)", fontSize: "0.9rem" }}>Radius (km): </label>
            <input type="range" min="5" max="500" value={radius} onChange={e => setRadius(+e.target.value)} style={{ width: 180 }} />
            <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>{radius} km</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label style={{ color: "var(--text)", fontSize: "0.9rem" }}>Sort By: </label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto", maxWidth: 160 }}>
              <option value="distance">Nearest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {selectedPurpose && (
          <div className="nearby-wrap">
            {window.L ? (
              <div ref={mapRef} className="glass" style={{ width: "100%", minHeight: 380, borderRadius: 18 }} />
            ) : (
              <div className="map-placeholder">
                <div className="map-pin">🗺️</div>
                <div style={{ fontWeight: 600, color: "var(--white)" }}>{selectedPurpose}</div>
                <div>{nearby.length} users in {radius}km radius</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>Map requires Leaflet.js</div>
              </div>
            )}
            <aside className="nearby-panel">
              <h3 style={{ color: "var(--white)", fontFamily: "var(--font-display)", marginBottom: "0.4rem" }}>
                Nearby for {selectedPurpose}
              </h3>
              {locError && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "0.6rem" }}>{locError}</p>}
              {activity && <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>Last activity: {activity.action} by {activity.user}</p>}
              <ul className="nearby-list">
                {nearby.length === 0 ? (
                  <li style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No users found in this radius.</li>
                ) : nearby.map(u => (
                  <li key={u.name} className="nearby-item">
                    <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{u.name}</span>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{u.dist.toFixed(1)}km</span>
                      <button
                        className="btn btn-small"
                        style={{ width: "auto", animation: "none", padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                        onClick={() => {
                          if (isSaved(u.name)) { removeProfile(u.name); showToast(`Removed ${u.name}`); }
                          else { saveProfile(u); showToast(`Saved ${u.name}`); }
                        }}
                      >
                        {isSaved(u.name) ? "★ Saved" : "☆ Save"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 20 }}>
                <h3 style={{ color: "var(--white)", fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}>⭐ Saved Profiles</h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <button className="btn btn-small" style={{ width: "auto", animation: "none" }}
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(savedProfiles, null, 2)], { type: "application/json" });
                      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "saved_profiles.json"; a.click();
                      showToast("Exported!");
                    }}
                  >📤 Export JSON</button>
                </div>
                {savedProfiles.length === 0
                  ? <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>No saved profiles yet.</p>
                  : savedProfiles.map(p => (
                    <div key={p.name} className="saved-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{p.name}</strong>
                      <span style={{ color: "#f87171", cursor: "pointer", fontSize: "0.82rem" }} onClick={() => { removeProfile(p.name); showToast(`Removed ${p.name}`); }}>✕</span>
                    </div>
                  ))
                }
              </div>
            </aside>
          </div>
        )}
      </section>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   LOGIN PAGE
============================================================ */
function LoginPage({ setPage }) {
  const { login, showToast } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("");
  const [attempts, setAttempts] = useState(0);

  const rules = {
    email: [v => !v?.trim() ? "Email is required." : null, v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address." : null],
    password: [v => !v ? "Password is required." : null, v => v.length < 8 ? "Min 8 characters." : null, v => !/[^A-Za-z0-9]/.test(v) ? "At least 1 special character required." : null],
  };
  const { errors, touched, validate, touch, touchAll } = useFormValidation(rules);

  const handleSubmit = (e) => {
    e.preventDefault();
    touchAll();
    setAttempts(a => a + 1);
    if (!validate(form)) return;
    const users = storage.get("connecthub_users") || [];
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) { setStatus("Invalid email or password."); return; }
    const updated = { ...user, lastLogin: new Date().toLocaleString(), loginCount: (user.loginCount || 0) + 1 };
    storage.set("connecthub_users", users.map(u => u.email === updated.email ? updated : u));
    login(updated);
    storage.set("connecthub_activity", { action: "login", user: updated.name, email: updated.email, time: new Date().toLocaleString() });
    showToast("Login successful!");
    setStatus("Login successful 🎉 Redirecting...");
    setTimeout(() => setPage("dashboard"), 1000);
  };

  return (
    <div>
      <section className="hero hero-small">
        <div className="hero-inner">
          <h2>Welcome <span>Back</span></h2>
          <button className="btn" onClick={() => setPage("signup")}><span>New here? Sign Up</span></button>
        </div>
      </section>
      <section className="container">
        <div className="glass auth-wrap">
          <h3 className="auth-title">Login</h3>
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onBlur={() => { touch("email"); validate(form); }}
                className={touched.email && errors.email ? "input-error" : ""}
              />
              <small className="error">{touched.email && errors.email}</small>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="password-wrap">
                <input type={showPw ? "text" : "password"} placeholder="Min 8 chars + 1 special" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onBlur={() => { touch("password"); validate(form); }}
                  className={touched.password && errors.password ? "input-error" : ""}
                />
                <span onClick={() => setShowPw(s => !s)}>👁</span>
              </div>
              <small className="error">{touched.password && errors.password}</small>
            </div>
            <button type="submit" className="btn btn-solid">Login</button>
            {status && <p className="muted-note" style={{ color: status.includes("success") ? "lightgreen" : "#f87171" }}>{status}</p>}
          </form>
        </div>
      </section>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   SIGNUP PAGE
============================================================ */
function SignupPage({ setPage }) {
  const { login, showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "", country: "" });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("Fields marked with * are mandatory.");
  const [attempts, setAttempts] = useState(0);

  const rules = {
    name: [v => !v?.trim() ? "Full name is required." : null, v => v?.trim().length < 2 ? "Min 2 characters." : null, v => !/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(v?.trim()) ? "Only letters and spaces allowed." : null],
    email: [v => !v?.trim() ? "Email is required." : null, v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : null],
    password: [v => !v ? "Password is required." : null, v => v.length < 8 ? "Min 8 characters." : null, v => !/[^A-Za-z0-9]/.test(v) ? "At least 1 special character." : null],
    gender: [v => !v ? "Please select a gender." : null],
    country: [v => !v ? "Please select a country." : null],
  };
  const { errors, touched, validate, touch, touchAll } = useFormValidation(rules);

  const handleSubmit = (e) => {
    e.preventDefault();
    touchAll();
    setAttempts(a => a + 1);
    if (!validate(form)) { setStatus(`Fix errors before signup. Attempt: ${attempts + 1}`); return; }
    const users = storage.get("connecthub_users") || [];
    if (users.find(u => u.email === form.email)) {
      setStatus(""); 
      // mark email error
      return;
    }
    const newUser = { ...form, loginCount: 1, lastLogin: new Date().toLocaleString() };
    users.push(newUser);
    storage.set("connecthub_users", users);
    storage.set("connecthub_activity", { action: "signup", user: form.name, email: form.email, time: new Date().toLocaleString() });
    login(newUser);
    showToast("Signup successful 🎉");
    setStatus("Signup successful 🎉 Redirecting...");
    setTimeout(() => setPage("dashboard"), 1200);
  };

  return (
    <div>
      <section className="hero hero-small">
        <div className="hero-inner">
          <h2>Create <span>Account</span></h2>
          <p>Complete your profile to start connecting with clear intent.</p>
          <button className="btn" onClick={() => setPage("login")}><span>Already have an account? Login</span></button>
        </div>
      </section>
      <section className="container">
        <div className="glass auth-wrap" style={{ maxWidth: 520 }}>
          <h3 className="auth-title">Sign Up</h3>
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            {[
              { id: "su_name", label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
              { id: "su_email", label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
            ].map(f => (
              <div key={f.key} className="field">
                <label>{f.label} <span className="req">*</span></label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  onBlur={() => { touch(f.key); validate(form); }}
                  className={touched[f.key] && errors[f.key] ? "input-error" : ""}
                />
                <small className="error">{touched[f.key] && errors[f.key]}</small>
              </div>
            ))}
            <div className="field">
              <label>Password <span className="req">*</span></label>
              <div className="password-wrap">
                <input type={showPw ? "text" : "password"} placeholder="Minimum 8 characters with 1 special character"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onBlur={() => { touch("password"); validate(form); }}
                  className={touched.password && errors.password ? "input-error" : ""}
                />
                <span onClick={() => setShowPw(s => !s)}>👁</span>
              </div>
              <small className="help-text">Minimum 8 characters and at least one special character.</small>
              <small className="error">{touched.password && errors.password}</small>
            </div>
            <div className="field">
              <label>Gender <span className="req">*</span></label>
              <div className="radio-row">
                {["Male", "Female", "Other"].map(g => (
                  <label key={g} className="radio-pill">
                    <input type="radio" name="gender" value={g} checked={form.gender === g}
                      onChange={() => { setForm(p => ({ ...p, gender: g })); touch("gender"); }}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              <small className="error">{touched.gender && errors.gender}</small>
            </div>
            <div className="field">
              <label>Country <span className="req">*</span></label>
              <select value={form.country}
                onChange={e => { setForm(p => ({ ...p, country: e.target.value })); touch("country"); }}
                className={touched.country && errors.country ? "input-error" : ""}
              >
                <option value="" disabled>Select your country</option>
                {["India","United States","United Kingdom","Canada","Australia","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
              <small className="error">{touched.country && errors.country}</small>
            </div>
            <button type="submit" className="btn btn-solid">Create Account</button>
            <p className="muted-note" style={{ color: status.includes("success") ? "lightgreen" : "" }}>{status}</p>
          </form>
        </div>
      </section>
      <footer className="footer"><p>© 2026 ConnectHub · Meaningful Connections</p></footer>
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE
============================================================ */
function DashboardPage({ setPage }) {
  const { currentUser, logout, savedProfiles, showToast } = useApp();

  useEffect(() => {
    if (!currentUser) setPage("login");
  }, [currentUser, setPage]);

  if (!currentUser) return null;

  return (
    <div className="dashboard-body" style={{ minHeight: "calc(100vh - 68px)" }}>
      <aside className="sidebar">
        <span className="logo-text">ConnectHub</span>
        <nav>
          <a className="active">📊 Dashboard</a>
          <a onClick={() => setPage("explore")}>🔍 Explore</a>
          <a onClick={() => setPage("contact")}>📬 Contact</a>
          <a onClick={() => setPage("home")}>🏠 Home</a>
          <a onClick={() => setPage("about")}>ℹ️ About</a>
          <a onClick={() => setPage("login")}>🔑 Login</a>
        </nav>
        <button className="btn btn-small" onClick={() => { logout(); showToast("Logged out!"); setPage("login"); }}>Logout</button>
      </aside>
      <main className="main">
        <div className="dashboard-header glass">
          <h1>Welcome, {currentUser.name}</h1>
          <p>{currentUser.email}</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <h3>📅 Last Login</h3>
            <p style={{ fontSize: "1rem", fontWeight: 600 }}>{currentUser.lastLogin || "First Login"}</p>
          </div>
          <div className="stat-card">
            <h3>🔑 Total Logins</h3>
            <p>{currentUser.loginCount || 1}</p>
          </div>
          <div className="stat-card">
            <h3>⭐ Saved Profiles</h3>
            <p>{savedProfiles.length}</p>
          </div>
          <div className="stat-card">
            <h3>🌍 Country</h3>
            <p style={{ fontSize: "1rem", fontWeight: 600 }}>{currentUser.country || "—"}</p>
          </div>
        </div>
        <div className="glass saved-box">
          <h2>⭐ Saved Profiles</h2>
          {savedProfiles.length === 0
            ? <p style={{ color: "var(--muted)" }}>No saved profiles yet. Explore to save some!</p>
            : savedProfiles.map(p => (
              <div key={p.name} className="saved-item">{p.name} <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>— {p.purpose}</span></div>
            ))
          }
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   ROOT APP
============================================================ */
export default function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(() => storage.get("connecthub_current_user"));
  const [savedProfiles, setSavedProfiles] = useState(() => storage.get("connecthub_saved_profiles") || []);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const login = useCallback((user) => {
    storage.set("connecthub_current_user", user);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    storage.remove("connecthub_current_user");
    setCurrentUser(null);
  }, []);

  const saveProfile = useCallback((profile) => {
    setSavedProfiles(prev => {
      if (prev.some(p => p.name === profile.name)) return prev;
      const next = [...prev, profile];
      storage.set("connecthub_saved_profiles", next);
      return next;
    });
  }, []);

  const removeProfile = useCallback((name) => {
    setSavedProfiles(prev => {
      const next = prev.filter(p => p.name !== name);
      storage.set("connecthub_saved_profiles", next);
      return next;
    });
  }, []);

  const ctx = { currentUser, login, logout, savedProfiles, saveProfile, removeProfile, showToast };

  const renderPage = () => {
    switch(page) {
      case "home": return <HomePage setPage={setPage} />;
      case "about": return <AboutPage setPage={setPage} />;
      case "explore": return <ExplorePage setPage={setPage} />;
      case "contact": return <ContactPage setPage={setPage} />;
      case "login": return <LoginPage setPage={setPage} />;
      case "signup": return <SignupPage setPage={setPage} />;
      case "dashboard": return <DashboardPage setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <GlobalStyle />
      {loading && <div className={`loader${loading ? "" : " hidden"}`}>Loading ConnectHub...</div>}
      {!loading && (
        <>
          {page !== "dashboard" && <Navbar page={page} setPage={setPage} />}
          {renderPage()}
          <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
        </>
      )}
    </AppContext.Provider>
  );
}

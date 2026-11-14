export function renderClientAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Flatmate – Person-First Flatmate Discovery</title>
  <style>
    :root {
      --primary: #0D9488;
      --primary-dark: #0F766E;
      --primary-light: #CCFBF1;
      --primary-50: #F0FDFA;
      --accent: #F97316;
      --accent-dark: #EA580C;
      --accent-light: #FFEDD5;
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background-color: #E2E8F0;
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }

    /* Device Mockup Shell (Responsive: Mobile on desktop, full-width on mobile) */
    .app-frame {
      width: 100%;
      max-width: 430px;
      height: 100vh;
      max-height: 920px;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    @media (min-width: 600px) {
      .app-frame {
        border-radius: 40px;
        height: 880px;
        border: 10px solid #1E293B;
      }
    }

    /* Top App Bar */
    .top-bar {
      height: 56px;
      background: #FFFFFF;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      position: relative;
      z-index: 30;
      flex-shrink: 0;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 18px;
      color: var(--primary);
      letter-spacing: -0.5px;
    }
    .brand-pill {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .location-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      background: #F1F5F9;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      transition: background 0.15s;
    }
    .icon-btn:hover { background: #F1F5F9; color: var(--text); }
    .persona-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: var(--primary-50);
      border: 1px solid var(--primary-light);
      padding: 3px 8px 3px 4px;
      border-radius: 20px;
    }
    .persona-trigger img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    .persona-trigger span {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary-dark);
    }

    /* Screen Views Container */
    .screen-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .screen-view {
      display: none;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
    }
    .screen-view.active {
      display: flex;
    }

    /* Bottom Navigation Bar */
    .bottom-nav {
      height: 64px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 8px;
      flex-shrink: 0;
      z-index: 30;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: var(--text-muted);
      cursor: pointer;
      background: none;
      border: none;
      flex: 1;
      height: 100%;
      font-size: 10px;
      font-weight: 600;
      transition: all 0.15s;
      position: relative;
    }
    .nav-item.active {
      color: var(--primary);
    }
    .nav-icon {
      font-size: 20px;
    }
    .nav-badge {
      position: absolute;
      top: 6px;
      right: 20%;
      background: var(--accent);
      color: white;
      font-size: 10px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 10px;
    }

    /* -------------------------------------------------------------
       SCREEN 1: DISCOVER CARD DECK & GESTURE PHYSICS
       ------------------------------------------------------------- */
    .deck-container {
      flex: 1;
      position: relative;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .card-stack {
      width: 100%;
      height: 520px;
      position: relative;
    }
    .swipe-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      background: #FFFFFF;
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      user-select: none;
      touch-action: none;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
    }
    .swipe-card.dragging {
      transition: none;
      cursor: grabbing;
    }
    .card-photo-box {
      width: 100%;
      height: 65%;
      position: relative;
      background: #334155;
    }
    .card-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60%;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
    }
    .card-top-badges {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      z-index: 5;
    }
    .compat-badge {
      background: rgba(13, 148, 136, 0.92);
      backdrop-filter: blur(8px);
      color: white;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .stamp-badge {
      position: absolute;
      top: 30px;
      font-size: 24px;
      font-weight: 900;
      padding: 6px 16px;
      border-radius: 12px;
      border: 4px solid;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0;
      pointer-events: none;
      z-index: 10;
      transition: opacity 0.1s;
    }
    .stamp-like {
      right: 20px;
      color: #10B981;
      border-color: #10B981;
      transform: rotate(15deg);
    }
    .stamp-pass {
      left: 20px;
      color: #EF4444;
      border-color: #EF4444;
      transform: rotate(-15deg);
    }
    .card-info-overlay {
      position: absolute;
      bottom: 12px;
      left: 14px;
      right: 14px;
      color: white;
    }
    .card-name-age {
      font-size: 22px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .verify-icon {
      color: #38BDF8;
      font-size: 18px;
    }
    .card-workplace {
      font-size: 13px;
      color: #E2E8F0;
      margin-top: 2px;
    }
    .card-content-box {
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      justify-content: space-between;
    }
    .card-modality-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      align-self: flex-start;
      background: var(--accent-light);
      color: var(--accent-dark);
    }
    .card-bio {
      font-size: 12px;
      color: #475569;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .lifestyle-chip {
      font-size: 11px;
      background: #F1F5F9;
      color: #334155;
      padding: 3px 8px;
      border-radius: 8px;
      font-weight: 600;
    }

    /* Thumb-Zone Action Controls */
    .action-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 12px 0 4px 0;
      width: 100%;
    }
    .action-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: #FFFFFF;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .action-btn:hover {
      transform: scale(1.08);
    }
    .action-btn:active {
      transform: scale(0.94);
    }
    .action-rewind { width: 44px; height: 44px; color: var(--warning); font-size: 18px; }
    .action-pass { color: var(--danger); font-size: 24px; }
    .action-superlike { width: 44px; height: 44px; color: #3B82F6; font-size: 18px; }
    .action-like { color: var(--primary); font-size: 26px; }

    /* -------------------------------------------------------------
       SCREEN 2: MATCHES & CONVERSATIONS
       ------------------------------------------------------------- */
    .matches-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      background: white;
    }
    .matches-header h2 { font-size: 18px; font-weight: 800; color: var(--text); }
    .matches-header p { font-size: 12px; color: var(--text-muted); }
    .horizontal-matches {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid var(--border);
    }
    .match-bubble {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .match-bubble-avatar {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      padding: 2px;
      object-fit: cover;
    }
    .match-bubble-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
      max-width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .conversations-list {
      display: flex;
      flex-direction: column;
      background: white;
      flex: 1;
    }
    .conv-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.15s;
    }
    .conv-item:hover { background: #F8FAFC; }
    .conv-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .conv-content { flex: 1; overflow: hidden; }
    .conv-title-row { display: flex; justify-content: space-between; align-items: baseline; }
    .conv-name { font-size: 14px; font-weight: 700; color: var(--text); }
    .conv-time { font-size: 11px; color: var(--text-muted); }
    .conv-preview { font-size: 13px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }

    /* -------------------------------------------------------------
       SCREEN 3: ACTIVE REAL-TIME CHAT
       ------------------------------------------------------------- */
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #F8FAFC;
    }
    .chat-top-header {
      padding: 10px 16px;
      background: white;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .chat-back-btn { font-size: 20px; background: none; border: none; cursor: pointer; color: var(--text); }
    .chat-user-info { flex: 1; display: flex; align-items: center; gap: 10px; }
    .chat-user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
    .chat-user-text h4 { font-size: 14px; font-weight: 700; }
    .chat-user-text p { font-size: 11px; color: var(--success); font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .chat-user-text p::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
    
    .chat-safety-banner {
      background: var(--accent-light);
      border-bottom: 1px solid #FED7AA;
      padding: 8px 14px;
      font-size: 11px;
      color: #9A3412;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .messages-stream {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg-bubble {
      max-width: 78%;
      padding: 10px 14px;
      border-radius: 18px;
      font-size: 13px;
      line-height: 1.4;
      position: relative;
      word-break: break-word;
    }
    .msg-out {
      align-self: flex-end;
      background: var(--primary);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .msg-in {
      align-self: flex-start;
      background: white;
      color: var(--text);
      border: 1px solid var(--border);
      border-bottom-left-radius: 4px;
    }
    .msg-warning {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #991B1B;
      font-size: 11px;
      padding: 6px 10px;
      border-radius: 8px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .msg-time { font-size: 10px; opacity: 0.7; margin-top: 4px; text-align: right; }

    /* Icebreaker chips */
    .chat-icebreaker-bar {
      padding: 6px 12px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 6px;
      overflow-x: auto;
    }
    .icebreaker-chip {
      background: var(--primary-50);
      border: 1px solid var(--primary-light);
      color: var(--primary-dark);
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 14px;
      cursor: pointer;
      white-space: nowrap;
    }
    .icebreaker-chip:hover { background: var(--primary-light); }

    .chat-input-bar {
      padding: 10px 12px;
      background: white;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 24px;
      font-size: 13px;
      outline: none;
    }
    .chat-input:focus { border-color: var(--primary); }
    .chat-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* -------------------------------------------------------------
       SCREEN 4: PROFILE & LIFESTYLE SETTINGS
       ------------------------------------------------------------- */
    .profile-scroll {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .profile-header-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .my-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    .my-details h3 { font-size: 16px; font-weight: 800; }
    .my-details p { font-size: 12px; color: var(--text-muted); }
    .section-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .section-title { font-size: 14px; font-weight: 800; color: var(--text); }
    .modality-picker { display: flex; flex-direction: column; gap: 8px; }
    .modality-opt {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      transition: all 0.15s;
    }
    .modality-opt:hover { border-color: var(--primary); background: var(--primary-50); }
    .modality-opt.selected { border-color: var(--primary); background: var(--primary-light); }
    .modality-radio { margin-top: 3px; accent-color: var(--primary); }
    .modality-opt-text h5 { font-size: 13px; font-weight: 700; color: var(--text); }
    .modality-opt-text p { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    /* -------------------------------------------------------------
       MODALS: MATCH CELEBRATION & DETAIL SHEET
       ------------------------------------------------------------- */
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      z-index: 50;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .modal-overlay.active { display: flex; }
    
    .celebration-box {
      background: white;
      border-radius: 28px;
      width: 100%;
      max-width: 360px;
      padding: 28px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-xl);
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .celebration-title {
      font-size: 26px;
      font-weight: 900;
      color: var(--primary);
      letter-spacing: -0.5px;
    }
    .celebration-avatars {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 8px 0;
    }
    .celeb-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: var(--shadow-md);
      object-fit: cover;
    }
    .celeb-img-right { margin-left: -20px; }
    .heart-badge {
      width: 36px;
      height: 36px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      position: absolute;
      box-shadow: var(--shadow-md);
    }
    .btn-main {
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 24px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: background 0.15s;
    }
    .btn-main:hover { background: var(--primary-dark); }
    .btn-sub {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Full Detail Sheet Modal */
    .sheet-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      z-index: 45;
      display: none;
      justify-content: flex-end;
      flex-direction: column;
    }
    .sheet-overlay.active { display: flex; }
    .sheet-card {
      background: white;
      border-radius: 24px 24px 0 0;
      max-height: 88%;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: slideUp 0.25s ease-out;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .sheet-close-bar {
      width: 40px;
      height: 4px;
      background: #CBD5E1;
      border-radius: 2px;
      margin: 0 auto 6px auto;
      cursor: pointer;
    }
    .ai-card {
      background: linear-gradient(135deg, #F0FDFA, #FFF7ED);
      border: 1px solid #CCFBF1;
      border-radius: 16px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 800;
      color: var(--primary-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ai-headline { font-size: 13px; font-weight: 700; color: #0F172A; }
    .ai-harmony-item { font-size: 12px; color: #334155; display: flex; align-items: flex-start; gap: 6px; }
    .ai-harmony-item::before { content: "✔"; color: var(--primary); font-weight: 800; }
  </style>
</head>
<body>

  <!-- PHONE DEVICE WRAPPER -->
  <div class="app-frame">

    <!-- TOP APP BAR -->
    <header class="top-bar">
      <div class="brand-logo">
        FLATMATE
        <span class="brand-pill">TVM</span>
      </div>

      <div class="top-actions">
        <div class="location-indicator">
          📍 Kazhakkoottam
        </div>

        <!-- Quick Persona Switcher Menu -->
        <div class="persona-trigger" onclick="togglePersonaMenu()" title="Switch persona perspective">
          <img id="topBarAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar">
          <span id="topBarName">Adarsh</span>
        </div>
      </div>
    </header>

    <!-- MAIN SCREENS CONTAINER -->
    <main class="screen-content">

      <!-- SCREEN 1: DISCOVERY SWIPE FEED -->
      <section id="view-discover" class="screen-view active">
        <div class="deck-container">
          <div class="card-stack" id="cardStack">
            <!-- Swipe Cards are injected dynamically by JavaScript -->
          </div>

          <!-- Thumb-Zone Interactive Controls -->
          <div class="action-controls">
            <button class="action-btn action-rewind" onclick="handleRewind()" title="Rewind last swipe">↺</button>
            <button class="action-btn action-pass" onclick="handlePass()" title="Pass candidate">✕</button>
            <button class="action-btn action-superlike" onclick="handleSuperlike()" title="Superlike candidate">★</button>
            <button class="action-btn action-like" onclick="handleLike()" title="Like candidate">♥</button>
          </div>
        </div>
      </section>

      <!-- SCREEN 2: MATCHES & CONVERSATIONS HUB -->
      <section id="view-matches" class="screen-view">
        <div class="matches-header">
          <h2>Your Matches & Chats</h2>
          <p>Double opt-in mutual matches verified in Thiruvananthapuram</p>
        </div>

        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); padding: 8px 16px 0 16px; text-transform: uppercase;">
          New Matches
        </div>
        <div class="horizontal-matches" id="horizontalMatches">
          <!-- Injected dynamically -->
        </div>

        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); padding: 12px 16px 4px 16px; text-transform: uppercase;">
          Conversations
        </div>
        <div class="conversations-list" id="conversationsList">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- SCREEN 3: ACTIVE REAL-TIME CHAT -->
      <section id="view-chat" class="screen-view">
        <div class="chat-container">
          <div class="chat-top-header">
            <button class="chat-back-btn" onclick="switchView('matches')">←</button>
            <div class="chat-user-info">
              <img id="chatPartnerAvatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="chat-user-avatar" alt="Avatar">
              <div class="chat-user-text">
                <h4 id="chatPartnerName">Rahul Pillai</h4>
                <p>Online • 88% Match</p>
              </div>
            </div>
            <button class="icon-btn" onclick="openSafetyMenu()" title="Safety and reporting">🛡</button>
          </div>

          <div class="chat-safety-banner">
            🛡 Keep chats inside Flatmate. Phone numbers and UPI requests are monitored for your safety.
          </div>

          <div class="messages-stream" id="messagesStream">
            <!-- Messages populated dynamically -->
          </div>

          <!-- Suggested AI Icebreaker Bar -->
          <div class="chat-icebreaker-bar" id="icebreakerBar">
            <div class="icebreaker-chip" onclick="applyIcebreaker(this)">
              ✨ "Saw you're also an early bird! When do you head to Technopark?"
            </div>
            <div class="icebreaker-chip" onclick="applyIcebreaker(this)">
              ✨ "How do you like splitting groceries and utilities?"
            </div>
          </div>

          <div class="chat-input-bar">
            <input type="text" id="chatInput" class="chat-input" placeholder="Type a friendly message..." onkeypress="handleChatKeyPress(event)">
            <button class="chat-send-btn" onclick="sendMessage()">➤</button>
          </div>
        </div>
      </section>

      <!-- SCREEN 4: MY PROFILE & ONBOARDING SETTINGS -->
      <section id="view-profile" class="screen-view">
        <div class="profile-scroll">
          <div class="profile-header-card">
            <img id="myProfileAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" class="my-avatar" alt="My Profile">
            <div class="my-details">
              <h3 id="myProfileName">Adarsh Nair, 25</h3>
              <p id="myProfileOccupation">Backend Engineer @ TCS Technopark</p>
              <div style="margin-top: 4px; display: inline-block; background: #E0F2FE; color: #0369A1; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px;">
                ✔ Verified Professional
              </div>
            </div>
          </div>

          <!-- Modality Picker -->
          <div class="section-card">
            <div class="section-title">Your Discovery Modality</div>
            <p style="font-size: 12px; color: var(--text-muted);">
              Flatmate is person-first. Accommodation is completely optional. Choose how you want to discover flatmates:
            </p>

            <div class="modality-picker">
              <div class="modality-opt selected" onclick="selectModality('MODALITY_1', this)">
                <input type="radio" name="modality" class="modality-radio" checked>
                <div class="modality-opt-text">
                  <h5>Modality 1: I have a room available</h5>
                  <p>Offer a room in your flat and discover a compatible flatmate to move in.</p>
                </div>
              </div>

              <div class="modality-opt" onclick="selectModality('MODALITY_2', this)">
                <input type="radio" name="modality" class="modality-radio">
                <div class="modality-opt-text">
                  <h5>Modality 2: I need accommodation</h5>
                  <p>Find an existing room offered by a compatible person.</p>
                </div>
              </div>

              <div class="modality-opt" onclick="selectModality('MODALITY_3', this)">
                <input type="radio" name="modality" class="modality-radio">
                <div class="modality-opt-text">
                  <h5>Modality 3: In accommodation, want to relocate</h5>
                  <p>Currently renting, but looking to relocate with a compatible person.</p>
                </div>
              </div>

              <div class="modality-opt" onclick="selectModality('MODALITY_4', this)">
                <input type="radio" name="modality" class="modality-radio">
                <div class="modality-opt-text">
                  <h5>Modality 4: Team-up first (Person-First)</h5>
                  <p>Discover a compatible flatmate first, then apartment-hunt together!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dev Link Card -->
          <div class="section-card" style="background: #F8FAFC;">
            <div class="section-title" style="font-size: 13px;">Developer Controls</div>
            <p style="font-size: 12px; color: var(--text-muted);">
              Want to inspect raw JSON payloads and API responses? Open the developer API console:
            </p>
            <a href="/test-console" style="display: inline-block; padding: 8px 14px; background: white; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--primary); text-decoration: none;">
              ⚡ Open Developer API Console
            </a>
          </div>
        </div>
      </section>

    </main>

    <!-- BOTTOM TAB NAVIGATION BAR -->
    <nav class="bottom-nav">
      <button class="nav-item active" onclick="switchView('discover')">
        <span class="nav-icon">🔥</span>
        <span>Discover</span>
      </button>

      <button class="nav-item" onclick="switchView('matches')">
        <span class="nav-icon">💬</span>
        <span>Matches</span>
        <span class="nav-badge" id="matchesBadge">2</span>
      </button>

      <button class="nav-item" onclick="switchView('profile')">
        <span class="nav-icon">👤</span>
        <span>Profile</span>
      </button>
    </nav>

    <!-- MUTUAL MATCH CELEBRATION MODAL -->
    <div class="modal-overlay" id="celebrationModal">
      <div class="celebration-box">
        <div style="font-size: 40px;">🎉</div>
        <div class="celebration-title">It's a Mutual Match!</div>
        <p style="font-size: 13px; color: var(--text-muted);">
          You and <strong id="celebPartnerName">Rahul Pillai</strong> have mutually liked each other!
        </p>

        <div class="celebration-avatars">
          <img id="celebMyImg" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" class="celeb-img" alt="Me">
          <div class="heart-badge">♥</div>
          <img id="celebPartnerImg" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" class="celeb-img celeb-img-right" alt="Partner">
        </div>

        <button class="btn-main" onclick="openChatFromCelebration()">Say Hello Now 💬</button>
        <button class="btn-sub" onclick="closeCelebration()">Keep Swiping</button>
      </div>
    </div>

    <!-- CANDIDATE DETAIL & AI HARMONY SHEET -->
    <div class="sheet-overlay" id="detailSheet" onclick="closeDetailSheet(event)">
      <div class="sheet-card" onclick="event.stopPropagation()">
        <div class="sheet-close-bar" onclick="closeDetailSheet()"></div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <img id="sheetAvatar" src="" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
          <div>
            <h3 id="sheetName" style="font-size: 18px; font-weight: 800;">Adarsh Nair, 25</h3>
            <p id="sheetWork" style="font-size: 12px; color: var(--text-muted);">TCS Technopark Phase I</p>
          </div>
        </div>

        <div class="ai-card" id="sheetAiCard">
          <div class="ai-badge">✨ Assistive AI Harmony Analysis</div>
          <div class="ai-headline" id="sheetAiHeadline">Analyzing compatibility...</div>
          <div id="sheetAiHarmonies"></div>
          <div id="sheetAiCompromise" style="font-size: 11px; color: #B45309; margin-top: 4px;"></div>
        </div>

        <div>
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">About Me</div>
          <p id="sheetBio" style="font-size: 12px; color: #475569; line-height: 1.5;"></p>
        </div>

        <div>
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">Lifestyle Rhythms</div>
          <div id="sheetTags" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
        </div>

        <button class="btn-main" onclick="closeDetailSheet(); handleLike();" style="margin-top: 8px;">
          Like this Profile ♥
        </button>
      </div>
    </div>

  </div>

  <script>
    // App State
    let currentToken = null;
    let currentUser = null;
    let candidates = [];
    let currentCardIndex = 0;
    let activeMatchPartner = null;
    let activeConvId = null;

    // Pre-seeded personas
    const PERSONAS = {
      adarsh: {
        id: 'usr_adarsh_001',
        phone: '+919876543211',
        name: 'Adarsh Nair',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        work: 'Senior Backend Engineer @ TCS',
        modality: 'MODALITY_1'
      },
      sneha: {
        id: 'usr_sneha_002',
        phone: '+919876543212',
        name: 'Sneha Menon',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        work: 'M.Tech AI @ CET Trivandrum',
        modality: 'MODALITY_2'
      },
      rahul: {
        id: 'usr_rahul_003',
        phone: '+919876543213',
        name: 'Rahul Pillai',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        work: 'Financial Analyst @ UST Global',
        modality: 'MODALITY_3'
      },
      anjali: {
        id: 'usr_anjali_004',
        phone: '+919876543214',
        name: 'Anjali Krishna',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        work: 'HR Specialist @ Allianz Technopark',
        modality: 'MODALITY_4'
      }
    };

    // Initialize as Adarsh by default
    async function initApp() {
      await switchActivePersona(PERSONAS.adarsh);
    }

    async function switchActivePersona(persona) {
      currentUser = persona;
      document.getElementById('topBarAvatar').src = persona.avatar;
      document.getElementById('topBarName').textContent = persona.name.split(' ')[0];
      document.getElementById('myProfileAvatar').src = persona.avatar;
      document.getElementById('myProfileName').textContent = persona.name + ', 25';
      document.getElementById('myProfileOccupation').textContent = persona.work;

      // Login via OTP
      await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: persona.phone })
      });
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: persona.phone, otp: '123456' })
      });
      const data = await res.json();
      currentToken = data.accessToken;

      // Load feed and matches
      await loadFeed();
      await loadMatches();
    }

    function togglePersonaMenu() {
      const keys = Object.keys(PERSONAS);
      const nextKey = keys[(keys.indexOf(currentUser.id.split('_')[1]) + 1) % keys.length];
      switchActivePersona(PERSONAS[nextKey]);
    }

    // Load Discovery Feed
    async function loadFeed() {
      const stack = document.getElementById('cardStack');
      stack.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-muted);">Finding compatible flatmates near Kazhakkoottam...</div>';

      try {
        const res = await fetch('/api/v1/discovery/feed?limit=10', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        const data = await res.json();
        candidates = data.cards || [];
        currentCardIndex = 0;
        renderCards();
      } catch (e) {
        stack.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--danger);">Error loading feed.</div>';
      }
    }

    function renderCards() {
      const stack = document.getElementById('cardStack');
      stack.innerHTML = '';

      if (currentCardIndex >= candidates.length) {
        stack.innerHTML = 
          '<div style="width: 100%; height: 100%; background: white; border-radius: 24px; padding: 32px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 12px; box-shadow: var(--shadow-md);">' +
            '<div style="font-size: 48px;">🌟</div>' +
            '<h3 style="font-size: 18px; font-weight: 800;">You\\'ve Seen Everyone Nearby!</h3>' +
            '<p style="font-size: 13px; color: var(--text-muted); line-height: 1.4;">' +
              'You have reviewed all available flatmate candidates in this area. Rewind your last swipe or check back soon!' +
            '</p>' +
            '<button class="btn-main" onclick="handleRewind()" style="max-width: 200px; margin-top: 8px;">↺ Rewind Swipe</button>' +
          '</div>';
        return;
      }

      // Render top 2 cards
      for (let i = Math.min(candidates.length - 1, currentCardIndex + 1); i >= currentCardIndex; i--) {
        const c = candidates[i];
        const isTop = (i === currentCardIndex);
        const cardEl = document.createElement('div');
        cardEl.className = 'swipe-card';
        cardEl.id = 'card-' + i;
        cardEl.style.zIndex = isTop ? '10' : '5';
        cardEl.style.transform = isTop ? 'scale(1)' : 'scale(0.95) translateY(12px)';

        const modalityLabels = {
          MODALITY_1: 'Modality 1: Has Room (Offering)',
          MODALITY_2: 'Modality 2: Needs Room',
          MODALITY_3: 'Modality 3: Relocating',
          MODALITY_4: 'Modality 4: Team-up First'
        };

        const highlightsHtml = (c.topHighlights || []).map(h => '<span class="lifestyle-chip">' + h + '</span>').join('');

        cardEl.innerHTML = 
          '<div class="card-photo-box" onclick="openDetailSheet(' + i + ')">' +
            '<img src="' + (c.photos && c.photos[0] ? c.photos[0].photoUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80') + '" class="card-photo">' +
            '<div class="card-gradient"></div>' +
            '<div class="card-top-badges">' +
              '<div class="compat-badge">★ ' + c.compatibilityScore + '% Compatibility</div>' +
            '</div>' +
            '<div class="stamp-badge stamp-like" id="stamp-like-' + i + '">LIKE</div>' +
            '<div class="stamp-badge stamp-pass" id="stamp-pass-' + i + '">PASS</div>' +
            '<div class="card-info-overlay">' +
              '<div class="card-name-age">' + c.displayName + ', ' + c.age + ' <span class="verify-icon">✔</span></div>' +
              '<div class="card-workplace">' + c.occupation + ' • ' + (c.collegeOrCompany || 'Trivandrum') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card-content-box" onclick="openDetailSheet(' + i + ')">' +
            '<div class="card-modality-pill">🏠 ' + (modalityLabels[c.modality] || c.modality) + '</div>' +
            '<p class="card-bio">' + (c.bio || 'Tech professional looking for a quiet, compatible flatmate near Technopark.') + '</p>' +
            '<div class="card-tags">' + highlightsHtml + '</div>' +
          '</div>';

        stack.appendChild(cardEl);

        if (isTop) {
          attachSwipePhysics(cardEl, i);
        }
      }
    }

    // Touch & Mouse Drag Physics
    function attachSwipePhysics(card, index) {
      let startX = 0, startY = 0, currentX = 0, currentY = 0;
      let isDragging = false;

      function onStart(e) {
        if (e.target.closest('.card-content-box') && Math.abs(currentX) < 10) return;
        isDragging = true;
        card.classList.add('dragging');
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
      }

      function onMove(e) {
        if (!isDragging) return;
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const y = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
        currentX = x - startX;
        currentY = y - startY;

        const rotate = currentX * 0.08;
        card.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) rotate(' + rotate + 'deg)';

        // Stamp opacity
        const likeStamp = document.getElementById('stamp-like-' + index);
        const passStamp = document.getElementById('stamp-pass-' + index);
        if (currentX > 20) {
          likeStamp.style.opacity = Math.min(1, currentX / 80);
          passStamp.style.opacity = 0;
        } else if (currentX < -20) {
          passStamp.style.opacity = Math.min(1, -currentX / 80);
          likeStamp.style.opacity = 0;
        } else {
          likeStamp.style.opacity = 0;
          passStamp.style.opacity = 0;
        }
      }

      function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');

        const threshold = 90;
        if (currentX > threshold) {
          commitSwipe(card, 'LIKE');
        } else if (currentX < -threshold) {
          commitSwipe(card, 'PASS');
        } else {
          // Snap back
          card.style.transform = 'translate(0px, 0px) rotate(0deg)';
          document.getElementById('stamp-like-' + index).style.opacity = 0;
          document.getElementById('stamp-pass-' + index).style.opacity = 0;
        }
      }

      card.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      card.addEventListener('touchstart', onStart);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('touchend', onEnd);
    }

    async function commitSwipe(cardEl, action) {
      const candidate = candidates[currentCardIndex];
      const dir = (action === 'LIKE') ? 1 : -1;

      cardEl.style.transition = 'transform 0.35s ease-out, opacity 0.3s';
      cardEl.style.transform = 'translate(' + (dir * 500) + 'px, 50px) rotate(' + (dir * 30) + 'deg)';
      cardEl.style.opacity = '0';

      try {
        const res = await fetch('/api/v1/discovery/swipe', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ candidateUserId: candidate.userId, action: action })
        });
        const data = await res.json();

        setTimeout(() => {
          currentCardIndex++;
          renderCards();

          // If mutual match!
          if (data && (data.isMutualMatch || data.isMatch)) {
            triggerCelebration(candidate);
          }
        }, 200);

      } catch (err) {
        currentCardIndex++;
        renderCards();
      }
    }

    function handleLike() {
      const topCard = document.getElementById('card-' + currentCardIndex);
      if (topCard) commitSwipe(topCard, 'LIKE');
    }

    function handlePass() {
      const topCard = document.getElementById('card-' + currentCardIndex);
      if (topCard) commitSwipe(topCard, 'PASS');
    }

    function handleSuperlike() {
      handleLike();
    }

    async function handleRewind() {
      try {
        await fetch('/api/v1/discovery/rewind', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (currentCardIndex > 0) currentCardIndex--;
        renderCards();
      } catch (e) {
        alert('Cannot rewind further.');
      }
    }

    // Match Celebration
    function triggerCelebration(partner) {
      activeMatchPartner = partner;
      document.getElementById('celebPartnerName').textContent = partner.displayName;
      document.getElementById('celebMyImg').src = currentUser.avatar;
      document.getElementById('celebPartnerImg').src = partner.photos && partner.photos[0] ? partner.photos[0].photoUrl : partner.avatar;
      document.getElementById('celebrationModal').classList.add('active');
    }

    function closeCelebration() {
      document.getElementById('celebrationModal').classList.remove('active');
    }

    function openChatFromCelebration() {
      closeCelebration();
      openChatWithUser(activeMatchPartner);
    }

    // Matches & Messaging
    async function loadMatches() {
      try {
        const res = await fetch('/api/v1/matches', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        const data = await res.json();
        const matches = data.matches || [];

        // Render horizontal bubbles
        const bubbleBox = document.getElementById('horizontalMatches');
        const list = document.getElementById('conversationsList');
        document.getElementById('matchesBadge').textContent = matches.length;

        if (matches.length === 0) {
          bubbleBox.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); padding: 8px;">No matches yet. Swipe LIKE to discover flatmates!</div>';
          list.innerHTML = '<div style="font-size: 13px; color: var(--text-muted); padding: 24px; text-align: center;">No active chats yet.</div>';
          return;
        }

        bubbleBox.innerHTML = matches.map(m => 
          '<div class="match-bubble" onclick="openChatWithUser(' + JSON.stringify(m.candidate).replace(/"/g, '&quot;') + ', \\'' + m.conversationId + '\\')">' +
            '<img src="' + (m.candidate.photos && m.candidate.photos[0] ? m.candidate.photos[0].photoUrl : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80') + '" class="match-bubble-avatar">' +
            '<span class="match-bubble-name">' + m.candidate.displayName.split(' ')[0] + '</span>' +
          '</div>'
        ).join('');

        list.innerHTML = matches.map(m => 
          '<div class="conv-item" onclick="openChatWithUser(' + JSON.stringify(m.candidate).replace(/"/g, '&quot;') + ', \\'' + m.conversationId + '\\')">' +
            '<img src="' + (m.candidate.photos && m.candidate.photos[0] ? m.candidate.photos[0].photoUrl : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80') + '" class="conv-avatar">' +
            '<div class="conv-content">' +
              '<div class="conv-title-row">' +
                '<span class="conv-name">' + m.candidate.displayName + '</span>' +
                '<span class="conv-time">Just now</span>' +
              '</div>' +
              '<p class="conv-preview">★ ' + m.compatibilityScore + '% Compatibility • Tap to chat</p>' +
            '</div>' +
          '</div>'
        ).join('');

      } catch (e) {
        // Fallback
      }
    }

    function openChatWithUser(candidate, convId) {
      activeMatchPartner = candidate;
      activeConvId = convId || 'conv_demo_01';
      document.getElementById('chatPartnerName').textContent = candidate.displayName;
      document.getElementById('chatPartnerAvatar').src = candidate.photos && candidate.photos[0] ? candidate.photos[0].photoUrl : (candidate.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80');

      switchView('chat');
      loadChatMessages();
    }

    async function loadChatMessages() {
      const stream = document.getElementById('messagesStream');
      stream.innerHTML = 
        '<div class="msg-bubble msg-in">' +
          'Hi ' + currentUser.name.split(' ')[0] + '! Excited to connect. I saw our lifestyles have high alignment!' +
          '<div class="msg-time">10:42 AM</div>' +
        '</div>';
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;

      const stream = document.getElementById('messagesStream');
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append outgoing message
      const msgDiv = document.createElement('div');
      msgDiv.className = 'msg-bubble msg-out';
      msgDiv.innerHTML = text + '<div class="msg-time">' + now + '</div>';
      stream.appendChild(msgDiv);
      input.value = '';

      // Check for contact harvesting test
      if (text.match(/(\\+91|\\d{10}|upi:|@okaxis)/i)) {
        const warnDiv = document.createElement('div');
        warnDiv.className = 'msg-warning';
        warnDiv.innerHTML = '🛡 Safety Notice: For your security, keep conversations within Flatmate until you meet in person.';
        stream.appendChild(warnDiv);
      } else {
        // Simulate friendly reply after 1.2s
        setTimeout(() => {
          const replyDiv = document.createElement('div');
          replyDiv.className = 'msg-bubble msg-in';
          replyDiv.innerHTML = 'Sounds great! Are you free this weekend to meet for a coffee near Technopark Phase I?' +
            '<div class="msg-time">' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>';
          stream.appendChild(replyDiv);
          stream.scrollTop = stream.scrollHeight;
        }, 1200);
      }

      stream.scrollTop = stream.scrollHeight;
    }

    function handleChatKeyPress(e) {
      if (e.key === 'Enter') sendMessage();
    }

    function applyIcebreaker(chip) {
      document.getElementById('chatInput').value = chip.textContent.replace('✨', '').trim().replace(/^"|"$/g, '');
    }

    // Detail Sheet & AI Analysis
    async function openDetailSheet(index) {
      const c = candidates[index];
      if (!c) return;

      document.getElementById('sheetName').textContent = c.displayName + ', ' + c.age;
      document.getElementById('sheetWork').textContent = c.occupation + ' • ' + (c.collegeOrCompany || 'Trivandrum');
      document.getElementById('sheetAvatar').src = c.photos && c.photos[0] ? c.photos[0].photoUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
      document.getElementById('sheetBio').textContent = c.bio || 'Professional looking for a compatible flatmate near Kazhakkoottam.';

      document.getElementById('sheetTags').innerHTML = (c.topHighlights || []).map(h => 
        '<span class="lifestyle-chip">' + h + '</span>'
      ).join('');

      document.getElementById('detailSheet').classList.add('active');

      // Request live AI harmony explanation
      document.getElementById('sheetAiHeadline').textContent = 'Generating AI compatibility explanation...';
      document.getElementById('sheetAiHarmonies').innerHTML = '';
      document.getElementById('sheetAiCompromise').textContent = '';

      try {
        const res = await fetch('/api/v1/ai/harmony-explanation', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ candidateUserId: c.userId })
        });
        const data = await res.json();
        document.getElementById('sheetAiHeadline').textContent = data.headline || 'High compatibility alignment';
        document.getElementById('sheetAiHarmonies').innerHTML = (data.lifestyleHarmonies || []).map(h => 
          '<div class="ai-harmony-item">' + h + '</div>'
        ).join('');
        document.getElementById('sheetAiCompromise').textContent = data.potentialCompromises ? 'Note: ' + data.potentialCompromises : '';
      } catch (e) {
        document.getElementById('sheetAiHeadline').textContent = 'Strong mutual living harmony';
      }
    }

    function closeDetailSheet() {
      document.getElementById('detailSheet').classList.remove('active');
    }

    // Navigation View Switcher
    function switchView(viewName) {
      document.querySelectorAll('.screen-view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

      const target = document.getElementById('view-' + viewName);
      if (target) target.classList.add('active');

      const navBtn = Array.from(document.querySelectorAll('.nav-item')).find(n => n.textContent.toLowerCase().includes(viewName));
      if (navBtn) navBtn.classList.add('active');

      if (viewName === 'discover') renderCards();
      if (viewName === 'matches') loadMatches();
    }

    function selectModality(mod, el) {
      document.querySelectorAll('.modality-opt').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      el.querySelector('input').checked = true;

      // Update modality on server
      fetch('/api/v1/profiles/me', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + currentToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modality: mod })
      }).then(() => loadFeed());
    }

    function openSafetyMenu() {
      if (confirm('Safety Options:\\n\\n1. Block ' + activeMatchPartner.displayName + ' (hides profile and ends conversation)\\n2. Report for inappropriate behavior\\n\\nWould you like to block this user?')) {
        fetch('/api/v1/safety/blocks', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ targetUserId: activeMatchPartner.userId, reason: 'User choice' })
        }).then(() => {
          alert('User blocked successfully.');
          switchView('matches');
        });
      }
    }

    // Initialize on boot
    initApp();
  </script>
</body>
</html>`;
}

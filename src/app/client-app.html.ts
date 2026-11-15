export function renderClientAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buddy – Person-First Flatmate & Roommate Discovery | Thiruvananthapuram</title>
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
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top Sticky App Header */
    .app-header {
      background: #FFFFFF;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      height: 64px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
    }
    .brand-logo {
      font-weight: 900;
      font-size: 20px;
      color: var(--primary);
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-pill {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .brand-location {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      background: #F1F5F9;
      padding: 4px 10px;
      border-radius: 20px;
      display: none;
    }
    @media (min-width: 640px) {
      .brand-location { display: flex; align-items: center; gap: 4px; }
    }

    /* Desktop Navigation Tabs in Header */
    .desktop-nav {
      display: none;
      align-items: center;
      gap: 6px;
    }
    @media (min-width: 860px) {
      .desktop-nav { display: flex; }
    }
    .nav-btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-btn:hover { background: #F1F5F9; color: var(--text); }
    .nav-btn.active { background: var(--primary-light); color: var(--primary-dark); font-weight: 700; }
    .badge-count {
      background: var(--accent);
      color: white;
      font-size: 11px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 10px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .restart-reg-btn {
      background: linear-gradient(135deg, #0D9488, #0F766E);
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.15s;
    }
    .restart-reg-btn:hover { opacity: 0.92; }

    .persona-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 1px solid var(--border);
      padding: 4px 10px 4px 5px;
      border-radius: 24px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .persona-badge:hover { border-color: var(--primary); }
    .persona-badge img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
    .persona-badge span { font-size: 13px; font-weight: 700; color: var(--text); }

    /* Auth & Access Control Visibility State */
    body.unauthenticated .desktop-nav,
    body.unauthenticated .header-actions,
    body.unauthenticated .mobile-bottom-nav,
    body.onboarding-mode .desktop-nav,
    body.onboarding-mode .header-actions,
    body.onboarding-mode .mobile-bottom-nav {
      display: none !important;
    }

    /* Login & Authentication Gateway Card */
    .login-container {
      max-width: 460px;
      width: 100%;
      margin: 30px auto;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 32px;
      box-shadow: var(--shadow-xl);
      text-align: center;
    }
    .login-brand-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: 900;
      margin: 0 auto 16px auto;
      box-shadow: 0 8px 16px rgba(13, 148, 136, 0.25);
    }
    .login-toggle-tabs {
      display: flex;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 12px;
      margin: 20px 0;
    }
    .login-toggle-tab {
      flex: 1;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      border: none;
      background: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .login-toggle-tab.active {
      background: #FFFFFF;
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }
    .login-persona-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 14px;
      text-align: left;
    }
    .login-persona-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: #F8FAFC;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .login-persona-chip:hover {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    .login-persona-chip img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    .login-persona-chip .name {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
    }
    .login-persona-chip .role {
      font-size: 10px;
      color: var(--text-muted);
    }

    /* Mobile Bottom Navigation Bar (Screens < 860px) */
    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
      box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
    }
    @media (min-width: 860px) {
      .mobile-bottom-nav { display: none; }
    }
    .m-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: var(--text-muted);
      cursor: pointer;
      background: none;
      border: none;
      flex: 1;
      height: 100%;
      font-size: 10px;
      font-weight: 600;
      position: relative;
    }
    .m-nav-item.active { color: var(--primary); font-weight: 700; }
    .m-nav-icon { font-size: 18px; }

    /* Main Content Area */
    .app-main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      padding-bottom: 80px;
    }
    @media (min-width: 860px) {
      .app-main { padding-bottom: 40px; }
    }

    .view-panel { display: none; width: 100%; flex-direction: column; }
    .view-panel.active { display: flex; animation: fadeIn 0.2s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* -------------------------------------------------------------
       PROGRESSIVE CONVERSATIONAL ONBOARDING (BUMBLE-STYLE)
       ------------------------------------------------------------- */
    .wizard-container {
      max-width: 540px;
      width: 100%;
      margin: 20px auto;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px 28px;
      box-shadow: var(--shadow-xl);
    }
    @media (max-width: 600px) {
      .wizard-container {
        padding: 20px 16px;
        margin: 8px auto;
        border-radius: 20px;
        border: none;
        box-shadow: none;
        background: transparent;
      }
    }

    .onboarding-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      min-height: 36px;
    }
    .onboarding-back-btn {
      background: #F1F5F9;
      border: none;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .onboarding-back-btn:hover {
      background: #E2E8F0;
    }
    .onboarding-step-counter {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .onboarding-exit-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
    }
    .onboarding-exit-btn:hover {
      color: var(--danger);
    }

    .wizard-progress-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 28px;
      position: relative;
    }
    .wizard-progress-bar::before {
      content: "";
      position: absolute;
      top: 14px;
      left: 8%;
      right: 8%;
      height: 3px;
      background: #E2E8F0;
      z-index: 1;
    }
    .progress-fill {
      position: absolute;
      top: 14px;
      left: 8%;
      height: 3px;
      background: var(--primary);
      z-index: 2;
      transition: width 0.3s ease;
      width: 0%;
    }
    .step-node {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .step-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: white;
      border: 2px solid #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: var(--text-muted);
      transition: all 0.2s;
    }
    .step-node.active .step-circle {
      border-color: var(--primary);
      background: var(--primary);
      color: white;
      box-shadow: 0 0 0 4px var(--primary-light);
    }
    .step-node.completed .step-circle {
      border-color: var(--primary);
      background: var(--primary);
      color: white;
    }
    .step-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
    }
    .step-node.active .step-label { color: var(--primary-dark); font-weight: 800; }
    .step-node.completed .step-label { color: var(--primary); }

    .wizard-step { display: none; flex-direction: column; gap: 20px; }
    .wizard-step.active { display: flex; animation: slideLeft 0.25s ease-out; }
    @keyframes slideLeft { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .step-title-group h2 { font-size: 24px; font-weight: 900; color: var(--text); letter-spacing: -0.5px; }
    .step-title-group p { font-size: 14px; color: var(--text-muted); margin-top: 6px; line-height: 1.5; }

    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 13.5px; font-weight: 700; color: var(--text); }
    .form-group input, .form-group select, .form-group textarea {
      padding: 13px 16px;
      border: 1.5px solid var(--border);
      border-radius: 12px;
      font-size: 15px;
      outline: none;
      transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

    /* Interactive Suburb Pills */
    .suburb-pills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
    }
    .suburb-pill {
      padding: 7px 13px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: #F8FAFC;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .suburb-pill:hover {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    .suburb-pill.selected {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 2px 4px rgba(13, 148, 136, 0.25);
    }

    /* Modality Cards in Wizard */
    .modality-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 640px) { .modality-cards-grid { grid-template-columns: 1fr; } }
    .modality-select-card {
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.15s ease;
      background: white;
      position: relative;
    }
    .modality-select-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .modality-select-card.selected {
      border-color: var(--primary);
      background: var(--primary-50);
      box-shadow: 0 0 0 2px var(--primary);
    }
    .modality-icon { font-size: 28px; }
    .modality-title { font-size: 14px; font-weight: 800; color: var(--text); }
    .modality-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

    /* Lifestyle Question Cards */
    .lifestyle-question {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .question-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .dealbreaker-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-dark);
      cursor: pointer;
    }

    /* Buttons */
    .btn {
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-secondary { background: #E2E8F0; color: var(--text); }
    .btn-secondary:hover { background: #CBD5E1; }
    .btn-outline { background: white; border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
    .wizard-actions { display: flex; justify-content: space-between; margin-top: 10px; }

    /* -------------------------------------------------------------
       SCREEN: DISCOVERY STAGE (RESPONSIVE FLUID LAYOUT)
       ------------------------------------------------------------- */
    .discover-stage {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }
    @media (min-width: 960px) {
      .discover-stage {
        grid-template-columns: 460px 1fr;
        align-items: start;
      }
    }

    .card-deck-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
    .card-stack {
      width: 100%;
      height: 540px;
      position: relative;
    }
    .swipe-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      background: white;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: grab;
      user-select: none;
      touch-action: none;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
    }
    .swipe-card.dragging { cursor: grabbing; transition: none; }
    .card-photo-box {
      width: 100%;
      height: 64%;
      position: relative;
      background: #1E293B;
    }
    .card-photo { width: 100%; height: 100%; object-fit: cover; }
    .card-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 65%;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
    }
    .card-top-badges {
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;
    }
    .compat-badge {
      background: rgba(13, 148, 136, 0.95);
      backdrop-filter: blur(8px);
      color: white;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 20px;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .stamp-badge {
      position: absolute;
      top: 30px;
      font-size: 26px;
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
    .stamp-like { right: 24px; color: #10B981; border-color: #10B981; transform: rotate(15deg); }
    .stamp-pass { left: 24px; color: #EF4444; border-color: #EF4444; transform: rotate(-15deg); }

    .card-info-overlay {
      position: absolute;
      bottom: 14px;
      left: 16px;
      right: 16px;
      color: white;
    }
    .card-name-age { font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
    .verify-icon { color: #38BDF8; font-size: 18px; }
    .card-workplace { font-size: 13px; color: #E2E8F0; margin-top: 2px; }

    .card-content-box {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      font-size: 13px;
      color: #334155;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .lifestyle-chip {
      font-size: 11px;
      background: #F1F5F9;
      color: #334155;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 600;
    }

    /* Thumb-zone / Action Buttons */
    .action-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      padding: 10px 0;
      width: 100%;
    }
    .action-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: #FFFFFF;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .action-btn:hover { transform: scale(1.1); box-shadow: var(--shadow-lg); }
    .action-btn:active { transform: scale(0.95); }
    .action-rewind { width: 46px; height: 46px; color: var(--warning); font-size: 20px; }
    .action-pass { color: var(--danger); font-size: 26px; }
    .action-superlike { width: 46px; height: 46px; color: #3B82F6; font-size: 20px; }
    .action-like { color: var(--primary); font-size: 28px; }

    /* Desktop Side Info Panel */
    .desktop-side-panel {
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: var(--shadow-sm);
    }
    .side-panel-title { font-size: 15px; font-weight: 800; color: var(--text); }
    .ai-summary-card {
      background: linear-gradient(135deg, #F0FDFA, #FFF7ED);
      border: 1px solid #CCFBF1;
      border-radius: 14px;
      padding: 16px;
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
    .ai-headline { font-size: 14px; font-weight: 700; color: var(--text); }
    .ai-harmonies-list { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .ai-harmony-row { font-size: 12px; color: #334155; display: flex; align-items: flex-start; gap: 6px; }
    .ai-harmony-row::before { content: "✔"; color: var(--primary); font-weight: 800; }

    /* -------------------------------------------------------------
       SCREEN: MATCHES & ACTIVE CHAT SPLIT PANE
       ------------------------------------------------------------- */
    .chat-split-container {
      display: grid;
      grid-template-columns: 1fr;
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      height: 700px;
      box-shadow: var(--shadow-md);
    }
    @media (min-width: 800px) {
      .chat-split-container { grid-template-columns: 320px 1fr; }
    }
    .matches-sidebar {
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      background: white;
    }
    .matches-sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .matches-sidebar-header h3 { font-size: 16px; font-weight: 800; }
    .matches-sidebar-header p { font-size: 12px; color: var(--text-muted); }
    .conv-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
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
    .conv-item.active { background: var(--primary-light); }
    .conv-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
    .conv-info { flex: 1; overflow: hidden; }
    .conv-top-row { display: flex; justify-content: space-between; align-items: baseline; }
    .conv-name { font-size: 14px; font-weight: 700; }
    .conv-snippet { font-size: 12px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }

    /* Active Chat View */
    .active-chat-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #F8FAFC;
    }
    .chat-header {
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chat-partner-box { display: flex; align-items: center; gap: 12px; }
    .chat-partner-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
    .chat-partner-name { font-size: 15px; font-weight: 800; }
    .chat-partner-status { font-size: 11px; color: var(--success); font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .chat-partner-status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--success); }

    .chat-safety-banner {
      background: var(--accent-light);
      border-bottom: 1px solid #FED7AA;
      padding: 8px 16px;
      font-size: 12px;
      color: #9A3412;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .messages-stream {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .msg-bubble {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.45;
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
      box-shadow: var(--shadow-sm);
    }
    .msg-time { font-size: 10px; opacity: 0.7; margin-top: 4px; text-align: right; }
    .msg-warning {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #991B1B;
      font-size: 11px;
      padding: 6px 12px;
      border-radius: 8px;
      margin-top: 4px;
    }

    .chat-input-bar {
      padding: 14px 20px;
      background: white;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 24px;
      font-size: 14px;
      outline: none;
    }
    .chat-input:focus { border-color: var(--primary); }
    .chat-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* -------------------------------------------------------------
       MUTUAL MATCH CELEBRATION MODAL
       ------------------------------------------------------------- */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      z-index: 200;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .modal-backdrop.active { display: flex; }
    .modal-box {
      background: white;
      border-radius: 24px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-xl);
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .celeb-avatars { display: flex; align-items: center; justify-content: center; margin: 10px 0; }
    .celeb-avatar {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: var(--shadow-md);
      object-fit: cover;
    }
    .celeb-avatar-right { margin-left: -24px; }
  </style>
</head>
<body>

  <!-- TOP APPLICATION HEADER (FLUID RESPONSIVE) -->
  <header class="app-header">
    <div class="header-inner">
      <div class="brand" onclick="navigateTab('discover')">
        <div class="brand-logo">
          BUDDY
        </div>
        <div class="brand-location">
          📍 Thiruvananthapuram, Kerala
        </div>
      </div>

      <!-- Desktop Nav Links -->
      <nav class="desktop-nav">
        <button class="nav-btn active" id="dnav-discover" onclick="navigateTab('discover')">
          🔥 Discover
        </button>
        <button class="nav-btn" id="dnav-matches" onclick="navigateTab('matches')">
          💬 Matches & Chat
          <span class="badge-count" id="headerMatchesBadge">2</span>
        </button>
        <button class="nav-btn" id="dnav-rooms" onclick="navigateTab('rooms')">
          🏠 Room Listings
        </button>
        <button class="nav-btn" id="dnav-profile" onclick="navigateTab('profile')">
          👤 My Profile
        </button>
      </nav>

      <!-- Action items -->
      <div class="header-actions">
        <button class="restart-reg-btn" onclick="startNewRegistration()">
          ✨ New Registration
        </button>

        <div class="persona-badge" onclick="cyclePersona()" title="Quick switch active demo persona">
          <img id="headerUserAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar">
          <span id="headerUserName">Adarsh</span>
        </div>

        <button class="btn btn-outline" style="font-size: 12px; padding: 6px 12px; border-radius: 8px;" onclick="handleLogout()" title="Log Out">
          Log Out
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN VIEWPORT -->
  <main class="app-main">

    <!-- =========================================================
         VIEW 0: AUTHENTICATION & LOGIN GATEWAY
         ========================================================= -->
    <section id="view-login" class="view-panel active">
      <div class="login-container">
        <div class="login-brand-icon">🤝</div>
        <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: var(--text); margin-bottom: 6px;">
          Welcome to Buddy
        </h1>
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
          Person-first flatmate & roommate discovery in Thiruvananthapuram. Sign in to access your portal.
        </p>

        <div id="loginAlertBox" style="display: none; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin: 16px 0; font-weight: 600;"></div>

        <div class="login-toggle-tabs">
          <button class="login-toggle-tab active" id="tabModeSignIn" onclick="setAuthMode('signin')">Sign In</button>
          <button class="login-toggle-tab" id="tabModeRegister" onclick="setAuthMode('register')">Create Account</button>
        </div>

        <!-- Phone input group -->
        <div style="text-align: left; margin-bottom: 16px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--text); display: block; margin-bottom: 6px;">
            Mobile Phone Number
          </label>
          <input type="text" id="loginPhoneInput" value="+919876543211" placeholder="+91 98765 43210" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 12px; font-size: 15px; font-weight: 600;">
        </div>

        <div id="loginOtpGroup" style="display: none; text-align: left; margin-bottom: 16px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--text); display: block; margin-bottom: 6px;">
            Enter 6-Digit OTP Code
          </label>
          <input type="text" id="loginOtpInput" value="123456" placeholder="123456" maxlength="6" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--primary); border-radius: 12px; font-size: 18px; font-weight: 800; letter-spacing: 4px; text-align: center;">
          <p style="font-size: 12px; color: var(--primary-dark); margin-top: 6px;">✔ Universal dev OTP code is <code>123456</code></p>
        </div>

        <button class="btn btn-primary" id="btnLoginAction" style="width: 100%; padding: 14px; font-size: 15px; font-weight: 800; border-radius: 12px; justify-content: center;" onclick="handleLoginSubmit()">
          Send OTP Code →
        </button>

        <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 20px;">
          <p style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
            ⚡ Quick Sign In as Demo Persona
          </p>
          <div class="login-persona-grid">
            <div class="login-persona-chip" onclick="quickLoginPersona('adarsh')">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Adarsh">
              <div>
                <div class="name">Adarsh Nair</div>
                <div class="role">Has Room (M1)</div>
              </div>
            </div>
            <div class="login-persona-chip" onclick="quickLoginPersona('kiran')">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Kiran">
              <div>
                <div class="name">Kiran Kumar</div>
                <div class="role">Needs Room (M2)</div>
              </div>
            </div>
            <div class="login-persona-chip" onclick="quickLoginPersona('rahul')">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Rahul">
              <div>
                <div class="name">Rahul Pillai</div>
                <div class="role">Relocating (M3)</div>
              </div>
            </div>
            <div class="login-persona-chip" onclick="quickLoginPersona('anjali')">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Anjali">
              <div>
                <div class="name">Anjali Krishna</div>
                <div class="role">Team-Up (M4)</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- =========================================================
         VIEW 1: REGISTRATION & ONBOARDING WIZARD
         ========================================================= -->
    <!-- =========================================================
         VIEW 1: REGISTRATION & ONBOARDING WIZARD (CONVERSATIONAL BUMBLE-STYLE)
         ========================================================= -->
    <section id="view-registration" class="view-panel active">
      <div class="wizard-container">
        
        <!-- Onboarding Top Bar with Back Button & Step Counter -->
        <div class="onboarding-top-bar">
          <button class="onboarding-back-btn" id="obBackBtn" onclick="goBackOnboardingStep()" style="display: none;">
            ← Back
          </button>
          <span class="onboarding-step-counter" id="obStepCounter">Step 1 of 12</span>
          <button class="onboarding-exit-btn" onclick="handleLogout()" title="Cancel and Return to Sign In">✕ Exit</button>
        </div>

        <!-- 5 Subsections Progress Bar with Completion Ticks -->
        <div class="wizard-progress-bar">
          <div class="progress-fill" id="wizardProgressFill"></div>
          <div class="step-node active" id="node-step-1">
            <div class="step-circle" id="circle-step-1">1</div>
            <span class="step-label">Verify</span>
          </div>
          <div class="step-node" id="node-step-2">
            <div class="step-circle" id="circle-step-2">2</div>
            <span class="step-label">Basics</span>
          </div>
          <div class="step-node" id="node-step-3">
            <div class="step-circle" id="circle-step-3">3</div>
            <span class="step-label">Housing</span>
          </div>
          <div class="step-node" id="node-step-4">
            <div class="step-circle" id="circle-step-4">4</div>
            <span class="step-label">Lifestyle</span>
          </div>
          <div class="step-node" id="node-step-5">
            <div class="step-circle" id="circle-step-5">5</div>
            <span class="step-label">Finish</span>
          </div>
        </div>

        <!-- SUBSECTION 1: MANDATORY VERIFICATION -->
        <!-- STEP 1: MOBILE OTP AUTHENTICATION -->
        <div class="wizard-step active" id="reg-step-1">
          <div class="step-title-group">
            <h2>Welcome to Buddy 👋</h2>
            <p>Person-first flatmate & roommate discovery in Thiruvananthapuram. Let's begin by verifying your mobile number.</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Mobile Phone Number</label>
            <input type="text" id="regPhone" value="+919876543210" placeholder="+91 98765 43210">
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" style="font-size: 12px; padding: 6px 12px;" onclick="autofillPhone('+919876543210')">
              Use Test Phone (+91 9876543210)
            </button>
          </div>

          <div id="otpInputGroup" style="display: none; flex-direction: column; gap: 6px; margin-top: 10px;">
            <label style="font-size: 13.5px; font-weight: 700;">Enter 6-Digit Verification Code</label>
            <input type="text" id="regOtp" value="123456" placeholder="123456" maxlength="6">
            <p style="font-size: 11.5px; color: var(--primary-dark);">✔ Universal dev OTP code is <code>123456</code></p>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <div></div>
            <button class="btn btn-primary" id="btnStep1" onclick="handleStep1Auth()">
              Request OTP Code →
            </button>
          </div>
        </div>

        <!-- SUBSECTION 2: BASIC IDENTITY -->
        <!-- STEP 2: DISPLAY NAME -->
        <div class="wizard-step" id="reg-step-2">
          <div class="step-title-group">
            <h2>What should we call you?</h2>
            <p>Your name is how potential roommates and flatmates will know you on Buddy.</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Your Full Name</label>
            <input type="text" id="regName" value="Kiran Kumar" placeholder="e.g. Kiran Kumar" onkeypress="if(event.key==='Enter') goToOnboardingStep(3)">
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(3)">Next: Gender →</button>
          </div>
        </div>

        <!-- STEP 3: GENDER & PREFERRED GENDER -->
        <div class="wizard-step" id="reg-step-3">
          <div class="step-title-group">
            <h2>Gender & Living Preferences</h2>
            <p>Tell us your gender and who you are comfortable sharing an apartment or flat with.</p>
          </div>

          <div class="form-group">
            <label>I identify as</label>
            <select id="regGender">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NON_BINARY">Non-Binary / Other</option>
            </select>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>I prefer living with</label>
            <select id="regPrefGender">
              <option value="ANY">Any Gender (Open-minded co-living)</option>
              <option value="MALE">Male Flatmates Only</option>
              <option value="FEMALE">Female Flatmates Only</option>
            </select>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(4)">Next: Work & Age →</button>
          </div>
        </div>

        <!-- STEP 4: AGE & OCCUPATION -->
        <div class="wizard-step" id="reg-step-4">
          <div class="step-title-group">
            <h2>When's your birthday & what do you do?</h2>
            <p>Age verification ensures a safe 18+ community in Trivandrum.</p>
          </div>

          <div class="form-group">
            <label>Date of Birth</label>
            <input type="date" id="regBirthDate" value="1998-05-15">
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Occupation & Company or College</label>
            <input type="text" id="regOccupation" value="Frontend Engineer @ IBS Software" placeholder="e.g. Software Engineer @ Infosys, Student @ CET">
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Short Bio (Optional)</label>
            <textarea id="regBio" rows="2" placeholder="Tell potential flatmates a little about your routine and vibe...">Techie looking for a relaxed, clean flatmate near Technopark Phase I. Non-smoker, enjoys football on weekends and quiet evenings.</textarea>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="handleStep4SaveBasics()">Save & Continue →</button>
          </div>
        </div>

        <!-- SUBSECTION 3: HOUSING SITUATION -->
        <!-- STEP 5: HOUSING MODALITY -->
        <div class="wizard-step" id="reg-step-5">
          <div class="step-title-group">
            <h2>What's your current housing situation?</h2>
            <p>In Buddy, accommodation is completely optional! Choose what fits your status:</p>
          </div>

          <div class="modality-cards-grid" style="margin-top: 8px;">
            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_1', this)">
              <div class="modality-icon">🏠</div>
              <div class="modality-title">Have a Room</div>
              <div class="modality-desc">I have a flat/room in Trivandrum and am searching for a flatmate to move in.</div>
            </div>

            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_2', this)">
              <div class="modality-icon">🛏</div>
              <div class="modality-title">Need a Room</div>
              <div class="modality-desc">I am actively looking for an existing room in a flat shared with compatible people.</div>
            </div>

            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_3', this)">
              <div class="modality-icon">🔄</div>
              <div class="modality-title">Want to Relocate</div>
              <div class="modality-desc">Currently renting, but want to relocate to a new area with a compatible flatmate.</div>
            </div>

            <div class="modality-select-card selected" onclick="pickModalityCard('MODALITY_4', this)">
              <div class="modality-icon">🤝</div>
              <div class="modality-title">Team-Up First</div>
              <div class="modality-desc">Person-first! Find a compatible flatmate first, then flat-hunt together in TVM.</div>
            </div>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(6)">Next: Suburbs & Budget →</button>
          </div>
        </div>

        <!-- STEP 6: LOCATION & BUDGET -->
        <div class="wizard-step" id="reg-step-6">
          <div class="step-title-group">
            <h2>Where & what budget?</h2>
            <p>Select your preferred Trivandrum neighborhoods and maximum monthly budget per head.</p>
          </div>

          <div class="form-group">
            <label>Select Preferred Suburbs (Tap to select)</label>
            <div class="suburb-pills-wrap" id="suburbPillsWrap">
              <span class="suburb-pill selected" onclick="toggleSuburbPill('KAZHAKKOOTTAM', this)">Kazhakkoottam</span>
              <span class="suburb-pill selected" onclick="toggleSuburbPill('KARIAVATTOM', this)">Kariavattom</span>
              <span class="suburb-pill selected" onclick="toggleSuburbPill('SREEKARYAM', this)">Sreekaryam</span>
              <span class="suburb-pill" onclick="toggleSuburbPill('ULLOOR', this)">Ulloor</span>
              <span class="suburb-pill" onclick="toggleSuburbPill('PATTOM', this)">Pattom</span>
              <span class="suburb-pill" onclick="toggleSuburbPill('KOWDIAR', this)">Kowdiar</span>
              <span class="suburb-pill" onclick="toggleSuburbPill('VELLAYAMBALAM', this)">Vellayambalam</span>
              <span class="suburb-pill" onclick="toggleSuburbPill('MANACAUD', this)">Manacaud</span>
            </div>
            <input type="hidden" id="regSuburbs" value="KAZHAKKOOTTAM, KARIAVATTOM, SREEKARYAM">
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Max Budget per Person (₹ INR / Month)</label>
            <input type="number" id="regMaxBudget" value="9500" min="2000" step="500">
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="handleStep6SaveHousing()">Next: Lifestyle Rhythms →</button>
          </div>
        </div>

        <!-- SUBSECTION 4: CORE LIFESTYLE -->
        <!-- STEP 7: SLEEP RHYTHM -->
        <div class="wizard-step" id="reg-step-7">
          <div class="step-title-group">
            <h2>🌙 Sleep Schedule & Daily Rhythm</h2>
            <p>Daily routines impact living harmony the most. When are you awake and sleeping?</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Sleep Schedule</label>
            <select id="regSleep">
              <option value="EARLY_BIRD">Early Bird (Sleep by 10:30 PM, Awake by 6:30 AM)</option>
              <option value="NIGHT_OWL">Night Owl (Sleep 1:00 AM+, Awake 9:00 AM+)</option>
              <option value="FLEXIBLE">Flexible Routine</option>
            </select>
          </div>

          <div style="margin-top: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbSleep" checked> Strict Dealbreaker (Do not match me with opposing sleep patterns)
            </label>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(8)">Next: Cleanliness →</button>
          </div>
        </div>

        <!-- STEP 8: CLEANLINESS -->
        <div class="wizard-step" id="reg-step-8">
          <div class="step-title-group">
            <h2>🧹 Cleanliness & Kitchen Sink Standards</h2>
            <p>How clean do you keep your common areas and kitchen sink?</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Cleanliness Level</label>
            <select id="regClean">
              <option value="METICULOUS">Meticulous (Dishes washed immediately, spotless counters)</option>
              <option value="MODERATE">Moderate (Cleaned by end of day)</option>
              <option value="RELAXED">Relaxed (Weekly cleanings)</option>
            </select>
          </div>

          <div style="margin-top: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbClean" checked> Strict Dealbreaker (Cleanliness level must align)
            </label>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(9)">Next: Dietary Policy →</button>
          </div>
        </div>

        <!-- STEP 9: DIETARY POLICY -->
        <div class="wizard-step" id="reg-step-9">
          <div class="step-title-group">
            <h2>🍲 Food & Kitchen Sharing Policy</h2>
            <p>Do you cook non-veg, require a pure vegetarian kitchen, or eat eggs?</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Dietary Type</label>
            <select id="regDiet">
              <option value="NON_VEGETARIAN">Non-Vegetarian (Cooking non-veg at home is fine)</option>
              <option value="STRICT_VEGETARIAN">Strict Vegetarian (Requires veg-only kitchen)</option>
              <option value="EGGETARIAN">Eggetarian</option>
            </select>
          </div>

          <div style="margin-top: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbDiet"> Strict Dealbreaker (Strict veg-only kitchen policy)
            </label>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(10)">Next: Smoking & Substances →</button>
          </div>
        </div>

        <!-- STEP 10: SMOKING & SUBSTANCES -->
        <div class="wizard-step" id="reg-step-10">
          <div class="step-title-group">
            <h2>🚭 Smoking & Substance Habits</h2>
            <p>Smoke-free living is an important boundary for many roommates.</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Smoking Preference</label>
            <select id="regSmoke">
              <option value="NON_SMOKER_STRICT">Strict Non-Smoker (Zero smoking in flat or balcony)</option>
              <option value="BALCONY_ONLY">Balcony Only (Smoking outside on balcony only)</option>
              <option value="SMOKER">Smoker Friendly</option>
            </select>
          </div>

          <div style="margin-top: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbSmoke" checked> Strict Dealbreaker (Strict non-smoker requirement)
            </label>
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(11)">Next: Trust Badge →</button>
          </div>
        </div>

        <!-- SUBSECTION 5: TRUST BADGE & FINISH -->
        <!-- STEP 11: OPTIONAL TRUST BADGE (POSITIONED TOWARDS END) -->
        <div class="wizard-step" id="reg-step-11">
          <div class="step-title-group">
            <h2>Claim Your Verified Trust Badge ⭐</h2>
            <p><strong>Optional:</strong> Verified profiles from Technopark IT firms and Trivandrum colleges receive 3x more mutual matches. You can verify now or skip and do it later!</p>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Institution / Workplace Type</label>
            <select id="regInstType">
              <option value="CORPORATE">Technopark Professional (Infosys, TCS, UST, Allianz, IBS, etc.)</option>
              <option value="ACADEMIC">College Student (CET Trivandrum, Univ. of Kerala, etc.)</option>
            </select>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Institutional Email (Optional)</label>
            <input type="email" id="regInstEmail" value="kiran.kumar@infosys.com" placeholder="name@company.com or name@cet.ac.in">
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="skipTrustBadge()">Skip for Now</button>
            <button class="btn btn-primary" onclick="handleStepTrustBadge()">Verify Email & Next →</button>
          </div>
        </div>

        <!-- STEP 12: OPTIONAL PROFILE PHOTO & READY TO LAUNCH -->
        <div class="wizard-step" id="reg-step-12">
          <div class="step-title-group">
            <h2>Add a Profile Photo 📸</h2>
            <p><strong>Optional:</strong> Profiles with photos get 4x more replies. Pick a photo or finish now and add one later.</p>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 12px 0;">
            <img id="regPhotoPreview" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="setRegAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80')">Photo 1</button>
              <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="setRegAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')">Photo 2</button>
              <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="setRegAvatar('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80')">Photo 3</button>
              <button class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;" onclick="setRegAvatar('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80')">Photo 4</button>
            </div>
          </div>

          <div class="form-group">
            <label>Photo URL (Optional)</label>
            <input type="text" id="regPhotoUrl" value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" oninput="document.getElementById('regPhotoPreview').src = this.value">
          </div>

          <div class="wizard-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="completeRegistrationAndLaunch()">
              🎉 Complete Profile & Start Discovering!
            </button>
          </div>
        </div>

      </div>
    </section>

      </div>
    </section>

    <!-- =========================================================
         VIEW 2: DISCOVERY STAGE (FLUID RESPONSIVE DECK)
         ========================================================= -->
    <section id="view-discover" class="view-panel">
      <div class="discover-stage">
        
        <!-- Left Column: Swipe Deck -->
        <div class="card-deck-wrapper">
          <div class="card-stack" id="cardStack">
            <!-- Cards populated dynamically -->
          </div>

          <!-- Action Buttons -->
          <div class="action-controls">
            <button class="action-btn action-rewind" onclick="handleRewind()" title="Rewind last swipe">↺</button>
            <button class="action-btn action-pass" onclick="handlePass()" title="Pass candidate">✕</button>
            <button class="action-btn action-superlike" onclick="handleSuperlike()" title="Superlike candidate">★</button>
            <button class="action-btn action-like" onclick="handleLike()" title="Like candidate">♥</button>
          </div>
        </div>

        <!-- Right Column (Desktop): Compatibility Insights & Quick Modality Summary -->
        <div class="desktop-side-panel">
          <div class="side-panel-title">✨ AI Living Harmony Insights</div>
          
          <div class="ai-summary-card">
            <div class="ai-badge">Assistive AI Engine • Zero PII Guaranteed</div>
            <div class="ai-headline" id="sideAiHeadline">Select or view the candidate card to see natural-language harmony synthesis.</div>
            <div class="ai-harmonies-list" id="sideAiHarmonies">
              <div class="ai-harmony-row">Early bird chronotype aligned for quiet mornings</div>
              <div class="ai-harmony-row">Compatible cleanliness standards for shared kitchen</div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 14px;">
            <div style="font-size: 13px; font-weight: 700; color: var(--text);">How Compatibility is Calculated:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 12px; color: var(--text-muted);">
              <div>• Sleep Routine: 20%</div>
              <div>• Cleanliness: 20%</div>
              <div>• Dietary Habits: 15%</div>
              <div>• Social Rhythms: 15%</div>
              <div>• Substances: 15%</div>
              <div>• Budget Match: 10%</div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- =========================================================
         VIEW 3: MATCHES & ACTIVE CHAT SPLIT VIEW
         ========================================================= -->
    <section id="view-matches" class="view-panel">
      <div class="chat-split-container">
        
        <!-- Left Sidebar: Conversations & Matches -->
        <div class="matches-sidebar">
          <div class="matches-sidebar-header">
            <h3>Matches & Chats</h3>
            <p>Double opt-in mutual connections</p>
          </div>

          <div class="conv-list" id="convList">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Right Pane: Active Chat Window -->
        <div class="active-chat-pane">
          <div class="chat-header">
            <div class="chat-partner-box">
              <img id="chatAvatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="chat-partner-avatar" alt="Partner">
              <div>
                <div class="chat-partner-name" id="chatName">Rahul Pillai</div>
                <div class="chat-partner-status">Online • 88% Compatibility</div>
              </div>
            </div>
            <div>
              <button class="btn btn-outline" style="font-size: 12px; padding: 6px 10px;" onclick="triggerBlock()">Block User</button>
            </div>
          </div>

          <div class="chat-safety-banner">
            🛡 Privacy First: Phone numbers, emails, and UPI handles are automatically scrubbed until trust is established.
          </div>

          <div class="messages-stream" id="msgStream">
            <!-- Messages injected dynamically -->
          </div>

          <div class="chat-input-bar">
            <input type="text" id="chatInputBox" class="chat-input" placeholder="Type a message or question..." onkeypress="if(event.key==='Enter') sendChatMessage()">
            <button class="chat-send-btn" onclick="sendChatMessage()">➤</button>
          </div>
        </div>

      </div>
    </section>

    <!-- =========================================================
         VIEW 4: ACCOMMODATION ROOM LISTINGS
         ========================================================= -->
    <section id="view-rooms" class="view-panel">
      <div style="max-width: 900px; margin: 0 auto; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800;">Available Rooms in Trivandrum</h2>
            <p style="font-size: 13px; color: var(--text-muted);">Offered by verified flatmates near Technopark & College Hubs</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
          
          <!-- Listing 1: Adarsh's Room -->
          <div style="background: white; border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-md);">
            <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 18px; font-weight: 800; color: var(--primary);">₹7,500 / month</span>
                <span style="font-size: 12px; color: var(--text-muted);">Deposit: ₹20,000</span>
              </div>
              <h3 style="font-size: 16px; font-weight: 700;">Private Master Bedroom in 2BHK</h3>
              <p style="font-size: 12px; color: var(--text-muted);">📍 Kazhakkoottam (800m from Technopark Phase I Main Gate)</p>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
                <span class="lifestyle-chip">AC</span>
                <span class="lifestyle-chip">Attached Bath</span>
                <span class="lifestyle-chip">WiFi</span>
                <span class="lifestyle-chip">Covered Parking</span>
                <span class="lifestyle-chip">Washing Machine</span>
              </div>
              <button class="btn btn-primary" style="margin-top: 10px;" onclick="navigateTab('discover')">
                View Roommate (Adarsh Nair) →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- =========================================================
         VIEW 5: MY PROFILE & LIFESTYLE CONFIGURATION
         ========================================================= -->
    <section id="view-profile" class="view-panel">
      <div style="max-width: 700px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        
        <div style="background: white; border: 1px solid var(--border); border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow-sm);">
          <img id="myProfAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
          <div style="flex: 1;">
            <h2 id="myProfName" style="font-size: 20px; font-weight: 800;">Adarsh Nair</h2>
            <p id="myProfWork" style="font-size: 13px; color: var(--text-muted);">Senior Backend Engineer @ TCS Technopark</p>
            <div style="margin-top: 8px; display: inline-flex; align-items: center; gap: 4px; background: #E0F2FE; color: #0369A1; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 12px;">
              ✔ Verified Professional
            </div>
          </div>
          <button class="btn btn-outline" onclick="startNewRegistration()">Edit Registration</button>
        </div>

        <div style="background: white; border: 1px solid var(--border); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 14px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 16px; font-weight: 800;">Your Discovery Settings</h3>
          
          <div class="form-group">
            <label>Current Modality</label>
            <input type="text" id="myProfModality" value="Modality 1: I have a room available in Kazhakkoottam" readonly style="background: #F8FAFC;">
          </div>

          <div class="form-group">
            <label>Budget & Suburbs</label>
            <input type="text" value="₹7,000 - ₹9,000/mo • Kazhakkoottam, Kariavattom" readonly style="background: #F8FAFC;">
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: var(--text-muted);">Looking to switch perspective or test as someone else?</span>
            <button class="btn btn-secondary" onclick="cyclePersona()">Cycle Next Demo Persona</button>
          </div>
        </div>

      </div>
    </section>

  </main>

  <!-- MOBILE BOTTOM BAR -->
  <nav class="mobile-bottom-nav">
    <button class="m-nav-item active" id="mnav-discover" onclick="navigateTab('discover')">
      <span class="m-nav-icon">🔥</span>
      <span>Discover</span>
    </button>
    <button class="m-nav-item" id="mnav-matches" onclick="navigateTab('matches')">
      <span class="m-nav-icon">💬</span>
      <span>Matches</span>
    </button>
    <button class="m-nav-item" id="mnav-rooms" onclick="navigateTab('rooms')">
      <span class="m-nav-icon">🏠</span>
      <span>Rooms</span>
    </button>
    <button class="m-nav-item" id="mnav-profile" onclick="navigateTab('profile')">
      <span class="m-nav-icon">👤</span>
      <span>Profile</span>
    </button>
  </nav>

  <!-- CELEBRATION MODAL (MUTUAL MATCH) -->
  <div class="modal-backdrop" id="matchModal">
    <div class="modal-box">
      <div style="font-size: 48px;">🎉</div>
      <h2 style="font-size: 24px; font-weight: 900; color: var(--primary);">It's a Mutual Match!</h2>
      <p style="font-size: 13px; color: var(--text-muted);">
        You and <strong id="modalPartnerName">Rahul Pillai</strong> have mutually liked each other!
      </p>

      <div class="celeb-avatars">
        <img id="modalMyImg" src="" class="celeb-avatar" alt="Me">
        <img id="modalPartnerImg" src="" class="celeb-avatar celeb-avatar-right" alt="Partner">
      </div>

      <button class="btn btn-primary" style="width: 100%; border-radius: 20px;" onclick="openChatFromModal()">
        Start Conversation 💬
      </button>
      <button class="btn btn-outline" style="width: 100%; border-radius: 20px;" onclick="closeMatchModal()">
        Keep Exploring
      </button>
    </div>
  </div>

  <script>
    // State
    let currentToken = null;
    let currentUser = null;
    let candidates = [];
    let currentCardIndex = 0;
    let activeMatchPartner = null;
    let selectedModality = 'MODALITY_4';
    let wizardCurrentStep = 1;

    // Personas
    const PERSONAS = {
      adarsh: {
        id: 'usr_adarsh_001',
        phone: '+919876543211',
        name: 'Adarsh Nair',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        work: 'Senior Backend Engineer @ TCS Technopark',
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

    // App Initialization
    let authMode = 'signin';
    let otpSent = false;

    function setAuthMode(mode) {
      authMode = mode;
      document.getElementById('tabModeSignIn').classList.toggle('active', mode === 'signin');
      document.getElementById('tabModeRegister').classList.toggle('active', mode === 'register');
      document.getElementById('loginOtpGroup').style.display = 'none';
      otpSent = false;
      document.getElementById('btnLoginAction').textContent = 'Send OTP Code →';
      const alertBox = document.getElementById('loginAlertBox');
      alertBox.style.display = 'none';
      if (mode === 'register') {
        document.getElementById('loginPhoneInput').value = '+919876599999';
      } else {
        document.getElementById('loginPhoneInput').value = '+919876543211';
      }
    }

    async function handleLoginSubmit() {
      const phone = document.getElementById('loginPhoneInput').value.trim();
      const alertBox = document.getElementById('loginAlertBox');
      alertBox.style.display = 'none';

      if (!otpSent) {
        // Step 1: Send OTP
        try {
          const res = await fetch('/api/v1/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.detail || data.title || 'Failed to send OTP');
          }
          otpSent = true;
          document.getElementById('loginOtpGroup').style.display = 'block';
          document.getElementById('btnLoginAction').textContent = 'Verify OTP & Enter Buddy →';
          alertBox.style.display = 'block';
          alertBox.style.background = '#ECFDF5';
          alertBox.style.color = '#065F46';
          alertBox.textContent = '✔ OTP code sent! Use dev code 123456 to verify.';
        } catch (e) {
          alertBox.style.display = 'block';
          alertBox.style.background = '#FEF2F2';
          alertBox.style.color = '#991B1B';
          alertBox.textContent = 'Error: ' + e.message;
        }
      } else {
        // Step 2: Verify OTP
        const otp = document.getElementById('loginOtpInput').value.trim();
        try {
          const res = await fetch('/api/v1/auth/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone, otp })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.detail || data.title || 'Invalid OTP');
          }

          currentToken = data.accessToken;
          localStorage.setItem('buddy_token', currentToken);
          localStorage.setItem('buddy_phone', phone);

          const isRegistered = data.user && data.user.isOnboardingCompleted;
          if (!isRegistered) {
            document.body.classList.remove('unauthenticated');
            document.body.classList.add('onboarding-mode');
            currentUser = {
              id: data.user.id,
              phone: phone,
              name: 'New Buddy User',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              isOnboardingCompleted: false
            };
            startNewRegistration();
          } else {
            document.body.classList.remove('unauthenticated');
            document.body.classList.remove('onboarding-mode');
            await loadUserProfile();
            await loadFeed();
            await loadMatches();
            navigateTab('discover');
          }
        } catch (e) {
          alertBox.style.display = 'block';
          alertBox.style.background = '#FEF2F2';
          alertBox.style.color = '#991B1B';
          alertBox.textContent = 'Verification error: ' + e.message;
        }
      }
    }

    async function quickLoginPersona(key) {
      const p = PERSONAS[key];
      if (!p) return;
      document.body.classList.remove('unauthenticated');
      document.body.classList.remove('onboarding-mode');
      await loginAsPersona(p);
      navigateTab('discover');
    }

    async function handleLogout() {
      try {
        if (currentToken) {
          await fetch('/api/v1/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + currentToken }
          });
        }
      } catch (e) {}
      currentToken = null;
      currentUser = null;
      localStorage.removeItem('buddy_token');
      localStorage.removeItem('buddy_phone');
      document.body.classList.add('unauthenticated');
      document.body.classList.remove('onboarding-mode');
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      const loginView = document.getElementById('view-login');
      if (loginView) loginView.classList.add('active');
    }

    async function loadUserProfile() {
      try {
        const res = await fetch('/api/v1/profiles/me', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (res.ok) {
          const prof = await res.json();
          currentUser = {
            id: prof.userId,
            phone: localStorage.getItem('buddy_phone') || '+919876543210',
            name: prof.displayName,
            avatar: prof.photos && prof.photos[0] ? prof.photos[0].photoUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            work: prof.occupation,
            modality: prof.modality,
            isOnboardingCompleted: prof.isOnboardingCompleted
          };
          updateHeaderUser(currentUser);
        }
      } catch (e) {}
    }

    // App Initialization
    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const demoPersona = urlParams.get('demo');
      const requestedView = urlParams.get('view');

      if (demoPersona && PERSONAS[demoPersona]) {
        await quickLoginPersona(demoPersona);
        if (requestedView) navigateTab(requestedView);
        return;
      }

      const savedToken = localStorage.getItem('buddy_token');
      if (savedToken) {
        currentToken = savedToken;
        try {
          const profRes = await fetch('/api/v1/profiles/me', {
            headers: { 'Authorization': 'Bearer ' + currentToken }
          });
          if (profRes.ok) {
            const prof = await profRes.json();
            currentUser = {
              id: prof.userId,
              phone: localStorage.getItem('buddy_phone') || '+919876543210',
              name: prof.displayName,
              avatar: prof.photos && prof.photos[0] ? prof.photos[0].photoUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              work: prof.occupation,
              modality: prof.modality,
              isOnboardingCompleted: prof.isOnboardingCompleted
            };
            if (!prof.isOnboardingCompleted) {
              document.body.classList.remove('unauthenticated');
              document.body.classList.add('onboarding-mode');
              startNewRegistration();
              return;
            }
            document.body.classList.remove('unauthenticated');
            document.body.classList.remove('onboarding-mode');
            updateHeaderUser(currentUser);
            await loadFeed();
            await loadMatches();
            navigateTab(requestedView && requestedView !== 'registration' && requestedView !== 'login' ? requestedView : 'discover');
            return;
          }
        } catch (e) {
          // Token verification failed, fallback to login
        }
      }

      // Default: Unauthenticated -> Show Login Gateway
      document.body.classList.add('unauthenticated');
      document.body.classList.remove('onboarding-mode');
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      const loginView = document.getElementById('view-login');
      if (loginView) loginView.classList.add('active');
    }

    async function loginAsPersona(p) {
      currentUser = p;
      updateHeaderUser(p);

      // Authenticate with server
      await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: p.phone })
      });
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: p.phone, otp: '123456' })
      });
      const data = await res.json();
      currentToken = data.accessToken;
      localStorage.setItem('buddy_token', currentToken);
      localStorage.setItem('buddy_phone', p.phone);

      await loadFeed();
      await loadMatches();
    }

    function updateHeaderUser(p) {
      document.getElementById('headerUserAvatar').src = p.avatar;
      document.getElementById('headerUserName').textContent = p.name.split(' ')[0];
      document.getElementById('myProfAvatar').src = p.avatar;
      document.getElementById('myProfName').textContent = p.name;
      document.getElementById('myProfWork').textContent = p.work;
    }

    function cyclePersona() {
      const keys = Object.keys(PERSONAS);
      const currentKey = keys.find(k => PERSONAS[k].id === currentUser.id) || 'adarsh';
      const nextKey = keys[(keys.indexOf(currentKey) + 1) % keys.length];
      loginAsPersona(PERSONAS[nextKey]);
    }

    // Navigation Switcher
    function navigateTab(tabName) {
      // Access Control & Auth Gatekeeper
      if (!currentToken && tabName !== 'login' && tabName !== 'registration') {
        document.body.classList.add('unauthenticated');
        document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
        const loginView = document.getElementById('view-login');
        if (loginView) loginView.classList.add('active');
        return;
      }

      if (currentUser && !currentUser.isOnboardingCompleted && tabName !== 'registration') {
        alert('Please complete registration before accessing the portal.');
        tabName = 'registration';
      }

      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.m-nav-item').forEach(b => b.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabName);
      if (targetView) targetView.classList.add('active');

      const dnav = document.getElementById('dnav-' + tabName);
      if (dnav) dnav.classList.add('active');
      const mnav = document.getElementById('mnav-' + tabName);
      if (mnav) mnav.classList.add('active');

      if (tabName === 'discover') renderDeck();
      if (tabName === 'matches') loadMatches();
    }

    // -------------------------------------------------------------
    // PROGRESSIVE CONVERSATIONAL ONBOARDING WIZARD LOGIC (BUMBLE-STYLE)
    // -------------------------------------------------------------
    function startNewRegistration() {
      wizardCurrentStep = 1;
      document.body.classList.remove('unauthenticated');
      document.body.classList.add('onboarding-mode');
      updateWizardUI();
      navigateTab('registration');
    }

    function goToOnboardingStep(stepNum) {
      wizardCurrentStep = stepNum;
      updateWizardUI();
    }

    function goBackOnboardingStep() {
      if (wizardCurrentStep > 1) {
        wizardCurrentStep--;
        updateWizardUI();
      }
    }

    function skipToStep(stepNum) {
      goToOnboardingStep(stepNum);
    }

    function updateWizardUI() {
      // Hide all steps, show active step
      document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
      const activeStepEl = document.getElementById('reg-step-' + wizardCurrentStep);
      if (activeStepEl) activeStepEl.classList.add('active');

      // Update top bar controls
      const backBtn = document.getElementById('obBackBtn');
      if (backBtn) backBtn.style.display = (wizardCurrentStep > 1 ? 'inline-flex' : 'none');
      
      const counter = document.getElementById('obStepCounter');
      if (counter) counter.textContent = 'Question ' + wizardCurrentStep + ' of 12';

      // Update progress fill percentage (1 to 12)
      const percent = Math.min(100, Math.round(((wizardCurrentStep - 1) / 11) * 100));
      const fillEl = document.getElementById('wizardProgressFill');
      if (fillEl) fillEl.style.width = percent + '%';

      // 5 Subsections with completion ticks (✔)
      // Node 1: Verify (Step 1)
      const n1 = document.getElementById('node-step-1');
      const c1 = document.getElementById('circle-step-1');
      if (n1 && c1) {
        n1.classList.remove('active', 'completed');
        if (wizardCurrentStep > 1) {
          n1.classList.add('completed');
          c1.innerHTML = '✔';
        } else {
          n1.classList.add('active');
          c1.innerHTML = '1';
        }
      }

      // Node 2: Basics (Steps 2, 3, 4)
      const n2 = document.getElementById('node-step-2');
      const c2 = document.getElementById('circle-step-2');
      if (n2 && c2) {
        n2.classList.remove('active', 'completed');
        if (wizardCurrentStep > 4) {
          n2.classList.add('completed');
          c2.innerHTML = '✔';
        } else if (wizardCurrentStep >= 2 && wizardCurrentStep <= 4) {
          n2.classList.add('active');
          c2.innerHTML = '2';
        } else {
          c2.innerHTML = '2';
        }
      }

      // Node 3: Housing (Steps 5, 6)
      const n3 = document.getElementById('node-step-3');
      const c3 = document.getElementById('circle-step-3');
      if (n3 && c3) {
        n3.classList.remove('active', 'completed');
        if (wizardCurrentStep > 6) {
          n3.classList.add('completed');
          c3.innerHTML = '✔';
        } else if (wizardCurrentStep >= 5 && wizardCurrentStep <= 6) {
          n3.classList.add('active');
          c3.innerHTML = '3';
        } else {
          c3.innerHTML = '3';
        }
      }

      // Node 4: Lifestyle (Steps 7, 8, 9, 10)
      const n4 = document.getElementById('node-step-4');
      const c4 = document.getElementById('circle-step-4');
      if (n4 && c4) {
        n4.classList.remove('active', 'completed');
        if (wizardCurrentStep > 10) {
          n4.classList.add('completed');
          c4.innerHTML = '✔';
        } else if (wizardCurrentStep >= 7 && wizardCurrentStep <= 10) {
          n4.classList.add('active');
          c4.innerHTML = '4';
        } else {
          c4.innerHTML = '4';
        }
      }

      // Node 5: Finish & Trust Badge (Steps 11, 12)
      const n5 = document.getElementById('node-step-5');
      const c5 = document.getElementById('circle-step-5');
      if (n5 && c5) {
        n5.classList.remove('active', 'completed');
        if (wizardCurrentStep >= 11) {
          n5.classList.add('active');
          c5.innerHTML = '5';
        } else {
          c5.innerHTML = '5';
        }
      }
    }

    function autofillPhone(num) {
      document.getElementById('regPhone').value = num;
    }

    function toggleSuburbPill(suburbCode, el) {
      el.classList.toggle('selected');
      const selectedPills = Array.from(document.querySelectorAll('#suburbPillsWrap .suburb-pill.selected'))
        .map(p => p.textContent.trim().toUpperCase());
      document.getElementById('regSuburbs').value = selectedPills.join(', ');
    }

    function setRegAvatar(url) {
      document.getElementById('regPhotoUrl').value = url;
      document.getElementById('regPhotoPreview').src = url;
    }

    // STEP 1: Phone OTP Verification
    async function handleStep1Auth() {
      const phone = document.getElementById('regPhone').value.trim();
      const otpGroup = document.getElementById('otpInputGroup');
      const btn = document.getElementById('btnStep1');

      if (otpGroup.style.display === 'none') {
        btn.textContent = 'Requesting OTP...';
        try {
          await fetch('/api/v1/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone })
          });
          otpGroup.style.display = 'flex';
          btn.textContent = 'Verify OTP & Continue →';
        } catch (e) {
          btn.textContent = 'Request OTP Code →';
          alert('Failed to send OTP. Please check phone number format (+91 followed by 10 digits).');
        }
      } else {
        const otp = document.getElementById('regOtp').value.trim();
        try {
          const res = await fetch('/api/v1/auth/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone, otp })
          });
          const data = await res.json();
          if (data.accessToken) {
            currentToken = data.accessToken;
            localStorage.setItem('buddy_token', currentToken);
            localStorage.setItem('buddy_phone', phone);

            currentUser = {
              id: data.user.id,
              name: 'New Registered User',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              work: 'Trivandrum Explorer',
              isOnboardingCompleted: false
            };

            goToOnboardingStep(2);
          } else {
            alert('OTP Verification failed. Universal dev OTP code is 123456');
          }
        } catch (e) {
          alert('Network or server error during OTP verification.');
        }
      }
    }

    // STEP 4: Save Basic Identity
    async function handleStep4SaveBasics() {
      const name = document.getElementById('regName').value.trim() || 'Buddy User';
      const gender = document.getElementById('regGender').value;
      const prefGender = document.getElementById('regPrefGender').value;
      const birthDate = document.getElementById('regBirthDate').value;
      const occupation = document.getElementById('regOccupation').value.trim() || 'Professional';
      const bio = document.getElementById('regBio').value.trim();

      currentUser.name = name;
      currentUser.work = occupation;
      updateHeaderUser(currentUser);

      try {
        await fetch('/api/v1/profiles/me', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            displayName: name,
            gender: gender,
            preferredGender: prefGender,
            birthDate: birthDate,
            occupation: occupation,
            bio: bio,
            modality: selectedModality,
            minBudget: 6000,
            maxBudget: 10000,
            moveInFlexibility: 'WITHIN_15_DAYS',
            preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM']
          })
        });
      } catch (e) {}

      goToOnboardingStep(5);
    }

    function pickModalityCard(mod, el) {
      selectedModality = mod;
      document.querySelectorAll('.modality-select-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    // STEP 6: Save Housing & Modality
    async function handleStep6SaveHousing() {
      const maxBudget = parseInt(document.getElementById('regMaxBudget').value, 10) || 9500;
      const rawSuburbs = document.getElementById('regSuburbs').value;
      const suburbs = rawSuburbs.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

      try {
        await fetch('/api/v1/profiles/me', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            modality: selectedModality,
            maxBudget: maxBudget,
            preferredSuburbs: suburbs.length > 0 ? suburbs : ['KAZHAKKOOTTAM', 'KARIAVATTOM']
          })
        });
      } catch (e) {}

      goToOnboardingStep(7);
    }

    // STEP 11: Optional Trust Badge
    async function handleStepTrustBadge() {
      const email = document.getElementById('regInstEmail').value.trim();
      const type = document.getElementById('regInstType').value;
      if (email) {
        try {
          const reqRes = await fetch('/api/v1/auth/institution/verify-request', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ institutionType: type, institutionName: 'Technopark/CET', email })
          });
          const reqData = await reqRes.json();
          if (reqData.previewToken) {
            await fetch('/api/v1/auth/institution/verify-confirm', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + currentToken,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ token: reqData.previewToken })
            });
          }
        } catch (e) {}
      }
      goToOnboardingStep(12);
    }

    function skipTrustBadge() {
      goToOnboardingStep(12);
    }

    // STEP 12: Complete Registration & Launch
    async function completeRegistrationAndLaunch() {
      const sleep = document.getElementById('regSleep').value;
      const clean = document.getElementById('regClean').value;
      const diet = document.getElementById('regDiet').value;
      const smoke = document.getElementById('regSmoke').value;
      const photoUrl = document.getElementById('regPhotoUrl').value.trim();

      if (photoUrl) {
        try {
          await fetch('/api/v1/profiles/me/photos', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              photoUrl: photoUrl,
              orderIndex: 0,
              isPrimary: true
            })
          });
          currentUser.avatar = photoUrl;
          updateHeaderUser(currentUser);
        } catch (e) {}
      }

      await fetch('/api/v1/lifestyle/me', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + currentToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sleep: {
            sleepPattern: sleep,
            shiftSchedule: 'NORMAL_DAY',
            noiseSensitivity: 'LIGHT_SLEEPER',
            isDealbreaker: document.getElementById('dbSleep').checked
          },
          cleanliness: {
            cleanlinessLevel: clean,
            kitchenSinkRule: 'IMMEDIATE_WASH',
            maidPreference: 'OPEN_TO_MAID',
            isDealbreaker: document.getElementById('dbClean').checked
          },
          dietary: {
            dietType: diet,
            kitchenPolicy: 'NO_RESTRICTIONS',
            isDealbreaker: document.getElementById('dbDiet').checked
          },
          social: {
            guestFrequency: 'OCCASIONAL_FRIENDS',
            overnightGuestPolicy: 'SAME_GENDER_ONLY',
            partyPreference: 'OCCASIONAL_WEEKENDS',
            isDealbreaker: false
          },
          substances: {
            smokingHabit: smoke,
            alcoholHabit: 'TEETOTALER',
            isDealbreaker: document.getElementById('dbSmoke').checked
          },
          financial: {
            rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
            acBillSplit: 'EQUAL_SPLIT',
            groceryTracking: 'SPLITWISE_APP',
            isDealbreaker: true
          },
          work: {
            workMode: 'HYBRID',
            callFrequency: 'LOW',
            workspacePreference: 'PRIVATE_ROOM_DESK',
            isDealbreaker: false
          }
        })
      });

      alert('🎉 Profile registration complete! Entering your personalized Buddy discovery feed.');
      if (currentUser) currentUser.isOnboardingCompleted = true;
      document.body.classList.remove('unauthenticated');
      document.body.classList.remove('onboarding-mode');
      await loadUserProfile();
      await loadFeed();
      await loadMatches();
      navigateTab('discover');
    }

    // -------------------------------------------------------------
    // DISCOVERY FEED & SWIPING
    // -------------------------------------------------------------
    async function loadFeed() {
      try {
        const res = await fetch('/api/v1/discovery/feed?limit=10', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        const data = await res.json();
        candidates = data.cards || [];
        currentCardIndex = 0;
        renderDeck();
      } catch (e) {
        // Fallback
      }
    }

    function renderDeck() {
      const stack = document.getElementById('cardStack');
      stack.innerHTML = '';

      if (currentCardIndex >= candidates.length) {
        stack.innerHTML = 
          '<div style="width: 100%; height: 100%; background: white; border-radius: 24px; padding: 32px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 14px; box-shadow: var(--shadow-lg);">' +
            '<div style="font-size: 52px;">🌟</div>' +
            '<h3 style="font-size: 20px; font-weight: 800;">All Candidates Explored!</h3>' +
            '<p style="font-size: 13px; color: var(--text-muted); max-width: 320px; line-height: 1.5;">' +
              'You have reviewed all available profiles matching your filters in Trivandrum. Try rewinding your last swipe or switching personas above!' +
            '</p>' +
            '<button class="btn btn-primary" onclick="handleRewind()" style="border-radius: 20px;">↺ Rewind Last Swipe</button>' +
          '</div>';
        return;
      }

      // Render top 2 cards for depth
      for (let i = Math.min(candidates.length - 1, currentCardIndex + 1); i >= currentCardIndex; i--) {
        const c = candidates[i];
        const isTop = (i === currentCardIndex);
        const cardEl = document.createElement('div');
        cardEl.className = 'swipe-card';
        cardEl.id = 'deck-card-' + i;
        cardEl.style.zIndex = isTop ? '10' : '5';
        cardEl.style.transform = isTop ? 'scale(1)' : 'scale(0.96) translateY(12px)';

        const modalityNames = {
          MODALITY_1: 'Modality 1: Has Room (₹7,500)',
          MODALITY_2: 'Modality 2: Needs Room',
          MODALITY_3: 'Modality 3: Relocating',
          MODALITY_4: 'Modality 4: Team-up First'
        };

        const chipsHtml = (c.topHighlights || []).map(h => '<span class="lifestyle-chip">' + h + '</span>').join('');

        cardEl.innerHTML = 
          '<div class="card-photo-box">' +
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
          '<div class="card-content-box">' +
            '<div class="card-modality-pill">🏠 ' + (modalityNames[c.modality] || c.modality) + '</div>' +
            '<p class="card-bio">' + (c.bio || 'Professional looking for a compatible flatmate near Technopark.') + '</p>' +
            '<div class="card-tags">' + chipsHtml + '</div>' +
          '</div>';

        stack.appendChild(cardEl);

        if (isTop) {
          attachCardSwipe(cardEl, i);
          updateSideAiInsights(c);
        }
      }
    }

    function attachCardSwipe(card, index) {
      let startX = 0, currentX = 0, isDragging = false;

      function onStart(e) {
        isDragging = true;
        card.classList.add('dragging');
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      }

      function onMove(e) {
        if (!isDragging) return;
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        currentX = x - startX;
        const rotate = currentX * 0.08;
        card.style.transform = 'translate(' + currentX + 'px, 0px) rotate(' + rotate + 'deg)';

        const likeStamp = document.getElementById('stamp-like-' + index);
        const passStamp = document.getElementById('stamp-pass-' + index);
        if (currentX > 20) {
          likeStamp.style.opacity = Math.min(1, currentX / 70);
          passStamp.style.opacity = 0;
        } else if (currentX < -20) {
          passStamp.style.opacity = Math.min(1, -currentX / 70);
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

        if (currentX > 85) executeSwipeAction(card, 'LIKE');
        else if (currentX < -85) executeSwipeAction(card, 'PASS');
        else {
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

    async function executeSwipeAction(cardEl, action) {
      const candidate = candidates[currentCardIndex];
      const dir = (action === 'LIKE') ? 1 : -1;

      cardEl.style.transition = 'transform 0.35s ease-out, opacity 0.3s';
      cardEl.style.transform = 'translate(' + (dir * 500) + 'px, 40px) rotate(' + (dir * 30) + 'deg)';
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
          renderDeck();

          // Check for mutual match!
          if (data && (data.isMutualMatch || data.isMatch)) {
            triggerCelebration(candidate);
          }
        }, 180);

      } catch (e) {
        currentCardIndex++;
        renderDeck();
      }
    }

    function handleLike() {
      const card = document.getElementById('deck-card-' + currentCardIndex);
      if (card) executeSwipeAction(card, 'LIKE');
    }
    function handlePass() {
      const card = document.getElementById('deck-card-' + currentCardIndex);
      if (card) executeSwipeAction(card, 'PASS');
    }
    function handleSuperlike() { handleLike(); }

    async function handleRewind() {
      try {
        await fetch('/api/v1/discovery/rewind', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (currentCardIndex > 0) currentCardIndex--;
        renderDeck();
      } catch (e) {
        alert('Rewind limit reached.');
      }
    }

    async function updateSideAiInsights(cand) {
      document.getElementById('sideAiHeadline').textContent = 'Analyzing compatibility with ' + cand.displayName + '...';
      try {
        const res = await fetch('/api/v1/ai/harmony-explanation', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + currentToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ candidateUserId: cand.userId })
        });
        const data = await res.json();
        document.getElementById('sideAiHeadline').textContent = data.headline || 'High mutual living harmony';
        document.getElementById('sideAiHarmonies').innerHTML = (data.lifestyleHarmonies || []).map(h => 
          '<div class="ai-harmony-row">' + h + '</div>'
        ).join('');
      } catch (e) {
        document.getElementById('sideAiHeadline').textContent = 'Compatible lifestyle vectors detected';
      }
    }

    // -------------------------------------------------------------
    // MATCHES & CHAT
    // -------------------------------------------------------------
    async function loadMatches() {
      try {
        const res = await fetch('/api/v1/matches', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        const data = await res.json();
        const matches = data.matches || [];

        document.getElementById('headerMatchesBadge').textContent = matches.length;
        const list = document.getElementById('convList');

        if (matches.length === 0) {
          list.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">No mutual matches yet. Swipe LIKE on candidates to connect!</div>';
          return;
        }

        list.innerHTML = matches.map((m, idx) => 
          '<div class="conv-item ' + (idx === 0 ? 'active' : '') + '" onclick="selectConversation(' + JSON.stringify(m.candidate).replace(/"/g, '&quot;') + ', this)">' +
            '<img src="' + (m.candidate.photos && m.candidate.photos[0] ? m.candidate.photos[0].photoUrl : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80') + '" class="conv-avatar">' +
            '<div class="conv-info">' +
              '<div class="conv-top-row">' +
                '<span class="conv-name">' + m.candidate.displayName + '</span>' +
                '<span style="font-size: 11px; color: var(--text-muted);">Just now</span>' +
              '</div>' +
              '<div class="conv-snippet">★ ' + m.compatibilityScore + '% Compatibility • Tap to chat</div>' +
            '</div>' +
          '</div>'
        ).join('');

        if (matches.length > 0 && !activeMatchPartner) {
          selectConversation(matches[0].candidate, null);
        }

      } catch (e) {
        // Fallback
      }
    }

    function selectConversation(cand, el) {
      if (el) {
        document.querySelectorAll('.conv-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
      }
      activeMatchPartner = cand;
      document.getElementById('chatName').textContent = cand.displayName;
      document.getElementById('chatAvatar').src = cand.photos && cand.photos[0] ? cand.photos[0].photoUrl : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80';

      const stream = document.getElementById('msgStream');
      stream.innerHTML = 
        '<div class="msg-bubble msg-in">' +
          'Hi ' + currentUser.name.split(' ')[0] + '! Excited to connect. I saw our lifestyles have high alignment!' +
          '<div class="msg-time">10:45 AM</div>' +
        '</div>';
    }

    function sendChatMessage() {
      const input = document.getElementById('chatInputBox');
      const text = input.value.trim();
      if (!text) return;

      const stream = document.getElementById('msgStream');
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append my message
      const myMsg = document.createElement('div');
      myMsg.className = 'msg-bubble msg-out';
      myMsg.innerHTML = text + '<div class="msg-time">' + now + '</div>';
      stream.appendChild(myMsg);
      input.value = '';

      // Test Contact Harvesting Filter
      if (text.match(/(\\+91|\\d{10}|upi:|@okaxis)/i)) {
        const warn = document.createElement('div');
        warn.className = 'msg-warning';
        warn.innerHTML = '🛡 Security Notice: Phone numbers and payment details are restricted to prevent off-platform scams.';
        stream.appendChild(warn);
      } else {
        // Simulated response after 1.2s
        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'msg-bubble msg-in';
          reply.innerHTML = 'Sounds good! Would you like to meet near Technopark Phase I this Saturday?' +
            '<div class="msg-time">' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>';
          stream.appendChild(reply);
          stream.scrollTop = stream.scrollHeight;
        }, 1200);
      }

      stream.scrollTop = stream.scrollHeight;
    }

    function triggerCelebration(partner) {
      activeMatchPartner = partner;
      document.getElementById('modalPartnerName').textContent = partner.displayName;
      document.getElementById('modalMyImg').src = currentUser.avatar;
      document.getElementById('modalPartnerImg').src = partner.photos && partner.photos[0] ? partner.photos[0].photoUrl : partner.avatar;
      document.getElementById('matchModal').classList.add('active');
    }

    function closeMatchModal() {
      document.getElementById('matchModal').classList.remove('active');
    }

    function openChatFromModal() {
      closeMatchModal();
      navigateTab('matches');
      selectConversation(activeMatchPartner, null);
    }

    function triggerBlock() {
      if (confirm('Block ' + activeMatchPartner.displayName + '? This will hide their profile and terminate chat.')) {
        alert('User blocked successfully.');
        navigateTab('discover');
      }
    }

    // Start App
    init();
  </script>
</body>
</html>`;
}

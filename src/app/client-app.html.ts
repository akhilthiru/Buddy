export function renderClientAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flatmate – Person-First Flatmate Discovery | Thiruvananthapuram</title>
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
       REGISTRATION & ONBOARDING WIZARD
       ------------------------------------------------------------- */
    .wizard-container {
      max-width: 680px;
      width: 100%;
      margin: 20px auto;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px 28px;
      box-shadow: var(--shadow-lg);
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
      left: 10%;
      right: 10%;
      height: 3px;
      background: #E2E8F0;
      z-index: 1;
    }
    .progress-fill {
      position: absolute;
      top: 14px;
      left: 10%;
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

    .wizard-step { display: none; flex-direction: column; gap: 20px; }
    .wizard-step.active { display: flex; animation: slideLeft 0.25s ease-out; }
    @keyframes slideLeft { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .step-title-group h2 { font-size: 22px; font-weight: 800; color: var(--text); }
    .step-title-group p { font-size: 13px; color: var(--text-muted); margin-top: 4px; line-height: 1.5; }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 700; color: var(--text); }
    .form-group input, .form-group select, .form-group textarea {
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

    /* Modality Cards in Wizard */
    .modality-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 640px) { .modality-cards-grid { grid-template-columns: 1fr; } }
    .modality-select-card {
      border: 2px solid var(--border);
      border-radius: 14px;
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
          FLATMATE
          <span class="brand-pill">TVM</span>
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
      </div>
    </div>
  </header>

  <!-- MAIN VIEWPORT -->
  <main class="app-main">

    <!-- =========================================================
         VIEW 1: REGISTRATION & ONBOARDING WIZARD
         ========================================================= -->
    <section id="view-registration" class="view-panel active">
      <div class="wizard-container">
        
        <!-- Progress Bar (5 Steps) -->
        <div class="wizard-progress-bar">
          <div class="progress-fill" id="wizardProgressFill"></div>
          <div class="step-node active" id="node-step-1">
            <div class="step-circle">1</div>
            <span class="step-label">Phone OTP</span>
          </div>
          <div class="step-node" id="node-step-2">
            <div class="step-circle">2</div>
            <span class="step-label">Verification</span>
          </div>
          <div class="step-node" id="node-step-3">
            <div class="step-circle">3</div>
            <span class="step-label">Profile</span>
          </div>
          <div class="step-node" id="node-step-4">
            <div class="step-circle">4</div>
            <span class="step-label">Modality</span>
          </div>
          <div class="step-node" id="node-step-5">
            <div class="step-circle">5</div>
            <span class="step-label">Lifestyle</span>
          </div>
        </div>

        <!-- STEP 1: PHONE AUTHENTICATION -->
        <div class="wizard-step active" id="reg-step-1">
          <div class="step-title-group">
            <h2>Welcome to Flatmate</h2>
            <p>Person-first flatmate discovery in Thiruvananthapuram. Let's begin by verifying your mobile phone number.</p>
          </div>

          <div class="form-group">
            <label>Mobile Phone Number</label>
            <input type="text" id="regPhone" value="+919876543210" placeholder="+91 98765 43210">
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" style="font-size: 12px; padding: 6px 12px;" onclick="autofillPhone('+919876543210')">
              Use Test Phone (+91 9876543210)
            </button>
          </div>

          <div id="otpInputGroup" style="display: none; flex-direction: column; gap: 6px; margin-top: 10px;">
            <label style="font-size: 13px; font-weight: 700;">Enter 6-Digit OTP Code</label>
            <input type="text" id="regOtp" value="123456" placeholder="123456">
            <p style="font-size: 11px; color: var(--primary-dark);">✔ Local dev universal OTP code is <code>123456</code></p>
          </div>

          <div class="wizard-actions">
            <div></div>
            <button class="btn btn-primary" id="btnStep1" onclick="handleStep1Auth()">
              Request OTP Code →
            </button>
          </div>
        </div>

        <!-- STEP 2: INSTITUTIONAL & TRUST VERIFICATION -->
        <div class="wizard-step" id="reg-step-2">
          <div class="step-title-group">
            <h2>Claim Your Verified Trust Badge</h2>
            <p>Are you studying at CET / Kerala University, or working in the Technopark IT Corridor? Enter your institutional email to unlock your verified badge.</p>
          </div>

          <div class="form-group">
            <label>Institution / Workplace Type</label>
            <select id="regInstType">
              <option value="CORPORATE">Technopark Professional (Infosys, TCS, UST, Allianz, IBS, etc.)</option>
              <option value="ACADEMIC">College Student (CET Trivandrum, Univ. of Kerala, etc.)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Institutional Email</label>
            <input type="email" id="regInstEmail" value="kiran.kumar@infosys.com" placeholder="name@company.com or name@cet.ac.in">
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="skipToStep(3)">Skip for Now</button>
            <button class="btn btn-primary" onclick="handleStep2Verification()">Verify & Continue →</button>
          </div>
        </div>

        <!-- STEP 3: BASIC PROFILE SETUP -->
        <div class="wizard-step" id="reg-step-3">
          <div class="step-title-group">
            <h2>Tell Us About Yourself</h2>
            <p>Your profile helps potential flatmates understand your routine, professional background, and vibe.</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Full Display Name</label>
              <input type="text" id="regName" value="Kiran Kumar">
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select id="regGender">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_BINARY">Non-Binary / Other</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Birth Date (Age verification)</label>
              <input type="date" id="regBirthDate" value="1998-05-15">
            </div>
            <div class="form-group">
              <label>Occupation & Company / College</label>
              <input type="text" id="regOccupation" value="Frontend Engineer @ IBS Software">
            </div>
          </div>

          <div class="form-group">
            <label>Bio (Your lifestyle, hobbies, daily rhythm)</label>
            <textarea id="regBio" rows="3">Techie looking for a relaxed, clean flatmate near Technopark Phase I. Non-smoker, enjoys football on weekends and quiet evenings.</textarea>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="skipToStep(2)">← Back</button>
            <button class="btn btn-primary" onclick="handleStep3Profile()">Save Profile & Next →</button>
          </div>
        </div>

        <!-- STEP 4: DISCOVERY MODALITY SELECTION -->
        <div class="wizard-step" id="reg-step-4">
          <div class="step-title-group">
            <h2>Select Your Discovery Modality</h2>
            <p>Accommodation is optional in Flatmate! Choose your current housing situation:</p>
          </div>

          <div class="modality-cards-grid">
            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_1', this)">
              <div class="modality-icon">🏠</div>
              <div class="modality-title">Modality 1: Have a Room</div>
              <div class="modality-desc">I have a flat/room in Trivandrum and am searching for a flatmate to move in.</div>
            </div>

            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_2', this)">
              <div class="modality-icon">🛏</div>
              <div class="modality-title">Modality 2: Need a Room</div>
              <div class="modality-desc">I am actively looking for an existing room in a flat shared with compatible people.</div>
            </div>

            <div class="modality-select-card" onclick="pickModalityCard('MODALITY_3', this)">
              <div class="modality-icon">🔄</div>
              <div class="modality-title">Modality 3: Want to Relocate</div>
              <div class="modality-desc">Currently renting, but want to relocate to a new area with a compatible flatmate.</div>
            </div>

            <div class="modality-select-card selected" onclick="pickModalityCard('MODALITY_4', this)">
              <div class="modality-icon">🤝</div>
              <div class="modality-title">Modality 4: Team-Up First</div>
              <div class="modality-desc">Person-first! Find a compatible flatmate first, then flat-hunt together in TVM.</div>
            </div>
          </div>

          <div class="form-row" style="margin-top: 10px;">
            <div class="form-group">
              <label>Budget Range (Max INR/Month)</label>
              <input type="number" id="regMaxBudget" value="9500">
            </div>
            <div class="form-group">
              <label>Preferred Trivandrum Suburbs</label>
              <input type="text" id="regSuburbs" value="KAZHAKKOOTTAM, KARIAVATTOM, SREEKARYAM">
            </div>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="skipToStep(3)">← Back</button>
            <button class="btn btn-primary" onclick="handleStep4Modality()">Next: 7-Vector Lifestyle →</button>
          </div>
        </div>

        <!-- STEP 5: 7-VECTOR LIFESTYLE PREFERENCES -->
        <div class="wizard-step" id="reg-step-5">
          <div class="step-title-group">
            <h2>7-Vector Compatibility Setup</h2>
            <p>Our deterministic matching engine matches you on daily rhythms. You can toggle hard dealbreakers.</p>
          </div>

          <!-- Vector 1: Sleep -->
          <div class="lifestyle-question">
            <div class="question-header">
              <span class="question-title">🌙 1. Sleep Schedule & Chronotype (Weight: 20%)</span>
              <label class="dealbreaker-toggle"><input type="checkbox" id="dbSleep" checked> Hard Dealbreaker</label>
            </div>
            <select id="regSleep">
              <option value="EARLY_BIRD">Early Bird (Sleep by 10:30 PM, Awake by 6:30 AM)</option>
              <option value="NIGHT_OWL">Night Owl (Sleep 1:00 AM+, Awake 9:00 AM+)</option>
              <option value="FLEXIBLE">Flexible Routine</option>
            </select>
          </div>

          <!-- Vector 2: Cleanliness -->
          <div class="lifestyle-question">
            <div class="question-header">
              <span class="question-title">🧹 2. Cleanliness & Kitchen Sink (Weight: 20%)</span>
              <label class="dealbreaker-toggle"><input type="checkbox" id="dbClean" checked> Hard Dealbreaker</label>
            </div>
            <select id="regClean">
              <option value="METICULOUS">Meticulous (Dishes washed immediately, spotless counters)</option>
              <option value="MODERATE">Moderate (Cleaned by end of day)</option>
              <option value="RELAXED">Relaxed (Weekly cleanings)</option>
            </select>
          </div>

          <!-- Vector 3: Dietary Policy -->
          <div class="lifestyle-question">
            <div class="question-header">
              <span class="question-title">🍲 3. Kitchen & Dietary Policy (Weight: 15%)</span>
              <label class="dealbreaker-toggle"><input type="checkbox" id="dbDiet"> Hard Dealbreaker</label>
            </div>
            <select id="regDiet">
              <option value="NON_VEGETARIAN">Non-Vegetarian (Cooking non-veg at home is fine)</option>
              <option value="STRICT_VEGETARIAN">Strict Vegetarian (Requires veg-only kitchen)</option>
              <option value="EGGETARIAN">Eggetarian</option>
            </select>
          </div>

          <!-- Vector 4: Substances -->
          <div class="lifestyle-question">
            <div class="question-header">
              <span class="question-title">🚭 4. Smoking & Substances (Weight: 15%)</span>
              <label class="dealbreaker-toggle"><input type="checkbox" id="dbSmoke" checked> Hard Dealbreaker</label>
            </div>
            <select id="regSmoke">
              <option value="NON_SMOKER_STRICT">Strict Non-Smoker (Zero smoking in flat or balcony)</option>
              <option value="BALCONY_ONLY">Balcony Only</option>
              <option value="SMOKER">Smoker Friendly</option>
            </select>
          </div>

          <!-- Vector 5: Financial Split -->
          <div class="lifestyle-question">
            <div class="question-header">
              <span class="question-title">💰 5. Rent & Grocery Split (Weight: 10%)</span>
            </div>
            <select id="regFin">
              <option value="STRICT_1ST_OF_MONTH">Strict 1st of Month Rent • Splitwise for Provisions</option>
              <option value="BEFORE_5TH">Before 5th of Month</option>
              <option value="FLEXIBLE">Flexible Payment</option>
            </select>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="skipToStep(4)">← Back</button>
            <button class="btn btn-primary" onclick="completeRegistrationAndLaunch()">
              🎉 Complete Profile & Start Discovering!
            </button>
          </div>
        </div>

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
                View Flatmate (Adarsh Nair) →
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
    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedView = urlParams.get('view');
      
      if (requestedView && requestedView !== 'registration') {
        await loginAsPersona(PERSONAS.adarsh);
        navigateTab(requestedView);
      } else {
        // Start directly at Registration & Onboarding Flow
        startNewRegistration();
      }
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
    // REGISTRATION WIZARD LOGIC
    // -------------------------------------------------------------
    function startNewRegistration() {
      wizardCurrentStep = 1;
      updateWizardUI();
      navigateTab('registration');
    }

    function skipToStep(stepNum) {
      wizardCurrentStep = stepNum;
      updateWizardUI();
    }

    function updateWizardUI() {
      document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
      const activeStepEl = document.getElementById('reg-step-' + wizardCurrentStep);
      if (activeStepEl) activeStepEl.classList.add('active');

      // Update progress bar fill & circles
      const percent = ((wizardCurrentStep - 1) / 4) * 80;
      document.getElementById('wizardProgressFill').style.width = percent + '%';

      for (let i = 1; i <= 5; i++) {
        const node = document.getElementById('node-step-' + i);
        if (!node) continue;
        node.classList.remove('active', 'completed');
        if (i < wizardCurrentStep) node.classList.add('completed');
        else if (i === wizardCurrentStep) node.classList.add('active');
      }
    }

    function autofillPhone(num) {
      document.getElementById('regPhone').value = num;
    }

    async function handleStep1Auth() {
      const phone = document.getElementById('regPhone').value;
      const otpGroup = document.getElementById('otpInputGroup');
      const btn = document.getElementById('btnStep1');

      if (otpGroup.style.display === 'none') {
        // Step 1a: Request OTP
        btn.textContent = 'Verifying...';
        await fetch('/api/v1/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone })
        });
        otpGroup.style.display = 'flex';
        btn.textContent = 'Verify OTP & Continue →';
      } else {
        // Step 1b: Verify OTP
        const otp = document.getElementById('regOtp').value;
        const res = await fetch('/api/v1/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone, otp })
        });
        const data = await res.json();
        if (data.accessToken) {
          currentToken = data.accessToken;
          currentUser = {
            id: data.user.id,
            name: 'New Registered User',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            work: 'Trivandrum Explorer'
          };
          skipToStep(2);
        } else {
          alert('OTP Verification failed. Please use 123456');
        }
      }
    }

    async function handleStep2Verification() {
      const email = document.getElementById('regInstEmail').value;
      const type = document.getElementById('regInstType').value;
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
      } catch (e) {
        // Continue regardless
      }
      skipToStep(3);
    }

    async function handleStep3Profile() {
      const name = document.getElementById('regName').value;
      const gender = document.getElementById('regGender').value;
      const birthDate = document.getElementById('regBirthDate').value;
      const occupation = document.getElementById('regOccupation').value;
      const bio = document.getElementById('regBio').value;

      currentUser.name = name;
      currentUser.work = occupation;
      updateHeaderUser(currentUser);

      await fetch('/api/v1/profiles/me', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + currentToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: name,
          gender: gender,
          birthDate: birthDate,
          occupation: occupation,
          bio: bio,
          modality: selectedModality,
          preferredGender: 'ANY',
          minBudget: 6000,
          maxBudget: 10000,
          moveInFlexibility: 'WITHIN_15_DAYS',
          preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM']
        })
      });
      skipToStep(4);
    }

    function pickModalityCard(mod, el) {
      selectedModality = mod;
      document.querySelectorAll('.modality-select-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    async function handleStep4Modality() {
      const maxBudget = parseInt(document.getElementById('regMaxBudget').value, 10);
      const suburbs = document.getElementById('regSuburbs').value.split(',').map(s => s.trim());

      await fetch('/api/v1/profiles/me', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + currentToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          modality: selectedModality,
          maxBudget: maxBudget,
          preferredSuburbs: suburbs
        })
      });
      skipToStep(5);
    }

    async function completeRegistrationAndLaunch() {
      const sleep = document.getElementById('regSleep').value;
      const clean = document.getElementById('regClean').value;
      const diet = document.getElementById('regDiet').value;
      const smoke = document.getElementById('regSmoke').value;
      const fin = document.getElementById('regFin').value;

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
            rentPaymentHabit: fin,
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

      alert('🎉 Profile registration complete! Entering your personalized discovery feed.');
      await loadFeed();
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

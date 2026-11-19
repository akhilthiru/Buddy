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
    .persona-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 1px solid var(--border);
      padding: 4px 12px 4px 5px;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .persona-badge:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }
    .persona-badge img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
    .persona-badge span { font-size: 13px; font-weight: 700; color: var(--text); }
    .badge-incomplete {
      font-size: 10px;
      background: #FEF3C7;
      color: #92400E;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 10px;
    }

    /* Onboarding Mode: conversational Bumble-style flow without distraction */
    body.onboarding-mode .app-header,
    body.onboarding-mode .mobile-bottom-nav {
      display: none !important;
    }

    body.onboarding-mode {
      background: #F8FAFC;
    }
    body.onboarding-mode .app-main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }

    /* Login & Authentication Gateway Card */
    .login-container {
      max-width: 440px;
      width: 100%;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 30px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.07), 0 0 1px 1px rgba(0,0,0,0.04);
      text-align: center;
    }
    .login-brand-icon {
      width: 58px;
      height: 58px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: 900;
      margin: 0 auto 14px auto;
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
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
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
      width: 100%;
      box-sizing: border-box;
    }
    .wizard-progress-bar::before {
      content: "";
      position: absolute;
      top: 14px;
      left: 18px;
      right: 18px;
      height: 3px;
      background: #E2E8F0;
      z-index: 1;
      border-radius: 2px;
    }
    .progress-fill {
      position: absolute;
      top: 14px;
      left: 18px;
      height: 3px;
      background: var(--primary);
      z-index: 2;
      transition: width 0.3s ease;
      width: 0%;
      max-width: calc(100% - 36px);
      border-radius: 2px;
    }
    .step-node {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s ease;
    }
    .step-node:hover .step-circle {
      border-color: var(--primary);
      transform: scale(1.1);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
    .step-node:hover .step-label {
      color: var(--primary-dark);
    }
    .step-node:active {
      transform: scale(0.96);
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

    /* Bumble-style Option Selection Cards */
    .option-cards-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }
    .option-select-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 16px;
      background: #FFFFFF;
      border: 1.5px solid var(--border);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .option-select-card:hover {
      border-color: #CBD5E1;
      background: #F8FAFC;
    }
    .option-select-card.selected {
      border-color: var(--primary);
      background: var(--primary-50);
      box-shadow: 0 0 0 1.5px var(--primary);
    }
    .option-icon {
      font-size: 22px;
      line-height: 1;
      flex-shrink: 0;
    }
    .option-content {
      flex: 1;
      min-width: 0;
    }
    .option-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.25;
    }
    .option-desc {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
      line-height: 1.3;
    }
    .option-radio {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
      background: white;
    }
    .option-select-card.selected .option-radio {
      border-color: var(--primary);
      background: var(--primary);
    }
    .option-select-card.selected .option-radio::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #FFFFFF;
    }

    /* Buttons */
    .btn {
      padding: 12px 20px;
      border-radius: 12px;
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
    .wizard-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
      width: 100%;
      box-sizing: border-box;
    }
    .wizard-actions .btn {
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      min-height: 44px;
      box-sizing: border-box;
    }
    .wizard-actions .btn-primary {
      flex: 1 1 auto;
      justify-content: center;
    }
    .wizard-actions .btn-secondary,
    .wizard-actions .btn-outline {
      flex: 0 1 auto;
    }
    @media (max-width: 520px) {
      .wizard-actions {
        flex-direction: column-reverse;
        gap: 8px;
      }
      .wizard-actions .btn {
        width: 100%;
        justify-content: center;
        white-space: normal;
        text-align: center;
      }
    }

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
       RESPONSIVE MATCHES: MODERN DESKTOP TILE GRID & MOBILE LIST
       ------------------------------------------------------------- */
    .matches-listing-wrapper {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }
    .matches-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-bottom: 22px;
      background: #FFFFFF;
      padding: 18px 24px;
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow-sm);
    }
    .match-count-pill {
      background: var(--primary-light);
      color: var(--primary-dark);
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .match-filter-tabs {
      display: flex;
      gap: 6px;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 10px;
    }
    .match-filter-tab {
      border: none;
      background: none;
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .match-filter-tab.active {
      background: white;
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }

    /* Desktop Tile/Card Grid */
    .desktop-match-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 22px;
    }
    @media (max-width: 768px) {
      .desktop-match-grid { display: none !important; }
    }

    .match-tile-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .match-tile-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary);
    }
    .match-tile-photo-box {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #0F172A;
    }
    .match-tile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }
    .match-tile-card:hover .match-tile-photo {
      transform: scale(1.04);
    }
    .match-tile-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(0,0,0,0) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 14px;
    }
    .match-tile-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .match-compat-gauge {
      background: rgba(13, 148, 136, 0.95);
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11.5px;
      font-weight: 800;
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .match-verify-pill {
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 4px 9px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      backdrop-filter: blur(4px);
    }
    .match-tile-name-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      color: white;
    }
    .match-tile-name {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: -0.3px;
    }
    .match-tile-age {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 600;
    }

    .match-tile-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
    }
    .match-tile-work {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .match-modality-pill {
      background: var(--primary-50);
      color: var(--primary-dark);
      font-size: 11.5px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      width: fit-content;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .match-suburb-line {
      font-size: 12.5px;
      color: var(--text);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .match-harmony-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 2px;
    }
    .match-harmony-chip {
      background: #F1F5F9;
      color: #334155;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .match-tile-footer {
      padding: 12px 16px 16px 16px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 10px;
    }

    /* Mobile Match Listing Experience (Screens < 768px) */
    .mobile-matches-view {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    @media (min-width: 769px) {
      .mobile-matches-view { display: none !important; }
    }
    .mobile-new-matches-tray {
      display: flex;
      gap: 14px;
      overflow-x: auto;
      padding: 8px 4px 16px 4px;
      margin-bottom: 12px;
      scrollbar-width: none;
    }
    .mobile-new-matches-tray::-webkit-scrollbar { display: none; }
    .mobile-tray-bubble {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .mobile-tray-avatar-wrap {
      position: relative;
    }
    .mobile-tray-avatar {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      object-fit: cover;
      border: 2.5px solid var(--primary);
      padding: 1px;
    }
    .mobile-tray-name {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
      max-width: 64px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
    .mobile-tray-compat {
      font-size: 10px;
      font-weight: 800;
      color: var(--primary-dark);
      background: var(--primary-50);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .mobile-conv-list {
      display: flex;
      flex-direction: column;
      background: white;
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .mobile-conv-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.15s;
    }
    .mobile-conv-item:last-child { border-bottom: none; }
    .mobile-conv-item:hover { background: #F8FAFC; }
    .mobile-conv-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .mobile-conv-info { flex: 1; overflow: hidden; }
    .mobile-conv-top { display: flex; justify-content: space-between; align-items: baseline; }
    .mobile-conv-name { font-size: 14.5px; font-weight: 800; color: var(--text); }
    .mobile-conv-time { font-size: 11px; color: var(--text-muted); }
    .mobile-conv-badge-row { display: flex; gap: 6px; align-items: center; margin: 3px 0; }
    .mobile-conv-snippet {
      font-size: 12.5px;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Active Chat Container */
    .active-chat-container {
      display: flex;
      flex-direction: column;
      height: 700px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }
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

    /* -------------------------------------------------------------
       SCREEN: UNIFIED PROFILE & ACCOUNT MANAGEMENT (RESPONSIVE)
       ------------------------------------------------------------- */
    .profile-view-wrap {
      max-width: 680px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-sizing: border-box;
      padding: 0 16px;
    }
    .profile-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow-sm);
      box-sizing: border-box;
    }
    .profile-header-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: var(--shadow-sm);
      box-sizing: border-box;
    }
    .profile-header-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-100);
      flex-shrink: 0;
    }
    .profile-header-details {
      flex: 1;
      min-width: 0;
    }
    .profile-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .profile-name-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--text);
    }
    .profile-badge-active {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ECFDF5;
      color: #065F46;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 12px;
    }
    .profile-subtext {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .profile-phone-text {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .profile-header-action {
      flex-shrink: 0;
    }
    .profile-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    @media (max-width: 600px) {
      .profile-view-wrap {
        padding: 0 12px;
        gap: 14px;
      }
      .profile-header-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 20px 16px;
        gap: 14px;
      }
      .profile-header-avatar {
        width: 76px;
        height: 76px;
      }
      .profile-name-row {
        justify-content: center;
      }
      .profile-header-action {
        width: 100%;
      }
      .profile-header-action .btn {
        width: 100%;
        justify-content: center;
        padding: 12px;
        font-size: 14px;
      }
      .profile-card {
        padding: 18px 16px;
      }
      .profile-actions-bar {
        flex-direction: column;
        gap: 10px;
      }
      .profile-actions-bar .btn {
        width: 100%;
        justify-content: center;
      }
    }

    /* Profile Section Highlights */
    .section-highlight {
      outline: 3px solid var(--primary) !important;
      box-shadow: 0 0 0 6px rgba(13, 148, 136, 0.25), var(--shadow-lg) !important;
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }

    /* Mobile Preferences Button in Top Header */
    .mobile-pref-btn {
      display: none;
      align-items: center;
      gap: 6px;
      background: #F1F5F9;
      border: 1.5px solid var(--border);
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .mobile-pref-btn:hover {
      background: #E2E8F0;
      border-color: var(--primary);
      color: var(--primary);
    }
    @media (max-width: 860px) {
      .mobile-pref-btn { display: inline-flex; }
      #headerProfileBadge { display: none !important; }
      #headerLogoutBtn { display: none !important; }
    }

    /* Quick Jump Section Pills */
    .quick-jump-pill {
      background: white;
      border: 1px solid var(--border);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .quick-jump-pill:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary-dark);
    }

    /* Profile Completion Dashboard */
    .completion-dashboard-wrap {
      max-width: 680px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-sizing: border-box;
      padding: 0 16px;
    }
    .completion-meter-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 28px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: var(--shadow-sm);
    }
    .circular-progress-svg {
      width: 104px;
      height: 104px;
      transform: rotate(-90deg);
    }
    .circular-progress-bg {
      fill: none;
      stroke: #F1F5F9;
      stroke-width: 9;
    }
    .circular-progress-bar {
      fill: none;
      stroke: var(--primary);
      stroke-width: 9;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.8s ease-in-out;
    }
    .completion-meter-center {
      position: relative;
      width: 104px;
      height: 104px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .completion-meter-text {
      position: absolute;
      font-size: 22px;
      font-weight: 900;
      color: var(--text);
      letter-spacing: -0.5px;
    }
    .completion-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .completion-section-card {
      background: white;
      border: 1.5px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }
    .completion-section-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .comp-status-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .comp-status-pill.completed {
      background: #ECFDF5;
      color: #065F46;
    }
    .comp-status-pill.partial {
      background: #FEF3C7;
      color: #92400E;
    }
    .comp-status-pill.not-started {
      background: #F1F5F9;
      color: var(--text-muted);
    }
    @media (max-width: 600px) {
      .completion-meter-card {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
      .completion-cards-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body class="">

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
          <span class="badge-count" id="headerMatchesBadge" style="display: none;">0</span>
        </button>
        <button class="nav-btn" id="dnav-rooms" onclick="navigateTab('rooms')">
          🏠 Room Listings
        </button>
      </nav>

      <!-- Action items: Unified Profile Entry Point -->
      <div class="header-actions">
        <!-- Mobile Header: Preferences Only -->
        <button id="headerMobilePrefBtn" class="mobile-pref-btn" onclick="openPreferencesModal()" title="Matching Preferences">
          🎚️ Preferences
        </button>

        <button id="headerSignInBtn" class="btn btn-primary" style="font-size: 13px; padding: 7px 16px; border-radius: 20px;" onclick="navigateTab('profile')">
          👤 Sign In
        </button>

        <!-- Web Header: Avatar Only as Centralised Profile Entry Point -->
        <div class="persona-badge" id="headerProfileBadge" onclick="navigateTab('profile')" title="My Profile & Account" style="display: none;">
          <img id="headerUserAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar">
          <span id="headerUserName">Profile</span>
          <span id="headerIncompletePill" class="badge-incomplete" style="display: none;">Incomplete</span>
        </div>
      </div>
    </div>
  </header>

  <!-- MAIN VIEWPORT -->
  <main class="app-main">

    <!-- =========================================================
         VIEW 1: REGISTRATION & ONBOARDING WIZARD (CONVERSATIONAL BUMBLE-STYLE)
         ========================================================= -->
    <section id="view-registration" class="view-panel">
      <div class="wizard-container">
        
        <!-- Onboarding Top Bar with Back Button & Step Counter -->
        <div class="onboarding-top-bar">
          <button class="onboarding-back-btn" id="obBackBtn" onclick="goBackOnboardingStep()" style="display: none;">
            ← Back
          </button>
          <span class="onboarding-step-counter" id="obStepCounter">Question 1 of 12</span>
          <button class="onboarding-exit-btn" onclick="cancelOnboarding()" title="Exit and Return to Profile">✕ Exit</button>
        </div>

        <!-- 5 Subsections Progress Bar with Completion Ticks -->
        <div class="wizard-progress-bar">
          <div class="progress-fill" id="wizardProgressFill"></div>
          <div class="step-node active" id="node-step-1" onclick="goToOnboardingStep(1)" role="button" tabindex="0" title="Jump to Basics">
            <div class="step-circle" id="circle-step-1">1</div>
            <span class="step-label">Basics</span>
          </div>
          <div class="step-node" id="node-step-2" onclick="goToOnboardingStep(3)" role="button" tabindex="0" title="Jump to About Me">
            <div class="step-circle" id="circle-step-2">2</div>
            <span class="step-label">About</span>
          </div>
          <div class="step-node" id="node-step-3" onclick="goToOnboardingStep(4)" role="button" tabindex="0" title="Jump to Housing Preferences">
            <div class="step-circle" id="circle-step-3">3</div>
            <span class="step-label">Housing</span>
          </div>
          <div class="step-node" id="node-step-4" onclick="goToOnboardingStep(6)" role="button" tabindex="0" title="Jump to Lifestyle & Habits">
            <div class="step-circle" id="circle-step-4">4</div>
            <span class="step-label">Lifestyle</span>
          </div>
          <div class="step-node" id="node-step-5" onclick="goToOnboardingStep(10)" role="button" tabindex="0" title="Jump to Optional Hosting & Finish">
            <div class="step-circle" id="circle-step-5">5</div>
            <span class="step-label">Finish</span>
          </div>
        </div>

        <!-- SUBSECTION 1: BASICS & IDENTITY -->
        <!-- STEP 1: DISPLAY NAME -->
        <div class="wizard-step active" id="reg-step-1">
          <div class="step-title-group">
            <h2>What should we call you? 👋</h2>
            <p>Your name is how potential flatmates and roommates will know you on Buddy.</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Your Full Name</label>
            <input type="text" id="regName" value="Kiran Kumar" placeholder="e.g. Kiran Kumar" onkeypress="if(event.key==='Enter') goToOnboardingStep(2)">
          </div>

          <div class="wizard-actions">
            <div></div>
            <button class="btn btn-primary" onclick="goToOnboardingStep(2)">Next: Preferences →</button>
          </div>
        </div>

        <!-- STEP 2: GENDER & PREFERRED GENDER -->
        <div class="wizard-step" id="reg-step-2">
          <div class="step-title-group">
            <h2>Gender & Living Preferences</h2>
            <p>Tell us your gender and who you are comfortable sharing an apartment or flat with.</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>I identify as</label>
            <input type="hidden" id="regGender" value="MALE">
            <div class="option-cards-list" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              <div class="option-select-card selected" style="padding: 10px; justify-content: center; text-align: center; margin-bottom: 0;" data-val="MALE" onclick="pickOptionCard('regGender', 'MALE', this)">
                <div class="option-title">👨 Male</div>
              </div>
              <div class="option-select-card" style="padding: 10px; justify-content: center; text-align: center; margin-bottom: 0;" data-val="FEMALE" onclick="pickOptionCard('regGender', 'FEMALE', this)">
                <div class="option-title">👩 Female</div>
              </div>
              <div class="option-select-card" style="padding: 10px; justify-content: center; text-align: center; margin-bottom: 0;" data-val="NON_BINARY" onclick="pickOptionCard('regGender', 'NON_BINARY', this)">
                <div class="option-title">🧑 Other</div>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 16px;">
            <label>I prefer living with</label>
            <input type="hidden" id="regPrefGender" value="ANY">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="ANY" onclick="pickOptionCard('regPrefGender', 'ANY', this)">
                <div class="option-icon">🌈</div>
                <div class="option-content">
                  <div class="option-title">Any Gender</div>
                  <div class="option-desc">Open-minded co-living environment</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="MALE" onclick="pickOptionCard('regPrefGender', 'MALE', this)">
                <div class="option-icon">👨</div>
                <div class="option-content">
                  <div class="option-title">Male Flatmates Only</div>
                  <div class="option-desc">All-male flat arrangement</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="FEMALE" onclick="pickOptionCard('regPrefGender', 'FEMALE', this)">
                <div class="option-icon">👩</div>
                <div class="option-content">
                  <div class="option-title">Female Flatmates Only</div>
                  <div class="option-desc">All-female flat arrangement</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(3)">Next: Profile Info →</button>
          </div>
        </div>

        <!-- SUBSECTION 2: ABOUT -->
        <!-- STEP 3: AGE & OCCUPATION -->
        <div class="wizard-step" id="reg-step-3">
          <div class="step-title-group">
            <h2>When's your birthday & what do you do?</h2>
            <p>Age verification ensures a safe 18+ community in Trivandrum.</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Date of Birth</label>
            <input type="date" id="regBirthDate" value="1998-05-15">
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <label>Occupation & Company or College</label>
            <input type="text" id="regOccupation" value="Frontend Engineer @ IBS Software" placeholder="e.g. Software Engineer @ Infosys, Student @ CET" onkeypress="if(event.key==='Enter') goToOnboardingStep(4)">
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <label>Short Bio (Optional)</label>
            <textarea id="regBio" rows="2" placeholder="Tell potential flatmates a little about your routine and vibe...">Techie looking for a relaxed, clean flatmate near Technopark Phase I. Non-smoker, enjoys football on weekends and quiet evenings.</textarea>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(4)">Next: Housing →</button>
          </div>
        </div>

        <!-- SUBSECTION 3: HOUSING SITUATION -->
        <!-- STEP 4: HOUSING MODALITY -->
        <div class="wizard-step" id="reg-step-4">
          <div class="step-title-group">
            <h2>What's your current housing situation?</h2>
            <p>In Buddy, accommodation is completely optional! Choose what fits your status:</p>
          </div>

          <div class="modality-cards-grid" style="margin-top: 12px;">
            <div class="modality-select-card" data-modality="MODALITY_1" onclick="pickModalityCard('MODALITY_1', this)">
              <div class="modality-icon">🏠</div>
              <div class="modality-title">Have a Room</div>
              <div class="modality-desc">I have a flat/room in Trivandrum and am searching for a flatmate to move in.</div>
            </div>

            <div class="modality-select-card" data-modality="MODALITY_2" onclick="pickModalityCard('MODALITY_2', this)">
              <div class="modality-icon">🛏</div>
              <div class="modality-title">Need a Room</div>
              <div class="modality-desc">I am actively looking for an existing room in a flat shared with compatible people.</div>
            </div>

            <div class="modality-select-card" data-modality="MODALITY_3" onclick="pickModalityCard('MODALITY_3', this)">
              <div class="modality-icon">🔄</div>
              <div class="modality-title">Want to Relocate</div>
              <div class="modality-desc">Currently renting, but want to relocate to a new area with a compatible flatmate.</div>
            </div>

            <div class="modality-select-card selected" data-modality="MODALITY_4" onclick="pickModalityCard('MODALITY_4', this)">
              <div class="modality-icon">🤝</div>
              <div class="modality-title">Team-Up First</div>
              <div class="modality-desc">Person-first! Find a compatible flatmate first, then flat-hunt together in TVM.</div>
            </div>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(5)">Next: Suburbs →</button>
          </div>
        </div>

        <!-- STEP 5: LOCATION & BUDGET -->
        <div class="wizard-step" id="reg-step-5">
          <div class="step-title-group">
            <h2>Where & what budget?</h2>
            <p>Select your preferred Trivandrum neighborhoods and maximum monthly budget per head.</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Select Preferred Suburbs (Tap to select)</label>
            <div class="suburb-pills-wrap" id="suburbPillsWrap">
              <span class="suburb-pill selected" data-suburb="KAZHAKKOOTTAM" onclick="toggleSuburbPill('KAZHAKKOOTTAM', this)">Kazhakkoottam</span>
              <span class="suburb-pill selected" data-suburb="KARIAVATTOM" onclick="toggleSuburbPill('KARIAVATTOM', this)">Kariavattom</span>
              <span class="suburb-pill selected" data-suburb="SREEKARYAM" onclick="toggleSuburbPill('SREEKARYAM', this)">Sreekaryam</span>
              <span class="suburb-pill" data-suburb="ULLOOR" onclick="toggleSuburbPill('ULLOOR', this)">Ulloor</span>
              <span class="suburb-pill" data-suburb="PATTOM" onclick="toggleSuburbPill('PATTOM', this)">Pattom</span>
              <span class="suburb-pill" data-suburb="KOWDIAR" onclick="toggleSuburbPill('KOWDIAR', this)">Kowdiar</span>
              <span class="suburb-pill" data-suburb="VELLAYAMBALAM" onclick="toggleSuburbPill('VELLAYAMBALAM', this)">Vellayambalam</span>
              <span class="suburb-pill" data-suburb="MANACAUD" onclick="toggleSuburbPill('MANACAUD', this)">Manacaud</span>
            </div>
            <input type="hidden" id="regSuburbs" value="KAZHAKKOOTTAM, KARIAVATTOM, SREEKARYAM">
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Max Budget per Person (₹ INR / Month)</label>
            <input type="number" id="regMaxBudget" value="9500" min="2000" step="500">
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(6)">Next: Daily Rhythm →</button>
          </div>
        </div>

        <!-- SUBSECTION 4: CORE LIFESTYLE -->
        <!-- STEP 6: SLEEP RHYTHM -->
        <div class="wizard-step" id="reg-step-6">
          <div class="step-title-group">
            <h2>🌙 Sleep Schedule & Daily Rhythm</h2>
            <p>Daily routines impact living harmony the most. When are you awake and sleeping?</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Sleep Schedule</label>
            <input type="hidden" id="regSleep" value="EARLY_BIRD">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="EARLY_BIRD" onclick="pickOptionCard('regSleep', 'EARLY_BIRD', this)">
                <div class="option-icon">🌅</div>
                <div class="option-content">
                  <div class="option-title">Early Bird</div>
                  <div class="option-desc">Sleep by 10:30 PM, awake by 6:30 AM</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="NIGHT_OWL" onclick="pickOptionCard('regSleep', 'NIGHT_OWL', this)">
                <div class="option-icon">🦉</div>
                <div class="option-content">
                  <div class="option-title">Night Owl</div>
                  <div class="option-desc">Sleep 1:00 AM+, awake 9:00 AM+</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="FLEXIBLE" onclick="pickOptionCard('regSleep', 'FLEXIBLE', this)">
                <div class="option-icon">⚡</div>
                <div class="option-content">
                  <div class="option-title">Flexible Routine</div>
                  <div class="option-desc">Adapts to work shifts and weekend schedules</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbSleep" checked> Strict Dealbreaker (Opposing sleep patterns filtered)
            </label>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(7)">Next: Cleanliness →</button>
          </div>
        </div>

        <!-- STEP 7: CLEANLINESS -->
        <div class="wizard-step" id="reg-step-7">
          <div class="step-title-group">
            <h2>🧹 Cleanliness & Kitchen Sink Standards</h2>
            <p>How clean do you keep your common areas and kitchen sink?</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Cleanliness Level</label>
            <input type="hidden" id="regClean" value="METICULOUS">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="METICULOUS" onclick="pickOptionCard('regClean', 'METICULOUS', this)">
                <div class="option-icon">✨</div>
                <div class="option-content">
                  <div class="option-title">Meticulous</div>
                  <div class="option-desc">Dishes washed immediately, spotless common spaces</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="MODERATE" onclick="pickOptionCard('regClean', 'MODERATE', this)">
                <div class="option-icon">🧼</div>
                <div class="option-content">
                  <div class="option-title">Moderate</div>
                  <div class="option-desc">Cleaned daily, tidy by end of day</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="RELAXED" onclick="pickOptionCard('regClean', 'RELAXED', this)">
                <div class="option-icon">🛋️</div>
                <div class="option-content">
                  <div class="option-title">Relaxed</div>
                  <div class="option-desc">Casual living, scheduled weekly cleanings</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbClean" checked> Strict Dealbreaker (Cleanliness level must align)
            </label>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(8)">Next: Dietary Policy →</button>
          </div>
        </div>

        <!-- STEP 8: DIETARY POLICY -->
        <div class="wizard-step" id="reg-step-8">
          <div class="step-title-group">
            <h2>🍲 Food & Kitchen Sharing Policy</h2>
            <p>Do you cook non-veg, require a pure vegetarian kitchen, or eat eggs?</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Dietary Type</label>
            <input type="hidden" id="regDiet" value="NON_VEGETARIAN">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="NON_VEGETARIAN" onclick="pickOptionCard('regDiet', 'NON_VEGETARIAN', this)">
                <div class="option-icon">🍗</div>
                <div class="option-content">
                  <div class="option-title">Non-Vegetarian</div>
                  <div class="option-desc">Cooking meat & non-veg at home is completely fine</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="STRICT_VEGETARIAN" onclick="pickOptionCard('regDiet', 'STRICT_VEGETARIAN', this)">
                <div class="option-icon">🥦</div>
                <div class="option-content">
                  <div class="option-title">Strict Vegetarian</div>
                  <div class="option-desc">Requires pure veg-only kitchen environment</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="EGGETARIAN" onclick="pickOptionCard('regDiet', 'EGGETARIAN', this)">
                <div class="option-icon">🍳</div>
                <div class="option-content">
                  <div class="option-title">Eggetarian</div>
                  <div class="option-desc">Vegetarian diet with eggs allowed in kitchen</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbDiet"> Strict Dealbreaker (Strict veg-only kitchen policy)
            </label>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-secondary" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(9)">Next: Smoking Habits →</button>
          </div>
        </div>

        <!-- STEP 9: SMOKING & SUBSTANCES -->
        <div class="wizard-step" id="reg-step-9">
          <div class="step-title-group">
            <h2>🚭 Smoking & Substance Habits</h2>
            <p>Smoke-free living is an important boundary for many roommates.</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Smoking Preference</label>
            <input type="hidden" id="regSmoke" value="NON_SMOKER_STRICT">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="NON_SMOKER_STRICT" onclick="pickOptionCard('regSmoke', 'NON_SMOKER_STRICT', this)">
                <div class="option-icon">🚭</div>
                <div class="option-content">
                  <div class="option-title">Strict Non-Smoker</div>
                  <div class="option-desc">Zero smoking permitted inside flat or on balcony</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="BALCONY_ONLY" onclick="pickOptionCard('regSmoke', 'BALCONY_ONLY', this)">
                <div class="option-icon">🌿</div>
                <div class="option-content">
                  <div class="option-title">Balcony Only</div>
                  <div class="option-desc">Smoking permitted outside on open balcony only</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="SMOKER" onclick="pickOptionCard('regSmoke', 'SMOKER', this)">
                <div class="option-icon">💨</div>
                <div class="option-content">
                  <div class="option-title">Smoker Friendly</div>
                  <div class="option-desc">Comfortable sharing with casual smokers</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbSmoke" checked> Strict Dealbreaker (Strict non-smoker requirement)
            </label>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-outline" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-secondary" onclick="goToOnboardingStep(10)">Optional (2m) →</button>
            <button class="btn btn-primary" onclick="finishMandatoryAndLaunch()">Finish & Match 🚀</button>
          </div>
        </div>

        <!-- STEP 10: HOUSEHOLD VIBE & HOSTING (ENHANCEMENT 5) -->
        <div class="wizard-step" id="reg-step-10">
          <div class="step-title-group">
            <h2>🎉 Household Vibe & Hosting Preferences</h2>
            <p>Do you prefer a tranquil retreat with minimal guests, or a socially active home with friends over?</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Household Hosting & Vibe</label>
            <input type="hidden" id="regVibe" value="BALANCED_CASUAL">
            <div class="option-cards-list">
              <div class="option-select-card" data-val="QUIET_SANCTUARY" onclick="pickOptionCard('regVibe', 'QUIET_SANCTUARY', this)">
                <div class="option-icon">🧘</div>
                <div class="option-content">
                  <div class="option-title">Quiet Sanctuary</div>
                  <div class="option-desc">Tranquil, peaceful retreat with minimal or no guests</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card selected" data-val="BALANCED_CASUAL" onclick="pickOptionCard('regVibe', 'BALANCED_CASUAL', this)">
                <div class="option-icon">⚖️</div>
                <div class="option-content">
                  <div class="option-title">Balanced & Casual</div>
                  <div class="option-desc">Quiet on workdays, occasional friends over with notice</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="SOCIALLY_ACTIVE" onclick="pickOptionCard('regVibe', 'SOCIALLY_ACTIVE', this)">
                <div class="option-icon">🎉</div>
                <div class="option-content">
                  <div class="option-title">Socially Active</div>
                  <div class="option-desc">Loves hosting friends, casual dinners & weekend gatherings</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px 14px; border-radius: 12px;">
            <label class="dealbreaker-toggle" style="color: #92400E; font-size: 13px;">
              <input type="checkbox" id="dbVibe"> Strict Dealbreaker (Hosting vibe must align)
            </label>
          </div>

          <div class="wizard-actions">
            <button class="btn btn-outline" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-secondary" onclick="finishMandatoryAndLaunch()">Skip for Now</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(11)">Next: Trust Badge →</button>
          </div>
        </div>

        <!-- SUBSECTION 5: TRUST BADGE & FINISH -->
        <!-- STEP 11: OPTIONAL TRUST BADGE -->
        <div class="wizard-step" id="reg-step-11">
          <div class="step-title-group">
            <h2>Claim Your Verified Trust Badge ⭐</h2>
            <p><strong>Optional:</strong> Verified profiles from Technopark IT firms and Trivandrum colleges receive 3x more mutual matches. You can verify now or skip and do it later!</p>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Institution / Workplace Type</label>
            <input type="hidden" id="regInstType" value="CORPORATE">
            <div class="option-cards-list">
              <div class="option-select-card selected" data-val="CORPORATE" onclick="pickOptionCard('regInstType', 'CORPORATE', this)">
                <div class="option-icon">💼</div>
                <div class="option-content">
                  <div class="option-title">Technopark Professional</div>
                  <div class="option-desc">Infosys, TCS, UST, Allianz, IBS Software, etc.</div>
                </div>
                <div class="option-radio"></div>
              </div>
              <div class="option-select-card" data-val="ACADEMIC" onclick="pickOptionCard('regInstType', 'ACADEMIC', this)">
                <div class="option-icon">🎓</div>
                <div class="option-content">
                  <div class="option-title">College Student</div>
                  <div class="option-desc">CET Trivandrum, University of Kerala, etc.</div>
                </div>
                <div class="option-radio"></div>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Institutional Email (Optional)</label>
            <input type="email" id="regInstEmail" value="kiran.kumar@infosys.com" placeholder="name@company.com or name@cet.ac.in">
          </div>

          <div class="wizard-actions">
            <button class="btn btn-outline" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-secondary" onclick="finishMandatoryAndLaunch()">Skip for Now</button>
            <button class="btn btn-primary" onclick="goToOnboardingStep(12)">Next: Photo →</button>
          </div>
        </div>

        <!-- STEP 12: OPTIONAL PROFILE PHOTO & READY TO LAUNCH -->
        <div class="wizard-step" id="reg-step-12">
          <div class="step-title-group">
            <h2>Add a Profile Photo 📸</h2>
            <p><strong>Optional:</strong> Profiles with photos get 4x more replies. Pick an avatar or finish and add one later.</p>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 16px 0;">
            <img id="regPhotoPreview" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" style="width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);">
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

          <div class="wizard-actions">
            <button class="btn btn-outline" onclick="goBackOnboardingStep()">← Back</button>
            <button class="btn btn-secondary" onclick="finishMandatoryAndLaunch()">Skip for Now</button>
            <button class="btn btn-primary" onclick="finishMandatoryAndLaunch()">
              Start Discovering 🚀
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- =========================================================
         VIEW 2: DISCOVERY STAGE (FLUID RESPONSIVE DECK)
         ========================================================= -->
    <section id="view-discover" class="view-panel active">
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
         VIEW 3: RESPONSIVE MATCHES & CONVERSATIONS
         ========================================================= -->
    <section id="view-matches" class="view-panel">
      <!-- 1. MATCHES LISTING VIEW (Desktop Grid + Mobile Stream) -->
      <div id="matchesListingContainer" class="matches-listing-wrapper">
        <div class="matches-header-bar">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h2 style="font-size: 24px; font-weight: 900; color: var(--text);">Your Matches</h2>
              <span class="match-count-pill" id="matchesHeaderPill">0 Connections</span>
            </div>
            <p style="font-size: 13.5px; color: var(--text-muted); margin-top: 4px;">Double opt-in mutual connections in Trivandrum</p>
          </div>
          <div class="match-filter-tabs">
            <button class="match-filter-tab active" onclick="filterMatchCards('ALL', this)">All</button>
            <button class="match-filter-tab" onclick="filterMatchCards('MODALITY_1', this)">Has Room</button>
            <button class="match-filter-tab" onclick="filterMatchCards('MODALITY_2', this)">Seeking Room</button>
            <button class="match-filter-tab" onclick="filterMatchCards('MODALITY_4', this)">Team-Up</button>
          </div>
        </div>

        <!-- Desktop Tile/Card Grid (Screens >= 768px) -->
        <div class="desktop-match-grid" id="desktopMatchGrid">
          <!-- Populated dynamically with rich match cards -->
        </div>

        <!-- Mobile-Specific Match Listing (Screens < 768px) -->
        <div class="mobile-matches-view" id="mobileMatchesView">
          <div class="mobile-new-matches-tray" id="mobileNewMatchesTray">
            <!-- Populated dynamically with avatar bubbles -->
          </div>
          <div class="mobile-conv-list" id="mobileConvList">
            <!-- Populated dynamically with mobile chat rows -->
          </div>
        </div>
      </div>

      <!-- 2. ACTIVE CONVERSATION / CHAT WINDOW -->
      <div id="activeChatContainer" class="active-chat-container" style="display: none;">
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 13px; border-radius: 8px;" onclick="closeChatAndBackToMatches()">
              ← Back to Matches
            </button>
            <div class="chat-partner-box">
              <img id="chatAvatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="chat-partner-avatar" alt="Partner">
              <div>
                <div class="chat-partner-name" id="chatName">Rahul Pillai</div>
                <div class="chat-partner-status" id="chatStatus">Online • 88% Compatibility</div>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" style="font-size: 12px; padding: 6px 12px;" onclick="viewPartnerProfileFromChat()">Profile</button>
            <button class="btn btn-outline" style="font-size: 12px; padding: 6px 10px; color: var(--danger); border-color: #FECACA;" onclick="triggerBlock()">Block</button>
          </div>
        </div>

        <div class="chat-safety-banner">
          🛡 Privacy First: Phone numbers, emails, and UPI handles are automatically masked until mutual trust is established.
        </div>

        <div class="messages-stream" id="msgStream">
          <!-- Messages injected dynamically -->
        </div>

        <div class="chat-input-bar">
          <input type="text" id="chatInputBox" class="chat-input" placeholder="Type a message or question..." onkeypress="if(event.key==='Enter') sendChatMessage()">
          <button class="chat-send-btn" onclick="sendChatMessage()">➤</button>
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
         VIEW 5: UNIFIED PROFILE & ACCOUNT MANAGEMENT
         ========================================================= -->
    <section id="view-profile" class="view-panel">
      <div id="profileContainer" class="profile-view-wrap">
        <!-- Dynamically rendered by renderProfileView() -->
      </div>
    </section>

    <!-- =========================================================
         VIEW 6: PROFILE COMPLETION DASHBOARD
         ========================================================= -->
    <section id="view-profile-completion" class="view-panel">
      <div id="completionDashboardContainer" class="completion-dashboard-wrap">
        <!-- Dynamically rendered by renderProfileCompletionDashboard() -->
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

  <!-- GUEST ACTION PROMPT MODAL -->
  <div class="modal-backdrop" id="guestPromptModal">
    <div class="modal-box" style="text-align: center; max-width: 380px;">
      <div style="font-size: 42px; margin-bottom: 8px;">🤝</div>
      <h2 style="font-size: 20px; font-weight: 800; color: var(--text);">Sign In to Buddy</h2>
      <p style="font-size: 13.5px; color: var(--text-muted); margin: 8px 0 20px 0; line-height: 1.5;" id="guestPromptText">
        Please sign in or create a quick account to connect with flatmates and save your preferences in Trivandrum.
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 12px; font-weight: 800;" onclick="closeGuestPromptModal(); navigateTab('profile');">
          Sign In / Create Account →
        </button>
        <button class="btn btn-outline" style="width: 100%; border-radius: 12px; padding: 10px;" onclick="closeGuestPromptModal()">
          Keep Browsing
        </button>
      </div>
    </div>
  </div>

  <!-- INCOMPLETE REGISTRATION MODAL -->
  <div class="modal-backdrop" id="incompleteRegModal">
    <div class="modal-box" style="text-align: center; max-width: 380px;">
      <div style="font-size: 42px; margin-bottom: 8px;">✨</div>
      <h2 style="font-size: 20px; font-weight: 800; color: var(--text);">Complete Registration to Connect</h2>
      <p style="font-size: 13.5px; color: var(--text-muted); margin: 8px 0 20px 0; line-height: 1.5;">
        You're only 1 minute away from sending interest to <strong id="incompletePromptName" style="color: var(--primary);">Candidate</strong>! Finish your quick mandatory preferences to unlock matching.
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 12px; font-weight: 800;" onclick="closeIncompleteRegModal(); startNewRegistration();">
          Complete Registration (1 Min) →
        </button>
        <button class="btn btn-outline" style="width: 100%; border-radius: 12px; padding: 10px;" onclick="closeIncompleteRegModal()">
          Maybe Later
        </button>
      </div>
    </div>
  </div>

  <!-- MATCHING PREFERENCES MODAL (MOBILE HEADER ACCESS) -->
  <div class="modal-backdrop" id="modalPreferences">
    <div class="modal-box" style="text-align: left; max-width: 440px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 22px;">🎚️</span>
          <h2 style="font-size: 19px; font-weight: 900; color: var(--text);">Match Preferences</h2>
        </div>
        <button class="onboarding-exit-btn" onclick="closePreferencesModal()" style="font-size: 16px;">✕</button>
      </div>

      <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.4;">
        Adjust your roommate discovery criteria. These filters update your match scoring and recommendations.
      </p>

      <div class="form-group" style="margin-bottom: 14px;">
        <label style="font-size: 13px;">Living Modality Status</label>
        <select id="modalPrefModality" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">
          <option value="MODALITY_1">Has Room Available (Seeking Flatmate)</option>
          <option value="MODALITY_2">Seeking Room in Existing Flat</option>
          <option value="MODALITY_3">Has Flat, Relocating with New Roommate</option>
          <option value="MODALITY_4" selected>Team-Up First to Search Together</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 14px;">
        <label style="font-size: 13px;">Roommate Gender Preference</label>
        <select id="modalPrefGender" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">
          <option value="ANY" selected>Any Gender Welcome</option>
          <option value="MALE">Male Flatmates Only</option>
          <option value="FEMALE">Female Flatmates Only</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 14px;">
        <label style="font-size: 13px;">Maximum Monthly Rent (₹)</label>
        <input type="number" id="modalPrefBudget" value="9500" step="500" min="2000" max="35000" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 14px; font-weight: 700;">
      </div>

      <div style="margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px; border-radius: 10px; margin-bottom: 18px;">
        <label class="dealbreaker-toggle" style="color: #92400E; font-size: 12.5px;">
          <input type="checkbox" id="modalPrefSmokeDealbreaker" checked> Strict Non-Smoker Required
        </label>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn btn-outline" style="flex: 1; border-radius: 12px; padding: 11px;" onclick="closePreferencesModal()">
          Cancel
        </button>
        <button class="btn btn-primary" style="flex: 1.5; border-radius: 12px; padding: 11px; font-weight: 800;" onclick="saveMatchingPreferencesFromModal()">
          Apply Filters ✔
        </button>
      </div>
    </div>
  </div>

  <script>
    // State
    let currentToken = null;
    let currentUser = null;
    let currentLifestyle = null;
    let candidates = [];
    let currentCardIndex = 0;
    let activeMatchPartner = null;
    let selectedModality = 'MODALITY_4';
    let wizardCurrentStep = 1;
    let pendingInterestCandidate = null;
    let authMode = 'signin';
    let otpSent = false;

    // Personas: Including an Incomplete user persona (Kiran) for interactive testing
    const PERSONAS = {
      adarsh: {
        id: 'usr_adarsh_001',
        phone: '+919876543211',
        name: 'Adarsh Nair',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        work: 'Senior Backend Engineer @ TCS Technopark',
        modality: 'MODALITY_1',
        isOnboardingCompleted: true
      },
      kiran: {
        id: 'usr_kiran_002',
        phone: '+919876543299',
        name: 'Kiran Kumar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        work: 'Technopark Associate • Needs Room (M2)',
        modality: 'MODALITY_2',
        isOnboardingCompleted: false
      },
      rahul: {
        id: 'usr_rahul_003',
        phone: '+919876543213',
        name: 'Rahul Pillai',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        work: 'Financial Analyst @ UST Global',
        modality: 'MODALITY_3',
        isOnboardingCompleted: true
      },
      anjali: {
        id: 'usr_anjali_004',
        phone: '+919876543214',
        name: 'Anjali Krishna',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        work: 'HR Specialist @ Allianz Technopark',
        modality: 'MODALITY_4',
        isOnboardingCompleted: true
      }
    };

    function showToast(msg) {
      let toast = document.getElementById('buddyToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'buddyToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#0F172A';
        toast.style.color = '#FFFFFF';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '24px';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '700';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toast.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = '1';
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
      }, 3500);
    }

    function showGuestPromptModal(actionName) {
      const modal = document.getElementById('guestPromptModal');
      const text = document.getElementById('guestPromptText');
      if (text) {
        text.textContent = (actionName === 'like')
          ? 'Please sign in or create an account to express interest in roommate candidates in Trivandrum.'
          : 'Please sign in or create an account to pass or save your roommate preferences.';
      }
      if (modal) modal.classList.add('active');
    }

    function closeGuestPromptModal() {
      const modal = document.getElementById('guestPromptModal');
      if (modal) modal.classList.remove('active');
    }

    function showIncompleteRegModal(candidateName) {
      const modal = document.getElementById('incompleteRegModal');
      const nameEl = document.getElementById('incompletePromptName');
      if (nameEl) nameEl.textContent = candidateName || 'Candidate';
      if (modal) modal.classList.add('active');
    }

    function closeIncompleteRegModal() {
      const modal = document.getElementById('incompleteRegModal');
      if (modal) modal.classList.remove('active');
    }

    function setAuthMode(mode) {
      authMode = mode;
      const tSign = document.getElementById('tabModeSignIn');
      const tReg = document.getElementById('tabModeRegister');
      if (tSign) tSign.classList.toggle('active', mode === 'signin');
      if (tReg) tReg.classList.toggle('active', mode === 'register');
      const otpGroup = document.getElementById('loginOtpGroup');
      if (otpGroup) otpGroup.style.display = 'none';
      otpSent = false;
      const btnAction = document.getElementById('btnLoginAction');
      if (btnAction) btnAction.textContent = 'Send OTP Code →';
      const alertBox = document.getElementById('loginAlertBox');
      if (alertBox) alertBox.style.display = 'none';
      const titleEl = document.getElementById('loginTitle');
      const descEl = document.getElementById('loginDesc');
      const phoneInput = document.getElementById('loginPhoneInput');
      if (mode === 'register') {
        if (titleEl) titleEl.textContent = 'Create Buddy Account';
        if (descEl) descEl.textContent = 'Join flatmate & roommate discovery in Thiruvananthapuram. Verify your mobile to begin.';
        if (phoneInput) phoneInput.value = '+919876599999';
      } else {
        if (titleEl) titleEl.textContent = 'Welcome to Buddy';
        if (descEl) descEl.textContent = 'Person-first flatmate & roommate discovery in Thiruvananthapuram. Sign in with your mobile number to unlock matching and chat.';
        if (phoneInput) phoneInput.value = '+919876543211';
      }
    }

    async function handleLoginSubmit() {
      const phoneInput = document.getElementById('loginPhoneInput');
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const alertBox = document.getElementById('loginAlertBox');
      if (alertBox) alertBox.style.display = 'none';

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
          const otpGroup = document.getElementById('loginOtpGroup');
          if (otpGroup) otpGroup.style.display = 'block';
          const btnAction = document.getElementById('btnLoginAction');
          if (btnAction) btnAction.textContent = 'Verify OTP & Enter Buddy →';
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = '#ECFDF5';
            alertBox.style.color = '#065F46';
            alertBox.textContent = '✔ OTP code sent! Use dev code 123456 to verify.';
          }
        } catch (e) {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = '#FEF2F2';
            alertBox.style.color = '#991B1B';
            alertBox.textContent = 'Error: ' + e.message;
          }
        }
      } else {
        // Step 2: Verify OTP
        const otpInput = document.getElementById('loginOtpInput');
        const otp = otpInput ? otpInput.value.trim() : '123456';
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
          currentUser = {
            id: data.user.id,
            phone: phone,
            name: (data.user && data.user.name) || '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            isOnboardingCompleted: isRegistered
          };

          updateHeaderUser(currentUser);
          await loadFeed();
          await loadMatches();

          if (!isRegistered) {
            navigateTab('profile');
          } else {
            navigateTab('discover');
          }
        } catch (e) {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = '#FEF2F2';
            alertBox.style.color = '#991B1B';
            alertBox.textContent = 'Verification error: ' + e.message;
          }
        }
      }
    }

    async function quickLoginPersona(key) {
      const p = PERSONAS[key];
      if (!p) return;
      await loginAsPersona(p);
      navigateTab('discover');
    }

    async function loginAsPersona(p) {
      currentUser = { ...p };

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

      const isRegistered = data.user ? data.user.isOnboardingCompleted : p.isOnboardingCompleted;
      currentUser.id = data.user ? data.user.id : p.id;
      currentUser.isOnboardingCompleted = isRegistered;

      await loadUserProfile();
      updateHeaderUser(currentUser);
      await loadFeed();
      await loadMatches();
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
      currentLifestyle = null;
      pendingInterestCandidate = null;
      localStorage.removeItem('buddy_token');
      localStorage.removeItem('buddy_phone');
      document.body.classList.remove('onboarding-mode');
      updateHeaderUser(null);
      await loadFeed();
      navigateTab('profile');
    }

    async function loadUserProfile() {
      if (!currentToken) return;
      try {
        const res = await fetch('/api/v1/profiles/me', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (res.ok) {
          const prof = await res.json();
          currentUser = {
            id: prof.userId,
            phone: localStorage.getItem('buddy_phone') || (currentUser ? currentUser.phone : '+919876543210'),
            name: prof.displayName,
            avatar: prof.photos && prof.photos[0] ? prof.photos[0].photoUrl : ((currentUser && currentUser.avatar) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
            work: prof.occupation,
            modality: prof.modality,
            isOnboardingCompleted: prof.isOnboardingCompleted,
            profile: prof
          };
          updateHeaderUser(currentUser);
        }
      } catch (e) {}

      try {
        const lRes = await fetch('/api/v1/lifestyle/me', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (lRes.ok) {
          currentLifestyle = await lRes.json();
        }
      } catch (e) {}
    }

    function updateHeaderUser(u) {
      const signInBtn = document.getElementById('headerSignInBtn');
      const badge = document.getElementById('headerProfileBadge');
      const incompletePill = document.getElementById('headerIncompletePill');

      if (!u || !currentToken) {
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        if (badge) badge.style.display = 'none';
      } else {
        if (signInBtn) signInBtn.style.display = 'none';
        if (badge) badge.style.display = 'inline-flex';
        const avatarEl = document.getElementById('headerUserAvatar');
        if (avatarEl && u.avatar) avatarEl.src = u.avatar;
        const nameEl = document.getElementById('headerUserName');
        if (nameEl) nameEl.textContent = (u.name ? u.name.split(' ')[0] : 'Profile');
        if (incompletePill) {
          incompletePill.style.display = (!u.isOnboardingCompleted) ? 'inline-block' : 'none';
        }
      }
    }

    async function cyclePersona() {
      const keys = Object.keys(PERSONAS);
      const currentKey = keys.find(k => PERSONAS[k].id === (currentUser && currentUser.id)) || 'adarsh';
      const nextKey = keys[(keys.indexOf(currentKey) + 1) % keys.length];
      await loginAsPersona(PERSONAS[nextKey]);
      renderProfileView();
    }

    // Matching Preferences Modal Handlers (Mobile Header)
    function openPreferencesModal() {
      const modal = document.getElementById('modalPreferences');
      if (!modal) return;
      const modEl = document.getElementById('modalPrefModality');
      const genEl = document.getElementById('modalPrefGender');
      const budEl = document.getElementById('modalPrefBudget');
      const smkEl = document.getElementById('modalPrefSmokeDealbreaker');

      if (currentUser) {
        if (modEl) modEl.value = currentUser.modality || (currentUser.profile && currentUser.profile.modality) || 'MODALITY_4';
        if (genEl) genEl.value = (currentUser.profile && currentUser.profile.preferredGender) || 'ANY';
        if (budEl) budEl.value = (currentUser.profile && currentUser.profile.maxBudget) || 9500;
      }
      if (currentLifestyle && smkEl) {
        smkEl.checked = currentLifestyle.substances ? Boolean(currentLifestyle.substances.isDealbreaker) : true;
      }
      modal.classList.add('active');
    }

    function closePreferencesModal() {
      const modal = document.getElementById('modalPreferences');
      if (modal) modal.classList.remove('active');
    }

    async function saveMatchingPreferencesFromModal() {
      const modVal = document.getElementById('modalPrefModality')?.value || 'MODALITY_4';
      const genVal = document.getElementById('modalPrefGender')?.value || 'ANY';
      const budVal = parseInt(document.getElementById('modalPrefBudget')?.value, 10) || 9500;
      const smkDb = document.getElementById('modalPrefSmokeDealbreaker')?.checked ?? true;

      if (currentUser) {
        currentUser.modality = modVal;
        selectedModality = modVal;
      }

      if (currentToken) {
        try {
          await fetch('/api/v1/profiles/me', {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(getMergedProfilePayload({
              modality: modVal,
              preferredGender: genVal,
              maxBudget: budVal
            }))
          });

          await fetch('/api/v1/lifestyle/me', {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(getMergedLifestylePayload({
              substances: {
                smokingHabit: (currentLifestyle && currentLifestyle.substances && currentLifestyle.substances.smokingHabit) || 'NON_SMOKER_STRICT',
                alcoholHabit: (currentLifestyle && currentLifestyle.substances && currentLifestyle.substances.alcoholHabit) || 'TEETOTALER',
                isDealbreaker: smkDb
              }
            }))
          });
        } catch (e) {}
      }

      closePreferencesModal();
      showToast('Matching preferences updated! Refreshing feed... ✔');
      await loadUserProfile();
      await loadFeed();
    }

    // Dynamic Profile Completion Calculation (18 Fields)
    function calculateProfileCompletion(user, lifestyle) {
      const p = (user && user.profile) ? user.profile : (user || {});
      const l = lifestyle || {};

      // Section 1: Basics (4 fields)
      const hasName = Boolean(p.displayName || p.name);
      const hasGender = Boolean(p.gender);
      const hasBirthDate = Boolean(p.birthDate);
      const hasPhoto = Boolean(p.avatar || (p.photos && p.photos.length > 0));
      const basicsCount = [hasName, hasGender, hasBirthDate, hasPhoto].filter(Boolean).length;

      // Section 2: About & Work (3 fields)
      const hasOcc = Boolean(p.occupation || p.work);
      const hasComp = Boolean(p.collegeOrCompany);
      const hasBio = Boolean(p.bio && p.bio.trim().length > 0);
      const aboutCount = [hasOcc, hasComp, hasBio].filter(Boolean).length;

      // Section 3: Housing & Criteria (4 fields)
      const hasMod = Boolean(p.modality);
      const hasPrefGen = Boolean(p.preferredGender);
      const hasSubs = Boolean(p.preferredSuburbs && p.preferredSuburbs.length > 0);
      const hasBudget = Boolean(p.maxBudget && p.maxBudget > 0);
      const housingCount = [hasMod, hasPrefGen, hasSubs, hasBudget].filter(Boolean).length;

      // Section 4: Lifestyle & Habits (4 fields)
      const hasSleep = Boolean(l.sleep && l.sleep.sleepPattern);
      const hasClean = Boolean(l.cleanliness && l.cleanliness.cleanlinessLevel);
      const hasDiet = Boolean(l.dietary && l.dietary.dietType);
      const hasSmoke = Boolean(l.substances && l.substances.smokingHabit);
      const lifestyleCount = [hasSleep, hasClean, hasDiet, hasSmoke].filter(Boolean).length;

      // Section 5: Household Vibe & Hosting (2 fields)
      const hasVibe = Boolean((l.household && l.household.householdVibe) || (l.social && l.social.partyPreference));
      const hasGuest = Boolean(l.social && l.social.guestFrequency);
      const hostingCount = [hasVibe, hasGuest].filter(Boolean).length;

      // Section 6: Trust & Verification (1 field)
      const isVerified = Boolean((p.verificationBadge && p.verificationBadge !== 'UNVERIFIED') || p.institutionalEmailVerified);
      const trustCount = isVerified ? 1 : 0;

      const totalFields = 18;
      const completedFields = basicsCount + aboutCount + housingCount + lifestyleCount + hostingCount + trustCount;
      const percentage = Math.min(100, Math.round((completedFields / totalFields) * 100));

      function getStatus(count, max) {
        if (count === max) return { key: 'completed', label: 'Completed ✔', pillClass: 'completed' };
        if (count > 0) return { key: 'partial', label: count + ' of ' + max + ' completed', pillClass: 'partial' };
        return { key: 'not-started', label: 'Not Started', pillClass: 'not-started' };
      }

      let tierTitle = '';
      let tierMessage = '';
      if (percentage >= 90) {
        tierTitle = 'Profile Star! ⭐';
        tierMessage = 'Awesome! Your profile is comprehensive and verified. You stand out to 3x more potential flatmates in Trivandrum.';
      } else if (percentage >= 70) {
        tierTitle = 'Looking Great! 🚀';
        tierMessage = 'Your profile is strong! Complete the remaining sections to reach 100% and get maximum match compatibility.';
      } else if (percentage >= 40) {
        tierTitle = 'Your profile has potential! 💡';
        tierMessage = 'Complete a few more sections to improve your profile and help find better roommate matches.';
      } else {
        tierTitle = "Let's build your profile! 🌱";
        tierMessage = 'Adding details about your habits, budget, and lifestyle helps us recommend your ideal flatmates.';
      }

      return {
        totalFields,
        completedFields,
        percentage,
        tierTitle,
        tierMessage,
        sections: {
          basics: { count: basicsCount, total: 4, status: getStatus(basicsCount, 4), id: 'prof-sec-basics', name: 'Basic Information', icon: '🪪' },
          about: { count: aboutCount, total: 3, status: getStatus(aboutCount, 3), id: 'prof-sec-about', name: 'About & Work', icon: '💼' },
          housing: { count: housingCount, total: 4, status: getStatus(housingCount, 4), id: 'prof-sec-housing', name: 'Housing & Criteria', icon: '🏡' },
          lifestyle: { count: lifestyleCount, total: 4, status: getStatus(lifestyleCount, 4), id: 'prof-sec-lifestyle', name: 'Lifestyle & Habits', icon: '🌿' },
          hosting: { count: hostingCount, total: 2, status: getStatus(hostingCount, 2), id: 'prof-sec-hosting', name: 'Household & Hosting', icon: '🎉' },
          trust: { count: trustCount, total: 1, status: getStatus(trustCount, 1), id: 'prof-sec-trust', name: 'Trust & Verification', icon: '⭐' }
        }
      };
    }

    // Profile Completion Dashboard Screen
    function renderProfileCompletionDashboard() {
      const container = document.getElementById('completionDashboardContainer');
      if (!container) return;

      const comp = calculateProfileCompletion(currentUser, currentLifestyle);
      const circumference = 2 * Math.PI * 45; // 282.74
      const offset = Math.max(0, circumference - (circumference * comp.percentage / 100));

      let cardsHtml = '';
      const secs = [
        comp.sections.basics,
        comp.sections.about,
        comp.sections.housing,
        comp.sections.lifestyle,
        comp.sections.hosting,
        comp.sections.trust
      ];

      for (const s of secs) {
        cardsHtml += 
          '<div class="completion-section-card" onclick="navigateToProfileSection(&apos;' + s.id + '&apos;)">' +
            '<div class="comp-sec-icon">' + s.icon + '</div>' +
            '<div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 4px;">' + s.name + '</div>' +
            '<div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 12px;">' + s.count + ' of ' + s.total + ' completed</div>' +
            '<div style="display: flex; justify-content: space-between; align-items: center;">' +
              '<span class="comp-status-pill ' + s.status.pillClass + '">' + s.status.label + '</span>' +
              '<span style="font-size: 13px; font-weight: 800; color: var(--primary);">Edit →</span>' +
            '</div>' +
          '</div>';
      }

      container.innerHTML = 
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
          '<button class="btn btn-outline" style="border-radius: 20px; font-size: 13px; padding: 6px 14px; gap: 6px;" onclick="navigateTab(&apos;profile&apos;)">' +
            '← Back to Profile' +
          '</button>' +
          '<div style="font-size: 12.5px; font-weight: 700; color: var(--text-muted);">Buddy Profile Hub</div>' +
        '</div>' +

        '<div class="completion-meter-card">' +
          '<div style="position: relative; width: 104px; height: 104px; flex-shrink: 0;">' +
            '<svg class="circular-progress-svg" viewBox="0 0 100 100">' +
              '<circle class="circular-progress-bg" cx="50" cy="50" r="45"></circle>' +
              '<circle class="circular-progress-bar" cx="50" cy="50" r="45" style="stroke-dasharray: ' + Math.round(circumference) + '; stroke-dashoffset: ' + Math.round(offset) + ';"></circle>' +
            '</svg>' +
            '<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
              '<span style="font-size: 24px; font-weight: 900; color: var(--text);">' + comp.percentage + '%</span>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div style="display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; margin-bottom: 6px;">' +
              'Profile Health' +
            '</div>' +
            '<h2 style="font-size: 20px; font-weight: 900; color: var(--text); margin-bottom: 4px;">' + comp.tierTitle + '</h2>' +
            '<p style="font-size: 13px; color: var(--text-muted); line-height: 1.45; margin-bottom: 10px;">' + comp.tierMessage + '</p>' +
            '<div style="font-size: 12.5px; font-weight: 700; color: var(--primary-dark);">' +
              '✔ ' + comp.completedFields + ' of ' + comp.totalFields + ' profile fields completed' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">' +
            '<h3 style="font-size: 16px; font-weight: 800; color: var(--text);">Profile Sections</h3>' +
            '<span style="font-size: 12px; color: var(--text-muted);">Click any card to edit details</span>' +
          '</div>' +
          '<div class="completion-cards-grid">' +
            cardsHtml +
          '</div>' +
        '</div>';
    }

    // Deep-Link Navigation to Profile Sections
    function navigateToProfileSection(sectionId) {
      navigateTab('profile');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('section-highlight');
          setTimeout(() => el.classList.remove('section-highlight'), 2200);
          const firstInput = el.querySelector('input:not([type="hidden"]), select, textarea');
          if (firstInput) firstInput.focus();
        }
      }, 150);
    }

    function jumpToSection(sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('section-highlight');
        setTimeout(() => el.classList.remove('section-highlight'), 1800);
      }
    }

    // Helpers to Merge Payloads
    function getMergedProfilePayload(updates) {
      const p = (currentUser && currentUser.profile) ? currentUser.profile : (currentUser || {});
      const birthDateStr = p.birthDate ? (typeof p.birthDate === 'string' ? p.birthDate.split('T')[0] : '1998-05-15') : '1998-05-15';
      const suburbs = (p.preferredSuburbs && p.preferredSuburbs.length > 0) ? p.preferredSuburbs : ['KAZHAKKOOTTAM', 'KARIAVATTOM'];

      return {
        displayName: (updates.displayName !== undefined ? updates.displayName : (p.displayName || currentUser.name || 'Buddy User')).trim(),
        gender: updates.gender || p.gender || 'MALE',
        preferredGender: updates.preferredGender || p.preferredGender || 'ANY',
        birthDate: updates.birthDate || birthDateStr,
        occupation: (updates.occupation !== undefined ? updates.occupation : (p.occupation || currentUser.work || 'Software Professional')).trim(),
        collegeOrCompany: (updates.collegeOrCompany !== undefined ? updates.collegeOrCompany : (p.collegeOrCompany || 'Technopark')).trim(),
        bio: (updates.bio !== undefined ? updates.bio : (p.bio || '')).trim(),
        modality: updates.modality || p.modality || currentUser.modality || 'MODALITY_4',
        minBudget: updates.minBudget || p.minBudget || 3000,
        maxBudget: updates.maxBudget ? parseInt(updates.maxBudget, 10) : (p.maxBudget || 9500),
        moveInFlexibility: updates.moveInFlexibility || p.moveInFlexibility || 'WITHIN_1_MONTH',
        preferredSuburbs: (updates.preferredSuburbs && updates.preferredSuburbs.length > 0) ? updates.preferredSuburbs : suburbs,
        isOnboardingCompleted: typeof updates.isOnboardingCompleted === 'boolean' ? updates.isOnboardingCompleted : (currentUser.isOnboardingCompleted !== false)
      };
    }

    function getMergedLifestylePayload(updates) {
      const l = currentLifestyle || {};
      const defSleep = { sleepPattern: 'EARLY_BIRD', shiftSchedule: 'NORMAL_DAY', noiseSensitivity: 'LIGHT_SLEEPER', isDealbreaker: false };
      const defClean = { cleanlinessLevel: 'METICULOUS', kitchenSinkRule: 'IMMEDIATE_WASH', maidPreference: 'OPEN_TO_MAID', isDealbreaker: false };
      const defDiet = { dietType: 'NON_VEGETARIAN', kitchenPolicy: 'NO_RESTRICTIONS', isDealbreaker: false };
      const defSocial = { guestFrequency: 'OCCASIONAL_FRIENDS', overnightGuestPolicy: 'SAME_GENDER_ONLY', partyPreference: 'WEEKEND_GATHERINGS', isDealbreaker: false };
      const defSubst = { smokingHabit: 'NON_SMOKER_STRICT', alcoholHabit: 'TEETOTALER', isDealbreaker: true };
      const defFin = { rentPaymentHabit: 'STRICT_1ST_OF_MONTH', acBillSplit: 'EQUAL_SPLIT', groceryTracking: 'SPLITWISE_APP', isDealbreaker: true };
      const defWork = { workMode: 'HYBRID', callFrequency: 'LOW', workspacePreference: 'PRIVATE_ROOM_DESK', isDealbreaker: false };
      const defHouse = { householdVibe: 'BALANCED_CASUAL', isDealbreaker: false };

      return {
        sleep: { ...(l.sleep || defSleep), ...(updates.sleep || {}) },
        cleanliness: { ...(l.cleanliness || defClean), ...(updates.cleanliness || {}) },
        dietary: { ...(l.dietary || defDiet), ...(updates.dietary || {}) },
        social: { ...(l.social || defSocial), ...(updates.social || {}) },
        substances: { ...(l.substances || defSubst), ...(updates.substances || {}) },
        financial: { ...(l.financial || defFin), ...(updates.financial || {}) },
        work: { ...(l.work || defWork), ...(updates.work || {}) },
        household: { ...(l.household || defHouse), ...(updates.household || {}) }
      };
    }

    function toggleProfileSuburbPill(el) {
      el.classList.toggle('selected');
    }

    // Section Save Handlers
    async function saveProfileBasics() {
      const name = document.getElementById('profBasicsName')?.value.trim();
      const gender = document.getElementById('profBasicsGender')?.value;
      const birthDate = document.getElementById('profBasicsBirthDate')?.value;
      const photoUrl = document.getElementById('profBasicsPhotoUrl')?.value.trim();

      if (!name) { alert('Please enter your full name'); return; }
      if (!birthDate) { alert('Please select your date of birth'); return; }

      try {
        const payload = getMergedProfilePayload({ displayName: name, gender, birthDate });
        const res = await fetch('/api/v1/profiles/me', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Error saving basics: ' + (err.detail || err.title || 'Validation error'));
          return;
        }

        if (photoUrl && photoUrl !== currentUser.avatar) {
          await fetch('/api/v1/profiles/me/photos', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoUrl, orderIndex: 0, isPrimary: true })
          });
          currentUser.avatar = photoUrl;
        }

        currentUser.name = name;
        updateHeaderUser(currentUser);
        await loadUserProfile();
        showToast('Basic information saved! ✔');
        renderProfileView();
      } catch (e) {
        showToast('Error saving basic info: ' + e.message);
      }
    }

    async function saveProfileAbout() {
      const occupation = document.getElementById('profAboutOccupation')?.value.trim();
      const collegeOrCompany = document.getElementById('profAboutCompany')?.value.trim();
      const bio = document.getElementById('profAboutBio')?.value.trim();

      try {
        const payload = getMergedProfilePayload({ occupation, collegeOrCompany, bio });
        const res = await fetch('/api/v1/profiles/me', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Error saving about: ' + (err.detail || err.title || 'Validation error'));
          return;
        }
        currentUser.work = occupation;
        await loadUserProfile();
        showToast('About & Work details saved! ✔');
        renderProfileView();
      } catch (e) {
        showToast('Error saving details: ' + e.message);
      }
    }

    async function saveProfileHousing() {
      const modality = document.getElementById('profHousingModality')?.value;
      const preferredGender = document.getElementById('profHousingPrefGender')?.value;
      const budget = parseInt(document.getElementById('profHousingBudget')?.value, 10);
      const moveInFlexibility = document.getElementById('profHousingFlexibility')?.value;

      const selectedPills = Array.from(document.querySelectorAll('#profHousingSuburbsWrap .suburb-pill.selected'))
        .map(p => p.getAttribute('data-suburb') || p.textContent.trim().toUpperCase());
      const suburbs = selectedPills.length > 0 ? selectedPills : ['KAZHAKKOOTTAM', 'KARIAVATTOM'];

      try {
        const payload = getMergedProfilePayload({
          modality,
          preferredGender,
          maxBudget: budget,
          moveInFlexibility,
          preferredSuburbs: suburbs
        });
        const res = await fetch('/api/v1/profiles/me', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Error saving housing criteria: ' + (err.detail || err.title || 'Validation error'));
          return;
        }
        currentUser.modality = modality;
        selectedModality = modality;
        await loadUserProfile();
        await loadFeed();
        showToast('Housing & criteria saved! Matching feed updated ✔');
        renderProfileView();
      } catch (e) {
        showToast('Error saving housing: ' + e.message);
      }
    }

    async function saveProfileLifestyle() {
      const sleepPattern = document.getElementById('profLifeSleep')?.value;
      const sleepDb = document.getElementById('profLifeSleepDb')?.checked ?? false;
      const cleanlinessLevel = document.getElementById('profLifeClean')?.value;
      const cleanDb = document.getElementById('profLifeCleanDb')?.checked ?? false;
      const dietType = document.getElementById('profLifeDiet')?.value;
      const dietDb = document.getElementById('profLifeDietDb')?.checked ?? false;
      const smokingHabit = document.getElementById('profLifeSmoke')?.value;
      const smokeDb = document.getElementById('profLifeSmokeDb')?.checked ?? false;

      try {
        const payload = getMergedLifestylePayload({
          sleep: { sleepPattern, isDealbreaker: sleepDb },
          cleanliness: { cleanlinessLevel, isDealbreaker: cleanDb },
          dietary: { dietType, isDealbreaker: dietDb },
          substances: { smokingHabit, isDealbreaker: smokeDb }
        });
        const res = await fetch('/api/v1/lifestyle/me', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Error saving lifestyle: ' + (err.detail || err.title || 'Validation error'));
          return;
        }
        await loadUserProfile();
        await loadFeed();
        showToast('Lifestyle habits saved! Compatibility recalculated ✔');
        renderProfileView();
      } catch (e) {
        showToast('Error saving lifestyle: ' + e.message);
      }
    }

    async function saveProfileHosting() {
      const vibe = document.getElementById('profHostVibe')?.value;
      const vibeDb = document.getElementById('profHostVibeDb')?.checked ?? false;
      const guest = document.getElementById('profHostGuest')?.value;

      try {
        const payload = getMergedLifestylePayload({
          social: {
            guestFrequency: guest,
            partyPreference: vibe === 'SOCIALLY_ACTIVE' ? 'WEEKEND_GATHERINGS' : 'NO_PARTIES',
            isDealbreaker: vibeDb
          },
          household: {
            householdVibe: vibe,
            isDealbreaker: vibeDb
          }
        });
        const res = await fetch('/api/v1/lifestyle/me', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + currentToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Error saving hosting preferences: ' + (err.detail || err.title || 'Validation error'));
          return;
        }
        await loadUserProfile();
        showToast('Household vibe & hosting preferences saved! ✔');
        renderProfileView();
      } catch (e) {
        showToast('Error saving preferences: ' + e.message);
      }
    }

    async function saveProfileTrust() {
      const email = document.getElementById('profTrustEmail')?.value.trim();
      const type = document.getElementById('profTrustType')?.value || 'CORPORATE';
      if (!email) {
        alert('Please enter your official institutional or company email.');
        return;
      }
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
          showToast('Trust badge verified successfully! ⭐');
          await loadUserProfile();
          renderProfileView();
        } else {
          showToast('Verification link sent to ' + email + ' ✉️');
        }
      } catch (e) {
        showToast('Verification request failed: ' + e.message);
      }
    }

    // Centralised Profile Management Screen
    function renderProfileView() {
      const container = document.getElementById('profileContainer');
      if (!container) return;

      if (!currentToken) {
        // GUEST: Render Login Gateway Card
        container.innerHTML = 
          '<div class="login-container">' +
            '<div class="login-brand-icon">🤝</div>' +
            '<h1 id="loginTitle" style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: var(--text); margin-bottom: 6px;">' +
              'Welcome to Buddy' +
            '</h1>' +
            '<p id="loginDesc" style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">' +
              'Person-first flatmate & roommate discovery in Thiruvananthapuram. Sign in with your mobile number to unlock matching and chat.' +
            '</p>' +
            '<div id="loginAlertBox" style="display: none; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin: 16px 0; font-weight: 600;"></div>' +
            '<div class="login-toggle-tabs">' +
              '<button class="login-toggle-tab active" id="tabModeSignIn" onclick="setAuthMode(&apos;signin&apos;)">Sign In</button>' +
              '<button class="login-toggle-tab" id="tabModeRegister" onclick="setAuthMode(&apos;register&apos;)">Create Account</button>' +
            '</div>' +
            '<div style="text-align: left; margin-bottom: 16px;">' +
              '<label style="font-size: 13px; font-weight: 700; color: var(--text); display: block; margin-bottom: 6px;">' +
                'Mobile Phone Number' +
              '</label>' +
              '<input type="text" id="loginPhoneInput" value="+919876543211" placeholder="+91 98765 43210" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 12px; font-size: 15px; font-weight: 600;">' +
            '</div>' +
            '<div id="loginOtpGroup" style="display: none; text-align: left; margin-bottom: 16px;">' +
              '<label style="font-size: 13px; font-weight: 700; color: var(--text); display: block; margin-bottom: 6px;">' +
                'Enter 6-Digit OTP Code' +
              '</label>' +
              '<input type="text" id="loginOtpInput" value="123456" placeholder="123456" maxlength="6" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--primary); border-radius: 12px; font-size: 18px; font-weight: 800; letter-spacing: 4px; text-align: center;">' +
              '<p style="font-size: 12px; color: var(--primary-dark); margin-top: 6px;">✔ Universal dev OTP code is <code>123456</code></p>' +
            '</div>' +
            '<button class="btn btn-primary" id="btnLoginAction" style="width: 100%; padding: 14px; font-size: 15px; font-weight: 800; border-radius: 12px; justify-content: center;" onclick="handleLoginSubmit()">' +
              'Send OTP Code →' +
            '</button>' +
            '<div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 20px;">' +
              '<p style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">' +
                '⚡ Quick Sign In as Demo Persona' +
              '</p>' +
              '<div class="login-persona-grid">' +
                '<div class="login-persona-chip" onclick="quickLoginPersona(&apos;adarsh&apos;)">' +
                  '<img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Adarsh">' +
                  '<div>' +
                    '<div class="name">Adarsh Nair</div>' +
                    '<div class="role">Complete • Has Room (M1)</div>' +
                  '</div>' +
                '</div>' +
                '<div class="login-persona-chip" onclick="quickLoginPersona(&apos;kiran&apos;)">' +
                  '<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Kiran">' +
                  '<div>' +
                    '<div class="name">Kiran Kumar</div>' +
                    '<div class="role" style="color: #D97706; font-weight: 700;">⚠️ Incomplete Reg</div>' +
                  '</div>' +
                '</div>' +
                '<div class="login-persona-chip" onclick="quickLoginPersona(&apos;rahul&apos;)">' +
                  '<img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Rahul">' +
                  '<div>' +
                    '<div class="name">Rahul Pillai</div>' +
                    '<div class="role">Complete • Relocating (M3)</div>' +
                  '</div>' +
                '</div>' +
                '<div class="login-persona-chip" onclick="quickLoginPersona(&apos;anjali&apos;)">' +
                  '<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Anjali">' +
                  '<div>' +
                    '<div class="name">Anjali Krishna</div>' +
                    '<div class="role">Complete • Team-Up (M4)</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        return;
      }

      // LOGGED IN: Centralised Profile Management
      const prof = (currentUser && currentUser.profile) ? currentUser.profile : (currentUser || {});
      const l = currentLifestyle || {};
      const comp = calculateProfileCompletion(currentUser, currentLifestyle);
      const isComplete = currentUser.isOnboardingCompleted;
      const birthDateStr = prof.birthDate ? (typeof prof.birthDate === 'string' ? prof.birthDate.split('T')[0] : '1998-05-15') : '1998-05-15';

      // 1. Top Header or Incomplete Banner
      let topHtml = '';
      if (!isComplete) {
        topHtml = 
          '<div style="background: white; border: 1.5px solid #FCD34D; border-radius: 20px; padding: 22px; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);">' +
            '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">' +
              '<div style="display: inline-flex; align-items: center; gap: 6px; background: #FEF3C7; color: #92400E; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px;">' +
                '⚠️ Registration Incomplete' +
              '</div>' +
              '<span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">' + (currentUser.phone || '') + '</span>' +
            '</div>' +
            '<h2 style="font-size: 20px; font-weight: 900; color: var(--text); margin-bottom: 6px;">' +
              'Complete Your Registration 🚀' +
            '</h2>' +
            '<p style="font-size: 13px; color: var(--text-muted); line-height: 1.45; margin-bottom: 14px;">' +
              'Your phone is verified! Complete your core living preferences to unlock swiping right (LIKE), matching, and messaging in Trivandrum.' +
            '</p>' +
            '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
              '<button class="btn btn-primary" style="flex: 1 1 180px; padding: 13px; font-size: 14px; font-weight: 800; border-radius: 12px; justify-content: center;" onclick="startNewRegistration()">' +
                'Complete via Wizard (1 min) →' +
              '</button>' +
              '<button class="btn btn-outline" style="flex: 1 1 140px; border-radius: 12px; font-size: 13px; padding: 13px; justify-content: center;" onclick="jumpToSection(&apos;prof-sec-basics&apos;)">' +
                'Edit Direct Below ↓' +
              '</button>' +
            '</div>' +
          '</div>';
      } else {
        topHtml = 
          '<div class="profile-header-card">' +
            '<div style="position: relative; flex-shrink: 0;">' +
              '<img id="myProfAvatar" class="profile-header-avatar" src="' + (currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80') + '" alt="' + (currentUser.name || 'User') + '">' +
              '<button onclick="jumpToSection(&apos;prof-sec-basics&apos;); document.getElementById(&apos;profBasicsPhotoUrl&apos;)?.focus();" title="Change Photo" style="position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer;">📷</button>' +
            '</div>' +
            '<div class="profile-header-details">' +
              '<div class="profile-name-row">' +
                '<h2 id="myProfName" class="profile-name-title">' + (currentUser.name || 'Buddy Member') + '</h2>' +
                ((prof.verificationBadge && prof.verificationBadge !== 'UNVERIFIED') 
                  ? '<div style="display: inline-flex; align-items: center; gap: 4px; background: #E0F2FE; color: #0369A1; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 12px;">⭐ ' + (prof.verificationBadge === 'VERIFIED_STUDENT' ? 'Student Verified' : 'Work Verified') + '</div>'
                  : '<div class="profile-badge-active">✔ Active Member</div>'
                ) +
              '</div>' +
              '<p id="myProfWork" class="profile-subtext">' + (currentUser.work || prof.occupation || 'Trivandrum Resident') + (prof.collegeOrCompany ? ' • ' + prof.collegeOrCompany : '') + '</p>' +
              '<div class="profile-phone-text">📱 ' + (currentUser.phone || '') + '</div>' +
            '</div>' +
            '<div class="profile-header-action">' +
              '<button class="btn btn-outline" style="border-radius: 12px; font-size: 13px;" onclick="jumpToSection(&apos;prof-sec-housing&apos;)">' +
                '🎚️ Preferences' +
              '</button>' +
            '</div>' +
          '</div>';
      }

      // 2. Profile Completion Banner
      const completionHtml = 
        '<div class="profile-card" style="padding: 20px; background: white;">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
              '<span style="font-size: 15px; font-weight: 900; color: var(--text);">Profile Completion</span>' +
              '<span style="font-size: 12px; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 10px;">' + comp.percentage + '%</span>' +
            '</div>' +
            '<button class="btn btn-outline" style="border-radius: 10px; font-size: 12px; padding: 4px 10px; font-weight: 700;" onclick="navigateTab(&apos;profile-completion&apos;)">' +
              'View Breakdown →' +
            '</button>' +
          '</div>' +
          '<div style="width: 100%; height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">' +
            '<div style="width: ' + comp.percentage + '%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; transition: width 0.5s ease;"></div>' +
          '</div>' +
          '<p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">' +
            comp.tierMessage +
          '</p>' +
        '</div>';

      // 3. Quick Section Jump Pills
      const quickJumpHtml = 
        '<div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-basics&apos;)">🪪 Basics</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-about&apos;)">💼 About</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-housing&apos;)">🏡 Housing</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-lifestyle&apos;)">🌿 Lifestyle</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-hosting&apos;)">🎉 Hosting</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-trust&apos;)">⭐ Trust</button>' +
          '<button class="quick-jump-pill" onclick="jumpToSection(&apos;prof-sec-account&apos;)">⚙️ Account</button>' +
        '</div>';

      // Suburb Pills for Section 3
      const allSuburbs = ['KAZHAKKOOTTAM', 'KARIAVATTOM', 'SREEKARYAM', 'ULLOOR', 'PATTOM', 'KOWDIAR', 'MANACAUD', 'VELLAYAMBALAM'];
      const userSubs = prof.preferredSuburbs || ['KAZHAKKOOTTAM', 'KARIAVATTOM'];
      let suburbPillsHtml = '';
      for (const sub of allSuburbs) {
        const isSel = userSubs.includes(sub);
        suburbPillsHtml += '<span class="suburb-pill ' + (isSel ? 'selected' : '') + '" data-suburb="' + sub + '" onclick="toggleProfileSuburbPill(this)">' + sub.charAt(0) + sub.slice(1).toLowerCase() + '</span>';
      }

      // 4. All 6 Section Cards + Section 7 Account Management
      const sectionsHtml = 
        // SECTION 1: BASICS
        '<div class="profile-card" id="prof-sec-basics">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>🪪</span> <span>Basic Information</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.basics.status.pillClass + '">' + comp.sections.basics.status.label + '</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Full Name</label>' +
            '<input type="text" id="profBasicsName" value="' + (prof.displayName || currentUser.name || '') + '" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">' +
            '<div>' +
              '<label style="font-size: 12.5px; font-weight: 700; color: var(--text); display: block; margin-bottom: 4px;">Gender</label>' +
              '<select id="profBasicsGender" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
                '<option value="MALE" ' + (prof.gender === 'MALE' ? 'selected' : '') + '>Male</option>' +
                '<option value="FEMALE" ' + (prof.gender === 'FEMALE' ? 'selected' : '') + '>Female</option>' +
                '<option value="NON_BINARY" ' + (prof.gender === 'NON_BINARY' ? 'selected' : '') + '>Non-Binary</option>' +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="font-size: 12.5px; font-weight: 700; color: var(--text); display: block; margin-bottom: 4px;">Date of Birth (18+)</label>' +
              '<input type="date" id="profBasicsBirthDate" value="' + birthDateStr + '" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; background: white;">' +
            '</div>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Profile Photo URL</label>' +
            '<div style="display: flex; gap: 10px; align-items: center;">' +
              '<input type="text" id="profBasicsPhotoUrl" value="' + (currentUser.avatar || '') + '" placeholder="https://..." oninput="document.getElementById(&apos;profBasicsPreview&apos;).src = this.value" style="flex: 1; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; background: white;">' +
              '<img id="profBasicsPreview" src="' + (currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80') + '" alt="Preview" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0;">' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileBasics()">' +
            'Save Basic Information ✔' +
          '</button>' +
        '</div>' +

        // SECTION 2: ABOUT & WORK
        '<div class="profile-card" id="prof-sec-about">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>💼</span> <span>About & Professional Life</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.about.status.pillClass + '">' + comp.sections.about.status.label + '</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Occupation / Role</label>' +
            '<input type="text" id="profAboutOccupation" value="' + (prof.occupation || currentUser.work || '') + '" placeholder="e.g. Senior Backend Engineer" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Company or University</label>' +
            '<input type="text" id="profAboutCompany" value="' + (prof.collegeOrCompany || '') + '" placeholder="e.g. TCS Technopark Phase I / CET" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">About Me / Bio</label>' +
            '<textarea id="profAboutBio" rows="3" placeholder="Tell potential flatmates about your work rhythm, cleanliness habits, hobbies..." style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; font-family: inherit; resize: vertical; background: white;">' + (prof.bio || '') + '</textarea>' +
          '</div>' +
          '<button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileAbout()">' +
            'Save About & Work ✔' +
          '</button>' +
        '</div>' +

        // SECTION 3: HOUSING & CRITERIA
        '<div class="profile-card" id="prof-sec-housing">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>🏡</span> <span>Housing & Living Criteria</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.housing.status.pillClass + '">' + comp.sections.housing.status.label + '</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Living Modality</label>' +
            '<select id="profHousingModality" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="MODALITY_1" ' + (prof.modality === 'MODALITY_1' ? 'selected' : '') + '>Has Room Available (Seeking Flatmate)</option>' +
              '<option value="MODALITY_2" ' + (prof.modality === 'MODALITY_2' ? 'selected' : '') + '>Seeking Room in Existing Flat</option>' +
              '<option value="MODALITY_3" ' + (prof.modality === 'MODALITY_3' ? 'selected' : '') + '>Has Flat, Relocating with New Roommate</option>' +
              '<option value="MODALITY_4" ' + (prof.modality === 'MODALITY_4' || !prof.modality ? 'selected' : '') + '>Team-Up First to Search Together</option>' +
            '</select>' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">' +
            '<div>' +
              '<label style="font-size: 12.5px; font-weight: 700; color: var(--text); display: block; margin-bottom: 4px;">Flatmate Gender Preference</label>' +
              '<select id="profHousingPrefGender" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
                '<option value="ANY" ' + (prof.preferredGender === 'ANY' ? 'selected' : '') + '>Any Gender Welcome</option>' +
                '<option value="MALE" ' + (prof.preferredGender === 'MALE' ? 'selected' : '') + '>Male Only</option>' +
                '<option value="FEMALE" ' + (prof.preferredGender === 'FEMALE' ? 'selected' : '') + '>Female Only</option>' +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="font-size: 12.5px; font-weight: 700; color: var(--text); display: block; margin-bottom: 4px;">Max Monthly Rent (₹)</label>' +
              '<input type="number" id="profHousingBudget" value="' + (prof.maxBudget || 9500) + '" step="500" min="2000" max="35000" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
            '</div>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Move-in Flexibility</label>' +
            '<select id="profHousingFlexibility" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="WITHIN_15_DAYS" ' + (prof.moveInFlexibility === 'WITHIN_15_DAYS' ? 'selected' : '') + '>Immediate (Within 15 Days)</option>' +
              '<option value="WITHIN_1_MONTH" ' + (prof.moveInFlexibility === 'WITHIN_1_MONTH' || !prof.moveInFlexibility ? 'selected' : '') + '>Within 1 Month</option>' +
              '<option value="TWO_MONTHS" ' + (prof.moveInFlexibility === 'TWO_MONTHS' ? 'selected' : '') + '>Within 2 Months</option>' +
              '<option value="FLEXIBLE" ' + (prof.moveInFlexibility === 'FLEXIBLE' ? 'selected' : '') + '>Flexible Timeline</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text); margin-bottom: 6px; display: block;">Preferred Trivandrum Micro-Markets (Click to toggle)</label>' +
            '<div id="profHousingSuburbsWrap" style="display: flex; flex-wrap: wrap; gap: 6px;">' +
              suburbPillsHtml +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileHousing()">' +
            'Save Housing Criteria ✔' +
          '</button>' +
        '</div>' +

        // SECTION 4: LIFESTYLE & HABITS
        '<div class="profile-card" id="prof-sec-lifestyle">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>🌿</span> <span>Lifestyle & Daily Habits</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.lifestyle.status.pillClass + '">' + comp.sections.lifestyle.status.label + '</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Sleep Rhythm</label>' +
            '<select id="profLifeSleep" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="EARLY_BIRD" ' + ((l.sleep && l.sleep.sleepPattern === 'EARLY_BIRD') ? 'selected' : '') + '>Early Bird (Sleep by 10:30 PM, Awake by 6:30 AM)</option>' +
              '<option value="NIGHT_OWL" ' + ((l.sleep && l.sleep.sleepPattern === 'NIGHT_OWL') ? 'selected' : '') + '>Night Owl (Sleep 1:00 AM+, Awake 9:00 AM+)</option>' +
              '<option value="FLEXIBLE" ' + ((l.sleep && l.sleep.sleepPattern === 'FLEXIBLE') || !l.sleep ? 'selected' : '') + '>Flexible Schedule</option>' +
            '</select>' +
            '<label style="font-size: 12px; color: #92400E; display: flex; align-items: center; gap: 6px; margin-top: 6px; cursor: pointer;">' +
              '<input type="checkbox" id="profLifeSleepDb" ' + ((l.sleep && l.sleep.isDealbreaker) ? 'checked' : '') + '> Strict Chronotype Dealbreaker' +
            '</label>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Cleanliness Level</label>' +
            '<select id="profLifeClean" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="METICULOUS" ' + ((l.cleanliness && l.cleanliness.cleanlinessLevel === 'METICULOUS') ? 'selected' : '') + '>Meticulous (Dishes washed immediately, spotless)</option>' +
              '<option value="MODERATE" ' + ((l.cleanliness && l.cleanliness.cleanlinessLevel === 'MODERATE') || !l.cleanliness ? 'selected' : '') + '>Moderate (Tidy, cleaned daily)</option>' +
              '<option value="RELAXED" ' + ((l.cleanliness && l.cleanliness.cleanlinessLevel === 'RELAXED') ? 'selected' : '') + '>Relaxed (Casual housekeeping)</option>' +
            '</select>' +
            '<label style="font-size: 12px; color: #92400E; display: flex; align-items: center; gap: 6px; margin-top: 6px; cursor: pointer;">' +
              '<input type="checkbox" id="profLifeCleanDb" ' + ((l.cleanliness && l.cleanliness.isDealbreaker) ? 'checked' : '') + '> Strict Cleanliness Dealbreaker' +
            '</label>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Food & Dietary Habits</label>' +
            '<select id="profLifeDiet" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="NON_VEGETARIAN" ' + ((l.dietary && l.dietary.dietType === 'NON_VEGETARIAN') || !l.dietary ? 'selected' : '') + '>Non-Vegetarian (Comfortable with all food)</option>' +
              '<option value="EGGETARIAN" ' + ((l.dietary && l.dietary.dietType === 'EGGETARIAN') ? 'selected' : '') + '>Eggetarian (Eggs allowed, no meat)</option>' +
              '<option value="STRICT_VEGETARIAN" ' + ((l.dietary && l.dietary.dietType === 'STRICT_VEGETARIAN') ? 'selected' : '') + '>Strict Vegetarian (Pure veg home)</option>' +
              '<option value="HALAL_ONLY" ' + ((l.dietary && l.dietary.dietType === 'HALAL_ONLY') ? 'selected' : '') + '>Halal Food Only</option>' +
            '</select>' +
            '<label style="font-size: 12px; color: #92400E; display: flex; align-items: center; gap: 6px; margin-top: 6px; cursor: pointer;">' +
              '<input type="checkbox" id="profLifeDietDb" ' + ((l.dietary && l.dietary.isDealbreaker) ? 'checked' : '') + '> Strict Dietary Dealbreaker' +
            '</label>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Smoking & Substances</label>' +
            '<select id="profLifeSmoke" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="NON_SMOKER_STRICT" ' + ((l.substances && l.substances.smokingHabit === 'NON_SMOKER_STRICT') || !l.substances ? 'selected' : '') + '>Strict Non-Smoker (Zero smoking inside or balcony)</option>' +
              '<option value="BALCONY_ONLY" ' + ((l.substances && l.substances.smokingHabit === 'BALCONY_ONLY') ? 'selected' : '') + '>Balcony Only (Permitted on open balcony only)</option>' +
              '<option value="SMOKER" ' + ((l.substances && l.substances.smokingHabit === 'SMOKER') ? 'selected' : '') + '>Smoker Friendly</option>' +
            '</select>' +
            '<label style="font-size: 12px; color: #92400E; display: flex; align-items: center; gap: 6px; margin-top: 6px; cursor: pointer;">' +
              '<input type="checkbox" id="profLifeSmokeDb" ' + ((l.substances && l.substances.isDealbreaker) || !l.substances ? 'checked' : '') + '> Strict Non-Smoker Dealbreaker' +
            '</label>' +
          '</div>' +
          '<button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileLifestyle()">' +
            'Save Lifestyle Habits ✔' +
          '</button>' +
        '</div>' +

        // SECTION 5: HOUSEHOLD VIBE & HOSTING
        '<div class="profile-card" id="prof-sec-hosting">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>🎉</span> <span>Household Vibe & Hosting</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.hosting.status.pillClass + '">' + comp.sections.hosting.status.label + '</span>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 12px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Household Atmosphere</label>' +
            '<select id="profHostVibe" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="QUIET_SANCTUARY" ' + ((l.household && l.household.householdVibe === 'QUIET_SANCTUARY') ? 'selected' : '') + '>Quiet Sanctuary (Restful, low noise, work from home focus)</option>' +
              '<option value="BALANCED_CASUAL" ' + ((l.household && l.household.householdVibe === 'BALANCED_CASUAL') || !l.household ? 'selected' : '') + '>Balanced & Casual (Friendly chats, easygoing)</option>' +
              '<option value="SOCIALLY_ACTIVE" ' + ((l.household && l.household.householdVibe === 'SOCIALLY_ACTIVE') ? 'selected' : '') + '>Socially Active (Frequent weekend gatherings, dinners)</option>' +
            '</select>' +
            '<label style="font-size: 12px; color: #92400E; display: flex; align-items: center; gap: 6px; margin-top: 6px; cursor: pointer;">' +
              '<input type="checkbox" id="profHostVibeDb" ' + ((l.household && l.household.isDealbreaker) ? 'checked' : '') + '> Strict Vibe Dealbreaker' +
            '</label>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Guest & Visitor Frequency</label>' +
            '<select id="profHostGuest" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13.5px; background: white;">' +
              '<option value="NO_GUESTS" ' + ((l.social && l.social.guestFrequency === 'NO_GUESTS') ? 'selected' : '') + '>Rarely or Never (No outside overnight visitors)</option>' +
              '<option value="OCCASIONAL_FRIENDS" ' + ((l.social && l.social.guestFrequency === 'OCCASIONAL_FRIENDS') || !l.social ? 'selected' : '') + '>Weekends Only (Advance notice preferred)</option>' +
              '<option value="FREQUENT_GUESTS" ' + ((l.social && l.social.guestFrequency === 'FREQUENT_GUESTS') ? 'selected' : '') + '>Regular Guests (Friends welcome anytime)</option>' +
            '</select>' +
          '</div>' +
          '<button class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileHosting()">' +
            'Save Household Preferences ✔' +
          '</button>' +
        '</div>' +

        // SECTION 6: TRUST & VERIFICATION
        '<div class="profile-card" id="prof-sec-trust">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">' +
            '<div style="font-size: 16px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px;">' +
              '<span>⭐</span> <span>Trust & Verification Badge</span>' +
            '</div>' +
            '<span class="comp-status-pill ' + comp.sections.trust.status.pillClass + '">' + comp.sections.trust.status.label + '</span>' +
          '</div>' +
          '<div style="background: #F8FAFC; border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 14px;">' +
            '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">' +
              '<span style="font-size: 13px; font-weight: 800; color: var(--text);">Status</span>' +
              ((prof.verificationBadge && prof.verificationBadge !== 'UNVERIFIED') 
                ? '<span style="font-size: 12px; font-weight: 800; color: #0369A1; background: #E0F2FE; padding: 2px 8px; border-radius: 10px;">⭐ ' + prof.verificationBadge + '</span>'
                : '<span style="font-size: 12px; font-weight: 800; color: var(--text-muted); background: #F1F5F9; padding: 2px 8px; border-radius: 10px;">Unverified</span>'
              ) +
            '</div>' +
            '<p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">' +
              'Verified members receive the Blue Trust Badge on discovery cards, generating 3x more roommate inquiries in Trivandrum.' +
            '</p>' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 10px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Official Institutional / Company Email</label>' +
            '<input type="email" id="profTrustEmail" placeholder="e.g. name@technopark-company.com or name@cet.ac.in" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; background: white;">' +
          '</div>' +
          '<div class="form-group" style="margin-bottom: 14px;">' +
            '<label style="font-size: 12.5px; font-weight: 700; color: var(--text);">Institution Type</label>' +
            '<select id="profTrustType" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; background: white;">' +
              '<option value="CORPORATE">Technopark / Corporate IT Professional</option>' +
              '<option value="ACADEMIC">College / University Student (.edu / .ac.in)</option>' +
            '</select>' +
          '</div>' +
          '<button class="btn btn-outline" style="width: 100%; border-radius: 12px; padding: 11px; font-weight: 800; justify-content: center;" onclick="saveProfileTrust()">' +
            'Request Verification Link ✉️' +
          '</button>' +
        '</div>' +

        // SECTION 7: ACCOUNT MANAGEMENT
        '<div class="profile-card profile-actions-bar" id="prof-sec-account">' +
          '<div>' +
            '<div style="font-size: 14px; font-weight: 800; color: var(--text);">⚙️ Account Management</div>' +
            '<div style="font-size: 12px; color: var(--text-muted);">Signed in as ' + (currentUser.phone || '') + '</div>' +
          '</div>' +
          '<div style="display: flex; gap: 8px;">' +
            '<button class="btn btn-secondary" style="border-radius: 10px; font-size: 13px;" onclick="cyclePersona()">' +
              'Switch Persona' +
            '</button>' +
            '<button class="btn btn-outline" style="border-radius: 10px; font-size: 13px; color: #EF4444; border-color: #FECACA;" onclick="handleLogout()">' +
              'Log Out' +
            '</button>' +
          '</div>' +
        '</div>';

      container.innerHTML = 
        topHtml + 
        completionHtml + 
        quickJumpHtml + 
        sectionsHtml;
    }

    // Navigation Switcher
    function navigateTab(tabName) {
      if (tabName === 'login') {
        tabName = 'profile';
      }

      if (tabName === 'registration') {
        document.body.classList.add('onboarding-mode');
      } else {
        document.body.classList.remove('onboarding-mode');
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
      if (tabName === 'matches') {
        closeChatAndBackToMatches();
        loadMatches();
      }
      if (tabName === 'profile') {
        renderProfileView();
      }
      if (tabName === 'profile-completion') {
        const mnavProf = document.getElementById('mnav-profile');
        if (mnavProf) mnavProf.classList.add('active');
        renderProfileCompletionDashboard();
      }
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
          await loadUserProfile();
          if (currentUser) {
            await loadFeed();
            await loadMatches();
            navigateTab(requestedView && requestedView !== 'registration' && requestedView !== 'login' ? requestedView : 'discover');
            return;
          }
        } catch (e) {
          // Token verification failed, fallback to guest
        }
      }

      // Guest: Browse Discover Feed without gating
      currentToken = null;
      currentUser = null;
      updateHeaderUser(null);
      await loadFeed();
      navigateTab('discover');
    }

    // -------------------------------------------------------------
    // PROGRESSIVE CONVERSATIONAL ONBOARDING WIZARD LOGIC (BUMBLE-STYLE)
    // -------------------------------------------------------------
    async function startNewRegistration() {
      wizardCurrentStep = 1;
      document.body.classList.remove('unauthenticated');
      document.body.classList.add('onboarding-mode');
      
      // Hide all panels, activate registration view
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      const regView = document.getElementById('view-registration');
      if (regView) regView.classList.add('active');

      await populateWizardFromExistingProfile();
      updateWizardUI();
    }

    async function populateWizardFromExistingProfile() {
      if (!currentToken) return;
      try {
        const res = await fetch('/api/v1/profiles/me', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (res.ok) {
          const prof = await res.json();
          if (prof.displayName && document.getElementById('regName')) {
            document.getElementById('regName').value = prof.displayName;
          }
          if (prof.gender) {
            syncOptionCard('regGender', prof.gender);
          }
          if (prof.preferredGender) {
            syncOptionCard('regPrefGender', prof.preferredGender);
          }
          if (prof.birthDate && document.getElementById('regBirthDate')) {
            document.getElementById('regBirthDate').value = prof.birthDate.split('T')[0];
          }
          if (prof.occupation && document.getElementById('regOccupation')) {
            document.getElementById('regOccupation').value = prof.occupation;
          }
          if (prof.bio && document.getElementById('regBio')) {
            document.getElementById('regBio').value = prof.bio;
          }
          if (prof.modality) {
            selectedModality = prof.modality;
            document.querySelectorAll('.modality-select-card').forEach(c => {
              c.classList.toggle('selected', c.getAttribute('data-modality') === prof.modality);
            });
          }
          if (prof.maxBudget && document.getElementById('regMaxBudget')) {
            document.getElementById('regMaxBudget').value = prof.maxBudget;
          }
          if (prof.preferredSuburbs && prof.preferredSuburbs.length > 0) {
            document.getElementById('regSuburbs').value = prof.preferredSuburbs.join(', ');
            document.querySelectorAll('#suburbPillsWrap .suburb-pill').forEach(pill => {
              const subCode = pill.getAttribute('data-suburb');
              pill.classList.toggle('selected', prof.preferredSuburbs.includes(subCode));
            });
          }
        }
      } catch (e) {}
    }

    function pickOptionCard(inputId, value, cardEl) {
      const input = document.getElementById(inputId);
      if (input) input.value = value;
      const parent = cardEl.closest('.option-cards-list') || cardEl.parentElement;
      if (parent) {
        parent.querySelectorAll('.option-select-card').forEach(c => c.classList.remove('selected'));
      }
      cardEl.classList.add('selected');
    }

    function syncOptionCard(inputId, value) {
      const input = document.getElementById(inputId);
      if (input) input.value = value;
      document.querySelectorAll('.option-select-card').forEach(c => {
        const onclickAttr = c.getAttribute('onclick') || '';
        if (onclickAttr.includes("'" + inputId + "'") && c.getAttribute('data-val') === value) {
          const parent = c.closest('.option-cards-list') || c.parentElement;
          if (parent) parent.querySelectorAll('.option-select-card').forEach(sibling => sibling.classList.remove('selected'));
          c.classList.add('selected');
        }
      });
    }

    function cancelOnboarding() {
      document.body.classList.remove('onboarding-mode');
      navigateTab('profile');
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

      // Update progress fill percentage (1 to 12) strictly within track bounds
      const percent = Math.min(100, Math.max(0, Math.round(((wizardCurrentStep - 1) / 11) * 100)));
      const fillEl = document.getElementById('wizardProgressFill');
      if (fillEl) {
        fillEl.style.width = 'calc((100% - 36px) * ' + (percent / 100) + ')';
      }

      // 5 Subsections with completion ticks (✔)
      // Node 1: Basics (Steps 1, 2)
      const n1 = document.getElementById('node-step-1');
      const c1 = document.getElementById('circle-step-1');
      if (n1 && c1) {
        n1.classList.remove('active', 'completed');
        if (wizardCurrentStep > 2) {
          n1.classList.add('completed');
          c1.innerHTML = '✔';
        } else {
          n1.classList.add('active');
          c1.innerHTML = '1';
        }
      }

      // Node 2: About (Step 3)
      const n2 = document.getElementById('node-step-2');
      const c2 = document.getElementById('circle-step-2');
      if (n2 && c2) {
        n2.classList.remove('active', 'completed');
        if (wizardCurrentStep > 3) {
          n2.classList.add('completed');
          c2.innerHTML = '✔';
        } else if (wizardCurrentStep === 3) {
          n2.classList.add('active');
          c2.innerHTML = '2';
        } else {
          c2.innerHTML = '2';
        }
      }

      // Node 3: Housing (Steps 4, 5)
      const n3 = document.getElementById('node-step-3');
      const c3 = document.getElementById('circle-step-3');
      if (n3 && c3) {
        n3.classList.remove('active', 'completed');
        if (wizardCurrentStep > 5) {
          n3.classList.add('completed');
          c3.innerHTML = '✔';
        } else if (wizardCurrentStep >= 4 && wizardCurrentStep <= 5) {
          n3.classList.add('active');
          c3.innerHTML = '3';
        } else {
          c3.innerHTML = '3';
        }
      }

      // Node 4: Lifestyle (Steps 6, 7, 8, 9, 10)
      const n4 = document.getElementById('node-step-4');
      const c4 = document.getElementById('circle-step-4');
      if (n4 && c4) {
        n4.classList.remove('active', 'completed');
        if (wizardCurrentStep > 10) {
          n4.classList.add('completed');
          c4.innerHTML = '✔';
        } else if (wizardCurrentStep >= 6 && wizardCurrentStep <= 10) {
          n4.classList.add('active');
          c4.innerHTML = '4';
        } else {
          c4.innerHTML = '4';
        }
      }

      // Node 5: Finish (Steps 11, 12)
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

    function toggleSuburbPill(suburbCode, el) {
      el.classList.toggle('selected');
      const selectedPills = Array.from(document.querySelectorAll('#suburbPillsWrap .suburb-pill.selected'))
        .map(p => p.getAttribute('data-suburb') || p.textContent.trim().toUpperCase());
      document.getElementById('regSuburbs').value = selectedPills.join(', ');
    }

    function pickModalityCard(mod, el) {
      selectedModality = mod;
      document.querySelectorAll('.modality-select-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    function setRegAvatar(url) {
      document.getElementById('regPhotoUrl').value = url;
      document.getElementById('regPhotoPreview').src = url;
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

    function skipAndCompleteRegistration() {
      const photoInput = document.getElementById('regPhotoUrl');
      if (photoInput) photoInput.value = '';
      completeRegistrationAndLaunch();
    }

    function finishMandatoryAndLaunch() {
      completeRegistrationAndLaunch();
    }

    // Complete Registration & Launch
    async function completeRegistrationAndLaunch() {
      const name = document.getElementById('regName').value.trim() || 'Buddy User';
      const gender = document.getElementById('regGender').value;
      const prefGender = document.getElementById('regPrefGender').value;
      const birthDate = (document.getElementById('regBirthDate') && document.getElementById('regBirthDate').value) || '1998-05-15';
      const occupation = (document.getElementById('regOccupation') && document.getElementById('regOccupation').value.trim()) || 'Software Professional';
      const bio = (document.getElementById('regBio') && document.getElementById('regBio').value.trim()) || '';
      const rawSuburbs = (document.getElementById('regSuburbs') && document.getElementById('regSuburbs').value) || 'KAZHAKKOOTTAM';
      const suburbs = rawSuburbs.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      const maxBudget = parseInt(document.getElementById('regMaxBudget').value, 10) || 9500;

      const sleep = document.getElementById('regSleep').value;
      const clean = document.getElementById('regClean').value;
      const diet = document.getElementById('regDiet').value;
      const smoke = document.getElementById('regSmoke').value;
      const vibe = document.getElementById('regVibe') ? document.getElementById('regVibe').value : 'BALANCED_CASUAL';
      const photoUrl = document.getElementById('regPhotoUrl') ? document.getElementById('regPhotoUrl').value.trim() : '';

      // 1. Save Full Profile to Backend with isOnboardingCompleted: true
      try {
        const profRes = await fetch('/api/v1/profiles/me', {
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
            collegeOrCompany: occupation,
            bio: bio,
            modality: selectedModality,
            minBudget: 3000,
            maxBudget: maxBudget,
            moveInFlexibility: 'WITHIN_1_MONTH',
            preferredSuburbs: suburbs.length > 0 ? suburbs : ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
            isOnboardingCompleted: true
          })
        });
        if (!profRes.ok) {
          const errData = await profRes.json();
          alert('Could not save profile: ' + (errData.detail || errData.title || 'Validation error'));
          return;
        }
      } catch (e) {
        alert('Network error while saving profile. Please try again.');
        return;
      }

      // 2. Upload Photo if provided
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
        } catch (e) {}
      }

      // 3. Save Lifestyle & Vibe Preferences
      try {
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
              isDealbreaker: document.getElementById('dbSleep') ? document.getElementById('dbSleep').checked : false
            },
            cleanliness: {
              cleanlinessLevel: clean,
              kitchenSinkRule: 'IMMEDIATE_WASH',
              maidPreference: 'OPEN_TO_MAID',
              isDealbreaker: document.getElementById('dbClean') ? document.getElementById('dbClean').checked : false
            },
            dietary: {
              dietType: diet,
              kitchenPolicy: 'NO_RESTRICTIONS',
              isDealbreaker: document.getElementById('dbDiet') ? document.getElementById('dbDiet').checked : false
            },
            social: {
              guestFrequency: vibe === 'QUIET_SANCTUARY' ? 'NEVER' : vibe === 'SOCIALLY_ACTIVE' ? 'REGULAR_GUESTS' : 'OCCASIONAL_FRIENDS',
              overnightGuestPolicy: 'SAME_GENDER_ONLY',
              partyPreference: vibe === 'SOCIALLY_ACTIVE' ? 'WEEKEND_GATHERINGS' : 'NO_PARTIES',
              isDealbreaker: document.getElementById('dbVibe') ? document.getElementById('dbVibe').checked : false
            },
            substances: {
              smokingHabit: smoke,
              alcoholHabit: 'TEETOTALER',
              isDealbreaker: document.getElementById('dbSmoke') ? document.getElementById('dbSmoke').checked : false
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
      } catch (e) {}

      if (currentUser) {
        currentUser.name = name;
        currentUser.isOnboardingCompleted = true;
        if (photoUrl) currentUser.avatar = photoUrl;
      }

      document.body.classList.remove('onboarding-mode');
      updateHeaderUser(currentUser);
      await loadUserProfile();
      await loadFeed();
      await loadMatches();

      // Check for deferred interest / like!
      if (pendingInterestCandidate) {
        const cand = pendingInterestCandidate;
        pendingInterestCandidate = null;
        try {
          const res = await fetch('/api/v1/discovery/swipe', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ candidateUserId: cand.userId, action: 'LIKE' })
          });
          const data = await res.json();
          navigateTab('discover');
          if (data && (data.isMutualMatch || data.isMatch)) {
            triggerCelebration(cand);
          } else {
            showToast('Interest sent to ' + cand.displayName + '! 🎉');
          }
          return;
        } catch (e) {}
      }

      showToast('🎉 Profile registration complete! Discovery feed unlocked.');
      navigateTab('discover');
    }

    // -------------------------------------------------------------
    // DISCOVERY FEED & SWIPING
    // -------------------------------------------------------------
    async function loadFeed() {
      try {
        const headers = {};
        if (currentToken) {
          headers['Authorization'] = 'Bearer ' + currentToken;
        }
        const res = await fetch('/api/v1/discovery/feed?limit=10', { headers });
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
      if (!candidate) return;

      // 1. Guest Check: Must authenticate before performing interactions
      if (!currentToken) {
        cardEl.style.transition = 'transform 0.25s ease';
        cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
        cardEl.style.opacity = '1';
        showGuestPromptModal(action === 'LIKE' ? 'like' : 'pass');
        return;
      }

      // 2. Incomplete Registration Check:
      // PASS is permitted; LIKE / expressing positive interest requires mandatory registration completion
      if (currentUser && !currentUser.isOnboardingCompleted) {
        if (action === 'LIKE' || action === 'SUPERLIKE') {
          cardEl.style.transition = 'transform 0.25s ease';
          cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
          cardEl.style.opacity = '1';
          pendingInterestCandidate = candidate;
          showIncompleteRegModal(candidate.displayName);
          return;
        }
        // action === 'PASS' continues below (allowed for incomplete users)
      }

      const dir = (action === 'LIKE' || action === 'SUPERLIKE') ? 1 : -1;

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
    // RESPONSIVE MATCHES & CHAT (DESKTOP TILE GRID + MOBILE LIST)
    // -------------------------------------------------------------
    let allLoadedMatches = [];
    let currentMatchFilter = 'ALL';

    function getModalityBadgeText(mod) {
      if (mod === 'MODALITY_1') return '🏠 Has Room';
      if (mod === 'MODALITY_2') return '🛏 Seeking Room';
      if (mod === 'MODALITY_3') return '🔄 Relocating';
      if (mod === 'MODALITY_4') return '🤝 Team-Up First';
      return '🤝 Buddy Member';
    }

    async function loadMatches() {
      if (!currentToken || (currentUser && !currentUser.isOnboardingCompleted)) {
        allLoadedMatches = [];
        const badge = document.getElementById('headerMatchesBadge');
        if (badge) badge.style.display = 'none';
        renderFilteredMatches();
        return;
      }
      try {
        const res = await fetch('/api/v1/matches', {
          headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        const data = await res.json();
        allLoadedMatches = data.matches || [];

        const badge = document.getElementById('headerMatchesBadge');
        if (badge) {
          badge.textContent = allLoadedMatches.length;
          badge.style.display = allLoadedMatches.length > 0 ? 'inline-block' : 'none';
        }
        
        const pill = document.getElementById('matchesHeaderPill');
        if (pill) pill.textContent = allLoadedMatches.length + ' Connection' + (allLoadedMatches.length === 1 ? '' : 's');

        renderFilteredMatches();
      } catch (e) {
        allLoadedMatches = [];
        renderFilteredMatches();
      }
    }

    function filterMatchCards(modality, btnEl) {
      currentMatchFilter = modality;
      document.querySelectorAll('.match-filter-tab').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      renderFilteredMatches();
    }

    let currentRenderedMatches = [];

    function renderFilteredMatches() {
      const filtered = (currentMatchFilter === 'ALL')
        ? allLoadedMatches
        : allLoadedMatches.filter(m => (m.candidate?.modality || m.modality) === currentMatchFilter);
      currentRenderedMatches = filtered;

      renderDesktopMatches(filtered);
      renderMobileMatches(filtered);
    }

    function openChatByIndex(idx) {
      const m = currentRenderedMatches[idx];
      if (m) openChatWithMatch(m);
    }

    function openCandidateByIndex(idx) {
      const m = currentRenderedMatches[idx];
      if (m) {
        const cand = m.candidate || {
          userId: m.matchedUserId,
          displayName: m.matchedUserDisplayName,
          photos: [{ photoUrl: m.matchedUserAvatarUrl }]
        };
        openCandidateModal(cand);
      }
    }

    function renderDesktopMatches(matches) {
      const grid = document.getElementById('desktopMatchGrid');
      if (!grid) return;

      if (!currentToken) {
        grid.innerHTML = 
          '<div style="grid-column: 1 / -1; background: white; border: 1px solid var(--border); border-radius: 20px; padding: 48px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px;">' +
            '<div style="font-size: 48px;">🔒</div>' +
            '<h3 style="font-size: 20px; font-weight: 800;">Sign In to View Matches</h3>' +
            '<p style="font-size: 13.5px; color: var(--text-muted); max-width: 360px; line-height: 1.5;">' +
              'Sign in or create an account to view your matches and chat with compatible flatmates.' +
            '</p>' +
            '<button class="btn btn-primary" onclick="navigateTab(&apos;profile&apos;)" style="border-radius: 20px;">' +
              'Sign In / Register →' +
            '</button>' +
          '</div>';
        return;
      }

      if (currentUser && !currentUser.isOnboardingCompleted) {
        grid.innerHTML = 
          '<div style="grid-column: 1 / -1; background: white; border: 1.5px solid #FCD34D; border-radius: 20px; padding: 48px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px;">' +
            '<div style="font-size: 48px;">✨</div>' +
            '<h3 style="font-size: 20px; font-weight: 800;">Complete Registration to Unlock Matching</h3>' +
            '<p style="font-size: 13.5px; color: var(--text-muted); max-width: 380px; line-height: 1.5;">' +
              'Finish your quick mandatory profile (1 min) so potential flatmates can match and chat with you.' +
            '</p>' +
            '<button class="btn btn-primary" onclick="startNewRegistration()" style="border-radius: 20px;">' +
              'Complete Registration (1 Min) →' +
            '</button>' +
          '</div>';
        return;
      }

      if (matches.length === 0) {
        grid.innerHTML = 
          '<div style="grid-column: 1 / -1; background: white; border: 1px solid var(--border); border-radius: 20px; padding: 48px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px;">' +
            '<div style="font-size: 48px;">🌟</div>' +
            '<h3 style="font-size: 20px; font-weight: 800;">No Mutual Matches Yet</h3>' +
            '<p style="font-size: 13.5px; color: var(--text-muted); max-width: 360px; line-height: 1.5;">' +
              'Swipe LIKE on profiles in the Discover deck to connect with compatible roommates in Trivandrum!' +
            '</p>' +
            '<button class="btn btn-primary" onclick="navigateTab(&apos;discover&apos;)" style="border-radius: 20px;">' +
              'Explore Discover Feed →' +
            '</button>' +
          '</div>';
        return;
      }

      grid.innerHTML = matches.map((m, idx) => {
        const cand = m.candidate || {
          userId: m.matchedUserId,
          displayName: m.matchedUserDisplayName,
          age: m.age || 25,
          occupation: m.occupation || 'Professional',
          collegeOrCompany: m.collegeOrCompany,
          modality: m.modality || 'MODALITY_4',
          verificationBadge: m.verificationBadge || 'UNVERIFIED',
          preferredSuburbs: m.preferredSuburbs || ['KAZHAKKOOTTAM'],
          maxBudget: m.maxBudget || 9000,
          photos: m.photos || [{ photoUrl: m.matchedUserAvatarUrl }],
          topHighlights: m.topHighlights || ['Early Bird', 'Quiet Sanctuary']
        };

        const photoUrl = (cand.photos && cand.photos[0] ? cand.photos[0].photoUrl : m.matchedUserAvatarUrl) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
        const verifyLabel = cand.verificationBadge === 'VERIFIED_PROFESSIONAL' ? '✔ Verified Pro' : (cand.verificationBadge === 'VERIFIED_STUDENT' ? '✔ Verified Student' : '');
        const chipsHtml = (cand.topHighlights || m.topHighlights || []).map(h => '<span class="match-harmony-chip">' + h + '</span>').join('');
        const suburb = (cand.preferredSuburbs && cand.preferredSuburbs[0]) || 'Trivandrum';

        return '<div class="match-tile-card">' +
          '<div class="match-tile-photo-box">' +
            '<img src="' + photoUrl + '" class="match-tile-photo" alt="' + cand.displayName + '">' +
            '<div class="match-tile-overlay">' +
              '<div class="match-tile-top-row">' +
                '<span class="match-compat-gauge">★ ' + m.compatibilityScore + '% Compatibility</span>' +
                (verifyLabel ? '<span class="match-verify-pill">' + verifyLabel + '</span>' : '<span></span>') +
              '</div>' +
              '<div class="match-tile-name-row">' +
                '<span class="match-tile-name">' + cand.displayName + '</span>' +
                (cand.age ? '<span class="match-tile-age">• ' + cand.age + '</span>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="match-tile-body">' +
            '<div class="match-tile-work">💼 ' + (cand.occupation || 'Professional') + (cand.collegeOrCompany ? ' @ ' + cand.collegeOrCompany : '') + '</div>' +
            '<div class="match-modality-pill">' + getModalityBadgeText(cand.modality) + '</div>' +
            '<div class="match-suburb-line">📍 ' + suburb + ' • Max ₹' + (cand.maxBudget || 9000) + '/mo</div>' +
            '<div class="match-harmony-chips">' + chipsHtml + '</div>' +
          '</div>' +
          '<div class="match-tile-footer">' +
            '<button class="btn btn-primary" style="flex: 1;" onclick="openChatByIndex(' + idx + ')">💬 Message</button>' +
            '<button class="btn btn-outline" onclick="openCandidateByIndex(' + idx + ')">👤 Profile</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderMobileMatches(matches) {
      const tray = document.getElementById('mobileNewMatchesTray');
      const list = document.getElementById('mobileConvList');
      if (!tray || !list) return;

      if (!currentToken) {
        tray.style.display = 'none';
        list.innerHTML = 
          '<div style="padding: 40px 16px; text-align: center;">' +
            '<div style="font-size: 36px; margin-bottom: 8px;">🔒</div>' +
            '<p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 14px;">Sign in to view matches and chat.</p>' +
            '<button class="btn btn-primary" onclick="navigateTab(&apos;profile&apos;)" style="border-radius: 20px; padding: 8px 18px; font-size: 13px;">Sign In →</button>' +
          '</div>';
        return;
      }

      if (currentUser && !currentUser.isOnboardingCompleted) {
        tray.style.display = 'none';
        list.innerHTML = 
          '<div style="padding: 40px 16px; text-align: center;">' +
            '<div style="font-size: 36px; margin-bottom: 8px;">✨</div>' +
            '<p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 14px;">Complete registration to unlock matching & chat.</p>' +
            '<button class="btn btn-primary" onclick="startNewRegistration()" style="border-radius: 20px; padding: 8px 18px; font-size: 13px;">Complete Registration (1 Min) →</button>' +
          '</div>';
        return;
      }

      if (matches.length === 0) {
        tray.style.display = 'none';
        list.innerHTML = 
          '<div style="padding: 32px 16px; text-align: center; color: var(--text-muted); font-size: 13px;">' +
            'No mutual matches yet. Swipe LIKE on candidates in Discover to connect!' +
          '</div>';
        return;
      }

      tray.style.display = 'flex';
      tray.innerHTML = matches.map((m, idx) => {
        const cand = m.candidate || { displayName: m.matchedUserDisplayName, photos: [{ photoUrl: m.matchedUserAvatarUrl }] };
        const photo = (cand.photos && cand.photos[0] ? cand.photos[0].photoUrl : m.matchedUserAvatarUrl) || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80';
        const firstName = cand.displayName.split(' ')[0];

        return '<div class="mobile-tray-bubble" onclick="openChatByIndex(' + idx + ')">' +
          '<div class="mobile-tray-avatar-wrap">' +
            '<img src="' + photo + '" class="mobile-tray-avatar" alt="' + cand.displayName + '">' +
          '</div>' +
          '<span class="mobile-tray-name">' + firstName + '</span>' +
          '<span class="mobile-tray-compat">' + m.compatibilityScore + '%</span>' +
        '</div>';
      }).join('');

      list.innerHTML = matches.map((m, idx) => {
        const cand = m.candidate || { displayName: m.matchedUserDisplayName, photos: [{ photoUrl: m.matchedUserAvatarUrl }] };
        const photo = (cand.photos && cand.photos[0] ? cand.photos[0].photoUrl : m.matchedUserAvatarUrl) || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80';

        return '<div class="mobile-conv-item" onclick="openChatByIndex(' + idx + ')">' +
          '<img src="' + photo + '" class="mobile-conv-avatar" alt="' + cand.displayName + '">' +
          '<div class="mobile-conv-info">' +
            '<div class="mobile-conv-top">' +
              '<span class="mobile-conv-name">' + cand.displayName + '</span>' +
              '<span class="mobile-conv-time">Today</span>' +
            '</div>' +
            '<div class="mobile-conv-badge-row">' +
              '<span style="font-size: 11px; font-weight: 800; color: var(--primary);">' + m.compatibilityScore + '% Match</span>' +
              '<span style="font-size: 11px; color: var(--text-muted);">• ' + getModalityBadgeText(cand.modality) + '</span>' +
            '</div>' +
            '<div class="mobile-conv-snippet">Tap to start conversation with ' + cand.displayName.split(' ')[0] + '...</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function openChatWithMatch(m) {
      const cand = m.candidate || {
        userId: m.matchedUserId,
        displayName: m.matchedUserDisplayName,
        photos: [{ photoUrl: m.matchedUserAvatarUrl }]
      };
      activeMatchPartner = cand;

      const chatCont = document.getElementById('activeChatContainer');
      const listCont = document.getElementById('matchesListingContainer');
      if (chatCont && listCont) {
        listCont.style.display = 'none';
        chatCont.style.display = 'flex';
      }

      document.getElementById('chatName').textContent = cand.displayName;
      const avatar = (cand.photos && cand.photos[0] ? cand.photos[0].photoUrl : m.matchedUserAvatarUrl) || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80';
      document.getElementById('chatAvatar').src = avatar;
      document.getElementById('chatStatus').textContent = 'Online • ' + (m.compatibilityScore || 90) + '% Compatibility';

      const stream = document.getElementById('msgStream');
      stream.innerHTML = 
        '<div class="msg-bubble msg-in">' +
          'Hi ' + currentUser.name.split(' ')[0] + '! Excited to connect on Buddy. I saw our lifestyles and routines have high alignment!' +
          '<div class="msg-time">Just now</div>' +
        '</div>';
    }

    function closeChatAndBackToMatches() {
      const chatCont = document.getElementById('activeChatContainer');
      const listCont = document.getElementById('matchesListingContainer');
      if (chatCont && listCont) {
        chatCont.style.display = 'none';
        listCont.style.display = 'block';
      }
    }

    function viewPartnerProfileFromChat() {
      if (activeMatchPartner) {
        openCandidateModal(activeMatchPartner);
      }
    }

    function selectConversation(cand, el) {
      openChatWithMatch({ candidate: cand, matchedUserDisplayName: cand.displayName, matchedUserId: cand.userId });
    }

    function sendChatMessage() {
      const input = document.getElementById('chatInputBox');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      if (!currentToken) {
        showGuestPromptModal('message');
        return;
      }
      if (currentUser && !currentUser.isOnboardingCompleted) {
        showToast('Please complete registration to send messages.');
        return;
      }

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
      openChatWithMatch({ candidate: activeMatchPartner, matchedUserDisplayName: activeMatchPartner.displayName, matchedUserId: activeMatchPartner.userId });
    }

    function triggerBlock() {
      if (confirm('Block ' + activeMatchPartner.displayName + '? This will hide their profile and terminate chat.')) {
        alert('User blocked successfully.');
        closeChatAndBackToMatches();
        navigateTab('discover');
      }
    }

    // Start App
    init();
  </script>
</body>
</html>`;
}

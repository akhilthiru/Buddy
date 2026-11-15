export function renderTestConsoleHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buddy – Local Interactive Testing Console</title>
  <style>
    :root {
      --primary: #0D9488;
      --primary-dark: #0F766E;
      --primary-light: #CCFBF1;
      --accent: #F97316;
      --accent-light: #FFEDD5;
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --code-bg: #0F172A;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding-bottom: 60px; }
    header { background: #FFFFFF; border-bottom: 1px solid var(--border); padding: 16px 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo-badge { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: -0.5px; }
    .title-group h1 { font-size: 18px; font-weight: 700; color: var(--text); }
    .title-group p { font-size: 12px; color: var(--text-muted); }
    .session-badge { background: var(--primary-light); color: var(--primary-dark); padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .session-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }

    .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
    @media (max-width: 900px) { .container { grid-template-columns: 1fr; } }

    /* Left Sidebar: Quick Persona Switcher */
    .sidebar { display: flex; flex-direction: column; gap: 16px; }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .card-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .persona-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: white; cursor: pointer; text-align: left; transition: all 0.15s ease; margin-bottom: 8px; }
    .persona-btn:hover { border-color: var(--primary); background: #F0FDFA; }
    .persona-btn.active { border-color: var(--primary); background: var(--primary-light); }
    .persona-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
    .persona-info h4 { font-size: 14px; font-weight: 600; color: var(--text); }
    .persona-info p { font-size: 12px; color: var(--text-muted); }
    .persona-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-top: 4px; display: inline-block; }
    .tag-m1 { background: #EFF6FF; color: #1D4ED8; }
    .tag-m2 { background: #ECFDF5; color: #047857; }
    .tag-m3 { background: #FFFBEB; color: #B45309; }
    .tag-m4 { background: #FDF2F8; color: #BE185D; }

    /* Main Area: Navigation Tabs */
    .main-content { display: flex; flex-direction: column; gap: 16px; }
    .tabs-nav { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; border-bottom: 1px solid var(--border); }
    .tab-btn { padding: 10px 16px; font-size: 14px; font-weight: 600; border: none; background: none; color: var(--text-muted); cursor: pointer; border-radius: 8px 8px 0 0; white-space: nowrap; border-bottom: 2px solid transparent; }
    .tab-btn:hover { color: var(--primary); }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: white; }

    /* Tab Content Panes */
    .tab-pane { display: none; }
    .tab-pane.active { display: flex; flex-direction: column; gap: 16px; }

    /* Form & Action Controls */
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--text); }
    .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.15s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .btn { padding: 10px 16px; font-size: 14px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-accent { background: var(--accent); color: white; }
    .btn-accent:hover { background: #EA580C; }
    .btn-secondary { background: #E2E8F0; color: #334155; }
    .btn-secondary:hover { background: #CBD5E1; }
    .btn-outline { background: white; border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { background: #DC2626; }
    .btn-group { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }

    /* Response Console Box */
    .response-box { background: var(--code-bg); color: #F1F5F9; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 13px; overflow-x: auto; max-height: 380px; position: relative; }
    .response-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 6px; font-size: 12px; color: #94A3B8; }
    .status-pill { font-weight: 700; padding: 2px 6px; border-radius: 4px; }
    .status-2xx { background: #065F46; color: #6EE7B7; }
    .status-4xx { background: #7F1D1D; color: #FCA5A5; }
    .status-5xx { background: #831843; color: #F9A8D4; }

    /* Visual Feed Cards */
    .feed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .feed-card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; display: flex; flex-direction: column; transition: transform 0.15s, box-shadow 0.15s; }
    .feed-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .feed-img { width: 100%; height: 160px; object-fit: cover; }
    .feed-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .feed-score { display: inline-flex; align-items: center; gap: 4px; background: #CCFBF1; color: #0F766E; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 20px; align-self: flex-start; }
    .feed-title { font-size: 16px; font-weight: 700; }
    .feed-meta { font-size: 12px; color: var(--text-muted); }
    .feed-bio { font-size: 13px; color: #334155; line-height: 1.4; }
    .feed-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .chip { font-size: 11px; background: #F1F5F9; color: #475569; padding: 3px 8px; border-radius: 12px; font-weight: 500; }
    .feed-actions { padding: 12px 14px; border-top: 1px solid var(--border); display: flex; gap: 8px; }
  </style>
</head>
<body>

  <header>
    <div class="header-inner">
      <div class="brand">
        <div class="logo-badge">BUDDY</div>
        <div class="title-group">
          <h1>Local Interactive Testing Console</h1>
          <p>Thiruvananthapuram, Kerala • Verified API & Feature Harness</p>
        </div>
      </div>
      <div class="session-badge">
        <span class="dot"></span>
        <span id="currentSessionLabel">Session: Guest (Not Logged In)</span>
      </div>
    </div>
  </header>

  <div class="container">
    
    <!-- LEFT SIDEBAR: QUICK PERSONAS -->
    <div class="sidebar">
      <div class="card">
        <div class="card-title">
          <span>Active Test Personas</span>
          <span style="font-size: 11px; color: var(--primary);">1-Click Switch</span>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
          Click any pre-seeded persona to inject an authenticated JWT token and inspect the app from their exact perspective.
        </p>

        <!-- Persona 1: Adarsh -->
        <button class="persona-btn" onclick="switchPersona('usr_adarsh_001', 'Adarsh Nair (TCS / Modality 1)', '+919876543211')">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" class="persona-avatar" alt="Adarsh">
          <div class="persona-info">
            <h4>Adarsh Nair, 25</h4>
            <p>TCS Technopark • Kazhakkoottam</p>
            <span class="persona-tag tag-m1">Modality 1: Has Room (₹7,500)</span>
          </div>
        </button>

        <!-- Persona 2: Sneha -->
        <button class="persona-btn" onclick="switchPersona('usr_sneha_002', 'Sneha Menon (CET / Modality 2)', '+919876543212')">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" class="persona-avatar" alt="Sneha">
          <div class="persona-info">
            <h4>Sneha Menon, 23</h4>
            <p>CET Trivandrum • Sreekaryam</p>
            <span class="persona-tag tag-m2">Modality 2: Needs Room (Veg)</span>
          </div>
        </button>

        <!-- Persona 3: Rahul -->
        <button class="persona-btn" onclick="switchPersona('usr_rahul_003', 'Rahul Pillai (UST / Modality 3)', '+919876543213')">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="persona-avatar" alt="Rahul">
          <div class="persona-info">
            <h4>Rahul Pillai, 27</h4>
            <p>UST Global • Relocating to Kazhakkoottam</p>
            <span class="persona-tag tag-m3">Modality 3: Relocating</span>
          </div>
        </button>

        <!-- Persona 4: Anjali -->
        <button class="persona-btn" onclick="switchPersona('usr_anjali_004', 'Anjali Krishna (Allianz / Modality 4)', '+919876543214')">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" class="persona-avatar" alt="Anjali">
          <div class="persona-info">
            <h4>Anjali Krishna, 26</h4>
            <p>Allianz Technopark Phase III</p>
            <span class="persona-tag tag-m4">Modality 4: Team-Up First</span>
          </div>
        </button>

        <button class="btn btn-outline" style="width: 100%; margin-top: 8px;" onclick="initiateNewUserLogin()">
          + Register / Login New User (+91 9876543210)
        </button>
      </div>

      <div class="card">
        <div class="card-title">Live System Health</div>
        <div id="systemHealthText" style="font-size: 12px; color: var(--text-muted); line-height: 1.6;">
          Checking health...
        </div>
        <button class="btn btn-secondary" style="width: 100%; margin-top: 8px; padding: 6px;" onclick="checkHealth()">
          Refresh Healthz
        </button>
      </div>
    </div>

    <!-- MAIN INTERACTIVE HARNESS -->
    <div class="main-content">
      
      <!-- NAVIGATION TABS -->
      <div class="tabs-nav">
        <button class="tab-btn active" onclick="showTab('tab-auth')">1. Auth & Verification</button>
        <button class="tab-btn" onclick="showTab('tab-profile')">2. Profile & Modality</button>
        <button class="tab-btn" onclick="showTab('tab-lifestyle')">3. Lifestyle & Scoring</button>
        <button class="tab-btn" onclick="showTab('tab-feed')">4. Discovery & Swiping</button>
        <button class="tab-btn" onclick="showTab('tab-chat')">5. Matches & Chat (Filter)</button>
        <button class="tab-btn" onclick="showTab('tab-rooms')">6. Room Listings</button>
        <button class="tab-btn" onclick="showTab('tab-safety')">7. Safety & Quarantine</button>
        <button class="tab-btn" onclick="showTab('tab-ai')">8. Assistive AI</button>
      </div>

      <!-- TAB 1: AUTHENTICATION -->
      <div id="tab-auth" class="tab-pane active">
        <div class="card">
          <div class="card-title">Phone OTP Authentication (FR-01, FR-02)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Simulate the complete authentication handshake. In local development, the universal OTP code is <code>123456</code>.
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" id="authPhone" value="+919876543210" placeholder="+91 9876543210">
            </div>
            <div class="form-group">
              <label>OTP Code</label>
              <input type="text" id="authOtp" value="123456" placeholder="6-digit code">
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-secondary" onclick="apiSendOtp()">Step 1: Request OTP (/auth/otp/send)</button>
            <button class="btn btn-primary" onclick="apiVerifyOtp()">Step 2: Verify OTP (/auth/otp/verify)</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Institutional Email Verification (FR-03, FR-04)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Request verification for Technopark corporate emails or CET / Kerala University academic emails to unlock trust badges.
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Institution Email</label>
              <input type="email" id="instEmail" value="mathews@infosys.com" placeholder="name@company.com or name@cet.ac.in">
            </div>
            <div class="form-group">
              <label>Verification Token (Returned by Step 1)</label>
              <input type="text" id="instToken" placeholder="Paste verification token">
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-secondary" onclick="apiInstRequest()">Step 1: Request Email Token</button>
            <button class="btn btn-accent" onclick="apiInstConfirm()">Step 2: Confirm Token & Grant Badge</button>
          </div>
        </div>
      </div>

      <!-- TAB 2: PROFILE & MODALITY -->
      <div id="tab-profile" class="tab-pane">
        <div class="card">
          <div class="card-title">User Profile & Discovery Modality (FR-06, FR-07, FR-08)</div>
          <div class="form-row">
            <div class="form-group">
              <label>Display Name</label>
              <input type="text" id="profName" value="Kiran Kumar">
            </div>
            <div class="form-group">
              <label>Occupation & Workplace</label>
              <input type="text" id="profWork" value="Cloud Architect @ IBS Software Technopark">
            </div>
          </div>
          <div class="form-group">
            <label>Discovery Modality (The 4 Discovery Modes)</label>
            <select id="profModality">
              <option value="MODALITY_1">MODALITY_1: Have a room available, looking for flatmate</option>
              <option value="MODALITY_2">MODALITY_2: Need accommodation, seeking existing room</option>
              <option value="MODALITY_3">MODALITY_3: In accommodation, want to relocate with flatmate</option>
              <option value="MODALITY_4" selected>MODALITY_4: Search for compatible flatmate first to flat-hunt together</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Max Budget (INR/month)</label>
              <input type="number" id="profBudget" value="9500">
            </div>
            <div class="form-group">
              <label>Preferred Trivandrum Suburbs</label>
              <input type="text" id="profSuburbs" value="KAZHAKKOOTTAM, KARIAVATTOM, KOWDIAR">
            </div>
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea id="profBio" rows="2">Techie looking for a calm flatmate near Technopark Phase I. Football on weekends, non-smoker.</textarea>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="apiSaveProfile()">Save Profile (/profiles/me)</button>
            <button class="btn btn-outline" onclick="apiGetProfile()">Fetch My Profile</button>
          </div>
        </div>
      </div>

      <!-- TAB 3: LIFESTYLE & SCORING -->
      <div id="tab-lifestyle" class="tab-pane">
        <div class="card">
          <div class="card-title">7-Vector Compatibility Configuration (FR-09 to FR-16, ADR-006)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Buddy matches on 7 lifestyle vectors: Sleep (20%), Cleanliness (20%), Diet (15%), Social (15%), Substances (15%), Budget (10%), Work (5%).
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Vector 1: Sleep Pattern</label>
              <select id="lifeSleep">
                <option value="EARLY_BIRD">EARLY_BIRD (10:30 PM - 6:30 AM)</option>
                <option value="NIGHT_OWL">NIGHT_OWL (1:00 AM - 9:00 AM)</option>
                <option value="FLEXIBLE">FLEXIBLE</option>
              </select>
            </div>
            <div class="form-group">
              <label>Vector 2: Cleanliness & Kitchen Sink</label>
              <select id="lifeClean">
                <option value="METICULOUS">METICULOUS (Immediate wash)</option>
                <option value="MODERATE">MODERATE (Same day)</option>
                <option value="RELAXED">RELAXED (Next day)</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Vector 3: Dietary Policy</label>
              <select id="lifeDiet">
                <option value="NON_VEGETARIAN">NON_VEGETARIAN (No restrictions)</option>
                <option value="STRICT_VEGETARIAN">STRICT_VEGETARIAN (Veg-only kitchen)</option>
                <option value="EGGETARIAN">EGGETARIAN</option>
              </select>
            </div>
            <div class="form-group">
              <label>Vector 4: Smoking & Substances</label>
              <select id="lifeSmoke">
                <option value="NON_SMOKER_STRICT">NON_SMOKER_STRICT (Hard dealbreaker)</option>
                <option value="BALCONY_ONLY">BALCONY_ONLY</option>
                <option value="SMOKER">SMOKER</option>
              </select>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="apiSaveLifestyle()">Save 7-Vector Settings (/lifestyle/me)</button>
            <button class="btn btn-outline" onclick="apiGetLifestyle()">Fetch Lifestyle Profile</button>
          </div>
        </div>
      </div>

      <!-- TAB 4: DISCOVERY FEED & SWIPING -->
      <div id="tab-feed" class="tab-pane">
        <div class="card">
          <div class="card-title">
            <span>Candidate Discovery Deck (FR-17, FR-18, FR-20)</span>
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="apiGetFeed()">
              🔄 Fetch Discovery Feed
            </button>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Candidates are compatibility-ranked by the deterministic 7-vector engine. Swipe LIKE to trigger mutual matching!
          </p>

          <div id="feedContainer" class="feed-grid">
            <div style="padding: 24px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
              Click "Fetch Discovery Feed" or switch to a persona above to load candidate cards.
            </div>
          </div>

          <div class="btn-group" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="apiRewind()">↺ Rewind Last Swipe (/discovery/rewind)</button>
          </div>
        </div>
      </div>

      <!-- TAB 5: MATCHES & CHAT (WITH CONTENT FILTER) -->
      <div id="tab-chat" class="tab-pane">
        <div class="card">
          <div class="card-title">Double Opt-In Matches & Real-Time Messaging (FR-19, FR-21, FR-23)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Chat is unlocked strictly upon double opt-in mutual match. The real-time ContentFilter intercepts phone numbers, emails, and UPI IDs.
          </p>
          <div class="btn-group" style="margin-bottom: 16px;">
            <button class="btn btn-outline" onclick="apiGetMatches()">Refresh Matches (/matches)</button>
            <button class="btn btn-outline" onclick="apiGetConversations()">Refresh Conversations (/conversations)</button>
          </div>

          <div id="matchesListBox" style="margin-bottom: 16px; font-size: 13px;">
            No matches loaded yet.
          </div>

          <div class="form-group">
            <label>Active Conversation ID</label>
            <input type="text" id="chatConvId" placeholder="conv_xxx (paste or click a match above)">
          </div>

          <div class="form-group">
            <label>Message Content</label>
            <textarea id="chatContent" rows="2" placeholder="Type a message..."></textarea>
          </div>

          <div class="btn-group">
            <button class="btn btn-primary" onclick="apiSendMessage(false)">Send Normal Message</button>
            <button class="btn btn-danger" onclick="apiSendTestHarvestingMessage()">
              🛡 Test Contact Harvesting Filter (Send Phone + UPI)
            </button>
            <button class="btn btn-secondary" onclick="apiGetMessages()">View History</button>
          </div>
        </div>
      </div>

      <!-- TAB 6: ROOM LISTINGS -->
      <div id="tab-rooms" class="tab-pane">
        <div class="card">
          <div class="card-title">Accommodation Listing Management (FR-25, FR-26)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Accommodation is optional in Buddy. Users in Modality 1 (Offering room) or Modality 3 (Relocating) can manage listings.
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Monthly Rent (INR)</label>
              <input type="number" id="roomRent" value="7500">
            </div>
            <div class="form-group">
              <label>Security Deposit (INR)</label>
              <input type="number" id="roomDeposit" value="20000">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Room Type</label>
              <select id="roomType">
                <option value="PRIVATE_ROOM">PRIVATE_ROOM (Attached Bath)</option>
                <option value="SHARED_ROOM">SHARED_ROOM (2 Sharing)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Location Suburb</label>
              <select id="roomSuburb">
                <option value="KAZHAKKOOTTAM">KAZHAKKOOTTAM (Near Technopark Phase I)</option>
                <option value="KARIAVATTOM">KARIAVATTOM (Near Kerala University)</option>
                <option value="SREEKARYAM">SREEKARYAM (Near CET)</option>
                <option value="KOWDIAR">KOWDIAR</option>
              </select>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="apiSaveRoomListing()">Save Listing (/rooms/me)</button>
            <button class="btn btn-outline" onclick="apiGetMyRoomListing()">Fetch My Room</button>
            <button class="btn btn-secondary" onclick="apiInspectAdarshRoom()">Inspect Adarsh's 2BHK Room</button>
          </div>
        </div>
      </div>

      <!-- TAB 7: SAFETY & QUARANTINE -->
      <div id="tab-safety" class="tab-pane">
        <div class="card">
          <div class="card-title">Trust, Safety & Automated Quarantine (FR-27, FR-28)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Test abuse prevention. Reporting an account twice within 24 hours triggers immediate automatic quarantine and revokes active access tokens!
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Target User ID to Report / Block</label>
              <input type="text" id="safetyTargetId" value="usr_rahul_003">
            </div>
            <div class="form-group">
              <label>Report Reason Category</label>
              <select id="safetyCategory">
                <option value="HARASSMENT">HARASSMENT</option>
                <option value="SPAM_COMMERCIAL">SPAM_COMMERCIAL</option>
                <option value="FAKE_PROFILE">FAKE_PROFILE</option>
              </select>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-danger" onclick="apiReportUser()">Submit Report 1 (/safety/reports)</button>
            <button class="btn btn-danger" onclick="apiReportUserTwiceForQuarantine()">
              🚨 Submit 2 Reports (Trigger Auto-Quarantine)
            </button>
            <button class="btn btn-secondary" onclick="apiBlockUser()">Block User (/safety/blocks)</button>
          </div>
        </div>
      </div>

      <!-- TAB 8: ASSISTIVE AI -->
      <div id="tab-ai" class="tab-pane">
        <div class="card">
          <div class="card-title">Assistive AI Compatibility Explanation (Gemini API & Zero-PII Fallback)</div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            AI strictly assists by explaining lifestyle nuances and generating conversational icebreakers without touching raw PII.
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Candidate User ID</label>
              <input type="text" id="aiCandidateId" value="usr_adarsh_001">
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="apiGetAiExplanation()">
              ✨ Generate AI Harmony Explanation (/ai/harmony-explanation)
            </button>
          </div>
        </div>
      </div>

      <!-- LIVE RESPONSE VIEWER -->
      <div class="card">
        <div class="card-title">
          <span>Live API Response Inspector (RFC 7807 Problem Details Compliant)</span>
          <button class="btn btn-outline" style="padding: 2px 8px; font-size: 11px;" onclick="clearLog()">Clear</button>
        </div>
        <div class="response-box" id="responseBox">
          <div class="response-header">
            <span id="responseStatusBadge" class="status-pill status-2xx">READY</span>
            <span id="responseTime">Awaiting request...</span>
          </div>
          <pre id="responseJson">// Click any action above to inspect live HTTP method, endpoint, status code, and payload.</pre>
        </div>
      </div>

    </div>
  </div>

  <script>
    // State
    let currentToken = null;
    let currentUserId = null;

    function logResponse(status, url, method, data) {
      const box = document.getElementById('responseBox');
      const badge = document.getElementById('responseStatusBadge');
      const time = document.getElementById('responseTime');
      const jsonPre = document.getElementById('responseJson');

      badge.className = 'status-pill ' + (status >= 200 && status < 300 ? 'status-2xx' : (status >= 400 && status < 500 ? 'status-4xx' : 'status-5xx'));
      badge.textContent = method + ' ' + status;
      time.textContent = url + ' • ' + new Date().toLocaleTimeString();
      jsonPre.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }

    function clearLog() {
      document.getElementById('responseJson').textContent = '// Ready.';
    }

    async function req(endpoint, options = {}) {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };
      if (currentToken) {
        headers['Authorization'] = 'Bearer ' + currentToken;
      }
      const res = await fetch(endpoint, { ...options, headers });
      let data;
      try {
        data = await res.json();
      } catch {
        data = { status: res.status, statusText: res.statusText };
      }
      logResponse(res.status, endpoint, options.method || 'GET', data);
      return { status: res.status, data };
    }

    function showTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      event.target.classList.add('active');
    }

    async function checkHealth() {
      const res = await fetch('/healthz');
      const data = await res.json();
      document.getElementById('systemHealthText').innerHTML = 
        'Status: <strong style="color: green;">' + data.status + '</strong><br>' +
        'Uptime: <strong>' + data.service + '</strong><br>' +
        'Seeded Profiles: <strong>' + (data.database ? data.database.profilesCount : 4) + '</strong><br>' +
        'Active Listings: <strong>' + (data.database ? data.database.listingsCount : 1) + '</strong>';
    }

    async function switchPersona(userId, label, phone) {
      document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active'));
      if (event && event.currentTarget) event.currentTarget.classList.add('active');

      // Login as this persona via OTP
      await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp: '123456' })
      });
      const data = await res.json();
      currentToken = data.accessToken;
      currentUserId = data.userId;
      document.getElementById('currentSessionLabel').innerHTML = 'Logged in as: <strong>' + label + '</strong>';
      logResponse(200, '/auth/otp/verify', 'POST (Persona Switch)', data);

      // Auto-load feed
      apiGetFeed();
    }

    async function initiateNewUserLogin() {
      const phone = '+919876543210';
      document.getElementById('authPhone').value = phone;
      showTab('tab-auth');
      await apiSendOtp();
    }

    async function apiSendOtp() {
      const phone = document.getElementById('authPhone').value;
      await req('/api/v1/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phone })
      });
    }

    async function apiVerifyOtp() {
      const phone = document.getElementById('authPhone').value;
      const otp = document.getElementById('authOtp').value;
      const { status, data } = await req('/api/v1/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phone, otp: otp })
      });
      if (status === 200 && data.accessToken) {
        currentToken = data.accessToken;
        currentUserId = data.userId;
        document.getElementById('currentSessionLabel').innerHTML = 'Logged in: <strong>' + phone + '</strong>';
      }
    }

    async function apiInstRequest() {
      const email = document.getElementById('instEmail').value;
      const { data } = await req('/api/v1/auth/institution/verify-request', {
        method: 'POST',
        body: JSON.stringify({
          institutionType: email.endsWith('.ac.in') ? 'ACADEMIC' : 'CORPORATE',
          institutionName: email.endsWith('.ac.in') ? 'CET Trivandrum' : 'Infosys Technopark',
          email: email
        })
      });
      if (data && data.verificationToken) {
        document.getElementById('instToken').value = data.verificationToken;
      }
    }

    async function apiInstConfirm() {
      const token = document.getElementById('instToken').value;
      await req('/api/v1/auth/institution/verify-confirm', {
        method: 'POST',
        body: JSON.stringify({ token: token })
      });
    }

    async function apiSaveProfile() {
      const suburbs = document.getElementById('profSuburbs').value.split(',').map(s => s.trim());
      await req('/api/v1/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: document.getElementById('profName').value,
          gender: 'MALE',
          birthDate: '1998-05-15',
          occupation: document.getElementById('profWork').value,
          bio: document.getElementById('profBio').value,
          modality: document.getElementById('profModality').value,
          preferredGender: 'ANY',
          minBudget: 6000,
          maxBudget: parseInt(document.getElementById('profBudget').value, 10),
          moveInFlexibility: 'WITHIN_15_DAYS',
          preferredSuburbs: suburbs
        })
      });
    }

    async function apiGetProfile() {
      await req('/api/v1/profiles/me');
    }

    async function apiSaveLifestyle() {
      await req('/api/v1/lifestyle/me', {
        method: 'PUT',
        body: JSON.stringify({
          sleep: {
            sleepPattern: document.getElementById('lifeSleep').value,
            shiftSchedule: 'NORMAL_DAY',
            noiseSensitivity: 'LIGHT_SLEEPER',
            isDealbreaker: true
          },
          cleanliness: {
            cleanlinessLevel: document.getElementById('lifeClean').value,
            kitchenSinkRule: 'IMMEDIATE_WASH',
            maidPreference: 'OPEN_TO_MAID',
            isDealbreaker: true
          },
          dietary: {
            dietType: document.getElementById('lifeDiet').value,
            kitchenPolicy: 'NO_RESTRICTIONS',
            isDealbreaker: false
          },
          social: {
            guestFrequency: 'OCCASIONAL_FRIENDS',
            overnightGuestPolicy: 'SAME_GENDER_ONLY',
            partyPreference: 'OCCASIONAL_WEEKENDS',
            isDealbreaker: false
          },
          substances: {
            smokingHabit: document.getElementById('lifeSmoke').value,
            alcoholHabit: 'TEETOTALER',
            isDealbreaker: true
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
    }

    async function apiGetLifestyle() {
      await req('/api/v1/lifestyle/me');
    }

    async function apiGetFeed() {
      const { status, data } = await req('/api/v1/discovery/feed?limit=10');
      const container = document.getElementById('feedContainer');
      if (status !== 200 || !data.cards || data.cards.length === 0) {
        container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">No more discovery cards in feed. (Tip: Try switching personas or rewinding!)</div>';
        return;
      }

      container.innerHTML = data.cards.map(card => {
        return '<div class="feed-card">' +
          '<img src="' + (card.photos && card.photos[0] ? card.photos[0].photoUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80') + '" class="feed-img">' +
          '<div class="feed-body">' +
            '<div class="feed-score">★ ' + card.compatibilityScore + '% Compatibility</div>' +
            '<div class="feed-title">' + card.displayName + ', ' + card.age + '</div>' +
            '<div class="feed-meta">' + card.occupation + ' • ' + (card.collegeOrCompany || '') + '</div>' +
            '<div class="feed-bio">' + (card.bio || '') + '</div>' +
            '<div class="feed-chips">' +
              '<span class="chip">' + card.modality + '</span>' +
              (card.highlights || []).map(h => '<span class="chip">' + h + '</span>').join('') +
            '</div>' +
          '</div>' +
          '<div class="feed-actions">' +
            '<button class="btn btn-secondary" style="flex: 1;" onclick="apiSwipe(\\'' + card.userId + '\\', \\'PASS\\')">PASS</button>' +
            '<button class="btn btn-primary" style="flex: 1;" onclick="apiSwipe(\\'' + card.userId + '\\', \\'LIKE\\')">LIKE</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    async function apiSwipe(targetUserId, action) {
      const { status, data } = await req('/api/v1/discovery/swipe', {
        method: 'POST',
        body: JSON.stringify({ targetUserId, action })
      });
      if (data && data.isMatch) {
        alert('🎉 IT\\'S A MUTUAL MATCH! You matched with ' + targetUserId + '! Chat has been unlocked.');
        showTab('tab-chat');
        apiGetMatches();
      } else {
        apiGetFeed();
      }
    }

    async function apiRewind() {
      await req('/api/v1/discovery/rewind', { method: 'POST' });
      apiGetFeed();
    }

    async function apiGetMatches() {
      const { data } = await req('/api/v1/matches');
      const box = document.getElementById('matchesListBox');
      if (!data || !data.matches || data.matches.length === 0) {
        box.innerHTML = '<em>No mutual matches found yet. Try swiping LIKE on candidates!</em>';
        return;
      }
      box.innerHTML = '<strong>Active Matches:</strong><br>' + data.matches.map(m => 
        '<div style="padding: 6px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">' +
          '<span>' + m.candidate.displayName + ' (' + m.compatibilityScore + '% Match)</span>' +
          '<button class="btn btn-outline" style="padding: 2px 8px; font-size: 11px;" onclick="selectConversation(\\'' + (m.conversationId || '') + '\\')">Open Chat</button>' +
        '</div>'
      ).join('');
    }

    async function apiGetConversations() {
      const { data } = await req('/api/v1/conversations');
      if (data && data.conversations && data.conversations.length > 0) {
        selectConversation(data.conversations[0].id);
      }
    }

    function selectConversation(id) {
      document.getElementById('chatConvId').value = id;
      apiGetMessages();
    }

    async function apiSendMessage(isTestFilter) {
      const convId = document.getElementById('chatConvId').value;
      const content = document.getElementById('chatContent').value;
      await req('/api/v1/conversations/' + convId + '/messages', {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      apiGetMessages();
    }

    async function apiSendTestHarvestingMessage() {
      const convId = document.getElementById('chatConvId').value;
      const toxicPayload = 'Hey! Reach me directly at +91 9876543210 or transfer ₹500 via upi: user@okaxis';
      document.getElementById('chatContent').value = toxicPayload;
      await req('/api/v1/conversations/' + convId + '/messages', {
        method: 'POST',
        body: JSON.stringify({ content: toxicPayload })
      });
      apiGetMessages();
    }

    async function apiGetMessages() {
      const convId = document.getElementById('chatConvId').value;
      await req('/api/v1/conversations/' + convId + '/messages');
    }

    async function apiSaveRoomListing() {
      await req('/api/v1/rooms/me', {
        method: 'POST',
        body: JSON.stringify({
          roomType: document.getElementById('roomType').value,
          bathroomType: 'ATTACHED_PRIVATE',
          monthlyRent: parseInt(document.getElementById('roomRent').value, 10),
          securityDeposit: parseInt(document.getElementById('roomDeposit').value, 10),
          availableFrom: '2026-12-01',
          locationSuburb: document.getElementById('roomSuburb').value,
          amenities: ['AC', 'WiFi', 'Attached Bathroom', 'Covered Parking']
        })
      });
    }

    async function apiGetMyRoomListing() {
      await req('/api/v1/rooms/me');
    }

    async function apiInspectAdarshRoom() {
      await req('/api/v1/rooms/room_adarsh_001');
    }

    async function apiReportUser() {
      const targetId = document.getElementById('safetyTargetId').value;
      const category = document.getElementById('safetyCategory').value;
      await req('/api/v1/safety/reports', {
        method: 'POST',
        body: JSON.stringify({
          reportedUserId: targetId,
          category: category,
          details: 'Inappropriate behavior violating safety guidelines.'
        })
      });
    }

    async function apiReportUserTwiceForQuarantine() {
      const targetId = document.getElementById('safetyTargetId').value;
      alert('Submitting 2 reports for user ' + targetId + ' to trigger automatic account quarantine.');
      await req('/api/v1/safety/reports', {
        method: 'POST',
        body: JSON.stringify({ reportedUserId: targetId, category: 'HARASSMENT', details: 'Incident 1' })
      });
      await req('/api/v1/safety/reports', {
        method: 'POST',
        body: JSON.stringify({ reportedUserId: targetId, category: 'HARASSMENT', details: 'Incident 2' })
      });
    }

    async function apiBlockUser() {
      const targetId = document.getElementById('safetyTargetId').value;
      await req('/api/v1/safety/blocks', {
        method: 'POST',
        body: JSON.stringify({ blockedUserId: targetId, reason: 'Personal preference' })
      });
    }

    async function apiGetAiExplanation() {
      const candId = document.getElementById('aiCandidateId').value;
      await req('/api/v1/ai/harmony-explanation', {
        method: 'POST',
        body: JSON.stringify({ candidateUserId: candId })
      });
    }

    // Auto-init health check on load
    checkHealth();
  </script>
</body>
</html>`;
}


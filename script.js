const DEFAULT_ORIGIN = { lat: 27.1767, lng: 78.0081 };
let origins = {
  mess: { ...DEFAULT_ORIGIN, label: "default campus point" },
  room: { ...DEFAULT_ORIGIN, label: "default campus point" }
};

const messes = [
  { id:1, name:"Sharma Tiffin Service", type:"veg", cuisine:["North Indian","Thali"], lat:27.1780, lng:78.0095,
    pricePerMeal:90, priceMonthly:2500, rating:4.5, timing:"12–2pm, 7:30–9:30pm" },
  { id:2, name:"Bengal Bhavan Mess", type:"nonveg", cuisine:["Bengali","Fish Curry"], lat:27.1750, lng:78.0060,
    pricePerMeal:120, priceMonthly:3200, rating:4.2, timing:"1–3pm, 8–10pm" },
  { id:3, name:"South Point Mess", type:"veg", cuisine:["South Indian","Dosa","Sambhar"], lat:27.1795, lng:78.0050,
    pricePerMeal:80, priceMonthly:2200, rating:4.6, timing:"7:30–10am, 12–2:30pm" },
  { id:4, name:"Punjabi Dhaba Mess", type:"nonveg", cuisine:["Punjabi","Butter Chicken"], lat:27.1740, lng:78.0110,
    pricePerMeal:140, priceMonthly:3600, rating:4.3, timing:"12–3pm, 7–10pm" },
  { id:5, name:"Annapurna Grih Udyog", type:"veg", cuisine:["Pure Veg","Home Style"], lat:27.1770, lng:78.0030,
    pricePerMeal:85, priceMonthly:2200, rating:4.7, timing:"11:30am–2pm, 7–9:30pm" },
  { id:6, name:"Hostel Corner Mess", type:"both", cuisine:["Mixed","Everyday Menu"], lat:27.1810, lng:78.0100,
    pricePerMeal:100, priceMonthly:2700, rating:3.9, timing:"12–2:30pm, 8–10pm" },
  { id:7, name:"Maa Ka Aanchal", type:"veg", cuisine:["Home Style","Roti-Sabzi"], lat:27.1730, lng:78.0070,
    pricePerMeal:75, priceMonthly:2000, rating:4.4, timing:"12–2pm, 7–9pm" },
  { id:8, name:"Spice Route Mess", type:"nonveg", cuisine:["Biryani","Mughlai"], lat:27.1800, lng:78.0020,
    pricePerMeal:130, priceMonthly:3400, rating:4.1, timing:"1–3:30pm, 8–10:30pm" },
];

const rooms = [
  { id:1, name:"Sunrise PG for Boys", gender:"boys", roomType:"single", lat:27.1785, lng:78.0088,
    rent:6500, deposit:5000, rating:4.3, facilities:["WiFi","Attached Bath","Power Backup"] },
  { id:2, name:"Girls Nest Residency", gender:"girls", roomType:"shared", lat:27.1755, lng:78.0045,
    rent:5000, deposit:5000, rating:4.6, facilities:["WiFi","AC","Laundry","Meals Included"] },
  { id:3, name:"Campus View Rooms", gender:"coed", roomType:"single", lat:27.1798, lng:78.0065,
    rent:7500, deposit:7000, rating:4.2, facilities:["WiFi","AC","Parking","Furnished"] },
  { id:4, name:"Budget Stay Hostel", gender:"boys", roomType:"shared", lat:27.1745, lng:78.0105,
    rent:3500, deposit:3000, rating:3.8, facilities:["WiFi","Power Backup"] },
  { id:5, name:"Comfort Homes PG", gender:"girls", roomType:"single", lat:27.1775, lng:78.0025,
    rent:8000, deposit:8000, rating:4.7, facilities:["AC","Attached Bath","Laundry","Meals Included","WiFi"] },
  { id:6, name:"Scholar's Den", gender:"coed", roomType:"shared", lat:27.1815, lng:78.0095,
    rent:4500, deposit:4000, rating:4.0, facilities:["WiFi","Power Backup"] },
  { id:7, name:"Green Valley Hostel", gender:"boys", roomType:"shared", lat:27.1735, lng:78.0075,
    rent:4000, deposit:3500, rating:4.1, facilities:["WiFi","Attached Bath","Parking"] },
  { id:8, name:"Elite Stay Residency", gender:"coed", roomType:"single", lat:27.1805, lng:78.0015,
    rent:9500, deposit:9000, rating:4.5, facilities:["AC","WiFi","Laundry","Furnished","Power Backup"] },
];

let messState = { query:"", type:"all", price:"all", sort:"distance" };
let roomState = { query:"", gender:"all", roomType:"all", price:"all", facilities:new Set(), sort:"distance" };
let currentTab = "mess";

function haversine(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function distLabel(dist){
  return dist < 1 ? { km: Math.round(dist*1000)+'m', label:'' } : { km: dist.toFixed(1)+'km', label:'AWAY' };
}

function starIcon(){
  return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
}
function clockIcon(){
  return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
}

function messPriceBucket(p){ if(p < 90) return "low"; if(p <= 120) return "mid"; return "high"; }
function roomPriceBucket(p){ if(p < 5000) return "low"; if(p <= 8000) return "mid"; return "high"; }

function renderMess(){
  const withDist = messes.map(m => ({...m, dist: haversine(origins.mess.lat, origins.mess.lng, m.lat, m.lng)}));
  let filtered = withDist.filter(m => {
    const q = messState.query.trim().toLowerCase();
    const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.cuisine.some(c => c.toLowerCase().includes(q));
    const matchesType = messState.type === "all" || m.type === messState.type;
    const matchesPrice = messState.price === "all" || messPriceBucket(m.pricePerMeal) === messState.price;
    return matchesQuery && matchesType && matchesPrice;
  });
  filtered.sort((a,b) => {
    if(messState.sort === "distance") return a.dist - b.dist;
    if(messState.sort === "rating") return b.rating - a.rating;
    return a.pricePerMeal - b.pricePerMeal;
  });

  document.getElementById("mess-result-count").textContent = filtered.length;
  document.getElementById("mess-tab-count").textContent = filtered.length;
  const grid = document.getElementById("mess-grid");

  if(filtered.length === 0){
    grid.innerHTML = `<div class="empty"><div class="display">Nothing on the menu</div><p>No mess matches those filters. Try widening your budget or clearing the search.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const d = distLabel(m.dist);
    return `
    <div class="card ${m.type}">
      <div class="lid"></div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="name-line"><span class="veg-dot"></span><h3 class="card-name">${m.name}</h3></div>
            <div class="tags">${m.cuisine.map(c => `<span class="tag">${c}</span>`).join("")}</div>
          </div>
        </div>
        <div class="meta-line"><span class="item">${clockIcon()}${m.timing}</span></div>
        <div class="price-line">
          <div class="price-main">₹${m.pricePerMeal}<span class="per">/meal</span></div>
          <div class="price-sub">₹${m.priceMonthly.toLocaleString('en-IN')}/month plan</div>
        </div>
      </div>
      <div class="stack">
        <div class="tin"><span class="km">${d.km}</span><span class="kmlabel">${d.label}</span></div>
        <div class="rating">${starIcon()} ${m.rating.toFixed(1)}</div>
      </div>
    </div>`;
  }).join("");
}

function renderRooms(){
  const withDist = rooms.map(r => ({...r, dist: haversine(origins.room.lat, origins.room.lng, r.lat, r.lng)}));
  let filtered = withDist.filter(r => {
    const q = roomState.query.trim().toLowerCase();
    const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.facilities.some(f => f.toLowerCase().includes(q));
    const matchesGender = roomState.gender === "all" || r.gender === roomState.gender;
    const matchesType = roomState.roomType === "all" || r.roomType === roomState.roomType;
    const matchesPrice = roomState.price === "all" || roomPriceBucket(r.rent) === roomState.price;
    const matchesFacilities = [...roomState.facilities].every(f => r.facilities.includes(f));
    return matchesQuery && matchesGender && matchesType && matchesPrice && matchesFacilities;
  });
  filtered.sort((a,b) => {
    if(roomState.sort === "distance") return a.dist - b.dist;
    if(roomState.sort === "rating") return b.rating - a.rating;
    return a.rent - b.rent;
  });

  document.getElementById("room-result-count").textContent = filtered.length;
  document.getElementById("room-tab-count").textContent = filtered.length;
  const grid = document.getElementById("room-grid");

  if(filtered.length === 0){
    grid.innerHTML = `<div class="empty"><div class="display">No vacancies here</div><p>No room matches those filters. Try clearing a facility or widening your budget.</p></div>`;
    return;
  }

  const genderLabel = { boys:"Boys only", girls:"Girls only", coed:"Co-ed" };
  const typeLabel = { single:"Single room", shared:"Shared room" };

  grid.innerHTML = filtered.map(r => {
    const d = distLabel(r.dist);
    return `
    <div class="card room">
      <div class="lid"></div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="name-line"><span class="room-dot"></span><h3 class="card-name">${r.name}</h3></div>
            <div class="tags">
              <span class="tag">${genderLabel[r.gender]}</span>
              <span class="tag">${typeLabel[r.roomType]}</span>
              ${r.facilities.map(f => `<span class="tag facility">${f}</span>`).join("")}
            </div>
          </div>
        </div>
        <div class="price-line">
          <div class="price-main">₹${r.rent.toLocaleString('en-IN')}<span class="per">/month</span></div>
          <div class="price-sub">₹${r.deposit.toLocaleString('en-IN')} deposit</div>
        </div>
      </div>
      <div class="stack">
        <div class="tin"><span class="km">${d.km}</span><span class="kmlabel">${d.label}</span></div>
        <div class="rating">${starIcon()} ${r.rating.toFixed(1)}</div>
      </div>
    </div>`;
  }).join("");
}

// ---- tabs ----
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    document.getElementById("panel-mess").classList.toggle("hidden", currentTab !== "mess");
    document.getElementById("panel-room").classList.toggle("hidden", currentTab !== "room");
  });
});

// ---- mess controls ----
document.getElementById("mess-search").addEventListener("input", e => { messState.query = e.target.value; renderMess(); });
document.getElementById("mess-type-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  document.querySelectorAll("#mess-type-filters .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active"); messState.type = btn.dataset.val; renderMess();
});
document.getElementById("mess-price-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  document.querySelectorAll("#mess-price-filters .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active"); messState.price = btn.dataset.val; renderMess();
});
document.getElementById("mess-sort").addEventListener("change", e => { messState.sort = e.target.value; renderMess(); });

// ---- room controls ----
document.getElementById("room-search").addEventListener("input", e => { roomState.query = e.target.value; renderRooms(); });
document.getElementById("room-gender-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  document.querySelectorAll("#room-gender-filters .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active"); roomState.gender = btn.dataset.val; renderRooms();
});
document.getElementById("room-type-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  document.querySelectorAll("#room-type-filters .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active"); roomState.roomType = btn.dataset.val; renderRooms();
});
document.getElementById("room-price-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  document.querySelectorAll("#room-price-filters .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active"); roomState.price = btn.dataset.val; renderRooms();
});
document.getElementById("room-facility-filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if(!btn) return;
  const val = btn.dataset.val;
  if(roomState.facilities.has(val)){ roomState.facilities.delete(val); btn.classList.remove("active"); }
  else { roomState.facilities.add(val); btn.classList.add("active"); }
  renderRooms();
});
document.getElementById("room-sort").addEventListener("change", e => { roomState.sort = e.target.value; renderRooms(); });

// ---- geolocation (shared handler, scoped by tab) ----
document.querySelectorAll("[data-locate-for]").forEach(btn => {
  btn.addEventListener("click", () => {
    const scope = btn.dataset.locateFor;
    const status = document.getElementById(scope + "-locate-status");
    if(!navigator.geolocation){ status.textContent = "Geolocation isn't supported by this browser."; return; }
    btn.disabled = true;
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        origins[scope] = { lat: pos.coords.latitude, lng: pos.coords.longitude, label: "your location" };
        status.textContent = "Showing distances from your current location.";
        document.getElementById(scope + "-origin-note").textContent = "origin: your location";
        btn.disabled = false;
        if(scope === "mess"){ messState.sort = "distance"; document.getElementById("mess-sort").value = "distance"; renderMess(); }
        else { roomState.sort = "distance"; document.getElementById("room-sort").value = "distance"; renderRooms(); }
      },
      err => {
        status.textContent = "Couldn't get your location (" + err.message + "). Showing default distances instead.";
        btn.disabled = false;
      },
      { timeout: 8000 }
    );
  });
});

renderMess();
renderRooms();

// ============ AUTH ============
const API_BASE = "/api";

const authOverlay   = document.getElementById("auth-overlay");
const openLoginBtn  = document.getElementById("open-login-btn");
const closeAuthBtn  = document.getElementById("close-auth-btn");
const authArea      = document.getElementById("auth-area");
const loginForm     = document.getElementById("login-form");
const registerForm  = document.getElementById("register-form");
const loginError    = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

function openAuthModal(tab = "login"){
  authOverlay.classList.remove("hidden");
  switchAuthTab(tab);
  loginError.textContent = "";
  registerError.textContent = "";
}
function closeAuthModal(){
  authOverlay.classList.add("hidden");
}
function switchAuthTab(tab){
  document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.authtab === tab));
  loginForm.classList.toggle("hidden", tab !== "login");
  registerForm.classList.toggle("hidden", tab !== "register");
}

openLoginBtn.addEventListener("click", () => openAuthModal("login"));
closeAuthBtn.addEventListener("click", closeAuthModal);
authOverlay.addEventListener("click", e => { if(e.target === authOverlay) closeAuthModal(); });

document.querySelectorAll(".auth-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchAuthTab(btn.dataset.authtab));
});

function saveSession(token, user){
  localStorage.setItem("yg_token", token);
  localStorage.setItem("yg_user", JSON.stringify(user));
  renderAuthArea();
}
function clearSession(){
  localStorage.removeItem("yg_token");
  localStorage.removeItem("yg_user");
  renderAuthArea();
}
function getToken(){ return localStorage.getItem("yg_token"); }
function getUser(){
  const raw = localStorage.getItem("yg_user");
  return raw ? JSON.parse(raw) : null;
}

function renderAuthArea(){
  const user = getUser();
  if(user){
    const showDash = ["mess_owner", "room_owner", "admin"].includes(user.role);
    authArea.innerHTML = `
      <div class="user-chip">
        ${showDash ? `<button class="dash-btn" id="open-dash-btn">${user.role === "admin" ? "Admin Panel" : "Dashboard"}</button>` : ""}
        <span class="user-name">${user.name}</span>
        <button class="logout-btn" id="logout-btn">Logout</button>
      </div>`;
    document.getElementById("logout-btn").addEventListener("click", clearSession);
    if(showDash){
      document.getElementById("open-dash-btn").addEventListener("click", openDashboard);
    }
  } else {
    authArea.innerHTML = `<button class="auth-btn" id="open-login-btn">Login</button>`;
    document.getElementById("open-login-btn").addEventListener("click", () => openAuthModal("login"));
  }
}

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginError.textContent = "";
  const submitBtn = loginForm.querySelector(".auth-submit-btn");
  submitBtn.disabled = true;

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if(!res.ok || !data.success){
      loginError.textContent = data.message || "Login failed.";
      return;
    }

    saveSession(data.token, data.user);
    closeAuthModal();
    loginForm.reset();
  } catch (err) {
    loginError.textContent = "Couldn't reach the server. Try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  registerError.textContent = "";
  const submitBtn = registerForm.querySelector(".auth-submit-btn");
  submitBtn.disabled = true;

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password, role })
    });
    const data = await res.json();

    if(!res.ok || !data.success){
      registerError.textContent = data.message || "Registration failed.";
      return;
    }

    saveSession(data.token, data.user);
    closeAuthModal();
    registerForm.reset();
  } catch (err) {
    registerError.textContent = "Couldn't reach the server. Try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

renderAuthArea();
// ============ FETCH REAL LISTINGS FROM BACKEND (merge with demo data) ============
async function loadPublicListings(){
  try {
    const [messRes, roomRes] = await Promise.all([
      fetch(`${API_BASE}/messes`),
      fetch(`${API_BASE}/rooms`)
    ]);
    const liveMesses = await messRes.json();
    const liveRooms = await roomRes.json();

    if(Array.isArray(liveMesses)){
      liveMesses.forEach(m => messes.push({ ...m, id: m._id }));
    }
    if(Array.isArray(liveRooms)){
      liveRooms.forEach(r => rooms.push({ ...r, id: r._id }));
    }
    renderMess();
    renderRooms();
  } catch (err) {
    // backend not reachable — demo data still shows fine
  }
}
loadPublicListings();

// ============ DASHBOARD (mess owner / room owner / admin) ============
const dashOverlay  = document.getElementById("dash-overlay");
const dashContent  = document.getElementById("dash-content");
const closeDashBtn = document.getElementById("close-dash-btn");

closeDashBtn.addEventListener("click", () => dashOverlay.classList.add("hidden"));
dashOverlay.addEventListener("click", e => { if(e.target === dashOverlay) dashOverlay.classList.add("hidden"); });

function authHeaders(){
  return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
}

function openDashboard(){
  const user = getUser();
  if(!user) return;
  dashOverlay.classList.remove("hidden");

  if(user.role === "mess_owner") renderMessOwnerDash();
  else if(user.role === "room_owner") renderRoomOwnerDash();
  else if(user.role === "admin") renderAdminDash();
}

/* ---- Mess owner dashboard ---- */
function renderMessOwnerDash(){
  dashContent.innerHTML = `
    <div class="dash-title">Add Your Mess</div>
    <form id="add-mess-form" class="dash-form">
      <div class="field"><label>Mess Name</label><input type="text" id="m-name" required></div>
      <div class="row2">
        <div class="field"><label>Type</label>
          <select id="m-type"><option value="veg">Veg</option><option value="nonveg">Non-veg</option><option value="both">Both</option></select>
        </div>
        <div class="field"><label>Timing</label><input type="text" id="m-timing" placeholder="12–2pm, 7:30–9:30pm"></div>
      </div>
      <div class="field"><label>Cuisine (comma separated)</label><input type="text" id="m-cuisine" placeholder="North Indian, Thali"></div>
      <div class="row2">
        <div class="field"><label>Price per meal (₹)</label><input type="number" id="m-price-meal" required></div>
        <div class="field"><label>Monthly plan (₹)</label><input type="number" id="m-price-month" required></div>
      </div>
      <div class="row2">
        <div class="field"><label>Latitude</label><input type="number" step="any" id="m-lat" required></div>
        <div class="field"><label>Longitude</label><input type="number" step="any" id="m-lng" required></div>
      </div>
      <div class="auth-error mono" id="add-mess-error"></div>
      <button type="submit" class="auth-submit-btn">Submit for Review</button>
    </form>
    <div class="dash-title" style="font-size:16px;">Your Listings</div>
    <div class="dash-list" id="my-mess-list"><div class="empty-dash">Loading…</div></div>
  `;

  document.getElementById("add-mess-form").addEventListener("submit", async e => {
    e.preventDefault();
    const errEl = document.getElementById("add-mess-error");
    errEl.textContent = "";

    const body = {
      name: document.getElementById("m-name").value.trim(),
      type: document.getElementById("m-type").value,
      timing: document.getElementById("m-timing").value.trim(),
      cuisine: document.getElementById("m-cuisine").value.split(",").map(s => s.trim()).filter(Boolean),
      pricePerMeal: document.getElementById("m-price-meal").value,
      priceMonthly: document.getElementById("m-price-month").value,
      lat: document.getElementById("m-lat").value,
      lng: document.getElementById("m-lng").value
    };

    try {
      const res = await fetch(`${API_BASE}/messes`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
      const data = await res.json();
      if(!res.ok || !data.success){ errEl.textContent = data.message || "Couldn't submit."; return; }
      e.target.reset();
      loadMyMesses();
    } catch (err) {
      errEl.textContent = "Couldn't reach the server.";
    }
  });

  loadMyMesses();
}

async function loadMyMesses(){
  const listEl = document.getElementById("my-mess-list");
  try {
    const res = await fetch(`${API_BASE}/messes/mine`, { headers: authHeaders() });
    const data = await res.json();
    if(!data.success || !data.messes.length){
      listEl.innerHTML = `<div class="empty-dash">No listings yet — add your first mess above.</div>`;
      return;
    }
    listEl.innerHTML = data.messes.map(m => `
      <div class="dash-item">
        <div class="dash-item-main">${m.name}<span class="sub">₹${m.pricePerMeal}/meal · ${m.type}</span></div>
        <div class="dash-item-actions">
          <span class="status-badge ${m.status}">${m.status}</span>
          <button class="mini-btn delete" data-delmess="${m._id}">Delete</button>
        </div>
      </div>
    `).join("");
    listEl.querySelectorAll("[data-delmess]").forEach(btn => {
      btn.addEventListener("click", async () => {
        await fetch(`${API_BASE}/messes/${btn.dataset.delmess}`, { method: "DELETE", headers: authHeaders() });
        loadMyMesses();
      });
    });
  } catch (err) {
    listEl.innerHTML = `<div class="empty-dash">Couldn't load your listings.</div>`;
  }
}

/* ---- Room owner dashboard ---- */
function renderRoomOwnerDash(){
  dashContent.innerHTML = `
    <div class="dash-title">Add Your Room / PG</div>
    <form id="add-room-form" class="dash-form">
      <div class="field"><label>Property Name</label><input type="text" id="r-name" required></div>
      <div class="row2">
        <div class="field"><label>For</label>
          <select id="r-gender"><option value="boys">Boys</option><option value="girls">Girls</option><option value="coed">Co-ed</option></select>
        </div>
        <div class="field"><label>Room Type</label>
          <select id="r-type"><option value="single">Single</option><option value="shared">Shared</option></select>
        </div>
      </div>
      <div class="row2">
        <div class="field"><label>Rent / month (₹)</label><input type="number" id="r-rent" required></div>
        <div class="field"><label>Deposit (₹)</label><input type="number" id="r-deposit"></div>
      </div>
      <div class="field"><label>Facilities (comma separated)</label><input type="text" id="r-facilities" placeholder="WiFi, AC, Attached Bath"></div>
      <div class="row2">
        <div class="field"><label>Latitude</label><input type="number" step="any" id="r-lat" required></div>
        <div class="field"><label>Longitude</label><input type="number" step="any" id="r-lng" required></div>
      </div>
      <div class="auth-error mono" id="add-room-error"></div>
      <button type="submit" class="auth-submit-btn">Submit for Review</button>
    </form>
    <div class="dash-title" style="font-size:16px;">Your Listings</div>
    <div class="dash-list" id="my-room-list"><div class="empty-dash">Loading…</div></div>
  `;

  document.getElementById("add-room-form").addEventListener("submit", async e => {
    e.preventDefault();
    const errEl = document.getElementById("add-room-error");
    errEl.textContent = "";

    const body = {
      name: document.getElementById("r-name").value.trim(),
      gender: document.getElementById("r-gender").value,
      roomType: document.getElementById("r-type").value,
      rent: document.getElementById("r-rent").value,
      deposit: document.getElementById("r-deposit").value,
      facilities: document.getElementById("r-facilities").value.split(",").map(s => s.trim()).filter(Boolean),
      lat: document.getElementById("r-lat").value,
      lng: document.getElementById("r-lng").value
    };

    try {
      const res = await fetch(`${API_BASE}/rooms`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
      const data = await res.json();
      if(!res.ok || !data.success){ errEl.textContent = data.message || "Couldn't submit."; return; }
      e.target.reset();
      loadMyRooms();
    } catch (err) {
      errEl.textContent = "Couldn't reach the server.";
    }
  });

  loadMyRooms();
}

async function loadMyRooms(){
  const listEl = document.getElementById("my-room-list");
  try {
    const res = await fetch(`${API_BASE}/rooms/mine`, { headers: authHeaders() });
    const data = await res.json();
    if(!data.success || !data.rooms.length){
      listEl.innerHTML = `<div class="empty-dash">No listings yet — add your first room above.</div>`;
      return;
    }
    listEl.innerHTML = data.rooms.map(r => `
      <div class="dash-item">
        <div class="dash-item-main">${r.name}<span class="sub">₹${r.rent.toLocaleString('en-IN')}/month · ${r.roomType}</span></div>
        <div class="dash-item-actions">
          <span class="status-badge ${r.status}">${r.status}</span>
          <button class="mini-btn delete" data-delroom="${r._id}">Delete</button>
        </div>
      </div>
    `).join("");
    listEl.querySelectorAll("[data-delroom]").forEach(btn => {
      btn.addEventListener("click", async () => {
        await fetch(`${API_BASE}/rooms/${btn.dataset.delroom}`, { method: "DELETE", headers: authHeaders() });
        loadMyRooms();
      });
    });
  } catch (err) {
    listEl.innerHTML = `<div class="empty-dash">Couldn't load your listings.</div>`;
  }
}

/* ---- Admin dashboard ---- */
function renderAdminDash(activeTab = "messes"){
  dashContent.innerHTML = `
    <div class="dash-title">Admin Panel</div>
    <div class="dash-tabs">
      <button class="dash-tab-btn ${activeTab === "messes" ? "active" : ""}" data-admintab="messes">Pending Messes</button>
      <button class="dash-tab-btn ${activeTab === "rooms" ? "active" : ""}" data-admintab="rooms">Pending Rooms</button>
      <button class="dash-tab-btn ${activeTab === "users" ? "active" : ""}" data-admintab="users">Users</button>
    </div>
    <div class="dash-list" id="admin-dash-list"><div class="empty-dash">Loading…</div></div>
  `;

  dashContent.querySelectorAll("[data-admintab]").forEach(btn => {
    btn.addEventListener("click", () => renderAdminDash(btn.dataset.admintab));
  });

  if(activeTab === "users") loadAdminUsers();
  else loadAdminPending(activeTab);
}

async function loadAdminPending(kind){
  const listEl = document.getElementById("admin-dash-list");
  try {
    const res = await fetch(`${API_BASE}/admin/pending`, { headers: authHeaders() });
    const data = await res.json();
    const items = kind === "rooms" ? data.rooms : data.messes;

    if(!items || !items.length){
      listEl.innerHTML = `<div class="empty-dash">Nothing pending right now.</div>`;
      return;
    }

    listEl.innerHTML = items.map(it => `
      <div class="dash-item">
        <div class="dash-item-main">${it.name}<span class="sub">${kind === "rooms" ? `₹${it.rent}/month · ${it.roomType}` : `₹${it.pricePerMeal}/meal · ${it.type}`}</span></div>
        <div class="dash-item-actions">
          <button class="mini-btn approve" data-approve="${it._id}" data-kind="${kind}">Approve</button>
          <button class="mini-btn reject" data-reject="${it._id}" data-kind="${kind}">Reject</button>
        </div>
      </div>
    `).join("");

    listEl.querySelectorAll("[data-approve]").forEach(btn => {
      btn.addEventListener("click", async () => {
        await fetch(`${API_BASE}/admin/${btn.dataset.kind}/${btn.dataset.approve}/approve`, { method: "PATCH", headers: authHeaders() });
        loadAdminPending(kind);
      });
    });
    listEl.querySelectorAll("[data-reject]").forEach(btn => {
      btn.addEventListener("click", async () => {
        await fetch(`${API_BASE}/admin/${btn.dataset.kind}/${btn.dataset.reject}`, { method: "DELETE", headers: authHeaders() });
        loadAdminPending(kind);
      });
    });
  } catch (err) {
    listEl.innerHTML = `<div class="empty-dash">Couldn't load pending listings.</div>`;
  }
}

async function loadAdminUsers(){
  const listEl = document.getElementById("admin-dash-list");
  try {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
    const data = await res.json();
    if(!data.users || !data.users.length){
      listEl.innerHTML = `<div class="empty-dash">No users yet.</div>`;
      return;
    }
    listEl.innerHTML = data.users.map(u => `
      <div class="dash-item">
        <div class="dash-item-main">${u.name}<span class="sub">${u.email} · ${u.role}</span></div>
      </div>
    `).join("");
  } catch (err) {
    listEl.innerHTML = `<div class="empty-dash">Couldn't load users.</div>`;
  }
}

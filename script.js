/* =========================================================
   CONNECTHUB - FINAL SCRIPT.JS
   Advanced JS concepts used:
   1. IIFE
   2. Closure
   3. Async / Await
   4. Higher-Order Functions
   5. Throttle
========================================================= */

/* =========================
   HOME PAGE: Join Form Validation
   + Closure for submit tracking
========================= */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
(function () {
  const form = document.getElementById("joinForm");
  if (!form) return;

  const fields = {
    fullname: {
      el: document.getElementById("fullname"),
      err: document.getElementById("fullnameError"),
      messages: {
        valueMissing: "Full name is required.",
        tooShort: "Full name must be at least 2 characters.",
        tooLong: "Full name must be under 50 characters.",
        patternMismatch: "Use only letters and spaces (.'- allowed).",
      },
    },
    email: {
      el: document.getElementById("email"),
      err: document.getElementById("emailError"),
      messages: {
        valueMissing: "Email is required.",
        typeMismatch: "Enter a valid email address.",
      },
    },
    purpose: {
      el: document.getElementById("purpose"),
      err: document.getElementById("purposeError"),
      messages: {
        valueMissing: "Please select a purpose.",
      },
    },
    agree: {
      el: document.getElementById("agree"),
      err: document.getElementById("agreeError"),
      messages: {
        valueMissing: "You must agree to continue.",
      },
    },
  };

  for (const key in fields) {
    if (!fields[key].el || !fields[key].err) return;
  }

  function showError(key, message) {
    const field = fields[key];
    field.err.textContent = message;
    if (field.el.type !== "checkbox") field.el.classList.add("input-error");
  }

  function clearError(key) {
    const field = fields[key];
    field.err.textContent = "";
    field.el.classList.remove("input-error");
  }

  function getMessage(key) {
    const field = fields[key];
    const validity = field.el.validity;

    if (validity.valid) return "";
    if (validity.valueMissing) return field.messages.valueMissing || "This field is required.";
    if (validity.typeMismatch) return field.messages.typeMismatch || "Invalid format.";
    if (validity.tooShort) return field.messages.tooShort || "Too short.";
    if (validity.tooLong) return field.messages.tooLong || "Too long.";
    if (validity.patternMismatch) return field.messages.patternMismatch || "Invalid format.";
    return "Please correct this field.";
  }

  function validateField(key) {
    const message = getMessage(key);
    if (message) {
      showError(key, message);
      return false;
    }
    clearError(key);
    return true;
  }

  function createSubmitTracker() {
    let attempts = 0;
    return {
      increment() {
        attempts++;
      },
      getCount() {
        return attempts;
      },
    };
  }

  const submitTracker = createSubmitTracker();

  form.addEventListener("submit", function (e) {
    submitTracker.increment();

    let firstInvalid = null;
    let allValid = true;

    for (const key of Object.keys(fields)) {
      const ok = validateField(key);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = fields[key].el;
      }
    }

    if (!allValid) {
      e.preventDefault();
      if (firstInvalid) firstInvalid.focus();
      showToast("Invalid attempts: " + submitTracker.getCount());
      return;
    }

    console.log("Join form submitted after attempts:", submitTracker.getCount());
  });

  fields.fullname.el.addEventListener("input", () => validateField("fullname"));
  fields.email.el.addEventListener("input", () => validateField("email"));
  fields.purpose.el.addEventListener("change", () => validateField("purpose"));
  fields.agree.el.addEventListener("change", () => validateField("agree"));

  fields.fullname.el.addEventListener("blur", () => validateField("fullname"));
  fields.email.el.addEventListener("blur", () => validateField("email"));
})();

/* =========================
   HOME PAGE: Auto-select Purpose
========================= */
(function () {
  const purposeCards = document.querySelectorAll(".purpose-card-img");
  const purposeSelect = document.getElementById("purpose");

  if (!purposeCards.length || !purposeSelect) return;

  purposeCards.forEach((card) => {
      card.addEventListener("click", function () {
      const purpose = this.getAttribute("data-purpose");
      showToast("You clicked: " + purpose);
     purposeSelect.value = purpose;
    purposeSelect.dispatchEvent(new Event("change"));
    });
  });
})();

/* =========================
   EXPLORE PAGE: Nearby Users + Map
   Uses async/await, closure, HOF, throttle */
(function () {

  const cards = document.querySelectorAll(".purpose-card");
  const activity = JSON.parse(localStorage.getItem("connecthub_activity"));

  if (activity) {
  const meta = document.getElementById("nearbyMeta");
  if (meta) {
    meta.textContent = `Last activity: ${activity.action} by ${activity.user}`;
  }
}
  if (!cards.length || typeof L === "undefined") return;

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
    { name: "Kavya", purpose: "Life Partner", lat: 19.2110, lng: 72.9860 }
  ];

  let map = null;
  let markersLayer = null;
  let cachedLocation = null;
  let currentPurpose = null;

  /* ======================
     UTIL
  ====================== */

  const toRad = deg => (deg * Math.PI) / 180;

  const distanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 🔥 THROTTLE
  const throttle = (fn, delay) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last < delay) return;
      last = now;
      fn(...args);
    };
  };
  const radiusSlider = document.getElementById("radiusSlider");
const radiusValue = document.getElementById("radiusValue");

if (radiusSlider && radiusValue) {
  radiusValue.textContent = radiusSlider.value;

  radiusSlider.addEventListener("input", () => {
    radiusValue.textContent = radiusSlider.value;
  });
}
  /* ======================
     GEOLOCATION (ASYNC)
  ====================== */

  async function getCurrentLocation() {
    if (cachedLocation) return cachedLocation;

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          cachedLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          resolve(cachedLocation);
        },
        reject
      );
    });
  }

  /* ======================
     MAP
  ====================== */

  function ensureMap(center) {
    if (!map) {
      map = L.map("map").setView(center, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      markersLayer = L.layerGroup().addTo(map);
    } else {
      map.setView(center, 13);
      markersLayer.clearLayers();
    }
  }

  /* ======================
     FILTER + SORT (HOF)
  ====================== */

  function processUsers(users, purpose, myLoc, radius, sortType, searchText) {

    return users
      .filter(u => u.purpose === purpose)
      .map(u => ({
        ...u,
        dist: distanceKm(myLoc.lat, myLoc.lng, u.lat, u.lng)
      }))
      .filter(u =>
        u.dist <= radius &&
        u.name.toLowerCase().includes(searchText)
      )
      .sort((a, b) =>
        sortType === "distance"
          ? a.dist - b.dist
          : a.name.localeCompare(b.name)
      );
  }

  /* ======================
     RENDER
  ====================== */

  function renderNearby(purpose, myLoc, radius, users) {

    const section = document.getElementById("nearbySection");
    const title = document.getElementById("nearbyTitle");
    const meta = document.getElementById("nearbyMeta");
    const list = document.getElementById("nearbyList");

    section.style.display = "grid";
    title.textContent = `Nearby for: ${purpose}`;
    let activityText = "";

const activity = JSON.parse(localStorage.getItem("connecthub_activity"));
if (activity) {
  activityText = ` • Last: ${activity.action} by ${activity.user}`;
}

meta.textContent = `Radius: ${radius} km • Found: ${users.length}${activityText}`;
    list.innerHTML = "";

    ensureMap([myLoc.lat, myLoc.lng]);

    L.marker([myLoc.lat, myLoc.lng])
      .addTo(markersLayer)
      .bindPopup("You");

    if (!users.length) {
      list.innerHTML = `<li>No users found</li>`;
      return;
    }

    users.forEach((u) => {
      const marker = L.marker([u.lat, u.lng])
        .addTo(markersLayer)
        .bindPopup(`<b>${u.name}</b><br>${u.dist.toFixed(2)} km`);

      const li = document.createElement("li");
      li.className = "nearby-item";
      let savedProfiles = JSON.parse(localStorage.getItem("connecthub_saved_profiles")) || [];
const isSaved = savedProfiles.some(s => s.name === u.name);

li.innerHTML = `
  <div>
    <strong>${u.name}</strong>
    <span class="chip">${u.dist.toFixed(2)} km</span>
  </div>
  <button class="btn btn-small save-btn">
    ${isSaved ? "Saved ✓" : "Save"}
  </button>
`;
 const saveBtn = li.querySelector(".save-btn");

saveBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  let savedProfiles = JSON.parse(localStorage.getItem("connecthub_saved_profiles")) || [];

  const index = savedProfiles.findIndex(s => s.name === u.name);

  if (index !== -1) {
    // ❌ Remove
    savedProfiles.splice(index, 1);
    saveBtn.textContent = "Save";
  } else {
    // ✅ Save with extra data
    savedProfiles.push({
      ...u,
      savedAt: new Date().toLocaleString(),
      note: ""
    });
    saveBtn.textContent = "Saved ✓";
  }
  console.log("Saved Profiles:", savedProfiles);
  localStorage.setItem("connecthub_saved_profiles", JSON.stringify(savedProfiles));
  loadSavedProfiles();
});
      li.onclick = () => {
        map.setView([u.lat, u.lng], 15);
        marker.openPopup();
      };

      list.appendChild(li);
    });
  }

  /* ======================
     UPDATE UI (NEW)
  ====================== */

  function updateUI() {
    if (!currentPurpose || !cachedLocation) return;

    const radius = parseFloat(document.getElementById("radiusSlider").value);
    const sortType = document.getElementById("sortOption").value;
    const searchText = document.getElementById("searchInput").value.toLowerCase();

    const users = processUsers(
      USERS,
      currentPurpose,
      cachedLocation,
      radius,
      sortType,
      searchText
    );

    renderNearby(currentPurpose, cachedLocation, radius, users);
  }

  /* ======================
     EVENTS
  ====================== */

  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const purpose = card.getAttribute("data-purpose");

      try {
        const myLoc = await getCurrentLocation();

        currentPurpose = purpose;

        const radius = parseFloat(document.getElementById("radiusSlider").value) || 25;
        const sortType = document.getElementById("sortOption").value || "distance";
        const searchText = document.getElementById("searchInput").value.toLowerCase();

        const users = processUsers(
          USERS,
          purpose,
          myLoc,
          radius,
          sortType,
          searchText
        );

        renderNearby(purpose, myLoc, radius, users);

        document.getElementById("nearbySection").scrollIntoView({
          behavior: "smooth",
        });

      } catch {
        showToast("Allow location access");
      }
    });
  });

  // 🔥 LIVE UPDATES
  document.getElementById("radiusSlider")
    ?.addEventListener("input", throttle(updateUI, 300));

  document.getElementById("sortOption")
    ?.addEventListener("change", updateUI);

  document.getElementById("searchInput")
    ?.addEventListener("input", throttle(updateUI, 300));


// 🔥 ADD YOUR FUNCTION HERE 👇
function loadSavedProfiles() {
  const list = document.getElementById("savedProfilesList");
  if (!list) return;

  let savedProfiles = JSON.parse(localStorage.getItem("connecthub_saved_profiles")) || [];

  list.innerHTML = "";

  if (!savedProfiles.length) {
    list.innerHTML = "<li>No saved profiles yet</li>";
    return;
  }

  savedProfiles.forEach((profile, index) => {
    const li = document.createElement("li");
    li.className = "nearby-item";

    li.innerHTML = `
      <div>
        <strong>${profile.name}</strong>
        <div style="font-size:12px; opacity:0.7;">
          Saved: ${profile.savedAt}
        </div>
        <input 
          type="text" 
          placeholder="Add note..." 
          value="${profile.note || ""}" 
          class="note-input"
        />
      </div>

      <button class="btn btn-small remove-btn">Remove</button>
    `;

    const input = li.querySelector(".note-input");
    input.addEventListener("input", () => {
      savedProfiles[index].note = input.value;

      localStorage.setItem(
        "connecthub_saved_profiles",
        JSON.stringify(savedProfiles)
      );
    });

    li.querySelector(".remove-btn").addEventListener("click", () => {
      savedProfiles.splice(index, 1);

      localStorage.setItem(
        "connecthub_saved_profiles",
        JSON.stringify(savedProfiles)
      );

      loadSavedProfiles();
    });

    list.appendChild(li);
  });
}

// 🔥 CALL FUNCTION
loadSavedProfiles();
// =====================
// 📤 EXPORT JSON
// =====================
const exportBtn = document.getElementById("exportBtn");

exportBtn?.addEventListener("click", () => {
  const data = localStorage.getItem("connecthub_saved_profiles");

  if (!data) {
    showToast("No saved profiles to export!");
    return;
  }

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "saved_profiles.json";
  a.click();

  URL.revokeObjectURL(url);
});

// =====================
// 📥 IMPORT JSON
// =====================
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

importBtn?.addEventListener("click", () => {
  importFile.click();
});

importFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);

      if (!Array.isArray(data)) {
        showToast("Invalid JSON format!");
        return;
      }

      localStorage.setItem(
        "connecthub_saved_profiles",
        JSON.stringify(data)
      );

      showToast("Profiles imported successfully ✅");
      loadSavedProfiles();

    } catch {
      showToast("Error reading JSON file ❌");
    }
  };

  reader.readAsText(file);
});
})();

/* =========================
   LOGIN PAGE: Validation + Closure Session
========================= */
(function () {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const justSignedUp = localStorage.getItem("justSignedUp");

if (justSignedUp === "true") {

  // 🔹 Get latest signed-up user
  const users = JSON.parse(localStorage.getItem("connecthub_users")) || [];
  const lastUser = users[users.length - 1]; // most recent user

  function showUser() {
    showToast("Hello " + this.name);
  }

  const boundFn = showUser.bind(lastUser);
  boundFn();

  localStorage.removeItem("justSignedUp");
}

  const emailEl = document.getElementById("li_email");
  const passwordEl = document.getElementById("li_password");
  const emailError = document.getElementById("liEmailError");
  const passwordError = document.getElementById("liPasswordError");
  const loginStatus = document.getElementById("loginStatus");

  if (!emailEl || !passwordEl || !emailError || !passwordError || !loginStatus) return;

  function createSessionManager() {
    let currentUser = null;
    let loginCount = 0;

    return {
      login(email) {
        currentUser = email;
        loginCount++;
      },
      getUser() {
        return currentUser;
      },
      getLoginCount() {
        return loginCount;
      },
      isLoggedIn() {
        return currentUser !== null;
      },
    };
  }

  const sessionManager = createSessionManager();

  function showError(input, errorEl, message) {
    input.classList.add("input-error");
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove("input-error");
    errorEl.textContent = "";
  }

  function validateEmail() {
    if (emailEl.validity.valueMissing) {
      showError(emailEl, emailError, "Email is required.");
      return false;
    }

    if (emailEl.validity.typeMismatch) {
      showError(emailEl, emailError, "Enter a valid email address.");
      return false;
    }

    clearError(emailEl, emailError);
    return true;
  }

  function validatePassword() {
    if (passwordEl.validity.valueMissing) {
      showError(passwordEl, passwordError, "Password is required.");
      return false;
    }

    if (passwordEl.validity.tooShort) {
      showError(passwordEl, passwordError, "Password must be at least 8 characters.");
      return false;
    }

    if (passwordEl.validity.patternMismatch) {
      showError(passwordEl, passwordError, "Password must contain at least 1 special character.");
      return false;
    }

    clearError(passwordEl, passwordError);
    return true;
  }

  emailEl.addEventListener("input", validateEmail);
  passwordEl.addEventListener("input", validatePassword);
  emailEl.addEventListener("blur", validateEmail);
  passwordEl.addEventListener("blur", validatePassword);

  loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailOk = validateEmail();
  const passwordOk = validatePassword();

  if (!emailOk || !passwordOk) {
    loginStatus.textContent = "Fix errors before login.";
    return;
  }

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  // 🔹 Get users
  const users = JSON.parse(localStorage.getItem("connecthub_users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    loginStatus.textContent = "Invalid email or password ❌";
    return;
  }
  // JSON "replace" (update user)
user.lastLogin = new Date().toLocaleString();
user.loginCount = (user.loginCount || 0) + 1;

// Save updated users
localStorage.setItem("connecthub_users", JSON.stringify(users));

// Activity log
const activity = {
  action: "login",
  user: user.name,
  email: user.email,
  time: new Date().toLocaleString()
};

localStorage.setItem("connecthub_activity", JSON.stringify(activity));
  // 🔹 Save session
  localStorage.setItem("connecthub_current_user", JSON.stringify(user));

  sessionManager.login(email);

  loginStatus.textContent = `Welcome ${user.name} 🎉 Redirecting...`;

  setTimeout(() => {
    window.location.href = "dashboard.html"; // or dashboard
  }, 1200);
});
})();

/* =========================
   SIGNUP PAGE: Validation + Closure Tracker
========================= */
(function () {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;

  const nameEl = document.getElementById("su_name");
  const emailEl = document.getElementById("su_email");
  const passwordEl = document.getElementById("su_password");
  const countryEl = document.getElementById("su_country");
  const genderEls = document.querySelectorAll('input[name="gender"]');

  const nameError = document.getElementById("suNameError");
  const emailError = document.getElementById("suEmailError");
  const passwordError = document.getElementById("suPasswordError");
  const genderError = document.getElementById("suGenderError");
  const countryError = document.getElementById("suCountryError");
  const signupStatus = document.getElementById("signupStatus");

  if (
    !nameEl ||
    !emailEl ||
    !passwordEl ||
    !countryEl ||
    !nameError ||
    !emailError ||
    !passwordError ||
    !genderError ||
    !countryError ||
    !signupStatus
  ) {
    return;
  }

  function createSignupTracker() {
    let signupCount = 0;
    return {
      increment() {
        signupCount++;
      },
      getCount() {
        return signupCount;
      },
    };
  }

  const signupTracker = createSignupTracker();

  function showError(input, errorEl, message) {
    if (input) input.classList.add("input-error");
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove("input-error");
    errorEl.textContent = "";
  }

  function validateName() {
    if (nameEl.validity.valueMissing) {
      showError(nameEl, nameError, "Full name is required.");
      return false;
    }
    if (nameEl.validity.tooShort) {
      showError(nameEl, nameError, "Full name must be at least 2 characters.");
      return false;
    }
    if (nameEl.validity.tooLong) {
      showError(nameEl, nameError, "Full name must be under 50 characters.");
      return false;
    }
    if (nameEl.validity.patternMismatch) {
      showError(nameEl, nameError, "Use only letters and spaces (.'- allowed).");
      return false;
    }

    clearError(nameEl, nameError);
    return true;
  }

  function validateEmail() {
    if (emailEl.validity.valueMissing) {
      showError(emailEl, emailError, "Email is required.");
      return false;
    }
    if (emailEl.validity.typeMismatch) {
      showError(emailEl, emailError, "Enter a valid email address.");
      return false;
    }

    clearError(emailEl, emailError);
    return true;
  }

  function validatePassword() {
    if (passwordEl.validity.valueMissing) {
      showError(passwordEl, passwordError, "Password is required.");
      return false;
    }
    if (passwordEl.validity.tooShort) {
      showError(passwordEl, passwordError, "Password must be at least 8 characters.");
      return false;
    }
    if (passwordEl.validity.patternMismatch) {
      showError(passwordEl, passwordError, "Password must contain at least 1 special character.");
      return false;
    }

    clearError(passwordEl, passwordError);
    return true;
  }

  function validateGender() {
    const checked = Array.from(genderEls).some((radio) => radio.checked);
    if (!checked) {
      genderError.textContent = "Please select a gender.";
      return false;
    }

    genderError.textContent = "";
    return true;
  }

  function validateCountry() {
    if (!countryEl.value) {
      showError(countryEl, countryError, "Please select your country.");
      return false;
    }

    clearError(countryEl, countryError);
    return true;
  }

  nameEl.addEventListener("input", validateName);
  emailEl.addEventListener("input", validateEmail);
  passwordEl.addEventListener("input", validatePassword);
  countryEl.addEventListener("change", validateCountry);
  genderEls.forEach((radio) => radio.addEventListener("change", validateGender));

  nameEl.addEventListener("blur", validateName);
  emailEl.addEventListener("blur", validateEmail);
  passwordEl.addEventListener("blur", validatePassword);

  signupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  signupTracker.increment();

  const nameOk = validateName();
  const emailOk = validateEmail();
  const passwordOk = validatePassword();
  const genderOk = validateGender();
  const countryOk = validateCountry();

  if (!(nameOk && emailOk && passwordOk && genderOk && countryOk)) {
    signupStatus.textContent = `Fix errors before signup. Attempt: ${signupTracker.getCount()}`;
    return;
  }

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passwordEl.value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const country = countryEl.value;

  // 🔹 Get users
  let users = JSON.parse(localStorage.getItem("connecthub_users")) || [];

  // 🔹 Check duplicate
  const exists = users.find((u) => u.email === email);
  if (exists) {
    emailError.textContent = "Email already registered!";
    return;
  }

  // 🔹 Save user
  const newUser = { name, email, password, gender, country };
  users.push(newUser);

  localStorage.setItem("connecthub_users", JSON.stringify(users));
  // JSON.stringify (activity log)
const activity = {
  action: "signup",
  user: name,
  email: email,
  time: new Date().toLocaleString()
};

localStorage.setItem("connecthub_activity", JSON.stringify(activity));

  signupStatus.textContent = "Signup successful 🎉 Redirecting...";
  localStorage.setItem("connecthub_current_user", JSON.stringify(newUser));
window.location.href = "dashboard.html";
  signupStatus.style.color = "lightgreen";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
});
})();

/* =========================
   CONTACT PAGE: HQ MAP + Custom Marker
========================= */
(function () {
  const mapEl = document.getElementById("map");
  const showHqBtn = document.getElementById("showHqBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusText = document.getElementById("statusText");

  if (!mapEl || !showHqBtn || !resetBtn || !statusText) return;
  if (typeof L === "undefined") {
    console.warn("Leaflet not loaded. Add leaflet.js before script.js.");
    return;
  }

  const HQ_LOCATION = [19.0760, 72.8777];
  const DEFAULT_ZOOM = 12;
  const HQ_ZOOM = 16;

  const map = L.map("map", { scrollWheelZoom: false }).setView(HQ_LOCATION, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let hqMarker = null;

  function setStatus(message) {
    statusText.textContent = message;
  }

  function clearMarker() {
    if (hqMarker) {
      map.removeLayer(hqMarker);
      hqMarker = null;
    }
  }

  const customHqIcon = L.divIcon({
    className: "",
    html: `<div class="hq-marker"></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -36],
  });

  function showHeadquarters() {
    clearMarker();

    hqMarker = L.marker(HQ_LOCATION, { icon: customHqIcon })
      .addTo(map)
      .bindPopup("<b>ConnectHub Headquarters</b><br>Mumbai Office")
      .openPopup();

    map.setView(HQ_LOCATION, HQ_ZOOM);
    setStatus("Headquarters location displayed on map.");
  }

  showHqBtn.addEventListener("click", showHeadquarters);

  resetBtn.addEventListener("click", () => {
    clearMarker();
    map.setView(HQ_LOCATION, DEFAULT_ZOOM);
    setStatus('Map reset. Click "Show Headquarters" again.');
  });

  showHeadquarters();
})();
/* =========================
   HOME PAGE: User Personalization + Session
========================= */
(function () {
  const navLinks = document.querySelector(".nav-links");
  const joinForm = document.getElementById("joinForm");

  // 🔹 Get logged-in user
  const currentUser = JSON.parse(localStorage.getItem("connecthub_current_user"));

  if (!currentUser) return;

  // 🔥 1. Smart redirect (optional)
  if (window.location.pathname.includes("index.html")) {
    console.log("User already logged in:", currentUser.email);
  }

  // 🔥 2. Update navbar
  if (navLinks) {
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const signupLink = navLinks.querySelector('a[href="signup.html"]');

    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";

    const userEl = document.createElement("span");
    userEl.textContent = ` ${currentUser.name}`;
    userEl.className = "nav-user";

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.className = "btn btn-small";

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("connecthub_current_user");
      location.reload();
    });

    navLinks.appendChild(userEl);
    navLinks.appendChild(logoutBtn);
  }

  // 🔥 3. Auto-fill join form
  if (joinForm) {
    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    if (nameInput) nameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;
  }

  // 🔥 4. Dynamic greeting
  const heroText = document.querySelector(".hero-inner h2");

  if (heroText) {
    heroText.innerHTML = `Welcome back, ${currentUser.name} <br/>Continue your journey`;
  }
})();
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 500);
  }

  // Staggered entrance for cards
  const cards = document.querySelectorAll(
    ".purpose-card, .about-card, .stat-card, .purpose-card-img, .glass"
  );
  cards.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "";
        el.style.transform = "";
      });
    });
  });
});
(function () {
  if (!window.location.pathname.includes("dashboard.html")) return;

  const user = JSON.parse(localStorage.getItem("connecthub_current_user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const saved =
    JSON.parse(localStorage.getItem("connecthub_saved_profiles")) || [];

  document.getElementById("welcomeText").textContent =
    "Welcome, " + user.name;

  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("lastLogin").textContent =
    user.lastLogin || "First Login";

  document.getElementById("loginCount").textContent =
    user.loginCount || 1;

  document.getElementById("savedCount").textContent = saved.length;

  const list = document.getElementById("savedList");

  if (!saved.length) {
    list.innerHTML = "<p>No saved profiles</p>";
    return;
  }

  saved.forEach((p) => {
    const div = document.createElement("div");
    div.className = "saved-item";
    div.innerHTML = `<strong>${p.name}</strong>`;
    list.appendChild(div);
  });

  // 🔥 LOGOUT
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("connecthub_current_user");
    window.location.href = "login.html";
  });

})();
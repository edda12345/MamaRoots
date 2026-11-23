const STORAGE_KEY = "mamaroots_v1_state";

const defaultState = {
  profile: {
    name: "Mama",
    week: 20,
    location: "Kuching, Malaysia",
    height: 158,
    weight: 55,
    lifestyle: "Asian Lifestyle",
    allergies: []
  },
  mood: {
    label: "Cozy",
    emote: "🥰"
  },
  totals: {
    calories: 0,
    protein: 0,
    folate: 0,
    iron: 0
  },
  meals: [],
  selectedFilter: "All",
  posts: [
    {
      author: "Aisyah • Kuching",
      region: "Malaysia / Asian",
      text: "Week 22! My grandma reminded me to keep cooling vs. warming foods balanced and pair spinach soup with vitamin C citrus for better iron absorption.",
      time: "18m ago"
    },
    {
      author: "Hannah • Seattle",
      region: "Western / Global",
      text: "First-time mom at Week 14—swapped out my regular facial serum for pregnancy-safe gentle cleansers and added Greek yogurt + berries for breakfast.",
      time: "1h ago"
    },
    {
      author: "Mei Ling • Singapore / London",
      region: "Blended Roots",
      text: "Blending our family's warm herbal broths with my OB's iron & folate checklist makes Week 28 feel way less stressful.",
      time: "3h ago"
    }
  ]
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: {
        ...defaultState.profile,
        ...(parsed.profile || {})
      },
      mood: {
        ...defaultState.mood,
        ...(parsed.mood || {})
      },
      totals: {
        ...defaultState.totals,
        ...(parsed.totals || {})
      },
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : defaultState.posts
    };
  } catch (err) {
    return structuredClone(defaultState);
  }
}

const state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore storage quota issues in restricted browsing modes
  }
}

const targets = {
  calories: 2200,
  protein: 75,
  folate: 600,
  iron: 27
};

const foodDictionary = [
  { keywords: ["chicken", "ayam", "breast"], calories: 260, protein: 34, folate: 12, iron: 1.5 },
  { keywords: ["rice", "nasi", "brown rice"], calories: 210, protein: 5, folate: 15, iron: 0.8 },
  { keywords: ["spinach", "bayam", "greens", "veggie", "vegetable", "salad"], calories: 65, protein: 4, folate: 140, iron: 3.6 },
  { keywords: ["egg", "telur"], calories: 145, protein: 12, folate: 44, iron: 1.8 },
  { keywords: ["fish", "ikan", "salmon", "sardine"], calories: 230, protein: 26, folate: 25, iron: 1.4 },
  { keywords: ["soup", "broth", "sup"], calories: 120, protein: 8, folate: 55, iron: 2.0 },
  { keywords: ["fruit", "banana", "apple", "orange", "berry", "berries", "avocado"], calories: 130, protein: 2, folate: 65, iron: 0.9 },
  { keywords: ["milk", "yogurt", "cheese", "dairy", "susu"], calories: 150, protein: 9, folate: 18, iron: 0.3 },
  { keywords: ["tofu", "tauhu", "lentil", "bean", "kacang"], calories: 165, protein: 14, folate: 110, iron: 3.2 },
  { keywords: ["shrimp", "prawn", "udang", "crab", "shellfish"], calories: 175, protein: 24, folate: 15, iron: 1.6 },
  { keywords: ["peanut", "almond", "nut", "kacang tanah"], calories: 180, protein: 6, folate: 45, iron: 1.1 }
];

const culturalGuides = {
  "Asian Lifestyle": {
    subtitle: "Pantang larang wisdom, fun safety facts, and everyday nourishment for Asian & Malaysian mamas.",
    cards: [
      {
        title: "✨ Fun Fact! Prohibited / Cautionary Skincare",
        body: "Skincare containing retinoids (retinol, tretinoin, adapalene), high-strength salicylic acid/peels, or hydroquinone is generally avoided or restricted during pregnancy because absorbed actives can pose developmental concerns or trigger stubborn pigmentation patches. Swap to gentle hydrating cleansers, ceramides, and pregnancy-safe sun protection."
      },
      {
        title: "🍣 Fun Fact! Raw Fish, Sushi & Raw Foods",
        body: "Raw fish like sushi, sashimi, or raw oysters/shellfish can carry parasites or bacteria (such as Listeria or Vibrio) that are riskier during pregnancy due to natural immune shifts. Cooked fish, steamed dishes, and pasteurized ingredients give you protein and omega-3s safely."
      },
      {
        title: "🌿 Pantang Larang & Cooling/Warming Balance",
        body: "In Asian traditions, elders often warn against excessive 'cooling' items (like lots of coconut water, icy drinks, or certain gourds) or unverified jamu/herbs. Use pantang larang as cultural context while confirming ingredients and herbal remedies with your OB or doctor."
      }
    ]
  },
  "Western Lifestyle": {
    subtitle: "Evidence-based prenatal nutrition plus fun safety facts on skincare and everyday foods.",
    cards: [
      {
        title: "✨ Fun Fact! Skincare Ingredients to Skip",
        body: "Retinoids (retinol/retin-A) and high-dose oral/topical actives are typically flagged as off-limits during pregnancy, while heavy chemical peels or unverified brightening serums warrant an OB check. Stick to simple, fragrance-gentle basics."
      },
      {
        title: "🍣 Fun Fact! Why Sushi & Deli Items Need Care",
        body: "Raw fish (sushi/sashimi), raw cookie dough/eggs, unpasteurized soft cheeses, and deli meats can harbor bacteria like Listeria or Salmonella, which can cause severe illness during pregnancy. Fully cooked seafood and pasteurized dairy are safer bets."
      },
      {
        title: "🥗 Core Plate & Steady Habits",
        body: "Focus on folate, iron, calcium, and low-mercury cooked fish alongside hydration and gentle daily movement."
      }
    ]
  },
  "Blended Roots": {
    subtitle: "Bridging family traditions across regions with clear fun facts and practical safety.",
    cards: [
      {
        title: "✨ Fun Fact! Skincare Check Across Routines",
        body: "Whether you follow K-beauty, J-beauty, or Western routines, watch out for retinol/retinoids, strong exfoliating acids, or unverified whitening creams during pregnancy—opt for gentle barrier care instead."
      },
      {
        title: "🍣 Fun Fact! Raw Sushi & Undercooked Dishes",
        body: "Raw sushi, sashimi, raw shellfish, and runny/raw eggs carry higher foodborne illness risks (like parasites, Listeria, or Salmonella) during pregnancy. Thoroughly cooked meals keep cravings safer."
      },
      {
        title: "🌏 Honoring Heritage Safely",
        body: "Keep meaningful family traditions—like warm soups or cultural celebrations—while filtering advice through food safety, allergies, and your care provider's guidance."
      }
    ]
  }
};

// DOM Elements
const navButtons = document.querySelectorAll(".nav-btn");
const tabViews = document.querySelectorAll(".tab-view");
const openGuideBtn = document.getElementById("openGuideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const culturalGuideModal = document.getElementById("culturalGuideModal");
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const moodButtons = document.querySelectorAll(".mood-btn");
const quickChips = document.querySelectorAll(".quick-chip");
const logMealBtn = document.getElementById("logMealBtn");
const resetMealsBtn = document.getElementById("resetMealsBtn");
const mealTextInput = document.getElementById("mealTextInput");
const mealPhotoInput = document.getElementById("mealPhotoInput");
const photoFileName = document.getElementById("photoFileName");
const photoPreviewWrap = document.getElementById("photoPreviewWrap");
const photoPreviewImg = document.getElementById("photoPreviewImg");
const profileForm = document.getElementById("profileForm");
const publishPostBtn = document.getElementById("publishPostBtn");
const postInput = document.getElementById("postInput");
const postRegionSelect = document.getElementById("postRegionSelect");
const filterChips = document.querySelectorAll(".filter-chip");
const emoteToast = document.getElementById("emoteToast");
const emoteIcon = document.getElementById("emoteIcon");
const emoteText = document.getElementById("emoteText");

let emoteTimer = null;
function triggerEmote(icon, text) {
  emoteIcon.textContent = icon;
  emoteText.textContent = text;
  emoteToast.classList.remove("hidden");
  clearTimeout(emoteTimer);
  emoteTimer = setTimeout(() => {
    emoteToast.classList.add("hidden");
  }, 1600);
}

// Tab Navigation
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    tabViews.forEach((view) => {
      view.classList.toggle("active", view.id === targetId);
    });

    const icon = btn.querySelector(".nav-icon")?.textContent.trim() || "💗";
    const label = btn.querySelector("span:last-child")?.textContent.trim() || "Tab";
    triggerEmote(icon, label);
  });
});

// Week Stepper Controls
function updateWeek(newWeek) {
  const clamped = Math.min(42, Math.max(1, newWeek));
  if (clamped === state.profile.week) return;
  const directionEmote = clamped > state.profile.week ? "🌱" : "🔙";
  state.profile.week = clamped;
  document.getElementById("profWeek").value = clamped;
  saveState();
  renderTracker();
  triggerEmote(directionEmote, `Week ${clamped}`);
}

prevWeekBtn.addEventListener("click", () => updateWeek(state.profile.week - 1));
nextWeekBtn.addEventListener("click", () => updateWeek(state.profile.week + 1));

// Mood Check-In Controls
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const moodLabel = btn.dataset.mood;
    const moodEmote = btn.dataset.emote || "🥰";
    state.mood = { label: moodLabel, emote: moodEmote };
    saveState();
    renderMood();
    renderAdvice();
    triggerEmote(moodEmote, `Feeling ${moodLabel}`);
  });
});

// Hidden Cultural Guide Modal Controls
openGuideBtn.addEventListener("click", () => {
  renderCulturalGuide();
  culturalGuideModal.classList.remove("hidden");
  triggerEmote("🌿", "Cultural Guide");
});

closeGuideBtn.addEventListener("click", () => {
  culturalGuideModal.classList.add("hidden");
});

culturalGuideModal.addEventListener("click", (e) => {
  if (e.target === culturalGuideModal) {
    culturalGuideModal.classList.add("hidden");
  }
});

// Quick Meal Chips
quickChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    mealTextInput.value = chip.dataset.meal;
    triggerEmote("🍽️", "Added to input");
  });
});

// Photo Upload Preview
mealPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    photoFileName.textContent = "No photo selected";
    photoPreviewWrap.classList.add("hidden");
    return;
  }
  photoFileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    photoPreviewImg.src = reader.result;
    photoPreviewWrap.classList.remove("hidden");
    triggerEmote("📷", "Photo ready");
  };
  reader.readAsDataURL(file);
});

// Meal Estimation + Allergy Check
function estimateMeal(text, hasPhoto) {
  const cleaned = text.trim().toLowerCase();
  let calories = 0;
  let protein = 0;
  let folate = 0;
  let iron = 0;
  let matchedAny = false;

  foodDictionary.forEach((item) => {
    if (item.keywords.some((kw) => cleaned.includes(kw))) {
      calories += item.calories;
      protein += item.protein;
      folate += item.folate;
      iron += item.iron;
      matchedAny = true;
    }
  });

  if (!matchedAny) {
    calories = hasPhoto ? 340 : 280;
    protein = hasPhoto ? 16 : 12;
    folate = hasPhoto ? 85 : 60;
    iron = hasPhoto ? 2.4 : 1.8;
  }

  return { calories, protein, folate, iron };
}

function checkAllergies(text) {
  const lower = text.toLowerCase();
  return state.profile.allergies.filter((allergy) => allergy && lower.includes(allergy.toLowerCase()));
}

logMealBtn.addEventListener("click", () => {
  const rawText = mealTextInput.value.trim();
  const hasPhoto = Boolean(mealPhotoInput.files && mealPhotoInput.files[0]);

  if (!rawText && !hasPhoto) {
    alert("Please type what you ate, tap a quick chip, or upload a meal photo first.");
    return;
  }

  const label = rawText || `Photo Meal (${mealPhotoInput.files[0].name})`;
  const matchedAllergies = checkAllergies(label);
  const allergyBox = document.getElementById("allergyAlertBox");

  if (matchedAllergies.length > 0) {
    allergyBox.textContent = `⚠️ Allergy Alert: "${label}" may match your profile allergy (${matchedAllergies.join(", ")}). Double-check ingredients before eating!`;
    allergyBox.classList.remove("hidden");
    triggerEmote("⚠️", "Allergy match!");
  } else {
    allergyBox.classList.add("hidden");
    triggerEmote("🥗", "Meal logged!");
  }

  const est = estimateMeal(label, hasPhoto);
  state.totals.calories += est.calories;
  state.totals.protein += est.protein;
  state.totals.folate += est.folate;
  state.totals.iron = Number((state.totals.iron + est.iron).toFixed(1));

  state.meals.unshift({
    label,
    hasPhoto,
    ...est,
    time: "Just now"
  });

  mealTextInput.value = "";
  mealPhotoInput.value = "";
  photoFileName.textContent = "No photo selected";
  photoPreviewWrap.classList.add("hidden");

  saveState();
  renderTracker();
});

resetMealsBtn.addEventListener("click", () => {
  state.totals = { calories: 0, protein: 0, folate: 0, iron: 0 };
  state.meals = [];
  document.getElementById("allergyAlertBox").classList.add("hidden");
  saveState();
  renderTracker();
  triggerEmote("🔄", "Meals reset");
});

// Profile Save
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const weekNum = Math.min(42, Math.max(1, parseInt(document.getElementById("profWeek").value, 10) || 20));
  const heightNum = parseInt(document.getElementById("profHeight").value, 10) || 158;
  const weightNum = parseInt(document.getElementById("profWeight").value, 10) || 55;
  const rawAllergies = document.getElementById("profAllergies").value;

  state.profile = {
    name: document.getElementById("profName").value.trim() || "Mama",
    week: weekNum,
    location: document.getElementById("profLocation").value.trim() || "Kuching, Malaysia",
    height: heightNum,
    weight: weightNum,
    lifestyle: document.getElementById("profLifestyle").value,
    allergies: rawAllergies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  };

  const saveMsg = document.getElementById("saveStatusMsg");
  saveMsg.classList.remove("hidden");
  setTimeout(() => saveMsg.classList.add("hidden"), 2500);

  saveState();
  renderAll();
  triggerEmote("💖", "Profile saved!");
});

// Discover Feed Filters & New Post
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.selectedFilter = chip.dataset.filter;
    saveState();
    renderFeed();
    triggerEmote("🌍", chip.textContent.trim());
  });
});

publishPostBtn.addEventListener("click", () => {
  const text = postInput.value.trim();
  if (!text) return;

  state.posts.unshift({
    author: `${state.profile.name} • ${state.profile.location}`,
    region: postRegionSelect.value,
    text,
    time: "Just now"
  });

  postInput.value = "";
  saveState();
  renderFeed();
  triggerEmote("✨", "Posted to feed!");
});

// Growth Phase Visual & Milestone Helper
function getGrowthStage(week) {
  if (week <= 13) {
    return {
      trimester: "1st Trimester",
      sizeLabel: week <= 6 ? "🌱 Tiny sprout" : week <= 9 ? "🫐 Blueberry / grape" : "🍋 Lemon / plum",
      milestone: "Early foundations are forming—focus on folate, gentle hydration, and rest when nausea or fatigue hits.",
      svg: `
        <svg viewBox="0 0 100 100" width="84" height="84">
          <circle cx="50" cy="50" r="38" fill="#ffe6ef" stroke="#f2b8ce" stroke-width="2" stroke-dasharray="4 3"/>
          <ellipse cx="50" cy="52" rx="18" ry="22" fill="#e86c96"/>
          <circle cx="45" cy="46" r="3" fill="#fff"/>
          <path d="M46 58 Q50 62 54 58" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
      `
    };
  }
  if (week <= 27) {
    return {
      trimester: "2nd Trimester",
      sizeLabel: week <= 18 ? "🥑 Avocado" : week <= 22 ? "🍌 Banana" : "🥭 Mango / papaya",
      milestone: "Baby is growing steadily and becoming more responsive to movement and sound—great time to prioritize iron, calcium, and protein.",
      svg: `
        <svg viewBox="0 0 100 100" width="88" height="88">
          <circle cx="50" cy="50" r="41" fill="#ffeaf1" stroke="#ee9ab9" stroke-width="2"/>
          <circle cx="50" cy="39" r="15" fill="#f3a6be"/>
          <ellipse cx="50" cy="64" rx="17" ry="15" fill="#e5779d"/>
          <circle cx="45" cy="37" r="2.2" fill="#3a1c28"/>
          <circle cx="55" cy="37" r="2.2" fill="#3a1c28"/>
          <path d="M47 43 Q50 46 53 43" stroke="#9e2f55" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="41" cy="42" r="2.5" fill="#d94e7d" opacity="0.55"/>
          <circle cx="59" cy="42" r="2.5" fill="#d94e7d" opacity="0.55"/>
        </svg>
      `
    };
  }
  return {
    trimester: "3rd Trimester",
    sizeLabel: week <= 33 ? "🍍 Pineapple" : "🍉 Small watermelon",
    milestone: "Final stretch of rapid growth—keep meals lighter and more frequent, stay hydrated, and pace your daily rest.",
    svg: `
      <svg viewBox="0 0 100 100" width="92" height="92">
        <circle cx="50" cy="50" r="43" fill="#ffe3ed" stroke="#c94b76" stroke-width="2.2"/>
        <circle cx="50" cy="37" r="17" fill="#f4a8bf"/>
        <ellipse cx="50" cy="65" rx="20" ry="16" fill="#df6892"/>
        <circle cx="44" cy="35" r="2.4" fill="#3a1c28"/>
        <circle cx="56" cy="35" r="2.4" fill="#3a1c28"/>
        <path d="M46 42 Q50 46 54 42" stroke="#9e2f55" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M31 61 Q23 55 27 49" stroke="#df6892" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M69 61 Q77 55 73 49" stroke="#df6892" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
    `
  };
}

function renderMood() {
  document.getElementById("activeMoodBadge").textContent = `${state.mood.emote} ${state.mood.label}`;
  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === state.mood.label);
  });
}

function renderAdvice() {
  const eatList = document.getElementById("eatAdviceList");
  const doList = document.getElementById("doAdviceList");

  const allergyNote =
    state.profile.allergies.length > 0
      ? `Avoid anything containing ${state.profile.allergies.join(", ")} and check labels carefully.`
      : "Include a mix of lean protein, leafy greens, and whole grains across your meals.";

  const culturalEatTip =
    state.profile.lifestyle === "Asian Lifestyle"
      ? "Pair iron-rich leafy greens with vitamin C fruit, and keep warm/cooling foods balanced with your comfort."
      : state.profile.lifestyle === "Western Lifestyle"
      ? "Aim for folate, iron, and calcium-rich foods while skipping raw/unpasteurized items and alcohol."
      : "Blend comforting family staples with nutrient-dense greens, proteins, and hydration.";

  const moodEatTip =
    state.mood.label === "Queasy"
      ? "Try smaller, gentle meals or warm broth/crackers rather than an empty stomach."
      : state.mood.label === "Tired"
      ? "Pair iron-rich foods with steady water intake to help combat afternoon fatigue."
      : "Keep snacks colorful with fruit, nuts/seeds (if allergy-safe), or yogurt.";

  const moodDoTip =
    state.mood.label === "Tired"
      ? "Prioritize rest and elevate your feet when possible—skip pushing through heavy exhaustion."
      : state.mood.label === "Queasy"
      ? "Step into fresh air slowly and avoid strong cooking smells if they trigger nausea."
      : "Take a gentle 15–20 minute walk or light stretch if you feel comfortable.";

  eatList.innerHTML = `
    <li>${allergyNote}</li>
    <li>${culturalEatTip}</li>
    <li>${moodEatTip}</li>
  `;

  doList.innerHTML = `
    <li>${moodDoTip}</li>
    <li>Check skincare and supplement labels to make sure ingredients are pregnancy-safe.</li>
    <li>Tap <strong>Cultural Guide & Pantang Larang</strong> above whenever you want regional traditions & context.</li>
  `;
}

function renderTracker() {
  const days = state.profile.week * 7;
  const stage = getGrowthStage(state.profile.week);

  document.getElementById("babyAgeTitle").textContent = `Week ${state.profile.week} • ${days} Days Along`;
  document.getElementById("stepperWeekLabel").textContent = `Week ${state.profile.week}`;
  document.getElementById("trimesterBadge").textContent = stage.trimester;
  document.getElementById("babySizePill").textContent = stage.sizeLabel;
  document.getElementById("babyMilestoneText").textContent = stage.milestone;
  document.getElementById("babyIllustrationBox").innerHTML = stage.svg;

  document.getElementById("calorieSummary").textContent =
    `${state.totals.calories} / ${targets.calories.toLocaleString()} kcal`;
  const pct = Math.min(100, Math.round((state.totals.calories / targets.calories) * 100));
  document.getElementById("calorieBar").style.width = `${pct}%`;

  document.getElementById("proteinVal").textContent = `${state.totals.protein}g / ${targets.protein}g`;
  document.getElementById("folateVal").textContent = `${state.totals.folate} / ${targets.folate}mcg`;
  document.getElementById("ironVal").textContent = `${state.totals.iron} / ${targets.iron}mg`;

  const mealsContainer = document.getElementById("loggedMealsList");
  if (state.meals.length === 0) {
    mealsContainer.innerHTML = `<p class="muted-text small-copy">No meals logged yet today.</p>`;
  } else {
    mealsContainer.innerHTML = state.meals
      .map(
        (m) => `
      <div class="meal-item">
        <div class="meal-item-top">
          <span>${m.hasPhoto ? "📷 " : "✍️ "}${m.label}</span>
          <span>${m.calories} kcal</span>
        </div>
        <div class="meal-item-meta">
          Protein: ${m.protein}g • Folate: ${m.folate}mcg • Iron: ${m.iron}mg • ${m.time}
        </div>
      </div>
    `
      )
      .join("");
  }

  renderMood();
  renderAdvice();
}

function syncProfileInputs() {
  document.getElementById("profName").value = state.profile.name;
  document.getElementById("profWeek").value = state.profile.week;
  document.getElementById("profLocation").value = state.profile.location;
  document.getElementById("profHeight").value = state.profile.height;
  document.getElementById("profWeight").value = state.profile.weight;
  document.getElementById("profLifestyle").value = state.profile.lifestyle;
  document.getElementById("profAllergies").value = state.profile.allergies.join(", ");
}

function renderCulturalGuide() {
  const guide = culturalGuides[state.profile.lifestyle] || culturalGuides["Asian Lifestyle"];
  document.getElementById("guideModalTitle").textContent = `${state.profile.lifestyle} Guide`;
  document.getElementById("guideSubtitle").textContent = guide.subtitle;
  document.getElementById("guideContent").innerHTML = guide.cards
    .map(
      (c) => `
    <div class="guide-card">
      <h4>${c.title}</h4>
      <p>${c.body}</p>
    </div>
  `
    )
    .join("");
}

function renderFeed() {
  const feedList = document.getElementById("feedList");
  const filtered =
    state.selectedFilter === "All"
      ? state.posts
      : state.posts.filter((p) => p.region === state.selectedFilter);

  filterChips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === state.selectedFilter);
  });

  feedList.innerHTML = filtered
    .map(
      (p) => `
    <article class="post-card">
      <div class="post-head">
        <span class="post-author">${p.author}</span>
        <span class="post-tag">${p.region}</span>
      </div>
      <p class="post-body">${p.text}</p>
      <span class="post-time">${p.time}</span>
    </article>
  `
    )
    .join("");
}

function renderAll() {
  document.getElementById("headerLifestylePill").textContent = state.profile.lifestyle;
  syncProfileInputs();
  renderTracker();
  renderFeed();
}

// Initial Render
renderAll();
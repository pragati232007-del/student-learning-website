const initialSubjects = [
  {
    name: "Mathematics",
    icon: "📐",
    chapters: [
      "Goods and Services Tax (GST)", "Banking", "Shares and Dividends",
      "Linear Inequations", "Quadratic Equations", "Ratio and Proportion",
      "Factorisation of Polynomials", "Matrices", "Arithmetic Progression (AP)",
      "Geometric Progression (GP)", "Reflection", "Section and Midpoint Formula",
      "Equation of a Straight Line", "Similarity", "Loci", "Circles",
      "Constructions", "Cylinder, Cone and Sphere", "Trigonometrical Identities",
      "Heights and Distances", "Statistics", "Probability"
    ]
  },
  {
    name: "Physics",
    icon: "⚡",
    chapters: [
      "Force", "Work, Energy and Power", "Machines", "Refraction of Light",
      "Spectrum", "Sound", "Current Electricity", "Household Circuits",
      "Electromagnetism", "Calorimetry", "Radioactivity"
    ]
  },
  {
    name: "Chemistry",
    icon: "🧪",
    chapters: [
      "Periodic Properties", "Chemical Bonding", "Acids, Bases and Salts",
      "Analytical Chemistry", "Mole Concept and Stoichiometry", "Electrolysis",
      "Metallurgy", "Study of Compounds", "Organic Chemistry"
    ]
  },
  {
    name: "Biology",
    icon: "🌿",
    chapters: [
      "Cell Cycle and Cell Division", "Genetics", "Absorption by Roots",
      "Transpiration", "Photosynthesis", "The Circulatory System",
      "The Excretory System", "The Nervous System", "Sense Organs",
      "The Endocrine System", "The Reproductive System", "Population", "Pollution"
    ]
  },
  {
    name: "English Language",
    icon: "✍️",
    chapters: [
      "Composition Writing", "Letter Writing", "Notice and Email Writing",
      "Unseen Comprehension", "Grammar", "Summary Writing"
    ]
  },
  {
    name: "English Literature",
    icon: "📚",
    chapters: ["Prescribed Drama", "Prescribed Prose", "Prescribed Poetry"]
  },
  {
    name: "Hindi",
    icon: "📖",
    chapters: [
      "अपठित गद्यांश", "निबंध लेखन", "पत्र लेखन",
      "व्याकरण", "गद्य पाठ", "कविताएँ"
    ]
  },
  {
    name: "History & Civics",
    icon: "🏛️",
    chapters: [
      "The Union Legislature", "The Union Executive", "The Judiciary",
      "The First War of Independence, 1857", "Growth of Nationalism",
      "First Phase of the National Movement", "Second Phase of the National Movement",
      "The Muslim League", "The Making of the Constitution", "The First World War",
      "Rise of Dictatorships", "The Second World War", "United Nations",
      "Non-Aligned Movement"
    ]
  },
  {
    name: "Geography",
    icon: "🌍",
    chapters: [
      "Topographical Maps", "Map of India", "Climate", "Soil Resources",
      "Natural Vegetation", "Water Resources", "Mineral and Energy Resources",
      "Agriculture", "Manufacturing Industries", "Transport", "Waste Management"
    ]
  },
  {
    name: "Computer Applications",
    icon: "💻",
    chapters: [
      "Introduction to Java", "Objects and Classes", "Data Types and Variables",
      "Operators", "Input in Java", "Conditional Statements", "Loops",
      "Methods", "Constructors", "Arrays", "String Handling"
    ]
  }
];

const $ = (selector) => document.querySelector(selector);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const savedSubjects = readStorage("pratikSubjects", null);
let data = savedSubjects || initialSubjects.map((subject) => ({
  ...subject,
  chapters: subject.chapters.map((name) => ({ name, done: false }))
}));

let tasks = readStorage("pratikTasks", []);
let selectedSubject = null;

function saveSubjects() {
  localStorage.setItem("pratikSubjects", JSON.stringify(data));
}

function saveTasks() {
  localStorage.setItem("pratikTasks", JSON.stringify(tasks));
}

function getAllChapters() {
  return data.flatMap((subject) => subject.chapters);
}

function renderProgress() {
  const chapters = getAllChapters();
  const completed = chapters.filter((chapter) => chapter.done).length;
  const percent = chapters.length
    ? Math.round((completed / chapters.length) * 100)
    : 0;

  $("#overallPercent").textContent = `${percent}%`;
  $("#overallBar").style.width = `${percent}%`;
  $("#overallText").textContent =
    `${completed} of ${chapters.length} chapters completed`;
}

function renderSubjects() {
  const grid = $("#subjectsGrid");
  grid.replaceChildren();

  data.forEach((subject) => {
    const completed = subject.chapters.filter((c) => c.done).length;
    const percent = Math.round(
      (completed / subject.chapters.length) * 100
    );

    const card = document.createElement("button");
    card.type = "button";
    card.className = "subject-card";
    if (selectedSubject === subject.name) card.classList.add("selected");

    const icon = document.createElement("span");
    icon.className = "subject-icon";
    icon.textContent = subject.icon;

    const title = document.createElement("h3");
    title.textContent = subject.name;

    const info = document.createElement("p");
    info.className = "subject-info";
    info.textContent =
      `${completed}/${subject.chapters.length} chapters · ${percent}% complete`;

    const track = document.createElement("div");
    track.className = "track";

    const fill = document.createElement("div");
    fill.className = "fill";
    fill.style.width = `${percent}%`;

    track.append(fill);
    card.append(icon, title, info, track);
    card.addEventListener("click", () => {
      selectedSubject =
        selectedSubject === subject.name ? null : subject.name;
      renderSubjects();
      renderChapterPanel();
    });

    grid.append(card);
  });
}

function renderChapterPanel() {
  const panel = $("#chapterPanel");
  panel.replaceChildren();

  if (!selectedSubject) {
    panel.classList.add("hidden");
    return;
  }

  const subject = data.find((s) => s.name === selectedSubject);
  if (!subject) return;

  panel.classList.remove("hidden");

  const title = document.createElement("h3");
  title.textContent = `${subject.name} — Chapters`;
  panel.append(title);

  subject.chapters.forEach((chapter, index) => {
    const label = document.createElement("label");
    label.className = "chapter-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(chapter.done);

    const text = document.createElement("span");
    text.textContent = chapter.name;
    if (chapter.done) text.classList.add("completed");

    checkbox.addEventListener("change", () => {
      chapter.done = checkbox.checked;
      saveSubjects();
      renderProgress();
      renderSubjects();
      renderChapterPanel();
    });

    label.append(checkbox, text);
    panel.append(label);
  });
}

function renderTasks() {
  const list = $("#taskList");
  list.replaceChildren();

  tasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = "task-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.done);
    checkbox.setAttribute("aria-label", "Mark task completed");

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.done) text.classList.add("completed");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-btn";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    row.append(checkbox, text, remove);
    list.append(row);
  });
}

$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = $("#taskInput");
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    done: false
  });

  saveTasks();
  input.value = "";
  renderTasks();
  input.focus();
});

$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");
  $("#themeBtn").textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";

  localStorage.setItem("pratikTheme", dark ? "dark" : "light");
});

if (localStorage.getItem("pratikTheme") === "dark") {
  document.body.classList.add("dark");
  $("#themeBtn").textContent = "☀️ Light Mode";
}

renderProgress();
renderSubjects();
renderChapterPanel();
renderTasks();
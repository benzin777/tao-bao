const state = {
  config: {
    lesson: "structure",
    level: 1,
    support: "easy",
  },
  task: null,
  messages: [],
  isEvaluating: false,
};

const elements = {
  chat: document.querySelector("#chat"),
  form: document.querySelector("#inputForm"),
  composer: document.querySelector("#composer"),
  sendButton: document.querySelector("#sendButton"),
  apiPill: document.querySelector("#apiPill"),
  subtitle: document.querySelector("#sessionSubtitle"),
  pageDrawer: document.querySelector("#pageDrawer"),
  modeSheet: document.querySelector("#modeSheet"),
  hintSheet: document.querySelector("#hintSheet"),
  scrim: document.querySelector("#scrim"),
  modePreview: document.querySelector("#modePreview"),
  hintCurrent: document.querySelector("#hintCurrent"),
  deviceGroups: document.querySelector("#deviceGroups"),
};

const DEVICE_GROUPS = [
  {
    name: "Cause",
    job: "shows the reason",
    devices: ["because", "since", "as", "due to"],
  },
  {
    name: "Result",
    job: "shows the consequence",
    devices: ["so", "therefore", "thus", "consequently"],
  },
  {
    name: "Contrast",
    job: "sets ideas against each other",
    devices: ["but", "however", "yet", "whereas"],
  },
  {
    name: "Concession",
    job: "admits a point before turning",
    devices: ["although", "even though", "despite", "nevertheless"],
  },
  {
    name: "Condition",
    job: "makes one idea depend on another",
    devices: ["if", "unless", "provided that", "as long as"],
  },
  {
    name: "Addition",
    job: "adds or reinforces a point",
    devices: ["and", "also", "moreover", "furthermore"],
  },
  {
    name: "Sequence",
    job: "orders the thought in time",
    devices: ["first", "then", "meanwhile", "finally"],
  },
  {
    name: "Clarification",
    job: "restates the idea more precisely",
    devices: ["in other words", "that is", "to put it simply"],
  },
  {
    name: "Example",
    job: "introduces a concrete instance",
    devices: ["for example", "for instance", "such as", "namely"],
  },
  {
    name: "Conclusion",
    job: "closes the logic",
    devices: ["therefore", "ultimately", "in short", "overall"],
  },
];

document.querySelector("#menuButton").addEventListener("click", () => openDrawer(elements.pageDrawer));
document.querySelector("#closePageDrawer").addEventListener("click", closeOverlays);
document.querySelector("#modeButton").addEventListener("click", () => openDrawer(elements.modeSheet));
document.querySelector("#closeModeSheet").addEventListener("click", closeOverlays);
document.querySelector("#hintButton").addEventListener("click", () => openDrawer(elements.hintSheet));
document.querySelector("#closeHintSheet").addEventListener("click", closeOverlays);
document.querySelector("#startTaskButton").addEventListener("click", startTask);
elements.scrim.addEventListener("click", closeOverlays);
elements.form.addEventListener("submit", submitAttempt);
elements.composer.addEventListener("input", autoSizeComposer);
elements.deviceGroups.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-device]");
  if (!button) return;
  insertDevice(button.dataset.device);
});
document.querySelectorAll("[data-material]").forEach((button) => {
  button.addEventListener("click", () => openMaterial(button.dataset.material));
});

document.querySelectorAll(".segmented").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const field = group.dataset.field;
    const value = button.dataset.value;
    state.config[field] = field === "level" ? Number(value) : value;
    syncControls();
    updateSubtitle();
  });
});

init();

async function init() {
  renderHints();
  await checkHealth();
  syncControls();
  await startTask();
}

async function checkHealth() {
  try {
    const health = await getJson("/api/health");
    elements.apiPill.textContent = health.hasOpenAIKey ? health.model : "No key";
    elements.apiPill.classList.toggle("missing", !health.hasOpenAIKey);
    if (!health.hasOpenAIKey) {
      addMessage({
        role: "system",
        kind: "notice",
        content: "Add OPENAI_API_KEY to .env, then restart the server to enable real evaluation.",
      });
    }
  } catch {
    elements.apiPill.textContent = "Offline";
    elements.apiPill.classList.add("missing");
  }
}

async function startTask() {
  closeOverlays();
  const data = await postJson("/api/task", { config: state.config });
  state.task = data.task;
  state.config = { ...state.task.config };
  syncControls();
  renderHints();
  updateSubtitle();

  addMessage({
    role: "assistant",
    kind: "task",
    task: state.task,
  });
}

async function submitAttempt(event) {
  event.preventDefault();
  const attemptText = elements.composer.value.trim();
  if (!attemptText || state.isEvaluating) return;

  if (!state.task) await startTask();

  addMessage({
    role: "user",
    kind: "attempt",
    content: attemptText,
  });

  elements.composer.value = "";
  autoSizeComposer();
  setEvaluating(true);
  const loadingId = addMessage({
    role: "assistant",
    kind: "loading",
    content: "Checking formula, grammar, and logic...",
  });

  try {
    const data = await postJson("/api/evaluate", {
      config: state.config,
      task: state.task,
      attemptText,
    });
    replaceMessage(loadingId, {
      role: "assistant",
      kind: "result",
      attemptText,
      result: data.result,
    });
  } catch (error) {
    replaceMessage(loadingId, {
      role: "assistant",
      kind: "error",
      content: error.message || "Evaluation failed.",
    });
  } finally {
    setEvaluating(false);
  }
}

function setEvaluating(value) {
  state.isEvaluating = value;
  elements.sendButton.disabled = value;
}

function addMessage(message) {
  const id = message.id || `message-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  state.messages.push({ ...message, id });
  renderMessages();
  return id;
}

function replaceMessage(id, nextMessage) {
  const index = state.messages.findIndex((message) => message.id === id);
  if (index !== -1) {
    state.messages[index] = { ...nextMessage, id };
    renderMessages();
  }
}

function renderMessages() {
  elements.chat.innerHTML = state.messages.map(renderMessage).join("");
  elements.chat.querySelectorAll("[data-use-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.composer.value = button.dataset.useVariant || "";
      autoSizeComposer();
      elements.composer.focus();
    });
  });
  elements.chat.scrollTop = elements.chat.scrollHeight;
}

function renderMessage(message) {
  if (message.kind === "task") return renderTaskMessage(message.task);
  if (message.kind === "result") return renderResultMessage(message.attemptText, message.result);
  if (message.kind === "material") return renderMaterialMessage(message);
  if (message.kind === "error") return `<article class="message assistant"><p>${escapeHtml(message.content)}</p></article>`;
  if (message.kind === "loading") return `<article class="message assistant loading"><p>${escapeHtml(message.content)}</p></article>`;
  if (message.role === "user") return `<article class="message user"><p>${escapeHtml(message.content)}</p></article>`;
  return `<article class="message ${message.role || "assistant"}"><p>${escapeHtml(message.content)}</p></article>`;
}

function renderTaskMessage(task) {
  return `
    <article class="message assistant">
      <div class="message-head">
        <span class="chip primary">Structure</span>
        <span class="chip">Level ${task.config.level}</span>
        <span class="chip">${capitalize(task.config.support)}</span>
      </div>
      <p>${escapeHtml(task.instruction)}</p>
      <div class="formula-box">
        <strong>${escapeHtml(task.formulaLabel)}</strong>
        ${task.scaffold ? `<code>${escapeHtml(task.scaffold)}</code>` : ""}
        <p>${escapeHtml(task.sourceIdea)}</p>
      </div>
    </article>
  `;
}

function renderMaterialMessage(message) {
  return `
    <article class="message assistant">
      <div class="message-head">
        <span class="chip primary">Course</span>
      </div>
      <div class="formula-box">
        <strong>${escapeHtml(message.title)}</strong>
        <p>${escapeHtml(message.content)}</p>
      </div>
    </article>
  `;
}

function renderResultMessage(attemptText, result) {
  const statusClass = result.status === "passed" ? "success" : "warning";
  const issues = result.issues || [];
  const variants = result.variants || [];

  return `
    <article class="message assistant">
      <div class="result-stack">
        <div class="message-head">
          <span class="chip ${statusClass}">${labelStatus(result.status)}</span>
          <span class="chip">Formula: ${escapeHtml(result.formula?.fit || "partial")}</span>
        </div>
        <p>${escapeHtml(result.summary)}</p>
        <div class="annotated">${annotateText(attemptText, issues)}</div>
        <section class="issue-list">
          ${issues.length ? issues.map(renderIssue).join("") : `<div class="issue-card"><strong>No required fixes</strong><p>The structure can move to enrichment.</p></div>`}
        </section>
        <section class="variant-list">
          ${variants.map(renderVariant).join("")}
        </section>
        <div class="formula-box">
          <strong>Rewrite</strong>
          <p>${escapeHtml(result.nextInstruction)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderIssue(issue) {
  const title = `${labelCategory(issue.category)} · ${capitalize(issue.severity)}`;
  const replacement = issue.replacement ? `<p>${escapeHtml(issue.original)} → ${escapeHtml(issue.replacement)}</p>` : "";
  return `
    <div class="issue-card">
      <strong>${escapeHtml(title)}</strong>
      ${replacement}
      <p>${escapeHtml(issue.explanation)}</p>
    </div>
  `;
}

function renderVariant(variant, index) {
  return `
    <div class="variant-card">
      <strong>Rewrite option ${index + 1}</strong>
      <p>${escapeHtml(variant.sentence)}</p>
      <p>${escapeHtml(variant.changeNote)}</p>
      <button type="button" data-use-variant="${escapeHtml(variant.sentence)}">Use sentence</button>
    </div>
  `;
}

function annotateText(text, issues) {
  const ordered = [...(issues || [])]
    .filter((issue) => issue.startIndex >= 0 && issue.endIndex > issue.startIndex && issue.endIndex <= text.length)
    .sort((a, b) => a.startIndex - b.startIndex);

  let cursor = 0;
  let output = "";
  for (const issue of ordered) {
    if (issue.startIndex < cursor) continue;
    output += escapeHtml(text.slice(cursor, issue.startIndex));
    output += `<span class="mark ${escapeHtml(issue.category)}" title="${escapeHtml(issue.explanation)}">${escapeHtml(text.slice(issue.startIndex, issue.endIndex))}</span>`;
    cursor = issue.endIndex;
  }
  output += escapeHtml(text.slice(cursor));
  return output;
}

function syncControls() {
  document.querySelectorAll(".segmented").forEach((group) => {
    const field = group.dataset.field;
    group.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", String(state.config[field]) === String(button.dataset.value));
    });
  });
  updateModePreview();
}

function updateModePreview() {
  elements.modePreview.textContent = `Structure · Level ${state.config.level} · ${capitalize(state.config.support)}`;
}

function updateSubtitle() {
  elements.subtitle.textContent = `Structure · Level ${state.config.level} · ${capitalize(state.config.support)}`;
}

function openDrawer(drawer) {
  closeOverlays();
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  elements.scrim.hidden = false;
}

function closeOverlays() {
  [elements.pageDrawer, elements.modeSheet, elements.hintSheet].forEach((drawer) => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  });
  elements.scrim.hidden = true;
}

function openMaterial(material) {
  closeOverlays();
  const content = COURSE_MATERIALS[material] || COURSE_MATERIALS["structure-course"];
  addMessage({
    role: "assistant",
    kind: "material",
    title: content.title,
    content: content.body,
  });
}

function autoSizeComposer() {
  elements.composer.style.height = "auto";
  elements.composer.style.height = `${Math.min(elements.composer.scrollHeight, 132)}px`;
}

function renderHints() {
  elements.hintCurrent.innerHTML = renderCurrentHint();
  elements.deviceGroups.innerHTML = DEVICE_GROUPS.map(renderDeviceGroup).join("");
}

function renderCurrentHint() {
  const formula = state.task?.formula || [];
  if (!formula.length) {
    return `
      <div class="current-card">
        <strong>Current task</strong>
        <p>Start a task to see the exact relation groups you need.</p>
      </div>
    `;
  }

  return `
    <div class="current-card">
      <strong>Current task needs</strong>
      <div class="current-relations">
        ${formula
          .map(
            (step) => `
              <div class="relation-row">
                <span>${escapeHtml(capitalize(step.relation))}</span>
                <em>${escapeHtml(step.expectedMarkers.join(", "))}</em>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderDeviceGroup(group) {
  return `
    <section class="device-card">
      <div>
        <strong>${escapeHtml(group.name)}</strong>
        <span>${escapeHtml(group.job)}</span>
      </div>
      <div class="device-row">
        ${group.devices
          .map((device) => `<button type="button" data-device="${escapeHtml(device)}">${escapeHtml(device)}</button>`)
          .join("")}
      </div>
    </section>
  `;
}

function insertDevice(device) {
  const current = elements.composer.value;
  const separator = current && !/\s$/.test(current) ? " " : "";
  elements.composer.value = `${current}${separator}${device}`;
  closeOverlays();
  autoSizeComposer();
  elements.composer.focus();
}

async function getJson(path) {
  const response = await fetch(path);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

async function postJson(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function labelStatus(status) {
  return {
    passed: "Passed",
    needs_revision: "Needs revision",
    off_formula: "Off formula",
  }[status] || "Needs revision";
}

function labelCategory(category) {
  return (
    {
      formula: "Formula",
      connector: "Connector",
      grammar: "Grammar",
      article: "Article",
      preposition: "Preposition",
      tense: "Tense",
      punctuation: "Punctuation",
      clarity: "Clarity",
      style: "Enrichment",
    }[category] || capitalize(category)
  );
}

const COURSE_MATERIALS = {
  "structure-course": {
    title: "Structure course",
    body: "Structure Mode trains relation stacking. Level 1 makes one logical move. Level 2 combines two moves. Level 3 builds a layered argument that sets up, qualifies, and resolves an idea.",
  },
  "level-map": {
    title: "Level map",
    body: "Level 1 is one relation: because -> result. Level 2 is a chain: if -> result -> addition. Level 3 is an argument: although -> because -> therefore.",
  },
  connectors: {
    title: "Connector sheet",
    body: "Cohesive devices work by job. Cause explains why. Result shows consequence. Contrast turns against an idea. Concession admits a point before countering. Clarification restates the thought.",
  },
  "future-lessons": {
    title: "Future lessons",
    body: "Next lesson families will be prepositions/articles and tenses. They should use the same chat shell, but each needs its own academic knowledge base and correction contract.",
  },
};

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

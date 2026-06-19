const state = {
  config: {
    lesson: "structure",
    level: 1,
    support: "easy",
    quantity: 1,
    variant: "neutral",
    formulaId: "",
  },
  formulas: [],
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
  scrim: document.querySelector("#scrim"),
  formulaSelect: document.querySelector("#formulaSelect"),
  formulaPreview: document.querySelector("#formulaPreview"),
  quantitySelect: document.querySelector("#quantitySelect"),
  variantSelect: document.querySelector("#variantSelect"),
};

document.querySelector("#menuButton").addEventListener("click", () => openDrawer(elements.pageDrawer));
document.querySelector("#closePageDrawer").addEventListener("click", closeOverlays);
document.querySelector("#modeButton").addEventListener("click", () => openDrawer(elements.modeSheet));
document.querySelector("#closeModeSheet").addEventListener("click", closeOverlays);
document.querySelector("#startTaskButton").addEventListener("click", startTask);
elements.scrim.addEventListener("click", closeOverlays);
elements.form.addEventListener("submit", submitAttempt);
elements.composer.addEventListener("input", autoSizeComposer);
elements.quantitySelect.addEventListener("change", (event) => {
  state.config.quantity = Number(event.target.value);
  updateSubtitle();
});
elements.variantSelect.addEventListener("change", (event) => {
  state.config.variant = event.target.value;
});
elements.formulaSelect.addEventListener("change", (event) => {
  state.config.formulaId = event.target.value;
  updateFormulaPreview();
});

document.querySelectorAll(".segmented").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const field = group.dataset.field;
    const value = button.dataset.value;
    state.config[field] = field === "level" ? Number(value) : value;
    if (field === "level") syncFormulaSelect();
    syncControls();
    updateSubtitle();
  });
});

init();

async function init() {
  await checkHealth();
  await loadFormulas();
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

async function loadFormulas() {
  const data = await getJson("/api/formulas?level=1");
  state.formulas = data.formulas || [];
  state.config.formulaId = state.formulas[0]?.id || "";
  syncFormulaSelect();
}

async function startTask() {
  closeOverlays();
  const data = await postJson("/api/task", { config: state.config });
  state.formulas = data.formulas || state.formulas;
  state.task = data.task;
  state.config = { ...state.task.config };
  syncControls();
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
  const title = `${capitalize(issue.category)} · ${capitalize(issue.severity)}`;
  const replacement = issue.replacement ? `<p>${escapeHtml(issue.original)} → ${escapeHtml(issue.replacement)}</p>` : "";
  return `
    <div class="issue-card">
      <strong>${escapeHtml(title)}</strong>
      ${replacement}
      <p>${escapeHtml(issue.explanation)}</p>
    </div>
  `;
}

function renderVariant(variant) {
  return `
    <div class="variant-card">
      <strong>${escapeHtml(capitalize(variant.variant))}</strong>
      <p>${escapeHtml(variant.sentence)}</p>
      <p>${escapeHtml(variant.changeNote)}</p>
      <button type="button" data-use-variant="${escapeHtml(variant.sentence)}">Use variant</button>
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
  elements.quantitySelect.value = String(state.config.quantity);
  elements.variantSelect.value = state.config.variant;
  syncFormulaSelect();
  updateFormulaPreview();
}

function syncFormulaSelect() {
  const formulas = state.formulas.filter((formula) => formula.level === Number(state.config.level));
  if (!formulas.some((formula) => formula.id === state.config.formulaId)) {
    state.config.formulaId = formulas[0]?.id || state.config.formulaId;
  }
  elements.formulaSelect.innerHTML = formulas
    .map((formula) => `<option value="${escapeHtml(formula.id)}">${escapeHtml(formula.label)}</option>`)
    .join("");
  elements.formulaSelect.value = state.config.formulaId;
  updateFormulaPreview();
}

function updateFormulaPreview() {
  const formula = state.formulas.find((item) => item.id === state.config.formulaId);
  if (!formula) return;
  const supportLine =
    state.config.support === "easy"
      ? formula.easyScaffold
      : state.config.support === "normal"
        ? formula.label
        : formula.sourceIdea;
  elements.formulaPreview.textContent = supportLine;
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
  [elements.pageDrawer, elements.modeSheet].forEach((drawer) => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  });
  elements.scrim.hidden = true;
}

function autoSizeComposer() {
  elements.composer.style.height = "auto";
  elements.composer.style.height = `${Math.min(elements.composer.scrollHeight, 132)}px`;
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


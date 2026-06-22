const state = {
  config: {
    lesson: "structure",
    level: 1,
    support: "easy",
  },
  task: null,
  messages: [],
  isEvaluating: false,
  activePageId: "structure-course",
};

const elements = {
  chat: document.querySelector("#chat"),
  form: document.querySelector("#inputForm"),
  composer: document.querySelector("#composer"),
  sendButton: document.querySelector("#sendButton"),
  rerollButton: document.querySelector("#rerollTaskButton"),
  apiPill: document.querySelector("#apiPill"),
  subtitle: document.querySelector("#sessionSubtitle"),
  pageDrawer: document.querySelector("#pageDrawer"),
  pageReader: document.querySelector("#pageReader"),
  readerBackButton: document.querySelector("#readerBackButton"),
  readerTitle: document.querySelector("#readerTitle"),
  readerEyebrow: document.querySelector("#readerEyebrow"),
  readerSummary: document.querySelector("#readerSummary"),
  readerMeta: document.querySelector("#readerMeta"),
  readerBody: document.querySelector("#readerBody"),
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
    job: "orders steps in the thought",
    devices: ["first", "then", "meanwhile", "finally"],
  },
  {
    name: "Purpose",
    job: "shows the goal of an action",
    devices: ["to", "in order to", "so that", "for"],
  },
  {
    name: "Temporal",
    job: "connects action to time",
    devices: ["when", "after", "before", "once"],
  },
  {
    name: "Comparison",
    job: "makes one idea clearer through another",
    devices: ["like", "similar to", "compared with", "as"],
  },
  {
    name: "Clarification",
    job: "restates the idea more precisely",
    devices: ["in other words", "that is", "to put it simply"],
  },
  {
    name: "Exemplification",
    job: "introduces a concrete instance",
    devices: ["for example", "for instance", "such as", "namely"],
  },
  {
    name: "Emphasis",
    job: "marks the most important point",
    devices: ["especially", "in fact", "above all", "most importantly"],
  },
  {
    name: "Reference",
    job: "points back to a known idea",
    devices: ["this", "that", "these", "those"],
  },
  {
    name: "Conclusion",
    job: "closes the logic",
    devices: ["therefore", "ultimately", "in short", "overall"],
  },
];

document.querySelector("#menuButton").addEventListener("click", () => openDrawer(elements.pageDrawer));
document.querySelector("#closePageDrawer").addEventListener("click", closeOverlays);
document.querySelector("#closeReaderButton").addEventListener("click", closeReaderPage);
elements.readerBackButton.addEventListener("click", () => {
  closeReaderPage();
  openDrawer(elements.pageDrawer);
});
document.querySelector("#modeButton").addEventListener("click", () => openDrawer(elements.modeSheet));
document.querySelector("#closeModeSheet").addEventListener("click", closeOverlays);
document.querySelector("#hintButton").addEventListener("click", () => openDrawer(elements.hintSheet));
document.querySelector("#closeHintSheet").addEventListener("click", closeOverlays);
document.querySelector("#rerollTaskButton").addEventListener("click", () => startTask({ avoidCurrent: true }));
document.querySelector("#startTaskButton").addEventListener("click", () => startTask({ avoidCurrent: true }));
elements.scrim.addEventListener("click", closeOverlays);
elements.form.addEventListener("submit", submitAttempt);
elements.composer.addEventListener("input", autoSizeComposer);
elements.composer.addEventListener("keydown", submitOnEnter);
elements.deviceGroups.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-device]");
  if (!button) return;
  insertDevice(button.dataset.device);
});
document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => openReaderPage(button.dataset.page));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (elements.pageReader.classList.contains("open")) closeReaderPage();
    else closeOverlays();
  }
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

async function init() {
  renderReaderPage(state.activePageId);
  renderHints();
  await checkHealth();
  syncControls();
  await startTask();
}

async function checkHealth() {
  try {
    const health = await getJson("/api/health");
    if (elements.apiPill) {
      elements.apiPill.textContent = health.hasOpenAIKey ? health.model : "No key";
      elements.apiPill.classList.toggle("missing", !health.hasOpenAIKey);
    }
    if (!health.hasOpenAIKey) {
      addMessage({
        role: "system",
        kind: "notice",
        content: "Add OPENAI_API_KEY to .env, then restart the server to enable real evaluation.",
      });
    }
  } catch {
    if (elements.apiPill) {
      elements.apiPill.textContent = "Offline";
      elements.apiPill.classList.add("missing");
    }
  }
}

async function startTask(options = {}) {
  if (state.isEvaluating) return;

  const shouldReplace = shouldReplaceDraftTask();
  const avoidFormulaId = options.avoidCurrent ? state.task?.formulaId : "";
  closeOverlays();
  const data = await postJson("/api/task", {
    config: state.config,
    avoidFormulaId,
  });
  state.task = data.task;
  state.config = { ...state.task.config };
  syncControls();
  renderHints();
  updateSubtitle();

  const taskMessage = {
    role: "assistant",
    kind: "task",
    task: state.task,
  };

  if (shouldReplace) {
    replaceMessage(state.messages[state.messages.length - 1].id, taskMessage);
  } else {
    addMessage(taskMessage);
  }
}

function shouldReplaceDraftTask() {
  if (elements.composer.value.trim()) return false;
  return state.messages[state.messages.length - 1]?.kind === "task";
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
  const loadingTimers = [
    setTimeout(() => {
      updateMessage(loadingId, {
        content: "Still checking. The quality model can take a few seconds on the first pass...",
      });
    }, 8000),
    setTimeout(() => {
      updateMessage(loadingId, {
        content: "Still working. I will show the result or a timeout instead of leaving the chat stuck.",
      });
    }, 28000),
  ];

  try {
    const data = await postJson(
      "/api/evaluate",
      {
        config: state.config,
        task: state.task,
        attemptText,
      },
      { timeoutMs: 95000 },
    );
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
    loadingTimers.forEach(clearTimeout);
    setEvaluating(false);
  }
}

function submitOnEnter(event) {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  elements.form.requestSubmit();
}

function setEvaluating(value) {
  state.isEvaluating = value;
  elements.sendButton.disabled = value;
  if (elements.rerollButton) elements.rerollButton.disabled = value;
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

function updateMessage(id, patch) {
  const index = state.messages.findIndex((message) => message.id === id);
  if (index !== -1) {
    state.messages[index] = { ...state.messages[index], ...patch };
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
  const meta = task.formulaMeta || {};
  const relations = Array.isArray(meta.relations) ? meta.relations.join(" -> ") : "";
  return `
    <article class="message assistant">
      <div class="message-head">
        <span class="chip primary">Structure</span>
        <span class="chip level-chip">Level ${task.config.level}</span>
        ${meta.formulaCount ? `<span class="chip">Pattern ${escapeHtml(meta.formulaIndex)} / ${escapeHtml(meta.formulaCount)}</span>` : ""}
        <span class="chip">${capitalize(task.config.support)}</span>
      </div>
      <p>${escapeHtml(task.instruction)}</p>
      <div class="formula-box">
        <div class="formula-title">
          <strong>${escapeHtml(task.formulaLabel)}</strong>
          ${relations ? `<span>${escapeHtml(relations)}</span>` : ""}
        </div>
        ${task.scaffold ? `<code>${escapeHtml(task.scaffold)}</code>` : ""}
        <p>${escapeHtml(task.sourceIdea)}</p>
      </div>
    </article>
  `;
}

function renderResultMessage(attemptText, result) {
  const issues = result.issues || [];
  const variants = result.variants || [];
  const teacherTurn = result.teacherTurn || {};
  const hasRequiredIssues = issues.some((issue) => issue.severity !== "suggestion" && issue.category !== "enrichment");
  const visibleVariants = hasRequiredIssues ? [] : variants;

  return `
    <article class="message assistant">
      <div class="result-stack">
        <div class="result-status ${result.status === "passed" ? "success" : "warning"}">
          ${escapeHtml(resultStatusLine(result, issues))}
        </div>
        <div class="sentence-block">${annotateText(attemptText, issues)}</div>
        <section class="teacher-turn">
          <strong>${escapeHtml(teacherTurn.line || result.summary)}</strong>
          ${renderCorrection(attemptText, teacherTurn.correction || result.correctedSentence)}
          <p>${escapeHtml(teacherTurn.microLesson || result.formula?.explanation || result.summary)}</p>
        </section>
        <section class="issue-list">
          ${issues.length ? issues.map(renderIssue).join("") : ""}
        </section>
        <section class="variant-list">
          ${visibleVariants.map(renderVariant).join("")}
        </section>
        <div class="rewrite-cue">
          <strong>Now write it properly.</strong>
          <p>${escapeHtml(teacherTurn.rewritePrompt || result.nextInstruction)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderCorrection(attemptText, correctedSentence) {
  if (!correctedSentence || sameText(attemptText, correctedSentence)) return "";
  return `
    <div class="correction-block">
      <span>Correction</span>
      <p>${escapeHtml(correctedSentence)}</p>
    </div>
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
    output += `<span class="mark ${escapeHtml(issue.category)}" tabindex="0" title="${escapeHtml(issue.explanation)}" aria-label="${escapeHtml(labelCategory(issue.category))}: ${escapeHtml(issue.explanation)}">${escapeHtml(text.slice(issue.startIndex, issue.endIndex))}</span>`;
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
  if (elements.subtitle) {
    elements.subtitle.textContent = `Structure · Level ${state.config.level} · ${capitalize(state.config.support)}`;
  }
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

function openReaderPage(pageId) {
  closeOverlays();
  renderReaderPage(pageId);
  elements.pageReader.classList.add("open");
  elements.pageReader.removeAttribute("inert");
  elements.pageReader.setAttribute("aria-hidden", "false");
  elements.readerBackButton.focus();
}

function closeReaderPage() {
  elements.pageReader.classList.remove("open");
  elements.pageReader.setAttribute("aria-hidden", "true");
  elements.pageReader.setAttribute("inert", "");
}

function renderReaderPage(pageId) {
  const page = COURSE_PAGES[pageId] || COURSE_PAGES["structure-course"];
  state.activePageId = page.id;
  elements.readerTitle.textContent = page.title;
  elements.readerEyebrow.textContent = page.eyebrow;
  elements.readerSummary.textContent = page.summary;
  elements.readerMeta.innerHTML = renderReaderMeta(page);
  elements.readerBody.innerHTML = page.sections.map(renderReaderSection).join("");
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page.id);
  });
}

function renderReaderMeta(page) {
  return page.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

function renderReaderSection(section) {
  if (section.type === "callout") return renderCalloutSection(section);
  if (section.type === "list") return renderListSection(section);
  if (section.type === "table") return renderTableSection(section);
  if (section.type === "examples") return renderExamplesSection(section);
  return renderTextSection(section);
}

function renderTextSection(section) {
  return `
    <section class="wiki-section">
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </section>
  `;
}

function renderCalloutSection(section) {
  return `
    <section class="wiki-callout">
      <strong>${escapeHtml(section.label)}</strong>
      <p>${escapeHtml(section.body)}</p>
    </section>
  `;
}

function renderListSection(section) {
  return `
    <section class="wiki-section">
      <h2>${escapeHtml(section.heading)}</h2>
      <div class="wiki-list">
        ${section.items
          .map(
            (item) => `
              <div class="wiki-list-item">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.text)}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTableSection(section) {
  return `
    <section class="wiki-section">
      <h2>${escapeHtml(section.heading)}</h2>
      <div class="wiki-table" role="table" aria-label="${escapeHtml(section.heading)}">
        <div class="wiki-table-row head" role="row">
          ${section.columns.map((column) => `<strong role="columnheader">${escapeHtml(column)}</strong>`).join("")}
        </div>
        ${section.rows
          .map(
            (row) => `
              <div class="wiki-table-row" role="row">
                ${row.map((cell) => `<span role="cell">${escapeHtml(cell)}</span>`).join("")}
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderExamplesSection(section) {
  return `
    <section class="wiki-section">
      <h2>${escapeHtml(section.heading)}</h2>
      <div class="example-stack">
        ${section.examples
          .map(
            (example) => `
              <figure class="wiki-example">
                <figcaption>${escapeHtml(example.label)}</figcaption>
                <code>${escapeHtml(example.sentence)}</code>
                <p>${escapeHtml(example.note)}</p>
              </figure>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
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

async function getJson(path, options = {}) {
  const response = await fetchWithTimeout(path, {}, options.timeoutMs);
  const data = await parseJsonResponse(response);
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

async function postJson(path, body, options = {}) {
  const response = await fetchWithTimeout(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    options.timeoutMs,
  );
  const data = await parseJsonResponse(response);
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

async function fetchWithTimeout(path, options, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(path, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("The evaluator took too long. Try a shorter sentence, or lower reasoning effort in .env.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {
      error: "The server returned an unreadable response.",
    };
  }
}

function resultStatusLine(result, issues) {
  if (result.status === "passed" && issues.length) return "Structure passed. Fix the English.";
  if (result.status === "passed") return "Structure passed.";
  if (result.formula?.fit === "failed") return "Build the structure first.";
  return "Almost there. Fix the marked part.";
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
      enrichment: "Enrichment",
    }[category] || capitalize(category)
  );
}

const COURSE_PAGES = {
  "structure-course": {
    id: "structure-course",
    eyebrow: "Structure Mode",
    title: "Structure course",
    summary:
      "Structure Mode trains the learner to build one sentence by controlling logical relations between ideas.",
    meta: ["Active lesson", "Cohesive devices", "Formula-first feedback"],
    sections: [
      {
        type: "text",
        heading: "Core idea",
        body: [
          "The sentence is not judged only by grammar. It is judged by whether it performs the requested logical job.",
          "A clean sentence can still fail Tao Dao if the target relation is missing. A rough sentence can be useful if the required structure is visible and teachable.",
        ],
      },
      {
        type: "callout",
        label: "Product rule",
        body:
          "Formula fit comes before grammar, fluency, and enrichment. The app should teach construction, not only correct output.",
      },
      {
        type: "callout",
        label: "Source frame",
        body:
          "CEFR gives the ladder from basic connectors to controlled use of organisational patterns and cohesive devices. Cambridge gives the relation-marker grammar. Purdue OWL grounds punctuation as part of sentence structure.",
      },
      {
        type: "list",
        heading: "Relation jobs",
        items: [
          {
            title: "Cause",
            text: "Explains why the main idea happens. Common markers: because, since, as.",
          },
          {
            title: "Result",
            text: "Shows what follows from a cause. Common markers: so, therefore, consequently.",
          },
          {
            title: "Contrast",
            text: "Places two ideas against each other. Common markers: but, however, whereas.",
          },
          {
            title: "Concession",
            text: "Admits one point before moving to the stronger point. Common markers: although, even though, despite.",
          },
          {
            title: "Clarification",
            text: "Restates a thought more precisely. Common markers: in other words, that is, to put it simply.",
          },
          {
            title: "Purpose",
            text: "Names the goal of an action. Common markers: to, in order to, so that.",
          },
          {
            title: "Exemplification",
            text: "Uses a concrete case to support a general idea. Common markers: for example, for instance, such as.",
          },
          {
            title: "Sequence and temporal",
            text: "Sequence orders steps; Temporal connects actions to time. Common markers: first, then, when, after, once.",
          },
          {
            title: "Comparison, emphasis, reference",
            text: "Comparison clarifies through similarity; Emphasis marks importance; Reference points back to a known idea with this, that, these, or those.",
          },
        ],
      },
      {
        type: "examples",
        heading: "How a sentence grows",
        examples: [
          {
            label: "Level 1",
            sentence: "To improve my English, I practice one structure every day.",
            note: "One simple dependency: purpose -> action.",
          },
          {
            label: "Level 2",
            sentence: "First I notice the weak pattern; then, because I repeat it, the mistake becomes easier to control.",
            note: "Sequence, cause, and result.",
          },
          {
            label: "Level 3",
            sentence:
              "Although progress feels slow, because daily practice compounds, the result becomes visible; therefore, consistency matters more than intensity.",
            note: "Concession, cause, result, and conclusion.",
          },
        ],
      },
    ],
  },
  "level-map": {
    id: "level-map",
    eyebrow: "Structure ladder",
    title: "Level map",
    summary:
      "Level is structure complexity. Support is how much help the learner sees. They must stay separate.",
    meta: ["Level 1 to 3", "Support independent", "Task difficulty"],
    sections: [
      {
        type: "table",
        heading: "Level meaning",
        columns: ["Level", "Target", "Example shape"],
        rows: [
          ["1", "One relation or simple dependency", "Because ___, ___. / To ___, ___."],
          ["2", "Two or three relation moves", "First ___; then, because ___, ___."],
          ["3", "Layered argument with three or more moves", "Although ___, because ___, ___; therefore, ___."],
        ],
      },
      {
        type: "table",
        heading: "Current Structure inventory",
        columns: ["Level", "Pattern count", "Training target"],
        rows: [
          ["1", "8 patterns", "Single relation jobs and simple dependencies."],
          ["2", "8 patterns", "Chained relations with punctuation pressure."],
          ["3", "8 patterns", "Layered argument with qualification and resolution."],
        ],
      },
      {
        type: "table",
        heading: "Support meaning",
        columns: ["Support", "What the learner sees", "Why it exists"],
        rows: [
          ["Easy", "Formula and scaffold", "Train the shape without memory pressure."],
          ["Normal", "Formula name only", "Recall the structure without a full frame."],
          ["Hard", "Communicative goal only", "Build the structure from intent."],
        ],
      },
      {
        type: "list",
        heading: "Pass checks",
        items: [
          {
            title: "Every required relation appears",
            text: "If the task asks for concession -> cause -> result, all three jobs must be visible.",
          },
          {
            title: "Markers match their job",
            text: "Because cannot do the job of contrast; however cannot glue a cause clause.",
          },
          {
            title: "The sentence stays coherent",
            text: "The parts must support one meaning, not simply contain connector words.",
          },
        ],
      },
    ],
  },
  connectors: {
    id: "connectors",
    eyebrow: "Reference sheet",
    title: "Connector sheet",
    summary:
      "Connectors are not decorative words. Each one performs a job and creates a punctuation obligation.",
    meta: ["Writing aid", "Punctuation rules", "Device groups"],
    sections: [
      {
        type: "table",
        heading: "Core groups",
        columns: ["Job", "Use when", "Devices"],
        rows: [
          ["Addition", "You add or reinforce a point.", "and, also, moreover, furthermore"],
          ["Contrast", "Two ideas push against each other.", "but, however, yet, whereas"],
          ["Cause", "You give the reason.", "because, since, as, due to"],
          ["Result", "You show the consequence.", "so, therefore, thus, consequently"],
          ["Condition", "One idea depends on another.", "if, unless, provided that, as long as"],
          ["Concession", "You admit one point before turning.", "although, even though, while"],
          ["Purpose", "You name the goal.", "to, in order to, so that"],
          ["Sequence", "You order steps.", "first, then, next, finally"],
          ["Temporal", "You connect action to time.", "when, after, before, once"],
          ["Comparison", "You explain through similarity.", "like, similar to, compared with"],
          ["Clarification", "You restate more precisely.", "in other words, that is, to put it simply"],
          ["Exemplification", "You give a concrete instance.", "for example, for instance, such as"],
          ["Emphasis", "You mark the important part.", "especially, in fact, above all"],
          ["Reference", "You point back to a known idea.", "this, that, these, those"],
          ["Conclusion", "You close the logic.", "ultimately, in short, overall"],
        ],
      },
      {
        type: "list",
        heading: "Source anchors",
        items: [
          {
            title: "CEFR",
            text: "Use the level ladder: basic connector control first, then wider organisational patterns and cohesive devices.",
          },
          {
            title: "Cambridge Grammar",
            text: "Use discourse markers and linking words as functional groups: connect, organise, manage, clarify, contrast, and sequence.",
          },
          {
            title: "Purdue OWL",
            text: "Treat punctuation as structural evidence, especially after introductory clauses and around conjunctive adverbs.",
          },
        ],
      },
      {
        type: "list",
        heading: "Punctuation memory",
        items: [
          {
            title: "Because, although, if",
            text: "These introduce dependent clauses. When they start the sentence, the first clause usually needs a comma before the main clause.",
          },
          {
            title: "However, therefore, consequently",
            text: "These often connect independent sentences. Use a period or semicolon before them, not a simple comma splice.",
          },
          {
            title: "But, and, so",
            text: "These can connect two independent clauses with a comma before the connector.",
          },
        ],
      },
      {
        type: "examples",
        heading: "Connector placement",
        examples: [
          {
            label: "Cause first",
            sentence: "Because the method is simple, people can repeat it.",
            note: "The cause clause opens the sentence and takes a comma.",
          },
          {
            label: "Conjunctive adverb",
            sentence: "The method is simple; therefore, people can repeat it.",
            note: "Therefore links two independent ideas with a semicolon or new sentence.",
          },
        ],
      },
    ],
  },
  "future-lessons": {
    id: "future-lessons",
    eyebrow: "Roadmap",
    title: "Future lessons",
    summary:
      "Future lesson families belong in the same chat shell, but they should not become active modes before Structure Mode is reliable.",
    meta: ["Not active yet", "Reference only", "Same evaluator discipline"],
    sections: [
      {
        type: "text",
        heading: "Why they wait",
        body: [
          "Articles, prepositions, and tense are real failure modules, but adding them as active modes too early would dilute the first proof.",
          "For now, they can appear as correction categories when they block a Structure attempt. Later, each needs its own lesson page, task generator, and evaluator rules.",
        ],
      },
      {
        type: "list",
        heading: "Planned families",
        items: [
          {
            title: "Articles and determiners",
            text: "Train the question before each noun: general, new, known, owned, counted, or pointed to.",
          },
          {
            title: "Prepositions",
            text: "Train relation habits for place, time, movement, abstract pairing, and fixed academic patterns.",
          },
          {
            title: "Time, tense, aspect",
            text: "Train finished vs connected to now, whole vs in progress, real vs distant, and present perfect as the bridge problem.",
          },
          {
            title: "Punctuation",
            text: "Train punctuation as a structural signal, especially around clauses and conjunctive adverbs.",
          },
        ],
      },
      {
        type: "callout",
        label: "Activation rule",
        body:
          "A future page can be educational before it becomes a practice mode. The mode becomes active only when its task generator and evaluator contract exist.",
      },
    ],
  },
};

init();

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

function sameText(left, right) {
  return String(left || "").replace(/\s+/g, " ").trim() === String(right || "").replace(/\s+/g, " ").trim();
}

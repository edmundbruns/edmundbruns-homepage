(() => {
  "use strict";

  const MODULE = {
    id: "001",
    title: "Gefühle wahrnehmen und benennen",
    totalTasks: 8,
    quizMax: 5,
    storageKey: "sol-soziales-lernen-001-v1"
  };
  const config = Object.assign({
    hostingMode: "auto",
    googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbxBhjv6MFrdcTNozcueiRhVxqzv3V7WnIEqKGsegyI1Q1vw_sygXvEftlbC-yVXnHPk/exec",
    sharedToken: "sol-soz-2026-9fK3qZ",
    cloudflareEndpoint: "/api/soziales-lernen-submit",
    netlifyEndpoint: "/",
    nextBaseUrl: "https://bruns-homepage.pages.dev/schulsozialarbeit/soziales-lernen/"
  }, window.SOL_CONFIG || {});

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clean = value => String(value || "").trim();
  const initialState = () => ({
    version: 1,
    path: "standard",
    completed: [],
    answers: {},
    quizAnswers: {},
    quizScore: 0,
    precheck: "",
    selfcheck: "",
    alias: "",
    klasse: "",
    email: "",
    easy: false,
    submissionId: createId()
  });
  let state = initialState();
  let saveTimer = 0;

  function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `sol-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(MODULE.storageKey) || "null");
      if (parsed && parsed.version === 1) state = Object.assign(initialState(), parsed);
    } catch (_) {
      state = initialState();
    }
    if (!state.submissionId) state.submissionId = createId();
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      try {
        // privateNote wird absichtlich weder gelesen noch gespeichert.
        localStorage.setItem(MODULE.storageKey, JSON.stringify(state));
      } catch (_) {
        announce("Der Zwischenstand konnte in diesem Browser nicht gespeichert werden.");
      }
    }, 180);
  }

  function announce(message) {
    const region = $("#liveRegion");
    region.textContent = "";
    window.setTimeout(() => { region.textContent = message; }, 20);
  }

  function markComplete(taskId) {
    if (!state.completed.includes(taskId)) state.completed.push(taskId);
    updateProgress();
    save();
  }

  function unmarkComplete(taskId) {
    state.completed = state.completed.filter(id => id !== taskId);
    delete state.answers[taskId];
    if (taskId === "t8") {
      state.quizAnswers = {};
      state.quizScore = 0;
    }
    updateProgress();
    save();
  }

  function updateProgress() {
    const count = state.completed.length;
    const percent = Math.round((count / MODULE.totalTasks) * 100);
    $("#progressBar").style.width = `${percent}%`;
    $("#progressText").textContent = `${count}/${MODULE.totalTasks}`;
    const bar = $(".progress");
    bar.setAttribute("aria-valuenow", String(count));
    bar.setAttribute("aria-label", `${count} von ${MODULE.totalTasks} Pflichtaufgaben bearbeitet`);
    $("#hiddenProgress").value = String(percent);
    $("#hiddenScore").value = String(state.quizScore);
  }

  function setFeedback(taskId, text, kind = "good") {
    const target = $(`#feedback-${taskId}`);
    if (!target) return;
    target.className = `feedback ${kind}`;
    target.textContent = text;
  }

  const qualityFeedback = {
    t1: {
      good: "Gut begründet: Die beschriebenen Zeichen passen zu dieser Möglichkeit. Sicher wissen kann man Sams Gefühl erst, wenn Sam es selbst sagt.",
      note: "Das ist möglich, aber im Text nicht eindeutig. Eine faire Formulierung wäre: „Sam könnte genervt sein.“",
      bad: "Körperzeichen sind Hinweise, keine Beweise. Besser: als Vermutung formulieren und vorsichtig nachfragen."
    },
    t4: {
      good: "Fair gedacht: Mehrere Erklärungen bleiben möglich. Nachfragen und Zeit lassen respektiert Sams Sicht.",
      bad: "Schweigen beweist keine Absicht. Nervosität, Überforderung oder der Wunsch nach Ruhe wären ebenfalls möglich."
    },
    t6: {
      good: "Diese Handlung ist konkret, respektvoll und umsetzbar. Sie schafft Sicherheit, ohne andere anzugreifen.",
      note: "Abstand kann kurzfristig helfen. Eine kurze Information oder das Holen von Hilfe macht die Situation meist klarer und sicherer.",
      bad: "Das Gefühl darf da sein. Anschreien kann aber verletzen und den Konflikt verstärken. Wähle eine sichere Alternative."
    },
    t7: {
      good: "Der Satz benennt das eigene Gefühl und einen konkreten Wunsch. Er greift niemanden an.",
      note: "Der Satz zeigt Unzufriedenheit, sagt aber noch nicht, was helfen soll. Ergänze Gefühl und Wunsch.",
      bad: "Der Vorwurf kann den Konflikt verschärfen. Ein Ich-Satz beschreibt die eigene Lage und einen Wunsch."
    }
  };

  function selectChoice(button) {
    const group = button.closest("[data-group]");
    if (!group) return;
    const groupId = group.dataset.group;
    $$("button.choice", group).forEach(item => { item.classList.remove("selected", "correct", "not-best"); item.setAttribute("aria-pressed", "false"); });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    const value = button.dataset.value || "";
    if (groupId === "precheck") state.precheck = value;
    else if (groupId === "selfcheck") state.selfcheck = value;
    else {
      const quality = button.dataset.quality || "good";
      state.answers[groupId] = value;
      button.classList.add(quality === "good" ? "correct" : "not-best");
      setFeedback(groupId, qualityFeedback[groupId][quality], quality === "bad" ? "bad" : quality === "note" ? "note" : "good");
      markComplete(groupId);
    }
    save();
  }

  function checkTask(taskId) {
    if (taskId === "t2") {
      const selected = $$("[data-check-group='t2'] input:checked").map(input => input.value).sort();
      if (!selected.length) return setFeedback("t2", "Wähle zuerst die zwei Zeichen aus dem Text.", "note");
      const correct = selected.length === 2 && selected.includes("bauch") && selected.includes("haende");
      state.answers.t2 = selected;
      setFeedback("t2", correct
        ? "Richtig gelesen: enger Bauch und feuchte Hände werden genannt. Solche Zeichen können verschiedene Ursachen haben."
        : "Lies die Situation noch einmal: Genannt werden der enge Bauch und die feuchten Hände. Körperzeichen allein sind keine Diagnose.", correct ? "good" : "note");
      markComplete("t2");
      return;
    }
    if (taskId === "t3") {
      const values = $$("[data-sort]").map(select => clean(select.value).toLowerCase());
      if (values.some(value => !value)) return setFeedback("t3", "Ordne bitte alle drei Aussagen zu.", "note");
      const correct = values.join("|") === "gefühl|gedanke|handlung";
      state.answers.t3 = values;
      setFeedback("t3", correct
        ? "Richtig: nervös ist ein Gefühl, die Erwartung des Auslachens ist ein Gedanke und Weggehen ist eine Handlung."
        : "Prüfe die Unterschiede: Ein Gefühl benennt einen inneren Zustand. Ein Gedanke ist ein Satz im Kopf. Eine Handlung ist beobachtbar.", correct ? "good" : "note");
      markComplete("t3");
      return;
    }
    if (taskId === "t5") {
      const values = $$("[data-sequence]").map(select => clean(select.value).toLowerCase());
      if (values.some(value => !value)) return setFeedback("t5", "Ordne bitte alle drei Sätze zu.", "note");
      const correct = values.join("|") === "gefühl|bedürfnis|handlung";
      state.answers.t5 = values;
      setFeedback("t5", correct
        ? "Richtig getrennt. Ein Bedürfnis erklärt, was gerade wichtig sein könnte. Es rechtfertigt nicht automatisch jede Handlung."
        : "Tipp: „nervös“ ist das Gefühl. „Sicherheit“ ist das Bedürfnis. „bitten“ ist die Handlung.", correct ? "good" : "note");
      markComplete("t5");
    }
  }

  function evaluateQuiz() {
    const expected = { q1: "nein", q2: "nervoes", q3: "bitten", q4: "fragen", q5: "entscheiden" };
    const answers = {};
    for (const name of Object.keys(expected)) {
      const checked = $(`input[name='${name}']:checked`);
      if (!checked) {
        setFeedback("t8", "Beantworte bitte alle fünf Fragen. Du kannst jede Antwort später ändern.", "note");
        return;
      }
      answers[name] = checked.value;
    }
    const score = Object.keys(expected).filter(key => answers[key] === expected[key]).length;
    state.quizAnswers = answers;
    state.quizScore = score;
    state.answers.t8 = `bearbeitet-${score}-von-5`;
    const text = score === 5
      ? "5 von 5: Du unterscheidest Hinweise, Gefühle und Handlungen sehr sicher."
      : score >= 3
        ? `${score} von 5: Die wichtigsten Grundlagen sind da. Schau besonders auf die Unterscheidung von Gefühl, Gedanke und Handlung.`
        : `${score} von 5: Das ist ein Zwischenstand. Nutze die Merksätze und probiere den Check danach erneut.`;
    setFeedback("t8", text, score >= 3 ? "good" : "note");
    markComplete("t8");
  }

  function resetTask(taskId) {
    const task = $(`[data-task='${taskId}']`);
    if (!task) return;
    $$("button.choice", task).forEach(button => { button.classList.remove("selected", "correct", "not-best"); button.setAttribute("aria-pressed", "false"); });
    $$("input[type='checkbox'],input[type='radio']", task).forEach(input => { input.checked = false; input.closest(".choice")?.classList.remove("selected"); });
    $$("select", task).forEach(select => { select.value = ""; });
    const feedback = $(`#feedback-${taskId}`);
    if (feedback) { feedback.className = "feedback"; feedback.textContent = ""; }
    unmarkComplete(taskId);
    announce(`Aufgabe ${taskId.slice(1)} wurde zurückgesetzt.`);
  }

  function setPath(path, shouldSave = true) {
    state.path = ["sicher", "standard", "weiterdenken"].includes(path) ? path : "standard";
    $$('[data-path]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.path === state.path)));
    $$('[data-path-content]').forEach(panel => { panel.hidden = panel.dataset.pathContent !== state.path; });
    $$('[data-path-panel]').forEach(panel => { panel.hidden = panel.dataset.pathPanel !== state.path; });
    const labels = { sicher: "Sicher", standard: "Standard", weiterdenken: "Weiterdenken" };
    $("#pathInfo").textContent = `Gewählt: ${labels[state.path]}. Du kannst jederzeit wechseln.`;
    $("#hiddenLernweg").value = state.path;
    if (shouldSave) save();
  }

  function setEasy(active, shouldSave = true) {
    state.easy = Boolean(active);
    document.body.classList.toggle("easy", state.easy);
    $("#easyBtn").setAttribute("aria-pressed", String(state.easy));
    $("#easyBtn").textContent = state.easy ? "Standard lesen" : "Leichter lesen";
    if (shouldSave) save();
  }

  function restore() {
    setPath(state.path, false);
    setEasy(state.easy, false);
    $("#alias").value = state.alias || "";
    $("#klasse").value = state.klasse || "";
    $("#email").value = state.email || "";
    $("#hiddenSubmissionId").value = state.submissionId;
    const restoreChoice = (groupId, value) => {
      if (!value) return;
      const button = $(`[data-group='${groupId}'] [data-value='${CSS.escape(value)}']`);
      button?.classList.add("selected");
      button?.setAttribute("aria-pressed", "true");
    };
    restoreChoice("precheck", state.precheck);
    restoreChoice("selfcheck", state.selfcheck);
    ["t1", "t4", "t6", "t7"].forEach(taskId => {
      const value = state.answers[taskId];
      if (!value) return;
      const button = $(`[data-group='${taskId}'] [data-value='${CSS.escape(value)}']`);
      if (button) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
        const quality = button.dataset.quality || "good";
        button.classList.add(quality === "good" ? "correct" : "not-best");
        setFeedback(taskId, "Wieder aufgenommene Antwort. Du kannst sie ändern.", "good");
      }
    });
    if (Array.isArray(state.answers.t2)) {
      state.answers.t2.forEach(value => {
        const input = $(`[data-check-group='t2'] input[value='${CSS.escape(value)}']`);
        if (input) { input.checked = true; input.closest(".choice")?.classList.add("selected"); }
      });
    }
    if (Array.isArray(state.answers.t3)) $$("[data-sort]").forEach((select, index) => { select.value = capitalise(state.answers.t3[index] || ""); });
    if (Array.isArray(state.answers.t5)) $$("[data-sequence]").forEach((select, index) => { select.value = capitalise(state.answers.t5[index] || ""); });
    Object.entries(state.quizAnswers || {}).forEach(([name, value]) => {
      const input = $(`input[name='${name}'][value='${CSS.escape(value)}']`);
      if (input) input.checked = true;
    });
    if (state.completed.length) announce("Gespeicherten Zwischenstand wieder aufgenommen.");
    updateProgress();
  }

  function capitalise(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  }

  function resolveHostingMode() {
    if (config.hostingMode === "cloudflare" || config.hostingMode === "netlify") return config.hostingMode;
    return location.hostname.endsWith("netlify.app") ? "netlify" : "cloudflare";
  }

  function buildPayload() {
    const completed = state.completed.length;
    const missingTasks = Array.from({ length: MODULE.totalTasks }, (_, i) => `t${i + 1}`).filter(id => !state.completed.includes(id));
    const wrongQuiz = ["q1", "q2", "q3", "q4", "q5"].filter(name => {
      const expected = { q1: "nein", q2: "nervoes", q3: "bitten", q4: "fragen", q5: "entscheiden" };
      return state.quizAnswers[name] && state.quizAnswers[name] !== expected[name];
    });
    const mode = resolveHostingMode();
    return {
      schema_version: "1.0",
      bereich: "SOL Soziales Lernen",
      shared_token: config.sharedToken,
      zielgruppe: "Schüler:innen",
      modul_id: MODULE.id,
      modul_titel: MODULE.title,
      name_oder_alias: clean($("#alias").value),
      klasse: clean($("#klasse").value),
      email: clean($("#email").value),
      lernweg: state.path,
      bearbeitungsstand: Math.round((completed / MODULE.totalTasks) * 100),
      pflichtaufgaben: { bearbeitet: completed, gesamt: MODULE.totalTasks },
      kompetenzindikatoren: {
        selbstwahrnehmung: percentFor(["t1", "t2", "t3", "t5"]),
        selbststeuerung: percentFor(["t6"]),
        perspektivuebernahme: percentFor(["t4"]),
        kommunikation: percentFor(["t7"]),
        kooperation: 0,
        konfliktkompetenz: percentFor(["t6", "t7"]),
        beteiligung: 0,
        medienverantwortung: 0,
        hilfeholen: state.answers.t6 === "hilfe" ? 100 : state.completed.includes("t6") ? 50 : 0
      },
      handlungswissen_punkte: state.quizScore,
      handlungswissen_max: MODULE.quizMax,
      freiwillige_selbsteinschaetzung: state.selfcheck || "nicht angegeben",
      fehlende_bereiche: missingTasks.concat(wrongQuiz),
      zeitstempel_client: new Date().toISOString(),
      abgabe_id: state.submissionId,
      hosting_modus: mode,
      next_module_url: new URL("002/", config.nextBaseUrl).href
    };
  }

  function percentFor(taskIds) {
    const done = taskIds.filter(id => state.completed.includes(id)).length;
    return Math.round((done / taskIds.length) * 100);
  }

  function showPreview() {
    syncProfile();
    const payload = buildPayload();
    $("#payloadPreview").textContent = JSON.stringify(payload, null, 2);
    $("#payloadDetails").open = true;
    announce("Datenvorschau aktualisiert. Private Reflexion ist nicht enthalten.");
    return payload;
  }

  function syncProfile() {
    state.alias = clean($("#alias").value);
    state.klasse = clean($("#klasse").value);
    state.email = clean($("#email").value);
    save();
  }

  function syncNetlifyFields(payload) {
    const form = $("#submitForm");
    const values = {
      lernweg: payload.lernweg,
      bearbeitungsstand: payload.bearbeitungsstand,
      handlungswissen_punkte: payload.handlungswissen_punkte,
      abgabe_id: payload.abgabe_id,
      pflichtaufgaben: JSON.stringify(payload.pflichtaufgaben),
      kompetenzindikatoren: JSON.stringify(payload.kompetenzindikatoren),
      freiwillige_selbsteinschaetzung: payload.freiwillige_selbsteinschaetzung,
      fehlende_bereiche: JSON.stringify(payload.fehlende_bereiche),
      zeitstempel_client: payload.zeitstempel_client,
      hosting_modus: payload.hosting_modus,
      next_module_url: payload.next_module_url,
      payload_json: JSON.stringify(payload)
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = String(value);
    });
  }

  async function submit(event) {
    event.preventDefault();
    syncProfile();
    const form = $("#submitForm");
    if (!form.reportValidity()) return;
    if (state.completed.length < MODULE.totalTasks) {
      const proceed = window.confirm(`Du hast ${state.completed.length} von ${MODULE.totalTasks} Pflichtaufgaben bearbeitet. Trotzdem senden?`);
      if (!proceed) return;
    }
    const payload = showPreview();
    syncNetlifyFields(payload);
    const button = $("#sendBtn");
    const status = $("#sendStatus");
    button.disabled = true;
    status.textContent = "Übermittlung läuft …";
    try {
      const res = await window.ebSend(config.googleAppsScriptUrl, payload);
      if (!res.ok) throw new Error(String(res.msg).replace(/\.$/, ""));
      status.textContent = "Gespeichert ✓ Die Lehrkraft erhält deine Lerninformationen.";
      status.style.background = "var(--good-bg)";
      announce("Abgabe erfolgreich gespeichert.");
    } catch (error) {
      status.textContent = `Nicht gesendet: ${error.message}. Dein lokaler Zwischenstand bleibt erhalten. Bitte später erneut versuchen oder eine Lehrkraft fragen.`;
      status.style.background = "var(--bad-bg)";
      announce("Die Abgabe wurde nicht gesendet.");
    } finally {
      button.disabled = false;
    }
  }

  function deleteLocalData() {
    if (!window.confirm("Wirklich alle lokal gespeicherten Antworten dieses Moduls löschen?")) return;
    localStorage.removeItem(MODULE.storageKey);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    $("#privateNote").value = "";
    state = initialState();
    window.location.reload();
  }

  function startReading() {
    if (!("speechSynthesis" in window)) return announce("Vorlesen wird von diesem Browser nicht unterstützt.");
    speechSynthesis.cancel();
    const text = $$('[data-read]').filter(element => {
      if (element.closest(".private")) return false;
      if (element.hidden || element.closest("[hidden]")) return false;
      return element.offsetParent !== null;
    }).map(element => clean(element.textContent)).filter(Boolean).join(". ");
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = state.easy ? 0.88 : 0.96;
    utterance.onend = () => announce("Vorlesen beendet.");
    speechSynthesis.speak(utterance);
    announce("Vorlesen gestartet.");
  }

  function togglePause() {
    if (!("speechSynthesis" in window)) return;
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      $("#pauseBtn").textContent = "Pause";
      announce("Vorlesen fortgesetzt.");
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      $("#pauseBtn").textContent = "Weiterlesen";
      announce("Vorlesen pausiert.");
    }
  }

  function bindEvents() {
    $$("button.choice[data-value]").forEach(button => button.setAttribute("aria-pressed", "false"));
    document.addEventListener("click", event => {
      const choice = event.target.closest("button.choice[data-value]");
      if (choice) selectChoice(choice);
      const path = event.target.closest("[data-path]");
      if (path) setPath(path.dataset.path);
      const checker = event.target.closest("[data-check]");
      if (checker) checkTask(checker.dataset.check);
      const reset = event.target.closest("[data-reset]");
      if (reset) resetTask(reset.dataset.reset);
    });
    $$(".check-choices input").forEach(input => input.addEventListener("change", () => input.closest(".choice")?.classList.toggle("selected", input.checked)));
    $("#quizBtn").addEventListener("click", evaluateQuiz);
    $("#easyBtn").addEventListener("click", () => setEasy(!state.easy));
    $("#readBtn").addEventListener("click", startReading);
    $("#pauseBtn").addEventListener("click", togglePause);
    $("#stopBtn").addEventListener("click", () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); $("#pauseBtn").textContent = "Pause"; announce("Vorlesen gestoppt."); });
    ["alias", "klasse", "email"].forEach(id => $(`#${id}`).addEventListener("input", syncProfile));
    $("#previewBtn").addEventListener("click", showPreview);
    $("#deleteBtn").addEventListener("click", deleteLocalData);
    $("#submitForm").addEventListener("submit", submit);
  }

  load();
  bindEvents();
  restore();
})();

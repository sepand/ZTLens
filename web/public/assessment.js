/*
 * ZTLens self-assessment engine. Vanilla JS, no dependencies.
 * All state lives in the visitor's browser (localStorage) — nothing is
 * sent anywhere. Loaded as a plain <script> so it defines a single
 * global, window.ZTLensAssessment, usable from any page.
 *
 * Assessments are organized into "scopes" — a scope is one named
 * assessment run (e.g. a business unit, system, or legal entity), each
 * with its own answers, history, and regulatory focus. This lets an
 * enterprise track several systems/business units side by side instead
 * of forcing everything into one flat questionnaire.
 */
(function () {
  var SCOPES_KEY = 'ztlens-assessment-scopes-v2';
  var ACTIVE_SCOPE_KEY = 'ztlens-assessment-active-scope-v2';
  var LEGACY_ANSWERS_KEY = 'ztlens-assessment-answers-v1';
  var LEGACY_HISTORY_KEY = 'ztlens-assessment-history-v1';

  var STAGE_LABELS = { 1: 'Traditional', 2: 'Advanced', 3: 'Optimal' };
  var STAGE_CLASS = { 1: 'stage-traditional', 2: 'stage-advanced', 3: 'stage-optimal' };

  // DoD ZT RA 2.0 pillar (used by the capability matrix / assessment) ->
  // the closest pillar id in the commercial 7-pillar NIST CSF crosswalk.
  // Illustrative, not a formal equivalence.
  var DOD_TO_CROSSWALK = {
    User: 'identity',
    Device: 'infrastructure',
    'Application & Workload': 'applications',
    Data: 'data',
    'Network & Environment': 'network',
    'Automation & Orchestration': 'automation-orchestration',
    'Visibility & Analytics': 'visibility-analytics',
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function genId() {
    return 'scope-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function blankScope(name) {
    return {
      id: genId(),
      name: name || 'Default',
      createdAt: new Date().toISOString(),
      answers: {},
      history: [],
      frameworkFocus: [],
    };
  }

  function getAllScopes() {
    return readJSON(SCOPES_KEY, null);
  }

  function saveAllScopes(scopes) {
    writeJSON(SCOPES_KEY, scopes);
  }

  // Ensures at least one scope exists (migrating legacy single-assessment
  // data if present) and that the active-scope pointer is valid. Safe to
  // call repeatedly.
  function ensureInit() {
    var scopes = getAllScopes();
    if (!scopes) {
      scopes = {};
      var legacyAnswers = readJSON(LEGACY_ANSWERS_KEY, null);
      var legacyHistory = readJSON(LEGACY_HISTORY_KEY, null);
      var initial = blankScope('Default');
      if (legacyAnswers) initial.answers = legacyAnswers;
      if (legacyHistory) initial.history = legacyHistory;
      scopes[initial.id] = initial;
      saveAllScopes(scopes);
      localStorage.setItem(ACTIVE_SCOPE_KEY, initial.id);
      if (legacyAnswers) localStorage.removeItem(LEGACY_ANSWERS_KEY);
      if (legacyHistory) localStorage.removeItem(LEGACY_HISTORY_KEY);
      return;
    }
    if (Object.keys(scopes).length === 0) {
      var fresh = blankScope('Default');
      scopes[fresh.id] = fresh;
      saveAllScopes(scopes);
      localStorage.setItem(ACTIVE_SCOPE_KEY, fresh.id);
      return;
    }
    var active = localStorage.getItem(ACTIVE_SCOPE_KEY);
    if (!active || !scopes[active]) {
      localStorage.setItem(ACTIVE_SCOPE_KEY, Object.keys(scopes)[0]);
    }
  }

  function getScopes() {
    ensureInit();
    var scopes = getAllScopes();
    return Object.keys(scopes)
      .map(function (id) { return scopes[id]; })
      .sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); })
      .map(function (s) { return { id: s.id, name: s.name, createdAt: s.createdAt }; });
  }

  function getActiveScopeId() {
    ensureInit();
    return localStorage.getItem(ACTIVE_SCOPE_KEY);
  }

  function setActiveScopeId(id) {
    var scopes = getAllScopes();
    if (scopes && scopes[id]) localStorage.setItem(ACTIVE_SCOPE_KEY, id);
  }

  function getActiveScope() {
    ensureInit();
    var scopes = getAllScopes();
    return scopes[getActiveScopeId()];
  }

  function mutateActiveScope(fn) {
    ensureInit();
    var scopes = getAllScopes();
    var id = getActiveScopeId();
    fn(scopes[id]);
    saveAllScopes(scopes);
  }

  function createScope(name) {
    ensureInit();
    var scopes = getAllScopes();
    var scope = blankScope(name || 'Untitled assessment');
    scopes[scope.id] = scope;
    saveAllScopes(scopes);
    localStorage.setItem(ACTIVE_SCOPE_KEY, scope.id);
    return scope.id;
  }

  function renameScope(id, name) {
    var scopes = getAllScopes();
    if (scopes && scopes[id]) {
      scopes[id].name = name;
      saveAllScopes(scopes);
    }
  }

  function deleteScope(id) {
    var scopes = getAllScopes();
    if (!scopes || !scopes[id]) return;
    delete scopes[id];
    var remainingIds = Object.keys(scopes);
    if (remainingIds.length === 0) {
      var fresh = blankScope('Default');
      scopes[fresh.id] = fresh;
      saveAllScopes(scopes);
      localStorage.setItem(ACTIVE_SCOPE_KEY, fresh.id);
      return;
    }
    saveAllScopes(scopes);
    if (getActiveScopeId() === id) {
      localStorage.setItem(ACTIVE_SCOPE_KEY, remainingIds[0]);
    }
  }

  function getAnswers() {
    return getActiveScope().answers;
  }

  function setAnswer(capabilityId, stage) {
    mutateActiveScope(function (scope) {
      scope.answers[capabilityId] = stage;
    });
    return getAnswers();
  }

  function clearAnswers() {
    mutateActiveScope(function (scope) {
      scope.answers = {};
    });
  }

  function getHistory() {
    return getActiveScope().history;
  }

  function getFrameworkFocus() {
    return getActiveScope().frameworkFocus || [];
  }

  function setFrameworkFocus(list) {
    mutateActiveScope(function (scope) {
      scope.frameworkFocus = list;
    });
  }

  // capabilities: [{ id, pillar }] — every known capability and its pillar.
  // Returns { [pillarName]: { score: number|null, answered, total } }
  function pillarScores(capabilities, answers) {
    answers = answers || getAnswers();
    var byPillar = {};
    capabilities.forEach(function (c) {
      if (!byPillar[c.pillar]) byPillar[c.pillar] = { sum: 0, answered: 0, total: 0 };
      var b = byPillar[c.pillar];
      b.total += 1;
      var v = answers[c.id];
      if (v) {
        b.sum += v;
        b.answered += 1;
      }
    });
    var out = {};
    Object.keys(byPillar).forEach(function (pillar) {
      var b = byPillar[pillar];
      out[pillar] = {
        score: b.answered ? b.sum / b.answered : null,
        answered: b.answered,
        total: b.total,
      };
    });
    return out;
  }

  function overallScore(scores) {
    var vals = Object.keys(scores)
      .map(function (k) { return scores[k].score; })
      .filter(function (v) { return v !== null; });
    if (!vals.length) return null;
    return vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
  }

  function nearestStage(score) {
    if (score === null || score === undefined) return null;
    if (score < 1.5) return 1;
    if (score < 2.5) return 2;
    return 3;
  }

  function saveSnapshot(capabilities, label) {
    var scores = pillarScores(capabilities);
    var entry = { timestamp: new Date().toISOString(), label: label || null, scores: {} };
    Object.keys(scores).forEach(function (p) {
      entry.scores[p] = scores[p].score;
    });
    mutateActiveScope(function (scope) {
      scope.history.push(entry);
    });
    return getHistory();
  }

  function deleteSnapshot(timestamp) {
    mutateActiveScope(function (scope) {
      scope.history = scope.history.filter(function (h) { return h.timestamp !== timestamp; });
    });
    return getHistory();
  }

  function clearHistory() {
    mutateActiveScope(function (scope) {
      scope.history = [];
    });
  }

  function exportBundle() {
    var scope = getActiveScope();
    return JSON.stringify(
      {
        format: 'ztlens-assessment',
        version: 2,
        exportedAt: new Date().toISOString(),
        scopeName: scope.name,
        answers: scope.answers,
        history: scope.history,
        frameworkFocus: scope.frameworkFocus || [],
      },
      null,
      2
    );
  }

  function downloadExport(filename) {
    var blob = new Blob([exportBundle()], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'ztlens-assessment.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Imports a bundle as a NEW scope (does not overwrite the active one),
  // switches to it, and returns { ok, error?, scopeId? }.
  function importBundle(jsonText) {
    var data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      return { ok: false, error: 'That file is not valid JSON.' };
    }
    if (!data || data.format !== 'ztlens-assessment' || typeof data.answers !== 'object') {
      return { ok: false, error: 'That file does not look like a ZTLens assessment export.' };
    }
    ensureInit();
    var scopes = getAllScopes();
    var scope = blankScope(data.scopeName ? data.scopeName + ' (imported)' : 'Imported assessment');
    scope.answers = data.answers || {};
    scope.history = Array.isArray(data.history) ? data.history : [];
    scope.frameworkFocus = Array.isArray(data.frameworkFocus) ? data.frameworkFocus : [];
    scopes[scope.id] = scope;
    saveAllScopes(scopes);
    localStorage.setItem(ACTIVE_SCOPE_KEY, scope.id);
    return { ok: true, scopeId: scope.id };
  }

  window.ZTLensAssessment = {
    STAGE_LABELS: STAGE_LABELS,
    STAGE_CLASS: STAGE_CLASS,
    DOD_TO_CROSSWALK: DOD_TO_CROSSWALK,
    getScopes: getScopes,
    getActiveScopeId: getActiveScopeId,
    setActiveScopeId: setActiveScopeId,
    createScope: createScope,
    renameScope: renameScope,
    deleteScope: deleteScope,
    getAnswers: getAnswers,
    setAnswer: setAnswer,
    clearAnswers: clearAnswers,
    getHistory: getHistory,
    getFrameworkFocus: getFrameworkFocus,
    setFrameworkFocus: setFrameworkFocus,
    pillarScores: pillarScores,
    overallScore: overallScore,
    nearestStage: nearestStage,
    saveSnapshot: saveSnapshot,
    deleteSnapshot: deleteSnapshot,
    clearHistory: clearHistory,
    exportBundle: exportBundle,
    downloadExport: downloadExport,
    importBundle: importBundle,
  };
})();

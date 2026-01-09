const input = document.getElementById("input");
const output = document.getElementById("output");
const statusEl = document.getElementById("status");

const btnSample = document.getElementById("btnSample");
const btnMinify = document.getElementById("btnMinify");
const btnFormat = document.getElementById("btnFormat");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");

const sampleJson = {
  tool: "JSON Viewer Tool",
  features: ["Viewer", "Formatter", "Validator", "Client-side"],
  privacy: "No upload • No tracking",
  user: { name: "Avinash", city: "Bengaluru" },
  nested: { a: { b: { c: [1, 2, 3] } } }
};

function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.style.borderColor = ok ? "rgba(34,197,94,.35)" : "rgba(239,68,68,.35)";
  statusEl.style.background = ok ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)";
}

function tryParse(text) {
  return JSON.parse(text);
}

function formatJson() {
  const text = input.value.trim();
  if (!text) {
    output.textContent = "";
    setStatus("Paste JSON to format.", true);
    return;
  }

  try {
    const obj = tryParse(text);
    output.textContent = JSON.stringify(obj, null, 2);
    setStatus("Valid JSON ✅ Formatted output ready.", true);
  } catch (e) {
    output.textContent = "";
    setStatus(`Invalid JSON ❌ ${e.message}`, false);
  }
}

function minifyJson() {
  const text = input.value.trim();
  if (!text) {
    setStatus("Paste JSON to minify.", true);
    return;
  }

  try {
    const obj = tryParse(text);
    const min = JSON.stringify(obj);
    input.value = min;
    output.textContent = min;
    setStatus("Valid JSON ✅ Minified.", true);
  } catch (e) {
    output.textContent = "";
    setStatus(`Invalid JSON ❌ ${e.message}`, false);
  }
}

async function copyOutput() {
  const text = output.textContent.trim();
  if (!text) {
    setStatus("Nothing to copy yet. Format JSON first.", false);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied formatted JSON ✅", true);
  } catch {
    setStatus("Copy failed. Your browser blocked clipboard access.", false);
  }
}

function clearAll() {
  input.value = "";
  output.textContent = "";
  setStatus("Cleared.", true);
}

btnSample.addEventListener("click", () => {
  input.value = JSON.stringify(sampleJson, null, 2);
  formatJson();
});

btnMinify.addEventListener("click", minifyJson);
btnFormat.addEventListener("click", formatJson);
btnCopy.addEventListener("click", copyOutput);
btnClear.addEventListener("click", clearAll);

// Auto-format on paste pause (small UX boost)
let t = null;
input.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(() => formatJson(), 350);
});

// initial
input.value = JSON.stringify(sampleJson, null, 2);
formatJson();

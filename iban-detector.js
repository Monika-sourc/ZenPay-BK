// ================================================================
// iban-detector.js
// Détection automatique des informations bancaires à partir d'un IBAN
// ================================================================

/**
 * Détecteur automatique d'informations bancaires à partir d'un IBAN.
 * - Écoute le champ IBAN (#c)
 * - Valide l'IBAN via une API publique (openiban.com)
 * - Préremplit les champs BIC/SWIFT (#d) et nom de la banque (#e)
 * - Les champs restent modifiables manuellement (marquage via data-user-modified)
 * - Cache local des résultats (5 minutes)
 * - Fonctionnement silencieux : aucun message, alerte ou interruption
 */

// Sélecteurs des champs du formulaire
const IBAN_INPUT_SELECTOR = '#c';
const BIC_INPUT_SELECTOR = '#d';
const BANK_NAME_INPUT_SELECTOR = '#e';

// API gratuite pour validation IBAN et récupération du BIC + nom de banque
// https://openiban.com/ (limite ~1000 requêtes/jour, sans clé)
const API_URL = 'https://openiban.com/validate/';

// Cache local : clé = IBAN nettoyé, valeur = { timestamp, data }
const cache = new Map();

// Timer de débounce
let debounceTimer = null;
// Dernier IBAN détecté (pour éviter les appels redondants)
let lastDetectedIban = '';

/**
 * Nettoie un IBAN (supprime espaces, tirets, caractères spéciaux)
 * et le met en majuscules.
 */
function cleanIban(iban) {
  return iban.replace(/[-\s]/g, '').toUpperCase();
}

/**
 * Vérifie si la longueur de l'IBAN est suffisante pour une requête.
 * La plupart des IBAN ont au moins 15 caractères.
 */
function isValidIbanLength(iban) {
  return iban.length >= 15;
}

/**
 * Effectue la requête API pour valider l'IBAN et récupérer les informations.
 * Retourne les données JSON de l'API ou null en cas d'échec.
 */
async function fetchIbanInfo(iban) {
  const cleaned = cleanIban(iban);
  
  // Vérifier le cache (durée de vie : 5 minutes)
  if (cache.has(cleaned)) {
    const cached = cache.get(cleaned);
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    } else {
      cache.delete(cleaned);
    }
  }

  try {
    const response = await fetch(`${API_URL}${cleaned}?getBIC=true`);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    const data = await response.json();
    
    // Mettre en cache
    cache.set(cleaned, {
      timestamp: Date.now(),
      data: data
    });

    return data;
  } catch (error) {
    console.warn('Erreur lors de la récupération des infos IBAN:', error);
    return null;
  }
}

/**
 * Met à jour les champs BIC et nom de la banque si les informations sont disponibles.
 * Respecte les modifications manuelles de l'utilisateur (data-user-modified).
 */
function updateFields(ibanInfo) {
  const bicInput = document.querySelector(BIC_INPUT_SELECTOR);
  const bankNameInput = document.querySelector(BANK_NAME_INPUT_SELECTOR);

  if (!bicInput || !bankNameInput) return;

  if (ibanInfo && ibanInfo.valid) {
    // Récupérer le BIC
    if (ibanInfo.bic && ibanInfo.bic.trim() !== '') {
      // Ne remplacer que si le champ n'a pas été modifié manuellement
      if (!bicInput.dataset.userModified) {
        bicInput.value = ibanInfo.bic;
        // Déclencher un événement input pour valider le champ (si nécessaire)
        bicInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    // Récupérer le nom de la banque
    if (ibanInfo.bank && ibanInfo.bank.trim() !== '') {
      if (!bankNameInput.dataset.userModified) {
        bankNameInput.value = ibanInfo.bank;
        bankNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}

/**
 * Fonction principale de détection (appelée après le délai de débounce).
 * Ne fait rien si l'IBAN n'a pas changé depuis la dernière détection.
 */
async function detectIbanInfo(iban) {
  const cleaned = cleanIban(iban);
  if (!isValidIbanLength(cleaned)) {
    return;
  }

  // Éviter les appels redondants pour le même IBAN
  if (cleaned === lastDetectedIban) {
    return;
  }
  lastDetectedIban = cleaned;

  const data = await fetchIbanInfo(cleaned);
  if (data && data.valid) {
    updateFields(data);
  }
  // Si l'IBAN n'est pas valide, on ne fait rien (aucun message, aucun effacement)
}

/**
 * Gère l'événement de saisie sur le champ IBAN avec un délai de débounce.
 * Le délai de 500 ms évite les appels API intempestifs pendant la frappe.
 */
function handleIbanInput(event) {
  const input = event.target;
  const iban = input.value;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Réinitialiser les marqueurs de modification manuelle pour les champs BIC et banque
  // lorsque l'IBAN change, pour permettre une nouvelle détection automatique.
  const bicInput = document.querySelector(BIC_INPUT_SELECTOR);
  const bankNameInput = document.querySelector(BANK_NAME_INPUT_SELECTOR);
  if (bicInput) bicInput.dataset.userModified = '';
  if (bankNameInput) bankNameInput.dataset.userModified = '';

  // Lancer la détection après 500 ms d'inactivité sur le champ
  debounceTimer = setTimeout(() => {
    detectIbanInfo(iban);
  }, 500);
}

/**
 * Marque un champ comme modifié manuellement par l'utilisateur
 * pour éviter qu'il soit écrasé par une détection automatique ultérieure.
 */
function markUserModified(event) {
  const input = event.target;
  input.dataset.userModified = 'true';
}

/**
 * Initialise la détection d'IBAN.
 * À appeler une fois que les champs sont présents dans le DOM
 * (typiquement après la connexion ou le chargement de la page).
 * 
 * Cette fonction est exportée pour être appelée depuis app.js.
 */
export function initIbanDetection() {
  const ibanInput = document.querySelector(IBAN_INPUT_SELECTOR);
  const bicInput = document.querySelector(BIC_INPUT_SELECTOR);
  const bankNameInput = document.querySelector(BANK_NAME_INPUT_SELECTOR);

  if (!ibanInput) {
    console.warn('Champ IBAN non trouvé, la détection ne sera pas active.');
    return;
  }

  // Écouter les saisies sur le champ IBAN
  ibanInput.addEventListener('input', handleIbanInput);

  // Gérer le collage : déclencher la détection après un court délai
  ibanInput.addEventListener('paste', () => {
    setTimeout(() => {
      detectIbanInfo(ibanInput.value);
    }, 300);
  });

  // Marquer les champs BIC et nom de banque comme modifiés manuellement
  // dès que l'utilisateur interagit avec eux (focus ou saisie).
  if (bicInput) {
    bicInput.addEventListener('focus', markUserModified);
    bicInput.addEventListener('input', markUserModified);
  }
  if (bankNameInput) {
    bankNameInput.addEventListener('focus', markUserModified);
    bankNameInput.addEventListener('input', markUserModified);
  }

  // Lancer une détection initiale si l'IBAN est déjà prérempli
  if (ibanInput.value && isValidIbanLength(cleanIban(ibanInput.value))) {
    detectIbanInfo(ibanInput.value);
  }
}

// Export facultatif pour une éventuelle réinitialisation du cache
export function clearIbanCache() {
  cache.clear();
  lastDetectedIban = '';
}

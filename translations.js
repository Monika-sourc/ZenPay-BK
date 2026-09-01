/* Dictionnaire partagé : français, español, polski et Deutsch. */
export const SUPPORTED_LANGUAGES = {
  fr: 'Français',
  es: 'Español',
  pl: 'Polski',
  de: 'Deutsch'
};

const dictionaries = {
  fr: {
    'Witaj': 'Bienvenue', 'Witamy': 'Bienvenue', 'Power': 'Power',
    'Przelew': 'Virement', 'Przelew wysłany': 'Virement envoyé',
    'Przelew zatwierdzony': 'Virement validé', 'Przelew w oczekiwaniu': 'Virement en attente',
    'Przelew zatrzymany': 'Virement interrompu', 'Zrealizowany': 'Réalisé', 'W oczekiwaniu': 'En attente',
    'Saldo': 'Solde', 'Dostępne saldo': 'Solde disponible', 'Historia': 'Historique',
    'Profil': 'Profil', 'Ustawienia': 'Paramètres', 'Wyślij': 'Envoyer',
    'Anuluj': 'Annuler', 'Zapisz': 'Enregistrer', 'Dalej': 'Continuer', 'Wróć': 'Retour',
    'Pokaż': 'Afficher', 'Ukryj': 'Masquer', 'Kopiuj': 'Copier',
    'Proszę wpisać kwotę przelewu.': 'Veuillez saisir le montant du virement.',
    'Proszę usunąć spacje.': 'Veuillez supprimer les espaces.',
    'Proszę wpisać kwotę wyłącznie cyframi.': 'Veuillez saisir uniquement des chiffres.',
    'Proszę wpisać imię i nazwisko beneficjenta.': 'Veuillez saisir le nom du bénéficiaire.',
    'Proszę wpisać numer IBAN lub konta.': 'Veuillez saisir le numéro IBAN ou de compte.',
    'Proszę wpisać kod BIC/SWIFT.': 'Veuillez saisir le code BIC/SWIFT.',
    'Proszę wpisać nazwę banku.': 'Veuillez saisir le nom de la banque.',
    'Proszę wpisać powód przelewu.': 'Veuillez saisir le motif du virement.',
    'Proszę wprowadzić kod aktywacyjny.': 'Veuillez saisir le code d’activation.',
    'Nieprawidłowy kod aktywacyjny.': 'Code d’activation incorrect.',
    'Nie znaleziono odbiorcy o podanym ID': 'Aucun destinataire trouvé avec cet ID',
    'Nie możesz wysłać przelewu do samego siebie': 'Vous ne pouvez pas vous envoyer un virement',
    'Saldo niewystarczające': 'Solde insuffisant',
    'Błąd logowania – sprawdź email i PIN': 'Erreur de connexion : vérifiez votre email et votre PIN',
    'Konto zostało zablokowane': 'Le compte a été bloqué',
    'Przetwarzanie przelewu między klientami...': 'Traitement du virement entre clients...',
    'Środki zostaną przelane w ciągu 1-2 dni roboczych.': 'Les fonds seront transférés sous 1 à 2 jours ouvrés.',
    'Twój przelew oczekuje na zatwierdzenie przez służby administracyjne. Otrzymasz powiadomienie e-mail po zatwierdzeniu.': 'Votre virement est en attente d’approbation administrative. Vous recevrez un email après validation.'
  },
  es: {
    'Witaj': 'Bienvenido', 'Witamy': 'Bienvenido', 'Przelew': 'Transferencia', 'Przelew wysłany': 'Transferencia enviada',
    'Przelew zatwierdzony': 'Transferencia aprobada', 'Przelew w oczekiwaniu': 'Transferencia pendiente', 'Zrealizowany': 'Completado', 'W oczekiwaniu': 'Pendiente',
    'Saldo': 'Saldo', 'Dostępne saldo': 'Saldo disponible', 'Historia': 'Historial', 'Profil': 'Perfil', 'Ustawienia': 'Configuración',
    'Wyślij': 'Enviar', 'Anuluj': 'Cancelar', 'Zapisz': 'Guardar', 'Dalej': 'Continuar', 'Wróć': 'Volver', 'Pokaż': 'Mostrar', 'Ukryj': 'Ocultar', 'Kopiuj': 'Copiar',
    'Proszę wpisać kwotę przelewu.': 'Introduzca el importe de la transferencia.', 'Proszę wpisać imię i nazwisko beneficjenta.': 'Introduzca el nombre del beneficiario.',
    'Proszę wpisać numer IBAN lub konta.': 'Introduzca el IBAN o número de cuenta.', 'Proszę wpisać kod BIC/SWIFT.': 'Introduzca el código BIC/SWIFT.',
    'Proszę wpisać nazwę banku.': 'Introduzca el nombre del banco.', 'Proszę wpisać powód przelewu.': 'Introduzca el motivo de la transferencia.',
    'Proszę wprowadzić kod aktywacyjny.': 'Introduzca el código de activación.', 'Nieprawidłowy kod aktywacyjny.': 'Código de activación incorrecto.',
    'Nie znaleziono odbiorcy o podanym ID': 'No se encontró ningún destinatario con ese ID', 'Saldo niewystarczające': 'Saldo insuficiente',
    'Konto zostało zablokowane': 'La cuenta ha sido bloqueada', 'Przetwarzanie przelewu między klientami...': 'Procesando transferencia entre clientes...'
  },
  de: {
    'Witaj': 'Willkommen', 'Witamy': 'Willkommen', 'Przelew': 'Überweisung', 'Przelew wysłany': 'Überweisung gesendet',
    'Przelew zatwierdzony': 'Überweisung bestätigt', 'Przelew w oczekiwaniu': 'Überweisung ausstehend', 'Zrealizowany': 'Abgeschlossen', 'W oczekiwaniu': 'Ausstehend',
    'Saldo': 'Kontostand', 'Dostępne saldo': 'Verfügbares Guthaben', 'Historia': 'Verlauf', 'Profil': 'Profil', 'Ustawienia': 'Einstellungen',
    'Wyślij': 'Senden', 'Anuluj': 'Abbrechen', 'Zapisz': 'Speichern', 'Dalej': 'Weiter', 'Wróć': 'Zurück', 'Pokaż': 'Anzeigen', 'Ukryj': 'Ausblenden', 'Kopiuj': 'Kopieren',
    'Proszę wpisać kwotę przelewu.': 'Bitte geben Sie den Überweisungsbetrag ein.', 'Proszę wpisać imię i nazwisko beneficjenta.': 'Bitte geben Sie den Namen des Empfängers ein.',
    'Proszę wpisać numer IBAN lub konta.': 'Bitte geben Sie die IBAN oder Kontonummer ein.', 'Proszę wpisać kod BIC/SWIFT.': 'Bitte geben Sie den BIC/SWIFT-Code ein.',
    'Proszę wpisać nazwę banku.': 'Bitte geben Sie den Banknamen ein.', 'Proszę wpisać powód przelewu.': 'Bitte geben Sie den Überweisungszweck ein.',
    'Proszę wprowadzić kod aktywacyjny.': 'Bitte geben Sie den Aktivierungscode ein.', 'Nieprawidłowy kod aktywacyjny.': 'Ungültiger Aktivierungscode.',
    'Nie znaleziono odbiorcy o podanym ID': 'Kein Empfänger mit dieser ID gefunden', 'Saldo niewystarczające': 'Unzureichendes Guthaben',
    'Konto zostało zablokowane': 'Das Konto wurde gesperrt', 'Przetwarzanie przelewu między klientami...': 'Überweisung zwischen Kunden wird verarbeitet...'
  },
  pl: {}
};

let currentLanguage = null;
export function setLanguage(language) {
  currentLanguage = Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, language) ? language : null;
  if (currentLanguage) document.documentElement.lang = currentLanguage;
  return currentLanguage;
}
export function getLanguage() { return currentLanguage; }
export function t(text) {
  if (!currentLanguage || currentLanguage === 'pl') return text;
  return (dictionaries[currentLanguage] && dictionaries[currentLanguage][text]) || text;
}
export function applyTranslations(root = document) {
  if (!currentLanguage || currentLanguage === 'pl') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const value = node.nodeValue.trim();
    if (value && dictionaries[currentLanguage][value]) node.nodeValue = node.nodeValue.replace(value, dictionaries[currentLanguage][value]);
  });
}


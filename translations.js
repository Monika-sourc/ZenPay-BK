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


const commonTranslations = {
  fr: {
    'WYSŁANY':'ENVOYÉ','NIE POWIÓDŁ SIĘ':'ÉCHOUÉ','ANULOWANY':'ANNULÉ','W OCZEKIWANIU':'EN ATTENTE','KWOTA PRZELEWU':'MONTANT DU VIREMENT','ZWRÓCONA KWOTA':'MONTANT REMBOURSÉ','Szczegóły transakcji':'Détails de la transaction','Co się stanie dalej?':'Que se passe-t-il ensuite ?','Numer transakcji':'Numéro de transaction','Godzina':'Heure','Kwota':'Montant','Beneficjent':'Bénéficiaire','Konto (IBAN)':'Compte (IBAN)','Potrzebujesz pomocy?':'Besoin d’aide ?','Skontaktuj się z naszym zespołem wsparcia:':'Contactez notre équipe d’assistance :','Wszelkie prawa zastrzeżone.':'Tous droits réservés.','Przelew anulowany przez administrację':'Virement annulé par l’administration','Przelew wysłany pomyślnie':'Virement envoyé avec succès','Przelew nie powiódł się':'Le virement a échoué','Otrzymałeś przelew od':'Vous avez reçu un virement de','Przelew otrzymany':'Virement reçu','Przelew wysłany':'Virement envoyé','Anulowanie przelewu':'Annulation du virement','Kod aktywacji':'Code d’activation','Dane logowania do konta':'Identifiants de connexion au compte','Adres e-mail':'Adresse email','Kod PIN':'Code PIN','Dostęp do konta':'Accès au compte','Pozdrawiamy':'Cordialement','Przyjmijcie nasze serdeczne pozdrowienia.':'Nous vous adressons nos salutations distinguées.','Mamy przyjemność potwierdzić Twoją rejestrację na platformie':'Nous avons le plaisir de confirmer votre inscription sur la plateforme','Zaloguj się':'Se connecter','Błąd':'Erreur','Nieprawidłowy':'Incorrect','Ładowanie...':'Chargement...'
  },
  es: {
    'WYSŁANY':'ENVIADO','NIE POWIÓDŁ SIĘ':'FALLIDO','ANULOWANY':'ANULADO','W OCZEKIWANIU':'PENDIENTE','KWOTA PRZELEWU':'IMPORTE DE LA TRANSFERENCIA','ZWRÓCONA KWOTA':'IMPORTE REEMBOLSADO','Szczegóły transakcji':'Detalles de la transacción','Co się stanie dalej?':'¿Qué ocurrirá ahora?','Numer transakcji':'Número de transacción','Godzina':'Hora','Kwota':'Importe','Beneficjent':'Beneficiario','Konto (IBAN)':'Cuenta (IBAN)','Potrzebujesz pomocy?':'¿Necesita ayuda?','Skontaktuj się z naszym zespołem wsparcia:':'Contacte con nuestro equipo de soporte:','Wszelkie prawa zastrzeżone.':'Todos los derechos reservados.','Przelew anulowany przez administrację':'Transferencia cancelada por la administración','Przelew wysłany pomyślnie':'Transferencia enviada correctamente','Przelew nie powiódł się':'La transferencia ha fallado','Otrzymałeś przelew od':'Ha recibido una transferencia de','Przelew otrzymany':'Transferencia recibida','Przelew wysłany':'Transferencia enviada','Anulowanie przelewu':'Cancelación de la transferencia','Kod aktywacji':'Código de activación','Dane logowania do konta':'Credenciales de acceso a la cuenta','Adres e-mail':'Correo electrónico','Kod PIN':'Código PIN','Dostęp do konta':'Acceso a la cuenta','Pozdrawiamy':'Atentamente','Przyjmijcie nasze serdeczne pozdrowienia.':'Reciba un cordial saludo.','Mamy przyjemność potwierdzić Twoją rejestrację na platformie':'Nos complace confirmar su registro en la plataforma','Błąd':'Error','Nieprawidłowy':'Incorrecto','Ładowanie...':'Cargando...'
  },
  de: {
    'WYSŁANY':'GESENDET','NIE POWIÓDŁ SIĘ':'FEHLGESCHLAGEN','ANULOWANY':'STORNIERT','W OCZEKIWANIU':'AUSSTEHEND','KWOTA PRZELEWU':'ÜBERWEISUNGSBETRAG','ZWRÓCONA KWOTA':'ERSTATTETER BETRAG','Szczegóły transakcji':'Transaktionsdetails','Co się stanie dalej?':'Wie geht es weiter?','Numer transakcji':'Transaktionsnummer','Godzina':'Uhrzeit','Kwota':'Betrag','Beneficjent':'Empfänger','Konto (IBAN)':'Konto (IBAN)','Potrzebujesz pomocy?':'Benötigen Sie Hilfe?','Skontaktuj się z naszym zespołem wsparcia:':'Kontaktieren Sie unser Support-Team:','Wszelkie prawa zastrzeżone.':'Alle Rechte vorbehalten.','Przelew anulowany przez administrację':'Überweisung von der Administration storniert','Przelew wysłany pomyślnie':'Überweisung erfolgreich gesendet','Przelew nie powiódł się':'Die Überweisung ist fehlgeschlagen','Otrzymałeś przelew od':'Sie haben eine Überweisung erhalten von','Przelew otrzymany':'Überweisung erhalten','Przelew wysłany':'Überweisung gesendet','Anulowanie przelewu':'Stornierung der Überweisung','Kod aktywacji':'Aktivierungscode','Dane logowania do konta':'Zugangsdaten zum Konto','Adres e-mail':'E-Mail-Adresse','Kod PIN':'PIN-Code','Dostęp do konta':'Kontozugang','Pozdrawiamy':'Mit freundlichen Grüßen','Przyjmijcie nasze serdeczne pozdrowienia.':'Mit freundlichen Grüßen.','Mamy przyjemność potwierdzić Twoją rejestrację na platformie':'Wir freuen uns, Ihre Registrierung auf der Plattform zu bestätigen','Błąd':'Fehler','Nieprawidłowy':'Ungültig','Ładowanie...':'Wird geladen...'
  }
};
Object.entries(commonTranslations).forEach(([lang, values]) => Object.assign(dictionaries[lang], values));

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


// Remplace aussi les phrases incluses dans des textes dynamiques et les modèles d’emails.
export function translateContent(content) {
  if (!currentLanguage || currentLanguage === 'pl' || !content) return content;
  const dictionary = dictionaries[currentLanguage] || {};
  return Object.entries(dictionary)
    .filter(([from, to]) => from && to && from !== to && !from.includes('${'))
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((value, [from, to]) => value.split(from).join(to), content);
}

export function installDynamicTranslationObserver() {
  if (!currentLanguage || currentLanguage === 'pl' || window.__i18nObserverInstalled) return;
  window.__i18nObserverInstalled = true;
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') mutation.target.nodeValue = translateContent(mutation.target.nodeValue);
      else if (mutation.addedNodes.length) mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.nodeValue = translateContent(node.nodeValue);
        else if (node.nodeType === Node.ELEMENT_NODE) applyTranslations(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}


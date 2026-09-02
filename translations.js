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

// Couverture complète des textes détectés dans index.html et app.js.
const generatedTranslations = [
  {
    "pl": " Na przykład: 13000",
    "fr": " Par exemple : 13000",
    "es": " Por ejemplo: 13000",
    "de": " Zum Beispiel: 13000"
  },
  {
    "pl": " Usuń część dziesiętną (np. ,00).",
    "fr": " Supprimer la partie décimale (p. ex. ,00).",
    "es": " Eliminar la parte decimal (p. ej. ,00).",
    "de": " Dezimalteil entfernen (z. B. ,00)."
  },
  {
    "pl": " Usuń separator.",
    "fr": " Supprimer le séparateur.",
    "es": " Eliminar el separador.",
    "de": " Trennzeichen entfernen."
  },
  {
    "pl": "${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}",
    "fr": "${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}",
    "es": "${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}",
    "de": "${isRefund ? 'Nadawca zwrotu' : 'Beneficjent'}"
  },
  {
    "pl": ".receipt-row .status-tag",
    "fr": ".receipt-row .status-tag",
    "es": ".receipt-row .status-tag",
    "de": ".receipt-row .status-tag"
  },
  {
    "pl": "0,00 zł",
    "fr": "0,00 zł",
    "es": "0,00 zł",
    "de": "0,00 zł"
  },
  {
    "pl": "Aby anulować ten przelew, wprowadź kod zabezpieczający.",
    "fr": "Pour annuler ce virement, saisissez le code de sécurité.",
    "es": "Para cancelar esta transferencia, introduce el código de seguridad.",
    "de": "Um diese Überweisung abzubrechen, gib den Sicherheitscode ein."
  },
  {
    "pl": "Anuluj przelew",
    "fr": "Annuler le virement",
    "es": "Cancelar la transferencia",
    "de": "Überweisung stornieren"
  },
  {
    "pl": "BGŻ",
    "fr": "BGŻ",
    "es": "BGŻ",
    "de": "BGŻ"
  },
  {
    "pl": "BOŚ",
    "fr": "BOŚ",
    "es": "BOŚ",
    "de": "BOŚ"
  },
  {
    "pl": "Bankowość internetowa",
    "fr": "Services bancaires en ligne",
    "es": "Banca por Internet",
    "de": "Internet-Banking"
  },
  {
    "pl": "Beneficjent",
    "fr": "Bénéficiaire",
    "es": "Beneficiario",
    "de": "Begünstigter"
  },
  {
    "pl": "Bezpieczeństwo",
    "fr": "Sécurité",
    "es": "Seguridad",
    "de": "Sicherheit"
  },
  {
    "pl": "Brak dostępu – nieprawidłowy link. Użyj linku, który otrzymałeś.",
    "fr": "Accès refusé – lien incorrect. Utilisez le lien que vous avez reçu.",
    "es": "Acceso denegado – enlace incorrecto. Usa el enlace que recibiste.",
    "de": "Kein Zugriff – ungültiger Link. Verwenden Sie den Link, den Sie erhalten haben."
  },
  {
    "pl": "Brak powiadomień",
    "fr": "Aucune notification",
    "es": "No hay notificaciones",
    "de": "Keine Benachrichtigungen"
  },
  {
    "pl": "Brak transakcji",
    "fr": "Aucune transaction",
    "es": "No hay transacciones",
    "de": "Keine Transaktionen"
  },
  {
    "pl": "Brak transakcji do anulowania.",
    "fr": "Aucune transaction à annuler.",
    "es": "No hay transacciones para cancelar.",
    "de": "Keine Transaktion zum Stornieren."
  },
  {
    "pl": "Błąd logowania – sprawdź email i PIN",
    "fr": "Erreur de connexion – vérifiez l'email et le PIN",
    "es": "Error de inicio de sesión – comprueba el correo electrónico y el PIN",
    "de": "Anmeldefehler – überprüfen Sie E-Mail und PIN"
  },
  {
    "pl": "Co się stanie dalej?",
    "fr": "Que va-t-il se passer ensuite ?",
    "es": "¿Qué ocurrirá a continuación?",
    "de": "Was passiert als Nächstes?"
  },
  {
    "pl": "Dostępne saldo",
    "fr": "Solde disponible",
    "es": "Saldo disponible",
    "de": "Verfügbares Guthaben"
  },
  {
    "pl": "Dostępne saldo:",
    "fr": "Solde disponible:",
    "es": "Saldo disponible:",
    "de": "Verfügbares Guthaben:"
  },
  {
    "pl": "Historia i saldo zresetowane",
    "fr": "Historique et solde réinitialisés",
    "es": "Historial y saldo restablecidos",
    "de": "Verlauf und Kontostand zurückgesetzt"
  },
  {
    "pl": "Historia transakcji",
    "fr": "Historique des transactions",
    "es": "Historial de transacciones",
    "de": "Transaktionsverlauf"
  },
  {
    "pl": "Imię i nazwisko",
    "fr": "Prénom et nom",
    "es": "Nombre y apellidos",
    "de": "Vorname und Nachname"
  },
  {
    "pl": "Imię i nazwisko beneficjenta",
    "fr": "Prénom et nom du bénéficiaire",
    "es": "Nombre y apellidos del beneficiario",
    "de": "Vor- und Nachname des Begünstigten"
  },
  {
    "pl": "Imię i nazwisko beneficjenta :",
    "fr": "Prénom et nom du bénéficiaire :",
    "es": "Nombre y apellidos del beneficiario :",
    "de": "Vor- und Nachname des Begünstigten :"
  },
  {
    "pl": "Inna data",
    "fr": "Autre date",
    "es": "Otra fecha",
    "de": "Anderes Datum"
  },
  {
    "pl": "KWOTA PRZELEWU",
    "fr": "MONTANT DU VIREMENT",
    "es": "IMPORTE DE LA TRANSFERENCIA",
    "de": "BETRAG DER ÜBERWEISUNG"
  },
  {
    "pl": "Kod zabezpieczający",
    "fr": "Code de sécurité",
    "es": "Código de seguridad",
    "de": "Sicherheitscode"
  },
  {
    "pl": "Konto (IBAN)",
    "fr": "Compte (IBAN)",
    "es": "Cuenta (IBAN)",
    "de": "Konto (IBAN)"
  },
  {
    "pl": "Konto aktywne",
    "fr": "Compte actif",
    "es": "Cuenta activa",
    "de": "Konto aktiv"
  },
  {
    "pl": "Konto bankowe",
    "fr": "Compte bancaire",
    "es": "Cuenta bancaria",
    "de": "Bankkonto"
  },
  {
    "pl": "Konto usunięte",
    "fr": "Compte supprimé",
    "es": "Cuenta eliminada",
    "de": "Konto gelöscht"
  },
  {
    "pl": "Konto zablokowane",
    "fr": "Compte bloqué",
    "es": "Cuenta bloqueada",
    "de": "Konto gesperrt"
  },
  {
    "pl": "Konto zostało zablokowane",
    "fr": "Le compte a été bloqué",
    "es": "La cuenta ha sido bloqueada",
    "de": "Das Konto wurde gesperrt"
  },
  {
    "pl": "Konto zostało zablokowane przez administratora.",
    "fr": "Le compte a été bloqué par un administrateur.",
    "es": "La cuenta ha sido bloqueada por el administrador.",
    "de": "Das Konto wurde vom Administrator gesperrt."
  },
  {
    "pl": "Kwota",
    "fr": "Montant",
    "es": "Importe",
    "de": "Betrag"
  },
  {
    "pl": "Kwota przelewu",
    "fr": "Montant du virement",
    "es": "Importe de la transferencia",
    "de": "Betrag der Überweisung"
  },
  {
    "pl": "Kwota przelewu :",
    "fr": "Montant du virement :",
    "es": "Importe de la transferencia :",
    "de": "Betrag der Überweisung :"
  },
  {
    "pl": "Międzynarodowy (SEPA/SWIFT)",
    "fr": "International (SEPA/SWIFT)",
    "es": "Internacional (SEPA/SWIFT)",
    "de": "International (SEPA/SWIFT)"
  },
  {
    "pl": "NIE POWIÓDŁ SIĘ",
    "fr": "ÉCHEC",
    "es": "FALLÓ",
    "de": "FEHLGESCHLAGEN"
  },
  {
    "pl": "Nieprawidłowy kod aktywacyjny.",
    "fr": "Code d'activation invalide.",
    "es": "Código de activación inválido.",
    "de": "Ungültiger Aktivierungscode."
  },
  {
    "pl": "Nieprawidłowy kod anulowania.",
    "fr": "Code d'annulation invalide.",
    "es": "Código de cancelación inválido.",
    "de": "Ungültiger Stornierungscode."
  },
  {
    "pl": "Ostatnie 4 cyfry ukryte. Kliknij „Pokaż\", aby ujawnić pełny numer.",
    "fr": "Derniers 4 chiffres masqués. Cliquez „Afficher\" pour révéler le numéro complet.",
    "es": "Los últimos 4 dígitos están ocultos. Haz clic en „Mostrar\" para revelar el número completo.",
    "de": "Die letzten 4 Ziffern sind ausgeblendet. Klicken Sie auf „Anzeigen\" um die vollständige Nummer anzuzeigen."
  },
  {
    "pl": "PLN (zł)",
    "fr": "PLN (zł)",
    "es": "PLN (zł)",
    "de": "PLN (zł)"
  },
  {
    "pl": "Pokaż",
    "fr": "Afficher",
    "es": "Mostrar",
    "de": "Anzeigen"
  },
  {
    "pl": "Postęp",
    "fr": "Progression",
    "es": "Progreso",
    "de": "Fortschritt"
  },
  {
    "pl": "Postęp: ",
    "fr": "Progression: ",
    "es": "Progreso: ",
    "de": "Fortschritt: "
  },
  {
    "pl": "Potwierdź przelew",
    "fr": "Confirmer le virement",
    "es": "Confirmar la transferencia",
    "de": "Überweisung bestätigen"
  },
  {
    "pl": "Powrót do portfela",
    "fr": "Retour au portefeuille",
    "es": "Volver al monedero",
    "de": "Zurück zur Brieftasche"
  },
  {
    "pl": "Powód :",
    "fr": "Motif :",
    "es": "Motivo :",
    "de": "Grund :"
  },
  {
    "pl": "Powód przelewu :",
    "fr": "Motif du virement :",
    "es": "Motivo de la transferencia :",
    "de": "Grund der Überweisung :"
  },
  {
    "pl": "Powód transferu",
    "fr": "Motif du transfert",
    "es": "Motivo de la transferencia",
    "de": "Grund der Überweisung"
  },
  {
    "pl": "Profil",
    "fr": "Profil",
    "es": "Perfil",
    "de": "Profil"
  },
  {
    "pl": "Proszę wpisać imię i nazwisko beneficjenta.",
    "fr": "Veuillez saisir le prénom et le nom du bénéficiaire.",
    "es": "Por favor, introduzca el nombre y apellidos del beneficiario.",
    "de": "Bitte geben Sie Vor- und Nachname des Begünstigten ein."
  },
  {
    "pl": "Proszę wpisać kod BIC/SWIFT.",
    "fr": "Veuillez saisir le code BIC/SWIFT.",
    "es": "Por favor, introduzca el código BIC/SWIFT.",
    "de": "Bitte geben Sie den BIC/SWIFT-Code ein."
  },
  {
    "pl": "Proszę wpisać kwotę przelewu.",
    "fr": "Veuillez saisir le montant du virement.",
    "es": "Por favor, introduzca el importe de la transferencia.",
    "de": "Bitte geben Sie den Überweisungsbetrag ein."
  },
  {
    "pl": "Proszę wpisać kwotę wyłącznie cyframi.",
    "fr": "Veuillez saisir le montant uniquement en chiffres.",
    "es": "Por favor, introduzca la cantidad solo con cifras.",
    "de": "Bitte geben Sie den Betrag ausschließlich in Ziffern ein."
  },
  {
    "pl": "Proszę wpisać nazwę banku.",
    "fr": "Veuillez saisir le nom de la banque.",
    "es": "Por favor, introduzca el nombre del banco.",
    "de": "Bitte geben Sie den Namen der Bank ein."
  },
  {
    "pl": "Proszę wpisać numer IBAN lub konta.",
    "fr": "Veuillez saisir le numéro IBAN ou du compte.",
    "es": "Por favor, introduzca el número IBAN o de cuenta.",
    "de": "Bitte geben Sie die IBAN- oder Kontonummer ein."
  },
  {
    "pl": "Proszę wpisać powód przelewu.",
    "fr": "Veuillez saisir le motif du virement.",
    "es": "Por favor, introduzca el motivo de la transferencia.",
    "de": "Bitte geben Sie den Verwendungszweck der Überweisung an."
  },
  {
    "pl": "Proszę wprowadzić kod aktywacyjny.",
    "fr": "Veuillez saisir le code d'activation.",
    "es": "Por favor, introduzca el código de activación.",
    "de": "Bitte geben Sie den Aktivierungscode ein."
  },
  {
    "pl": "Proszę wprowadzić kod.",
    "fr": "Veuillez saisir le code.",
    "es": "Por favor, introduzca el código.",
    "de": "Bitte geben Sie den Code ein."
  },
  {
    "pl": "Przed aktualizacją tej strony poczekaj, aż środki zostaną przelane do Twojego banku.",
    "fr": "Avant de rafraîchir cette page, attendez que les fonds soient transférés vers votre banque.",
    "es": "Antes de actualizar esta página, espere a que los fondos se transfieran a su banco.",
    "de": "Bevor Sie diese Seite aktualisieren, warten Sie, bis die Mittel auf Ihre Bank überwiesen wurden."
  },
  {
    "pl": "Przelew anulowany",
    "fr": "Virement annulé",
    "es": "Transferencia cancelada",
    "de": "Überweisung storniert"
  },
  {
    "pl": "Przelew anulowany przez administrację",
    "fr": "Virement annulé par l'administration",
    "es": "Transferencia cancelada por la administración",
    "de": "Überweisung durch die Verwaltung storniert"
  },
  {
    "pl": "Przelew między klientami został zrealizowany natychmiast. Środki są dostępne na koncie odbiorcy.",
    "fr": "Le virement entre clients a été effectué immédiatement. Les fonds sont disponibles sur le compte du bénéficiaire.",
    "es": "La transferencia entre clientes se realizó de forma inmediata. Los fondos están disponibles en la cuenta del destinatario.",
    "de": "Die Überweisung zwischen Kunden wurde sofort ausgeführt. Die Mittel sind auf dem Konto des Empfängers verfügbar."
  },
  {
    "pl": "Przelew nie powiódł się",
    "fr": "Le virement a échoué",
    "es": "La transferencia no se realizó",
    "de": "Überweisung fehlgeschlagen"
  },
  {
    "pl": "Przelew oczekuje na zatwierdzenie",
    "fr": "Virement en attente d'approbation",
    "es": "Transferencia pendiente de aprobación",
    "de": "Überweisung wartet auf Genehmigung"
  },
  {
    "pl": "Przelew otrzymany",
    "fr": "Virement reçu",
    "es": "Transferencia recibida",
    "de": "Überweisung erhalten"
  },
  {
    "pl": "Przelew w oczekiwaniu",
    "fr": "Virement en attente",
    "es": "Transferencia en espera",
    "de": "Überweisung ausstehend"
  },
  {
    "pl": "Przelew wysłany",
    "fr": "Virement envoyé",
    "es": "Transferencia enviada",
    "de": "Überweisung gesendet"
  },
  {
    "pl": "Przelew wysłany pomyślnie",
    "fr": "Virement envoyé avec succès",
    "es": "Transferencia enviada con éxito",
    "de": "Überweisung erfolgreich gesendet"
  },
  {
    "pl": "Przelew zatrzymany",
    "fr": "Virement retenu",
    "es": "Transferencia retenida",
    "de": "Überweisung angehalten"
  },
  {
    "pl": "Przelew zatwierdzony",
    "fr": "Virement approuvé",
    "es": "Transferencia aprobada",
    "de": "Überweisung genehmigt"
  },
  {
    "pl": "Przetwarzanie przelewu między klientami...",
    "fr": "Traitement du virement entre clients...",
    "es": "Procesando la transferencia entre clientes...",
    "de": "Verarbeitung der Überweisung zwischen Kunden..."
  },
  {
    "pl": "Płatności",
    "fr": "Paiements",
    "es": "Pagos",
    "de": "Zahlungen"
  },
  {
    "pl": "Saldo całkowite",
    "fr": "Solde total",
    "es": "Saldo total",
    "de": "Gesamtsaldo"
  },
  {
    "pl": "Sesja wygasła, zaloguj się ponownie.",
    "fr": "La session a expiré, reconnectez-vous.",
    "es": "La sesión ha caducado, inicia sesión de nuevo.",
    "de": "Sitzung abgelaufen, bitte melden Sie sich erneut an."
  },
  {
    "pl": "Skontaktuj się z naszym zespołem wsparcia:",
    "fr": "Contactez notre équipe d'assistance:",
    "es": "Póngase en contacto con nuestro equipo de soporte:",
    "de": "Kontaktieren Sie unser Support-Team:"
  },
  {
    "pl": "Sprawdź poprawność danych beneficjenta i spróbuj ponownie. W razie problemów skontaktuj się z nami.",
    "fr": "Vérifiez les informations du bénéficiaire et réessayez. En cas de problème, contactez-nous.",
    "es": "Compruebe los datos del beneficiario e inténtelo de nuevo. Si tiene problemas, contáctenos.",
    "de": "Überprüfen Sie die Angaben des Empfängers und versuchen Sie es erneut. Bei Problemen kontaktieren Sie uns."
  },
  {
    "pl": "Status",
    "fr": "Statut",
    "es": "Estado",
    "de": "Status"
  },
  {
    "pl": "Status konta",
    "fr": "Statut du compte",
    "es": "Estado de la cuenta",
    "de": "Kontostatus"
  },
  {
    "pl": "Szczegóły bieżącego transferu",
    "fr": "Détails du transfert en cours",
    "es": "Detalles de la transferencia actual",
    "de": "Details der aktuellen Überweisung"
  },
  {
    "pl": "Szczegóły przelewu w oczekiwaniu",
    "fr": "Détails du virement en attente",
    "es": "Detalles de la transferencia pendiente",
    "de": "Details der ausstehenden Überweisung"
  },
  {
    "pl": "Szczegóły transakcji",
    "fr": "Détails de la transaction",
    "es": "Detalles de la transacción",
    "de": "Transaktionsdetails"
  },
  {
    "pl": "Te dane logowania nie pasują do tego linku. Użyj swojego własnego linku do logowania.",
    "fr": "Ces identifiants ne correspondent pas à ce lien. Utilisez votre propre lien de connexion.",
    "es": "Estas credenciales no coinciden con este enlace. Utilice su propio enlace de inicio de sesión.",
    "de": "Diese Anmeldedaten passen nicht zu diesem Link. Verwenden Sie Ihren eigenen Login-Link."
  },
  {
    "pl": "Ten przelew został anulowany przez administrację.",
    "fr": "Ce virement a été annulé par l'administration.",
    "es": "Esta transferencia ha sido cancelada por la administración.",
    "de": "Diese Überweisung wurde von der Verwaltung storniert."
  },
  {
    "pl": "Ten przelew został już anulowany.",
    "fr": "Ce virement a déjà été annulé.",
    "es": "Esta transferencia ya ha sido cancelada.",
    "de": "Diese Überweisung wurde bereits storniert."
  },
  {
    "pl": "To potwierdzenie zostało wygenerowane automatycznie przez system Younited. Nie przekazuj tego e-maila osobom trzecim.",
    "fr": "Cette confirmation a été générée automatiquement par le système Younited. Ne transmettez pas cet e‑mail à des tiers.",
    "es": "Esta confirmación ha sido generada automáticamente por el sistema Younited. No reenvíe este correo a terceros.",
    "de": "Diese Bestätigung wurde automatisch vom Younited-System erstellt. Leiten Sie diese E‑Mail nicht an Dritte weiter."
  },
  {
    "pl": "Transakcja została przerwana.",
    "fr": "La transaction a été interrompue.",
    "es": "La transacción se ha interrumpido.",
    "de": "Die Transaktion wurde abgebrochen."
  },
  {
    "pl": "Twoja płatność została zatwierdzona. Środki zostaną automatycznie przelane na konto beneficjenta w ciągu 1–3 minut.",
    "fr": "Votre paiement a été approuvé. Les fonds seront automatiquement transférés sur le compte du bénéficiaire dans les 1 à 3 minutes.",
    "es": "Su pago ha sido aprobado. Los fondos se transferirán automáticamente a la cuenta del beneficiario en 1–3 minutos.",
    "de": "Ihre Zahlung wurde genehmigt. Die Mittel werden innerhalb von 1–3 Minuten automatisch auf das Konto des Begünstigten überwiesen."
  },
  {
    "pl": "Twoje dane są chronione zgodnie z regulaminem RODO. W przypadku pytań skontaktuj się z obsługą klienta.",
    "fr": "Vos données sont protégées conformément au règlement RGPD. Pour toute question, contactez le service client.",
    "es": "Sus datos están protegidos de acuerdo con la normativa GDPR. Si tiene preguntas, póngase en contacto con atención al cliente.",
    "de": "Ihre Daten sind gemäß der DSGVO geschützt. Bei Fragen wenden Sie sich bitte an den Kundendienst."
  },
  {
    "pl": "Twój ID",
    "fr": "Votre ID",
    "es": "Su ID",
    "de": "Ihre ID"
  },
  {
    "pl": "Twój przelew oczekuje na weryfikację administracyjną. Otrzymasz powiadomienie e-mail po zatwierdzeniu.",
    "fr": "Votre virement est en attente de vérification administrative. Vous recevrez une notification par e‑mail une fois approuvé.",
    "es": "Su transferencia está pendiente de verificación administrativa. Recibirá una notificación por correo electrónico tras la aprobación.",
    "de": "Ihre Überweisung wartet auf administrative Überprüfung. Sie erhalten eine E‑Mail-Benachrichtigung nach der Freigabe."
  },
  {
    "pl": "Twój przelew oczekuje na zatwierdzenie przez służby administracyjne. Otrzymasz powiadomienie e-mail po zatwierdzeniu.",
    "fr": "Votre virement est en attente d'approbation par les services administratifs. Vous recevrez une notification par e‑mail après approbation.",
    "es": "Su transferencia está pendiente de aprobación por los servicios administrativos. Recibirá una notificación por correo electrónico una vez aprobada.",
    "de": "Ihre Überweisung wartet auf Genehmigung durch die Verwaltungsbehörden. Sie erhalten eine E‑Mail-Benachrichtigung nach der Genehmigung."
  },
  {
    "pl": "Ukryj",
    "fr": "Masquer",
    "es": "Ocultar",
    "de": "Ausblenden"
  },
  {
    "pl": "Uwzględnij wszystkie swoje potrzeby",
    "fr": "Tenez compte de tous vos besoins",
    "es": "Tenga en cuenta todas sus necesidades",
    "de": "Berücksichtigen Sie alle Ihre Bedürfnisse"
  },
  {
    "pl": "Użyj swoich danych logowania, aby się zalogować",
    "fr": "Utilisez vos identifiants pour vous connecter",
    "es": "Use sus credenciales para iniciar sesión",
    "de": "Verwenden Sie Ihre Zugangsdaten, um sich anzumelden"
  },
  {
    "pl": "Użytkownik",
    "fr": "Utilisateur",
    "es": "Usuario",
    "de": "Benutzer"
  },
  {
    "pl": "W przypadku pytań skontaktuj się z nami: noreply.kontakt.pl@gmail.com",
    "fr": "Pour toute question, contactez-nous : noreply.kontakt.pl@gmail.com",
    "es": "Para cualquier consulta, contáctenos: noreply.kontakt.pl@gmail.com",
    "de": "Bei Fragen kontaktieren Sie uns: noreply.kontakt.pl@gmail.com"
  },
  {
    "pl": "WYSŁANY",
    "fr": "ENVOYÉ",
    "es": "ENVIADO",
    "de": "GESENDET"
  },
  {
    "pl": "Ważna do",
    "fr": "Valable jusqu'au",
    "es": "Válido hasta",
    "de": "Gültig bis"
  },
  {
    "pl": "Weryfikacja tożsamości",
    "fr": "Vérification d'identité",
    "es": "Verificación de identidad",
    "de": "Identitätsprüfung"
  },
  {
    "pl": "Weryfikacja tożsamości zakończona pomyślnie.",
    "fr": "Vérification d'identité réussie.",
    "es": "Verificación de identidad completada con éxito.",
    "de": "Identitätsprüfung erfolgreich abgeschlossen."
  },
  {
    "pl": "Witaj,",
    "fr": "Bonjour,",
    "es": "Hola,",
    "de": "Hallo,"
  },
  {
    "pl": "Wprowadź kod aktywacyjny przelewu",
    "fr": "Saisissez le code d'activation du virement",
    "es": "Introduzca el código de activación de la transferencia",
    "de": "Geben Sie den Aktivierungscode für die Überweisung ein"
  },
  {
    "pl": "Wykonaj przelew",
    "fr": "Effectuer le virement",
    "es": "Realizar la transferencia",
    "de": "Überweisung durchführen"
  },
  {
    "pl": "Wykonaj przelew międzynarodowy SEPA/SWIFT",
    "fr": "Effectuer un virement international SEPA/SWIFT",
    "es": "Realizar una transferencia internacional SEPA/SWIFT",
    "de": "Internationale SEPA-/SWIFT-Überweisung durchführen"
  },
  {
    "pl": "Wyloguj się",
    "fr": "Se déconnecter",
    "es": "Cerrar sesión",
    "de": "Abmelden"
  },
  {
    "pl": "Wystąpił błąd podczas akcji",
    "fr": "Une erreur s'est produite lors de l'action",
    "es": "Se produjo un error durante la acción",
    "de": "Beim Vorgang ist ein Fehler aufgetreten"
  },
  {
    "pl": "Właściciel",
    "fr": "Propriétaire",
    "es": "Propietario",
    "de": "Eigentümer"
  },
  {
    "pl": "ZWRÓCONA KWOTA",
    "fr": "MONTANT REMBOURSÉ",
    "es": "IMPORTE DEVUELTO",
    "de": "RÜCKERSTATTETER BETRAG"
  },
  {
    "pl": "Zaloguj się",
    "fr": "Connectez-vous",
    "es": "Iniciar sesión",
    "de": "Anmelden"
  },
  {
    "pl": "Zatwierdź anulowanie",
    "fr": "Confirmer l'annulation",
    "es": "Confirmar la cancelación",
    "de": "Stornierung bestätigen"
  },
  {
    "pl": "Ze względów bezpieczeństwa niektóre znaki IBAN zostały zamaskowane.",
    "fr": "Pour des raisons de sécurité, certains caractères de l'IBAN ont été masqués.",
    "es": "Por motivos de seguridad, algunos caracteres del IBAN han sido enmascarados.",
    "de": "Aus Sicherheitsgründen wurden einige IBAN-Zeichen maskiert."
  },
  {
    "pl": "Zobacz mój IBAN",
    "fr": "Voir mon IBAN",
    "es": "Ver mi IBAN",
    "de": "Meine IBAN anzeigen"
  },
  {
    "pl": "Zwrot został zaksięgowany na Twoim koncie. W razie pytań skontaktuj się z naszym zespołem wsparcia.",
    "fr": "Le remboursement a été crédité sur votre compte. En cas de questions, contactez notre équipe d'assistance.",
    "es": "El reembolso ha sido abonado en su cuenta. Si tiene preguntas, contacte con nuestro equipo de soporte.",
    "de": "Die Rückerstattung wurde Ihrem Konto gutgeschrieben. Bei Fragen kontaktieren Sie unser Support-Team."
  },
  {
    "pl": "Zwrot środków",
    "fr": "Remboursement",
    "es": "Reembolso",
    "de": "Rückerstattung"
  },
  {
    "pl": "Zwrócono przez",
    "fr": "Remboursé par",
    "es": "Reembolsado por",
    "de": "Erstattet durch"
  },
  {
    "pl": "ZŁ",
    "fr": "ZŁ",
    "es": "ZŁ",
    "de": "ZŁ"
  },
  {
    "pl": "data-id",
    "fr": "data-id",
    "es": "data-id",
    "de": "data-id"
  },
  {
    "pl": "historique avec status ",
    "fr": "historique avec status ",
    "es": "historial con estado ",
    "de": "Verlauf mit Status "
  },
  {
    "pl": "history-status",
    "fr": "history-status",
    "es": "history-status",
    "de": "history-status"
  },
  {
    "pl": "października",
    "fr": "octobre",
    "es": "octubre",
    "de": "Oktober"
  },
  {
    "pl": "profile-status-badge",
    "fr": "profile-status-badge",
    "es": "profile-status-badge",
    "de": "profile-status-badge"
  },
  {
    "pl": "txd-status",
    "fr": "txd-status",
    "es": "txd-status",
    "de": "txd-status"
  },
  {
    "pl": "września",
    "fr": "septembre",
    "es": "septiembre",
    "de": "September"
  },
  {
    "pl": "zł",
    "fr": "zł",
    "es": "zł",
    "de": "zł"
  },
  {
    "pl": "}, Otrzymałeś przelew od ${user.nom || \", \"}, Przelew ${fmt(amt)} do ${recipientData.nom || \", \"© 2026 Younited Finance. Wszelkie prawa zastrzeżone.",
    "fr": "}, Otrzymałeś przelew od ${user.nom || \", \"}, Przelew ${fmt(amt)} do ${recipientData.nom || \", \"© 2026 Younited Finance. Wszelkie prawa zastrzeżone.",
    "es": "}, Otrzymałeś przelew od ${user.nom || \", \"}, Przelew ${fmt(amt)} do ${recipientData.nom || \", \"© 2026 Younited Finance. Wszelkie prawa zastrzeżone.",
    "de": "}, Otrzymałeś przelew od ${user.nom || \", \"}, Przelew ${fmt(amt)} do ${recipientData.nom || \", \"© 2026 Younited Finance. Wszelkie prawa zastrzeżone."
  },
  {
    "pl": "Ładowanie...",
    "fr": "Chargement...",
    "es": "Cargando...",
    "de": "Wird geladen..."
  },
  {
    "pl": "Środki zostaną przelane w ciągu 1-2 dni roboczych.",
    "fr": "Les fonds seront transférés dans un délai de 1 à 2 jours ouvrables.",
    "es": "Los fondos se transferirán en 1-2 días hábiles.",
    "de": "Die Mittel werden innerhalb von 1–2 Werktagen überwiesen."
  },
  {
    "pl": "⏳ Przelew oczekuje na zatwierdzenie",
    "fr": "⏳ Virement en attente d'approbation",
    "es": "⏳ Transferencia pendiente de aprobación",
    "de": "⏳ Überweisung wartet auf Genehmigung"
  },
  {
    "pl": "⚠️ Saldo niewystarczające",
    "fr": "⚠️ Solde insuffisant",
    "es": "⚠️ Saldo insuficiente",
    "de": "⚠️ Unzureichendes Guthaben"
  },
  {
    "pl": "✅ Numer skopiowany",
    "fr": "✅ Numéro copié",
    "es": "✅ Número copiado",
    "de": "✅ Nummer kopiert"
  },
  {
    "pl": "❌ Błąd kopiowania",
    "fr": "❌ Erreur de copie",
    "es": "❌ Error al copiar",
    "de": "❌ Kopierfehler"
  },
  {
    "pl": "❌ Nie możesz wysłać przelewu do samego siebie",
    "fr": "❌ Vous ne pouvez pas envoyer un virement à vous-même",
    "es": "❌ No puedes enviarte una transferencia a ti mismo",
    "de": "❌ Sie können keine Überweisung an sich selbst senden"
  },
  {
    "pl": "❌ Nie znaleziono odbiorcy o podanym ID",
    "fr": "❌ Aucun bénéficiaire trouvé avec l'ID fourni",
    "es": "❌ No se encontró destinatario con el ID proporcionado",
    "de": "❌ Kein Empfänger mit der angegebenen ID gefunden"
  },
  {
    "pl": "❌ Przelew anulowany przez administrację. Kwota zwrócona.",
    "fr": "❌ Virement annulé par l'administration. Montant remboursé.",
    "es": "❌ Transferencia cancelada por la administración. Importe devuelto.",
    "de": "❌ Überweisung von der Verwaltung storniert. Betrag zurückerstattet."
  },
  {
    "pl": "❌ Wystąpił błąd podczas anulowania.",
    "fr": "❌ Une erreur s'est produite lors de l'annulation.",
    "es": "❌ Se produjo un error al cancelar.",
    "de": "❌ Beim Stornieren ist ein Fehler aufgetreten."
  },
  {
    "pl": "❌ Wystąpił błąd podczas przelewu między klientami",
    "fr": "❌ Une erreur s'est produite lors du virement entre clients",
    "es": "❌ Se produjo un error durante la transferencia entre clientes",
    "de": "❌ Beim Überweisen zwischen Kunden ist ein Fehler aufgetreten"
  },
  {
    "pl": "❌ Wystąpił błąd podczas przetwarzania przelewu",
    "fr": "❌ Une erreur s'est produite lors du traitement du virement",
    "es": "❌ Se produjo un error durante el procesamiento de la transferencia",
    "de": "❌ Beim Verarbeiten der Überweisung ist ein Fehler aufgetreten"
  }
];
for (const row of generatedTranslations) {
  if (row.pl && row.fr) dictionaries.fr[row.pl] = row.fr;
  if (row.pl && row.es) dictionaries.es[row.pl] = row.es;
  if (row.pl && row.de) dictionaries.de[row.pl] = row.de;
}

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
      if (mutation.type === 'characterData') {
        const original = mutation.target.nodeValue;
        const translated = translateContent(original);
        if (translated !== original) mutation.target.nodeValue = translated;
      } else if (mutation.addedNodes.length) mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const original = node.nodeValue;
          const translated = translateContent(original);
          if (translated !== original) node.nodeValue = translated;
        } else if (node.nodeType === Node.ELEMENT_NODE) applyTranslations(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}


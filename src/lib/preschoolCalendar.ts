export type PreschoolCalendarEvent = {
  id: string;
  date: Date;
  title: string;
  emoji: string;
  kind: "national" | "religious" | "season" | "school";
  theme: string;
  activity: string;
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

export function orthodoxEaster(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const julianMonth = Math.floor((d + e + 114) / 31);
  const julianDay = ((d + e + 114) % 31) + 1;
  const julianDate = new Date(year, julianMonth - 1, julianDay);
  return addDays(julianDate, 13); // Gregorian offset valid for 1900–2099.
}

function yearEvents(year: number): PreschoolCalendarEvent[] {
  const easter = orthodoxEaster(year);
  const cleanMonday = addDays(easter, -48);
  const goodFriday = addDays(easter, -2);
  const easterMonday = addDays(easter, 1);
  const mothersDay = nthWeekdayOfMonth(year, 4, 0, 2);
  const fathersDay = nthWeekdayOfMonth(year, 5, 0, 3);

  return [
    { id: `${year}-new-year`, date: new Date(year, 0, 1), title: "Πρωτοχρονιά", emoji: "🎆", kind: "religious", theme: "Νέα αρχή & στόχοι", activity: "Κάρτα ευχών + παιχνίδι μέτρησης αντίστροφης" },
    { id: `${year}-epiphany`, date: new Date(year, 0, 6), title: "Θεοφάνια", emoji: "💧", kind: "religious", theme: "Νερό & θάλασσα", activity: "Πείραμα επιπλέει/βυθίζεται + ζωγραφιά νερού" },
    { id: `${year}-carnival`, date: addDays(cleanMonday, -14), title: "Αποκριάτικη εβδομάδα", emoji: "🎭", kind: "school", theme: "Ρόλοι, μουσική & φαντασία", activity: "Μάσκα Α4 + χορός παύσης + παιχνίδι συναισθημάτων" },
    { id: `${year}-clean-monday`, date: cleanMonday, title: "Καθαρά Δευτέρα", emoji: "🪁", kind: "religious", theme: "Χαρταετός & άνοιξη", activity: "Πατρόν χαρταετού + παιχνίδι σχημάτων" },
    { id: `${year}-spring`, date: new Date(year, 2, 20), title: "Καλωσορίζουμε την Άνοιξη", emoji: "🌼", kind: "season", theme: "Λουλούδια, έντομα & χρώματα", activity: "Κυνήγι χρωμάτων + πεταλούδα συμμετρίας" },
    { id: `${year}-march25`, date: new Date(year, 2, 25), title: "25η Μαρτίου", emoji: "🇬🇷", kind: "national", theme: "Ελλάδα, σημαία & παράδοση", activity: "Σημαία με λωρίδες + ήρεμη ιστορία για την εθνική γιορτή" },
    { id: `${year}-good-friday`, date: goodFriday, title: "Μεγάλη Παρασκευή", emoji: "🕯️", kind: "religious", theme: "Ήρεμη οικογενειακή στιγμή", activity: "Χαμηλής έντασης ζωγραφική & αφήγηση" },
    { id: `${year}-easter`, date: easter, title: "Πάσχα", emoji: "🐣", kind: "religious", theme: "Άνοιξη, αυγό & λαγουδάκι", activity: "Αυγό με μοτίβα + πασχαλινό λαγουδάκι" },
    { id: `${year}-easter-monday`, date: easterMonday, title: "Δευτέρα του Πάσχα", emoji: "🌷", kind: "religious", theme: "Οικογένεια & άνοιξη", activity: "Βόλτα παρατήρησης + nature bingo" },
    { id: `${year}-may1`, date: new Date(year, 4, 1), title: "Πρωτομαγιά", emoji: "🌸", kind: "national", theme: "Λουλούδια & φύση", activity: "Χάρτινο στεφάνι + ταξινόμηση χρωμάτων" },
    { id: `${year}-mothers-day`, date: mothersDay, title: "Γιορτή της Μητέρας", emoji: "💗", kind: "school", theme: "Αγάπη & ευγνωμοσύνη", activity: "Κάρτα αγάπης + ζωγραφίζω μια όμορφη στιγμή" },
    { id: `${year}-summer`, date: new Date(year, 5, 21), title: "Καλωσορίζουμε το Καλοκαίρι", emoji: "☀️", kind: "season", theme: "Θάλασσα, ασφάλεια & εξερεύνηση", activity: "Καραβάκι + βυθός + παιχνίδι ταξινόμησης θαλάσσιων ζώων" },
    { id: `${year}-fathers-day`, date: fathersDay, title: "Γιορτή του Πατέρα", emoji: "💙", kind: "school", theme: "Οικογένεια & κοινός χρόνος", activity: "Κουπόνια κοινών δραστηριοτήτων + μικρή ιστορία" },
    { id: `${year}-aug15`, date: new Date(year, 7, 15), title: "15 Αυγούστου", emoji: "🌿", kind: "religious", theme: "Καλοκαίρι & οικογένεια", activity: "Ήρεμη ζωγραφική καλοκαιριού + οικογενειακή αφήγηση" },
    { id: `${year}-autumn`, date: new Date(year, 8, 22), title: "Φθινόπωρο", emoji: "🍂", kind: "season", theme: "Φύλλα, χρώματα & καιρός", activity: "Δέντρο με αποτυπώματα + κυνήγι φύλλων" },
    { id: `${year}-oct28`, date: new Date(year, 9, 28), title: "28η Οκτωβρίου", emoji: "🇬🇷", kind: "national", theme: "Ειρήνη, συνεργασία & Ελλάδα", activity: "Περιστέρι ειρήνης + συζήτηση για την καλοσύνη" },
    { id: `${year}-winter`, date: new Date(year, 11, 21), title: "Χειμώνας", emoji: "❄️", kind: "season", theme: "Κρύο, ρούχα & καιρός", activity: "Χιονάνθρωπος με κύκλους + παιχνίδι τι φοράμε" },
    { id: `${year}-christmas`, date: new Date(year, 11, 25), title: "Χριστούγεννα", emoji: "🎄", kind: "religious", theme: "Χαρά, προσφορά & δημιουργία", activity: "Δέντρο Α4 + στολίδι + οικογενειακή ιστορία" },
    { id: `${year}-boxing-day`, date: new Date(year, 11, 26), title: "Δεύτερη ημέρα Χριστουγέννων", emoji: "⭐", kind: "religious", theme: "Οικογένεια & ευγνωμοσύνη", activity: "Αλυσίδα καλοσύνης + 3 πράγματα που αγαπάμε" },
  ];
}

export function getUpcomingPreschoolEvents(from = new Date(), monthsAhead = 14) {
  const end = new Date(from);
  end.setMonth(end.getMonth() + monthsAhead);
  const years = new Set([from.getFullYear(), end.getFullYear(), from.getFullYear() + 1]);
  return Array.from(years)
    .flatMap(yearEvents)
    .filter((event) => event.date >= new Date(from.getFullYear(), from.getMonth(), from.getDate()) && event.date <= end)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function formatGreekDate(date: Date) {
  return new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

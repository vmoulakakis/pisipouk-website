export type Lang = "gr" | "en";

export const dict = {
  // Navigation
  nav: {
    home: { gr: "Αρχική", en: "Home" },
    about: { gr: "Σχετικά", en: "About" },
    program: { gr: "Πρόγραμμα", en: "Program" },
    daily: { gr: "Καθημερινότητα", en: "Daily Life" },
    safety: { gr: "Ασφάλεια", en: "Safety" },
    enrollment: { gr: "Εγγραφές", en: "Enrollment" },
    contact: { gr: "Επικοινωνία", en: "Contact" },
    faq: { gr: "FAQ", en: "FAQ" },
    gallery: { gr: "Gallery", en: "Gallery" },
    blog: { gr: "Blog", en: "Blog" },
    portal: { gr: "Portal Γονέα", en: "Parent Portal" },
    teacher: { gr: "Εκπαιδευτικός", en: "Teacher" },
    privacy: { gr: "Απόρρητο", en: "Privacy" },
    terms: { gr: "Όροι", en: "Terms" },
  },
  cta: {
    book: { gr: "Κλείστε Ραντεβού", en: "Book a Visit" },
    bookLong: { gr: "Κλείστε Ραντεβού Γνωριμίας", en: "Book an Introductory Visit" },
    viewProgram: { gr: "Δείτε το Πρόγραμμά μας", en: "View Our Program" },
    enroll: { gr: "Εγγραφή", en: "Enroll" },
    contactUs: { gr: "Επικοινωνήστε μαζί μας", en: "Contact us" },
    submit: { gr: "Αποστολή", en: "Submit" },
    sending: { gr: "Αποστολή...", en: "Sending..." },
    learnMore: { gr: "Μάθετε περισσότερα", en: "Learn more" },
    login: { gr: "Σύνδεση", en: "Sign in" },
    logout: { gr: "Αποσύνδεση", en: "Sign out" },
    signup: { gr: "Εγγραφή", en: "Sign up" },
  },
  hero: {
    title: {
      gr: "Ο Πισιπούκ — Εκεί όπου κάθε παιδί νιώθει ασφάλεια, αγάπη και χαρά",
      en: "O Pisipouk — A place where every child feels safe, loved, and happy",
    },
    subtitle: {
      gr: "Παιδικός Σταθμός - Νηπιαγωγείο με ζεστό οικογενειακό περιβάλλον, δημιουργική μάθηση και καθημερινή φροντίδα για κάθε παιδί.",
      en: "A warm preschool and kindergarten with creative learning, daily care, and a family-oriented environment for every child.",
    },
  },
  positioning: {
    gr: "Ένας ζεστός, ασφαλής και δημιουργικός χώρος όπου κάθε παιδί μεγαλώνει με αγάπη, φροντίδα και σεβασμό στον δικό του ρυθμό.",
    en: "A warm, safe, and creative place where every child grows with love, care, and respect for their own rhythm.",
  },
  trust: {
    safe: { gr: "Ασφαλές περιβάλλον", en: "Safe environment" },
    creative: { gr: "Δημιουργική μάθηση", en: "Creative learning" },
    updates: { gr: "Καθημερινή ενημέρωση γονέων", en: "Daily parent updates" },
    small: { gr: "Μικρές ομάδες παιδιών", en: "Small child groups" },
    team: { gr: "Έμπειρη παιδαγωγική ομάδα", en: "Experienced educational team" },
  },
  sections: {
    why: { gr: "Γιατί μας επιλέγουν οι γονείς", en: "Why parents choose us" },
    philosophy: { gr: "Η φιλοσοφία μας", en: "Our philosophy" },
    ageGroups: { gr: "Ηλικιακές ομάδες", en: "Age groups" },
    aDay: { gr: "Μια μέρα στον Πισιπούκ", en: "A day at Pisipouk" },
    safetyCare: { gr: "Ασφάλεια & Φροντίδα", en: "Safety & Care" },
    parentComm: { gr: "Επικοινωνία με γονείς", en: "Parent communication" },
    testimonials: { gr: "Τι λένε οι γονείς", en: "What parents say" },
    faqPreview: { gr: "Συχνές Ερωτήσεις", en: "Frequently Asked Questions" },
    contactBlock: { gr: "Ελάτε να γνωριστούμε", en: "Come meet us" },
  },
  validation: {
    required: { gr: "Το πεδίο είναι υποχρεωτικό.", en: "This field is required." },
    email: { gr: "Παρακαλώ εισάγετε έγκυρο email.", en: "Please enter a valid email." },
    phone: { gr: "Παρακαλώ συμπληρώστε τηλέφωνο επικοινωνίας.", en: "Please enter a contact phone number." },
    gdpr: { gr: "Παρακαλώ αποδεχθείτε την πολιτική απορρήτου.", en: "Please accept the privacy policy." },
  },
  form: {
    parentName: { gr: "Ονοματεπώνυμο γονέα", en: "Parent full name" },
    phone: { gr: "Τηλέφωνο", en: "Phone" },
    email: { gr: "Email", en: "Email" },
    childName: { gr: "Όνομα παιδιού", en: "Child name" },
    childAge: { gr: "Ηλικία παιδιού", en: "Child age" },
    desiredStart: { gr: "Επιθυμητή ημερομηνία έναρξης", en: "Desired start date" },
    interest: { gr: "Ενδιαφέρον για", en: "Interested in" },
    interestPreschool: { gr: "Παιδικός Σταθμός", en: "Preschool" },
    interestKindergarten: { gr: "Νηπιαγωγείο", en: "Kindergarten" },
    interestBoth: { gr: "Και τα δύο", en: "Both" },
    message: { gr: "Μήνυμα", en: "Message" },
    gdprLabel: {
      gr: "Αποδέχομαι την πολιτική απορρήτου και τη χρήση των στοιχείων μου για επικοινωνία.",
      en: "I accept the privacy policy and the use of my data for communication.",
    },
    success: { gr: "Σας ευχαριστούμε! Θα επικοινωνήσουμε σύντομα.", en: "Thank you! We will contact you soon." },
    error: { gr: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.", en: "Something went wrong. Please try again." },
  },
  contact: {
    phone: { gr: "Τηλέφωνο", en: "Phone" },
    email: { gr: "Email", en: "Email" },
    address: { gr: "Διεύθυνση", en: "Address" },
    hours: { gr: "Ωράριο λειτουργίας", en: "Opening hours" },
    hoursValue: { gr: "Δευτέρα–Παρασκευή 07:00–16:00", en: "Monday–Friday 07:00–16:00" },
    placeholderPhone: "+30 210 000 0000",
    placeholderEmail: "info@pisipouk.gr",
    placeholderAddress: { gr: "Οδός Παραδείγματος 1, Αθήνα", en: "1 Example Street, Athens" },
  },
  footer: {
    tagline: {
      gr: "Παιδικός Σταθμός - Νηπιαγωγείο με αγάπη και φροντίδα.",
      en: "Preschool & Kindergarten with love and care.",
    },
    rights: { gr: "Με επιφύλαξη παντός δικαιώματος.", en: "All rights reserved." },
  },
  chat: {
    name: { gr: "Βοηθός Πισιπούκ", en: "Pisipouk Assistant" },
    greeting: {
      gr: "Γεια σας! Είμαι ο Βοηθός Πισιπούκ. Πώς μπορώ να βοηθήσω;",
      en: "Hello! I'm the Pisipouk Assistant. How can I help?",
    },
    placeholder: { gr: "Γράψτε το μήνυμά σας...", en: "Type your message..." },
    open: { gr: "Άνοιγμα chat", en: "Open chat" },
    close: { gr: "Κλείσιμο", en: "Close" },
    fallback: {
      gr: "Για το συγκεκριμένο θέμα, είναι καλύτερο να επικοινωνήσετε απευθείας με τη διεύθυνση του σταθμού.",
      en: "For this matter, it is best to contact the school direction directly.",
    },
  },
  legal: {
    disclaimer: {
      gr: "Η πολιτική απορρήτου και οι όροι χρήσης πρέπει να ελεγχθούν από νομικό σύμβουλο πριν τη δημοσίευση.",
      en: "The privacy policy and terms of use should be reviewed by a legal advisor before publication.",
    },
  },
} as const;

export function t(lang: Lang, path: { gr: string; en: string }): string {
  return path[lang];
}
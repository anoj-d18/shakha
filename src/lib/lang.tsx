import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "kn";

interface Translations {
  // Login
  loginTitle: string;
  loginSubtitle: string;
  username: string;
  password: string;
  loginBtn: string;
  noAccount: string;
  registerLink: string;
  enterUsername: string;
  enterPassword: string;
  // Register
  registerTitle: string;
  registerSubtitle: string;
  registerBtn: string;
  hasAccount: string;
  loginLink: string;
  chooseUsername: string;
  choosePassword: string;
  // Attendance
  rssTitle: string;
  rssSubtitle: string;
  attendanceFormTitle: string;
  shakha: string;
  date: string;
  place: string;
  attendanceDetails: string;
  taruna: string;
  balaka: string;
  total: string;
  shishu: string;
  abhyagata: string;
  anya: string;
  pravasa: string;
  vishesha: string;
  submitBtn: string;
  logout: string;
  shakhaPlaceholder: string;
  locationPlaceholder: string;
  specialNotes: string;
  // Validation
  fillAll: string;
  fillRequired: string;
  passwordMin: string;
  usernameExists: string;
  regSuccess: string;
  loginSuccess: string;
  invalidLogin: string;
  attendanceSuccess: string;
  // Tabs & New Member
  mukyashikshakTab: string;
  newTab: string;
  nameLabel: string;
  namePlaceholder: string;
  ageLabel: string;
  agePlaceholder: string;
  numberLabel: string;
  numberPlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  roleLabel: string;
  rolePlaceholder: string;
  shikshanaLabel: string;
  shikshanaSelect: string;
  newMemberSuccess: string;
}

const en: Translations = {
  loginTitle: "Rashtriya Swayamsevak Sangh",
  loginSubtitle: "Shakha Attendance Management System",
  username: "Username",
  password: "Password",
  loginBtn: "Login",
  noAccount: "Don't have an account?",
  registerLink: "Register here",
  enterUsername: "Enter your username",
  enterPassword: "Enter your password",
  registerTitle: "New Registration",
  registerSubtitle: "Create a new account",
  registerBtn: "Register",
  hasAccount: "Already have an account?",
  loginLink: "Login here",
  chooseUsername: "Choose a username",
  choosePassword: "Choose a password",
  rssTitle: "Rashtriya Swayamsevak Sangh",
  rssSubtitle: "Shakha Attendance System",
  attendanceFormTitle: "Shakha Attendance Form",
  shakha: "Shakha",
  date: "Date",
  place: "Place",
  attendanceDetails: "Attendance Details",
  taruna: "Taruna",
  balaka: "Balaka",
  total: "Total",
  shishu: "Shishu",
  abhyagata: "Abhyagata",
  anya: "Anya",
  pravasa: "Pravasa",
  vishesha: "Vishesha",
  submitBtn: "Submit Attendance",
  logout: "Logout",
  shakhaPlaceholder: "Shakha name",
  locationPlaceholder: "Location",
  specialNotes: "Special notes",
  fillAll: "Please fill in all fields",
  fillRequired: "Please fill Shakha, Date, and Place",
  passwordMin: "Password must be at least 4 characters",
  usernameExists: "Username already exists",
  regSuccess: "Registration successful! Please login.",
  loginSuccess: "Login successful!",
  invalidLogin: "Invalid username or password",
  attendanceSuccess: "Attendance submitted successfully!",
  mukyashikshakTab: "Mukyashikshak",
  newTab: "New",
  nameLabel: "Name",
  namePlaceholder: "Enter full name",
  ageLabel: "Age",
  agePlaceholder: "Age",
  numberLabel: "Phone Number",
  numberPlaceholder: "Phone number",
  addressLabel: "Address",
  addressPlaceholder: "Enter address",
  roleLabel: "Role",
  rolePlaceholder: "Enter role",
  shikshanaLabel: "Shikshana",
  shikshanaSelect: "-- Select Shikshana --",
  newMemberSuccess: "New member registered successfully!",
};

const kn: Translations = {
  loginTitle: "ಶಾಖಾ ಹಾಜರಾತಿ ವ್ಯವಸ್ಥೆ",
  loginSubtitle: "ಶಾಖಾ ಹಾಜರಾತಿ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ",
  username: "ಬಳಕೆದಾರ ಹೆಸರು",
  password: "ಗುಪ್ತಪದ",
  loginBtn: "ಲಾಗಿನ್",
  noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
  registerLink: "ಇಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ",
  enterUsername: "ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
  enterPassword: "ನಿಮ್ಮ ಗುಪ್ತಪದವನ್ನು ನಮೂದಿಸಿ",
  registerTitle: "ಹೊಸ ನೋಂದಣಿ",
  registerSubtitle: "ಹೊಸ ಖಾತೆ ರಚಿಸಿ",
  registerBtn: "ನೋಂದಣಿ",
  hasAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
  loginLink: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ",
  chooseUsername: "ಬಳಕೆದಾರ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  choosePassword: "ಗುಪ್ತಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  rssTitle: "ರಾಷ್ಟ್ರೀಯ ಸ್ವಯಂಸೇವಕ ಸಂಘ",
  rssSubtitle: "Rashtriya Swayamsevak Sangh",
  attendanceFormTitle: "ಶಾಖಾ ಹಾಜರಾತಿ ನಮೂನೆ",
  shakha: "ಶಾಖಾ",
  date: "ದಿನಾಂಕ",
  place: "ಸ್ಥಳ",
  attendanceDetails: "ಹಾಜರಾತಿ ವಿವರಗಳು",
  taruna: "ತರುಣ",
  balaka: "ಬಾಲಕ",
  total: "ಒಟ್ಟು",
  shishu: "ಶಿಶು",
  abhyagata: "ಅಭ್ಯಾಗತ",
  anya: "ಅನ್ಯ",
  pravasa: "ಪ್ರವಾಸ",
  vishesha: "ವಿಶೇಷ",
  submitBtn: "ಹಾಜರಾತಿ ಸಲ್ಲಿಸಿ",
  logout: "ಲಾಗ್ ಔಟ್",
  shakhaPlaceholder: "ಶಾಖಾ ಹೆಸರು",
  locationPlaceholder: "ಸ್ಥಳ",
  specialNotes: "ವಿಶೇಷ ಟಿಪ್ಪಣಿಗಳು",
  fillAll: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
  fillRequired: "ದಯವಿಟ್ಟು ಶಾಖಾ, ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಳವನ್ನು ಭರ್ತಿ ಮಾಡಿ",
  passwordMin: "ಗುಪ್ತಪದ ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳಿರಬೇಕು",
  usernameExists: "ಬಳಕೆದಾರ ಹೆಸರು ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ",
  regSuccess: "ನೋಂದಣಿ ಯಶಸ್ವಿ! ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.",
  loginSuccess: "ಲಾಗಿನ್ ಯಶಸ್ವಿ!",
  invalidLogin: "ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಗುಪ್ತಪದ",
  attendanceSuccess: "ಹಾಜರಾತಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
  mukyashikshakTab: "ಮುಖ್ಯಶಿಕ್ಷಕ",
  newTab: "ಹೊಸ",
  nameLabel: "ಹೆಸರು",
  namePlaceholder: "ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
  ageLabel: "ವಯಸ್ಸು",
  agePlaceholder: "ವಯಸ್ಸು",
  numberLabel: "ಫೋನ್ ಸಂಖ್ಯೆ",
  numberPlaceholder: "ಫೋನ್ ಸಂಖ್ಯೆ",
  addressLabel: "ವಿಳಾಸ",
  addressPlaceholder: "ವಿಳಾಸ ನಮೂದಿಸಿ",
  roleLabel: "ಪಾತ್ರ",
  rolePlaceholder: "ಪಾತ್ರ ನಮೂದಿಸಿ",
  shikshanaLabel: "ಶಿಕ್ಷಣ",
  shikshanaSelect: "-- ಶಿಕ್ಷಣ ಆಯ್ಕೆಮಾಡಿ --",
  newMemberSuccess: "ಹೊಸ ಸದಸ್ಯ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಣಿಯಾಗಿದೆ!",
};

const translations = { en, kn };

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  t: en,
  toggleLang: () => {},
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("shakha_lang") as Lang) || "en";
  });

  const toggleLang = () => {
    const next = lang === "en" ? "kn" : "en";
    setLang(next);
    localStorage.setItem("shakha_lang", next);
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

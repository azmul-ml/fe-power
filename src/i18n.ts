import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locale/en";
import cn from "./locale/cn";

i18n.use(initReactI18next).init({
  resources: {
    en: { ...en },
    cn: { ...cn },
  }, // Where we're gonna put translations' files
  lng: "en", // Set the initial language of the App
});

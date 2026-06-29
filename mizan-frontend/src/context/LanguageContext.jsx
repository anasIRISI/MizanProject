import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  fr: {
    sidebar_dashboard: "Dashboard",
    sidebar_history: "Historique",
    sidebar_demands: "Mes Demandes",
    sidebar_settings: "Paramètres",
    sidebar_logout: "Déconnexion",
    welcome: "Bienvenue, {name}",
    dashboard_greeting: "Bonjour, {name}",
    dashboard_sub: "Prêt pour une analyse juridique approfondie. Décrivez votre situation ou déposez vos documents pour commencer l'extraction de données par IA.",
    recent_docs: "Documents récents",
    see_all: "Voir tout l'historique",
    doc_name: "Nom du document",
    date: "Date",
    status: "Statut",
    actions: "Actions",
    analyzed: "Analysé",
    end_of_list: "Fin de la liste",
    no_recent: "Aucun document analysé récemment.",
    upload_drag: "Glissez & déposez vos éléments ici",
    upload_click: "cliquez pour parcourir",
    upload_format: "Formats supportés: PDF, DOCX, TXT. Jusqu'à 50MB.",
    uploading: "Analyse Magistrale en cours...",
    upload_sub: "L'IA examine vos clauses et réglementations...",
    lawyers_title: "Avocats Partenaires",
    lawyers_sub: "Rencontrez les meilleurs experts pour vous accompagner.",
    history_title: "Historique des documents",
    history_sub: "Gérez et consultez l'ensemble de vos analyses juridiques.",
    download_pdf: "Télécharger Rapport Pro (PDF)",
    generate_letter: "Générer un courrier",
    find_lawyer: "Trouver un avocat",
    analysis_details: "Détails de l'Analyse",
    summary: "Résumé",
    rights: "Vos Droits / Informations Clés",
    next_steps: "Prochaines Étapes Recommandées",
    upload_btn: "Scanner avec Mizan IA"
  },
  en: {
    sidebar_dashboard: "Dashboard",
    sidebar_history: "History",
    sidebar_demands: "My Demands",
    sidebar_settings: "Settings",
    sidebar_logout: "Logout",
    welcome: "Welcome, {name}",
    dashboard_greeting: "Hello, {name}",
    dashboard_sub: "Ready for deep legal analysis. Describe your situation or upload your documents to start AI data extraction.",
    recent_docs: "Recent Documents",
    see_all: "See full history",
    doc_name: "Document Name",
    date: "Date",
    status: "Status",
    actions: "Actions",
    analyzed: "Analyzed",
    end_of_list: "End of list",
    no_recent: "No recently analyzed documents.",
    upload_drag: "Drag & drop your files here",
    upload_click: "click to browse",
    upload_format: "Supported formats: PDF, DOCX, TXT. Up to 50MB.",
    uploading: "Magisterial Analysis in progress...",
    upload_sub: "AI is examining your clauses and regulations...",
    lawyers_title: "Partner Lawyers",
    lawyers_sub: "Meet the best experts to support you.",
    history_title: "Document History",
    history_sub: "Manage and consult all your legal analyses.",
    download_pdf: "Download Pro Report (PDF)",
    generate_letter: "Generate Letter",
    find_lawyer: "Find a Lawyer",
    analysis_details: "Analysis Details",
    summary: "Summary",
    rights: "Your Rights / Key Information",
    next_steps: "Recommended Next Steps",
    upload_btn: "Scan with Mizan AI"
  },
  ar: {
    sidebar_dashboard: "لوحة القيادة",
    sidebar_history: "السجل",
    sidebar_demands: "طلباتي",
    sidebar_settings: "الإعدادات",
    sidebar_logout: "تسجيل الخروج",
    welcome: "مرحباً، {name}",
    dashboard_greeting: "مرحباً، {name}",
    dashboard_sub: "جاهز للتحليل القانوني العميق. صِف موقفك أو قم بتحميل مستنداتك لبدء استخراج البيانات بواسطة الذكاء الاصطناعي.",
    recent_docs: "المستندات الأخيرة",
    see_all: "عرض كل السجل",
    doc_name: "اسم المستند",
    date: "التاريخ",
    status: "الحالة",
    actions: "إجراءات",
    analyzed: "تم التحليل",
    end_of_list: "نهاية القائمة",
    no_recent: "لا توجد مستندات تم تحليلها مؤخراً.",
    upload_drag: "اسحب وأفلت العناصر هنا",
    upload_click: "انقر للتصفح",
    upload_format: "الصيغ المدعومة: PDF, DOCX, TXT. حتى 50 ميغابايت.",
    uploading: "جاري التحليل القانوني...",
    upload_sub: "الذكاء الاصطناعي يفحص بنودك واللوائح التنظيمية...",
    lawyers_title: "المحامون الشركاء",
    lawyers_sub: "التقِ بأفضل الخبراء لدعمك.",
    history_title: "سجل المستندات",
    history_sub: "إدارة واستشارة جميع تحليلاتك القانونية.",
    download_pdf: "تنزيل التقرير (PDF)",
    generate_letter: "إنشاء رسالة",
    find_lawyer: "ابحث عن محامٍ",
    analysis_details: "تفاصيل التحليل",
    summary: "ملخص",
    rights: "حقوقك / معلومات أساسية",
    next_steps: "الخطوات التالية الموصى بها",
    upload_btn: "تحليل باستخدام الذكاء الاصطناعي"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('fr'); // fr, en, ar

  useEffect(() => {
    const savedLang = localStorage.getItem('mizan_lang');
    if (savedLang && ['fr', 'en', 'ar'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('mizan_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key, params = {}) => {
    let str = translations[language]?.[key] || translations['fr'][key] || key;
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

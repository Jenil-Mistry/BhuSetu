'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

export const HINDI_TRANSLATIONS: Record<string, string> = {
  // Navigation & Header
  'portal.title': 'भूसेतु',
  'portal.subtitle': 'राष्ट्रीय भूमि अधिग्रहण एवं पारदर्शिता प्रणाली (RFCTLARR 2013)',
  'portal.gov_india': 'भारत सरकार | Government of India',
  'portal.morth': 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH)',
  'portal.statutory_tag': 'RFCTLARR अधिनियम, 2013 सांविधिक प्रणाली',
  'portal.live_status': 'PFMS / भूमि लाइव',
  'nav.home': 'मुख्य पृष्ठ',
  'nav.track_parcel': 'खसरा भू-खंड खोजें',
  'nav.modules': 'अधिकार क्षेत्र एवं पोर्टल',
  'nav.gazette': 'राजपत्र अधिसूचनाएं',
  'nav.framework': 'कानूनी ढांचा (RFCTLARR)',
  'nav.login': 'अधिकारी / नागरिक लॉगिन',
  'nav.dashboard': 'आधिकारिक डैशबोर्ड',
  'nav.sign_out': 'पोर्टल से बाहर निकलें (साइन आउट)',
  'nav.switch_lang': 'English में देखें',
  'nav.active_corridor': 'सक्रिय कॉरिडोर',
  'nav.notifications': 'सांविधिक सूचनाएं',
  'nav.realtime_feed': 'रीयल-टाइम फीड',
  'nav.close_notifications': 'सूचनाएं बंद करें',

  // Statutory Ticker
  'ticker.alert': 'सांविधिक राजपत्र सूचना',
  'ticker.content': 'NH-48 ग्रीनफील्ड स्पर (पैकेज 01 एवं 02) हेतु धारा 19 के अंतर्गत अधिनिर्णय (अवार्ड) भारत के ई-राजपत्र में प्रकाशित • प्रत्यक्ष लाभ अंतरण (DBT) PFMS पोर्टल एकीकरण लाइव • रेवाड़ी जिले हेतु धारा 15 ऑनलाइन जन-आपत्ति निवारण सक्रिय।',
  'ticker.view_all': 'सभी राजपत्र देखें',

  // Hero Section
  'hero.tag': 'RFCTLARR अधिनियम, 2013 सांविधिक पोर्टल • MoRTH डिजिटल पहल',
  'hero.title': 'राष्ट्रीय अवसंरचना हेतु पारदर्शी, कैडस्ट्रल जीआईएस-संबद्ध भूमि अधिग्रहण',
  'hero.desc': 'भूसेतु भूमि अधिग्रहण, पुनर्वासन और पुनर्व्यवस्थापन में उचित प्रतिकर और पारदर्शिता का अधिकार अधिनियम, 2013 (RFCTLARR 2013) के अंतर्गत संपूर्ण सांविधिक जीवनचक्र को एकीकृत करता है। परियोजना कार्यान्वयन एजेंसियों (PIA), जिला समाहर्ता (CALA), क्षेत्रीय राजस्व अधिकारियों और प्रभावित परिवारों को वास्तविक समय कैडस्ट्रल सत्यापन एवं स्वचालित PFMS प्रत्यक्ष लाभ अंतरण (DBT) से जोड़ता है।',
  'hero.cta_login': 'आधिकारिक पोर्टल में प्रवेश करें',
  'hero.cta_search': 'खसरा भू-खंड ट्रैक करें',
  'hero.cta_guidelines': 'RFCTLARR दिशानिर्देश',
  'hero.badge_solatium': '100% तोषण (Solatium) ग्राह्यता',
  'hero.badge_pfms': 'PFMS DBT प्रत्यक्ष बैंक अंतरण',
  'hero.badge_gis': 'मैपलिब्रे कैडस्ट्रल जीआईएस इंजन',

  // Gateway Card (Hero Right)
  'gateway.tag': 'आधिकारिक राष्ट्रीय प्रवेशद्वार',
  'gateway.title': 'राष्ट्रीय एकल साइन-ऑन प्रवेशद्वार',
  'gateway.subtitle': 'अधिकृत सरकारी अधिकारी एवं नागरिक पहचान आश्वासन प्रणाली',
  'gateway.secure_node': 'सुरक्षित एनआईसी नोड',
  'gateway.channels_heading': 'सांविधिक प्रमाणीकरण चैनल:',
  'gateway.officer_sso_title': 'परिचय सिंगल साइन-ऑन (Parichay SSO)',
  'gateway.officer_sso_desc': 'NHAI, MoRTH, जिला समाहर्ता (CALA) एवं राजस्व तहसीलदारों हेतु संवर्ग-आधारित सुरक्षित प्रवेश।',
  'gateway.citizen_sso_title': 'आधार ई-केवाईसी एवं डिजिलॉकर',
  'gateway.citizen_sso_desc': 'भूमि स्वामियों एवं प्रभावित परिवारों हेतु ओटीपी-आधारित प्रत्यक्ष सत्यापन एवं मुआवजा दावा ट्रैकिंग।',
  'gateway.audit_title': 'सांविधिक 256-बिट ऑडिट सुरक्षा',
  'gateway.audit_desc': 'सूचना प्रौद्योगिकी अधिनियम की धारा 66 एवं RFCTLARR 2013 के अनुपालन में डिजिटल हस्ताक्षर सत्यापन।',
  'gateway.btn_login': 'आधिकारिक पोर्टल में प्रवेश करें',

  // Transparency Counters
  'stats.corridors_title': 'अधिग्रहण अंतर्गत राष्ट्रीय कॉरिडोर',
  'stats.corridors_desc': 'ग्रीनफील्ड एक्सप्रेसवे एवं आर्थिक गलियारे',
  'stats.parcels_title': 'डिजिटल कैडस्ट्रल भू-खंड (खसरे)',
  'stats.parcels_desc': 'ULPIN / भू-आधार जियो-रेफरेंस सत्यापित',
  'stats.compensation_title': 'स्वीकृत एवं संवितरित मुआवजा',
  'stats.compensation_desc': '100% तोषण सहित PFMS DBT द्वारा अंतरित',
  'stats.turnaround_title': 'औसत अवार्ड निस्तारण अवधि',
  'stats.turnaround_desc': 'सांविधिक समयसीमा के विरुद्ध 52% की बचत',

  // Citizen Khasra Inquiry / Bhu-Khoj
  'khasra.section_tag': 'नागरिक एवं भू-स्वामी सेवा केंद्र • भू-खोज',
  'khasra.title': 'अपने खसरे का अधिग्रहण एवं मुआवजा विवरण जांचें',
  'khasra.desc': 'राज्य, जिला एवं तहसील का चयन कर अपना खसरा नंबर दर्ज करें और तत्काल सांविधिक स्थिति, अधिग्रहीत रकबा एवं 100% तोषण सहित मुआवजा राशि देखें।',
  'khasra.state_label': 'राज्य (State)',
  'khasra.district_label': 'जिला (District)',
  'khasra.tehsil_label': 'तहसील (Tehsil)',
  'khasra.village_label': 'राजस्व ग्राम (Village)',
  'khasra.no_label': 'खसरा / सर्वे नंबर',
  'khasra.btn_search': 'खसरा स्थिति खोजें',
  'khasra.searching': 'भू-अभिलेख डेटाबेस से खोज जारी...',
  'khasra.result_title': 'डिजिटल भू-आधार पत्र (Bhu-Card Certificate)',
  'khasra.result_subtitle': 'RFCTLARR अधिनियम 2013 की धारा 19 एवं 23 के अंतर्गत सांविधिक सारांश',
  'khasra.owner': 'पंजीकृत खातेदार / भू-स्वामी:',
  'khasra.total_area': 'कुल रकबा:',
  'khasra.acquired_area': 'अधिग्रहीत रकबा:',
  'khasra.project': 'परियोजना कॉरिडोर:',
  'khasra.status_label': 'वर्तमान सांविधिक चरण:',
  'khasra.payment_status': 'भुगतान स्थिति:',
  'khasra.award_amount': 'कुल अधिनिर्णय (मुआवजा) राशि:',
  'khasra.solatium_note': '100% अतिरिक्त तोषण राशि सम्मिलित (धारा 30)',
  'khasra.gazette_ref': 'राजपत्र अधिसूचना क्रमांक:',
  'khasra.claim_award_btn': 'आधार द्वारा लॉगिन कर मुआवजा क्लेम करें',
  'khasra.download_btn': 'सत्यापित भू-कार्ड पीडीएफ डाउनलोड करें',

  // Administrative Pillars
  'pillars.tag': 'सांविधिक प्राधिकारी एवं हितधारक संवर्ग',
  'pillars.title': 'पंच-स्तंभीय राष्ट्रीय प्रशासनिक ढांचा',
  'pillars.desc': 'RFCTLARR अधिनियम 2013 की धारा 3, 11, 15, 19, 23 एवं 64 के अंतर्गत निर्धारित संवैधानिक दायित्वों का पारदर्शी निर्वहन।',
  'pillars.pia_title': 'परियोजना कार्यान्वयन एजेंसी (PIA)',
  'pillars.pia_role': 'NHAI / MoRTH परियोजना निदेशक',
  'pillars.pia_desc': 'मार्ग-संरेखण (Alignment), कैडस्ट्रल ओवरलैप विश्लेषण, डीपीआर सत्यापन एवं धारा 11 अधिसूचना प्रस्ताव प्रेषण।',
  'pillars.cala_title': 'सक्षम प्राधिकारी (CALA) / समाहर्ता',
  'pillars.cala_role': 'जिला समाहर्ता एवं भूमि अधिग्रहण सक्षम प्राधिकारी',
  'pillars.cala_desc': 'धारा 15 के अंतर्गत जन-सुनवाई, आपत्तियों का निस्तारण, धारा 19 उद्घोषणा, अवार्ड निर्धारण एवं पीएफएमएस भुगतान।',
  'pillars.ro_title': 'क्षेत्रीय राजस्व अधिकारी / तहसीलदार',
  'pillars.ro_role': 'नायब तहसीलदार, कानूनगो एवं पटवारी',
  'pillars.ro_desc': 'मौके पर डीजीपीएस सीमांकन, जियो-टैग्ड फोटोग्राफी, वृक्ष/फसल/संरचना का संयुक्त भौतिक मूल्यांकन।',
  'pillars.citizen_title': 'नागरिक एवं परियोजना प्रभावित परिवार (PAF)',
  'pillars.citizen_role': 'भू-स्वामी एवं विस्थापित परिवार',
  'pillars.citizen_desc': 'डिजिटल आधार ई-केवाईसी, 100% तोषण सहित क्षतिपूर्ति गणना पत्रक, आपत्ति दर्ज करना एवं डीबीटी ट्रैकिंग।',
  'pillars.central_title': 'केंद्रीय शीर्ष प्राधिकरण (MoRTH)',
  'pillars.central_role': 'मंत्रालय एवं राष्ट्रीय पीएम गतिशक्ति प्रकोष्ठ',
  'pillars.central_desc': 'अखिल भारतीय डैशबोर्ड, अंतर-मंत्रालयीय समन्वय, वास्तविक समय वित्तीय प्रवाह निगरानी एवं नीतिगत निर्णय।',
  'pillars.access_btn': 'अधिकृत पोर्टल प्रवेश →',

  // Gazette Notices
  'gazette.tag': 'भारत का राजपत्र • आधिकारिक प्रकाशन',
  'gazette.title': 'नवीनतम सांविधिक राजपत्र अधिसूचनाएं',
  'gazette.desc': 'सड़क परिवहन एवं राजमार्ग मंत्रालय द्वारा धारा 11 (प्रारंभिक अधिसूचना) एवं धारा 19 (अंतिम अवार्ड उद्घोषणा) के ई-राजपत्र में प्रकाशित आदेश।',
  'gazette.col_ref': 'राजपत्र संदर्भ',
  'gazette.col_stretch': 'परियोजना कॉरिडोर एवं पैकेज',
  'gazette.col_district': 'जिला',
  'gazette.col_section': 'सांविधिक धारा एवं विषय',
  'gazette.col_date': 'प्रकाशन तिथि',
  'gazette.col_status': 'स्थिति',
  'gazette.col_action': 'कार्य',
  'gazette.btn_download': 'डाउनलोड',
  'gazette.btn_view': 'विस्तार से देखें',
  'gazette.status_published': 'प्रकाशित (Published)',
  'gazette.status_under_objection': 'आपत्ति अधीन (Sec 15)',
  'gazette.status_hearing_active': 'सुनवाई सक्रिय (Hearing Active)',
  'gazette.status_gazetted': 'अधिसूचित (Gazetted)',

  // Legal Framework
  'legal.tag': 'सांविधिक अनुपालन एवं कानूनी सुरक्षा',
  'legal.title': 'RFCTLARR अधिनियम 2013: मुख्य कानूनी प्रावधान',
  'legal.sec11_title': 'धारा 11: प्रारंभिक अधिसूचना',
  'legal.sec11_desc': 'संरेखण के अंतर्गत आने वाले ग्रामों एवं खसरों का सार्वजनिक प्रकाशन। किसी भी प्रकार के अवैध अंतरण पर रोक।',
  'legal.sec15_title': 'धारा 15: आपत्तियों की सुनवाई',
  'legal.sec15_desc': 'भू-स्वामियों को 60 दिवस के भीतर आपत्ति दर्ज कराने का वैधानिक अधिकार। CALA द्वारा अनिवार्य व्यक्तिगत सुनवाई।',
  'legal.sec19_title': 'धारा 19: अधिग्रहण उद्घोषणा',
  'legal.sec19_desc': 'पुनर्वासन एवं पुनर्व्यवस्थापन योजना के अनुमोदन उपरांत परियोजना हेतु भूमि की अंतिम वैधानिक उद्घोषणा।',
  'legal.sec23_title': 'धारा 23 एवं 30: 100% तोषण अवार्ड',
  'legal.sec23_desc': 'बाजार मूल्य पर 100% अनिवार्य तोषण (Solatium) जोड़कर कुल मुआवजा निर्धारित कर अवार्ड पारित करना।',
  'legal.sec38_title': 'धारा 38: पूर्ण भुगतान उपरांत कब्जा',
  'legal.sec38_desc': 'जब तक खातेदार के बैंक खाते में मुआवजा पूर्णतः जमा नहीं होता, भूमि पर कब्जा नहीं लिया जा सकता।',
  'legal.sec64_title': 'धारा 64: प्राधिकरण को अपील',
  'legal.sec64_desc': 'अवार्ड की राशि या अधिकारों से असंतुष्ट होने पर भूमि अधिग्रहण, पुनर्वासन एवं पुनर्व्यवस्थापन प्राधिकरण में अपील का अधिकार।',

  // Footer
  'footer.gov_heading': 'भारत सरकार | सड़क परिवहन एवं राजमार्ग मंत्रालय',
  'footer.portal_desc': 'भूसेतु (BhuSetu) राष्ट्रीय राजमार्गों एवं प्रमुख अवसंरचना परियोजनाओं हेतु एकीकृत सांविधिक भूमि अधिग्रहण, कैडस्ट्रल जीआईएस मैपिंग और स्वचालित प्रत्यक्ष लाभ अंतरण पोर्टल है।',
  'footer.links_heading': 'त्वरित लिंक',
  'footer.compliance_heading': 'मानक एवं अनुपालन',
  'footer.helpdesk_heading': 'राष्ट्रीय सहायता केंद्र (हेल्पडेस्क)',
  'footer.helpdesk_phone': 'टोल-फ्री: 1800-11-4771 (कार्यदिवस प्रात: 9:30 से सायं 6:00)',
  'footer.helpdesk_email': 'ईमेल: helpdesk-bhusetu@gov.in',
  'footer.disclaimer': 'अस्वीकरण: इस पोर्टल की सामग्री का प्रबंधन सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH) द्वारा राष्ट्रीय सूचना विज्ञान केंद्र (NIC) के सहयोग से किया जाता है।',
  'footer.copyright': '© 2026 भूसेतु, भारत सरकार। सर्वाधिकार सुरक्षित।',

  // Login Page
  'login.title': 'आधिकारिक राष्ट्रीय प्रवेशद्वार',
  'login.desc': 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH) • सुरक्षित NIC परिचय प्रमाणीकरण नोड',
  'login.tab_officer': 'अधिकारी प्रवेश (Parichay SSO)',
  'login.tab_citizen': 'नागरिक / भू-स्वामी प्रवेश (Aadhaar OTP)',
  'login.role_label': 'संवर्ग एवं आधिकारिक पदनाम का चयन करें',
  'login.email_label': 'शासकीय / NIC ईमेल आईडी',
  'login.password_label': 'पासवर्ड / टोकन पिन',
  'login.captcha_label': 'सुरक्षा कैप्चा सत्यापन',
  'login.btn_officer': 'परिचय SSO द्वारा सुरक्षित लॉगिन करें',
  'login.aadhaar_label': '12-अंकीय आधार संख्या / पंजीकृत मोबाइल',
  'login.otp_label': '6-अंकीय ओटीपी (One-Time Password)',
  'login.btn_send_otp': 'आधार ओटीपी भेजें',
  'login.btn_verify_otp': 'ओटीपी सत्यापित करें एवं नागरिक डैशबोर्ड खोलें',
  'login.resend_otp': 'ओटीपी पुनः भेजें',
  'login.statutory_warning': 'सांविधिक चेतावनी: आधिकारिक भूमि अभिलेखों में अनधिकृत पहुंच अथवा छेड़छाड़ सूचना प्रौद्योगिकी अधिनियम 2000 की धारा 66 तथा RFCTLARR अधिनियम 2013 की धारा 84 के अंतर्गत संज्ञेय अपराध है।',
  'login.ssl_notice': '256-बिट एसएसएल एन्क्रिप्टेड • राष्ट्रीय सूचना विज्ञान केंद्र (NIC) • PFMS एकीकृत',

  // Map Component
  'map.title': 'स्थानिक कॉरिडोर एवं कैडस्ट्रल वेक्टर विजेट',
  'map.chainage': 'NH-48 चेनेज 0+000 से 26+400',
  'map.all': 'सभी',
  'map.not_started': 'प्रारंभ नहीं',
  'map.sec11': 'धारा 11 अधिसूचित',
  'map.award': 'अवार्ड घोषित',
  'map.possession': 'कब्जा प्राप्त',
  'map.disputed': 'विवादित (धारा 64 / न्यायालय)',
  'map.labels_toggle_on': 'लेबल: दृश्य',
  'map.labels_toggle_off': 'लेबल: अदृश्य',
  'map.legend_title': 'RFCTLARR अधिनियम 2013 जीवनचक्र रंग',
  'map.row_line': 'डैश लाइन: 60मी राइट-ऑफ-वे (RoW) केंद्र',
  'map.click_inspect': 'विस्तृत जानकारी हेतु भू-खंड पर क्लिक करें',
  'map.khasra_no': 'खसरा नंबर:',
  'map.village_tehsil': 'ग्राम / तहसील:',
  'map.area': 'अधिग्रहीत रकबा:',
  'map.landowner': 'भू-स्वामी / खातेदार:',
  'map.base_valuation': 'मूल भूमि मूल्यांकन:',
  'map.assets_val': 'परिसंपत्तियां (वृक्ष/मकान):',
  'map.solatium': '100% तोषण (धारा 30):',
  'map.total_award': 'कुल अवार्ड राशि (धारा 23/30):',
  'map.dispute_alert': 'सांविधिक विवाद विवरण:'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('bhusetu_language') as Language;
    if (saved === 'HI' || saved === 'EN') {
      setLanguageState(saved);
      document.documentElement.lang = saved === 'HI' ? 'hi' : 'en';
    }

    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail && (customEvent.detail === 'HI' || customEvent.detail === 'EN')) {
        setLanguageState(customEvent.detail);
        document.documentElement.lang = customEvent.detail === 'HI' ? 'hi' : 'en';
      }
    };

    window.addEventListener('bhusetu_language_change', handleEvent);
    return () => window.removeEventListener('bhusetu_language_change', handleEvent);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bhusetu_language', lang);
    document.documentElement.lang = lang === 'HI' ? 'hi' : 'en';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bhusetu_language_change', { detail: lang }));
    }
  };

  const toggleLanguage = () => {
    const next: Language = language === 'EN' ? 'HI' : 'EN';
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    if (language === 'HI' && HINDI_TRANSLATIONS[key]) {
      return HINDI_TRANSLATIONS[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'EN',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
    };
  }
  return context;
};

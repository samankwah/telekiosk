import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  en: {
    // Top Info Bar
    location: "Block 7, Mboumu Street, Akweteyman, Accra",
    phone: "0333 733 333",
    email: "info@telekiosk.com",
    emergency: "24/7 Emergency",
    emergencyPhone: "0244 111 111",
    language: "English",

    // Header
    hospitalName: "TELEKIOSK",

    // Menu Items
    corporateInfo: "Corporate Info",
    ourServices: "Our Services",
    ourFacilities: "Our Facilities",
    careers: "Careers",
    newsEvents: "News & Events",
    awards: "Awards",
    healthWellnessTips: "Health and Wellness Tips",
    gallery: "Gallery",
    visitingTimes: "Visiting Times",
    contactUs: "Contact Us",

    // Navigation Buttons
    bookAppointment: "Book Appointment",
    directions: "Directions",
    allEnquiries: "For all enquiries & assistance",
    forReferrals: "For Referrals",
    feelFreeContact: "Feel Free to Contact Us",
    referralPhone: "024 411 1111",

    // Hero Section
    heroTitle: "PROVIDING THE BEST MEDICAL CARE",
    heroSubtitle:
      "Our team of first-class medical professionals focus on individual care and quality treatment for all",
    findDoctor: "Find doctor or service...",

    // Footer
    openingHours: "Opening Hours",
    usefulLinks: "Useful Links",
    getConnected: "Get Connected",
    followUs: "Follow Us At:",
    mondayFriday: "Monday – Friday:",
    saturday: "Saturday:",
    sunday: "Sunday:",
    emergency24: "Emergency:",
    hours24: "24 Hours / 7 Days",
    opdNote: "OPD Specialists consultation is based on appointment",
    copyright: "© 2025 TeleKiosk | All Rights Reserved.",
    siteBy: "Site By: ByteShift™",
    team: "Team",
    newsArticles: "News Articles",
    missionVision: "Mission & Vision",

    // Services Section
    servicesTitle: "Specialized Services for all your Health & Care Need",
    servicesSubtitle:
      "Our Health Services provide a range of quality medical services for outpatients and inpatients",
    specialists: "Specialists",
    outpatients: "Outpatients",
    catheterization: "Catheterization",
    gastroscopy: "Gastroscopy",
    allied: "Allied",
    radiology: "Radiology",
    medicalProfessionalImage: "Medical Professional Image",
    cardiology: "Cardiology",
    cardiologyDesc:
      "Comprehensive heart care with state-of-the-art diagnostic and treatment facilities",
    neurology: "Neurology",
    neurologyDesc:
      "Expert neurological care for conditions affecting the brain, spine and nervous system",
    orthopedics: "Orthopedics",
    orthopedicsDesc:
      "Advanced orthopedic care for bone, joint and muscle conditions",
    pediatrics: "Pediatrics",
    pediatricsDesc:
      "Specialized medical care for infants, children and adolescents",
    gynecology: "Gynecology",
    gynecologyDesc:
      "Complete women's health services including obstetrics and gynecological care",
    emergencyService: "Emergency Care",
    emergencyDesc:
      "24/7 emergency medical services with rapid response and advanced life support",

    // About Section
    aboutTitle: "About TeleKiosk Hospital",
    aboutSubtitle: "Leading healthcare excellence in Ghana since 1998",
    aboutDescription:
      "TeleKiosk Hospital is a multi-disciplinary private healthcare facility focusing on the best possible clinical outcomes for our patients and their families.",
    aboutUs: "ABOUT US",
    aboutMainTitle: "Quality patient-focused health care",
    takeTour: "Take a quick tour of our",
    facilities: "Facilities",
    videoTourSoon: "Video Tour Coming Soon",
    yearsExperience: "Years of Excellence",
    yearsLabel: "Years",
    specialistsLabel: "Specialists",
    patientVisitsLabel: "Patient Visits\nAnnually",
    assistanceLabel: "Assistance Available\n24/7",
    happyPatients: "Happy Patients",
    expertDoctors: "Expert Doctors",
    modernRooms: "Modern Rooms",

    // Facilities Section
    facilitiesTitle:
      "World-class facilities for effective healthcare solutions",
    facilitiesSubtitle:
      "Up-to-date and well equipped, our facilities are tailored to provide the best possible medical care for our patients",
    catheterisationLab: "Catheterisation Laboratory",
    coffeeShop: "Coffee Shop",
    dentalDepartment: "Dental Department",
    entDepartment: "ENT Department",
    executiveSuites: "Executive and VVIP Suites",
    icuHighCare: "ICU and High Care",
    lithotripsyUnit: "Lithotripsy Unit",
    maternityWard: "Maternity Ward",
    neonatalICU: "Neonatal ICU",
    obstetricsGynecology: "Obstetrics & Gynaecology",
    opticalCentre: "Optical Centre",
    outpatientsDepartment: "Outpatients Department",
    paediatricWard: "Paediatric Ward",
    renalDepartment: "Renal Department",
    theatres: "Theatres",
    urologyDepartment: "Urology Department",
    operatingTheater: "Operating Theater",
    operatingTheaterDesc:
      "Modern surgical suites equipped with the latest technology for safe procedures",
    icu: "Intensive Care Unit",
    icuDesc: "24/7 critical care monitoring with advanced life support systems",
    laboratory: "Laboratory Services",
    laboratoryDesc:
      "Comprehensive diagnostic testing with quick and accurate results",
    pharmacy: "Pharmacy",
    pharmacyDesc:
      "Full-service pharmacy with wide range of medications and health products",

    // Doctors Section
    doctorsTitle: "Highly skilled medical specialists",
    doctorsSubtitle:
      "Our team of first-class medical professionals focuses on individual care and quality treatment for all patients.",
    drCharlotte: "Dr. Charlotte Osafo",
    drSaeed: "Dr. Saeed Jibreel",
    drEmmanuel: "Dr. Emmanuel Asensio-Mensah",
    drSmith: "Dr. Sarah Smith",
    drSmithTitle: "Chief Cardiologist",
    drSmithExp: "15+ years experience",
    drJohnson: "Dr. Michael Johnson",
    drJohnsonTitle: "Neurologist",
    drJohnsonExp: "12+ years experience",
    drBrown: "Dr. Emily Brown",
    drBrownTitle: "Pediatrician",
    drBrownExp: "10+ years experience",

    // News Section
    newsTitle: "Up to date information related to our services and your health",
    newsSubtitle:
      "Stay informed about our latest achievements and health information",
    news1Date: "FEBRUARY 4, 2025",
    news1Title:
      "TeleKiosk Hospital's Laboratory Becomes Ghana's First Private Lab to Attain ISO Accreditation",
    news2Date: "FEBRUARY 4, 2025",
    news2Title:
      "TeleKiosk Hospital Launches State-of-the-art Call Center: A New Era of Exceptional Service",
    news3Date: "JANUARY 31, 2025",
    news3Title: "The Importance of Omega-3 Fatty Acids in Heart Health",
    viewAll: "View All",

    // Common
    bookNow: "Book Now",
    callNow: "Call Now",
    getStarted: "Get Started",

    // Visiting Times Page
    visitingTimesTitle: "Visiting Times & Meal Service",
    visitingTimesDesc:
      "Please review our visiting hours and meal service times to plan your visit accordingly. These schedules help us provide the best care for our patients.",
    backToHome: "Back to Home",
    vvipUnit: "VVIP Unit",
    paediatricUnit: "Paediatric Unit",
    intensiveCareUnit: "Intensive Care Unit",
    maternity: "Maternity",
    nicuFathers: "NICU Fathers",
    nicuMothers: "NICU Mothers:",
    medicalSurgicalWard: "Medical and Surgical ward",
    morning: "Morning:",
    afternoon: "Afternoon:",
    evening: "Evening:",
    mealServiceTimes: "MEAL SERVICE TIMES",
    breakfast: "Breakfast:",
    lunch: "Lunch:",
    dinner: "Dinner:",
    bedtimeSnacks: "Bedtime Snacks:",
    specialArrangementsNote:
      "Special arrangements can be made with the unit manager",
    ageRestrictionNote:
      "Special permission is required for visitors under the age of 12",
    fatherVisitNote:
      "Father is allowed to visit at any time within the specified visiting period",
    partnerSleepNote:
      "Partners are only allowed to sleep over when clients are admitted to the executive ward",

    // Contact Us Page
    contactUsTitle: "CONTACT US",
    fillTheForm: "FILL THE FORM",
    namePlaceholder: "Your full name",
    emailPlaceholder: "your.email@example.com",
    phonePlaceholder: "+233 XX XXX XXXX",
    messagePlaceholder: "A short description of your enquiry",
    nameLabel: "Name*",
    emailLabel: "Email*",
    phoneLabel: "Phone*",
    enquiryLabel: "Enquiry",
    messageLabel: "Message",
    submitRequest: "Submit Request",
    generalEnquiry: "General Enquiry",
    appointmentBooking: "Appointment Booking",
    medicalConsultation: "Medical Consultation",
    emergencyServices: "Emergency Services",
    billingInsurance: "Billing & Insurance",
    feedbackComplaints: "Feedback & Complaints",
    thankYouMessage:
      "Thank you for your enquiry. We will get back to you soon!",
    generalEnquiriesCall: "For General Enquiries Call us on",
    referralsCall: "For Referrals Call us on",
    emergencyCall: "For Emergency Call us on",
    openingHoursLabel: "Opening Hours: Mon - Fri: 8:00 am - 7:00 pm",
    emergency24Hours: "Emergency: 24 Hours / 7 Days",

    // Book Now Page
    chooseSpecialty: "Choose Your Specialty",
    pickTime: "Pick Your Perfect Time",
    tellUsAboutYou: "Tell Us About Yourself",
    almostThere: "Almost There! 🎉",
    selectSpecialtyDesc:
      "Select the medical specialty you need consultation for",
    chooseDateTimeDesc: "Choose a date and time that works best for you",
    basicInfoDesc:
      "We need some basic information to prepare for your consultation",
    reviewBookingDesc: "Please review your booking details before confirming",
    dermatology: "Dermatology",
    availableDoctors: "Available Doctors",
    availableDates: "Available Dates",
    availableTimeSlots: "Available Time Slots",
    fullNameLabel: "Full Name *",
    emailAddressLabel: "Email Address *",
    phoneNumberLabel: "Phone Number *",
    symptomsLabel: "Symptoms/Reason for Visit",
    enterFullName: "Enter your full name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    describeSymptomsPlaceholder:
      "Briefly describe your symptoms or reason for consultation",
    bookingSummary: "Booking Summary",
    specialty: "Specialty:",
    doctor: "Doctor:",
    date: "Date:",
    time: "Time:",
    patient: "Patient:",
    contact: "Contact:",
    bookingConfirmed: "Booking Confirmed! 🎉",
    consultationScheduled:
      "Your video consultation has been successfully scheduled",
    bookingFailed: "Booking Failed",
    meetingInviteSent: "📧 Meeting Invite Sent!",
    emailSentTo: "Email sent to:",
    googleMeetLink: "Google Meet Link:",
    important: "Important:",
    back: "Back",
    previous: "Previous",
    continue: "Continue",
    confirmBooking: "Confirm Booking",
    confirming: "Confirming...",
    bookAnotherAppointment: "Book Another Appointment",
    tryAgain: "Try Again",
    backToDoctors: "Back to Doctors",
    onlineVideoConsultation: "Online Video Consultation",
    videoConsultationLinkInfo:
      "Video consultation link will be sent to your email",
    checkEmailDetails: "Check your email for the complete meeting details",
    joinMeetingEarly: "Join the meeting 5 minutes early",
    addAppointmentCalendar: "Add the appointment to your calendar",
    unexpectedError: "An unexpected error occurred. Please try again.",

    // Referrals Page
    referrals: "Referrals",
    doctorReferralForm: "DOCTOR REFERRAL FORM",
    referringDoctorInfo: "REFERRING DOCTOR INFORMATION",
    patientContactInfo: "PATIENT CONTACT INFORMATION",
    referralForPlaceholder: "Referral for",
    clinicNumberPlaceholder: "Clinic Number",
    addressPlaceholder: "Address",
    phoneNumberPlaceholder: "Phone Number",
    fullNamePlaceholder: "Full Name",
    contactNumberPlaceholder: "Contact Number",
    dateOfBirthPlaceholder: "dd/mm/yyyy",
    referringDoctorCommentsPlaceholder: "Referring Doctor's Comments",
    genderLabel: "Gender",
    male: "Male",
    female: "Female",
    home: "Home",
    referralSubmittedSuccess: "Referral request submitted successfully!",

    // Doctors Page
    doctorsHeroTitle:
      "Our team of first-class medical professionals focus on individual care and quality treatment for all.",
    ourDoctors: "OUR DOCTORS",
    doctorsQualificationDesc:
      "Our doctors are highly qualified and have the experience to meet your medical needs.",

    // About Us Page
    qualityHealthcareDesc:
      "TeleKiosk Hospital provides quality healthcare driven by a strong, customer-centric focus.",
    qualityPatientFocused: "QUALITY PATIENT-FOCUSED",
    healthcare: "HEALTH CARE",
    bankHospitalDesc:
      "TeleKiosk Hospital is a multi-disciplinary private healthcare facility focusing on the best possible clinical outcomes for our patients and their families.",
    modernFacilitiesDesc:
      "With modern up to date facilities and state of the art equipment, TeleKiosk Hospital offers a broad spectrum of expert medical care and services to meet the needs of the communities we serve, in Accra, Ghana and almost our continent.",
    yourHealthPriority: "YOUR HEALTH IS OUR TOP PRIORITY. CLICK HERE TO",
    scheduleAppointment: "Schedule an Appointment",
    modernFacilitiesSubdesc:
      "Our modern, up-to-date facilities are tailored to provide the best outcomes for our patients and include:",
    hospitalAtGlance: "TeleKiosk Hospital at a glance",
    takeTourFacilities: "Take a quick tour of our Facilities",
    years: "Years",
    patientVisits: "Patient Visits",
    annually: "Annually",
    medical: "Medical",
    assistanceAvailable: "Assistance available",
    generalWards:
      "Comfortable, air conditioned general wards and executive suites",
    pediatricWard:
      "A bright, child-friendly pediatric ward creates a welcoming environment for kids",
    maternityUnit: "Safe, secure maternity unit, nursery and neonatal ICU",
    diagnosticCenters:
      "Full equipped diagnostic and treatment centers designed for patients provide a comfortable and innovative environment",
    outpatientDept: "Well appointed, fully equipped Outpatient Department",
    emergencyUnit: "24/7 Emergency unit and ambulance service",
    exploreFacilities:
      "Take a moment to explore all of our facilities and discover how we can meet your needs.",
    viewFacilities: "View our Facilities",
    ourSpecialists: "OUR SPECIALISTS",
    specialistsDesc:
      "Our highly skilled and experienced medical specialists offer a comprehensive range of specialties to ensure your health and wellbeing – for both inpatients and outpatients.",
    alliedHealthServices: "ALLIED HEALTH SERVICES",
    alliedHealthDesc:
      "Our allied health services provide a range of complementary medical services to ensure your health and wellbeing.",
    viewAllSpecialists: "View All Specialists",
    viewAllServices: "View All Services",

    // Mission Vision Page
    missionVisionDesc:
      "Our mission and vision guide everything we do at TeleKiosk Hospital, driving our commitment to excellence in healthcare.",
    ourMission: "OUR MISSION",
    ourVision: "OUR VISION",
    coreValue: "CORE VALUE",
    missionStatement:
      "To deliver quality, client-focused healthcare through the provision of a comprehensive range of timely services rendered with professionalism.",
    visionStatement: "To become the healthcare provider of choice.",
    compassion: "Compassion",
    teamwork: "Teamwork",
    respect: "Respect",
    innovation: "Innovation",
    professionalism: "Professionalism",

    // Doctor Profile Page
    doctorTeamDesc:
      "Our team of first-class medical professionals focuses on individual care and quality treatment of all.",
    goBack: "Go Back",
    qualifications: "Qualifications:",
    specialtyLabel: "Specialty:",
    statusLabel: "Status (Fulltime/sessional):",
    designationLabel: "Designation/Additional Roles:",
    clinicDaysLabel: "Clinic Days/Working Hours:",
    areasOfInterest: "Areas of interest:",
    doctorNotFound: "Doctor not found",
    profile: "Profile",

    // Doctors Page
    doctorsDesc:
      "Our doctors are highly qualified and have the experience to meet your medical needs.",
    schedule: "Schedule:",
    status: "Status:",
    available: "Available",
    busy: "Busy",
    onCall: "On Call",

    // Booking Page
    websiteUrl: "www.telekiosk.com",
    developBy: "Develop by Technofy™",
    browserNoSupport:
      "Your browser does not support iframes. Please visit Google Maps directly.",

    // Map Modal
    hospitalLocation: "Hospital Location",
    addressLabel: "Address:",
    hospitalAddress: "Ghana Meteorological Agency Area, Accra",
    openInGoogleMaps: "Open in Google Maps",

    // Header Menu Items (already exist but adding for completeness)
    corporateInfoMenu: "Corporate Info",
    aboutUsMenu: "About Us",
    missionVisionMenu: "Mission & Vision",
    teamMenu: "Team",
    ourServicesMenu: "Our Services",
    ourDoctorsMenu: "Our Doctors",
    healthWellnessTipsMenu: "Health & Wellness Tips",
    visitingTimesMenu: "Visiting Times",
    contactUsMenu: "Contact Us",

    // Time ranges for visiting times
    vvipMorning: "6:30 AM – 7:30 AM",
    vvipAfternoon: "12:00 PM – 1:00 PM",
    vvipEvening: "6:30 PM – 7:30 PM",
    paediatricMorning: "10:30 AM – 12:30 PM",
    paediatricEvening: "4:30 PM – 6:30 PM",
    icuMorning: "10:30 AM – 11:30 AM",
    icuEvening: "4:30 PM – 5:30 PM",
    maternityMorning: "6:00 AM – 7:00 AM",
    maternityAfternoon: "12:00 PM – 1:00 PM",
    maternityEvening: "5:00 PM – 6:00 PM",
    nicuFathersMorning: "7:00 AM – 7:30 AM",
    nicuFathersEvening: "4:30 PM – 5:30 PM",
    nicuMothersMorning: "09:00 AM – 10:00 AM",
    nicuMothersAfternoon: "12:00 PM – 1:00 PM",
    nicuMothersAfternoon2: "3:00 PM – 4:00 PM",
    nicuMothersEvening: "6:00 PM – 7:00 PM",
    medicalMorning: "6:30 AM – 7:30 PM",
    medicalAfternoon: "12:00 PM – 1:00 PM",
    medicalEvening: "6:30 PM – 7:30 PM",
    breakfastTime: "6:30 AM – 8:00 AM",
    lunchTime: "12:00 PM – 1:00 PM",
    dinnerTime: "5:30 PM – 7:00 PM",
    bedtimeSnacksTime: "8:00 PM – 9:00 PM",

    // About Section specific
    openingHoursTime: "7 AM – 7 PM",
    videoTimestamp: "0:02 / 5:15",

    // Health & Wellness Page
    healthWellnessSubtitle:
      "Up to date information related to our services and your health",
    articleNotFound: "Article Not Found",
    backToHealthWellness: "Back to Health & Wellness",
    backToHealthWellnessTips: "Back to Health & Wellness Tips",
    categories: "Categories",
    recentPosts: "Recent Posts",

    // Map Modal
    hospitalLocationMap: "Hospital Location Map",
    browserNotSupport:
      "Your browser does not support iframes. Please visit Google Maps directly.",
    address: "Address",

    // Scroll to Top
    scrollToTop: "Scroll to top",

    // Medical Services
    emergencyMedicine: "Emergency Medicine",
    generalMedicine: "General Medicine",
    surgery: "Surgery",

    // All Pages
    facilitiesHeroText:
      "Up-to-date and well equipped, our facilities are tailored to provide the best possible medical care for our patients",
    healthServices: "Health Services",

    // News Categories
    technology: "Technology",
    events: "Events",
    wellness: "Wellness",
    community: "Community",
    accreditation: "Accreditation",

    // News Titles (removing duplicates - these are already defined earlier)

    // Health & Wellness Categories
    allTopics: "All Topics",
    nutrition: "Nutrition",
    mentalHealth: "Mental Health",
    fitness: "Fitness",
    emergencyCare: "Emergency Care",
    womensHealth: "Women's Health",
    naturalRemedies: "Natural Remedies",
    publicHealth: "Public Health",
    preventiveCare: "Preventive Care",
    chronicDisease: "Chronic Disease Management",
    childHealth: "Child Health",
    seniorHealth: "Senior Health",

    // Error Messages
    errorOccurred: "An error occurred",
    pageNotFound: "Page not found",
    tryAgainLater: "Please try again later",
    connectionError: "Connection error",

    // Form Labels
    required: "Required",
    optional: "Optional",
    pleaseSelect: "Please select",
    chooseOption: "Choose an option",

    // Time Related
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    thisMonth: "This month",
    thisYear: "This year",

    // Sidebar Categories
    covid19: "COVID-19",
    doctorsSpotlight: "Doctors Spotlight",
    healthArticles: "Health Articles",
    news: "News",
    pressReleases: "Press Releases",

    // Services Page - Missing translations
    medicalProfessional: "Medical Professional",
    medicalResearchCare: "Medical research and care",
    hospitalCorridor: "Hospital Corridor",
    cleanModernFacility: "Clean modern facility",
    department: "DEPARTMENT",
    aim: "AIM",
    objectives: "OBJECTIVES",
    services: "SERVICES",
    support: "SUPPORT",
    expected: "EXPECTED",
    outcome: "OUTCOME",
    professionalStethoscope: "Professional Stethoscope",
    cardiacAssessmentTool: "Cardiac assessment tool",

    // Search placeholders (UI only)
    searchServices: "Search services...",
    searchArticles: "Search articles...",
    searchNews: "Search news and events...",

    // Cardiology Service Content
    cardiologyName: "CARDIOLOGY",
    cardiologyDescription:
      "Cardiovascular diseases are the leading cause of death globally, taking an estimated 17.9 million lives each year. 9 of of the world's death from cardiovascular diseases occur in low- and middle-income countries of which Ghana is inclusive. People in low-middle income countries often do not have the benefit of integrated primary health care programmes for early detection and treatment of people with cardiovascular disease risk factors.",
    cardiologyExtendedDescription:
      "As a result, people in these countries die early from cardiovascular diseases often in their most productive years.",
    cardiologyAim:
      "Improve cardiovascular care and save lives of Ghanaians with Atherosclerotic cardiovascular diseases such as coronary artery disease.",
    cardiologyOutcome:
      "Save and improve the lives of patients with cardiovascular diseases.",
    cardiologyImageDescription:
      "CT Scanner Room - Advanced cardiac imaging equipment",
  },

  tw: {
    // Top Info Bar (Twi translations)
    location: "Block F6, Shippi Road, Cantonments, Accra",
    phone: "0302 739 373",
    email: "info@telekiosk.com",
    emergency: "Amanehunu 24/7",
    emergencyPhone: "0599 211 311",
    language: "Twi",

    // Header
    hospitalName: "TELEKIOSK AYARESABEA",

    // Menu Items
    corporateInfo: "Adwumakuw Ho Nsɛm",
    ourServices: "Yɛn Nnwuma",
    ourFacilities: "Yɛn Mmeae",
    careers: "Adwuma",
    newsEvents: "Nsɛm ne Dwumadie",
    awards: "Abasobɔdeɛ",
    healthWellnessTips: "Akwahosan ne Asomdwoeɛ Akwankyerɛ",
    gallery: "Mfoni Beaeɛ",
    visitingTimes: "Nsrahwɛ Mmerɛ",
    contactUs: "Frɛ Yɛn",

    // Navigation Buttons
    bookAppointment: "Hyɛ Nhyiam",
    directions: "Ɔkwan",

    // Hero Section
    heroTitle: "YƐDE AYARESABEA PA REMA",
    heroSubtitle:
      "Yɛn nnuruyɛfoɔ a wɔyɛ adwuma pa de wɔn adwene si ankorankoro hwɛ ne ayaresa pa so ma obiara",
    findDoctor: "Hwehwɛ ɔdɔkota anaa adwuma...",

    // Footer
    openingHours: "Bueɛ Mmerɛ",
    usefulLinks: "Nkitahoadze a Ɛho Hia",
    getConnected: "Kɔ Yɛn Nkyɛn",
    followUs: "Di Yɛn Akyi Wɔ:",
    mondayFriday: "Dwoada – Fiada:",
    saturday: "Memeneda:",
    sunday: "Kwasiada:",
    emergency24: "Amanehunu:",
    hours24: "Nnɔnhwerew 24 / Nna 7",
    opdNote: "OPD Nnuruyɛfoɔ nhyiam gyina nhyiam so",
    copyright: "© 2025 TeleKiosk | Hokwan Nyinaa wɔ Hɔ.",
    siteBy: "Wɛbsaet: Technofy™",

    // Services Section
    servicesTitle: "Yɛn Akwahosan Nnwuma Soronko",
    servicesSubtitle:
      "Yɛn Akwahosan Nnwuma de ayaresa nnwuma ahodoɔ pii ma amanfoɔ a wɔba ne wɔn a wɔtra hɔ",
    specialists: "Nnuruyɛfoɔ",
    outpatients: "Amanfoɔ a Wɔba",
    catheterization: "Catheterization",
    gastroscopy: "Gastroscopy",
    allied: "Mmoa Ayaresa",
    radiology: "Radiology",
    medicalProfessionalImage: "Ayaresa Nnipa Mfoni",
    cardiology: "Akoma Ayaresa",
    cardiologyDesc: "Akoma ayaresa a ɛyɛ den na ɛwɔ mfiri foforo",
    neurology: "Amoa Ayaresa",
    neurologyDesc: "Amoa, akyi na mpoetam ayaresa a ɛyɛ den",
    orthopedics: "Nnompe Ayaresa",
    orthopedicsDesc: "Nnompe, nkwamoa ne ntini ayaresa a ɛyɛ den",
    pediatrics: "Mmofra Ayaresa",
    pediatricsDesc: "Mmofra ne mmaaba ayaresa soronko",
    gynecology: "Mmaa Ayaresa",
    gynecologyDesc: "Mmaa akwahosan ho nnwuma nyinaa",
    emergencyService: "Amanehunu Ayaresa",
    emergencyDesc: "Amanehunu ayaresa awia ne anadwo",

    // About Section
    aboutTitle: "TeleKiosk Ayaresabea Ho",
    aboutSubtitle: "Ayaresa pa wɔ Ghana firi 1998",
    aboutDescription:
      "TeleKiosk yɛ ayaresabea soronko a ɛde n'adwene si amanfoɔ ne wɔn mmusua ayaresa pa so.",
    aboutUs: "YƐN HO",
    aboutMainTitle: "Amanfoɔ ayaresa pa a ɛyɛ den",
    takeTour: "Fa amane tiawa hwɛ yɛn",
    facilities: "Mmeae",
    videoTourSoon: "Video Nhwehwɛmu Reba",
    yearsExperience: "Mfeɛ a Yɛayɛ Adwuma Pa",
    yearsLabel: "Mfeɛ",
    specialistsLabel: "Nnuruyɛfoɔ",
    patientVisitsLabel: "Amanfoɔ Nhwehwɛmu\nAfe Biara",
    assistanceLabel: "Mmoa wɔ Hɔ\n24/7",
    happyPatients: "Amanfoɔ a Wɔn Ani Gye",
    expertDoctors: "Nnuruyɛfoɔ a Wɔnim Adwuma",
    modernRooms: "Adan Foforo",

    // Facilities Section
    facilitiesTitle: "Ayaresabea Mmeae a Ɛyɛ Fɛ",
    facilitiesSubtitle: "Mfiri foforo ne beaeɛ a ɛyɛ fɛ ma ayaresa pa",
    operatingTheater: "Oprehyɛn Baeɛ",
    operatingTheaterDesc: "Oprehyɛn mmeae a ɛwɔ mfiri foforo",
    icu: "Ayaresa Kɛseɛ Baeɛ",
    icuDesc: "Ayaresa kɛseɛ hwɛ awia ne anadwo",
    laboratory: "Nhwehwɛmu Baeɛ",
    laboratoryDesc: "Nhwehwɛmu a ɛyɛ ntɛm na ɛyɛ nokware",
    pharmacy: "Nnua Dwa",
    pharmacyDesc: "Nnua dwa a ɛwɔ nnua ahodoɔ pii",

    // Doctors Section
    doctorsTitle: "Hyia Yɛn Nnuruyɛfoɔ",
    doctorsSubtitle: "Nnuruyɛfoɔ a wɔnim adwuma ma wo akwahosan",
    drSmith: "Ɔdɔkota Sarah Smith",
    drSmithTitle: "Akoma Ɔdɔkota Panin",
    drSmithExp: "Mfeɛ 15+ osuahu",
    drJohnson: "Ɔdɔkota Michael Johnson",
    drJohnsonTitle: "Amoa Ɔdɔkota",
    drJohnsonExp: "Mfeɛ 12+ osuahu",
    drBrown: "Ɔdɔkota Emily Brown",
    drBrownTitle: "Mmofra Ɔdɔkota",
    drBrownExp: "Mfeɛ 10+ osuahu",

    // News Section
    newsTitle: "Nsɛm Foforo",
    newsSubtitle: "Te nsɛm foforo ne akwahosan ho nsɛm",
    viewAll: "Hwɛ Nyinaa",

    // Common
    bookNow: "Hyɛ Seesei",
    callNow: "Frɛ Seesei",
    getStarted: "Firi Aseɛ",

    // Visiting Times Page
    visitingTimesTitle: "Nsrahwɛ Mmerɛ ne Aduane Ɛmmerɛ",
    visitingTimesDesc:
      "Yɛsrɛ wo hwɛ yɛn nsrahwɛ mmerɛ ne aduane ɛmmerɛ na woayɛ wo nsrahwɛ ho nhyehyɛeɛ. Saa nhyehyɛeɛ yi boa yɛn ma yɛde ayaresa pa ma yɛn amanfoɔ.",
    backToHome: "San Kɔ Efi",
    vvipUnit: "VVIP Beaeɛ",
    paediatricUnit: "Mmofra Beaeɛ",
    intensiveCareUnit: "Ayaresa Kɛseɛ Beaeɛ",
    maternity: "Awoɔ Beaeɛ",
    nicuFathers: "NICU Agyanom",
    nicuMothers: "NICU Ɛnanom:",
    medicalSurgicalWard: "Ayaresa ne Oprehyɛn Beaeɛ",
    morning: "Anɔpa:",
    afternoon: "Awiaberɛ:",
    evening: "Anwummerɛ:",
    mealServiceTimes: "ADUANE ƐMMERƐ",
    breakfast: "Anɔpa Aduane:",
    lunch: "Awia Aduane:",
    dinner: "Anwummer Aduane:",
    bedtimeSnacks: "Nna Mmerɛ Aduane:",
    specialArrangementsNote: "Wɔbɛtumi ayɛ nhyehyɛeɛ soronko ne beaeɛ panin no",
    ageRestrictionNote:
      "Ɛho hia sɛ wɔma kwan ma nsrahwɛfoɔ a wɔn mfeɛ nnuru 12",
    fatherVisitNote:
      "Agya bɛtumi akɔsra bere biara wɔ nsrahwɛ mmerɛ a wɔahyɛ no mu",
    partnerSleepNote:
      "Hokafoɔ tumi da hɔ sɛ ɛte sɛ amanfoɔ no wɔ adwumayɛbea panin mu nko ara",

    // Contact Us Page
    contactUsTitle: "FRƐ YƐN",
    fillTheForm: "HYƐ KRATAA NO MU",
    namePlaceholder: "Wo din mua",
    emailPlaceholder: "wo.email@nhwɛsoɔ.com",
    phonePlaceholder: "+233 XX XXX XXXX",
    messagePlaceholder: "Wo bisa tiawa",
    nameLabel: "Din*",
    emailLabel: "Email*",
    phoneLabel: "Telefon*",
    enquiryLabel: "Bisa",
    messageLabel: "Nkrasɛm",
    submitRequest: "Soma Adesrɛ",
    generalEnquiry: "Bisa Soronko",
    appointmentBooking: "Nhyiam Hyɛ",
    medicalConsultation: "Ayaresa Ho Akyerɛkyerɛ",
    emergencyServices: "Amanehunu Nnwuma",
    billingInsurance: "Sika Abom ne Mmoa",
    feedbackComplaints: "Adwenkyerɛ ne Anwiinwii",
    thankYouMessage: "Yɛda wo ase wɔ wo bisa ho! Yɛbɛsan aba wo nkyɛn ntɛm so!",
    generalEnquiriesCall: "Bisa Soronko ho no frɛ yɛn wɔ",
    referralsCall: "Tumi Krataa ho no frɛ yɛn wɔ",
    emergencyCall: "Amanehunu ho no frɛ yɛn wɔ",
    openingHoursLabel: "Bueɛ Mmerɛ: Dwoada – Fiada: 8:00 am - 7:00 pm",
    emergency24Hours: "Amanehunu: Nnɔnhwerew 24 / Nna 7",

    // Book Now Page
    chooseSpecialty: "Paw Wo Ayaresa Soronko",
    pickTime: "Paw Wo Berɛ Pa",
    tellUsAboutYou: "Ka Wo Ho Asɛm Kyerɛ Yɛn",
    almostThere: "Yɛrebɛdu! 🎉",
    selectSpecialtyDesc: "Paw ayaresa soronko a wo hia wɔ akyerɛkyerɛ ho",
    chooseDateTimeDesc: "Paw da ne berɛ a ɛyɛ ma wo",
    basicInfoDesc: "Yɛhia wo ho nsɛm tiawa ama yɛasiesie wo akyerɛkyerɛ",
    reviewBookingDesc: "Yɛsrɛ wo hwɛ wo nhyiam ho nsɛm ansa na woasi so dua",
    dermatology: "Honam Ani Ayaresa",
    availableDoctors: "Nnuruyɛfoɔ a Wɔwɔ Hɔ",
    availableDates: "Nna a Ɛwɔ Hɔ",
    availableTimeSlots: "Mmerɛ a Ɛwɔ Hɔ",
    fullNameLabel: "Din Mua *",
    emailAddressLabel: "Email Address *",
    phoneNumberLabel: "Telefon Nɔma *",
    symptomsLabel: "Yare/Ɔkwan a Woba",
    enterFullName: "Kyerɛw wo din mua",
    enterEmail: "Kyerɛw wo email",
    enterPhone: "Kyerɛw wo telefon nɔma",
    describeSymptomsPlaceholder: "Ka wo yare anaa ɔkwan a woba no ho tiawa",
    bookingSummary: "Nhyiam Nsɛm",
    specialty: "Ayaresa Soronko:",
    doctor: "Ɔdɔkota:",
    date: "Da:",
    time: "Berɛ:",
    patient: "Ɔyarefoɔ:",
    contact: "Telefon:",
    bookingConfirmed: "Nhyiam a Wɔagye Atom! 🎉",
    consultationScheduled: "Wɔahyɛ wo video akyerɛkyerɛ no yie",
    bookingFailed: "Nhyiam Amyɛ Yie",
    meetingInviteSent: "📧 Nhyiam Totofrɛ a Wɔasoma!",
    emailSentTo: "Email a wɔasoma akɔ:",
    googleMeetLink: "Google Meet Link:",
    important: "Ɛho Hia:",
    back: "San",
    previous: "Ɛkan no",
    continue: "Kɔ So",
    confirmBooking: "Si Nhyiam no So Dua",
    confirming: "Resi So Dua...",
    bookAnotherAppointment: "Hyɛ Nhyiam Foforɔ",
    tryAgain: "San Sɔ Hwɛ",
    backToDoctors: "San Kɔ Nnuruyɛfoɔ Nkyɛn",
    onlineVideoConsultation: "Intanɛt So Video Akyerɛkyerɛ",
    videoConsultationLinkInfo:
      "Video akyerɛkyerɛ link no wɔbɛsoma akɔ wo email mu",
    checkEmailDetails: "Hwɛ wo email mu ma nhyiam no ho nsɛm mua",
    joinMeetingEarly: "Kɔ nhyiam no mu ntɛm simma 5 ansa",
    addAppointmentCalendar: "Fa nhyiam no kɔ wo kalenda mu",
    unexpectedError: "Asɛm bi a yɛnhwɛeɛ da aba. Yɛsrɛ wo san sɔ hwɛ.",

    // Referrals Page
    referrals: "Tumi Krataa",
    doctorReferralForm: "ƆDƆKOTA TUMI KRATAA",
    referringDoctorInfo: "ƆDƆKOTA A ƆDE BA NO HO NSƐM",
    patientContactInfo: "ƆYAREFOƆ TELEFON HO NSƐM",
    referralForPlaceholder: "Tumi krataa ma",
    clinicNumberPlaceholder: "Ayaresabea Nɔma",
    addressPlaceholder: "Efie",
    phoneNumberPlaceholder: "Telefon Nɔma",
    fullNamePlaceholder: "Din Mua",
    contactNumberPlaceholder: "Telefon Nɔma",
    dateOfBirthPlaceholder: "da/ɔsram/afe",
    referringDoctorCommentsPlaceholder: "Ɔdɔkota a Ɔde Ba no Adwenkyerɛ",
    genderLabel: "Onini/Ɔbaa",
    male: "Onini",
    female: "Ɔbaa",
    home: "Efi",
    referralSubmittedSuccess: "Tumi krataa adesrɛ a wɔasoma yie!",

    // Doctors Page
    doctorsHeroTitle:
      "Yɛn nnuruyɛfoɔ soronko kuw de wɔn adwene si ankorankoro hwɛ ne ayaresa pa so ma obiara",
    ourDoctors: "YƐN NNURUYƐFOƆ",
    doctorsQualificationDesc:
      "Yɛn nnuruyɛfoɔ wɔ abasobɔde kɛseɛ na wɔwɔ osuahu a ɛbɛtumi ayɛ wo ayaresa ahiadeɛ.",

    // About Us Page
    qualityHealthcareDesc:
      "The Bank Ayaresabea de ayaresa pa a ɛgyina amanfoɔ so rema.",
    qualityPatientFocused: "AYARESA PA A ƐSI AMANFOƆ",
    healthcare: "AKWAHOSAN SO",
    bankHospitalDesc:
      "The Bank Ayaresabea yɛ ayaresabea soronko a ɛde n'adwene si ayaresa pa a ɛyɛ ma amanfoɔ ne wɔn mmusua so.",
    modernFacilitiesDesc:
      "Ɛnam mfiri foforo ne mmeae pa so no, The Bank Ayaresabea de ayaresa pa ahodoɔ pii ma mpɔtam a yɛsom wɔn wɔ Nkran, Ghana ne yɛn asaase yi so nyinaa.",
    yourHealthPriority: "WO AKWAHOSAN YƐ ADEƐ TITIRE MA YƐN. KLIK HA",
    scheduleAppointment: "Hyɛ Nhyiam",
    modernFacilitiesSubdesc:
      "Yɛn mfiri foforo ne mmeae a wɔasiesie ayɛ ma ayaresa pa ma yɛn amanfoɔ ne:",
    hospitalAtGlance: "The Bank Ayaresabea mfaatuo",
    takeTourFacilities: "Yɛ yɛn mmeae no mu akwantu tiawa bi",
    years: "Mfeɛ",
    patientVisits: "Amanfoɔ Nsrahwɛ",
    annually: "Afe Biara",
    medical: "Ayaresa",
    assistanceAvailable: "Mmoa wɔ hɔ",
    generalWards: "Mpɔn a ɛyɛ fɛ, mframa a ɛhyɛ mu ne adwumayɛfoɔ aban",
    pediatricWard: "Mmofra ayaresadan a ɛyɛ fɛ na ɛyɛ mmofra dɛ",
    maternityUnit:
      "Awowuo dan a ɛyɛ ban, mmofra hwɛso ne mmofra intensive care",
    diagnosticCenters:
      "Nhwehwɛmu ne ayaresa mmeae a wɔasiesie ama amanfoɔ anya ahotɔ",
    outpatientDept: "Outpatient Department a wɔasiesie ayɛ",
    emergencyUnit: "Ntɛm ayaresa ne ambulance nnwuma 24/7",
    exploreFacilities:
      "Fa berɛ kakra hwɛ yɛn mmeae nyinaa na hu sɛnea yɛbɛtumi aboa wo.",
    viewFacilities: "Hwɛ Yɛn Mmeae",
    ourSpecialists: "YƐN NNURUYƐFOƆ",
    specialistsDesc:
      "Yɛn nnuruyɛfoɔ a wɔwɔ nimdeɛ ne osuahu de ayaresa ahodoɔ pii ma wo akwahosan ne wo yiyediɛ – ma wɔn a wɔtra hɔ ne wɔn a wɔba ara.",
    alliedHealthServices: "AKWAHOSAN MMOA NNWUMA",
    alliedHealthDesc:
      "Yɛn akwahosan mmoa nnwuma de ayaresa nnwuma foforɔ pii ma wo akwahosan ne wo yiyediɛ.",
    viewAllSpecialists: "Hwɛ Nnuruyɛfoɔ Nyinaa",
    viewAllServices: "Hwɛ Nnwuma Nyinaa",
    viewOurFacilities: "Hwɛ Yɛn Mmeae",
    bankHospitalGlance: "The Bank Ayaresabea mfɛntom",
    youtube: "YouTube",
    takeQuickTour: "Fa akwantuo tiawa hwɛ yɛn",
    medicalAssistance: "Ayaresa",

    // Mission Vision Page
    missionVisionDesc:
      "Yɛn botaeɛ ne yɛn anidaso kyerɛ deɛ yɛyɛ biara wɔ The Bank Ayaresabea, na ɛkanyan yɛn sɛ yɛnyɛ ayaresa pa.",
    ourMission: "YƐN BOTAEƐ",
    ourVision: "YƐN ANIDASO",
    coreValue: "GYINAPƐN BOƆ",
    missionStatement:
      "Sɛ yɛde ayaresa pa, amanfoɔ-a-ɛsi-wɔn-so nnwuma ma ɛnam nnwuma ahodoɔ pii a yɛyɛ no amammere mu so.",
    visionStatement: "Sɛ yɛbɛyɛ ayaresa pa a nnipa paw no.",
    compassion: "Ayamhyehyeɛ",
    teamwork: "Kuo mu Adwuma",
    respect: "Obuo",
    innovation: "Nneɛma Foforɔ",
    professionalism: "Adwuma Pa",

    // Doctor Profile Page
    doctorTeamDesc:
      "Yɛn nnuruyɛfoɔ a wɔwɔ suban pa de wɔn adwene si ankorankoro hwɛ ne ayaresa pa so ma obiara.",
    goBack: "San Kɔ",
    qualifications: "Adesua:",
    specialtyLabel: "Ayaresa Soronko:",
    statusLabel: "Tebea (Berɛ nyinaa/ɛberɛ bi):",
    designationLabel: "Tumi/Nnwuma Foforɔ:",
    clinicDaysLabel: "Ayaresabea Nna/Adwuma Mmerɛ:",
    areasOfInterest: "Adeɛ a ɔpɛ:",
    doctorNotFound: "Wonhunuu ɔdɔkota no",
    profile: "Ho Nsɛm",

    // Doctors Page
    doctorsDesc:
      "Yɛn nnuruyɛfoɔ wɔ adesua pa na wɔwɔ osuahu a ɛbɛboa wo ayaresa.",
    schedule: "Nhyehyɛeɛ:",
    status: "Tebea:",
    available: "Ɔwɔ Hɔ",
    busy: "Ɔreyɛ Adwuma",
    onCall: "Wɔbɛtumi afrɛ no",

    // Booking Page
    websiteUrl: "www.telekiosk.com",
    developBy: "Technofy™ na ɛyɛeɛ",
    browserNoSupport:
      "Wo browser nnyae iframe. Yɛsrɛ wo kɔ Google Maps ncua so.",

    // Map Modal
    hospitalLocation: "Ayaresabea Beaeɛ",
    addressLabel: "Beaeɛ:",
    hospitalAddress: "Ghana Mframa Ho Amansan Beaeɛ, Nkran",
    openInGoogleMaps: "Bue wɔ Google Maps mu",

    // Header Menu Items
    corporateInfoMenu: "Adwumakuw Ho Nsɛm",
    aboutUsMenu: "Yɛn Ho",
    missionVisionMenu: "Botaeɛ ne Anidaso",
    teamMenu: "Ekuo",
    ourServicesMenu: "Yɛn Nnwuma",
    ourDoctorsMenu: "Yɛn Nnuruyɛfoɔ",
    healthWellnessTipsMenu: "Akwahosan ne Asomdwoeɛ Akwankyerɛ",
    visitingTimesMenu: "Nsrahwɛ Mmerɛ",
    contactUsMenu: "Frɛ Yɛn",

    // Time ranges for visiting times
    vvipMorning: "6:30 AM – 7:30 AM",
    vvipAfternoon: "12:00 PM – 1:00 PM",
    vvipEvening: "6:30 PM – 7:30 PM",
    paediatricMorning: "10:30 AM – 12:30 PM",
    paediatricEvening: "4:30 PM – 6:30 PM",
    icuMorning: "10:30 AM – 11:30 AM",
    icuEvening: "4:30 PM – 5:30 PM",
    maternityMorning: "6:00 AM – 7:00 AM",
    maternityAfternoon: "12:00 PM – 1:00 PM",
    maternityEvening: "5:00 PM – 6:00 PM",
    nicuFathersMorning: "7:00 AM – 7:30 AM",
    nicuFathersEvening: "4:30 PM – 5:30 PM",
    nicuMothersMorning: "09:00 AM – 10:00 AM",
    nicuMothersAfternoon: "12:00 PM – 1:00 PM",
    nicuMothersAfternoon2: "3:00 PM – 4:00 PM",
    nicuMothersEvening: "6:00 PM – 7:00 PM",
    medicalMorning: "6:30 AM – 7:30 PM",
    medicalAfternoon: "12:00 PM – 1:00 PM",
    medicalEvening: "6:30 PM – 7:30 PM",
    breakfastTime: "6:30 AM – 8:00 AM",
    lunchTime: "12:00 PM – 1:00 PM",
    dinnerTime: "5:30 PM – 7:00 PM",
    bedtimeSnacksTime: "8:00 PM – 9:00 PM",

    // About Section specific
    openingHoursTime: "7 AM – 7 PM",
    videoTimestamp: "0:02 / 5:15",

    // Health & Wellness Page (Twi)
    healthWellnessSubtitle: "Nsɛm foforo a ɛfa yɛn nnwuma ne wo akwahosan ho",
    articleNotFound: "Wonhunuu Krataa no",
    backToHealthWellness: "San Kɔ Akwahosan ne Asomdwoeɛ",
    backToHealthWellnessTips: "San Kɔ Akwahosan ne Asomdwoeɛ Akwankyerɛ",
    categories: "Akwankyerɛ Ahodoɔ",
    recentPosts: "Krataa Foforo",

    // Map Modal (Twi)
    hospitalLocationMap: "Ayaresabea Beaeɛ Map",
    browserNotSupport:
      "Wo browser nnyae iframe. Yɛsrɛ wo kɔ Google Maps ncua so.",
    address: "Beaeɛ",

    // Scroll to Top (Twi)
    scrollToTop: "Kɔ soro",

    // Medical Services (Twi)
    emergencyMedicine: "Amanehunu Ayaresa",
    generalMedicine: "Ayaresa Soronko",
    surgery: "Oprehyɛn",

    // All Pages (Twi)
    facilitiesHeroText:
      "Mfiri foforo ne beaeɛ a ɛyɛ fɛ a wɔasiesie ama yɛn amanfoɔ anya ayaresa pa",
    healthServices: "Akwahosan Nnwuma",

    // News Categories (Twi)
    technology: "Mfiri Foforɔ",
    events: "Dwumadie",
    wellness: "Asomdwoeɛ",
    community: "Mpɔtam",
    accreditation: "Abasobɔdeɛ",

    // News Titles (Twi)
    news1Title:
      "The Bank Ayaresabea Nhwehwɛmu Bɛɛ ayɛ Ghana Soronko Nhwehwɛmu a Ɛdi Kan a Ɔnyaa ISO Abasobɔdeɛ",
    news2Title: "The Bank Ayaresabea de Frɛfrɛ Bɛɛ Foforɔ Reba: Ɔsom Pa Foforɔ",
    news3Title: "The Bank Ayaresabea Di Amanfoɔ Som Nnawɔtwe 2024 Afahyɛ",
    news4Title: "The Bank Ayaresabea Asomdwoeɛ Bɛɛ a Wɔde Baeɛ no Afahyɛ",
    news5Title: "Makola Nsrahwɛ Amanebɔ",
    news6Title: "ISO ABASOBƆDEƐ – Nhwehwɛmu Som a Ɛyɛ Pa ho Bɔhyɛ",

    // Health & Wellness Categories (Twi)
    allTopics: "Nsɛm Nyinaa",
    nutrition: "Aduane",
    mentalHealth: "Adwene Akwahosan",
    fitness: "Apɔmuden",
    emergencyCare: "Amanehunu Ayaresa",
    womensHealth: "Mmaa Akwahosan",
    naturalRemedies: "Abɔdeɛ Nnua",
    publicHealth: "Ɔman Akwahosan",
    preventiveCare: "Yare Anodwɔ",
    chronicDisease: "Yare a Ɛkyɛre",
    childHealth: "Mmofra Akwahosan",
    seniorHealth: "Mpanin Akwahosan",

    // Error Messages (Twi)
    errorOccurred: "Mfomsoɔ aba",
    pageNotFound: "Wonhunuu kratafa no",
    tryAgainLater: "Yɛsrɛ wo san sɔ hwɛ akyire yi",
    connectionError: "Nkitahoadze mfomsoɔ",

    // Form Labels (Twi)
    required: "Ɛho Hia",
    optional: "Ɛho Nhia",
    pleaseSelect: "Yɛsrɛ wo paw",
    chooseOption: "Paw kwan bi",

    // Time Related (Twi)
    today: "Ɛnnɛ",
    yesterday: "Nnɛra",
    tomorrow: "Ɔkyena",
    thisWeek: "Saa dapɛn yi",
    thisMonth: "Saa ɔsram yi",
    thisYear: "Saa afe yi",

    // Sidebar Categories (Twi)
    covid19: "COVID-19",
    doctorsSpotlight: "Nnuruyɛfoɔ Kanea",
    healthArticles: "Akwahosan Krataa",
    news: "Nsɛm",
    pressReleases: "Nsɛm Krataa",

    // Services Page - Twi translations
    medicalProfessional: "Ayaresa Nnipa",
    medicalResearchCare: "Ayaresa nhwehwɛmu ne hwɛ",
    hospitalCorridor: "Ayaresabea Kwan",
    cleanModernFacility: "Beaeɛ a ɛyɛ fɛ na ɛyɛ foforo",
    department: "DWUMADIBEA",
    aim: "BOTAEƐ",
    objectives: "NHYEHYƐEƐ",
    services: "NNWUMA",
    support: "MMOA",
    expected: "ANIDASOƆ",
    outcome: "ABATOƆ",
    professionalStethoscope: "Nnuruyɛfoɔ Stethoscope",
    cardiacAssessmentTool: "Akoma nhwehwɛmu adwinnadeɛ",

    // Search placeholders (UI only)
    searchServices: "Hwehwɛ nnwuma...",
    searchArticles: "Hwehwɛ krataa...",
    searchNews: "Hwehwɛ nsɛm ne amammere...",

    // Cardiology Service Content - Twi
    cardiologyName: "AKOMA AYARESA",
    cardiologyDescription:
      "Akoma yadeɛ na ɛkum nkurɔfoɔ pii wɔ wiase nyinaa, na ɛkum nkurɔfoɔ bɛyɛ ɔpepem 17.9 afeɛ biara. Wiase amaneɛ 9 mu 9 firi akoma yadeɛ ba aman a wɔnyɛ adefoɔ mu te sɛ Ghana. Nkurɔfoɔ a wɔwɔ aman a wɔnyɛ adefoɔ mu no ntaa nnya akwahosan nhyehyɛeɛ pa a ɛbɛboa wɔn ahu akoma yadeɛ ntɛm.",
    cardiologyExtendedDescription:
      "Eyi nti, nkurɔfoɔ a wɔwɔ aman yi mu no wu ntɛm firi akoma yadeɛ mu wɔ wɔn mfeɛ a wɔyɛ adwuma pa mu.",
    cardiologyAim:
      "Yɛn botaeɛ ne sɛ yɛbɛma Ghanaman akoma ayaresa atu mpɔn na yɛagye wɔn a wɔwɔ akoma yadeɛ no nkwa.",
    cardiologyOutcome: "Gye akoma yadeɛfoɔ nkwa na ma wɔn asetena nyɛ yie.",
    cardiologyImageDescription: "CT Scanner Dan - Akoma nhwehwɛmu mfiri foforo",
  },

  ga: {
    // Top Info Bar (Ga translations)
    location: "Block F6, Shippi Road, Cantonments, Accra",
    phone: "0302 739 373",
    email: "info@telekiosk.com",
    emergency: "Gbejɛ Kɛɛ 24/7",
    emergencyPhone: "0599 211 311",
    language: "Ga",

    // Header
    hospitalName: "TELEKIOSK AYƆƆLƆ JƐƐ",

    // Menu Items
    corporateInfo: "Kpakpami Lɛ Wiemɔ",
    ourServices: "Ni Ŋmami Lɛ",
    ourFacilities: "Ni Bɛɛ Lɛ",
    careers: "Ŋmashie",
    newsEvents: "Shisemi Ni Amami",
    awards: "Akɔɔnɔ Lɛ",
    healthWellnessTips: "Ayɔɔlɔ Ni Ayɔɔlɔmami Akwɛɛ",
    gallery: "Kpakpa Bɛɛ",
    visitingTimes: "Nlɛɛ Mli",
    contactUs: "Frɛ Ni",

    // Navigation Buttons
    bookAppointment: "Wɔ Appointment",
    directions: "Sane",

    // Hero Section
    heroTitle: "NI FƐƐ AYƆƆLƆ NAAMƐƐ PA",
    heroSubtitle: "Ni ayɔɔlɔ nuu lɛ fɛɛ kɛ fɛɛ ni mi kɛɛ ayɔɔlɔ pa ma kɛɛ nii",
    findDoctor: "Kpɛɛ ayɔɔlɔ nuu bee adwuma...",

    // Footer
    openingHours: "Jei Mli",
    usefulLinks: "Nkitaho Mli Lɛ",
    getConnected: "Baa Ni Kɛ",
    followUs: "Di Ni Kɔɔ:",
    mondayFriday: "Dzu Tsɛɛ – Kɔɔbli Tsɛɛ:",
    saturday: "Memle Tsɛɛ:",
    sunday: "Kɔɔle Tsɛɛ:",
    emergency24: "Gbejɛ Kɛɛ:",
    hours24: "Awumɔɔ 24 / Tsɛɛ 7",
    opdNote: "OPD ayɔɔlɔ nuu appointment lɛ ŋɔɔ nɔ",
    copyright: "© 2025 TeleKiosk | Hokwan Kɛɛ Lɛ Ni Tsɛ.",
    siteBy: "Website: Technofy™",

    // Services Section
    servicesTitle: "Ni Ayɔɔlɔ Ŋmami Sɔrɔɔŋkɔ Lɛ",
    servicesSubtitle:
      "Ni Ayɔɔlɔ Ŋmami de ayɔɔlɔ ŋmami lɛ sɔrɔɔŋkɔ ma mi lɛ he baa kɛ wɔn he tra hɔ",
    specialists: "Ayɔɔlɔ Nuu Lɛ",
    outpatients: "Mi Lɛ He Baa",
    catheterization: "Catheterization",
    gastroscopy: "Gastroscopy",
    allied: "Mmoa Ayɔɔlɔ",
    radiology: "Radiology",
    medicalProfessionalImage: "Ayɔɔlɔ Nuu Kpakpa",
    cardiology: "Shɔmi Ayɔɔlɔ",
    cardiologyDesc: "Shɔmi ayɔɔlɔ he fɛɛ kɛ mɛɛni foforɔ lɛ",
    neurology: "Ni Ayɔɔlɔ",
    neurologyDesc: "Ni, kɔɔ kɛ bɔɔlɔ ayɔɔlɔ he fɛɛ",
    orthopedics: "Wo Ayɔɔlɔ",
    orthopedicsDesc: "Wo, nkwami kɛ ntini ayɔɔlɔ he fɛɛ",
    pediatrics: "Vi Lɛ Ayɔɔlɔ",
    pediatricsDesc: "Vi lɛ kɛ viɔ lɛ ayɔɔlɔ sɔrɔɔŋkɔ",
    gynecology: "Nyɔnmɔ Lɛ Ayɔɔlɔ",
    gynecologyDesc: "Nyɔnmɔ lɛ ayɔɔlɔ ŋmami kɛɛ lɛ",
    emergencyService: "Gbejɛ Ayɔɔlɔ",
    emergencyDesc: "Gbejɛ ayɔɔlɔ wiemɔ kɛ zan",

    // About Section
    aboutTitle: "TeleKiosk Ayɔɔlɔ Jɛɛ Ŋɔ",
    aboutSubtitle: "Ayɔɔlɔ pa ni Ghana tso 1998",
    aboutDescription:
      "TeleKiosk Ayɔɔlɔ Jɛɛ lɛ ayɔɔlɔ jɛɛ sɔrɔɔŋkɔ he mi lɛ kɛ wɔn mmusua ayɔɔlɔ pa ni kɛɛ.",
    aboutUs: "NI ŊƆ",
    aboutMainTitle: "Mi lɛ ayɔɔlɔ pa he fɛɛ",
    takeTour: "Nyɛ amane tiawa kpɛ ni",
    facilities: "Bɛɛ Lɛ",
    videoTourSoon: "Video Nhwehwɛmu Baa",
    yearsExperience: "Afe Lɛ He Ni Ŋmaa Adwuma Pa",
    yearsLabel: "Afe Lɛ",
    specialistsLabel: "Ayɔɔlɔ Nuu Lɛ",
    patientVisitsLabel: "Mi Lɛ Nhwehwɛmu\nAfe Kɛɛ",
    assistanceLabel: "Mmoa Lɛ\n24/7",
    happyPatients: "Mi Lɛ He Wɔ Ani Gye",
    expertDoctors: "Ayɔɔlɔ Nuu Lɛ He Wɔ Nim Adwuma",
    modernRooms: "Ban Foforɔ Lɛ",

    // Facilities Section
    facilitiesTitle: "Ayɔɔlɔ Jɛɛ Bɛɛ Lɛ He Fɛɛ",
    facilitiesSubtitle: "Mɛɛni foforɔ lɛ kɛ bɛɛ he fɛɛ ma ayɔɔlɔ pa",
    operatingTheater: "Oprehyɛn Bɛɛ",
    operatingTheaterDesc: "Oprehyɛn bɛɛ lɛ he mɛɛni foforɔ lɛ lɛ",
    icu: "Ayɔɔlɔ Kɛsɛɛ Bɛɛ",
    icuDesc: "Ayɔɔlɔ kɛsɛɛ hwɛ wiemɔ kɛ zan",
    laboratory: "Nhwehwɛmu Bɛɛ",
    laboratoryDesc: "Nhwehwɛmu he fɛɛ ntɛm kɛ nokware",
    pharmacy: "Nnua Dwa",
    pharmacyDesc: "Nnua dwa he nnua sɔrɔɔŋkɔ pii lɛ",

    // Doctors Section
    doctorsTitle: "Kpɛ Ni Ayɔɔlɔ Nuu Lɛ",
    doctorsSubtitle: "Ayɔɔlɔ nuu lɛ he nim adwuma ma a ayɔɔlɔ",
    drSmith: "Ayɔɔlɔ Nuu Sarah Smith",
    drSmithTitle: "Shɔmi Ayɔɔlɔ Nuu Panin",
    drSmithExp: "Afe 15+ osuahu",
    drJohnson: "Ayɔɔlɔ Nuu Michael Johnson",
    drJohnsonTitle: "Ni Ayɔɔlɔ Nuu",
    drJohnsonExp: "Afe 12+ osuahu",
    drBrown: "Ayɔɔlɔ Nuu Emily Brown",
    drBrownTitle: "Vi Lɛ Ayɔɔlɔ Nuu",
    drBrownExp: "Afe 10+ osuahu",

    // News Section
    newsTitle: "Shisemi Foforɔ Lɛ",
    newsSubtitle: "Gbɔɔ shisemi foforɔ lɛ kɛ ayɔɔlɔ ho shisemi",
    viewAll: "Kpɛ Kɛɛ Lɛ",

    // Common

    bookNow: "Wɔ Fɛɛ",
    callNow: "Frɛ Fɛɛ",
    getStarted: "Shishi",

    // Visiting Times Page
    visitingTimesTitle: "Nlɛɛ Mli Ni Amami Mli",
    visitingTimesDesc:
      "Yɛ srɛ wo kpɛ ni nlɛɛ mli ni amami mli ma a wɔ wo nlɛɛ nhyehyɛeɛ. Saa nhyehyɛeɛ lɛ boa ni ma ni ayɔɔlɔ pa kɛ ni mi lɛ.",
    backToHome: "San Kɔ Fie",
    vvipUnit: "VVIP Bɛɛ",
    paediatricUnit: "Vi Lɛ Bɛɛ",
    intensiveCareUnit: "Ayɔɔlɔ Kɛsɛɛ Bɛɛ",
    maternity: "Awo Bɛɛ",
    nicuFathers: "NICU Papa Lɛ",
    nicuMothers: "NICU Maa Lɛ:",
    medicalSurgicalWard: "Ayɔɔlɔ Ni Oprehyɛn Bɛɛ",
    morning: "Leshi:",
    afternoon: "Awiabli:",
    evening: "Fie Kɔɔ:",
    mealServiceTimes: "AMAMI MLI",
    breakfast: "Leshi Amami:",
    lunch: "Awiabli Amami:",
    dinner: "Fie Kɔɔ Amami:",
    bedtimeSnacks: "Nɔ Mli Amami:",
    specialArrangementsNote:
      "Wɔ bɛ tumi ayɛ nhyehyɛeɛ sɔrɔɔŋkɔ kɛ bɛɛ panin no",
    ageRestrictionNote:
      "Ɛ ho hia sɛ wɔ ma kwan ma nlɛɛ mi lɛ a wɔn afe nn uru 12",
    fatherVisitNote:
      "Papa bɛ tumi akɔ nlɛɛ mli biara wɔ nlɛɛ mli a wɔ ahyɛ no mu",
    partnerSleepNote:
      "Hoka mi lɛ tumi nɔ hɔ sɛ ɛ te sɛ amanfoɔ no wɔ adwuma bɛɛ panin mu nko ara",

    // Contact Us Page
    contactUsTitle: "FRƐ NI",
    fillTheForm: "HYƐ KRATAA NO MU",
    namePlaceholder: "A ŋmɛ mua",
    emailPlaceholder: "a.email@nhwɛsoɔ.com",
    phonePlaceholder: "+233 XX XXX XXXX",
    messagePlaceholder: "A bisa tiawa",
    nameLabel: "Ŋmɛ*",
    emailLabel: "Email*",
    phoneLabel: "Telefon*",
    enquiryLabel: "Bisa",
    messageLabel: "Shisemi",
    submitRequest: "Soma Adesrɛ",
    generalEnquiry: "Bisa Sɔrɔɔŋkɔ",
    appointmentBooking: "Nhyiam Wɔ",
    medicalConsultation: "Ayɔɔlɔ Ho Akyerɛkyerɛ",
    emergencyServices: "Gbejɛ Kɛɛ Ŋmami",
    billingInsurance: "Sika Akɔntu Ni Mmoa",
    feedbackComplaints: "Adwenkyerɛ Ni Anwiintoɔ",
    thankYouMessage: "Ni da a ase wɔ a bisa ho! Ni bɛ san aba a nkyɛn ntɛm so!",
    generalEnquiriesCall: "Bisa Sɔrɔɔŋkɔ ho no frɛ ni wɔ",
    referralsCall: "Tumi Krataa ho no frɛ ni wɔ",
    emergencyCall: "Gbejɛ ho no frɛ ni wɔ",
    openingHoursLabel: "Jei Mli: Dzu Tsɛɛ – Kɔɔbli Tsɛɛ: 8:00 am - 7:00 pm",
    emergency24Hours: "Gbejɛ: Awumɔɔ 24 / Tsɛɛ 7",

    // Book Now Page
    chooseSpecialty: "Paw A Ayɔɔlɔ Sɔrɔɔŋkɔ",
    pickTime: "Paw A Mli Pa",
    tellUsAboutYou: "Ka A Ho Asɛm Kyerɛ Ni",
    almostThere: "Ni rebɛ du! 🎉",
    selectSpecialtyDesc: "Paw ayɔɔlɔ sɔrɔɔŋkɔ a a hia wɔ akyerɛkyerɛ ho",
    chooseDateTimeDesc: "Paw tsɛɛ ni mli a ɛ yɛ ma a",
    basicInfoDesc: "Ni hia a ho nsɛm tiawa ama ni asiesie a akyerɛkyerɛ",
    reviewBookingDesc: "Yɛ srɛ a kpɛ a nhyiam ho nsɛm ansa na a si so dua",
    dermatology: "Honam Ani Ayɔɔlɔ",
    availableDoctors: "Ayɔɔlɔ Nuu Lɛ a Wɔ Wɔ Hɔ",
    availableDates: "Tsɛɛ Lɛ a Ɛ Wɔ Hɔ",
    availableTimeSlots: "Mli Lɛ a Ɛ Wɔ Hɔ",
    fullNameLabel: "Ŋmɛ Mua *",
    emailAddressLabel: "Email Address *",
    phoneNumberLabel: "Telefon Nɔma *",
    symptomsLabel: "Yare/Ɔkwan a A Ba",
    enterFullName: "Kyerɛw a ŋmɛ mua",
    enterEmail: "Kyerɛw a email",
    enterPhone: "Kyerɛw a telefon nɔma",
    describeSymptomsPlaceholder: "Ka a yare anaa ɔkwan a a ba no ho tiawa",
    bookingSummary: "Nhyiam Nsɛm",
    specialty: "Ayɔɔlɔ Sɔrɔɔŋkɔ:",
    doctor: "Ayɔɔlɔ Nuu:",
    date: "Tsɛɛ:",
    time: "Mli:",
    patient: "Ɔyarefoɔ:",
    contact: "Telefon:",
    bookingConfirmed: "Nhyiam a Wɔ Gye Atom! 🎉",
    consultationScheduled: "Wɔ ahyɛ a video akyerɛkyerɛ no yie",
    bookingFailed: "Nhyiam A myɛ Yie",
    meetingInviteSent: "📧 Nhyiam Totofrɛ a Wɔ Soma!",
    emailSentTo: "Email a wɔ soma akɔ:",
    googleMeetLink: "Google Meet Link:",
    important: "Ɛ Ho Hia:",
    back: "San",
    previous: "Ɛ kan no",
    continue: "Kɔ So",
    confirmBooking: "Si Nhyiam no So Dua",
    confirming: "Re si So Dua...",
    bookAnotherAppointment: "Wɔ Nhyiam Foforɔ",
    tryAgain: "San Sɔ Kpɛ",
    backToDoctors: "San Kɔ Ayɔɔlɔ Nuu Lɛ Nkyɛn",
    onlineVideoConsultation: "Online Video Akyerɛkyerɛ",
    videoConsultationLinkInfo:
      "Video akyerɛkyerɛ link no wɔ bɛ soma akɔ a email mu",
    checkEmailDetails: "Kpɛ a email mu ma nhyiam no ho nsɛm mua",
    joinMeetingEarly: "Kɔ nhyiam no mu ntɛm minute 5 ansa",
    addAppointmentCalendar: "Fa nhyiam no kɔ a calendar mu",
    unexpectedError: "Asɛm bi a ni nhwɛ eɛ da aba. Yɛ srɛ a san sɔ kpɛ.",

    // Referrals Page
    referrals: "Tumi Krataa Lɛ",
    doctorReferralForm: "AYƆƆLƆ NUU TUMI KRATAA",
    referringDoctorInfo: "AYƆƆLƆ NUU A Ɔ DE BA NO HO NSƐM",
    patientContactInfo: "ƆYAREFOƆ TELEFON HO NSƐM",
    referralForPlaceholder: "Tumi krataa ma",
    clinicNumberPlaceholder: "Ayɔɔlɔ Jɛɛ Nɔma",
    addressPlaceholder: "Fie",
    phoneNumberPlaceholder: "Telefon Nɔma",
    fullNamePlaceholder: "Ŋmɛ Mua",
    contactNumberPlaceholder: "Telefon Nɔma",
    dateOfBirthPlaceholder: "da/ɔsram/afe",
    referringDoctorCommentsPlaceholder: "Ayɔɔlɔ Nuu a Ɔ de Ba no Adwenkyerɛ",
    genderLabel: "Barima/Nyɔnmɔ",
    male: "Barima",
    female: "Nyɔnmɔ",
    home: "Fie",
    referralSubmittedSuccess: "Tumi krataa adesrɛ a wɔ soma yie!",

    // Doctors Page
    doctorsHeroTitle:
      "Ni ayɔɔlɔ nuu tɛɛ lɛ kuw de wɔn adwene si ankorankoro hwɛ ni ayɔɔlɔ pa so ma kɛɛ nii",
    ourDoctors: "NI AYƆƆLƆ NUU LƐ",
    doctorsQualificationDesc:
      "Ni ayɔɔlɔ nuu lɛ wɔ abasobɔde kɛseɛ ni wɔ wɔ suahu a ɛ bɛ tumi yɛ a ayɔɔlɔ hiadeɛ.",

    // About Us Page
    qualityHealthcareDesc:
      "The Bank Ayɔɔlɔ Jɛɛ de ayɔɔlɔ pa a ɛ gyina mi lɛ so rema.",
    qualityPatientFocused: "AYƆƆLƆ PA A ƐSI MI LƐ",
    healthcare: "AYƆƆLƆ SO",
    bankHospitalDesc:
      "The Bank Ayɔɔlɔ Jɛɛ yɛ ayɔɔlɔ jɛɛ sɔrɔɔŋkɔ a ɛ de n'adwene si ayɔɔlɔ pa a ɛ yɛ ma mi lɛ kɛ wɔn mmusua so.",
    modernFacilitiesDesc:
      "Ɛ nam mɛɛni foforɔ ni bɛɛ pa so no, The Bank Ayɔɔlɔ Jɛɛ de ayɔɔlɔ pa ahodoɔ pii ma mpɔtam a ni som wɔn wɔ Nkran, Ghana ni ni asaase yi so nyinaa.",
    yourHealthPriority: "A AYƆƆLƆ YƐ ADEƐ TITIRE MA NI. KLIK HA",
    scheduleAppointment: "Wɔ Nhyiam",
    modernFacilitiesSubdesc:
      "Ni mɛɛni foforɔ ni bɛɛ a wɔ siesie ayɛ ma ayɔɔlɔ pa ma ni mi lɛ ni:",
    hospitalAtGlance: "The Bank Ayɔɔlɔ Jɛɛ mɛlɛ",
    takeTourFacilities: "Yɛ ni bɛɛ lɛ mu akwantuo tiaa bi",
    years: "Mfeɛ",
    patientVisits: "Mi Lɛ Nsrakɛ",
    annually: "Afe Biara",
    medical: "Ayɔɔlɔ",
    assistanceAvailable: "Mmoa wɔ hɔ",
    generalWards: "Bɛɛ a ɛ yɛ fɛ, mframa a ɛ hyɛ mu ni adwumayɛ mi aban",
    pediatricWard: "Mmɔfrɔ ayɔɔlɔ dan a ɛ yɛ fɛ ni ɛ yɛ mmɔfrɔ dɛ",
    maternityUnit: "Mmaa dan a ɛ yɛ ban, mmɔfrɔ hwɛso ni mmɔfrɔ intensive care",
    diagnosticCenters:
      "Nhwehwɛmu ni ayɔɔlɔ bɛɛ a wɔ siesie ama mi lɛ anya ahotɔ",
    outpatientDept: "Outpatient Department a wɔ siesie ayɛ",
    emergencyUnit: "Ntɛm ayɔɔlɔ ni ambulance nnwuma 24/7",
    exploreFacilities:
      "Fa berɛ kakra hwɛ ni bɛɛ nyinaa ni hu sɛnea ni bɛ tumi boa a.",
    viewFacilities: "Hwɛ Ni Bɛɛ Lɛ",
    ourSpecialists: "NI AYƆƆLƆ NUU LƐ",
    specialistsDesc:
      "Ni ayɔɔlɔ nuu lɛ a wɔ wɔ nimdeɛ ni osuahu de ayɔɔlɔ ahodoɔ pii ma a ayɔɔlɔ ni a yiye diɛ – ma wɔn a wɔ tra hɔ ni wɔn a wɔ ba ara.",
    alliedHealthServices: "AYƆƆLƆ MMOA ŊMAMI",
    alliedHealthDesc:
      "Ni ayɔɔlɔ mmoa ŋmami de ayɔɔlɔ ŋmami foforɔ pii ma a ayɔɔlɔ ni a yiye diɛ.",
    viewAllSpecialists: "Kpɛ Ayɔɔlɔ Nuu Lɛ Nyinaa",
    viewAllServices: "Kpɛ Ŋmami Nyinaa",
    viewOurFacilities: "Kpɛ Ni Bɛɛ Lɛ",
    bankHospitalGlance: "The Bank Ayɔɔlɔ Jɛɛ mfɛntom",
    youtube: "YouTube",
    takeQuickTour: "Fa akwantuo tiawa kpɛ ni",
    medicalAssistance: "Ayɔɔlɔ",

    // Mission Vision Page
    missionVisionDesc:
      "Ni botaeɛ ni ni anidaso kyerɛ deɛ ni yɛ biara wɔ The Bank Ayɔɔlɔ Jɛɛ, na ɛ kanyan ni sɛ ni nyɛ ayɔɔlɔ pa.",
    ourMission: "NI BOTAEƐ",
    ourVision: "NI ANIDASO",
    coreValue: "GYINAPƐN BOƆ",
    missionStatement:
      "Sɛ ni de ayɔɔlɔ pa, mi lɛ-a-ɛ-si-wɔn-so ŋmami ma ɛ nam ŋmami ahodoɔ pii a ni yɛ no amammli mu so.",
    visionStatement: "Sɛ ni bɛ yɛ ayɔɔlɔ pa a nnipa paw no.",
    compassion: "Ayamhyehyeɛ",
    teamwork: "Kuo mu Ŋmaa",
    respect: "Obuo",
    innovation: "Nneɛma Foforɔ",
    professionalism: "Ŋmaa Pa",

    // Doctor Profile Page
    doctorTeamDesc:
      "Ni ayɔɔlɔ nuu lɛ a wɔ wɔ suban pa de wɔn adwene si ankorankoro kpɛ ni ayɔɔlɔ pa so ma obiara.",
    goBack: "San Kɔ",
    qualifications: "Adesua:",
    specialtyLabel: "Ayɔɔlɔ Sɔrɔɔŋkɔ:",
    statusLabel: "Tebea (Mli nyinaa/mli bi):",
    designationLabel: "Tumi/Ŋmami Foforɔ:",
    clinicDaysLabel: "Ayɔɔlɔ Jɛɛ Tsɛɛ/Ŋmaa Mli:",
    areasOfInterest: "Adeɛ a ɔ pɛ:",
    doctorNotFound: "Wo nhu uu ayɔɔlɔ nuu no",
    profile: "Ho Nsɛm",

    // Doctors Page
    doctorsDesc:
      "Ni ayɔɔlɔ nuu lɛ wɔ adesua pa na wɔ wɔ osuahu a ɛ bɛ boa a ayɔɔlɔ.",
    schedule: "Nhyehyɛeɛ:",
    status: "Tebea:",
    available: "Ɔ wɔ Hɔ",
    busy: "Ɔ re yɛ Ŋmaa",
    onCall: "Wɔ bɛ tumi afrɛ no",

    // Booking Page
    websiteUrl: "www.telekiosk.com",
    developBy: "Technofy™ na ɛ yɛ eɛ",
    browserNoSupport:
      "A browser nnyae iframe. Yɛ srɛ a kɔ Google Maps ncua so.",

    // Map Modal
    hospitalLocation: "Ayɔɔlɔ Jɛɛ Bɛɛ",
    addressLabel: "Bɛɛ:",
    hospitalAddress: "Ghana Mframa Ho Mantsɛmi Bɛɛ, Nkran",
    openInGoogleMaps: "Bue wɔ Google Maps mu",

    // Header Menu Items
    corporateInfoMenu: "Kpakpami Lɛ Wiemɔ",
    aboutUsMenu: "Ni Ŋɔ",
    missionVisionMenu: "Botaeɛ Ni Anidaso",
    teamMenu: "Ekuo",
    ourServicesMenu: "Ni Ŋmami Lɛ",
    ourDoctorsMenu: "Ni Ayɔɔlɔ Nuu Lɛ",
    healthWellnessTipsMenu: "Ayɔɔlɔ Ni Ayɔɔlɔ mami Akwɛɛ",
    visitingTimesMenu: "Nlɛɛ Mli",
    contactUsMenu: "Frɛ Ni",

    // Time ranges for visiting times
    vvipMorning: "6:30 AM – 7:30 AM",
    vvipAfternoon: "12:00 PM – 1:00 PM",
    vvipEvening: "6:30 PM – 7:30 PM",
    paediatricMorning: "10:30 AM – 12:30 PM",
    paediatricEvening: "4:30 PM – 6:30 PM",
    icuMorning: "10:30 AM – 11:30 AM",
    icuEvening: "4:30 PM – 5:30 PM",
    maternityMorning: "6:00 AM – 7:00 AM",
    maternityAfternoon: "12:00 PM – 1:00 PM",
    maternityEvening: "5:00 PM – 6:00 PM",
    nicuFathersMorning: "7:00 AM – 7:30 AM",
    nicuFathersEvening: "4:30 PM – 5:30 PM",
    nicuMothersMorning: "09:00 AM – 10:00 AM",
    nicuMothersAfternoon: "12:00 PM – 1:00 PM",
    nicuMothersAfternoon2: "3:00 PM – 4:00 PM",
    nicuMothersEvening: "6:00 PM – 7:00 PM",
    medicalMorning: "6:30 AM – 7:30 PM",
    medicalAfternoon: "12:00 PM – 1:00 PM",
    medicalEvening: "6:30 PM – 7:30 PM",
    breakfastTime: "6:30 AM – 8:00 AM",
    lunchTime: "12:00 PM – 1:00 PM",
    dinnerTime: "5:30 PM – 7:00 PM",
    bedtimeSnacksTime: "8:00 PM – 9:00 PM",

    // About Section specific
    openingHoursTime: "7 AM – 7 PM",
    videoTimestamp: "0:02 / 5:15",

    // Health & Wellness Page (Ga)
    healthWellnessSubtitle: "Shisemi foforɔ lɛ ɛ fa ni ŋmami lɛ kɛ a ayɔɔlɔ ho",
    articleNotFound: "Wo nhu uu Krataa no",
    backToHealthWellness: "San Kɔ Ayɔɔlɔ Kɛ Asomdwoeɛ",
    backToHealthWellnessTips: "San Kɔ Ayɔɔlɔ Kɛ Asomdwoeɛ Akwɛɛ",
    categories: "Akwɛɛ Ahodoɔ",
    recentPosts: "Krataa Foforɔ Lɛ",

    // Map Modal (Ga)
    hospitalLocationMap: "Ayɔɔlɔ Jɛɛ Bɛɛ Map",
    browserNotSupport:
      "A browser nnyae iframe. Yɛ srɛ a kɔ Google Maps ncua so.",
    address: "Bɛɛ",

    // Scroll to Top (Ga)
    scrollToTop: "Kɔ gbɔŋ",

    // Medical Services (Ga)
    emergencyMedicine: "Gbejɛ Kɛɛ Ayɔɔlɔ",
    generalMedicine: "Ayɔɔlɔ Sɔrɔɔŋkɔ",
    surgery: "Oprehyɛn",

    // All Pages (Ga)
    facilitiesHeroText:
      "Mɛɛni foforɔ lɛ kɛ bɛɛ a ɛ yɛ fɛ a wɔ siesie ama ni mi lɛ anya ayɔɔlɔ pa",
    healthServices: "Ayɔɔlɔ Ŋmami",

    // News Categories (Ga)
    technology: "Mɛɛni Foforɔ",
    events: "Amami",
    wellness: "Asomdwoeɛ",
    community: "Mantsɛmi",
    accreditation: "Akɔɔnɔ",

    // News Titles (Ga)
    news1Title:
      "The Bank Ayɔɔlɔ Jɛɛ Nhwehwɛmu Bɛɛ ayɛ Ghana Sɔrɔɔŋkɔ Nhwehwɛmu a Ɛdi Kan a Ɔnyaa ISO Akɔɔnɔ",
    news2Title: "The Bank Ayɔɔlɔ Jɛɛ de Frɛfrɛ Bɛɛ Foforɔ Reba: Ɔsom Pa Foforɔ",
    news3Title: "The Bank Ayɔɔlɔ Jɛɛ Di Mi lɛ Som Tsɛɛ 2024 Afahyɛ",
    news4Title: "The Bank Ayɔɔlɔ Jɛɛ Asomdwoeɛ Bɛɛ a Wɔde Baeɛ no Afahyɛ",
    news5Title: "Makola Nlɛɛ Amanebɔ",
    news6Title: "ISO AKƆƆNƆ – Nhwehwɛmu Som a Ɛyɛ Pa ho Bɔhyɛ",

    // Health & Wellness Categories (Ga)
    allTopics: "Shisemi Kɛɛ Lɛ",
    nutrition: "Amami",
    mentalHealth: "Ni Ayɔɔlɔ",
    fitness: "Apɔmuden",
    emergencyCare: "Gbejɛ Kɛɛ Ayɔɔlɔ",
    womensHealth: "Nyɔnmɔ lɛ Ayɔɔlɔ",
    naturalRemedies: "Abɔdeɛ Nnua",
    publicHealth: "Mantsɛmi Ayɔɔlɔ",
    preventiveCare: "Yare Anodwɔ",
    chronicDisease: "Yare a Ɛkyɛre",
    childHealth: "Vi lɛ Ayɔɔlɔ",
    seniorHealth: "Panin lɛ Ayɔɔlɔ",

    // Error Messages (Ga)
    errorOccurred: "Mfomsoɔ aba",
    pageNotFound: "Wo nhu uu kratafa no",
    tryAgainLater: "Yɛ srɛ a san sɔ kpɛ akyire yi",
    connectionError: "Nkitaho mfomsoɔ",

    // Form Labels (Ga)
    required: "Ɛ ho Hia",
    optional: "Ɛ ho Nhia",
    pleaseSelect: "Yɛ srɛ a paw",
    chooseOption: "Paw kwan bi",

    // Time Related (Ga)
    today: "Lɛɛ",
    yesterday: "Lɛba",
    tomorrow: "Ɔkyena",
    thisWeek: "Saa tsɛɛ yi",
    thisMonth: "Saa ɔfaŋ yi",
    thisYear: "Saa afe yi",

    // Sidebar Categories (Ga)
    covid19: "COVID-19",
    doctorsSpotlight: "Ayɔɔlɔ Nuu lɛ Kanea",
    healthArticles: "Ayɔɔlɔ Krataa",
    news: "Shisemi",
    pressReleases: "Shisemi Krataa",

    // Services Page - Ga translations
    medicalProfessional: "Ayɔɔlɔ Nuu",
    medicalResearchCare: "Ayɔɔlɔ nhwehwɛmu ne hwɛ",
    hospitalCorridor: "Ayɔɔlɔ Jɛɛ Kwan",
    cleanModernFacility: "Bɛɛ a ɛ yɛ fɛ na ɛ yɛ foforo",
    department: "DWUMADIBEA",
    aim: "BOTAEƐ",
    objectives: "NHYEHYƐEƐ",
    services: "ŊMAMI LƐ",
    support: "MMOA",
    expected: "ANIDASOƆ",
    outcome: "ABATOƆ",
    professionalStethoscope: "Ayɔɔlɔ Nuu Stethoscope",
    cardiacAssessmentTool: "Akoma nhwehwɛmu adwinnadeɛ",

    // Search placeholders (UI only)
    searchServices: "Kpɛɛ ŋmami lɛ...",
    searchArticles: "Kpɛɛ krataa...",
    searchNews: "Kpɛɛ shisemi ni amami...",

    // Cardiology Service Content - Ga
    cardiologyName: "AKOMA AYƆƆLƆ",
    cardiologyDescription:
      "Akoma yawo na ɛ kum nuu pii wɔ wiase nyinaa, na ɛ kum nuu bɛyɛ ɔpepem 17.9 afeɛ biara. Wiase amaneɛ 9 mu 9 firi akoma yawo ba aman a wɔ nyɛ adefoɔ mu te sɛ Ghana. Nuu a wɔ wɔ aman a wɔ nyɛ adefoɔ mu no ntaa nnya ayɔɔlɔ nhyehyɛeɛ pa a ɛ bɛ boa wɔn ahu akoma yawo ntɛm.",
    cardiologyExtendedDescription:
      "Eyi nti, nuu a wɔ wɔ aman yi mu no wu ntɛm firi akoma yawo mu wɔ wɔn mfeɛ a wɔ yɛ adwuma pa mu.",
    cardiologyAim:
      "Ni botaeɛ ne sɛ ni bɛ ma Ghanaman akoma ayɔɔlɔ atu mpɔn na ni agye wɔn a wɔ wɔ akoma yawo no nkwa.",
    cardiologyOutcome: "Gye akoma yawo foɔ nkwa na ma wɔn asetena nyɛ yie.",
    cardiologyImageDescription: "CT Scanner Dan - Akoma nhwehwɛmu mfiri foforo",
  },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "tw", name: "Twi", flag: "🇬🇭" },
    { code: "ga", name: "Ga", flag: "🇬🇭" },
  ];

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const t = (key) => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === currentLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        t,
        languages,
        getCurrentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

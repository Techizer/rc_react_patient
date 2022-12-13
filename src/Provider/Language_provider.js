import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from "./localStorageProvider";
import AsyncStorage from "@react-native-community/async-storage";
import { config } from "./configProvider";
import RNRestart from "react-native-restart";
global.language_key = 1;
class Language_provider {
  language_get = async () => {
    var item = await AsyncStorage.getItem("language");
    console.log("check launguage option", item);
    if (item != null) {
      console.log("kya bat h vikas bhai", config.language);
      config.language = item;
    }
    console.log("language_key123", config.language);
  };

  language_set = async (languagem) => {
    // var item = await AsyncStorage.getItem('language');
    //  localStorage.setItemObject('language', 1)
    console.log("I18nManager.isRTL muskan", I18nManager.isRTL);
    if (languagem == 0) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = "left";
      localStorage.setItemObject("language", 0);
      localStorage.setItemObject("languagecathc", 0);
      config.language = 0;
    } else {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      config.textalign = "right";
      localStorage.setItemObject("language", 1);
      localStorage.removeItem("languagecathc");
      localStorage.removeItem("languagesetenglish");
      config.language = 1;
    }
    // if(I18nManager.isRTL){
    //    console.log('HI Vikas')
    //    I18nManager.forceRTL(false);
    //      I18nManager.allowRTL(false);f
    //      config.textalign='left';
    //      localStorage.setItemObject('language',0)
    //      localStorage.setItemObject('languagecathc',0)
    //      config.language = 0
    //  }else if(!I18nManager.isRTL){
    //   console.log('HI Vaishali')

    //    I18nManager.forceRTL(true);
    //    I18nManager.allowRTL(true);
    //    config.textalign='right';
    //    localStorage.setItemObject('language',1)
    //    localStorage.removeItem('languagecathc')
    //    localStorage.removeItem('languagesetenglish');
    //    config.language = 1
    //  }
    setTimeout(() => {
      RNRestart.Restart();
    }, 500);

    //// I18nManager.forceRTL(false);
    // config.language = value;
  };
  //----------------------------------------------by gunjan
  //------------------login------------------
  Help = ["Help", "مساعدة"];
  Update = ["UPDATE", "تحديث"];
  OK = ["OK", "موافق  "];
  Login = ["Welcome Back!", " !أهلاً بعودتك    "];
  Logintext = ["Please sign in to continue ", "الرجاء تسجيل الدخول للاستمرار "];
  Mobileno = [
    "Email Id/Mobile Number",
    "البريد الالكتروني / رقم الهاتف المحمول",
  ];
  password = ["Password", "كلمة المرور  "];
  Remember = ["Remember Me", "تذكرني  "];
  Forgotpassword = ["Forgot Password ?", "نسيت كلمة المرور؟"];
  Contiunebtn = ["CONTINUE", " استمرار "];
  donot = ["Don't have an account, click below?", "ليس لديك حساب ، انقر أدناه؟"];
  createnewaccountbtn = ["Create a new account", "انشاء حساب جديد"];
  swipe_text = ["Swipe right to left", " اسحب من اليمين إلى اليسار  "];
  Trouble_SignIn = ["Trouble signing in? Get Help?", "هل تواجه مشكلة في تسجيل الدخول؟ احصل على مساعدة؟"];
  Skip = ["Skip login now & continuing exploring the app", "تخطي تسجيل الدخول الآن ومواصلة استكشاف التطبيق"]
  //---------------------splash------------------
  Splashtext1 = [
    "The Best Company for Medicial Services & Home Healthcare",
    " أفضل شركة للخدمات   \n الطبية  و الرعاية  الصحية   \n المنزلية  ",
  ];

  Splashtext2 = [
    "One of The Best Licensed Home Healthcare Company in  The Saudi Arabia",
    "واحدة من أفضل شركات الطب عن بعد والرعاية الصحية المنزلية المرخصة",
  ];
  // Splashtext3 = ['Healthcare Company in  The', 'شركة رعاية صحية في'];
  support_text = [
    "The Best Company for Medicial Services & Home Healthcare",
    "فضل شركةللخدمات الطبية  & الرعاية الصحية المنزلية  ",
  ];
  // Splashtext4 = ['Saudi Arabia', 'المملكة العربية السعودية'];
  //-------------------------------------------------------------------------signup------------------------------------------
  Signup = ["Sign up", " التسجيل  "];
  Signuptext1 = ["Register to open your Account", "قم بالتسجيل لفتح حسابك   "];
  textinputname = ["Full Name", " الاسم الكامل  "];
  textinputnumber = ["Mobile Number", "رقم الهاتف المحمول "];
  mobletexttitle = [
    "Please enter valid mobile number",
    "الرجاء إدخال رقم هاتف محمول صحيح",
  ];
  //--------------------------------------------change(2-3)

  textinputemails = ["Email Address", "البريد الالكتروني  "];

  Logintext3 = [
    "Your 12 digit mobile number should start with country code. Do not include any signs (- + or #)",
    "يجب أن يبدأ رقم الجوال المكون من 12 رقمًا برمز البلد. لا تقم بتضمين أي علامات (- + أو #)",
  ];
  textinputnationalid = ["ID number", "رقم الهوية"];
  Signuptext2 = [
    "Provide SA National ID number starting with number (1) or resident ID number starting with number (2) ",
    "ادخل رقم الهوية الوطنية تبدأ برقم (1) أو رقم هوية مقيم تبدأ برقم (2)",
  ];
  Signuptext3 = [
    "Must be at least 8 characters.",
    " .يجب أن لا تقل عن 8 أحرف أو أرقام ",
  ];
  Signuptext4 = [
    "Both passwords must match.",
    " .يجب أن تتطابق كلمتا المرور  ",
  ];
  //--------------------------------------------change(2-3)
  confirmpassword1 = ["Confirm Password", "تأكيد كلمة المرور "];

  btntext = ["CREATE ACCOUNT", " إنشاء حساب  "];
  termsandconditiontext1 = [
    "By creating an account, You agree to our  ",
    "من خلال إنشاء حساب ، فإنك توافق على  ",
  ];
  termsandconditiontext2 = ["Terms of Service", "شروط الخدمة  "];
  termsandconditiontext3 = [" and ", "و"];
  termsandconditiontext4 = ["Privacy Policy", "سياسة الخصوصية "];
  allreadyhaveaccounttext = ["Already have an account?", "هل لديك حساب؟ "];
  loginheretext = ["Login Here", "تسجيل الدخول هنا "];
  CC_code = ["CC", "CC"];
  Country_code = ["Country Code", "الرقم الدولي"];

  //--------------------------------------------------------------otppage-----------------------------------------
  otp = ["OTP Verification Code", "رمز التحقق لمرة واحدة  "];
  otptext = [
    "We have sent the code verification to your email",
    "لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني  ",
  ];
  submitbtntext = ["SUBMIT", "تأكيد "];
  signupbtntext = ["SIGN UP", " التسجيل  "];
  notrectext = ["Not received code?", "لم يتم استلام الرمز؟  "];
  sendagaintext = ["Send Again", "أعد الإرسال  "];
  notlogin = [
    "Can't Login,Need help?",
    "لا يمكنك تسجيل الدخول ، تحتاج إلى مساعدة؟",
  ];
  postissuetext = ["Post Issue", "إصدار آخر"];
  create_new_pass = ["Create New Password", "إنشاء كلمة مرور جديدة  "];
  SearchLocation = [
    "Search for area, street name..",
    "ابحث عن المنطقة واسم الشارع",
  ];
  Currentlocation = ["Current Location", "الموقع الحالي"];
  Using_gpsofyoudevice = [
    "Using GPS of your device",
    "استخدام  نظام تحديد المواقع  بجهازك",
  ];
  //---------------home screen----------------
  MyDashboard = ["Home", " الرئيسية  "];
  SearchDoctorHospitalsorLabetc = ["Search Doctor", "ابحث عن دكتور"];
  HomeHealthcareServiceAppointments = [
    "Home Healthcare Service Appointments ",
    " مواعيد خدمة الرعاية الصحية المنزلية  ",
  ];
  BookaNurse = ["Book a Nurse", "احجز ممرضة"];
  OpenforHourlyorTaskBasedBooking = [
    "Open for Hourly or Task Based Booking",
    "مفتوح للحجز كل ساعة أو الحجز على أساس المهمة",
  ];
  BookaPhysiotherapist = ["Book a Physiotherapist", "احجز معالجًا طبيعيًا"];
  for30mins = ["Book a Nurse Assistant", "حجز مساعد ممرض"];
  BookaNurseAssistant = ["Book a Nurse Assistant", "حجز مساعد ممرض"];
  BookaNurseAssistant = ["Book a Nurse Assistant", "حجز مساعد ممرض"];

  DoctorConsultation = ["Doctor Consultation", "استشارة الطبيب"];
  Lab_Test_Booking = ["Lab Test Booking", "حجز الاختبارات المعملية"];
  Find_Labs = ["Find Labs", "البحث عن المعامل"]
  MyAppointments = ["My Appointments", "واعيدي  "];
  CartItem = ["Cart Item", "عربة التسوق  "];
  BOOKNOW = ["BOOK NOW", "احجز الآن"];
  Nurse = ["Nurse", "ممرضة    "];
  SearchNurse = [
    "Search Nurse near your address",
    "ابحث عن ممرضة بالقرب من عنوانك",
  ];
  // BOOKNOW = ["BOOK NOW", "احجز الآن"];

  // ------------------------------------------------------------editprofile-----------------------------------------------

  //profile tab
  Editprofile = ["Edit Account", "تعديل الحساب  "];
  tabnameprofile = ["Personal", " شخصي     "];
  tabnamemedical = ["Medical", " طبي    "];
  tabnamelifestyle = ["Life Style", " أسلوب الحياة  "];
  dob = ["Date of Birth", "تاريخ الميلاد "];
  Gender = ["Gender", "الجنس  "];
  textinputidentity = ["Identity Number", "رقم الهوية "];
  male = ["Male", "ذكر "];
  female = ["Female", "أنثى  "];
  select = ["Select", "حدد"];
  selectSpecialty = ["Select Specialty", "حدد التخصص"];

  //medical tab
  allergies = ["Allergies", "الحساسية"];
  q1 = ["Are you allergic to anything?", "هل لديك حساسية من أي شيء؟ "];
  textinputallergies = ["Enter Allergies", "أدخل الحساسية "];

  current = ["Current Medication", "الأدوية الحالية "];
  q2 = [
    "Are you taking any medicines at the moment? ",
    "هل تتناول أي أدوية في الوقت الحالي؟  ",
  ];
  textinputcurrent = ["Enter Current Medication", "أدخل الأدوية الحالية "];

  pastmedication = ["Past Medication", "الأدوية السابقة  "];
  q3 = [
    "Have you been on medications in the past?",
    "هل كنت تتناول أدوية في الماضي؟  ",
  ];
  textinputpastmedication = [
    "Enter Past Medication",
    " أدخل الأدوية السابقة  ",
  ];

  injuries = ["Injuries", " الاصابات  "];
  q4 = [
    "Have you hade any injuires in the past?",
    " هل تعرضت لأي إصابات في الماضي؟  ",
  ];
  textinputinjuries = ["Enter Injuries", "أدخل الاصابات  "];

  surgeries = ["Surgeries", " العمليات الجراحية "];
  q5 = [
    "Have you had any surgeries in the past?",
    "هل أجريت أي عمليات جراحية في الماضي؟  ",
  ];
  textinputsurgeries = ["Enter surgeries", " أدخل العمليات الجراحية  "];

  chronic = ["Chronic Diseases", "الأمراض المزمنة "];
  q6 = [
    "Have you had chronic diseases in the past?",
    " هل عانيت من أي أمراض مزمنة في الماضي؟  ",
  ];
  textinputchronic = ["Enter chronic diseases", " أدخل الأمراض المزمنة  "];

  savebtntext = ["SAVE", "حفظ  "];
  yes_txt = ["Yes", "نعم "];
  no_txt = ["NO", "لا "];
  yes_txt_new = ["Yes", "Yes"];
  no_txt_new = ["No", "No"];
  //lifestyle
  smoking = ["Smoking Habits", "عادات التدخين  "];
  Alcohol = ["Alcohol Habits", "عادات تناول الكحول  "];
  blood = ["Blood Group", "فصيلة الدم  "];
  activity = ["Activity Level", "مستوى النشاط  "];
  food = ["Food Preference", " الغذاء المفضل  "];
  occupation = ["Occupation", "المهنة "];

  //------------------booking

  //28-02 gunjan
  //----------------------------------------------------------------------------------------forgot

  Forgot = ["Forgot Password ?", "نسيت كلمة المرور؟ "];
  Forgottext = [
    "Enter the email association with your account and we'll send an email with instruction to reset your password.",
    ".أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل بريدًا إلكترونيًا يحتوي على تعليمات لإعادة تعيين كلمة المرور الخاصة بك ",
  ];
  textinputregistered = ["Registered Email", " بريد الكتروني مسجل "];
  forgotbtn = ["SEND MAIL", "أرسل رسالة "];

  //-------------------------------------------------------------------------------supportandmore
  supporttext = ["Support & More", " الدعم & المزيد "];
  version = ["Version 1.0.0", "الإصدار 1.0.0"];
  languagetxt = ["Language Preference", " اللغة المفضلة  "];
  termtxt = ["Terms and Conditions", "الشروط والأحكام  "];
  aboutrootcare = ["About Rootscare", "حول روتس كير "];
  privacy = ["Privacy Policy", "سياسة الخصوصية  "];
  needsupport = ["Need Support ?", "تحتاج مساعدة؟  "];
  nationality = ["Nationality", "  الجنسية  "];
  textinputaddress = ["Address", "العنوان  "];

  need_text = [
    "Post your issue here,we will call you in 24-48 business hours. or you if you ave anything urgent call at +44 24776 9200 number",
    " اكتب مشكلتك هنا، وسوف نتواصل معك في غضون 24–48 ساعة عمل،أو إذا كان لديك أي شيء عاجل اتصل بنا على الرقم  24776 9200",
  ];
  text_input_topic = [
    "Write your issue in details here.",
    " اكتب مشكلتك بالتفصيل هنا  ",
  ];
  select_topic_text = ["Select a Topic", "اختر عنوانا "];
  select_issues_text = ["Select issue", "حدد المشكلة  "];
  //modal
  thank = ["Thank You", "شكرا لك  "];
  success = ["Successful", "ناجح  "];
  text_of_modal = [
    "Congratulation, Roots Care Submission is Successfully done",
    "شكرا لك، تم فتح التذكرة بنجاح",
  ];
  close_txt = ["Close", "إغلاق  "];

  drawername = ["Sanjay Singh", "سانجاي سينغ"];
  drawerid = ["anant@outlook.com", "anant@outlook.com"];
  draweraddress = ["Riyadh,saudi Arabia", "رياض,سعودي عربية"];

  upcoming_heading = ["Upcoming Appointment", " الموعد القادم  "];
  upcoming_text = [
    "Booked, Pending Or Accepted.",
    " .محجوزة أو معلقة أو مقبولة ",
  ];
  ongoing_heading = ["Ongoing Appointment", "موعد جاري تنفيذه "];
  ongoing_text = ["Today's, Now Ongoing", " اليوم، جاري الآن   "];

  past_heading = ["Past Appointment", "الموعد السابق  "];
  past_text = ["Completed, Closed Or Cancelled.", ".مكتمل أو مغلق أو ملغى "];


  drawerversion = ["RC Version 1.0(1)", "RC Version 1.0(1)"];
  titleexitapp = ["Exit app", "الخروج من التطبيق"];
  exitappmessage = ["Do you want to exit", "هل تريد الخروج"];
  registration = ["Registration", "التسجيل  "];
  cancelmedia = ["Cancel", "Cancel"];
  Mediagallery = ["Choose from Gallery", "Choose from Gallery"];
  MediaCamera = ["Take Photo", "Take Photo"];
  select_option = ["Add Photo!", "Add Photo!"];
  ENG = ["ENG", "ENG"];
  AR = ["AR", "AR"];
  PrivacyPolicy = ["Privacy Policy", "سياسة الخصوصية  "];
  TermsandConditions = ["Terms and Conditions", "الشروط والأحكام  "];
  AboutRootscare = ["About Rootscare", "حول روتس كير   "];
  logut_msg = [
    "Are you sure you want to logout?",
    "هل أنت متأكد أنك تريد تسجيل الخروج؟  ",
  ];
  Logout = ["LOGOUT", "تسجيل الخروج  "];
  Lang_change = ["Language Change", "تغير اللغة"];
  Lang_change_msg = [
    "To change language you need to restart the app?",
    "لتغيير اللغة تحتاج إلى إعادة تشغيل التطبيق؟  ",
  ];
  Restart = ["RESTART", " اعادة تشغيل  "];
  home_footer = ["Home", " الرئيسية  "];
  Appointment_footer = ["Appointment", "المواعيد"];
  Cart_footer = ["Cart", "السلة "];
  More_footer = ["More", "المزيد "];
  // Hospital = ["Hospital", " مستشفى   "];
  HospitalAppointment = ["Hospital Appointment", "موعد مستشفى  "];
  ActivityLevel = ["Activity Level", "مستوى النشاط   "];
  FoodPreference = ["Food Preference", "  الغذاء المفضل   "];
  Occupation = ["Occupation", "المهنة  "];
  AvailableforBooking = ["Available for Booking", "تاح للحجز "];
  BOOKAPPOINTMENT = ["BOOK APPOINTMENT", "حجز موعد "];
  BOOKTEST = ["BOOK TESTS", "احجز الاختبارات"];
  FindSpecialtyDoctor = [
    "FIND SPECIALTY & DOCTORS",
    "ابحث عن التخصصات والأطباء",
  ];
  SAFE = ["Safe", "آمن"];
  Availability = ["Availability", "التوفر  "];
  Location = ["Location", "موقع"];
  Physiotherapist = ["Physiotherapist", "اخصائي العلاج الطبيعي  "];
  Nurse_assistant = ["Nurse Assistant", "مساعد ممرض    "];
  Babysitter = ["Babysitter", "جليسه اطفال    "];
  Rating = ["Rating", "التقييم "];
  Booking = ["Booking", "حجز "];
  Experience = ["Experience", "الخبرة  "];
  ESTABLISHED = ["Established", "أنشئت"];
  AVAILABLE_TESTS = ["Available Tests", "الفحوصات المتاحة"];

  OnlineConsultation = ["Online Consultation", "الاستشارة عبر الإنترنت"];
  OnlineCons = ["Online Cons", "سلبيات عبر الإنترنت"];
  HomeVisit = ["Home Visit", "زيارة منزلية"];

  Tests = ["Tests", "الاختبارات"];
  Not_available_for_booking = ["Not Available for Booking", "غير متاح للحجز "];
  the_best_company = ["The Best Company", " أفضل شركة"];
  for_mediical = ["for Medical Services", "للخدمات الطبية"];
  home_helth = ["& Home Healthcare", "& الرعاية الصحية المنزلية"];
  Splashtext_one = ["The Best Company for", "أفضل شركة لـ"];
  Splashtext_two = ["Medical Services & Home", "الخدمات الطبية والمنزل"];
  Splashtext_three = ["Healthcare", "الرعاىة الصحية"];
  Splashtext_four = [
    "One Of The Best Licensed Home",
    "أحد أفضل المنازل المرخصة",
  ];
  Splashtext_five = ["Healthcare Company in The", "شركة رعاية صحية في"];
  Splashtext_six = ["Saudi Arabia", "المملكة العربية السعودية"];
  BookOnlineAppointment = ["BOOK ONLINE APPOINTMENT",
    "حجز موعداستشارة عن بعد"];
  BookHomeVisitAppointment = [
    "BOOK HOME VISIT APPOINTMENT",
    "حجز موعد زيارة منزلية",
  ];
  BOOKTASKBASEDAPPOINTMENT = [
    "BOOK TASK BASED APPOINTMENT",
    "حجز موعد بنظام المهمة  ",
  ];
  BOOKHOURLYAPPOINTMENT = [
    "BOOK HOURLY APPOINTMENT",
    "حجز موعد بنظام الساعة  ",
  ];
  BOOKLABTESTAPPOINTMENT = ["BOOK LAB TESTS", "احجز الاختبارات المعملية"];
  HealthPackages = ["Health Packages", "الحزم الصحية"];
  PackageDetails = ["Package Details", "تفاصيل الحزمة"];
  TestsIncluded = ["Tests Included", "وشملت الاختبارات"];
  AvailableNurse = ["Available Nurse's", " ممرضة متاح "];
  See_all = ["See All", "عرض الكل  "];
  Book = ["Book", "الكتاب"];
  TaskBooking = [" Task Booking", " حجز  مُهمة "];
  HourlyBooking = ["Hourly Booking", "حجز بنظام الساعة "];
  SAR = ["SAR", "SAR"];
  Searchtask = ["Search task", "بحث عن مهمة  "];
  SearchTests = ["Search tests", "اختبارات البحث"];
  SearchPackages = ["Search packages", "حزم البحث"];
  TalkToDoctor = [
    "Tell to doctor regarding your symptom?",
    "أخبر طبيبك بخصوص الأعراض الخاصة بك؟",
  ];
  TalkToUs = [
    "Tell us more about your symptom?",
    "أخبرنا المزيد عن الأعراض الخاصة بك؟",
  ];
  Optional = ["(Optional)", "(اختياري)"];
  Appointmentschedule = ["Appointment Schedule", "جدول الموعد "];
  SAVEPATIENT = ["SAVE PATIENT", "حفظ المريض   "];
  PatientFirstName = ["Patient First Name", "الاسم الأول للمريض   "];
  PatientLastName = ["Patient Last Name", " اسم الأخير للمريض   "];
  PatientEmail = ["Patient Email", " البريد الإلكتروني للمريض   "];
  PatientAge = ["Patient Age", "عمر المريض   "];
  Total = ["Total", "المجموع "];
  distanceFare = ["Distance Fare", " أجور المسافة  "];
  subTotal = ["Sub Total", "المجموع الفرعي"];
  Payment = ["Payment", " الدفع  "];
  Select_start_time = ["Select start time", "حدد وقت البدء "];
  no_data_Found = ["No data found", "لاتوجد بيانات   "];
  Packages_Unavailable = ["Packages not available", "الباقة غير مُتاحة"];
  SelectDate = [" Select Date:", "حدد التاريخ  "];
  delete_msg = [
    "Are you sure to delete this family member?",
    "هل أنت متأكد من حذف فرد العائلة هذا؟  ",
  ];
  DeleteMember = ["Delete ", "حذف  "];
  Date = ["Date", "التاريخ "];
  PROCEEDTOPAYMENT = [" PROCEED TO PAYMENT", " الانتقال إلى الدفع  "];
  confimation = ["Confirmation", "تأكيد  "];
  remove_msg = [
    "Are you sure to delete this item ?",
    "هل أنت متأكد من حذف هذا العنصر؟ ",
  ];
  PROCEEDTOcheckout = ["PROCEED TO CHECKOUT", " انتقل إلى الدفع  "];
  Time = ["Time", "الوقت  "];
  we_wii_back = ["We'll be right back.", "سوف نعود حالاً. وعد   "];
  promise = ["Promise"];
  our_sincere = [
    "Our sincere apologies but this page is temporarily unavailable. Check back soon.",
    "  .خالص اعتذارنا ولكن هذه الصفحة غير متاحة مؤقتا. حاول مرة أخرى قريبًا  ",
  ];
  Bad_gateway = ["Bad gateway", "بوابة غير صالحة  "];
  Go_back = ["GO BACK", "الرجوع للخلف  "];
  Bookings = ["Bookings", "الحجوزات  "];
  AddPatient = ["Add Patient", " أضف المريض    "];
  Booking_detail = ["Booking", "حجز "];
  Searchphysi = [
    "Search Physiotherapist near your address",
    "ابحث عن أخصائي العلاج الطبيعي بالقرب من عنوانك",
  ];
  Searchseassistent = [
    "Search Nurse Assistant near your address",
    "ابحث عن مساعد ممرضة بالقرب من عنوانك",
  ];
  SearchBabysitter = [
    "Search Babysitter near your address",
    "ابحث عن جليسة الأطفال بالقرب من عنوانك",
  ];
  SearchDoctor = [
    "Search Doctor near your address",
    "ابحث عن طبيب بالقرب من عنوانك",
  ];
  SearchHospital = [
    "Search Hospital near your address",
    "ابحث عن مستشفى بالقرب من عنوانك",
  ];
  SearchLab = ["Search Lab near your address", "معمل البحث بالقرب من عنوانك"];
  DoctorsUnderHospital = ["DOCTORS UNDER HOSPITAL", "أطباء تحت المستشفى"];
  Availablephysotharpst = [
    "Available Physiotherapist's",
    " أخصائي علاج طبيعي متاح ",
  ];
  Availablebabysitter = ["Available Babysitter's", " جليسة أطفال متاح "];
  Availableassistent = ["Available Nurse Assistant's", "مساعدة ممرضة متاح"];
  AvailableDoctor = ["Available Doctor's", "طبيب متاح"];
  AvailableLab = ["Available Lab's", "المختبرات المتاحة"];
  Add = ["Add", " إضافة  "];
  Upload = [
    "Upload photo or previous prescription",
    "قم بتحميل الصورة أو الوصفة الطبية السابقة",
  ];
  appoinment_aucess = [
    "Your appointment has been booked Successfully.",
    "تم حجز موعدك بنجاح.",
  ];
  Gotoappointment = ["Go to appointment", " الذهاب إلى الموعد  "];
  Reschedule = ["Reschedule", "إعادة جدولة "];
  Booked = ["Booked", "تم الحجز "];
  Patient = ["Patient", "المريض   "];
  Doctor = ["Doctor", "طبيب"];
  Hospital = ["Hospital", "مستشفى"];
  ChangeLab = ["Change Lab", "تغيير المعمل"];
  Lab = ["Lab", "مختبر"];
  AppointmentDetails = ["Appointment Details", "تفاصيل الموعد   "];
  BookingID = ["Booking ID", "رقم الحجز "];
  AppointmentDate = ["Appointment Date", " تاريخ الموعد   "];
  appointment_schedule = ["Appointment Schedule ", "جدول الموعد "];
  AppointmentTime = ["Appointment Time", "وقت الموعد "];
  BookingOn = ["Booked On ", "تم الحجز في  "];
  SAVECHANGERESCHEDULE = [
    "SAVE CHANGE & RESCHEDULE",
    " حفظ التغيير  & إعادة جدولة  ",
  ];
  PATIENT_SYMPTOM = ["Patient Symptom", "أعراض المريض"];
  SYMPTOM_DESCRIPTION = ["Symptom description", "وصف الأعراض"];
  VIEW = ["View", "رأي"];
  PRESCRIPTION = ["Prescription", "روشتة"];
  ReportAttachment = ["REPORT ATTACHMENT", "تقرير مرفق"];
  DOWNLOAD = ["Download", "تحميل"];
  VIDEO_CALL = ["VIDEO CALL", "مكالمة فيديو"];
  VIEWDETAILS = ["VIEW DETAILS", " عرض التفاصيل  "];
  Refunde = ["REFUNDED", "REFUNDED"];
  patient_details = ["Patient Details", "تفاصيل المريض   "];
  appointment_accepted_otp_text = [
    "Provide OTP at the End of Service",
    "نرجو تزويدنا برمز التحقق عند نهاية الخدمة",
  ];
  appointment_closed_otp_text = [
    "OTP entered, Appointment Closed",
    "تم ادخال رمز التحقق، تم إغلاق الموعد",
  ];
  All = ["All", "  الجميع   "];
  NotificationsList = ["Notification", "الاشعارات  "];
  Notification = ["Notification", " الاشعارات   "];
  MyAppointments = ["My Appointments", "مواعيدي  "];
  rated = ["Rated", "تم التقييم  "];
  rate_appointment = ["Rate Appointment", "تقييم الموعد "];
  Write_review = ["Write a Review", "أكتب مراجعة "];
  ProvideUAE = [
    "Provide UAE Id number starting with number (7)",
    "أدخل رقم الهوية الاماراتية يبدأ برقم (7)",
  ];
  Delete_account = ["Delete Account", "حذف الحساب"];
  Are_you_sure = ["Are you sure ?", "هل أنت واثق ؟"];

  // ---------------------Ahsan---------------------
  Home = ["Home", "مسكن"];
  Appointment = ["Appointment", "ميعاد"];
  Consultation = ["Consultation", "التشاور"];
  Lab_Test = ["Lab Test", "اختبار معمل"];
  Profile = ["Profile", "الملف الشخصي"];
  All_Consultations = ["All Consultations, Orders, & Bookings", "جميع الاستشارات والطلبات والحجوزات"];
  Appointment_Bookings = ['Appointment Bookings', 'حجوزات المواعيد'];
  Appointment_Booking_Details = ['Nurse, Nurse Ass, Babysitter, Physiotherapy, Appointments', 'ممرضة ، ممرضة مؤخرة ، جليسة أطفال ، علاج طبيعي ، مواعيد'];
  Doctor_Consultations = ['Doctor Consultations', 'استشارات الطبيب'];
  Doctor_Consultation_Details = ['Doctor Consul, Ongoing, Past, etc.', 'طبيب قنصل ، مستمر ، سابق ، إلخ.'];
  Lab_Test_Bookings = ['Lab Test Bookings', 'حجوزات الاختبارات المعملية'];
  Lab_Test_Booking_Details = ['Completed, Closed, Or Cancelled.', 'مكتمل أو مغلق أو ملغى.'];
  Orders = ['Orders', 'ترتيب'];
  Order_Details = ['Medicines & Other Equipments', 'الأدوية والمعدات الأخرى'];
  Acccount_and_More = ["Account & More", "الحساب  & المزيد  "];
  Acccount_Setting = ['Account Settings', 'إعدادت الحساب'];
  Manage_Address = ["Manage Address", "إدارة العنوان"];
  Manage_Members = ["Manage Members | Health Record", "إدارة الأعضاء | السجل الصحي"];
  Find_Location = ["Find Location", "البحث عن الموقع"];
  Health_Record = ['My Health Record', 'سجلي الصحي']
  Support_and_More = ["Support & More", " الدعم & المزيد "];
  Like_Us = ["Like Us? Give 5 Star Review", "مثلنا؟ أعط مراجعة 5 نجوم"];
  SignOut = ["Sign Out", "خروج"];
  About_App = ['Making healthcare digital & easy', 'جعل الرعاية الصحية رقمية وسهلة'];
  About_App_Details = ['The best licensed home healthcare company in the kingdom', 'أفضل شركة رعاية صحية منزلية مرخصة في المملكة'];
  Nurse_Booking = ['Nurse Booking', 'ممرضة الحجز'];
  RootsCare = ["Roots Care", "روتس كير "];
  Howitworks = ["How it works", "How it works"];
  BookConsultation = ["BOOK CONSULTATION", "استشارة كتاب"];
  NearBy = ["Near by", "مجاور"];
  OtpTime = ['You have 60 seconds to enter the OTP, if you do not receive the OTP, request again.', 'لديك 60 ثانية لإدخال كلمة المرور لمرة واحدة ، إذا لم تستلم كلمة المرور لمرة واحدة ، اطلب مرة أخرى.'];
  NeedSupport = ["Need Support", "تحتاج مساعدة"];
  Add_Address = ["Add This Address", "أضف هذا العنوان"];
  Saved_Address = ["Saved Addresses", "العناوين المحفوظة"];
  Edit_Address = ["Edit Address", "تعديل العنوان"];
  Address_Title = ["Address Title", "عنوان عنوان"];
  Google_Address = ["Google Map Address", "عنوان خريطة جوجل"];
  Nearest_Address = ["Nearest Landmark", "أقرب معلم"];
  Building_Name = ["Building Name", "اسم المبنى"];
  Save_Address = ["SAVE ADDRESS", "حفظ العنوان"];
  Delete = ["DELETE", "حذف   "];
  Add_Member = ["ADD MEMBER", "إضافة جديد"];
  Add_New_Member = ["ADD NEW MEMBER", "إضافة عضو جديد"];
  Upload_Photo = ["Upload a photo of the member", "قم بتحميل صورة العضو"];
  Photo_Size = ["Max. Upload Size 10 MB", "الأعلى. حجم الرفع 10 ميجا بايت"];
  Archive = ["ARCHIVE", "أرشيف"];
  Merge = ["MERGE", "دمج"];
  Default_Address = ["Default Address", "العنوان الافتراضي"];
  Advance_Filter = ["Advance Filter", "مرشح متقدم"];
  Consult_Type = ["Consultation Type", "نوع الاستشارة"];
  Doc_Exp = ["Doctor Experience", "خبرة الطبيب"];
  Select_Nationality = ["Select Nationality", "اختر الجنسية"];


}
export const Lang_chg = new Language_provider();

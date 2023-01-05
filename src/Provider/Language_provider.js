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
    
    setTimeout(() => {
      RNRestart.Restart();
    }, 500);

  };
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
    "The best care, in the best place. We Take Pride In Being The Best.",
    "أفضل رعاية في أفضل مكان. نحن نفتخر بكوننا الأفضل.",
  ];

  Splashtext2 = [
    "It’s our duty to care for your health. We Treat our Clients like Family.",
    "من واجبنا الاهتمام بصحتك. نتعامل مع عملائنا كعائلة.",
  ];
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
  Country_code = ["Country Code", "مفتاح الدولة"];

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
  postissuetext = ["Post Issue", "إبلاغ عن مشكلة"];
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
    "Home Healthcare Service Appointment ",
    " مواعيد خدمة الرعاية الصحية المنزلية  ",
  ];
  BookaNurse = ["Book a Nurse", "احجز ممرضة"];
  OpenforHourlyorTaskBasedBooking = [
    "Open for Hourly or Task Based Booking",
    "مُتاح للحجز كل ساعة أو الحجز على أساس المهمة",
  ];
  BookaPhysiotherapist = ["Book a Physiotherapist", "احجز علاج طبيعي"];
  for30mins = ["Book a Nurse Assistant", "حجز مساعد ممرض"];
  BookaNurseAssistant = ["Book a Nurse Assistant", "حجز مساعد ممرض"];
  BookaNurseAssistant = ["Book a Nurse Assistant", "حجز مساعد ممرض"];

  DoctorConsultation = ["Doctor Consultation", "استشارة طبيب"];
  Lab_Test_Booking = ["Lab Test Booking", "حجز فحص مختبر"];
  Find_Labs = ["Find Labs", "البحث عن مختبرات"]
  MyAppointments = ["My Appointments", "مواعيدي"];
  CartItem = ["Cart Item", "عربة التسوق"];
  BOOKNOW = ["BOOK NOW", "احجز الآن"];
  Nurse = ["Nurse", "ممرضة"];
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
  yes_txt_new = ["Yes", "نعم"];
  no_txt_new = ["No", "لا"];
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
  supporttext = ["Support & More", " الدعم و المزيد "];
  version = ["Version 3.6.1", "الإصدار 3.6.1"];
  languagetxt = ["Language Preference", " اللغة المفضلة  "];
  termtxt = ["Terms and Conditions", "الشروط والأحكام  "];
  aboutrootcare = ["About Rootscare", "حول روتس كير "];
  privacy = ["Privacy Policy", "سياسة الخصوصية  "];
  needsupport = ["Need Support ?", "تحتاج مساعدة؟  "];
  nationality = ["Nationality", "  الجنسية  "];
  textinputaddress = ["Address", "العنوان  "];

  need_text = [
    "Post your issue here,we will call you in 24-48 business hours. or you if you ave anything urgent call at +966 920024776 number",
    " اكتب مشكلتك هنا، وسوف نتواصل معك في غضون 24–48 ساعة عمل،أو إذا كان لديك أي شيء عاجل اتصل بنا على الرقم  920024776",
  ];
  text_input_topic = [
    "Write your issue in details here.",
    " اكتب مشكلتك بالتفصيل هنا  ",
  ];
  select_topic_text = ["Select a Topic", "اختر موضوع "];
  select_issues_text = ["Select issue", "حدد المشكلة  "];
  //modal
  thank = ["Payment Successful", "تم الدفع بنجاح"];
  success = ["Successful", "ناجح  "];
  text_of_modal = [
    "Congratulation, Roots Care Submission is Successfully done",
    "شكرا لك، تم فتح التذكرة بنجاح",
  ];
  close_txt = ["Close", "إغلاق  "];

  drawername = ["Sanjay Singh", "سانجاي سينغ"];
  drawerid = ["anant@outlook.com", "anant@outlook.com"];
  draweraddress = ["Riyadh,saudi Arabia", "رياض,السعودية"];

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
  cancelmedia = ["Cancel", "إلغاء"];
  Mediagallery = ["Choose from Gallery", "اختر من الاستوديو"];
  MediaCamera = ["Take Photo", "التقط صورة"];
  select_option = ["Add Photo!", "إضافة صورة"];
  ENG = ["English", "انجليزي"];
  AR = ["Arabic", "عربي"];
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
  AvailableforBooking = ["Available for Booking", "مُتاح للحجز "];
  BOOKAPPOINTMENT = ["BOOK APPOINTMENT", "حجز موعد "];
  BOOKTEST = ["BOOK TESTS", "احجز فحوصات"];
  FindSpecialtyDoctor = [
    "FIND SPECIALTY & DOCTORS",
    "ابحث عن التخصصات والأطباء",
  ];
  SAFE = ["Safe", "آمن"];
  Availability = ["Availability", "التوفر  "];
  Location = ["Location", "موقع"];
  Physiotherapist = ["Physiotherapist", "اخصائي العلاج الطبيعي  "];
  Nurse_assistant = ["Nurse Assistant", "مساعد ممرض    "];
  Babysitter = ["Babysitter", "جليسة أطفال    "];
  Rating = ["Rating", "التقييم "];
  Booking = ["Booking", "حجز "];
  Experience = ["Experience", "الخبرة  "];
  ESTABLISHED = ["Established", "أنشئت"];
  AVAILABLE_TESTS = ["Available Tests", "الفحوصات المتاحة"];

  OnlineConsultation = ["Online Consultation", "الاستشارة عبر الإنترنت"];
  OnlineCons = ["Online Cons", "استشارات عبر الإنترنت"];
  HomeVisit = ["Home Visit", "زيارة منزلية"];

  Tests = ["Tests", "الفحوصات"];
  Not_available_for_booking = ["Not Available for Booking", "غير متاح للحجز "];

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
  HealthPackages = ["Health Packages", "الباقات الصحية"];
  PackageDetails = ["Package Details", "تفاصيل الباقة"];
  TestsIncluded = ["Tests Included", "تشمل الفحوصات"];
  AvailableNurse = ["Available Nurse's", " ممرضة متاح "];
  See_all = ["See All", "عرض الكل  "];
  Book = ["Book", "حجز"];
  TaskBooking = [" Task Booking", " حجز  مُهمة "];
  HourlyBooking = ["Hourly Booking", "حجز بنظام الساعة "];
  SAR = ["SAR", "ر.س"];
  Searchtask = ["Search task", "بحث عن مهمة  "];
  SearchTests = ["Search tests", " بحث عن فحوصات"];
  SearchPackages = ["Search packages", "بحث عن باقات "];
  TalkToDoctor = [
    "Tell Doctor Symptom & Health Issue",
    "أخبر الطبيب بالأعراض والمشكلة الصحية",
  ];
  TalkToUs = [
    "Tell us more about your symptom?",
    "أخبرنا المزيد عن الأعراض الخاصة بك؟",
  ];
  Optional = ["(Optional: It can help doctor during consultation)", "(اختياري: يمكن أن يساعد الطبيب أثناء الاستشارة)"];
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
  noTime = ["No time slots available", "لا توجد فترة زمنية متاحة"];
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
    "Are you sure you want to delete this item from cart ?",
    "هل أنت متأكد من حذف هذا العنصر؟ ",
  ];
  PROCEEDTOcheckout = ["PROCEED TO CHECKOUT", " انتقل إلى الدفع  "];
  Time = ["Time", "الوقت  "];
  we_wii_back = ["We'll be right back.", "سوف نعود حالاً  "];
  promise = ["Promise", "وعد"];
  our_sincere = [
    "Our sincere apologies but this page is temporarily unavailable. Check back soon.",
    "  .خالص اعتذارنا ولكن هذه الصفحة غير متاحة مؤقتا. حاول مرة أخرى قريبًا  ",
  ];
  Bad_gateway = ["Bad gateway", "بوابة غير صالحة  "];
  Go_back = ["GO BACK", "الرجوع للخلف  "];
  Bookings = ["Bookings", "الحجوزات  "];
  AddPatient = ["Add Patient", " أضف مريض    "];
  Booking_detail = ["Booking", "حجز "];
  Searchphysi = [
    "Search Physiotherapist near your address",
    "ابحث عن أخصائي العلاج الطبيعي بالقرب من عنوانك",
  ];
  Searchseassistent = [
    "Search Nurse Assistant near your address",
    "ابحث عن مساعدة ممرضة بالقرب من عنوانك",
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
  SearchLab = ["Search Lab near your address", "ابحث عن مختبر بالقرب من عنوانك"];
  DoctorsUnderHospital = ["DOCTORS UNDER HOSPITAL", "طاقم أطباء المستشفى"];
  Availablephysotharpst = [
    "Available Physiotherapist's",
    " أخصائي علاج طبيعي متاح ",
  ];
  Availablebabysitter = ["Available Babysitter's", " جليسة أطفال متاح "];
  Availableassistent = ["Available Nurse Assistant's", "مساعدة ممرضة متاح"];
  AvailableDoctor = ["Available Doctor's", "طبيب متاح"];
  AvailableLab = ["Available Lab's", "الفحوصات المتاحة"];
  Add = ["Add", " إضافة  "];
  Upload = [
    "Upload photo or previous prescription",
    "قم بتحميل الصورة أو الوصفة الطبية السابقة",
  ];
  Appoinment_Success = [
    "Congratulations, the appointment has been booked successfully. Thank you for choosing Rootscare.",
    "مبروك ، لقد تم حجز الموعد بنجاح. شكرًا لاختيارك روتس كير.",
  ];
  GoToAppointment = ["Go to Appointment", " الذهاب إلى الموعد  "];
  GoToConslt = ["Go to Consultations", "اذهب  إلى الاستشارة"];
  GoToLabs = ["Go to Lab Tests", "اذهب إلى فحص المختبر"];
  Reschedule = ["RESCHEDULE", "إعادة جدولة "];
  Booked = ["Booked", "تم الحجز "];
  Patient = ["Patient", "المريض   "];
  Doctor = ["Doctor", "طبيب"];
  Hospital = ["Hospital", "مستشفى"];
  ChangeLab = ["Change Lab", "تغيير المختبر"];
  Lab = ["Lab", "مختبر"];
  AppointmentDetails = ["Appointment Details", "تفاصيل الموعد   "];
  BookingID = ["Booking ID", "رقم الحجز "];
  AppointmentDate = ["Date", "تاريخ"];
  appointment_schedule = ["Appointment Schedule ", "جدول الموعد "];
  AppointmentTime = ["Appointment Time", "وقت الموعد "];
  BookingOn = ["Booked On ", "تم الحجز في  "];
  SAVECHANGERESCHEDULE = [
    "SAVE CHANGE & RESCHEDULE",
    " حفظ التغيير  و إعادة جدولة  ",
  ];
  PATIENT_SYMPTOM = ["Patient Symptom", "أعراض المريض"];
  SYMPTOM_DESCRIPTION = ["Symptom description", "وصف الأعراض"];
  VIEW = ["View", "عرض"];
  PRESCRIPTION = ["Prescription", "وصفة طبية"];
  ReportAttachment = ["REPORT ATTACHMENT", "إرفاق تقرير"];
  DOWNLOAD = ["Download", "تحميل"];
  VIDEO_CALL = ["VIDEO CALL", "مكالمة فيديو"];
  VIEWDETAILS = ["VIEW DETAILS", " عرض التفاصيل  "];
  Refunded = ["Refunded", "المبلغ مسترد"];
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
  Write_review = ["Write a Review", "أكتب مراجعة "];
  ProvideUAE = [
    "Provide UAE Id number starting with number (7)",
    "أدخل رقم الهوية الاماراتية يبدأ برقم (7)",
  ];
  Delete_account = ["Delete Account", "حذف الحساب"];
  Are_you_sure = ["Are you sure ?", "هل أنت واثق ؟"];

  // ---------------------Ahsan---------------------
  Home = ["Home", "الرئيسية"];
  Appointment = ["Appointment", "المواعيد"];
  Consultation = ["Consultation", "الاستشارات"];
  Lab_Test = ["Lab Test", "فحص مختبر"];
  Profile = ["Profile", "الملف الشخصي"];
  All_Consultations = ["All Consultations, Orders, & Bookings", "جميع الاستشارات والطلبات والحجوزات"];
  Appointment_Bookings = ['Appointment Bookings', 'مواعيد الحجوزات'];
  Appointment_Booking_Details = ['Nurse, Nurse Ass, Babysitter, Physiotherapy, Appointments', 'ممرضة ، مساعدة ممرضة ، جليسة أطفال ، علاج طبيعي ، مواعيد'];
  Doctor_Consultations = ['Doctor Consultations', 'استشارات الطبيب'];
  Doctor_Consultation_Details = ['Doctor Consul, Ongoing, Past, etc.', 'استشارة طبيب ، مستمر ، سابق ، إلخ.'];
  Lab_Test_Bookings = ['Lab Test Bookings', 'حجوزات فحص المختبر'];
  Lab_Test_Booking_Details = ['Completed, Closed, Or Cancelled.', 'مكتمل أو مغلق أو ملغى.'];
  Orders = ['Orders', 'ترتيب'];
  Order_Details = ['Medicines & Other Equipments', 'الأدوية والمعدات الأخرى'];
  Acccount_and_More = ["Account & More", "الحساب  و المزيد  "];
  Acccount_Setting = ['Account Settings', 'إعدادت الحساب'];
  Manage_Address = ["Manage Address", "إدارة العنوان"];
  Manage_Members = ["Manage Members | Health Record", "إدارة الأعضاء | السجل الصحي"];
  Find_Location = ["Find Location", "البحث عن الموقع"];
  Health_Record = ['My Health Record', 'سجلي الصحي']
  Support_and_More = ["Support & More", " الدعم و المزيد "];
  Like_Us = ["Like Us? Give 5 Star Review", "أعجبك؟ أعط مراجعة 5 نجوم"];
  SignOut = ["Sign Out", "تسجيل خروج"];
  About_App = ['Making healthcare digital & easy', 'نجعل الرعاية الصحية رقمية وسهلة'];
  About_App_Details = ['The best licensed home healthcare company', 'أفضل شركة رعاية صحية منزلية مرخصة'];
  Nurse_Booking = ['Nurse Booking', 'حجز ممرضة'];
  RootsCare = ["Roots Care", "روتس كير "];
  Howitworks = ["How it works", "How it works"];
  BookConsultation = ["BOOK CONSULTATION", "حجز استشارة "];
  NearBy = ["Near by", "قريب من"];
  OtpTime = ['You have 60 seconds to enter the OTP, if you do not receive the OTP, request again.', 'لديك 60 ثانية لإدخال كلمة المرور لمرة واحدة ، إذا لم تستلم كلمة المرور لمرة واحدة ، اطلب مرة أخرى.'];
  NeedSupport = ["Need Support", "تحتاج مساعدة"];
  Add_Address = ["Add This Address", "أضف هذا العنوان"];
  Saved_Address = ["Saved Addresses", "العناوين المحفوظة"];
  Edit_Address = ["Edit Address", "تعديل العنوان"];
  Address_Title = ["Address Title", "اسم العنوان"];
  Google_Address = ["Google Map Address", "عنوان خريطة جوجل"];
  Nearest_Address = ["Nearest Landmark", "أقرب معلم"];
  Building_Name = ["Building Name", "اسم المبنى"];
  Save_Address = ["SAVE ADDRESS", "حفظ العنوان"];
  Delete = ["DELETE", "حذف   "];
  Add_Member = ["ADD MEMBER", "إضافة عضو"];
  Add_New_Member = ["ADD NEW MEMBER", "إضافة عضو جديد"];
  Edit_Member = ["Edit Member", "تحرير العضو"];
  Upload_Photo = ["Upload a photo of the member", "قم بتحميل صورة العضو"];
  Photo_Size = ["Max. Upload Size 10 MB", "الأعلى. حجم الرفع 10 ميجا بايت"];
  Archive = ["ARCHIVE", "أرشيف"];
  Merge = ["MERGE", "دمج"];
  Default_Address = ["Default Address", "العنوان الافتراضي"];
  Advance_Filter = ["Advance Filter", "فلتر متقدم"];
  Consult_Type = ["Consultation Type", "نوع الاستشارة"];
  Doc_Exp = ["Doctor Experience", "خبرة الطبيب"];
  Select_Nationality = ["Select Nationality", "اختر الجنسية"];
  Type = ['Type', 'نوع'];
  Rate_Appointment = ["RATE APPOINTMENT", "تحديد موعد"];
  Appointment_Details = ["Appointment Details", "تفاصيل الموعد"];
  Lab_Test_Details = ["Lab Test Details", "تفاصيل فحوصات المختبر"];
  Consultation_Details = ["Consultation Details", "تفاصيل الاستشارة"];
  Consultation_Help = ["Need help with your consultation?", "تحتاج مساعدة في استشارتك؟"];
  ContactUs = ["Contact Us", "اتصل بنا"];
  Orders = ['Orders', 'ترتيب'];
  Voice_Recording = ['Voice Recording', 'تسجيل صوتي'];
  Description = ['Description', 'وصف'];
  Appoitment_Issue = ['Post Your Appointment issue', 'ارسل مشكلة موعدك'];
  Subject = ['Subject', 'موضوع'];
  Default = ['default', 'افتراضي'];
  Continue_Booking = ['CONTINUE TO BOOKING', 'تابع الحجز'];
  Edit = ['EDIT', 'تعديل'];
  Save = ['SAVE', 'حفظ'];
  Add_New_Address = ['Add New Address', 'حفظ'];
  Delete_Member = ["Delete Member", "حذف العضوية"];
  Delete_Address = ["Delete Address", "حذف العنوان"];
  Sure_Delete = ['Are you sure you want to delete this member?', 'هل أنت متأكد من طلب حذف العضوية؟'];
  Sure_Delete_Address = ['Are you sure you want to delete this address?', 'هل أنت متأكد أنك تريد حذف هذا العنوان؟'];
  Select_Member = ['Select Member', 'حدد عضو'];
  CantDelete = [`Default address can't be removed, make another address default before you delete this address.`, `لا يمكن إزالة العنوان الافتراضي ، قم بتعيين عنوان آخر افتراضيًا قبل حذف هذا العنوان.`];
  Email = ["Email Id", "البريد الالكتروني"];
  PhoneNumber = ["Mobile Number", "رقم الهاتف المحمول"];
  LoginIssue = ["Login Issue", "مشكلة تسجيل الدخول"];
  Login_Issue = ['Post Your Login issue', 'انشر مشكلة تسجيل الدخول الخاصة بك'];
  OrderId = ["Order ID", "رقم التعريف الخاص بالطلب"];
  Booking_Note=['Booking Notes','ملاحظات الحجز'];
  Booking_Desc=['Solutions and drugs to be injected are not included','لا تشمل المحاليل والأدوية المراد حقنها']
  noAppoitmentTitle = ['Sorry, no appointments found', 'نعتذر ، لم يتم العثور على مواعيد'];
noAppoitmentDesc = ['You can start a new appointment with our qualified home healthcare service providers', 'يمكنك بدء موعد جديد مع مقدمي خدمات الرعاية الصحية المنزلية المؤهلين لدينا'];
guestAppoitmentTitle = ['Oops! No Appointment Found', 'عفوًا! لم يتم العثور على موعد'];
guestAppoitmentDesc = ['No Appointment record found, user type is Guest', ''];

noConsultTitle = ['Sorry, no consultations found', 'عذرا ، لم يتم العثور على استشارات'];
noConsultDesc = ['You can start a new consultation with our qualified doctors!', 'يمكنك بدء استشارة جديدة مع أطبائنا المؤهلين'];
guestConsultTitle = ['Oops! No Consultations Found', 'عفوًا! لم يتم العثور على استشارات'];
guestConsultDesc = ['No Consultations record found, user type is Guest', 'لم يتم العثور على أي سجل للاستشارات،ونوع المستخدم ضيف'];

noLabsTitle = ['Sorry, no labs found', 'عذرا ، لم يتم العثور على مختبرات'];
noLabsDesc = ['You can book a new test with our qualified labs!', 'يمكنك حجز فحص جديد مع مختبراتنا المؤهلة'];
guestLabsTitle = ['Oops! No Labs Found', 'عفوًا! لم يتم العثور على مختبرات'];
guestLabsDesc = ['No Labs record found, user type is Guest', 'لم يتم العثور على أي سجل مختبرات ، نوع المستخدم هو ضيف']

noNursesTitle = ['Sorry, no Nurse found.', 'عذرا ، لم يتم العثور على ممرضة'];
noNursesDesc = ['We have not found any Nurses at your location, as soon as we are available we will notify you.', 'لم نعثر على أي ممرضات في موقعك ، بمجرد تواجدنا سنبلغك بذلك'];

noDocsTitle = ['Sorry, no Doctors found.', 'عذرا ، لم يتم العثور على أطباء'];
noDocsDesc = ['We have not found any Doctors at your location, as soon as we are available we will notify you.', 'لم نعثر على أي أطباء في موقعك ، وبمجرد تواجدنا سنبلغك بذلك'];

noPhysiotherapistsTitle = ['Sorry, no Physiotherapists found.', 'عذرا ، لم يتم العثور على أخصائيين علاج طبيعي'];
noPhysiotherapistsDesc = ['We have not found any Physiotherapists at your location, as soon as we are available we will notify you.', 'لم نعثر على أي أخصائي علاج طبيعي في موقعك ، وبمجرد تواجدنا سنبلغك بذلك'];

noNurseAssisTitle = ['Sorry, no Nurse Assistants found.', 'عذرا ، لم يتم العثور على مساعدين ممرضات'];
noNurseAssisDesc = ['We have not found any Nurse Assistants at your location, as soon as we are available we will notify you.', 'لم نعثر على أي مساعدين للممرضات في موقعك ، بمجرد تواجدنا سنبلغك '];

noBabySitterTitle = ['Sorry, no Baby Sitters found.', 'عذرا ، لم يتم العثور على جليسات الأطفال'];
noBabySitterDesc = ['We have not found any Baby Sitters at your location, as soon as we are available we will notify you.', 'لم نعثر على أي جليسات أطفال في موقعك ، بمجرد تواجدنا سنبلغك بذلك'];

noLabsTitle = ['Sorry, no Labs found.', 'عذرا ، لم يتم العثور على مختبرات'];
noLabsDesc = ['We have not found any Labs at your location, as soon as we are available we will notify you.', 'لم نعثر على أي مختبرات في موقعك ، وبمجرد تواجدنا سنبلغك بذلك'];




}
export const Lang_chg = new Language_provider();

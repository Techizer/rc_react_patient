import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { config } from "./configProvider";
import RNRestart from "react-native-restart";

class Language_provider {
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
  otp = ["OTP Verification Code", "رمز التحقق لمرة واحدة  "];
  otptext = [
    "We have sent the 4 digit verification code in your registered mobile number",
    "لقد أرسلنا رمز التحقق المكون من 4 أرقام إلى رقم جوالك المسجل لدينا",
  ];
  submitbtntext = ["SUBMIT", "تأكيد "];
  signupbtntext = ["SIGN UP", " التسجيل  "];
  notrectext = ["Not received code?", "لم يتم استلام الرمز؟"];
  sendagaintext = ["Send Again", "أعد الإرسال"];
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
  Editprofile = ["Edit Account", "تعديل الحساب  "];
  tabnameprofile = ["Personal", " شخصي     "];
  tabnamemedical = ["Medical", " طبي    "];
  tabnamelifestyle = ["Life Style", " أسلوب الحياة  "];
  dob = ["Date of Birth", "تاريخ الميلاد "];
  Gender = ["Gender", "الجنس"];
  textinputidentity = ["Identity Number", "رقم الهوية"];
  male = ["Male", "ذكر"];
  female = ["Female", "أنثى"];
  select = ["Select", "حدد"];
  selectSpecialty = ["Select Specialty", "حدد التخصص"];
  allergies = ["Allergies", "الحساسية"];
  q1 = ["Are you allergic to anything?", "هل لديك حساسية من أي شيء؟"];
  textinputallergies = ["Enter Allergies", "أدخل الحساسية"];
  current = ["Current Medication", "الأدوية الحالية"];
  q2 = [
    "Are you taking any medicines at the moment?",
    "هل تتناول أي أدوية في الوقت الحالي؟",
  ];
  textinputcurrent = ["Enter Current Medication", "أدخل الأدوية الحالية"];
  pastmedication = ["Past Medication", "الأدوية السابقة"];
  q3 = [
    "Have you been on medications in the past?",
    "هل كنت تتناول أدوية في الماضي؟",
  ];
  textinputpastmedication = [
    "Enter Past Medication",
    " أدخل الأدوية السابقة",
  ];
  injuries = ["Injuries", " الاصابات"];
  q4 = [
    "Have you hade any injuires in the past?",
    " هل تعرضت لأي إصابات في الماضي؟  ",
  ];
  textinputinjuries = ["Enter Injuries", "أدخل الاصابات"];
  surgeries = ["Surgeries", "العمليات الجراحية"];
  q5 = [
    "Have you had any surgeries in the past?",
    "هل أجريت أي عمليات جراحية في الماضي؟",
  ];
  textinputsurgeries = ["Enter surgeries", "أدخل العمليات الجراحية"];
  chronic = ["Chronic Diseases", "الأمراض المزمنة "];
  q6 = [
    "Have you had chronic diseases in the past?",
    " هل عانيت من أي أمراض مزمنة في الماضي؟  ",
  ];
  textinputchronic = ["Enter chronic diseases", " أدخل الأمراض المزمنة  "];
  savebtntext = ["SAVE", "حفظ  "];
  yes_txt = ["Yes", "نعم "];
  no_txt = ["NO", "لا"];
  yes_txt_new = ["Yes", "نعم"];
  no_txt_new = ["No", "لا"];
  smoking = ["Smoking Habits", "عادات التدخين  "];
  Alcohol = ["Alcohol Habits", "عادات تناول الكحول  "];
  blood = ["Blood Group", "فصيلة الدم  "];
  activity = ["Activity Level", "مستوى النشاط  "];
  food = ["Food Preference", " الغذاء المفضل  "];
  occupation = ["Occupation", "المهنة "];
  Forgot = ["Forgot Password ?", "نسيت كلمة المرور؟ "];
  Forgottext = [
    "Enter the email association with your account and we'll send an email with instruction to reset your password.",
    ".أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل بريدًا إلكترونيًا يحتوي على تعليمات لإعادة تعيين كلمة المرور الخاصة بك ",
  ];
  textinputregistered = ["Registered Email", " بريد الكتروني مسجل "];
  forgotbtn = ["SEND MAIL", "أرسل رسالة "];

  //-------------------------------------------------------------------------------supportandmore
  supporttext = ["Support & More", " الدعم و المزيد "];
  version = ["Version 3.6.8", "الإصدار 3.6.8"];
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
    "اكتب مشكلتك بالتفصيل هنا",
  ];
  select_topic_text = ["Select a Topic", "اختر موضوع "];
  select_issues_text = ["Select issue", "حدد المشكلة  "];
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
  BabyCare = ["Baby Care", "رعاية أطفال"];
  Rating = ["Rating", "التقييم "];
  Booking = ["Booking", "حجز "];
  Experience = ["Experience", "الخبرة  "];
  ESTABLISHED = ["Established", "أنشئت"];
  AVAILABLE_TESTS = ["Available Tests", "الفحوصات المتاحة"];
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
  BookLabPackage = ["BOOK LAB PACKAGE", "باقة معمل الكتاب"];
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
  ProceedToPay = ["PROCEED TO PAY", "الانتقال إلى الدفع"];
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
  SearchBabyCare = [
    "Search Baby Care near your address",
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
  Availablebabycare = ["Available Baby Care's", "رعاية أطفال متاح"];
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
  GoToAppointment = ["Go to Appointment", " الانتقال إلى الموعد  "];
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
  Appointment_Booking_Details = ['Nurse, Nurse Ass, Baby Care, Physiotherapy, Appointments', 'ممرضة ، مساعدة ممرضة ، جليسة أطفال ، علاج طبيعي ، مواعيد'];
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
  Edit_Member = ["EDIT MEMBER", "تحرير العضو"];
  Members = ["MEMBERS", "عضو"];
  You = ["You", "أنت"];
  OtherMembers = ["Other Members", "أعضاء آخرون"];
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
  Record_Symptom = ['Record your symptom', 'سجل الأعراض الخاصة بك']
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
  Booking_Note = ['Booking Notes', 'ملاحظات الحجز'];
  Booking_Desc = ['Solutions and drugs to be injected are not included', 'لا تشمل المحاليل والأدوية المراد حقنها']

  noAppoitmentTitle = ['Sorry, no appointments found', 'نعتذر ، لم يتم العثور على مواعيد'];
  noAppoitmentDesc = ['You can start a new appointment with our qualified home healthcare service providers', 'يمكنك بدء موعد جديد مع مقدمي خدمات الرعاية الصحية المنزلية المؤهلين لدينا'];
  guestAppoitmentTitle = ['Oops! No Appointment Found', 'عفوًا! لم يتم العثور على موعد'];
  guestAppoitmentDesc = ['No Appointment record found, user type is Guest', 'لم يتم العثور على سجل موعد ، نوع المستخدم هو ضيف'];

  noConsultTitle = ['Sorry, no consultations found', 'عذرا ، لم يتم العثور على استشارات'];
  noConsultDesc = ['You can start a new consultation with our qualified doctors!', 'يمكنك بدء استشارة جديدة مع أطبائنا المؤهلين'];
  guestConsultTitle = ['Oops! No Consultations Found', 'عفوًا! لم يتم العثور على استشارات'];
  guestConsultDesc = ['No Consultations record found, user type is Guest', 'لم يتم العثور على أي سجل للاستشارات،ونوع المستخدم ضيف'];

  noLabTestsTitle = ['Sorry, no lab tests found', 'عذرا ، لم يتم العثور على مختبرات'];
  noLabsTestsDesc = ['You can book a new test with our qualified labs!', 'يمكنك حجز فحص جديد مع مختبراتنا المؤهلة'];
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

  noBabyCareTitle = ['Sorry, no Baby Sitters found.', 'عذرا ، لم يتم العثور على جليسات الأطفال'];
  noBabyCareDesc = ['We have not found any Baby Sitters at your location, as soon as we are available we will notify you.', 'لم نعثر على أي جليسات أطفال في موقعك ، بمجرد تواجدنا سنبلغك بذلك'];

  noLabsTitle = ['Sorry, no Labs found.', 'عذرا ، لم يتم العثور على مختبرات'];
  noLabsDesc = ['We have not found any Labs at your location, as soon as we are available we will notify you.', 'لم نعثر على أي مختبرات في موقعك ، وبمجرد تواجدنا سنبلغك بذلك'];

  Upcoming = ['Upcoming', 'القادمة'];
  Ongoing = ['Ongoing', 'جاري التنفيذ'];
  Past = ['Past', 'ماضي'];

  Personal = ['Personal', 'الشخصية'];
  Medical = ['Medical', 'طبي '];
  LifeStyle = ['LifeStyle', 'لايف ستايل'];

  OrdersTitle = ['Buy Home Medical Supplies & Equipments online', 'شراء المستلزمات والمعدات الطبية المنزلية عبر الإنترنت'];
  OrdersDesc = ['We are coming soon at your location with ordering option', 'سنصل قريبًا إلى موقعك مع خيار الطلب'];

  emptyPassword = ['Please enter password', 'الرجاء إدخال كلمة المرور']
  emptyMessage = ['Please enter message', 'الرجاء إدخال الرسالة']
  emptyOtpMsg = ['Please enter the OTP', 'الرجاء إدخال كلمة المرور لمرة واحدة']
  emptyName = ['Please enter your name!', 'الرجاء إدخال  الاسم  ']
  emptyEmail = ['Email can not be empty', 'لا يمكن أن يكون البريد الإلكتروني فارغًا  ']
  validEmail = ['Please enter valid email id', 'الرجاء إدخال معرف بريد إلكتروني صالح  ']
  emptymobileNumber = ['Please enter mobile number!', 'الرجاء إدخال رقم الهاتف المحمول  '];
  validmobileNumber = ['Invalid mobile number!', '<string name="رقم الهاتف المحمول غير صالح'];
  emptyid = ['Please provide ID Number!', 'الرجاء ادخال رقم الهوية '];
  validataionnewpass = ['Please enter Password', ' الرجاء إدخال كلمة المرور '];
  emptyPasswordValid = ['Must be at least 8 characters.', '  .يجب أن لا تقل عن 8 أحرف أو أرقام   '];
  emptyIdValid = ['Must be between 10 to 15 characters or digits', 'رقم الهوية؟  - "يجب أن يكون بين 10 إلى 15 رقماً أو حرفًا '];
  emptyconfirmPassword = ['Please enter confirm password!', ' الرجاء إدخال تأكيد كلمة المرور  '];
  Password_notmatch = ['Both passwords must match', 'يجب أن تتطابق كلمتا المرور'];
  emptyEmailmobile = ['Email/Password can not be empty.', 'لا يمكن ترك البريد الإلكتروني / كلمة المرور فارغين  ']
  validIDnumber = ['ID Number must be start from 1 or 2 ', 'يجب أن يبدأ رقم الهوية من 1 أو 2  '];
  emptyCountrycode = ['Please enter country code', 'الرجاء إدخال رمز الدولة']
  smoking_msg = ['Please enter your smoking habits', 'الرجاء إدخال عادات التدخين الخاصة بك']
  alcohal_msg = ['Please enter your alcohol habits', 'الرجاء إدخال عادات الكحول الخاصة بك']
  bloodgrp_msg = ['Please enter your blood group', 'الرجاء إدخال فصيلة دمك']
  activity_level = ['Please enter your activity level', 'الرجاء إدخال مستوى نشاطك']
  food_preferance = ['Please enter your food preference', 'الرجاء إدخال طعامك المفضل']
  occuation = ['Please enter your occupation', 'الرجاء إدخال مهنتك']
  emptySelecttopic = ['Please select a topic', 'الرجاء تحديد موضوع ']
  emptyPasswordblank = ['Password can not be blank', 'كلمة المرور لا يمكن أن تكون فارغة']
  emptyPaitentName = ['Please enter patient first name', 'الرجاء إدخال الاسم الأول للمريض']
  emptyPaitentLastName = ['Please enter patient last name', 'الرجاء إدخال الاسم الأخير للمريض']
  emptyAge = ['Please enter patient age', 'الرجاء إدخال عمر المريض']
  EmptyTask = ['Please select task', ' الرجاء تحديد المهمة']
  EmptyPackage = ['Please select package', 'الرجاء تحديد الحزمة']
  EmptyTime = ['Please select time', ' الرجاء تحديد الوقت   ']
  emptyImage = ['Please Provide Image', 'يرجى إضافة الصورة']
  NoInternet = ['Please check your network connection', 'يرجى التحقق من اتصالك بالشبكة ']
  sucess_message_login = ['Login Successfully', 'تم تسجيل الدخول بنجاح']
  emptyComingsoon = ['Coming Soon', 'Coming Soon']
  PaymentIntention = ['Payment Initiation', ' بدء الدفع ']
  validIDnumberUAE = ['Id number must start with 7', 'يجب أن يبدأ رقم الهوية بالرقم 7'];
  allergyName = ['Please enter Allergy Name', 'الرجاء إدخال اسم الحساسية'];
  currentMedicine = ['Please enter current medicine', 'الرجاء إدخال الدواء الحالي'];
  pastMedicine = ['Please enter past medicine', 'الرجاء إدخال الدواء السابق'];
  injuries = ['Please enter any injuries', 'الرجاء إدخال أي إصابات'];
  surgeries = ['Please enter any injuries', 'الرجاء إدخال أي عمليات جراحية'];
  chronicDisease = ['Please enter any chronic disease', 'الرجاء إدخال أي مرض مزمن'];
  Year = ['Year', 'سنة']
  ok = ['Ok', 'Okay', 'Está bem'];
  cancel = ['Cancel', 'Cancelar', 'Cancelar'];
  later = ['Later', 'Más tarde', 'Mais tarde'];
  clearapp = ['Clear notification', 'مسح الاشعارات']
  dltapp = ['Delete notification', 'حذف الاشعارات']
  clear = ['Are your sure you want to clear all notifications?', 'هل أنت متأكد من مسح جميع الاشعارات؟'];
  dltnot = ['Are your sure you want to delete notification?', 'هل أنت متأكد من حذف جميع الإخطارات؟'];
  not_msg = ['Notifications cleared successfully', 'تم مسح الاشعارات بنجاح']
  yes = ['Yes', 'نعم']
  no = ['No', 'لا']
  usererr = ["User id does not exist", "هوية المستخدم غير موجودة"]
  psdsent = ['Reset link has been sent to your email', 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني']
  information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  alert = ['Alert', 'Alerta', 'Alerta'];
  confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  response = ['Response', 'Respuesta', 'Resposta'];
  server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
  internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
  deactivate_msg = ['Account deactivated', 'تم إلغاء تنشيط الحساب']
  deactivate = [0,]
  usernotexit = ["User id does not exist", 'هوية المستخدم غير موجودة']
  account_deactivate_title = ['your account deactivated please try again', 'تم إلغاء تنشيط حسابك ، يرجى المحاولة مرة أخرى']


  ok = ['Ok', 'Okay', 'Está bem'];
  cancel = ['Cancel', 'Cancelar', 'Cancelar'];
  later = ['Later', 'Más tarde', 'Mais tarde'];
  no = ['No', 'لا'];
  yes = ['Yes', 'نعم'];
  and = ['and', 'و'];
  information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  alert = ['Alert', 'Alerta', 'Alerta'];
  confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
  response = ['Response', 'Respuesta', 'Resposta'];
  server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
  internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
  deactivate_msg = ['Account deactivated', 'تم إلغاء تنشيط الحساب']
  deactivate = [0,]
  usernotexit = ["User id does not exist, 'هوية المستخدم غير موجودة"]
  account_deactivate_title = ['your account deactivated please try again', 'حسابك معطل يرجى المحاولة مرة أخرى']
  emlsent = ['Email sent successfully', 'تم ارسال البريد الالكتروني بنجاح']
  psdsent = ['Password has been sent to your email address', 'تم إرسال كلمة المرور إلى بريدك الإلكتروني']

  congrats = ['Congratulations!!', 'تهانينا']
  changepassword = ['Password changed successfully.', 'تم تغيير كلمة المرور بنجاح']
  contactus = ['Contact us request successfully submitted', 'تم تقديم الطلب بنجاح']
  delete = ['Delete', 'حذف']
  reportpopup_user = ['Are you sure? you want to report this user', 'هل أنت متأكد؟ تريد الإبلاغ عن هذا المستخدم'];
  report_user = ['Report user', 'الإبلاغ عن المستخدم']

  emptyEmail = ['Please enter email or phone', 'الرجاء إدخال البريد الإلكتروني أو الهاتف'];
  validEmail = ['Please enter valid email', 'الرجاء إدخال بريد إلكتروني صحيح']
  emptyPassword = ['Please enter password', 'الرجاء إدخال كلمة المرور'];
  lengthPassword = ['Password length should be minimum 8 character', 'يجب ألا يقل طول كلمة المرور عن 8 أحرف'];
  emptynewPassword = ['Please enter new password', 'الرجاء إدخال كلمة المرور الجديدة'];
  emptyconfirmPassword = ['Please enter new password', 'الرجاء إدخال كلمة المرور الجديدة'];
  emptyconfirm = ['please enter right password', 'الرجاء إدخال كلمة المرور الصحيحة'];
  emptyFirstName = ['Please enter first name', 'الرجاء إدخال الاسم الأول'];
  emptyLastName = ['Please enter last name', 'الرجاء إدخال الاسم الأخير'];
  emptyPhone = ['Please enter phone number', 'الرجاء إدخال رقم الهاتف'];
  lengthPhone = ['Password length should be minimum 10 digit', 'يجب أن تكون كلمة المرور عشرة أحرف أو أرقام على الأقل'];
  loginFirst = ['Please login first', 'الرجاء تسجيل الدخول أولاً'];
  emptyContactResion = ['Please select contact reason', ' الرجاء اختيار سبب الاتصال '];
  emptyContactMessage = ['Please enter message', 'الرجاء إدخال الرسالة'];
  networkconnection = ['Unable to connect. Please check that you are connected to the Internet and try again.', 'Unable to connect. Please check that you are connected to the Internet and try again.'];
  servermessage = ['An Unexpected error occured , Please try again .If the problem continues , Please do contact us', 'An Unexpected error occured , Please try again .If the problem continues , Please do contact us'];

  TaskBase = ['Task Based Appointment Booking', 'بالمُهمة حجز موعد'];
  TaskBaseTitle = ['Task Based | Appointment Booking', 'بالمُهمة | حجز موعد'];
  HourBase = ['Hourly Appointment Booking', 'بالساعة حجز موعد']
  HourBaseTitle = ['Hourly | Appointment Booking', ' بالساعة | حجز موعد']
  Lab_Test_Booking = ['Lab Test Booking', 'حجز فحص مختبر ']
  Lab_Package_Booking = ['Lab Package Booking', 'حجز باقة المختبر']
  OnlineConsultation = ["Online Consultation", "الاستشارة عبر الإنترنت"];
  HomeVisitConsultation = ["Home Visit Consultation", "استشارة زيارة منزلية"];
  Amount_Payable = ['Amount Payable', 'المبلغ المستحق']
  SelectAppointmentType = ['Would you please select your booking preference?', 'هل يمكنك من فضلك تحديد تفضيل الحجز الخاص بك؟']
  Payment_Option = ['Payment Options', 'خيارات الدفع'];
  PaymentOneTitle = ['Credit Card by ', 'بطاقة الائتمان عن طريق ']
  PaymentOneDesc = ['Pay full amount using your Credit Card', 'ادفع كامل المبلغ باستخدام بطاقتك الائتمانية']
  PaymentTwoTitle = ['Buy Now Pay Later by ', 'اشتر الآن وادفع لاحقًا عن طريق ']
  PaymentTwoDesc = ['Pay in 4 interest free payments', 'ادفع على 4 دفعات بدون فوائد']
  SupportTitle = ['Support ticket posted', 'تم نشر تذكرة الدعم']
  SupportMsg = ['Your support ticket is under review by Rootscare resolution team. You will soon receive notification on the status.', 'بطاقة الدعم الخاصة بك قيد المراجعة من قبل فريق حل Rootscare. ستتلقى قريبًا إشعارًا بالحالة.']
  CartTime = ['Time Remaining - Checkout Information', 'الوقت المتبقي - معلومات الخروج']
  CartInfo = ['You have 60 seconds to complete this order/appointment/booking, otherwise system will automatically cancel your slot and return back to previous screen.',
    'لديك 60 ثانية لإكمال هذا الطلب / الموعد / الحجز ، وإلا فسيقوم النظام تلقائيًا بإلغاء الفترة الزمنية الخاصة بك والعودة إلى الشاشة السابقة.'
  ]
  ChatNote = ['Available chat consultation', '']
  Chat = ['Chat with specialist', '']
  ChatInit = ['Chat with same medical specialist in this conversation window', '']
  BookNew = ['Book a new consultation', '']
  ChatClosed = ['Conversation Closed', '']
}
export const LangProvider = new Language_provider();

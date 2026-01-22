document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ Script URL ของคุณ
    const scriptURL = 'https://script.google.com/macros/s/AKfycby69houENixc-pQplsHDsu1RHkYKWuwlvF04DzG6yQfnACOAUyX8ma1o0A2TgJudd76/exec';

    // --- ตัวแปร Elements ---
    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const statusBox = document.getElementById("statusMessage");
    const recordSection = document.getElementById("recordSection");
    const btnSave = document.getElementById("btnSave");
    const btnReset = document.getElementById("btnReset");
    const langBtn = document.getElementById("langBtn");

    let currentLang = "th"; // เริ่มต้นภาษาไทย

    // --- 1. คำแปลบนหน้าเว็บ (Interface) ---
    const translations = {
        th: {
            btnText: "EN",
            mainTitle: "แบบบันทึกการเข้าใช้บริการห้องพยาบาล",
            subTitle: "วิทยาลัยเทคนิคสุราษฎร์ธานี",
            sec1: "1. ข้อมูลส่วนตัว",
            phName: "ชื่อ-นามสกุล", phPhone: "เบอร์โทรศัพท์",
            statusDefault: "📢 กรุณากรอกชื่อและเบอร์โทรศัพท์ เพื่อเริ่มบันทึกข้อมูล",
            sec2: "2. ฟอร์มบันทึกการรักษา",
            labelGender: "เพศ", labelDept: "แผนกวิชา", labelLevel: "สถานะ / ชั้นปี",
            labelRest: "การนอนพัก/กลับบ้าน", labelSymp: "อาการหลัก", labelMore: "อาการเพิ่มเติม",
            phMore: "ระบุอาการเพิ่มเติม", labelMed: "ยาที่จ่าย", labelTemp: "อุณหภูมิ (°C)",
            labelWeight: "น้ำหนัก (กก.)", btnReset: "ล้างข้อมูล", btnSave: "บันทึกข้อมูลใหม่",
            optSelect: "เลือก", optSelectDept: "เลือกแผนกวิชา", optSelectSymp: "เลือกอาการหลัก",
            // General
            verifySuccess: "✅ ยืนยันตัวตนสำเร็จ: คุณ",
            confirmTitle: "ตรวจสอบข้อมูล", btnConfirm: "ยืนยัน บันทึก", btnCancel: "แก้ไข",
            saveSuccess: "บันทึกข้อมูลเรียบร้อย"
        },
        en: {
            btnText: "TH",
            mainTitle: "Medical Room Service Record",
            subTitle: "Surat Thani Technical College",
            sec1: "1. Personal Information",
            phName: "Full Name", phPhone: "Phone Number",
            statusDefault: "📢 Please enter Name and Phone to start.",
            sec2: "2. Treatment Form",
            labelGender: "Gender", labelDept: "Department", labelLevel: "Status / Year",
            labelRest: "Rest / Go Home", labelSymp: "Main Symptom", labelMore: "Additional Details",
            phMore: "Specify details", labelMed: "Dispensed Medicine", labelTemp: "Temperature (°C)",
            labelWeight: "Weight (kg)", btnReset: "Clear Form", btnSave: "Save Record",
            optSelect: "Select", optSelectDept: "Select Department", optSelectSymp: "Select Symptom",
            // General
            verifySuccess: "✅ Verified: ",
            confirmTitle: "Confirm Details", btnConfirm: "Confirm & Save", btnCancel: "Edit",
            saveSuccess: "Record saved successfully."
        }
    };

    // --- 2. คำแปลข้อมูล (Data Translation) ---
    const optionTranslations = {
        // เพศ
        "ชาย": "Male", "หญิง": "Female",
        // แผนกวิชา
        "ช่างยนต์": "Auto Mechanics", "ยานยนต์ไฟฟ้า": "EV Technology", "ช่างกลโรงงาน": "Machine Tool Technology",
        "ช่างเชื่อมโลหะ": "Welding Technology", "ช่างไฟฟ้า": "Electrical Power", "ช่างอิเล็กทรอนิกส์": "Electronics",
        "เมคคาทรอนิกส์": "Mechatronics", "ช่างก่อสร้าง": "Construction", "เทคนิคสถาปัตยกรรม": "Architecture",
        "เทคโนโลยียางและพอลิเมอร์": "Rubber/Polymer Tech", "เทคโนโลยีสารสนเทศ": "Information Technology",
        "การจัดการโลจิสติกส์": "Logistics Management", "ระบบขนส่งทางราง": "Rail Transport System",
        "เทคนิคพื้นฐาน": "Basic Technical Science", "บัญชี": "Accounting", "การตลาด": "Marketing",
        "คอมพิวเตอร์ธุรกิจ": "Business Computer", "การโรงแรม": "Hotel Management", "อาหารและโภชนาการ": "Food and Nutrition",
        // ระดับชั้น
        "ปวช.1": "Voc. Cert. 1", "ปวช.2": "Voc. Cert. 2", "ปวช.3": "Voc. Cert. 3",
        "ปวส.1": "High Voc. Cert. 1", "ปวส.2": "High Voc. Cert. 2",
        "ปริญญาตรี ปี 1": "Bachelor Yr 1", "ปริญญาตรี ปี 2": "Bachelor Yr 2", "บุคลากร": "Staff/Teacher",
        // การพัก
        "ไม่พัก": "No Rest", "พัก": "Rest at Clinic", "กลับบ้าน": "Go Home",
        // อาการ
        "อาการเจ็บป่วย/ไม่สบาย": "General Sickness", "ทำแผล": "Wound Dressing", "เป็นลมหน้ามืด": "Fainting/Dizziness",
        "เป็นไข้": "Fever", "ไอ": "Cough", "มีน้ำมูก": "Runny Nose", "ผื่นคัน/ลมพิษ": "Rash/Hives",
        "เลือดกำเดาไหล": "Nosebleed", "ปวดศีรษะ": "Headache", "ท้องเสีย": "Diarrhea",
        "ปวดท้องประจำเดือน": "Period Cramps", "อื่นๆ": "Others",
        // ยา
        "ไม่เอายา": "No Medicine", "ยาแก้ไอ": "Cough Syrup", "ยาธาตุน้ำขาว": "Salol et Menthol",
        "พาราเซตามอล ไทลินอล": "Paracetamol", "ทิฟฟี่": "Tiffy", "ไทลินอล": "Tylenol", "ดีคอลเจน": "Decolgen",
        "เกลือแร่": "ORS", "ยาล้างตา": "Eye Wash", "ยาดมโป๊ยเซียน": "Inhaler", "น้ำเกลือ": "Saline Solution",
        "แอตตาซิล": "Antacil", "เคาน์เตอร์เพน 30 กรัม": "Counterpain", "เบต้าดีน": "Betadine", "แอมโมเนีย": "Ammonia",
        "ยาภูมิแพ้": "Antihistamine", "ยาลดกรด แอร์เอ็กซ์": "Air-X", "คาดรามาย-วี โลชั่น": "Calamine Lotion",
        "ยาหม่องขาว": "White Balm", "ยาอม": "Lozenge", "พอนสแตน 500": "Ponstan 500", "คาร์บอนแก้ท้องเสีย": "Carbon",
        "มายบาซิน โธร์ท (เหลือง) ยาแก้เจ็บคอ": "Mybacin (Yellow)", "มายบาซิน โธร์ท (ส้ม) ยาแก้เจ็บคอ": "Mybacin (Orange)",
        "ถุงมือ ชาโตรี่": "Gloves", "พลาสเตอร์ปิดแผล": "Plaster", "ยาหอม": "Ya-Hom"
    };

    // --- ฟังก์ชันอัปเดตภาษา ---
    function updateLanguage() {
        const t = translations[currentLang];
        langBtn.innerText = t.btnText;
        
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (t[key]) el.innerText = t[key];
        });

        document.querySelectorAll("[data-i18n-ph]").forEach(el => {
            const key = el.getAttribute("data-i18n-ph");
            if (t[key]) el.placeholder = t[key];
        });

        document.querySelectorAll("select option").forEach(opt => {
            const val = opt.value;
            if (opt.hasAttribute("data-i18n")) return;
            
            if (currentLang === "en") {
                if (optionTranslations[val]) opt.innerText = optionTranslations[val];
            } else {
                if (val && val.trim() !== "") opt.innerText = val;
            }
        });

        if (fullname.value || phone.value) checkIdentity();
    }

    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "th" ? "en" : "th";
        updateLanguage();
    });

    // --- Helper Functions ---
    function cleanPhone(num) { return num ? num.replace(/[^0-9]/g, '') : ''; }

    function checkIdentity() {
        const nameVal = fullname.value.trim();
        const phoneClean = cleanPhone(phone.value);
        const t = translations[currentLang];

        if (nameVal !== "" && phoneClean.length >= 9) {
            recordSection.classList.add("active");
            recordSection.classList.remove("locked");
            statusBox.innerHTML = `${t.verifySuccess} <b>${nameVal}</b>`;
            statusBox.className = "status-box success";
        } else {
            recordSection.classList.remove("active");
            recordSection.classList.add("locked");
            statusBox.innerHTML = t.statusDefault;
            statusBox.className = "status-box warning";
        }
    }
    fullname.addEventListener("input", checkIdentity);
    phone.addEventListener("input", checkIdentity);

    // --- บันทึกข้อมูล (Popup รายละเอียดครบ) ---
    btnSave.addEventListener("click", () => {
        const name = fullname.value.trim();
        const phoneVal = phone.value.trim();
        const symptom = document.getElementById("symptom").value;
        const temp = document.getElementById("temp").value;
        const weight = document.getElementById("weight").value;
        const moreDetails = document.getElementById("moreDetails").value;
        const t = translations[currentLang];

        if (!symptom) return Swal.fire("Warning", currentLang === 'th' ? "กรุณาระบุอาการหลัก" : "Please select symptom", "warning");

        const getTxt = (id) => { 
            let el = document.getElementById(id); 
            return el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : "-"; 
        };

        // สร้าง HTML Popup
        let detailsHTML = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.5;">
                <hr style="margin: 0 0 15px 0; border-top: 1px dashed #ccc;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 4px; width: 40%; font-weight:bold; color:#666;">${t.phName}:</td> 
                        <td style="padding: 4px;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 4px; font-weight:bold; color:#666;">${t.labelDept}:</td> 
                        <td style="padding: 4px;">${getTxt('department')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 4px; font-weight:bold; color:#666;">${t.labelLevel}:</td> 
                        <td style="padding: 4px;">${getTxt('level')}</td>
                    </tr>
                     <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 4px; font-weight:bold; color:#666;">${t.labelTemp} / ${t.labelWeight}:</td> 
                        <td style="padding: 4px;">
                            ${temp ? temp + " °C" : "-"} / ${weight ? weight + " kg" : "-"}
                        </td>
                    </tr>
                    <tr><td colspan="2" style="height:10px;"></td></tr>
                    
                    <tr>
                        <td style="padding: 4px; font-weight:bold; color:#007bff;">${t.labelSymp}:</td> 
                        <td style="padding: 4px;"><b>${getTxt('symptom')}</b></td>
                    </tr>
                    ${moreDetails ? `
                    <tr>
                        <td style="padding: 4px; font-weight:bold; color:#666; vertical-align:top;">${t.labelMore}:</td> 
                        <td style="padding: 4px; font-style:italic;">"${moreDetails}"</td>
                    </tr>` : ''}
                    
                    <tr style="background-color: #f1f8e9;">
                        <td style="padding: 8px; font-weight:bold; color:#2e7d32;">${t.labelMed}:</td> 
                        <td style="padding: 8px; font-weight:bold; color:#2e7d32;">${getTxt('medicine')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px; font-weight:bold; color:#dc3545;">${t.labelRest}:</td> 
                        <td style="padding: 4px; color:#dc3545;">${getTxt('rest')}</td>
                    </tr>
                </table>
            </div>
        `;

        Swal.fire({
            title: t.confirmTitle,
            html: detailsHTML,
            width: '400px',
            showCancelButton: true,
            confirmButtonText: t.btnConfirm,
            cancelButtonText: t.btnCancel,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) executeSave();
        });
    });

    async function executeSave() {
        const newRecord = {
            name: fullname.value.trim(),
            phone: phone.value.trim(),
            date: new Date().toLocaleString("th-TH"), 
            gender: document.getElementById("gender").value,
            dept: document.getElementById("department").value,
            level: document.getElementById("level").value,
            rest: document.getElementById("rest").value,
            symptom: document.getElementById("symptom").value,
            more: document.getElementById("moreDetails").value,
            medicine: document.getElementById("medicine").value,
            temp: document.getElementById("temp").value,
            weight: document.getElementById("weight").value
        };

        btnSave.disabled = true;
        btnSave.innerText = "Saving...";

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(newRecord)
            });
            Swal.fire("Success", translations[currentLang].saveSuccess, "success");
            
            document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => {
                if(el.id!=='fullname' && el.id!=='phone') {
                    if (el.tagName === 'SELECT') {
                        el.selectedIndex = 0;
                        if(el.id === 'rest') el.value = "ไม่พัก";
                    } else {
                        el.value = "";
                    }
                }
            });
            updateLanguage(); 
        } catch (error) {
            Swal.fire("Error", "Connection failed.", "error");
        } finally {
            btnSave.disabled = false;
            btnSave.innerText = translations[currentLang].btnSave;
        }
    }

    btnReset.addEventListener("click", () => {
        fullname.value = ""; phone.value = "";
        document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => {
            if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = "";
        });
        checkIdentity();
        updateLanguage();
    });

    updateLanguage();
});
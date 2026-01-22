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

    // Modal Elements
    const btnStatMed = document.getElementById("btnStatMed");
    const btnHistoryService = document.getElementById("btnHistoryService");
    const modalStats = document.getElementById("modalStats");
    const modalHistory = document.getElementById("modalHistory");
    const statsBody = document.getElementById("statsBody");
    const fullHistoryBody = document.getElementById("fullHistoryBody");

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
            // Modals
            statTitle: "📊 สถิติจำนวนยาที่จ่าย (รวมทั้งหมด)",
            historyTitle: "📋 ประวัติการใช้บริการของคุณ",
            thMedName: "ชื่อยา", thCount: "จำนวนที่จ่าย (ครั้ง)",
            thDate: "วันที่", thSymp: "อาการ", thMed: "ยาที่ได้รับ", thDept: "แผนก",
            loading: "กำลังโหลดข้อมูล...", noRecord: "ไม่พบประวัติ",
            total: "รวมทั้งหมด", verifySuccess: "✅ ยืนยันตัวตนสำเร็จ: คุณ",
            confirmTitle: "ตรวจสอบข้อมูล", btnConfirm: "ยืนยัน บันทึก", btnCancel: "แก้ไข",
            saveSuccess: "บันทึกข้อมูลเรียบร้อย",
            alertNoPhone: "กรุณากรอกเบอร์โทรศัพท์ก่อนดูประวัติ"
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
            // Modals
            statTitle: "📊 Medicine Statistics (All Users)",
            historyTitle: "📋 Your Service History",
            thMedName: "Medicine Name", thCount: "Count",
            thDate: "Date", thSymp: "Symptom", thMed: "Medicine", thDept: "Dept",
            loading: "Loading data...", noRecord: "No Record Found",
            total: "Grand Total", verifySuccess: "✅ Verified: ",
            confirmTitle: "Confirm Details", btnConfirm: "Confirm & Save", btnCancel: "Edit",
            saveSuccess: "Record saved successfully.",
            alertNoPhone: "Please enter phone number first."
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
        "ยาหม่องขาว": "White Balm", "ยาลม": "Ya-Hom (Herbal)", "พอนสแตน 500": "Ponstan 500", "คาร์บอนแก้ท้องเสีย": "Carbon",
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
    window.closeModal = function(id) { document.getElementById(id).style.display = "none"; }
    window.onclick = function(e) {
        if (e.target == modalStats) modalStats.style.display = "none";
        if (e.target == modalHistory) modalHistory.style.display = "none";
    }
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

    // ==========================================
    // 🔴 1. Statistics (แก้ให้แปลภาษา)
    // ==========================================
    btnStatMed.addEventListener("click", async () => {
        modalStats.style.display = "flex";
        statsBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">${translations[currentLang].loading}</td></tr>`;
        
        document.querySelector("#modalStats [data-i18n='statTitle']").innerText = translations[currentLang].statTitle;
        document.querySelector("#modalStats [data-i18n='thMedName']").innerText = translations[currentLang].thMedName;
        document.querySelector("#modalStats [data-i18n='thCount']").innerText = translations[currentLang].thCount;

        try {
            const response = await fetch(scriptURL);
            const data = await response.json();
            if (data.result === "error") throw new Error(data.error);

            let medCounts = {};
            data.forEach(row => {
                let med = row.medicine || "";
                if(med.trim() === "" || med === "ไม่เอายา") med = "ไม่เอายา"; 
                medCounts[med] = (medCounts[med] || 0) + 1;
            });

            let sorted = Object.keys(medCounts).map(key => ({name: key, count: medCounts[key]}))
                                            .sort((a,b) => b.count - a.count);

            statsBody.innerHTML = "";
            let grandTotal = 0;

            sorted.forEach(item => {
                // 🔹 จุดสำคัญ: แปลชื่อยา 🔹
                let displayName = item.name;
                if (currentLang === 'en') {
                    if(optionTranslations[item.name.trim()]) {
                        displayName = optionTranslations[item.name.trim()];
                    } else if (item.name === "ไม่เอายา") {
                        displayName = "No Medicine";
                    }
                }
                statsBody.innerHTML += `<tr><td>${displayName}</td><td style="text-align:center;">${item.count}</td></tr>`;
                grandTotal += item.count;
            });

            statsBody.innerHTML += `<tr style="background:#fff8e1; font-weight:bold;">
                <td style="text-align:right;">${translations[currentLang].total}</td>
                <td style="text-align:center; color:#d32f2f;">${grandTotal}</td></tr>`;

        } catch (e) {
            statsBody.innerHTML = `<tr><td colspan="2" style="color:red; text-align:center;">Error loading data</td></tr>`;
        }
    });

    // ==========================================
    // 🔴 2. History (แก้ให้แปลภาษา)
    // ==========================================
    btnHistoryService.addEventListener("click", async () => {
        const myPhone = cleanPhone(phone.value);
        if(myPhone.length < 3) {
            Swal.fire("Warning", translations[currentLang].alertNoPhone, "warning");
            return;
        }

        modalHistory.style.display = "flex";
        fullHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">${translations[currentLang].loading}</td></tr>`;

        document.querySelector("#modalHistory [data-i18n='historyTitle']").innerText = translations[currentLang].historyTitle;
        document.querySelector("#modalHistory [data-i18n='thDate']").innerText = translations[currentLang].thDate;
        document.querySelector("#modalHistory [data-i18n='thSymp']").innerText = translations[currentLang].thSymp;
        document.querySelector("#modalHistory [data-i18n='thMed']").innerText = translations[currentLang].thMed;
        document.querySelector("#modalHistory [data-i18n='thDept']").innerText = translations[currentLang].thDept;

        try {
            const response = await fetch(scriptURL);
            const data = await response.json();
            if (data.result === "error") throw new Error(data.error);

            const myHistory = data.filter(r => cleanPhone(r.phone.toString()) === myPhone);
            
            fullHistoryBody.innerHTML = "";
            if(myHistory.length === 0) {
                fullHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">${translations[currentLang].noRecord}</td></tr>`;
            } else {
                myHistory.reverse().forEach(row => {
                    let dateShow = row.date; 
                    let s = row.symptom || "";
                    let m = row.medicine || "";
                    let dep = row.dept || "";

                    // 🔹 จุดสำคัญ: แปลข้อมูลประวัติ 🔹
                    if (currentLang === 'en') {
                        if(optionTranslations[s.trim()]) s = optionTranslations[s.trim()];
                        if(optionTranslations[m.trim()]) m = optionTranslations[m.trim()];
                        if(optionTranslations[dep.trim()]) dep = optionTranslations[dep.trim()];
                    }

                    fullHistoryBody.innerHTML += `<tr><td>${dateShow}</td><td>${s}</td><td>${m}</td><td>${dep}</td></tr>`;
                });
            }
        } catch (e) {
            fullHistoryBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Error loading history</td></tr>`;
        }
    });

    // --- บันทึกข้อมูล ---
    btnSave.addEventListener("click", () => {
        const symptom = document.getElementById("symptom").value;
        const name = fullname.value.trim();
        const t = translations[currentLang];
        
        if (!symptom) return Swal.fire("Warning", currentLang==='th'?"กรุณาระบุอาการหลัก":"Please select symptom", "warning");

        const getTxt = (id) => { let el = document.getElementById(id); return el.options[el.selectedIndex].text; };

        Swal.fire({
            title: t.confirmTitle, 
            html: `<b>Name:</b> ${name}<br><b>Symptom:</b> ${getTxt('symptom')}<br><b>Med:</b> ${getTxt('medicine')}`,
            showCancelButton: true, confirmButtonText: t.btnConfirm, cancelButtonText: t.btnCancel
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

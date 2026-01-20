document.addEventListener("DOMContentLoaded", () => {
    // 1. อ้างอิง Element ต่างๆ
    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const statusBox = document.getElementById("statusMessage");
    const recordSection = document.getElementById("recordSection");
    const lockOverlay = document.getElementById("lockOverlay");
    const historySection = document.getElementById("historySection");
    const historyBody = document.getElementById("historyBody");
    const btnSave = document.getElementById("btnSave");
    const btnReset = document.getElementById("btnReset");

    // 2. URL เว็บแอป (ใช้ตัวล่าสุดที่คุณส่งมา)
    const scriptURL = 'https://script.google.com/macros/s/AKfycby69houENixc-pQplsHDsu1RHkYKWuwlvF04DzG6yQfnACOAUyX8ma1o0A2TgJudd76/exec';

    // ฟังก์ชันดึงข้อมูลจาก LocalStorage
    function getSavedData() {
        const data = localStorage.getItem("medicalRecords");
        return data ? JSON.parse(data) : [];
    }

    // 3. ฟังก์ชันแสดงประวัติการรักษาล่าสุด (รายการเดียว)
    function refreshHistory() {
        const nameVal = fullname.value.trim();
        const phoneVal = phone.value.trim();
        if (!nameVal || !phoneVal) return;

        const allRecords = getSavedData();
        const myHistory = allRecords.filter(r => r.name === nameVal && r.phone === phoneVal);

        historyBody.innerHTML = "";
        if (myHistory.length > 0) {
            const latest = myHistory[myHistory.length - 1]; 
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; color: #9b1c1c;">${latest.date}</td>
                <td>${latest.symptom} ${latest.more ? '(' + latest.more + ')' : ''}</td>
                <td>${latest.medicine}</td>
                <td>${latest.level} / ${latest.dept}</td>
            `;
            historyBody.appendChild(tr);
            historySection.classList.remove("hidden");
        } else {
            historySection.classList.add("hidden");
        }
    }

    // 4. ตรวจสอบการกรอกชื่อ-เบอร์เพื่อปลดล็อคฟอร์ม
    function checkIdentity() {
        if (fullname.value.trim() !== "" && phone.value.trim() !== "") {
            recordSection.classList.add("active");
            statusBox.innerHTML = `✅ ยืนยันตัวตนสำเร็จ: คุณ ${fullname.value.trim()}`;
            statusBox.style.background = "#e8f5e9";
            statusBox.style.color = "#2e7d32";
            refreshHistory();
        } else {
            recordSection.classList.remove("active");
            statusBox.innerHTML = "📢 กรุณากรอกชื่อและเบอร์โทรศัพท์ เพื่อเริ่มบันทึกข้อมูล";
            statusBox.style.background = "#fff5f5";
            statusBox.style.color = "#9b1c1c";
            historySection.classList.add("hidden");
        }
    }

    // 5. เหตุการณ์เมื่อกดปุ่ม "บันทึกข้อมูล"
    btnSave.addEventListener("click", async () => {
        const symptom = document.getElementById("symptom").value;
        if (!symptom) return alert("กรุณาระบุอาการก่อนบันทึกครับ");

        // รวบรวมข้อมูลตามโครงสร้างที่ Apps Script ต้องการ
        const newRecord = {
            name: fullname.value.trim(),
            phone: phone.value.trim(),
            date: new Date().toLocaleString("th-TH"), 
            gender: document.getElementById("gender").value,
            dept: document.getElementById("department").value,
            level: document.getElementById("level").value,
            rest: document.getElementById("rest").value,
            symptom: symptom,
            more: document.getElementById("moreDetails").value,
            medicine: document.getElementById("medicine").value,
            temp: document.getElementById("temp").value,
            weight: document.getElementById("weight").value
        };

        // แสดงสถานะกำลังบันทึก
        btnSave.disabled = true;
        btnSave.innerText = "⏳ กำลังบันทึก...";
        statusBox.innerHTML = "⏳ กำลังส่งข้อมูลไปยัง Google Sheets...";

        try {
            // บันทึกลง LocalStorage (แทนที่รายการเดิม)
            let allRecords = getSavedData();
            allRecords = allRecords.filter(r => !(r.name === newRecord.name && r.phone === newRecord.phone));
            allRecords.push(newRecord);
            localStorage.setItem("medicalRecords", JSON.stringify(allRecords));

            // ส่งข้อมูลไปยัง Google Apps Script
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(newRecord)
            });
            
            alert("✅ บันทึกข้อมูลเข้า Google Sheets สำเร็จ!");
            
            // ล้างฟอร์ม (ยกเว้นชื่อและเบอร์)
            document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => {
                if(el.id !== "fullname" && el.id !== "phone") {
                    el.value = (el.id === "rest") ? "ไม่มี" : "";
                }
            });
            
            refreshHistory();
            checkIdentity(); 
        } catch (error) {
            console.error(error);
            alert("❌ เกิดข้อผิดพลาดทางเทคนิค แต่บันทึกในเครื่องแล้ว");
        } finally {
            btnSave.disabled = false;
            btnSave.innerText = "💾 บันทึกข้อมูลการรักษา";
        }
    });

    // 6. ปุ่มล้างข้อมูล (Reset)
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if(confirm("คุณต้องการล้างข้อมูลที่กรอกอยู่ทั้งหมดใช่หรือไม่?")) {
                fullname.value = "";
                phone.value = "";
                document.querySelectorAll("#recordSection input, #recordSection select, #recordSection textarea").forEach(el => {
                    el.value = "";
                });
                checkIdentity();
            }
        });
    }

    // 7. Event Listeners สำหรับการพิมพ์
    fullname.addEventListener("input", checkIdentity);
    phone.addEventListener("input", checkIdentity);
    
    lockOverlay.addEventListener("click", () => {
        if (!recordSection.classList.contains("active")) {
            alert("🚨 กรุณากรอกชื่อและเบอร์โทรศัพท์ก่อนครับ!");
            fullname.focus();
        }
    });
});

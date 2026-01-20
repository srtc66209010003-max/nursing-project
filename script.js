document.addEventListener("DOMContentLoaded", () => {
    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const statusBox = document.getElementById("statusMessage");
    const recordSection = document.getElementById("recordSection");
    const lockOverlay = document.getElementById("lockOverlay");
    const historySection = document.getElementById("historySection");
    const historyBody = document.getElementById("historyBody");
    const btnSave = document.getElementById("btnSave");
    const btnReset = document.getElementById("btnReset");

    // URL เว็บแอปจาก Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycby69houENixc-pQplsHDsu1RHkYKWuwlvF04DzG6yQfnACOAUyX8ma1o0A2TgJudd76/exec';

    function getSavedData() {
        const data = localStorage.getItem("medicalRecords");
        return data ? JSON.parse(data) : [];
    }

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

    function checkIdentity() {
        if (fullname.value.trim() !== "" && phone.value.trim().length >= 9) {
            recordSection.classList.add("active");
            statusBox.innerHTML = `✅ ยืนยันตัวตนสำเร็จ: คุณ ${fullname.value.trim()}`;
            statusBox.style.background = "#e8f5e9";
            statusBox.style.color = "#2e7d32";
            refreshHistory();
        } else {
            recordSection.classList.remove("active");
            statusBox.innerHTML = "📢 กรุณากรอกชื่อและเบอร์โทรศัพท์เพื่อเริ่มบันทึก";
            statusBox.style.background = "#fff5f5";
            statusBox.style.color = "#9b1c1c";
            historySection.classList.add("hidden");
        }
    }

    btnSave.addEventListener("click", async () => {
        const symptom = document.getElementById("symptom").value;
        if (!symptom) return alert("กรุณาระบุอาการก่อนบันทึกครับ");

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

        btnSave.disabled = true;
        btnSave.innerText = "⏳ กำลังบันทึก...";

        try {
            // บันทึก Local
            let allRecords = getSavedData();
            allRecords = allRecords.filter(r => !(r.name === newRecord.name && r.phone === newRecord.phone));
            allRecords.push(newRecord);
            localStorage.setItem("medicalRecords", JSON.stringify(allRecords));

            // ส่งไป Google Sheets
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(newRecord)
            });
            
            alert("✅ บันทึกข้อมูลสำเร็จ!");
            
            // ล้างฟอร์ม (ยกเว้นชื่อและเบอร์)
            document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => {
                if(el.id !== "fullname" && el.id !== "phone") {
                    el.value = (el.id === "rest") ? "ไม่พัก" : "";
                }
            });
            refreshHistory();
        } catch (error) {
            alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            btnSave.disabled = false;
            btnSave.innerText = "บันทึกข้อมูลใหม่";
        }
    });

    fullname.addEventListener("input", checkIdentity);
    phone.addEventListener("input", checkIdentity);
    
    btnReset.addEventListener("click", () => {
        if(confirm("ล้างข้อมูลทั้งหมด?")) {
            fullname.value = ""; phone.value = "";
            document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => el.value = "");
            checkIdentity();
        }
    });

    lockOverlay.addEventListener("click", () => {
        if (!recordSection.classList.contains("active")) {
            alert("🚨 กรุณากรอกชื่อและเบอร์โทรศัพท์ก่อนครับ!");
            fullname.focus();
        }
    });
});

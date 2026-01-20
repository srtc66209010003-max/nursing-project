document.addEventListener("DOMContentLoaded", () => {
    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const statusBox = document.getElementById("statusMessage");
    const recordSection = document.getElementById("recordSection");
    const lockOverlay = document.getElementById("lockOverlay");
    const historySection = document.getElementById("historySection");
    const historyBody = document.getElementById("historyBody");

    // URL เว็บแอปที่ได้จากการ Deploy โค้ดในรูป image_9f915f.png
    const scriptURL = 'https://script.google.com/macros/s/AKfycby69houENixc-pQplsHDsu1RHkYKWuwlvF04DzG6yQfnACOAUyX8ma1o0A2TgJudd76/exec';

    function getSavedData() {
        const data = localStorage.getItem("medicalRecords");
        return data ? JSON.parse(data) : [];
    }

    // ฟังก์ชันแสดงประวัติล่าสุดเพียงรายการเดียว
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
        if (fullname.value.trim() !== "" && phone.value.trim() !== "") {
            recordSection.classList.add("active");
            statusBox.innerHTML = `✅ ยืนยันตัวตนสำเร็จ: คุณ ${fullname.value.trim()}`;
            statusBox.style.background = "#e8f5e9";
            statusBox.style.color = "#2e7d32";
            refreshHistory();
        } else {
            recordSection.classList.remove("active");
            statusBox.innerHTML = "📢 กรุณากรอกชื่อและเบอร์โทรศัพท์";
            statusBox.style.background = "#fff5f5";
            statusBox.style.color = "#9b1c1c";
            historySection.classList.add("hidden");
        }
    }

    // ปุ่มบันทึกข้อมูล
    document.getElementById("btnSave").addEventListener("click", async () => {
        const symptom = document.getElementById("symptom").value;
        if (!symptom) return alert("กรุณาระบุอาการก่อนบันทึกครับ");

        // ข้อมูลที่ส่งออกจะตรงกับตัวแปรใน Apps Script (image_9f915f.png)
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

        // บันทึกลง LocalStorage
        let allRecords = getSavedData();
        allRecords = allRecords.filter(r => !(r.name === newRecord.name && r.phone === newRecord.phone));
        allRecords.push(newRecord);
        localStorage.setItem("medicalRecords", JSON.stringify(allRecords));

        statusBox.innerHTML = "⏳ กำลังบันทึกลง Google Sheets...";
        statusBox.style.background = "#fff3cd";

        try {
            // ส่งข้อมูลไปยัง Google Sheets
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(newRecord)
            });
            
            alert("✅ บันทึกข้อมูลสำเร็จ!");
            refreshHistory();
            
            // ล้างฟอร์ม
            document.querySelectorAll("#recordSection input, #recordSection select").forEach(el => {
                if(el.id !== "fullname" && el.id !== "phone") {
                    el.value = (el.id === "rest") ? "ไม่มี" : "";
                }
            });
            checkIdentity(); 
        } catch (error) {
            alert("❌ ไม่สามารถส่งข้อมูลไปยังชีตได้");
        }
    });

    fullname.addEventListener("input", checkIdentity);
    phone.addEventListener("input", checkIdentity);
    lockOverlay.addEventListener("click", () => { alert("🚨 กรุณากรอกชื่อและเบอร์ก่อนครับ!"); fullname.focus(); });
});
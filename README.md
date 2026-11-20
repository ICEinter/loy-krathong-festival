# 🪷 Loy Krathong 3D Festival & Online Voting Web App
> ประเพณีลอยกระทง 3D ออนไลน์ พร้อมระบบส่งกระทงประกวด ถ่ายรูปเซลฟี่ และโหวตคะแนนแบบ Real-time

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **3D Scene ด้วย Three.js:**
  - ผิวน้ำแม่น้ำแบบ PBR พร้อมระลอกคลื่นสะท้อนแสงจันทร์ยามค่ำคืน
  - พระจันทร์เต็มดวงสว่างนวล พระเจดีย์สไตล์ไทยสีทองอร่าม และเรือนไทยใต้ถุนสูงริมน้ำ
  - บรรยากาศงานเทศกาล: ฝูงหิ่งห้อยเรืองแสงริมน้ำ โคมลอยยี่เป็งลอยสู่ท้องฟ้า และไฟประดับงานวัดหลากสีสัน
  - ผู้คนในชุดไทย 20 คนเดินเที่ยวชมงานรอบท่าน้ำ
- **การลอยของกระทงตามหลักฟิสิกส์คลื่นจริง:**
  - ตัวกระทงลอยแนบสนิทกับผิวน้ำ เอียงตามความลาดชันของระลอกคลื่น (Pitch & Roll)
  - แสงเทียนกระพริบไหว พร้อมระลอกคลื่นน้ำแผ่ออกรอบฐานกระทง
  - กระทงจำลองกว่า 35 ใบ ลอยสร้างบรรยากาศสว่างไสวทั่วสายน้ำ
- **ระบบส่งกระทงประกวด & ถ่ายรูปตัวเอง:**
  - เปิดกล้องหน้าถ่ายเซลฟี่หรืออัปโหลดรูปภาพ
  - ระบบลดขนาดรูปอัตโนมัติ (ไม่เกิน 500KB) ก่อนบันทึกลง Firestore
  - กรอกชื่อ คำอธิษฐาน และเลือกสไตล์กระทง (ใบตองวิจิตร, บัวสวรรค์, สุพรรณหงส์, ดารารัศมี, รักษ์โลก)
  - ปล่อยกระทงลงแม่น้ำจริง พร้อม **เสาแสงสีทอง (Celestial Beacon)** และป้าย **👑 กระทงของคุณ**
- **ระบบโหวตกระทงออนไลน์:**
  - แตะที่กระทงเพื่อเปิด Popup แสดงรูปถ่าย ชื่อ คำอธิษฐาน และกดโหวต (+1) พร้อมพลุ Confetti
  - บันทึกและซิงค์คะแนนโหวตแบบ Real-time ด้วย Firebase Firestore
  - ตารางอันดับกระทงยอดนิยม (Leaderboard)
- **ดนตรีไทยบรรเลง:**
  - เพลงวันลอยกระทง (ทำนองระนาดเอกและระฆังไทยดั้งเดิม) พร้อมปุ่มเปิด/ปิดเพลง

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19 + Vite + Tailwind CSS
- **3D Engine:** Three.js (WebGL, OrbitControls, MeshPhysicalMaterial, Procedural Shaders)
- **Database & Realtime:** Firebase Cloud Firestore
- **Audio:** Web Audio API (Thai Instrument Synthesizer)
- **Icons:** Lucide React

---

## 🚀 วิธีติดตั้งและรันในเครื่อง (Getting Started)

1. **Clone repository:**
   ```bash
   git clone https://github.com/ICEinter/loy-krathong-festival.git
   cd loy-krathong-festival
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables:**
   คัดลอกไฟล์ `.env.example` เป็น `.env` และใส่ค่า Firebase Config:
   ```bash
   cp .env.example .env
   ```

4. **รัน Development Server:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

Developed with ❤️ for Thai Cultural Preservation

// ข้อมูลเริ่มต้นของผู้เข้าประกวดกระทง 20 กระทง
export const INITIAL_CONTESTANTS = [
  {
    id: "krathong-1",
    name: "น้องมะลิ พิมพ์ใจ",
    wish: "ขอขมาพระแม่คงคา ขอให้ครอบครัวมีความสุข สุขภาพแข็งแรง การงานเจริญก้าวหน้า",
    votes: 142,
    color: "#22c55e", // เขียวมรกต ใบตอง
    style: "traditional",
    styleName: "กระทงใบตองวิจิตร",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -18, z: 12 },
    candleColor: "#ff7700"
  },
  {
    id: "krathong-2",
    name: "คุณกิตติศักดิ์ & ครอบครัว",
    wish: "ขอให้ปีนี้มีแต่สิ่งดีๆ เข้ามาในชีวิต ปลดหนี้ปลดสิน ร่ำรวยเงินทอง",
    votes: 98,
    color: "#ec4899", // ชมพูบานเย็น
    style: "lotus",
    styleName: "กระทงกลีบดอกบัวชมพู",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -8, z: 8 },
    candleColor: "#ffaa00"
  },
  {
    id: "krathong-3",
    name: "น้องฟ้าใส ใจดี",
    wish: "ขอให้สอบติดมหาวิทยาลัยในฝัน ขอให้พบเจอแต่กัลยาณมิตรที่ดี",
    votes: 215,
    color: "#3b82f6", // น้ำเงินไพลิน
    style: "modern",
    styleName: "กระทงสายรุ้งอัญมณี",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 5, z: 15 },
    candleColor: "#ff5500"
  },
  {
    id: "krathong-4",
    name: "พี่ธีรเทพ สายมู",
    wish: "ขอขมาแม่น้ำ ขอให้ชีวิตราบรื่น การค้าขายมีกำไร เฮงๆ ตลอดปี",
    votes: 85,
    color: "#eab308", // ทองอร่าม
    style: "royal",
    styleName: "กระทงสุพรรณหงส์ทองคำ",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 18, z: 10 },
    candleColor: "#ffbb00"
  },
  {
    id: "krathong-5",
    name: "คุณแม่สมศรี รักธรรมชาติ",
    wish: "ขอให้สายน้ำสะอาด บริสุทธิ์ คุ้มครองลูกหลานให้อยู่เย็นเป็นสุข",
    votes: 178,
    color: "#10b981", // เขียวหยก
    style: "eco",
    styleName: "กระทงผักตบชวารักษ์โลก",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -25, z: 5 },
    candleColor: "#ff6600"
  },
  {
    id: "krathong-6",
    name: "น้องต้นกล้า วิศวะ",
    wish: "ขอให้โปรเจกต์ผ่านฉลุย บั๊กหายหมด ทำงานสำเร็จตามเป้าหมาย",
    votes: 120,
    color: "#8b5cf6", // ม่วงคราม
    style: "modern",
    styleName: "กระทงดารารัศมี",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -12, z: -2 },
    candleColor: "#ff9900"
  },
  {
    id: "krathong-7",
    name: "คุณแพรวา ดีไซเนอร์",
    wish: "ขอให้มีไอเดียสร้างสรรค์ไม่รู้จบ และขอให้ความรักสมหวังสดชื่น",
    votes: 264,
    color: "#f43f5e", // แดงทับทิม
    style: "lotus",
    styleName: "กระทงปทุมมาศสีชาด",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 0, z: 6 },
    candleColor: "#ff7700"
  },
  {
    id: "krathong-8",
    name: "ลุงสมหมาย ชาวเรือ",
    wish: "ขอให้ฝนตกต้องตามฤดูกาล สายน้ำอุดมสมบูรณ์ ทุกคนเดินทางปลอดภัย",
    votes: 93,
    color: "#06b6d4", // ฟ้าคราม
    style: "traditional",
    styleName: "กระทงกาบกล้วยโบราณ",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 12, z: -5 },
    candleColor: "#ff8800"
  },
  {
    id: "krathong-9",
    name: "น้องน้ำหวาน กราฟิก",
    wish: "ขอให้ความทุกข์ลอยไปกับสายน้ำ ขอให้เจอแต่รอยยิ้มและความสดใส",
    votes: 310,
    color: "#f97316", // ส้มพวงแสด
    style: "modern",
    styleName: "กระทงเพลิงสุริยา",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 26, z: 3 },
    candleColor: "#ff4400"
  },
  {
    id: "krathong-10",
    name: "คู่รัก พีท & เจน",
    wish: "ขอให้ความรักของเรามั่นคงยืนยาวเหมือนสายน้ำไม่ขาดสาย",
    votes: 189,
    color: "#d946ef", // ชมพูฟูเชีย
    style: "lotus",
    styleName: "กระทงคู่สิเน่หา",
    photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -32, z: 15 },
    candleColor: "#ffaa00"
  },
  {
    id: "krathong-11",
    name: "น้องออโต้ ม.ปลาย",
    wish: "ขอให้เกรด 4 ทุกวิชา ได้คะแนนสอบตามที่หวังไว้ครับ",
    votes: 77,
    color: "#14b8a6", // เขียวเทอร์ควอยซ์
    style: "eco",
    styleName: "กระทงขนมปังเพื่อปลา",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -22, z: -8 },
    candleColor: "#ff6600"
  },
  {
    id: "krathong-12",
    name: "คุณอรทัย ครูภาษาไทย",
    wish: "สืบสานประเพณีไทย ขอให้เด็กไทยรักและภูมิใจในวัฒนธรรมอันดีงาม",
    votes: 165,
    color: "#fbbf24", // เหลืองทองจำปา
    style: "royal",
    styleName: "กระทงบุษราคัมวิจิตร",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -4, z: -10 },
    candleColor: "#ff9900"
  },
  {
    id: "krathong-13",
    name: "บอสธนา ผู้ประกอบการ",
    wish: "ขอให้ธุรกิจเติบโต ก้าวหน้าสู่ระดับสากล พนักงานทุกคนมีความสุข",
    votes: 112,
    color: "#6366f1", // น้ำเงินคราม
    style: "modern",
    styleName: "กระทงมณีนาคา",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 8, z: -14 },
    candleColor: "#ff5500"
  },
  {
    id: "krathong-14",
    name: "น้องมินท์ เชฟขนมหวาน",
    wish: "ขอให้ร้านเบเกอรี่มีลูกค้าแน่นทุกวัน ขนมอร่อยถูกใจทุกคน",
    votes: 240,
    color: "#fb7185", // ชมพูดอกกุหลาบ
    style: "lotus",
    styleName: "กระทงกลีบผกากรอง",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 22, z: -9 },
    candleColor: "#ffaa00"
  },
  {
    id: "krathong-15",
    name: "พี่ชัย ช่างภาพอิสระ",
    wish: "ขอให้ได้ภาพสวยงามประทับใจ เดินทางปลอดภัยทุกเส้นทาง",
    votes: 95,
    color: "#a855f7", // ม่วงกล้วยไม้
    style: "traditional",
    styleName: "กระทงกลีบผกาแก้ว",
    photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 33, z: 12 },
    candleColor: "#ff8800"
  },
  {
    id: "krathong-16",
    name: "น้องปอย แอร์โฮสเตส",
    wish: "ขอให้ทุกเที่ยวบินราบรื่น ปลอดภัย มีแต่รอยยิ้มตลอดการเดินทาง",
    votes: 180,
    color: "#38bdf8", // ฟ้าสดใส
    style: "modern",
    styleName: "กระทงเวหาศวารี",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -14, z: 18 },
    candleColor: "#ff6600"
  },
  {
    id: "krathong-17",
    name: "คุณวิชัย เกษตรกรยุคใหม่",
    wish: "ขอให้พืชผลอุดมสมบูรณ์ ดินดีน้ำดี ผลผลิตได้ราคาดีทุกฤดู",
    votes: 88,
    color: "#84cc16", // เขียวตองอ่อน
    style: "eco",
    styleName: "กระทงรวงข้าวสยาม",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 2, z: 18 },
    candleColor: "#ff7700"
  },
  {
    id: "krathong-18",
    name: "น้องแอนน์ นักดนตรีไทย",
    wish: "ขอให้เสียงดนตรีไทยสร้างความสุขให้คนทั่วโลก ขอให้มือไม่ตก",
    votes: 198,
    color: "#ef4444", // แดงชาด
    style: "royal",
    styleName: "กระทงรัตนโกสินทร์",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 15, z: 22 },
    candleColor: "#ff3300"
  },
  {
    id: "krathong-19",
    name: "ป้านวล แม่ค้าตลาดน้ำ",
    wish: "ขอให้ตลาดน้ำคึกคัก นักท่องเที่ยวมากันเยอะๆ ค้าขายร่ำรวย",
    votes: 135,
    color: "#f59e0b", // ส้มทอง
    style: "traditional",
    styleName: "กระทงพุ่มเทียนชัย",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: -28, z: -15 },
    candleColor: "#ffaa00"
  },
  {
    id: "krathong-20",
    name: "น้องก้อง นักกีฬา",
    wish: "ขอให้คว้าชัยชนะในการแข่งขัน ร่างกายไร้อาการบาดเจ็บ",
    votes: 104,
    color: "#0284c7", // ฟ้าครามเข้ม
    style: "modern",
    styleName: "กระทงธาราประกายดาว",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    initialPos: { x: 28, z: -18 },
    candleColor: "#ff6600"
  }
];

export const KRATHONG_STYLES = [
  {
    id: "traditional",
    name: "กระทงใบตองวิจิตร",
    description: "ใบตองพับจีบประณีต ดอกดาวเรืองและธูปเทียนทอง",
    color: "#22c55e",
    candleColor: "#ff7700"
  },
  {
    id: "lotus",
    name: "กระทงกลีบดอกบัวสวรรค์",
    description: "กลีบบัวบานสะพรั่ง สีชมพูระเรื่อ อ่อนหวานงดงาม",
    color: "#ec4899",
    candleColor: "#ff9900"
  },
  {
    id: "royal",
    name: "กระทงสุพรรณหงส์ทอง",
    description: "สีทองคำอร่าม ลวดลายวิจิตรงดงามดั่งเรือพระที่นั่ง",
    color: "#eab308",
    candleColor: "#ffaa00"
  },
  {
    id: "modern",
    name: "กระทงมณีดารารัศมี",
    description: "สีสันสมัยใหม่ ประดับอัญมณีเรืองแสงระยิบระยับ",
    color: "#8b5cf6",
    candleColor: "#ff5500"
  },
  {
    id: "eco",
    name: "กระทงรักษ์โลกอินทรีย์",
    description: "ทำจากวัสดุธรรมชาติ 100% ย่อยสลายง่าย เป็นมิตรกับปลา",
    color: "#10b981",
    candleColor: "#ff8800"
  }
];


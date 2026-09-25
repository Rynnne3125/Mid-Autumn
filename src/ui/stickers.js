/**
 * Bộ sưu tập 15 Sticker Chibi siêu dễ thương dành riêng cho từng câu chúc Trung Thu:
 * - Vẽ dưới dạng Vector SVG sắc nét tuyệt đối trên mọi độ phân giải
 * - Màu sắc tươi sáng, má hồng chibi, ngộ nghĩnh và ấm áp
 */

export function getStickerSvg(id) {
  const stickers = {
    // 1. Thỏ ôm bánh nướng khổng lồ
    1: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff0f3" opacity="0.6"/>
        <!-- Tai thỏ -->
        <ellipse cx="44" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <ellipse cx="44" cy="22" rx="4" ry="12" fill="#ffb3c1"/>
        <ellipse cx="76" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <ellipse cx="76" cy="22" rx="4" ry="12" fill="#ffb3c1"/>
        <!-- Đầu thỏ -->
        <circle cx="60" cy="48" r="24" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <!-- Mắt thỏ to tròn long lanh -->
        <ellipse cx="51" cy="46" rx="3.5" ry="4.5" fill="#2b2d42"/>
        <circle cx="50" cy="44.5" r="1.5" fill="#ffffff"/>
        <ellipse cx="69" cy="46" rx="3.5" ry="4.5" fill="#2b2d42"/>
        <circle cx="68" cy="44.5" r="1.5" fill="#ffffff"/>
        <!-- Má hồng -->
        <ellipse cx="43" cy="51" rx="4" ry="2.5" fill="#ff8fa3" opacity="0.75"/>
        <ellipse cx="77" cy="51" rx="4" ry="2.5" fill="#ff8fa3" opacity="0.75"/>
        <!-- Miệng cười chữ W -->
        <path d="M56 51 Q60 54 64 51" fill="none" stroke="#2b2d42" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Bánh nướng vàng óng ôm trước ngực -->
        <ellipse cx="60" cy="80" rx="26" ry="18" fill="#e07a5f" stroke="#9d0208" stroke-width="2"/>
        <ellipse cx="60" cy="78" rx="22" ry="15" fill="#f4a261"/>
        <!-- Hoa văn mặt bánh nướng -->
        <circle cx="60" cy="78" r="8" fill="#e76f51"/>
        <circle cx="60" cy="78" r="4" fill="#f4a261"/>
        <circle cx="50" cy="78" r="2.5" fill="#e76f51"/>
        <circle cx="70" cy="78" r="2.5" fill="#e76f51"/>
        <!-- Tay thỏ ôm bánh -->
        <circle cx="40" cy="74" r="5.5" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="80" cy="74" r="5.5" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <!-- Trái tim nhỏ bay -->
        <path d="M92 40 C92 36, 98 34, 100 38 C102 34, 108 36, 108 40 C108 46, 100 50, 100 52 C100 50, 92 46, 92 40 Z" fill="#ff4d6d"/>
      </svg>
    `,

    // 2. Vầng trăng chibi cười tươi vẫy tay
    2: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="45" fill="#fff3b0" stroke="#ffd166" stroke-width="3"/>
        <circle cx="60" cy="60" r="40" fill="#ffe66d"/>
        <!-- Vương miện sao -->
        <path d="M52 20 L56 26 L60 18 L64 26 L68 20 L66 28 L54 28 Z" fill="#ff9e00"/>
        <!-- Mắt cười nhắm hình trăng khuyết -->
        <path d="M44 56 Q50 62 56 56" fill="none" stroke="#6f4e37" stroke-width="3" stroke-linecap="round"/>
        <path d="M64 56 Q70 62 76 56" fill="none" stroke="#6f4e37" stroke-width="3" stroke-linecap="round"/>
        <!-- Má hồng rực -->
        <circle cx="39" cy="63" r="5" fill="#ff8fa3" opacity="0.8"/>
        <circle cx="81" cy="63" r="5" fill="#ff8fa3" opacity="0.8"/>
        <!-- Miệng cười mở to -->
        <path d="M54 66 Q60 74 66 66 Z" fill="#d90429"/>
        <!-- Bàn tay vẫy chào -->
        <ellipse cx="98" cy="46" rx="7" ry="5" fill="#ffe66d" stroke="#ffd166" stroke-width="2" transform="rotate(-30 98 46)"/>
        <!-- Sao lấp lánh -->
        <path d="M22 36 L24 41 L29 42 L25 46 L26 51 L21 48 L17 51 L18 46 L14 42 L19 41 Z" fill="#ffd166"/>
      </svg>
    `,

    // 3. Ấm trà ngọc & đĩa bánh nướng bốc khói hình tim
    3: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#e8f5e9" opacity="0.6"/>
        <!-- Khói trà hình trái tim -->
        <path d="M48 30 Q52 18 60 22 Q68 18 72 30 Q68 40 60 44 Q52 40 48 30 Z" fill="#81c784" opacity="0.75"/>
        <!-- Ấm trà gốm ngọc chibi -->
        <ellipse cx="50" cy="68" rx="22" ry="18" fill="#52b788" stroke="#2d6a4f" stroke-width="2"/>
        <ellipse cx="50" cy="54" rx="12" ry="5" fill="#40916c"/>
        <circle cx="50" cy="51" r="3.5" fill="#ffd166"/>
        <!-- Vòi ấm trà -->
        <path d="M30 65 Q22 62 25 54 Q30 56 32 60" fill="#52b788" stroke="#2d6a4f" stroke-width="2"/>
        <!-- Quai ấm -->
        <path d="M68 60 Q78 68 70 76" fill="none" stroke="#2d6a4f" stroke-width="3" stroke-linecap="round"/>
        <!-- Mặt cười trên ấm trà -->
        <circle cx="44" cy="66" r="2.5" fill="#1b4332"/>
        <circle cx="56" cy="66" r="2.5" fill="#1b4332"/>
        <path d="M48 70 Q50 73 52 70" fill="none" stroke="#1b4332" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Tách trà con bên cạnh -->
        <ellipse cx="86" cy="78" rx="12" ry="9" fill="#f4a261" stroke="#e76f51" stroke-width="1.8"/>
        <ellipse cx="86" cy="74" rx="10" ry="4" fill="#ffd166"/>
      </svg>
    `,

    // 4. Bé thỏ ngủ say sưa cuộn tròn trên đám mây
    4: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#edf2fb" opacity="0.6"/>
        <!-- Đám mây hồng êm ái -->
        <ellipse cx="60" cy="85" rx="38" ry="16" fill="#fbc4ab"/>
        <circle cx="40" cy="80" r="14" fill="#fbc4ab"/>
        <circle cx="80" cy="80" r="14" fill="#fbc4ab"/>
        <!-- Thỏ cuộn tròn ngủ -->
        <circle cx="58" cy="60" r="22" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <!-- Tai thỏ gối xuôi -->
        <ellipse cx="44" cy="46" rx="14" ry="6" fill="#ffffff" stroke="#ffccd5" stroke-width="1.8" transform="rotate(-15 44 46)"/>
        <ellipse cx="44" cy="46" rx="10" ry="3.5" fill="#ffb3c1" transform="rotate(-15 44 46)"/>
        <!-- Mắt ngủ nhắm nghiền -->
        <path d="M52 60 Q56 63 60 60" fill="none" stroke="#4a4e69" stroke-width="2" stroke-linecap="round"/>
        <!-- Má hồng ngủ say -->
        <circle cx="48" cy="64" r="3.5" fill="#ff8fa3" opacity="0.8"/>
        <!-- Bong bóng Zzz -->
        <text x="82" y="42" font-family="'Montserrat', sans-serif" font-weight="bold" font-size="14" fill="#7209b7">Z</text>
        <text x="92" y="32" font-family="'Montserrat', sans-serif" font-weight="bold" font-size="11" fill="#9d4edd">z</text>
        <text x="99" y="24" font-family="'Montserrat', sans-serif" font-weight="bold" font-size="8" fill="#c77dff">z</text>
      </svg>
    `,

    // 5. Thỏ giơ tay chữ V rạng rỡ lấp lánh
    5: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff9db" opacity="0.6"/>
        <!-- Tai thỏ vểnh cao -->
        <ellipse cx="44" cy="24" rx="6" ry="17" fill="#ffffff" stroke="#ffd166" stroke-width="2"/>
        <ellipse cx="44" cy="24" rx="3.5" ry="11" fill="#ffb3c1"/>
        <ellipse cx="76" cy="24" rx="6" ry="17" fill="#ffffff" stroke="#ffd166" stroke-width="2"/>
        <ellipse cx="76" cy="24" rx="3.5" ry="11" fill="#ffb3c1"/>
        <!-- Đầu thỏ -->
        <circle cx="60" cy="52" r="25" fill="#ffffff" stroke="#ffd166" stroke-width="2"/>
        <!-- 1 mắt nháy, 1 mắt sao tròn -->
        <path d="M46 51 Q51 47 56 51" fill="none" stroke="#2b2d42" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Mắt sao -->
        <path d="M68 47 L69 51 L73 52 L69 53 L68 57 L67 53 L63 52 L67 51 Z" fill="#ffb703"/>
        <!-- Má hồng rạng rỡ -->
        <circle cx="43" cy="57" r="4.5" fill="#ff758f" opacity="0.8"/>
        <circle cx="77" cy="57" r="4.5" fill="#ff758f" opacity="0.8"/>
        <!-- Miệng cười tươi -->
        <path d="M54 56 Q60 63 66 56" fill="none" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
        <!-- Tay giơ chữ V -->
        <path d="M82 66 L90 56 L86 68 L94 62 L86 74" fill="#ffffff" stroke="#ffd166" stroke-width="2" stroke-linejoin="round"/>
        <!-- Chùm tia sáng sao -->
        <circle cx="28" cy="38" r="3" fill="#ffd166"/>
        <circle cx="96" cy="36" r="3.5" fill="#ffd166"/>
      </svg>
    `,

    // 6. Hai chú thỏ ôm nhau thả tim tri kỷ
    6: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#ffe5ec" opacity="0.6"/>
        <!-- Trái tim to ở giữa trên đầu -->
        <path d="M52 24 C52 18, 58 16, 60 20 C62 16, 68 18, 68 24 C68 30, 60 35, 60 37 C60 35, 52 30, 52 24 Z" fill="#ff0a54"/>
        <!-- Thỏ trái -->
        <ellipse cx="40" cy="32" rx="5" ry="14" fill="#ffffff" stroke="#ffccd5" stroke-width="1.8" transform="rotate(-15 40 32)"/>
        <circle cx="45" cy="58" r="19" fill="#ffffff" stroke="#ffccd5" stroke-width="1.8"/>
        <path d="M38 56 Q42 59 46 56" fill="none" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
        <circle cx="36" cy="60" r="3" fill="#ff8fa3"/>
        <!-- Thỏ phải -->
        <ellipse cx="80" cy="32" rx="5" ry="14" fill="#fff0f3" stroke="#ffccd5" stroke-width="1.8" transform="rotate(15 80 32)"/>
        <circle cx="75" cy="58" r="19" fill="#fff0f3" stroke="#ffccd5" stroke-width="1.8"/>
        <path d="M74 56 Q78 59 82 56" fill="none" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
        <circle cx="84" cy="60" r="3" fill="#ff8fa3"/>
        <!-- Vòng ôm -->
        <ellipse cx="60" cy="74" rx="22" ry="14" fill="#ffffff" stroke="#ffccd5" stroke-width="1.8"/>
      </svg>
    `,

    // 7. Thỏ ăn bánh phồng má vui hết cỡ
    7: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff0f3" opacity="0.6"/>
        <!-- Tai thỏ lúc lắc -->
        <ellipse cx="40" cy="22" rx="6" ry="16" fill="#ffffff" stroke="#ffccd5" stroke-width="2" transform="rotate(-20 40 22)"/>
        <ellipse cx="78" cy="22" rx="6" ry="16" fill="#ffffff" stroke="#ffccd5" stroke-width="2" transform="rotate(20 78 22)"/>
        <!-- Đầu thỏ với hai má phúng phính phồng to -->
        <ellipse cx="60" cy="54" rx="28" ry="22" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <ellipse cx="38" cy="58" rx="8" ry="7" fill="#ff8fa3" opacity="0.85"/>
        <ellipse cx="82" cy="58" rx="8" ry="7" fill="#ff8fa3" opacity="0.85"/>
        <!-- Mắt tít lại vì ngon -->
        <path d="M46 50 Q50 46 54 50" fill="none" stroke="#2b2d42" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M66 50 Q70 46 74 50" fill="none" stroke="#2b2d42" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Miệng đầy bánh nướng -->
        <circle cx="60" cy="56" r="4.5" fill="#f4a261"/>
        <!-- Vụn bánh rơi lung linh -->
        <circle cx="56" cy="66" r="1.5" fill="#e76f51"/>
        <circle cx="64" cy="67" r="2" fill="#e76f51"/>
        <circle cx="60" cy="72" r="1.5" fill="#e76f51"/>
        <!-- Nốt nhạc vui tươi -->
        <path d="M22 42 L22 34 L28 32 L28 40" fill="none" stroke="#ff006e" stroke-width="2"/>
        <circle cx="20" cy="42" r="2.5" fill="#ff006e"/>
      </svg>
    `,

    // 8. Chú Cuội giơ ngón cái Like chúc sức khỏe
    8: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#f8edeb" opacity="0.6"/>
        <!-- Khăn quấn trán đỏ rực -->
        <ellipse cx="60" cy="38" rx="22" ry="7" fill="#d90429"/>
        <circle cx="38" cy="38" r="4" fill="#d90429"/>
        <!-- Mặt Chú Cuội bầu bĩnh -->
        <circle cx="60" cy="54" r="22" fill="#ffdfba" stroke="#e07a5f" stroke-width="1.8"/>
        <!-- Tóc mái ngắn -->
        <path d="M44 38 Q52 44 60 38 Q68 44 76 38" fill="#3d312a"/>
        <!-- Mắt cười tươi -->
        <ellipse cx="50" cy="52" rx="3" ry="4" fill="#2b2d42"/>
        <ellipse cx="70" cy="52" rx="3" ry="4" fill="#2b2d42"/>
        <!-- Má hồng rực khỏe mạnh -->
        <circle cx="43" cy="58" r="4" fill="#ff758f"/>
        <circle cx="77" cy="58" r="4" fill="#ff758f"/>
        <path d="M54 59 Q60 66 66 59 Z" fill="#d90429"/>
        <!-- Áo nâu & Bàn tay giơ ngón cái Like -->
        <path d="M40 76 Q60 84 80 76 L82 95 L38 95 Z" fill="#6c584c"/>
        <rect x="74" y="66" width="14" height="18" rx="7" fill="#ffdfba" stroke="#e07a5f" stroke-width="1.5"/>
        <circle cx="81" cy="63" r="4" fill="#ffdfba"/>
      </svg>
    `,

    // 9. Thỏ ngọc ôm lồng đèn trái tim ấm áp
    9: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff1e6" opacity="0.6"/>
        <ellipse cx="46" cy="24" rx="6" ry="16" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <ellipse cx="74" cy="24" rx="6" ry="16" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <circle cx="60" cy="50" r="24" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <!-- Mắt long lanh hình tim -->
        <path d="M48 46 C48 43, 51 42, 53 45 C55 42, 58 43, 58 46 C58 50, 53 53, 53 54 C53 53, 48 50, 48 46 Z" fill="#ff0054"/>
        <path d="M62 46 C62 43, 65 42, 67 45 C69 42, 72 43, 72 46 C72 50, 67 53, 67 54 C67 53, 62 50, 62 46 Z" fill="#ff0054"/>
        <circle cx="42" cy="54" r="3.5" fill="#ff758f"/>
        <circle cx="78" cy="54" r="3.5" fill="#ff758f"/>
        <!-- Lồng đèn trái tim phát sáng -->
        <path d="M50 72 C50 64, 58 62, 60 67 C62 62, 70 64, 70 72 C70 82, 60 88, 60 90 C60 88, 50 82, 50 72 Z" fill="#ff9e00" stroke="#d90429" stroke-width="2"/>
        <circle cx="60" cy="74" r="4" fill="#ffffff"/>
      </svg>
    `,

    // 10. Đèn hoa sen ngọc bích lung linh trên nước
    10: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#e0f2fe" opacity="0.6"/>
        <!-- Ngọn nến lung linh giữa sen -->
        <ellipse cx="60" cy="40" rx="4" ry="9" fill="#ff9e00"/>
        <ellipse cx="60" cy="41" rx="2" ry="5" fill="#ffffff"/>
        <!-- Cánh sen hồng xòe tròn -->
        <path d="M60 52 C52 44, 46 56, 60 70 C74 56, 68 44, 60 52 Z" fill="#ff758f"/>
        <path d="M42 60 C34 56, 32 68, 52 74 C46 68, 42 62, 42 60 Z" fill="#ff8fa3"/>
        <path d="M78 60 C86 56, 88 68, 68 74 C74 68, 78 62, 78 60 Z" fill="#ff8fa3"/>
        <path d="M32 68 C24 68, 26 78, 48 80 C38 76, 32 70, 32 68 Z" fill="#ffb3c1"/>
        <path d="M88 68 C96 68, 94 78, 72 80 C82 76, 88 70, 88 68 Z" fill="#ffb3c1"/>
        <!-- Sóng nước xanh biếc -->
        <ellipse cx="60" cy="85" rx="34" ry="6" fill="#38b000" opacity="0.75"/>
      </svg>
    `,

    // 11. Hộp quà thắt nơ & nụ cười rạng rỡ
    11: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff0f3" opacity="0.6"/>
        <!-- Nơ đỏ to trên hộp quà -->
        <ellipse cx="48" cy="38" rx="10" ry="7" fill="#d90429" transform="rotate(-25 48 38)"/>
        <ellipse cx="72" cy="38" rx="10" ry="7" fill="#d90429" transform="rotate(25 72 38)"/>
        <circle cx="60" cy="38" r="5" fill="#ffd166"/>
        <!-- Hộp quà màu vàng kem -->
        <rect x="36" y="46" width="48" height="44" rx="8" fill="#ffd166" stroke="#f48c06" stroke-width="2"/>
        <rect x="56" y="46" width="8" height="44" fill="#d90429"/>
        <rect x="36" y="64" width="48" height="8" fill="#d90429"/>
        <!-- Mặt cười trên hộp quà -->
        <circle cx="48" cy="56" r="2.5" fill="#2b2d42"/>
        <circle cx="72" cy="56" r="2.5" fill="#2b2d42"/>
        <path d="M57 76 Q60 80 63 76" fill="none" stroke="#2b2d42" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="44" cy="60" r="3" fill="#ff758f"/>
        <circle cx="76" cy="60" r="3" fill="#ff758f"/>
      </svg>
    `,

    // 12. Thỏ đeo tai nghe phi hành gia bay lên sao trời
    12: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#edf2fb" opacity="0.6"/>
        <!-- Mũ không gian tròn xoe -->
        <circle cx="60" cy="56" r="32" fill="#d7e3fc" stroke="#4361ee" stroke-width="2.5" opacity="0.7"/>
        <!-- Thỏ bên trong mũ -->
        <ellipse cx="50" cy="30" rx="5" ry="12" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <ellipse cx="70" cy="30" rx="5" ry="12" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="60" cy="56" r="20" fill="#ffffff"/>
        <circle cx="53" cy="54" r="3" fill="#2b2d42"/>
        <circle cx="67" cy="54" r="3" fill="#2b2d42"/>
        <path d="M57 60 Q60 63 63 60" fill="none" stroke="#2b2d42" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Sao băng lướt qua -->
        <path d="M18 25 L34 29 L22 36 Z" fill="#ffd166"/>
      </svg>
    `,

    // 13. Thỏ cười toe toét giơ kẹo hồ lô
    13: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fefae0" opacity="0.6"/>
        <ellipse cx="44" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <ellipse cx="76" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <circle cx="60" cy="52" r="24" fill="#ffffff" stroke="#ffccd5" stroke-width="2"/>
        <path d="M48 48 Q54 44 56 50" fill="none" stroke="#2b2d42" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M64 50 Q66 44 72 48" fill="none" stroke="#2b2d42" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="42" cy="56" r="4.5" fill="#ff758f"/>
        <circle cx="78" cy="56" r="4.5" fill="#ff758f"/>
        <path d="M53 56 Q60 66 67 56 Z" fill="#d90429"/>
        <!-- Xiên kẹo hồ lô đỏ bóng bẩy -->
        <line x1="88" y1="40" x2="88" y2="85" stroke="#9c6644" stroke-width="2.5"/>
        <circle cx="88" cy="46" r="6" fill="#d90429"/>
        <circle cx="88" cy="57" r="6" fill="#d90429"/>
        <circle cx="88" cy="68" r="6" fill="#d90429"/>
      </svg>
    `,

    // 14. Đèn ông sao 5 cánh tỏa sáng rực rỡ
    14: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#fff9db" opacity="0.6"/>
        <!-- Vòng tre tròn -->
        <circle cx="60" cy="58" r="28" fill="none" stroke="#ffd166" stroke-width="3"/>
        <!-- Ngôi sao 5 cánh truyền thống đỏ vàng -->
        <path d="M60 26 L68 46 L90 48 L73 63 L78 85 L60 73 L42 85 L47 63 L30 48 L52 46 Z" fill="#d90429" stroke="#ffd166" stroke-width="2.5"/>
        <!-- Mắt cười chibi trên ngôi sao -->
        <circle cx="55" cy="54" r="2.5" fill="#ffffff"/>
        <circle cx="65" cy="54" r="2.5" fill="#ffffff"/>
        <path d="M57 60 Q60 63 63 60" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="50" cy="58" r="2" fill="#ffd166"/>
        <circle cx="70" cy="58" r="2" fill="#ffd166"/>
        <!-- Tua rua đung đưa -->
        <rect x="58" y="86" width="4" height="18" fill="#ffd166"/>
      </svg>
    `,

    // 15. Gia đình thỏ sum vầy ngắm trăng
    15: `
      <svg viewBox="0 0 120 120" width="100%" height="100%" class="cute-sticker-svg">
        <circle cx="60" cy="60" r="54" fill="#faedcd" opacity="0.6"/>
        <!-- Thỏ bố -->
        <ellipse cx="36" cy="30" rx="5" ry="14" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="42" cy="54" r="16" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="38" cy="52" r="2" fill="#2b2d42"/>
        <circle cx="46" cy="52" r="2" fill="#2b2d42"/>
        <!-- Thỏ mẹ -->
        <ellipse cx="84" cy="30" rx="5" ry="14" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="78" cy="54" r="16" fill="#ffffff" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="74" cy="52" r="2" fill="#2b2d42"/>
        <circle cx="82" cy="52" r="2" fill="#2b2d42"/>
        <!-- Thỏ con ở giữa đội hoa -->
        <circle cx="60" cy="68" r="12" fill="#fff0f3" stroke="#ffccd5" stroke-width="1.5"/>
        <circle cx="56" cy="66" r="1.5" fill="#2b2d42"/>
        <circle cx="64" cy="66" r="1.5" fill="#2b2d42"/>
        <circle cx="53" cy="69" r="2" fill="#ff758f"/>
        <circle cx="67" cy="69" r="2" fill="#ff758f"/>
        <!-- Bông hoa nhỏ trên đầu bé -->
        <circle cx="60" cy="56" r="3" fill="#ff006e"/>
      </svg>
    `
  };

  return stickers[id] || stickers[1];
}

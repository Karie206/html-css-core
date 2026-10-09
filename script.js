/* =============================================
   CHỨC NĂNG: CHUYỂN TAB
   ============================================= */
function chuyenTab(idTab, phanTuTab) {
  // Ẩn tất cả panel
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
  // Bỏ active tất cả tab
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

  // Hiện panel tương ứng
  document.getElementById('panel-' + idTab).classList.add('active');

  // Xóa ô tìm kiếm khi chuyển tab
  document.getElementById('o-tim-kiem').value = '';

  // Đánh dấu tab đang chọn
  if (phanTuTab) phanTuTab.classList.add('active');
}


/* =============================================
   CHỨC NĂNG: TÌM KIẾM
   ============================================= */
function timKiem(tuKhoa) {
  const chuoi = tuKhoa.trim().toLowerCase();

  // Nếu ô rỗng thì quay về tab đang active
  if (!chuoi) {
    const tabDangChon = document.querySelector('.tab.active');
    if (tabDangChon) {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-search').classList.remove('active');
      const idTab = tabDangChon.getAttribute('onclick').match(/'(\w+)'/)[1];
      document.getElementById('panel-' + idTab).classList.add('active');
    }
    return;
  }

  // Lấy tất cả thẻ thuộc tính từ mọi panel (trừ panel search)
  const tatCaThe = document.querySelectorAll(
    '#panel-text .the-thuoc-tinh, #panel-box .the-thuoc-tinh, ' +
    '#panel-layout .the-thuoc-tinh, #panel-bg .the-thuoc-tinh, ' +
    '#panel-transform .the-thuoc-tinh, #panel-animation .the-thuoc-tinh, ' +
    '#panel-syntax .the-thuoc-tinh'
  );

  const ketQua = [];
  tatCaThe.forEach(the => {
    const ten    = the.querySelector('.ten-thuoc-tinh').textContent.toLowerCase();
    const giaTri = the.querySelector('.gia-tri-thuoc-tinh').textContent.toLowerCase();
    if (ten.includes(chuoi) || giaTri.includes(chuoi)) {
      ketQua.push(the.cloneNode(true));
    }
  });

  // Hiển thị kết quả
  const khungKetQua = document.getElementById('ket-qua-tim-kiem');
  khungKetQua.innerHTML = '';

  if (ketQua.length === 0) {
    khungKetQua.innerHTML =
      '<p style="color:var(--mau-chu-mo);font-size:14px;padding:8px 0;">Không tìm thấy thuộc tính nào.</p>';
  } else {
    ketQua.forEach(the => khungKetQua.appendChild(the));
  }

  // Hiện panel kết quả
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-search').classList.add('active');
}


/* =============================================
   CHỨC NĂNG: DEMO ANIMATION
   ============================================= */
function chayHieuUng(tenHieuUng, nhanHien) {
  const hopDemo = document.getElementById('hop-demo');

  // Reset animation
  hopDemo.style.animation = 'none';
  hopDemo.offsetHeight; // trigger reflow

  // Map tên sang keyframe thực tế
  const bangHieuUng = {
    'fade':   'hieu-ung-fade',
    'bounce': 'hieu-ung-bounce',
    'spin':   'hieu-ung-spin',
    'shake':  'hieu-ung-shake',
    'pulse':  'hieu-ung-pulse',
  };

  const bangThoiGian = {
    'spin':   '0.7s',
    'bounce': '0.8s',
    'pulse':  '0.6s',
  };

  const tenKeyframe = bangHieuUng[tenHieuUng];
  const thoiGian    = bangThoiGian[tenHieuUng] || '0.6s';

  hopDemo.style.animation = tenKeyframe + ' ' + thoiGian + ' ease forwards';
  hopDemo.textContent = nhanHien;
}


/* =============================================
   CHỨC NĂNG: HIỆU ỨNG HẠT (PARTICLE)
   ============================================= */
(function khaiDongHatBay() {
  const canvas = document.getElementById('canvas-hat');
  const ctx    = canvas.getContext('2d');

  let chieuRong, chieuCao, danhSachHat;
  let viTriChuot = { x: -9999, y: -9999 };

  const KHOANG_CANH_TAN = 120;  // px — bán kính tản hạt
  const LUC_TAN         = 3.5;  // độ mạnh khi tản
  const TOC_DO_TOI_DA   = 8;    // px/frame

  const BANG_MAU = [
    '#a78bfa', // tím
    '#60a5fa', // xanh dương
    '#34d399', // xanh lá
    '#f472b6', // hồng
    '#2dd4bf', // teal
    '#fb923c', // cam
    '#fbbf24', // vàng
  ];

  // Lắng nghe chuột
  window.addEventListener('mousemove', e => {
    viTriChuot.x = e.clientX;
    viTriChuot.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    viTriChuot.x = -9999;
    viTriChuot.y = -9999;
  });

  // Cập nhật kích thước canvas khi resize
  function capNhatKichThuoc() {
    chieuRong = canvas.width  = window.innerWidth;
    chieuCao  = canvas.height = window.innerHeight;
  }

  // Tạo danh sách hạt ngẫu nhiên
  function taoHat() {
    danhSachHat = [];
    const soLuong = Math.floor((chieuRong * chieuCao) / 10000);

    for (let i = 0; i < soLuong; i++) {
      const tocDoGocX = (Math.random() - 0.5) * 0.4;
      const tocDoGocY = (Math.random() - 0.5) * 0.4;

      danhSachHat.push({
        x:         Math.random() * chieuRong,
        y:         Math.random() * chieuCao,
        banKinh:   Math.random() * 2.5 + 1,
        mau:       BANG_MAU[Math.floor(Math.random() * BANG_MAU.length)],
        vx:        tocDoGocX,
        vy:        tocDoGocY,
        tocDoGocX, // tốc độ ban đầu — dùng để kéo hạt về
        tocDoGocY,
        doMo:      Math.random() * 0.5 + 0.2,
      });
    }
  }

  // Vòng lặp render mỗi frame
  function veFrame() {
    ctx.clearRect(0, 0, chieuRong, chieuCao);

    for (const hat of danhSachHat) {
      // Tính khoảng cách từ hạt đến chuột
      const dx   = hat.x - viTriChuot.x;
      const dy   = hat.y - viTriChuot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < KHOANG_CANH_TAN && dist > 0) {
        // Tản hạt ra xa chuột
        const luc   = (KHOANG_CANH_TAN - dist) / KHOANG_CANH_TAN;
        const goc   = Math.atan2(dy, dx);
        hat.vx += Math.cos(goc) * luc * LUC_TAN;
        hat.vy += Math.sin(goc) * luc * LUC_TAN;
      }

      // Kéo hạt dần về tốc độ gốc (damping)
      hat.vx += (hat.tocDoGocX - hat.vx) * 0.05;
      hat.vy += (hat.tocDoGocY - hat.vy) * 0.05;

      // Giới hạn tốc độ tối đa
      const tocDo = Math.sqrt(hat.vx * hat.vx + hat.vy * hat.vy);
      if (tocDo > TOC_DO_TOI_DA) {
        hat.vx = (hat.vx / tocDo) * TOC_DO_TOI_DA;
        hat.vy = (hat.vy / tocDo) * TOC_DO_TOI_DA;
      }

      // Cập nhật vị trí
      hat.x += hat.vx;
      hat.y += hat.vy;

      // Wrap quanh màn hình
      if (hat.x < -10) hat.x = chieuRong + 10;
      if (hat.x > chieuRong + 10) hat.x = -10;
      if (hat.y < -10) hat.y = chieuCao + 10;
      if (hat.y > chieuCao + 10) hat.y = -10;

      // Vẽ hạt
      ctx.beginPath();
      ctx.arc(hat.x, hat.y, hat.banKinh, 0, Math.PI * 2);
      ctx.fillStyle    = hat.mau;
      ctx.globalAlpha  = hat.doMo;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(veFrame);
  }

  // Khởi động
  window.addEventListener('resize', () => {
    capNhatKichThuoc();
    taoHat();
  });

  capNhatKichThuoc();
  taoHat();
  veFrame();
})();

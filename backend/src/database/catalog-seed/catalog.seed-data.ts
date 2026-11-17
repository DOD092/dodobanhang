// Dữ liệu thật do chủ dự án cung cấp, chuyển nguyên văn từ frontend
// (frontend/src/features/{product,category}/*Data.ts trước khi nối API).
// Thứ tự trong mảng = thứ tự hiển thị: seeder đặt created_at tăng dần theo mảng,
// trang "Mới nhất" sắp created_at giảm dần nên phần tử CUỐI hiện ĐẦU (giống frontend cũ).
// Ảnh là đường dẫn tĩnh của frontend (frontend/public/images/...), không phải /uploads.

export interface SeedCategory {
  slug: string;
  name: string;
  description: string;
}

export interface SeedProduct {
  sku: string;
  name: string;
  description: string;
  images: string[];
  price: number | null; // null = "Liên hệ"
  category: string; // slug của SeedCategory
}

export const DEFAULT_BRAND = {
  slug: 'chua-phan-loai',
  name: 'Chưa phân loại',
  description:
    'Brand mặc định cho sản phẩm chưa gán thương hiệu (brand_id là NOT NULL).',
};

export const seedCategories: SeedCategory[] = [
  {
    slug: 'co-khi-phu-kien',
    name: 'Cơ khí & phụ kiện',
    description: 'Vòng bi, vít, tay cầm và phụ kiện cơ khí.',
  },
  {
    slug: 'vat-lieu-nhom',
    name: 'Vật liệu nhôm',
    description: 'Tấm nhôm và hợp kim nhôm công nghiệp.',
  },
  {
    slug: 'thiet-bi-nong-nghiep',
    name: 'Thiết bị nông nghiệp',
    description: 'Máy bay nông nghiệp và thiết bị canh tác.',
  },
  {
    slug: 'nang-luong-mat-troi',
    name: 'Năng lượng mặt trời',
    description: 'Tấm pin và đèn năng lượng mặt trời.',
  },
  {
    slug: 'den-led-chieu-sang',
    name: 'Đèn LED chiếu sáng',
    description: 'Đèn LED cho văn phòng, nhà xưởng và ngoài trời.',
  },
];

export const seedProducts: SeedProduct[] = [
  // Cơ khí & phụ kiện (co-khi-phu-kien)
  {
    sku: 'NSK 684ZZ',
    name: 'Vòng bi NSK 684ZZ',
    description:
      'Đường lăn của ổ bi rãnh sâu bao gồm các rãnh sâu hình vòng cung cho cả vòng trong và vòng ngoài, hỗ trợ tải trọng hướng tâm, tải trọng hướng trục theo cả hai hướng và tải trọng tổng hợp, đồng thời cũng là thiết bị lý tưởng cho các ứng dụng quay tốc độ cao.',
    images: ['/images/products/vong-bi-nsk-684zz.jpg'],
    price: null,
    category: 'co-khi-phu-kien',
  },
  {
    sku: 'C-NUWANS10-100-27',
    name: 'Tay cầm thanh tròn',
    description:
      'Tay cầm thanh tròn được thiết kế giúp đóng mở cửa thuận tiện, với nhiều kích thước và chất liệu phù hợp cho các nhu cầu sử dụng khác nhau. Sản phẩm có thiết kế ren nữ, hỗ trợ các cỡ bu lông M5, M6 và M8. Với mức giá hợp lý cùng độ bền cao, tay cầm phù hợp cho nhiều loại cửa và thiết bị công nghiệp.',
    images: ['/images/products/tay-cam-thanh-tron.jpg'],
    price: null,
    category: 'co-khi-phu-kien',
  },
  {
    sku: 'Vít JIS B1111T',
    name: 'Vít pake đầu dù JIS B1111T',
    description:
      'Vít Pake Đầu Dù Tiêu Chuẩn JIS B1111T nổi bật với thiết kế đầu dù lớn giúp phân bổ lực siết đều, bảo vệ bề mặt vật liệu mỏng không bị biến dạng và chống trượt tối đa khi thi công. Sản phẩm sở hữu bước ren máy sắc nét, cho khả năng liên kết chắc chắn, chịu lực tốt và tính thẩm mỹ cao. Đây là lựa chọn lý tưởng cho các ứng dụng lắp ráp tủ điện, thiết bị điện tử, khung nhôm kính và cơ khí chế tạo đòi hỏi sự bền bỉ theo thời gian.',
    images: ['/images/products/vit-jis-b1111t.jpg'],
    price: null,
    category: 'co-khi-phu-kien',
  },

  // Vật liệu nhôm (vat-lieu-nhom)
  {
    sku: 'Tấm nhôm_A6061_VNM',
    name: 'Tấm nhôm hợp kim A6061',
    description:
      'Hợp kim nhôm A6061 được tạo thành từ nhôm, magiê và silic. Vật liệu này có độ bền trung bình, khả năng chống ăn mòn tốt, đồng thời có thể hàn hoặc xử lý bề mặt bằng phương pháp anod hóa. Nó phù hợp cho các ứng dụng chịu tải từ mức trung bình đến cao. Đây cũng là lựa chọn lý tưởng cho các ứng dụng đòi hỏi sự kết hợp giữa tỷ lệ độ bền trên trọng lượng tốt, chất lượng bề mặt hoàn thiện và khả năng chống ăn mòn.',
    images: ['/images/products/tam-nhom-a6061.jpg'],
    price: null,
    category: 'vat-lieu-nhom',
  },

  // Thiết bị nông nghiệp (thiet-bi-nong-nghiep)
  {
    sku: 'DJI T100',
    name: 'Máy bay nông nghiệp DJI Agras T100',
    description:
      'DJI AGRAS T100 là máy bay nông nghiệp chuyên dụng, hỗ trợ hiệu quả các công việc phun, rải và vận chuyển trong sản xuất nông nghiệp. Sở hữu bình phun 100L, bình rải 150L và khả năng nâng tải đến 100kg, T100 đáp ứng tốt nhu cầu canh tác quy mô lớn.',
    images: ['/images/products/dji-agras-t100.jpg'],
    price: null,
    category: 'thiet-bi-nong-nghiep',
  },

  // Năng lượng mặt trời (nang-luong-mat-troi)
  {
    sku: 'AE_Solar_550',
    name: 'Tấm pin năng lượng mặt trời AE Solar 550Wp',
    description:
      'Tấm pin AE Solar 550 Wp là tấm pin năng lượng mặt trời đơn tinh thể PERC Half Cell 144 cell, có công suất 550 Wp và hiệu suất lên đến 21,3%. Sản phẩm được thiết kế với công nghệ giảm điểm nóng, giúp tăng độ an toàn và duy trì hiệu suất ổn định trong quá trình sử dụng. Tấm pin có kích thước 2278 × 1133 × 35 mm, bảo hành sản phẩm 12 năm và bảo đảm hiệu suất trong 30 năm.',
    images: ['/images/products/tam-pin-ae-solar-550.jpg'],
    price: null,
    category: 'nang-luong-mat-troi',
  },
  {
    sku: '300W BC300',
    name: 'Đèn năng lượng mặt trời 300W BC300',
    description:
      'Đèn Năng Lượng Mặt Trời 300W BC300 là giải pháp chiếu sáng ngoài trời sử dụng năng lượng mặt trời, phù hợp cho sân vườn, đường đi, khuôn viên và nhiều không gian khác. Đèn sở hữu pin dung lượng 42.000 mAh, vỏ nhôm tản nhiệt cao cấp và thời gian chiếu sáng từ 12–15 giờ. Sản phẩm phù hợp lắp đặt ở độ cao 3–6 m, mang lại khả năng chiếu sáng ổn định và tiết kiệm điện năng.',
    images: ['/images/products/den-nlmt-300w-bc300.jpg'],
    price: null,
    category: 'nang-luong-mat-troi',
  },

  // Đèn LED chiếu sáng (den-led-chieu-sang)
  {
    sku: 'SLLTU-9',
    name: 'Đèn LED thanh SLLTU-9',
    description:
      'Đèn LED thanh là giải pháp chiếu sáng hiện đại, nổi bật với khả năng tiết kiệm điện và tuổi thọ cao so với các loại đèn truyền thống. Sản phẩm cho ánh sáng ổn định, có thể điều chỉnh cường độ và màu sắc tùy nhu cầu sử dụng. Với thiết kế tiện dụng, không chứa thủy ngân và ít tốn chi phí bảo trì, đèn phù hợp cho nhiều không gian và ứng dụng chiếu sáng khác nhau.',
    images: ['/images/products/den-led-thanh-sltu-9.jpg'],
    price: null,
    category: 'den-led-chieu-sang',
  },
  {
    sku: 'Ledmang_1m2',
    name: 'Đèn thả máng LED 1m2',
    description:
      'Đèn thả máng LED 1m2 sở hữu thiết kế dạng thanh hộp dài, tối giản, phù hợp với nhiều không gian như văn phòng, bàn làm việc và khu vực hiện đại. Với kích thước gọn 1200 × 70 × 40 mm, đèn dễ lắp đặt bằng dây cáp mà không cần thi công trần phức tạp. Sản phẩm có chi phí đầu tư hợp lý, phù hợp cho cả nhu cầu lắp đặt đơn lẻ và số lượng lớn.',
    images: ['/images/products/den-tha-mang-led-1m2.jpg'],
    price: null,
    category: 'den-led-chieu-sang',
  },
  {
    sku: 'PLR572Z',
    name: 'Con chạy dầm KITO 1 tấn',
    description:
      'Bộ con chạy dầm KITO 1 tấn có kết cấu chắc chắn, kết hợp cơ cấu kẹp và bánh xe di chuyển trên dầm, cho phép nâng hạ và di chuyển hàng hóa linh hoạt. Thiết bị phù hợp với dầm I, dầm H và các hệ thống dầm nâng hạ trong nhà xưởng, gara và kho hàng.',
    images: [
      '/images/products/con-chay-dam-kito-1t-1.jpg',
      '/images/products/con-chay-dam-kito-1t-2.jpg',
      '/images/products/con-chay-dam-kito-1t-3.jpg',
    ],
    price: null,
    category: 'co-khi-phu-kien',
  },
  {
    sku: 'RDL69ZT',
    name: 'Thanh ray đục lỗ',
    description:
      'Thanh ray/thanh thép đục lỗ được sử dụng để lắp đặt, cố định và liên kết các thiết bị trong hệ thống điện công nghiệp. Thiết kế nhiều lỗ liên tục giúp dễ bắt vít, lắp ráp và điều chỉnh vị trí. Sản phẩm có kết cấu chắc chắn, dễ gia công, phù hợp cho tủ điện, giá đỡ và khung kết cấu.',
    images: [
      '/images/products/thanh-ray-duc-lo-1.jpg',
      '/images/products/thanh-ray-duc-lo-2.jpg',
    ],
    price: null,
    category: 'co-khi-phu-kien',
  },
  {
    sku: 'LiOA509Z',
    name: 'Đèn bàn LiOA',
    description:
      'Đèn bàn LiOA sử dụng công nghệ LED 7W, cung cấp ánh sáng trắng hoặc 3 chế độ màu linh hoạt. Thiết kế khớp quay dễ điều chỉnh góc chiếu sáng, tích hợp 2 ổ cắm đa năng hoặc hộp đựng bút và cổng sạc USB, mang đến sự tiện lợi cho học tập và làm việc.',
    images: ['/images/products/den-ban-lioa.jpg'],
    price: null,
    category: 'den-led-chieu-sang',
  },
  {
    sku: 'Duhal561Z',
    name: 'Đèn LED âm trần Duhal KDMT0091',
    description:
      'Đèn LED âm trần Duhal KDMT0091 công suất 9W sở hữu chip LED cao cấp, tiết kiệm điện và cung cấp 3 chế độ màu ánh sáng linh hoạt. Đèn có chỉ số hoàn màu CRI 85, tuổi thọ lên đến 50.000 giờ, tích hợp bộ nguồn bên trong và thiết kế tai lò xo giúp lắp đặt dễ dàng, phù hợp với nhà ở, văn phòng, nhà hàng và khách sạn.',
    images: ['/images/products/den-led-am-tran-duhal.jpg'],
    price: null,
    category: 'den-led-chieu-sang',
  },
];

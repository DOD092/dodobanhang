import type { Service } from '@/types/Service'

// 2 dịch vụ hiện có, nội dung do chủ dự án cung cấp (file s1.pdf, s2.pdf).
// Thêm/xóa dịch vụ chỉ cần sửa mảng này: giao diện (trang chủ, /services) tự co giãn theo số lượng.
// Icon gán theo id trong components/service/serviceIcons.ts (id chưa có icon dùng icon mặc định).
// `content` là thân bài trang chi tiết dạng khối (types/ContentBlock.ts). Tiêu đề chính (h1) là `name`
// và đoạn kêu gọi liên hệ cuối bài là ContactCta của trang nên không nằm trong `content`.
// Ảnh nằm trong public/images/services/. Ảnh có chú thích "Nguồn: Internet" cần kiểm tra bản quyền
// trước khi dùng thật.
export const services: Service[] = [
  {
    id: 1,
    name: 'Tư vấn thiết bị công nghiệp',
    description: 'Giải pháp lựa chọn thiết bị phù hợp với nhu cầu, môi trường và chi phí đầu tư.',
    image_url: '/images/services/kho-hang.jpg',
    details: [
      'Tư vấn thiết bị theo mục đích sử dụng, môi trường làm việc và tần suất vận hành.',
      'Tư vấn thông số kỹ thuật: công suất, kích thước, điện áp, vật liệu, tải trọng.',
      'So sánh các dòng thiết bị về tính năng, chất liệu, khả năng sử dụng và chi phí đầu tư.',
      'Hướng dẫn sử dụng và bảo quản để thiết bị hoạt động ổn định, bền lâu.',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Trong quá trình sản xuất, kinh doanh và vận hành, việc lựa chọn thiết bị công nghiệp phù hợp đóng vai trò quan trọng trong hiệu quả công việc, độ bền và chi phí đầu tư. Tuy nhiên, với sự đa dạng về chủng loại, thông số kỹ thuật và thương hiệu trên thị trường, việc tìm được sản phẩm phù hợp với nhu cầu thực tế không phải lúc nào cũng đơn giản.',
      },
      {
        type: 'paragraph',
        text: 'Với mong muốn cung cấp thêm thông tin hữu ích cho khách hàng, dodobanhang xây dựng chuyên mục Tư vấn thiết bị, tổng hợp các kiến thức và thông tin cần thiết giúp khách hàng dễ dàng tìm hiểu, lựa chọn và sử dụng thiết bị phù hợp.',
      },

      { type: 'heading', level: 2, text: 'Tư vấn thiết bị theo nhu cầu sử dụng' },
      {
        type: 'paragraph',
        text: 'Mỗi ngành nghề và mỗi công việc đều có những yêu cầu riêng về thiết bị. Vì vậy, thay vì chỉ lựa chọn dựa trên giá thành hoặc thông số, khách hàng nên cân nhắc đến mục đích sử dụng, môi trường làm việc, tần suất vận hành và khả năng đáp ứng lâu dài.',
      },
      {
        type: 'paragraph',
        text: 'Tại chuyên mục Tư vấn thiết bị, dodobanhang chia sẻ các thông tin xoay quanh nhiều nhóm sản phẩm như:',
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'Thiết bị và máy móc công nghiệp',
          'Thiết bị điện và chiếu sáng',
          'Thiết bị phục vụ sản xuất',
          'Dụng cụ và vật tư công nghiệp',
          'Thiết bị nông nghiệp',
          'Thiết bị năng lượng',
          'Các sản phẩm và phụ kiện phục vụ nhà xưởng, cửa hàng và công trình',
        ],
      },

      { type: 'heading', level: 2, text: 'Cách lựa chọn thiết bị phù hợp' },
      { type: 'heading', level: 3, text: '1. Xác định mục đích sử dụng' },
      {
        type: 'paragraph',
        text: 'Trước khi lựa chọn, cần xác định rõ thiết bị được sử dụng cho công việc nào, ở đâu và với tần suất bao nhiêu. Một thiết bị phù hợp với văn phòng có thể không đáp ứng được yêu cầu trong nhà xưởng hoặc môi trường sản xuất.',
      },
      {
        type: 'paragraph',
        text: 'Việc xác định đúng nhu cầu ngay từ đầu giúp hạn chế tình trạng mua thiết bị không phù hợp hoặc đầu tư vượt quá nhu cầu thực tế.',
      },
      { type: 'heading', level: 3, text: '2. Quan tâm đến thông số kỹ thuật' },
      {
        type: 'paragraph',
        text: 'Các thông số như công suất, kích thước, điện áp, vật liệu, tải trọng, hiệu suất và khả năng vận hành là những yếu tố cần được xem xét khi lựa chọn thiết bị.',
      },
      {
        type: 'paragraph',
        text: 'Không nên chỉ nhìn vào một thông số riêng lẻ mà cần đánh giá tổng thể khả năng đáp ứng của sản phẩm đối với công việc thực tế.',
      },
      { type: 'heading', level: 3, text: '3. Cân nhắc chất lượng và độ bền' },
      {
        type: 'paragraph',
        text: 'Thiết bị được sử dụng thường xuyên cần có độ bền phù hợp với môi trường làm việc. Vật liệu cấu tạo, linh kiện, khả năng tản nhiệt, mức độ bảo vệ và điều kiện vận hành đều có thể ảnh hưởng đến tuổi thọ của sản phẩm.',
      },
      {
        type: 'paragraph',
        text: 'Đặc biệt với các thiết bị sử dụng trong nhà xưởng hoặc môi trường có cường độ làm việc cao, yếu tố độ bền nên được đặt lên hàng đầu.',
      },
      { type: 'heading', level: 3, text: '4. Tính toán chi phí đầu tư' },
      {
        type: 'paragraph',
        text: 'Giá mua ban đầu không phải là yếu tố duy nhất quyết định chi phí của một thiết bị. Người dùng cũng nên cân nhắc chi phí vận hành, bảo trì, sửa chữa, thay thế linh kiện và tuổi thọ sản phẩm.',
      },
      {
        type: 'paragraph',
        text: 'Một thiết bị có mức đầu tư ban đầu phù hợp nhưng hoạt động ổn định và ít phát sinh chi phí có thể mang lại hiệu quả sử dụng lâu dài hơn.',
      },

      { type: 'heading', level: 2, text: 'Những nội dung tư vấn thiết bị bạn có thể tìm thấy' },
      {
        type: 'paragraph',
        text: 'Chuyên mục được xây dựng theo hướng dễ hiểu và thực tế, tập trung vào những vấn đề khách hàng thường quan tâm trước khi lựa chọn sản phẩm.',
      },
      {
        type: 'image',
        src: '/images/services/kho-hang.jpg',
        alt: 'Kho hàng với kệ hàng và pallet xếp gọn gàng',
        width: 941,
        height: 720,
        caption: 'Kho hàng - Nguồn: dodobanhang',
      },
      { type: 'heading', level: 3, text: 'So sánh thiết bị' },
      {
        type: 'paragraph',
        text: 'Phân tích sự khác nhau giữa các dòng sản phẩm dựa trên:',
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'Công suất',
          'Tính năng',
          'Kích thước',
          'Chất liệu',
          'Khả năng sử dụng',
          'Chi phí đầu tư',
        ],
      },
      { type: 'heading', level: 3, text: 'Hướng dẫn lựa chọn' },
      {
        type: 'paragraph',
        text: 'Các bài viết giúp khách hàng xác định loại thiết bị phù hợp dựa trên nhu cầu, không gian và điều kiện sử dụng.',
      },
      { type: 'heading', level: 3, text: 'Kiến thức sản phẩm' },
      {
        type: 'paragraph',
        text: 'Giải thích các thông số, công nghệ và đặc điểm thường gặp trên thiết bị công nghiệp để khách hàng có thêm cơ sở khi lựa chọn.',
      },
      { type: 'heading', level: 3, text: 'Hướng dẫn sử dụng và bảo quản' },
      {
        type: 'paragraph',
        text: 'Cung cấp những lưu ý trong quá trình lắp đặt, vận hành và bảo quản nhằm giúp thiết bị hoạt động ổn định và kéo dài tuổi thọ.',
      },
      { type: 'heading', level: 3, text: 'Cập nhật xu hướng thiết bị' },
      {
        type: 'paragraph',
        text: 'Giới thiệu những công nghệ, sản phẩm và giải pháp mới có thể được ứng dụng trong sản xuất, kinh doanh và đời sống.',
      },

      {
        type: 'heading',
        level: 2,
        text: 'dodobanhang – Đồng hành cùng khách hàng trong lựa chọn thiết bị',
      },
      {
        type: 'image',
        src: '/images/services/van-chuyen-noi-thanh.jpg',
        alt: 'Nhân viên chuyển các thùng hàng từ xe đẩy lên xe bán tải',
        width: 923,
        height: 584,
        caption: 'Vận chuyển nội thành - Nguồn: dodobanhang',
      },
      {
        type: 'paragraph',
        text: 'Với dodobanhang, việc cung cấp thiết bị không chỉ dừng lại ở một sản phẩm. Chúng tôi mong muốn hiểu rõ nhu cầu của khách hàng để cùng tìm ra giải pháp phù hợp với công việc, ngân sách và điều kiện sử dụng thực tế.',
      },
      {
        type: 'paragraph',
        text: 'Thông qua chuyên mục Tư vấn thiết bị, dodobanhang hy vọng mang đến những thông tin đơn giản, dễ hiểu và có tính ứng dụng, giúp khách hàng có thêm cơ sở trước khi đưa ra quyết định.',
      },
    ],
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: 'Hỗ trợ thi công – lắp đặt thiết bị',
    description:
      'Đồng hành cùng khách hàng từ khâu chuẩn bị đến khi thiết bị được đưa vào sử dụng.',
    image_url: '/images/services/tho-dien-lap-dat.jpg',
    details: [
      'Lắp đặt thiết bị và máy móc; hệ thống chiếu sáng; thiết bị điện.',
      'Lắp đặt thiết bị phục vụ sản xuất, cho nhà xưởng, cửa hàng và công trình.',
      'Kiểm tra và hướng dẫn vận hành thiết bị.',
      'Hỗ trợ xử lý các vấn đề phát sinh trong quá trình lắp đặt.',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Việc lựa chọn đúng thiết bị là bước đầu tiên, nhưng để thiết bị hoạt động ổn định và đạt hiệu quả sử dụng, quá trình thi công và lắp đặt cũng đóng vai trò quan trọng. Hiểu được điều đó, dodobanhang cung cấp dịch vụ hỗ trợ thi công – lắp đặt, đồng hành cùng khách hàng từ khâu chuẩn bị đến khi thiết bị được đưa vào sử dụng.',
      },
      {
        type: 'paragraph',
        text: 'Với mỗi công trình và nhu cầu khác nhau, chúng tôi chú trọng tìm hiểu điều kiện thực tế để đưa ra phương án lắp đặt phù hợp, đảm bảo tính thuận tiện, an toàn và hiệu quả trong quá trình vận hành.',
      },

      { type: 'heading', level: 2, text: 'Hỗ trợ thi công, lắp đặt thiết bị theo nhu cầu' },
      {
        type: 'paragraph',
        text: 'Mỗi thiết bị có đặc điểm kỹ thuật và yêu cầu lắp đặt riêng. Vì vậy, việc thi công cần được thực hiện phù hợp với không gian, vị trí lắp đặt, nguồn điện, điều kiện vận hành và mục đích sử dụng.',
      },
      {
        type: 'paragraph',
        text: 'dodobanhang hỗ trợ khách hàng trong các công việc liên quan đến:',
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'Lắp đặt thiết bị và máy móc',
          'Lắp đặt hệ thống chiếu sáng',
          'Lắp đặt thiết bị điện',
          'Lắp đặt thiết bị phục vụ sản xuất',
          'Lắp đặt thiết bị cho nhà xưởng, cửa hàng và công trình',
          'Kiểm tra và hướng dẫn vận hành thiết bị',
          'Hỗ trợ xử lý các vấn đề phát sinh trong quá trình lắp đặt',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tùy thuộc vào từng sản phẩm và phạm vi công việc, đội ngũ kỹ thuật sẽ tư vấn phương án thực hiện phù hợp.',
      },
      {
        type: 'image',
        src: '/images/services/tho-dien-lap-dat.jpg',
        alt: 'Kỹ thuật viên cuộn dây điện và cầm kìm cắt dây trước hộp dụng cụ',
        width: 938,
        height: 567,
        caption: 'Nguồn: Internet',
      },

      { type: 'heading', level: 2, text: 'Quy trình hỗ trợ thi công – lắp đặt' },
      { type: 'heading', level: 3, text: '1. Tiếp nhận nhu cầu' },
      {
        type: 'paragraph',
        text: 'Trước khi triển khai, dodobanhang tìm hiểu nhu cầu sử dụng, loại thiết bị, số lượng và điều kiện thực tế của công trình.',
      },
      {
        type: 'paragraph',
        text: 'Khách hàng có thể cung cấp thông tin, hình ảnh hoặc bản vẽ liên quan để việc tư vấn được chính xác hơn.',
      },
      { type: 'heading', level: 3, text: '2. Khảo sát và tư vấn phương án' },
      {
        type: 'paragraph',
        text: 'Dựa trên thông tin thực tế, chúng tôi tư vấn vị trí, phương án và các yêu cầu cần chuẩn bị trước khi lắp đặt.',
      },
      {
        type: 'paragraph',
        text: 'Đối với những công trình có yêu cầu cụ thể, việc khảo sát thực tế sẽ giúp hạn chế những vấn đề phát sinh trong quá trình thi công.',
      },
      { type: 'heading', level: 3, text: '3. Chuẩn bị thiết bị và vật tư' },
      {
        type: 'paragraph',
        text: 'Thiết bị, phụ kiện và các vật tư cần thiết được kiểm tra trước khi tiến hành lắp đặt, đảm bảo đúng chủng loại và phù hợp với phương án đã thống nhất.',
      },
      { type: 'heading', level: 3, text: '4. Tiến hành lắp đặt' },
      {
        type: 'paragraph',
        text: 'Quá trình lắp đặt được thực hiện theo đặc điểm kỹ thuật của từng thiết bị, chú trọng đến vị trí, kết nối và độ chắc chắn trong quá trình sử dụng.',
      },
      { type: 'heading', level: 3, text: '5. Kiểm tra và bàn giao' },
      {
        type: 'paragraph',
        text: 'Sau khi hoàn thành, thiết bị được kiểm tra khả năng hoạt động và các yếu tố liên quan trước khi đưa vào sử dụng.',
      },
      {
        type: 'paragraph',
        text: 'Khách hàng cũng được hướng dẫn những thông tin cần thiết để vận hành và bảo quản thiết bị đúng cách.',
      },

      { type: 'heading', level: 2, text: 'Hỗ trợ lắp đặt đa dạng thiết bị' },
      {
        type: 'paragraph',
        text: 'dodobanhang cung cấp và hỗ trợ lắp đặt nhiều nhóm thiết bị khác nhau tùy theo nhu cầu của khách hàng, chẳng hạn:',
      },
      { type: 'heading', level: 3, text: 'Thiết bị chiếu sáng' },
      {
        type: 'paragraph',
        text: 'Hỗ trợ lắp đặt các loại đèn LED, đèn nhà xưởng, đèn rọi ray, đèn thả, đèn năng lượng mặt trời và các thiết bị chiếu sáng khác.',
      },
      { type: 'heading', level: 3, text: 'Thiết bị điện' },
      {
        type: 'paragraph',
        text: 'Hỗ trợ lắp đặt và kết nối các thiết bị điện phù hợp với hệ thống đang sử dụng.',
      },
      { type: 'heading', level: 3, text: 'Máy móc và thiết bị công nghiệp' },
      {
        type: 'paragraph',
        text: 'Tư vấn vị trí, điều kiện lắp đặt và hỗ trợ đưa máy móc, thiết bị vào vận hành theo yêu cầu kỹ thuật của sản phẩm.',
      },
      { type: 'heading', level: 3, text: 'Thiết bị phục vụ sản xuất' },
      {
        type: 'paragraph',
        text: 'Các thiết bị, máy móc và dụng cụ phục vụ hoạt động sản xuất, kinh doanh và vận hành nhà xưởng.',
      },
      {
        type: 'image',
        src: '/images/services/khao-sat-thi-cong.jpg',
        alt: 'Kỹ sư đội mũ bảo hộ dùng máy đo đạc khảo sát trong nhà xưởng',
        width: 941,
        height: 600,
        caption: 'An toàn thi công - Nguồn: Internet',
      },

      { type: 'heading', level: 2, text: 'Vì sao nên chuẩn bị kỹ trước khi lắp đặt thiết bị?' },
      {
        type: 'paragraph',
        text: 'Một thiết bị tốt vẫn có thể hoạt động không hiệu quả nếu được lắp đặt ở vị trí không phù hợp hoặc không đáp ứng đúng yêu cầu kỹ thuật.',
      },
      { type: 'paragraph', text: 'Việc chuẩn bị trước khi thi công giúp:' },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'Hạn chế sai sót trong quá trình lắp đặt',
          'Đảm bảo thiết bị được bố trí phù hợp',
          'Thuận tiện cho quá trình vận hành và bảo trì',
          'Tối ưu không gian sử dụng',
          'Hạn chế các chi phí phát sinh không cần thiết',
          'Góp phần duy trì độ bền và hiệu quả hoạt động của thiết bị',
        ],
      },
      {
        type: 'paragraph',
        text: 'Đặc biệt với các công trình lắp đặt số lượng lớn, việc thống nhất phương án ngay từ đầu sẽ giúp quá trình triển khai thuận lợi và đồng bộ hơn.',
      },

      { type: 'heading', level: 2, text: 'Đồng hành cùng khách hàng trong quá trình triển khai' },
      {
        type: 'paragraph',
        text: 'Với dodobanhang, việc cung cấp thiết bị không chỉ dừng lại ở khâu giao sản phẩm. Chúng tôi mong muốn đồng hành cùng khách hàng trong quá trình lựa chọn, thi công, lắp đặt và đưa thiết bị vào sử dụng.',
      },
      {
        type: 'paragraph',
        text: 'Từ những nhu cầu nhỏ đến các đơn hàng số lượng lớn, chúng tôi luôn cố gắng tìm hiểu điều kiện thực tế để đưa ra phương án phù hợp, rõ ràng và thuận tiện cho khách hàng.',
      },
    ],
    sort_order: 2,
    is_active: true,
  },
]

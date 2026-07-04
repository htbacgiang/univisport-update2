import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import FabricCardComponent from '../FabricCardComponent';
import ProcessSteps from '../ProcessSteps';

const contactHref = '/lien-he';

const heroStats = [
  'Xưởng 2.000m2 tại Đan Phượng',
  'Công suất 100.000 sản phẩm/tháng',
  'Phòng R&D riêng',
  'Đặt từ 10 áo ở dòng phù hợp',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m2 tại Đan Phượng', 'Chủ động sản xuất, QC và tiến độ cho đơn B2B.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp CLB, học viện, giải đấu và đội nhóm lớn.'],
  ['Phòng R&D riêng', 'Nghiên cứu chất liệu, form dáng và trải nghiệm vận động.'],
  ['Công nghệ UNI DRY', 'Hỗ trợ thoát ẩm một chiều, giảm cảm giác bí bách.'],
  ['Đặt từ 10 áo ở dòng phù hợp', 'Đội nhóm nhỏ có thể bắt đầu gọn, dễ kiểm chứng mẫu.'],
  ['Thiết kế miễn phí', 'Dễ lên concept màu, logo, tên, số và nhà tài trợ.'],
];

const reasons = [
  ['Thiết kế miễn phí', 'Lên concept theo logo, màu đội, tên, số và nhà tài trợ.'],
  ['Xưởng 2.000m2', 'Chủ động sản xuất, kiểm soát chất lượng và lịch giao hàng.'],
  ['UNI DRY', 'Hỗ trợ thoát ẩm, giảm cảm giác áo bết khi vận động.'],
  ['Đặt từ 10 áo', 'Phù hợp nhóm mới, đội nhỏ hoặc đơn thử nghiệm.'],
  ['Lưu file thiết kế', 'Dễ đặt bổ sung, hạn chế lệch màu và lệch logo.'],
  ['Tư vấn theo vai trò', 'Tách rõ HLV, vận động viên, ban tổ chức, trọng tài và check-in.'],
];

const audienceSolutions = [
  {
    title: 'CLB Pickleball',
    text: 'Tăng nhận diện, gắn kết thành viên và tạo hình ảnh chuyên nghiệp khi giao lưu hoặc thi đấu. CLB mới nên bắt đầu từ Polo hoặc T-shirt đồng bộ; CLB ổn định có thể mở thêm áo ban điều hành, áo đội nữ, áo giải nội bộ và merchandise.',
  },
  {
    title: 'Học viện Pickleball',
    text: 'Cần tách rõ đồng phục huấn luyện viên và học viên. HLV nên dùng Polo hoặc áo thể thao đứng form, còn học viên cần sản phẩm dễ mặc, dễ đặt lại, nhiều size và tối ưu chi phí.',
  },
  {
    title: 'Doanh nghiệp',
    text: 'Phù hợp giải nội bộ, team building hoặc đội thể thao công ty. Polo Pickleball đủ chỉn chu cho ảnh truyền thông nhưng vẫn giữ tinh thần thể thao.',
  },
  {
    title: 'Ban tổ chức giải đấu',
    text: 'Cần đồng phục cho vận động viên, trọng tài, nhân sự check-in, ban tổ chức và nhà tài trợ. Mỗi nhóm nên có màu hoặc dấu hiệu nhận diện riêng để vận hành dễ hơn trong ngày thi đấu.',
  },
];

const painPoints = [
  ['Chọn sai chất liệu', 'Cotton hoặc vải thể thao chất lượng thấp dễ ẩm, nặng, bí và bết khi chơi ngoài trời.'],
  ['Thiết kế rời rạc', 'Logo nhỏ, màu không theo nhận diện, tên số đặt lộn xộn hoặc nhà tài trợ chen sai vị trí khiến đội thiếu chuyên nghiệp.'],
  ['Ngân sách chưa rõ', 'Đội nhóm cần xác định cấu hình: số lượng, vải, kỹ thuật logo, cá nhân hóa, tiến độ và khả năng đặt bổ sung.'],
];

const materials = [
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm trên vải thể thao', 'Hỗ trợ đưa hơi ẩm ra ngoài, giảm cảm giác bí', 'Áo thi đấu, áo tập, áo CLB'],
  ['UNI SUPER COOL', 'Nền Polyamide, hướng đến cảm giác mềm mượt', 'Mềm, mượt, mát, mịn, giảm ma sát', 'CLB cao cấp, HLV, đội nữ, UniPick'],
  ['UNI QUICK DRY', 'Polyester cao cấp, nhanh khô và nhẹ', 'Phù hợp vận động ngoài trời, dễ bảo quản', 'Áo tập, áo sự kiện, giải phong trào'],
  ['UNI BLENDED', 'Kết hợp nhiều loại sợi tùy cấu hình', 'Bền, dễ mặc, cân bằng chi phí', 'Polo ban điều hành, áo giao lưu'],
  ['Lascote thể thao', 'Vải Polo thể thao cao cấp theo từng mã sản phẩm', 'Giữ phong cách Polo, mềm và co giãn', 'Polo Pickleball, doanh nghiệp, CLB'],
];

const roleSolutions = [
  ['Huấn luyện viên', 'Ưu tiên Polo hoặc áo thể thao đứng form, dễ nhận diện trên sân và đủ thoải mái khi thị phạm động tác.'],
  ['Vận động viên thi đấu', 'Cần nhẹ, thoáng, co giãn tốt, có vùng in tên số rõ và không kéo vai khi vung tay.'],
  ['Thành viên CLB', 'Nên dễ mặc, dễ đặt lại, chi phí hợp lý và có thể phát triển thành merchandise cho hội viên.'],
  ['Ban tổ chức giải đấu', 'Cần khác màu vận động viên và trọng tài, có vị trí logo nhà tài trợ rõ trong ảnh và livestream.'],
  ['Lễ tân và check-in', 'Cần lịch sự, nhận diện nhanh và dễ vận động khi phát bib, nhận hồ sơ hoặc hướng dẫn khách.'],
  ['Trọng tài', 'Ưu tiên sự rõ ràng, trang nghiêm, thoáng khí và màu sắc khác nhóm vận động viên.'],
];

const needSuggestions = [
  ['CLB mới', 'APL01, APL05'],
  ['Đội thi đấu', 'APL02, APL03, APL08'],
  ['Đội nữ', 'APL06, APL16'],
  ['Doanh nghiệp', 'APL09, APL11'],
  ['Resort / CLB lifestyle', 'APL10, APL12'],
  ['Giải đấu', 'APL03, APL04, APL08'],
  ['Đơn cần tùy biến nhiều', 'APL04, APL15'],
];

const unipickModels = [
  ['APL01', 'Áo Polo Pickleball Univi APL01', 'Mẫu nền thể thao cho CLB mới, vải UNI DRY, đặt từ 10 chiếc.', 'https://live.staticflickr.com/65535/55269983608_5ac04e4026_b.jpg', 'CLB mới'],
  ['APL02', 'Áo Polo Pickleball Univi APL02', 'Tông đen hiện đại, phù hợp team thi đấu và HLV.', 'https://live.staticflickr.com/65535/55269774088_1efbb8f0ee_b.jpg', 'Đội thi đấu, HLV'],
  ['APL03', 'Áo Polo Pickleball Univi APL03', 'Họa tiết Matrix, hợp giải đấu và đội muốn hình ảnh công nghệ.', '/san-pham/ao-polo-pickleball-univi-apl03', 'Giải đấu'],
  ['APL04', 'Áo Polo Pickleball Univi APL04', 'Matrix đa tông, dễ chia đội hoặc chia bảng đấu.', '/san-pham/ao-polo-pickleball-univi-apl04', 'Chia đội'],
  ['APL05', 'Áo Polo Pickleball Univi APL05', 'Xanh mint trẻ trung, phù hợp CLB cộng đồng.', '/san-pham/ao-polo-pickleball-univi-apl05', 'Cộng đồng'],
  ['APL06', 'Áo Polo Pickleball Univi APL06', 'Hồng tím nhẹ, Lascote thể thao, phù hợp đội nữ.', '/san-pham/ao-polo-pickleball-univi-apl06', 'Đội nữ'],
  ['APL07', 'Áo Polo Pickleball Univi APL07', 'Lascote thể thao, co giãn, khô nhanh, dễ phối logo.', '/san-pham/ao-polo-pickleball-univi-apl07', 'CLB cần logo nổi'],
  ['APL08', 'Áo Polo Pickleball Univi APL08', 'Tông đỏ nổi bật, hợp team thi đấu và branding mạnh.', '/san-pham/ao-polo-pickleball-univi-apl08', 'Branding mạnh'],
  ['APL09', 'Áo Polo Pickleball Univi APL09', 'Navy - trắng thanh lịch, hợp doanh nghiệp và CLB cao cấp.', '/san-pham/ao-polo-pickleball-univi-apl09', 'Doanh nghiệp'],
  ['APL10', 'Áo Polo Pickleball Univi APL10', 'Đen premium tối giản, hợp CLB VIP và đội HLV.', '/san-pham/ao-polo-pickleball-univi-apl10', 'Resort, CLB VIP'],
  ['APL11', 'Áo Polo Pickleball Univi APL11', 'Xám premium, phù hợp giải giao hữu doanh nghiệp.', '/san-pham/ao-polo-pickleball-univi-apl11', 'Team building'],
  ['APL12', 'Áo Polo Pickleball Univi APL12', 'Xanh dương nhạt dịu, hợp CLB cộng đồng nhiều độ tuổi.', '/san-pham/ao-polo-pickleball-univi-apl12', 'CLB nhiều độ tuổi'],
  ['APL15', 'Áo Polo Pickleball Univi APL15', 'Tông trắng, dễ tùy biến theo nhận diện CLB.', '/san-pham/ao-polo-pickleball-univi-apl15', 'Đơn cần tùy biến'],
  ['APL16', 'Áo Polo Pickleball Univi APL16', 'Tím pastel khác biệt, hợp đội nữ và nhóm lifestyle.', '/san-pham/ao-polo-pickleball-univi-apl16', 'Đội nữ, lifestyle'],
];

const unipickModelImages = [
  'https://live.staticflickr.com/65535/55269983608_5ac04e4026_b.jpg',
  'https://live.staticflickr.com/65535/55271421035_ecc6512c79_b.jpg',
  'https://live.staticflickr.com/65535/55270123037_fcc692a2d8_b.jpg',
  'https://live.staticflickr.com/65535/55270130717_5c0a98e7b6_b.jpg',
  'https://live.staticflickr.com/65535/55271052291_703d4f9f90_b.jpg',
  'https://live.staticflickr.com/65535/55272988954_7d58037dcf_b.jpg',
  'https://live.staticflickr.com/65535/55273172915_803301c388_b.jpg',
  'https://live.staticflickr.com/65535/55272926178_6d9e19751c_b.jpg',
  'https://live.staticflickr.com/65535/55272807631_1450f36e0b_b.jpg',
  'https://live.staticflickr.com/65535/55273211115_23241d6522_b.jpg',
  'https://live.staticflickr.com/65535/55273076969_4d0c36cd22_b.jpg',
  'https://live.staticflickr.com/65535/55273055741_60258693b7_b.jpg',
  'https://live.staticflickr.com/65535/55273056416_5b339e86f2_b.jpg',
  'https://live.staticflickr.com/65535/55273478970_df7d6cb417_b.jpg',
];

const productSystem = [
  'Áo T-shirt Pickleball cho buổi tập và cộng đồng trẻ.',
  'Chân váy Pickleball có quần bảo hộ bên trong cho đội nữ.',
  'Quần short Pickleball nhẹ, thoáng, linh hoạt.',
  'Áo khoác Pickleball hoặc áo gió cho di chuyển, khởi động và sự kiện ngoài trời.',
  'Đồng phục HLV, trọng tài, ban tổ chức, lễ tân, check-in và tình nguyện viên.',
  'Merchandise như áo lưu niệm, áo giải, áo nhà tài trợ hoặc sản phẩm bán cho thành viên.',
];

// THAY 3 ẢNH SECTION 11 TẠI ĐÂY.
const SECTION_11_IMAGES_TO_REPLACE = [
  {
    src: 'https://live.staticflickr.com/65535/55352010156_ba6863d984_b.jpg',
    alt: 'Áo Polo Pickleball UNIVI trong hệ đồng phục đội nhóm',
  },
  {
    src: 'https://live.staticflickr.com/65535/55351075527_5714ae5988_b.jpg',
    alt: 'Chân váy Pickleball nữ trong hệ sản phẩm UniPick',
  },
  {
    src: 'https://live.staticflickr.com/65535/55352010281_41b2cd227c_b.jpg',
    alt: 'Hệ sản phẩm đồng phục Pickleball gồm áo và phụ kiện thể thao',
  },
];

const pricingRows = [
  ['10+', 'Nhóm mới, đội nhỏ', 'Ưu tiên mẫu có sẵn, logo gọn.'],
  ['30+', 'CLB ổn định', 'Có thể cá nhân hóa tên số.'],
  ['50+', 'Học viện, giải nội bộ', 'Cần quản lý size và dữ liệu.'],
  ['100+', 'Giải đấu, doanh nghiệp lớn', 'Cần kế hoạch sản xuất và QC.'],
  ['300+', 'Sự kiện quy mô lớn', 'Cần chia lô, đóng gói theo đội hoặc size.'],
];

const relatedLinks = [
  ['10 mẫu áo đồng phục Pickleball đẹp năm 2026', '/bai-viet/10-mau-ao-dong-phuc-pickleball-dep-nam-2026'],
  ['May đồng phục Pickleball theo yêu cầu', '/bai-viet/may-dong-phuc-pickleball'],
  ['Đồng phục Pickleball cho câu lạc bộ', '/bai-viet/dong-phuc-pickleball-cho-cau-lac-bo'],
  ['Công nghệ UNI DRY', '/cong-nghe-uni-dry'],
  ['Vải Super Cool là gì', '/vai-super-cool-la-gi'],
  ['Xưởng may đồng phục thể thao Univi', '/xuong-may-dong-phuc-univi'],
];

const checklistGroups = [
  ['Brief', 'Logo gốc, bảng màu thương hiệu, số lượng dự kiến, dải size, nhóm người mặc, sản phẩm cần làm, môi trường sân, ngày cần hàng, yêu cầu tên số, logo nhà tài trợ và ngân sách tham khảo.'],
  ['Thiết kế', 'Khóa mặt trước, mặt sau, tay áo, cổ áo, vị trí logo chính, logo phụ, tên vận động viên, số áo và màu nền trước khi sản xuất.'],
  ['Size', 'Có người phụ trách xác nhận lần cuối; nếu đội có cả nam và nữ, cần quyết định dùng form chung hay tách form.'],
  ['Chất liệu', 'Kiểm tra bằng chuyển động thật: nâng tay, xoay vai, cúi người, hạ trọng tâm và di chuyển ngang.'],
  ['Đặt lại', 'Lưu file thiết kế, mã màu, mã vải, kỹ thuật logo, thông số size và đầu mối phụ trách.'],
  ['Truyền thông', 'Chuẩn bị ảnh tập thể, ảnh cận chất liệu, ảnh logo, ảnh vận động trên sân và video ngắn sau khi nhận hàng.'],
];

export const pickleballFaqs = [
  ['Đồng phục Pickleball nên dùng chất liệu gì?', 'Nên chọn theo môi trường sân. CLB cần cảm giác cao cấp có thể ưu tiên UNI SUPER COOL; đội cần áo nhẹ, nhanh khô có thể chọn UNI QUICK DRY; Polo chỉn chu có thể dùng Lascote thể thao hoặc UNI BLENDED theo cấu hình.'],
  ['Polo hay T-shirt phù hợp với Pickleball hơn?', 'Polo phù hợp CLB, học viện, doanh nghiệp và giải đấu cần hình ảnh chuyên nghiệp. T-shirt phù hợp buổi tập, nhóm trẻ và sự kiện phong trào.'],
  ['UNIVI có nhận đặt từ 10 áo không?', 'Có. Một số dòng và chính sách đối tác có thể bắt đầu từ 10 áo. Mẫu riêng phức tạp cần xác nhận theo cấu hình.'],
  ['Có thiết kế đồng phục Pickleball miễn phí không?', 'Có. UNIVI hỗ trợ tư vấn concept, phối màu, bố trí logo, tên, số và nhà tài trợ.'],
  ['Có thể in tên và số áo không?', 'Có. CLB nên gửi dữ liệu tên số trong một bảng thống nhất để hạn chế lỗi trước sản xuất.'],
  ['Có thể in logo nhà tài trợ không?', 'Có. Logo nhà tài trợ nên được đặt theo thứ bậc rõ ràng, không lấn át logo CLB hoặc tên giải.'],
  ['Đồng phục Pickleball có cần chống UV không?', 'Nên cân nhắc nếu thường chơi ngoài trời. Tính năng chống UV cần xác nhận theo mã vải cụ thể.'],
  ['Có gửi mẫu vải trước khi đặt không?', 'UNIVI có thể tư vấn mẫu vải hoặc mẫu áo phù hợp để đội kiểm tra cảm giác, màu và độ co giãn trước khi chốt.'],
  ['Có may đồng phục cho học viện Pickleball không?', 'Có. Học viện nên tách đồng phục HLV, học viên, quản lý và nhân sự vận hành.'],
  ['Có may đồng phục cho giải đấu Pickleball không?', 'Có. Có thể triển khai áo vận động viên, ban tổ chức, trọng tài, check-in và nhà tài trợ.'],
  ['Có giao hàng toàn quốc không?', 'Có. Tiến độ giao hàng cần xác nhận theo địa điểm, số lượng và lịch xưởng.'],
  ['Có xuất hóa đơn VAT không?', 'Có. Doanh nghiệp có thể yêu cầu thông tin hóa đơn khi đặt hàng.'],
  ['Có đổi size được không?', 'Chính sách đổi size phụ thuộc tình trạng sản phẩm và mức độ cá nhân hóa tên số, logo.'],
  ['Làm sao để đặt bổ sung không lệch màu?', 'Cần lưu mã vải, mã màu, file thiết kế, thông số size và kỹ thuật hoàn thiện.'],
  ['Có nên đặt dư áo cho thành viên mới không?', 'Nên cân nhắc nếu CLB tăng thành viên nhanh. Với áo có tên số, nên quản lý riêng phần cá nhân hóa.'],
  ['APL nào phù hợp CLB doanh nghiệp?', 'APL09 và APL11 phù hợp vì màu navy, trắng, xám dễ giữ hình ảnh chuyên nghiệp.'],
  ['APL nào phù hợp đội nữ?', 'APL06 và APL16 phù hợp khi đội muốn màu pastel, mềm hơn nhưng vẫn có tinh thần thể thao.'],
  ['APL nào phù hợp giải đấu?', 'APL03, APL04 và APL08 phù hợp vì có nhận diện rõ, dễ tạo nhóm màu và nổi bật trên sân.'],
  ['Chất liệu UNIVI có kiểm định an toàn không?', 'Theo proof point nội bộ, chất liệu UNIVI được kiểm định độc lập theo QCVN 01:2017/BCT về Formaldehyde và amin thơm chuyển hóa từ thuốc nhuộm Azo.'],
  ['Cần chuẩn bị gì để nhận báo giá?', 'Bạn nên chuẩn bị logo, số lượng, sản phẩm cần làm, dải size, ngày cần hàng, môi trường sân và yêu cầu cá nhân hóa.'],
];

function Section({ id, title, children, className = '' }) {
  return (
    <article
      id={id}
      className={`scroll-mt-24 bg-white py-4 ${className}`}
    >
      <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900">
        {title}
      </h2>
      {children}
    </article>
  );
}

function TextCard({ title, children }) {
  return (
    <div className="border-l-4 border-[#105d97]/20 py-1 pl-4">
      <h3 className="mb-1 text-base font-bold text-gray-900">{title}</h3>
      <div className="text-sm leading-relaxed text-gray-700 md:text-base">{children}</div>
    </div>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-bold text-gray-900">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="px-4 py-3 align-top text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImageBlock({ src, alt, caption }) {
  return (
    <figure className="overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 900px"
      />
      <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function PickleballUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-800">
      <section className="bg-white pb-8">
        <p className="mb-2 text-sm font-semibold text-[#105d97]">UniPick by UNIVI</p>
        <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
          Đồng Phục Pickleball Thiết Kế Theo Yêu Cầu Cho CLB, Học Viện & Giải Đấu
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-700">
          Đồng phục Pickleball không chỉ là một chiếc áo giống nhau. Với CLB, học viện,
          doanh nghiệp và giải đấu, đây là nhận diện thương hiệu, công cụ gắn kết thành
          viên, tài sản truyền thông và một phần trực tiếp của trải nghiệm vận động.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f82]"
          >
            Nhận báo giá
          </button>
          <Link
            href="#bo-suu-tap-unipick"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem Bộ sưu tập
          </Link>

        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {heroStats.map((stat) => (
            <span key={stat} className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700">
              {stat}
            </span>
          ))}
        </div>
      </section>

      <Section id="trust-badge" eyebrow="" title="1. Năng lực sản xuất" className="border-t border-gray-100">
        <p className="mb-3 leading-relaxed">
          UNIVI không định vị là xưởng may áo thun giá rẻ. UNIVI là thương hiệu nghiên cứu và
          phát triển đồng phục thể thao chuyên dụng cho chuỗi phòng tập, CLB và đội nhóm thể
          thao tại Việt Nam. Với Pickleball, phần proof nên tập trung vào năng lực sản xuất và
          năng lực thể thao chuyên dụng.
        </p>
        <div className="mb-6 overflow-hidden border border-gray-200">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/0AABoh2a-Sk"
            title="Năng lực sản xuất đồng phục thể thao UNIVI"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trustBadges.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="dong-phuc-pickleball-la-gi" eyebrow="" title="2. Đồng Phục Pickleball Là Gì?">
        <div className="space-y-2 leading-relaxed">
          <p>
            Đồng phục Pickleball là hệ trang phục được thiết kế cho người chơi, huấn luyện
            viên, thành viên CLB, ban tổ chức, trọng tài hoặc doanh nghiệp khi tham gia luyện
            tập và thi đấu Pickleball. Sản phẩm thường bắt đầu từ áo Polo hoặc T-shirt, sau đó
            mở rộng sang chân váy, quần short, áo khoác, áo sự kiện và merchandise.
          </p>
          <p>
            Điểm khác biệt của đồng phục Pickleball nằm ở đặc thù vận động: chạy ngắn, đổi
            hướng nhanh, hạ trọng tâm, xoay thân và vung tay liên tục. Nếu áo giữ mồ hôi, bí
            vai hoặc form quá cứng, trải nghiệm trên sân sẽ giảm rất nhanh.
          </p>
          <p>
            Với CLB và học viện, đồng phục giúp thành viên nhận ra mình thuộc về một cộng
            đồng, giúp đội nhóm lên hình đồng bộ và giúp thương hiệu CLB xuất hiện nhất quán
            trên ảnh, video, giải giao hữu hoặc bài đăng social.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55271837427_17c3ae7f93_b.jpg"
            alt="Đồng phục Pickleball cho người chơi huấn luyện viên và thành viên CLB"
            caption="Đồng phục Pickleball phục vụ vận động, nhận diện và kết nối cộng đồng."
          />
        </div>
      </Section>

      <Section id="vi-sao-chon-univi" eyebrow="" title="3. Vì Sao Chọn Đồng Phục Univi?">
        <p className="mb-2 leading-relaxed">
          UNIVI phát triển sản phẩm theo nguyên tắc gốc vững - diện sang: xử lý chất liệu, form,
          độ thoáng, độ co giãn và độ an toàn trước; sau đó mới hoàn thiện nhận diện, màu sắc và
          hình ảnh thương hiệu.
        </p>
        <div className="mb-3">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55260155236_1052c9e90c_b.jpg"
            alt="Sáu lý do chọn đồng phục Pickleball UNIVI cho CLB và giải đấu"
            caption="UNIVI tư vấn đồng phục Pickleball từ chất liệu, thiết kế đến khả năng đặt bổ sung."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="giai-phap-theo-doi-tuong" eyebrow="" title="4. Giải Pháp Đồng Phục Theo Đối Tượng">
        <div className="grid gap-4 md:grid-cols-2">
          {audienceSolutions.map((item) => (
            <TextCard key={item.title} title={item.title}>
              <p>{item.text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55319883323_875fd6ae86_b.jpg"
            alt="Đồng phục Pickleball cho CLB học viện doanh nghiệp và giải đấu"
            caption="Mỗi nhóm khách hàng cần một cấu hình đồng phục Pickleball riêng theo mục tiêu sử dụng."
          />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          Học viện có thể tham khảo thêm{' '}
          <Link href="/giai-phap-2s" className="font-semibold text-[#105d97] hover:underline">
            giải pháp 2S Uniform
          </Link>{' '}
          để tách Staff Uniform và Member Uniform.
        </p>
      </Section>

      <Section id="pain-points" eyebrow="" title="5. Lỗi Đau Khi Chọn Đồng Phục Pickleball">
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55273287874_96694796ef_b.jpg"
            alt="Người chơi Pickleball gặp lỗi trang phục khi chọn sai đồng phục"
            caption="Sai chất liệu, thiết kế rời rạc và ngân sách không rõ là ba vấn đề phổ biến khi chọn đồng phục Pickleball."
          />
        </div>
        <div className="mt-6 space-y-4 leading-relaxed">
          <p>
            Thông điệp cần nhấn mạnh là lỗi không luôn nằm ở cường độ vận động. Nhiều khi vấn đề
            đến từ trang phục: áo cotton dày giữ mồ hôi, áo thun giá rẻ thiếu co giãn, quần không
            phù hợp khiến người chơi khó với bóng hoặc phải gồng người khi di chuyển.
          </p>
          <p>
            UNIVI giải quyết nhóm pain point này bằng hướng tư vấn rõ hơn: chọn chất liệu thể thao
            chuyên dụng, ưu tiên cấu trúc thoát ẩm, co giãn, nhẹ và dễ bảo quản; đồng thời xử lý
            thiết kế theo logo, màu đội, tên số và nhà tài trợ.
          </p>
        </div>
      </Section>

      <Section id="chat-lieu" eyebrow="" title="6. Chất Liệu Chuyên Dụng Cho Pickleball">
        <p className="mb-5 leading-relaxed">
          Chất liệu là phần quyết định trải nghiệm thật trên sân. Một mẫu tốt phải được thử trong
          chuyển động: giao bóng, vung tay, xoay vai, hạ trọng tâm và di chuyển ngang.
        </p>
        <div className="mb-6">
          <FabricCardComponent />
        </div>
        <SimpleTable
          headers={['Chất liệu', 'Cấu tạo / định vị', 'Ưu điểm', 'Phù hợp']}
          rows={materials}
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <TextCard title="37°C trên sân khác phòng máy lạnh">
            <p>
              Khi chơi ngoài trời, đội nên tránh áo quá dày, màu quá hấp nhiệt nếu không có cấu
              trúc vải phù hợp, form bó cứng ở vai và quần không co giãn.
            </p>
          </TextCard>
          <TextCard title="Tính năng cần xác nhận theo mã vải">
            <p>
              Các tính năng như hỗ trợ kháng khuẩn hoặc chống UV nên được tư vấn theo đúng mã vải,
              cùng với độ thoáng, độ co giãn, độ bền màu và cảm giác tiếp xúc da.
            </p>
          </TextCard>
        </div>
      </Section>

      <Section id="uni-dry" eyebrow="" title="7. Công Nghệ UNI DRY">
        <div className="space-y-2 leading-relaxed">
          <p>
            <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97] hover:underline">
              UNI DRY
            </Link>{' '}
            là công nghệ xử lý thoát ẩm được UNIVI ứng dụng trên các dòng chất liệu thể thao
            chuyên dụng. Nguyên lý cốt lõi là kiểm soát chuyển động một chiều của hơi ẩm: từ
            bề mặt da, qua lớp trong vải, ra lớp ngoài vải và bay hơi ra môi trường.
          </p>
          <p>
            Với Pickleball, UNI DRY có ý nghĩa rõ ở vùng lưng, vai, nách và cổ áo. Đây là các
            khu vực dễ bết khi người chơi chạy, đổi hướng và vung tay liên tục.
          </p>
          <p>
            Công nghệ không thay thế việc chọn đúng form, nhưng là nền tảng quan trọng để áo
            mặc dễ chịu hơn trong thời gian dài.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55255352906_17d6019050_b.jpg"
            alt="Infographic công nghệ UNI DRY thoát ẩm một chiều cho áo Pickleball"
            caption="UNI DRY hỗ trợ đưa hơi ẩm từ da ra bề mặt vải để giảm cảm giác bết dính."
          />
        </div>
      </Section>

      <Section id="vai-tro-trong-clb" eyebrow="" title="8. Giải Pháp Theo Từng Vai Trò Trong CLB">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleSolutions.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="quy-trinh" eyebrow="" title="9. Quy Trình Đặt May Đồng Phục Pickleball">
        <ProcessSteps variant="vertical" />
        <p className="mt-5 leading-relaxed">
          Brief tốt nên có logo gốc, màu thương hiệu, số lượng dự kiến, nhóm người mặc, sản
          phẩm cần làm, môi trường sân, ngày cần hàng, yêu cầu tên số và logo nhà tài trợ.
          Sau khi hoàn tất, CLB nên lưu mã vải, mã màu, file thiết kế và thông số size để đặt
          bổ sung không lệch.
        </p>
      </Section>

      <Section id="14-mau-ao-polo-pickleball" eyebrow="" title="10. 14 Mẫu Áo Polo Pickleball UniPick">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
          {unipickModels.map(([code, name, summary, href, fit], index) => (
            <Link
              key={code}
              href={href}
              className="block pb-6"
            >
              <div className="mb-4 w-full overflow-hidden bg-white">
                <Image
                  src={unipickModelImages[index % unipickModelImages.length]}
                  alt={name}
                  width={900}
                  height={1200}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
              <div className="mt-1 space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
                <p className="text-sm font-semibold text-gray-900">Phù hợp: {fit}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="he-san-pham" eyebrow="" title="11. Không Chỉ Có Polo Pickleball">
        <p className="mb-5 leading-relaxed">
          Polo là sản phẩm mũi nhọn vì vừa lịch sự vừa thể thao. Tuy nhiên, một hệ đồng phục
          Pickleball theo yêu cầu có thể gồm nhiều dòng để phù hợp vai trò, vóc dáng và bối cảnh
          sử dụng.
        </p>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {SECTION_11_IMAGES_TO_REPLACE.map((image) => (
            <div key={image.src} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 260px"
              />
            </div>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {productSystem.map((item) => (
            <li key={item} className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed">
          UNIVI có thể tư vấn outfit đồng bộ như Polo + quần short dáng suông, T-shirt + chân váy
          có quần bảo hộ, áo sát nách có cổ + chân váy xếp ly, hoặc áo khoác gió nhẹ + Polo/T-shirt
          cho di chuyển ngoài trời.
        </p>
      </Section>

      <Section id="bang-gia" eyebrow="" title="12. Bảng Giá Đồng Phục Pickleball">
        <p className="mb-5 leading-relaxed">
          Giá đồng phục Pickleball sẽ phụ thuộc vào số lượng đặt may, chất liệu, kiểu sản phẩm,
          kỹ thuật hoàn thiện logo, tên số, tiến độ cần hàng và mức độ tùy biến của từng dự án.
        </p>
        <SimpleTable headers={['Quy mô', 'Nhu cầu thường gặp', 'Hướng tư vấn']} rows={pricingRows} />
        <div className="mt-6 rounded-xl bg-[#105d97] p-5 text-white">
          <p className="text-lg font-bold">Cần báo giá theo cấu hình thực tế?</p>
          <p className="mt-2 text-sm text-blue-50">
            Gửi logo, số lượng, ngày cần hàng, môi trường sân, sản phẩm muốn làm và yêu cầu cá nhân hóa để UNIVI đề xuất chất liệu, form, mockup và phương án báo giá.
          </p>
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#105d97] hover:bg-blue-50"
          >
            Liên hệ báo giá đồng phục Pickleball
          </button>
        </div>
      </Section>

      <Section id="internal-link-hub" eyebrow="" title="13. Bài Viết Liên Quan">
        <div className="grid gap-3 md:grid-cols-2">
          {relatedLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 font-semibold text-[#105d97] transition hover:border-[#105d97] hover:bg-white"
            >
              {label}
            </Link>
          ))}
        </div>

      </Section>

      <Section id="footer-seo" eyebrow="" title="14. Đồng Phục Pickleball Theo Yêu Cầu Tại UNIVI">
        <div className="space-y-4 leading-relaxed">
          <p>
            Đồng Phục Univi là đơn vị cung cấp giải pháp đồng phục thể thao chuyên dụng cho CLB,
            học viện, doanh nghiệp và đội nhóm thể thao tại Việt Nam. Với Pickleball, UNIVI phát
            triển hệ sản phẩm UniPick nhằm giải quyết đồng thời nhu cầu vận động, hình ảnh đội
            nhóm và khả năng đặt may theo nhận diện riêng.
          </p>
          <p>
            UNIVI sở hữu xưởng sản xuất 2.000m2 tại Đan Phượng, công suất 100.000 sản phẩm/tháng,
            phòng R&D nghiên cứu chất liệu và quy trình tư vấn từ brief đến giao hàng.
          </p>
          <p>
            Nếu bạn cần may đồng phục Pickleball cho CLB, học viện, giải đấu hoặc doanh nghiệp,
            hãy chuẩn bị logo, số lượng, ngày cần hàng và nhu cầu sản phẩm để UNIVI tư vấn cấu
            hình phù hợp.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55237858841_2327afd407_b.jpg"
            alt="Đồng phục Pickleball theo yêu cầu tại UNIVI"
            caption="UNIVI tư vấn và sản xuất đồng phục Pickleball theo cấu hình thực tế của từng CLB, học viện, doanh nghiệp và giải đấu."
          />
        </div>
      </Section>

      <Section id="checklist" eyebrow="" title="15. Checklist Chốt Đơn Cho CLB, Học Viện Và Giải Đấu">
        <p className="mb-5 leading-relaxed">
          Trước khi yêu cầu báo giá, người phụ trách nên xác định rõ đồng phục sẽ phục vụ mục tiêu
          nào: áo thành viên CLB, áo thi đấu, áo giải đấu, đồng phục ban tổ chức hay hệ sản phẩm
          dài hạn cho học viện.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {checklistGroups.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>
      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
              UNIVI SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl font-bold md:text-2xl">
              Liên Hệ Với Xưởng May Đồng Phục Univi Ngay Hôm Nay
            </h2>
            <p className="mt-2  text-sm leading-relaxed text-blue-50">
              Bạn đang cần may đồng phục Pickleball cho CLB, học viện, doanh nghiệp hoặc giải đấu?
              Hãy gửi UNIVI logo, số lượng dự kiến, ngày cần hàng, môi trường sân, sản phẩm muốn làm
              và yêu cầu cá nhân hóa.
            </p>
            <div className="mt-3 grid gap-1 text-sm text-blue-50">
              <p><span className="font-bold">Văn phòng:</span> Nhà D14, đường Thanh Bình, phường Hà Đông, Hà Nội</p>
              <p><span className="font-bold">Hotline:</span> 0834.204.999 / 096.156.7997</p>
              <p><span className="font-bold">Email:</span> dongphucunivi@gmail.com</p>
            </div>
          </div>

        </div>
      </section>
      <Section id="faq" eyebrow="" title="Câu Hỏi Thường Gặp Về Đồng Phục Pickleball">
        <div className="space-y-3">
          {pickleballFaqs.map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-gray-200 bg-gray-50">
              <summary className="cursor-pointer px-4 py-3 font-bold text-gray-900">
                {question}
              </summary>
              <p className="px-4 py-3 text-sm leading-relaxed text-gray-700">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
      <ContactForm
        source="Đồng phục Pickleball - Nhận báo giá"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}

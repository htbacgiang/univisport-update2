import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import FabricCardComponent from '../FabricCardComponent';
import ProcessSteps from '../ProcessSteps';

const heroStats = [
  'Xưởng 2.000m2 tại Đan Phượng',
  'Công suất 100.000 sản phẩm/tháng',
  'Nhận đơn từ 10 chiếc theo dòng phù hợp',
  'Thiết kế theo nhận diện studio',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m2 tại Đan Phượng', 'Chủ động sản xuất, kiểm soát chất liệu, size, đường may và tiến độ cho đơn studio.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp studio nhỏ, chuỗi Pilates, Wellness Center, workshop và retreat quy mô lớn.'],
  ['Phòng R&D riêng', 'Nghiên cứu cảm giác mặc, độ co giãn, form dáng và trải nghiệm chuyển động.'],
  ['Công nghệ UNI DRY', 'Hỗ trợ đưa hơi ẩm ra ngoài để giảm cảm giác bết dính trong lớp học.'],
  ['Đặt từ 10 chiếc', 'Studio mới có thể bắt đầu gọn với mẫu đội ngũ hoặc áo workshop.'],
  ['Thiết kế miễn phí', 'Tư vấn phối màu, logo, vị trí nhận diện và hệ sản phẩm theo từng vai trò.'],
];

const studioReasons = [
  ['Hình ảnh chuyên nghiệp', 'Giáo viên, lễ tân và tư vấn viên xuất hiện đồng bộ tại lớp học, quầy lễ tân, workshop và social media.'],
  ['Trải nghiệm hội viên', 'Áo workshop, áo retreat hoặc sản phẩm theo khóa học giúp hội viên cảm thấy thuộc về cộng đồng studio.'],
  ['Phân vai rõ ràng', 'Mỗi nhóm người mặc có form và chất liệu riêng nhưng vẫn giữ chung màu, logo và tinh thần thương hiệu.'],
  ['Nội dung truyền thông đẹp hơn', 'Đồng phục giúp ảnh lớp học, video hướng dẫn, bài giới thiệu HLV và Google Business Profile nhất quán hơn.'],
  ['Giá trị cảm nhận cao hơn', 'Khi đội ngũ mặc đúng trang phục vận động, khách hàng dễ cảm nhận sự đầu tư của studio vào dịch vụ.'],
];

const roleSolutions = [
  {
    title: 'HLV Yoga',
    text: 'Cần trang phục mềm, mịn, co giãn và ổn định khi gập, xoắn, kéo giãn hoặc đảo ngược. Áo không nên cuộn khi nâng tay, legging không nên tụt cạp hoặc mỏng tại vùng chịu lực.',
  },
  {
    title: 'HLV Pilates',
    text: 'Cần dáng mặc gọn để giáo viên thị phạm và quan sát vai, hông, cột sống, đầu gối của học viên. Với Reformer, nên tránh chi tiết cứng, dây dài hoặc khóa dễ cấn khi nằm trên máy.',
  },
  {
    title: 'Lễ tân và tư vấn viên',
    text: 'Không cần quá ôm hoặc quá thể thao. Nhóm này cần T-shirt hoặc Polo đứng dáng, dễ mặc nhiều giờ, giữ hình ảnh chỉn chu và dễ nhận diện trong không gian studio.',
  },
  {
    title: 'Hội viên, workshop, retreat',
    text: 'Có thể bắt đầu bằng áo workshop, áo cộng đồng hoặc áo retreat. Mục tiêu là tạo cảm giác thuộc về, dễ mặc và phù hợp nhiều vóc dáng.',
  },
  {
    title: 'Wellness doanh nghiệp',
    text: 'Nên ưu tiên áo T-shirt, Polo thể thao hoặc set nhẹ theo màu thương hiệu. Sản phẩm cần kín đáo, dễ mặc và không quá chuyên sâu để người mới tập tự tin tham gia.',
  },
];

const painPoints = [
  ['Chọn theo mẫu đẹp', 'Một set lên hình tốt vẫn có thể thất bại nếu vải bí nóng, áo cuộn khi nâng tay hoặc legging tụt cạp.'],
  ['Một mẫu cho tất cả', 'Yoga Studio và Pilates Studio có nhiều vai trò khác nhau; ép mọi nhóm mặc giống nhau dễ làm giảm trải nghiệm sử dụng.'],
  ['Không chuẩn hóa hồ sơ', 'Không lưu màu, logo, mã vải và size chart khiến các đợt đặt bổ sung dễ lệch mẫu hoặc mất thời gian duyệt lại.'],
  ['Chỉ nhìn giá một sản phẩm', 'Mẫu rẻ nhưng HLV không muốn mặc sẽ trở thành chi phí chìm. Chi phí thật nằm ở vòng đời sử dụng và khả năng đặt lại.'],
];

const materials = [
  ['UNI SUPER COOL', 'Polyamide pha Spandex', 'Mềm, mượt, mát, mịn, co giãn 4 chiều', 'Bra, legging, croptop, tank top, set HLV cao cấp'],
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm', 'Hỗ trợ đưa hơi ẩm từ da ra bề mặt ngoài để bay hơi', 'Lớp đông người, HLV dạy liên tục, phòng nóng ẩm'],
  ['UNI QUICK DRY', 'Polyester cao cấp nhanh khô', 'Nhẹ, thoáng, dễ bảo quản, phù hợp hoạt động ngoài trời', 'Workshop, retreat, lớp ngoài trời, wellness doanh nghiệp'],
  ['UNI BLENDED', 'Nhóm vải pha theo cấu hình', 'Cân bằng độ bền, độ mềm, khả năng giữ dáng và chi phí', 'Lễ tân, tư vấn viên, Polo hoặc T-shirt studio'],
];

const designPrinciples = [
  ['Nén phân cấp', 'Ứng dụng trên bra, legging và một số dòng hiệu suất cao để tạo lực ôm nhẹ ở vùng cần hỗ trợ, giúp trang phục đi cùng chuyển động.'],
  ['Ôm sát hỗ trợ vận động', 'Không phải bó chặt, mà là vừa đủ gọn để không cuộn, không vướng và không che mất đường chuyển động khi gập, xoắn hoặc nâng tay.'],
  ['Đường may giảm ma sát', 'Kiểm tra kỹ vai, lưng, hông, đùi trong và cạp quần vì đây là các vùng dễ cọ vào da, thảm hoặc máy tập.'],
];

const modelSolutions = [
  ['Boutique Yoga Studio', 'Ưu tiên bảng màu dịu, chất liệu mềm mịn, logo tinh tế và sản phẩm lên hình tốt trong không gian lớp học.'],
  ['Studio Pilates Reformer', 'Ưu tiên croptop quai bản to, T-shirt ôm vừa, legging cạp cao và chi tiết không cấn khi nằm trên máy.'],
  ['Chuỗi studio', 'Cần chuẩn hóa 2S Uniform, hồ sơ màu, size, vị trí logo và khả năng đặt bổ sung đồng đều giữa các cơ sở.'],
  ['Wellness Center và resort', 'Cần hình ảnh thư giãn, cao cấp, mức che phủ linh hoạt và chất liệu dễ chịu khi mặc lâu.'],
  ['Wellness doanh nghiệp', 'Cần sản phẩm dễ mặc, kín đáo, phù hợp nhiều vóc dáng và bám màu thương hiệu công ty.'],
];

const uniflowProducts = [
  'Polo HLV Yoga hoặc Pilates cho studio cần hình ảnh chỉn chu.',
  'T-shirt workshop cho lớp trải nghiệm, khóa ngắn hạn hoặc sự kiện.',
  'Bra và legging cho giáo viên cần thị phạm chuyển động.',
  'Croptop, tank top hoặc crop tee cho boutique studio và lớp trẻ.',
  'Áo retreat cho hoạt động ngoài trời.',
  'Đồng phục lễ tân, tư vấn viên, hội viên VIP và cộng đồng.',
  'Bộ sản phẩm Wellness cho doanh nghiệp.',
];

const uniflowModels = [
  ['A4013', 'Đồng phục Yoga 4013', 'Bra lệch vai, vải gân, legging cạp cao cho studio muốn hình ảnh cá tính.', 'https://live.staticflickr.com/65535/55332208090_cd311ace9b_b.jpg', '/san-pham/dong-phuc-yoga-4013', 'Studio cá tính'],
  ['A11', 'Đồng phục Yoga A11', 'Lưng đan dây chéo kép, phù hợp HLV hoặc lớp cần nét nữ tính.', 'https://live.staticflickr.com/65535/54898256343_f46a50ea32_b.jpg ', '/san-pham/dong-phuc-yoga-a11', 'HLV Yoga'],
  ['A001', 'Đồng phục Yoga A001', 'Bra 2 dây và legging cạp cao, dễ mặc cho studio mới triển khai đồng phục.', 'https://live.staticflickr.com/65535/55331402991_8a49650a7c_b.jpg', '/san-pham/dong-phuc-yoga-a001', 'Mẫu dễ mặc'],
  ['A004', 'Đồng phục Yoga A004', 'Áo peplum lưng đan chéo, phù hợp studio cần nhiều lựa chọn màu.', 'https://live.staticflickr.com/65535/55331789064_413b5bb95a_b.jpg', '/san-pham/dong-phuc-yoga-a004', 'Nhiều màu'],
  ['A005', 'Đồng phục Yoga A005', 'Lưng đan dây nghệ thuật, định vị nữ tính và nổi bật trong ảnh lớp học.', 'https://live.staticflickr.com/65535/55331958954_be0e8a9806_b.jpg', '/san-pham/dong-phuc-yoga-a005', 'Studio nữ tính'],
  ['A006', 'Đồng phục Yoga A006', 'Croptop quai bản to, đa năng cho Yoga, Pilates và lớp thể thao nhẹ.', 'https://live.staticflickr.com/65535/55332009409_0812920c5d_b.jpg', '/san-pham/dong-phuc-yoga-a006', 'Đa năng'],
  ['A008', 'Đồng phục Yoga A008', 'Racerback lưng chữ T, gọn và linh hoạt cho Pilates hoặc lớp năng động.', 'https://live.staticflickr.com/65535/55332258690_b983997bb9_b.jpg', '/san-pham/dong-phuc-yoga-a008', 'Pilates'],
  ['ACT7', 'Đồng phục Yoga ACT7', 'Crop tee tay ngắn, vải gân, phù hợp studio trẻ trung và workshop.', 'https://live.staticflickr.com/65535/55337564567_f3e2a56410_b.jpg', '/san-pham/dong-phuc-yoga-act7', 'Workshop'],
];

const processChecklist = [
  ['Khảo sát', 'Mô hình studio, vai trò người mặc, tần suất sử dụng, ngân sách, ngày cần hàng và mục tiêu thương hiệu.'],
  ['Chất liệu', 'Chọn theo vai trò: HLV, lễ tân, hội viên, workshop, retreat hoặc wellness doanh nghiệp.'],
  ['Thiết kế', 'Chốt màu, logo, vị trí in/thêu, form, mức che phủ và hình mô phỏng trước khi sản xuất.'],
  ['Mặc thử', 'Test bằng động tác gập, xoắn, squat, nâng tay, plank hoặc nằm trên máy Reformer.'],
  ['Sản xuất', 'Kiểm tra vải, size, đường may, logo, đóng gói và tiến độ giao hàng.'],
  ['Đặt bổ sung', 'Lưu mã vải, bảng màu, size chart, file thiết kế và mẫu đã duyệt.'],
];

const caseStudies = [
  ['Studio Yoga 5 HLV', 'Bắt đầu bằng một mẫu cho giáo viên và một mẫu T-shirt workshop cho học viên. Sau khi có phản hồi tốt, mở rộng sang retreat hoặc bộ sưu tập member.'],
  ['Pilates Studio 20 máy', 'Dùng croptop quai bản to, legging cạp cao cho giáo viên; Polo hoặc T-shirt cho lễ tân; áo workshop cho học viên mới. Mẫu nên được thử trực tiếp trên Reformer.'],
  ['Wellness Retreat', 'Chọn T-shirt retreat, áo khoác nhẹ, tank top hoặc set mềm cho giáo viên. Nếu có nhiều hoạt động, chia sản phẩm theo buổi tập, di chuyển và chụp ảnh cộng đồng.'],
];

const relatedLinks = [
  ['Đồng phục Yoga Studio', '/bai-viet/dong-phuc-yoga-studio'],
  ['Đồng phục Pilates', '/bai-viet/dong-phuc-pilates'],
  ['May đồng phục Yoga', '/bai-viet/may-dong-phuc-yoga'],
  ['Giải pháp 2S Uniform', '/giai-phap-2s'],
  ['Vải Super Cool là gì', '/vai-super-cool-la-gi'],
  ['Công nghệ UNI DRY', '/cong-nghe-uni-dry'],
  ['Xưởng may đồng phục thể thao Univi', '/xuong-may-dong-phuc-univi'],
  ['Đồng phục Fitness Center', '/dong-phuc-fitness-center'],
];

export const yogaPilatesFaqs = [
  ['MOQ tối thiểu khi đặt đồng phục Yoga Pilates là bao nhiêu?', 'Univi nhận đơn từ 10 chiếc theo chính sách đối tác cho các dòng phù hợp. Với mẫu thiết kế riêng hoặc yêu cầu đặc biệt, số lượng tối thiểu có thể được tư vấn theo chất liệu, kiểu dáng và quy trình sản xuất.'],
  ['Univi có thiết kế đồng phục miễn phí không?', 'Có. Univi hỗ trợ tư vấn ý tưởng, phối màu và thiết kế đồng phục theo nhận diện thương hiệu của studio. Mục tiêu là giúp mẫu đồng phục phù hợp vai trò người mặc, không chỉ đẹp trên hình mô phỏng.'],
  ['Yoga Studio nên chọn chất liệu nào?', 'Yoga Studio nên ưu tiên UNI SUPER COOL hoặc các dòng Polyamide Spandex mềm, mịn, mát và co giãn 4 chiều. Nếu làm áo workshop hoặc lễ tân, có thể dùng UNI BLENDED hoặc UNI QUICK DRY tùy nhu cầu.'],
  ['Pilates Studio có dùng chung đồng phục với Yoga Studio được không?', 'Có thể dùng chung nền chất liệu, nhưng dáng mặc nên điều chỉnh. Pilates thường cần trang phục gọn hơn để giáo viên quan sát vai, hông, cột sống và đầu gối của học viên trong quá trình căn chỉnh.'],
  ['Đồng phục HLV Yoga nên là bra, tank top hay T-shirt?', 'Tùy định vị studio và mức độ tự tin của đội ngũ. Bra và legging phù hợp lớp chuyên sâu. Tank top hoặc T-shirt ôm vừa phù hợp nhiều vóc dáng hơn và dễ dùng cho studio mới triển khai đồng phục.'],
  ['Có nên làm đồng phục riêng cho hội viên không?', 'Có, nếu studio muốn xây cộng đồng và tăng nhận diện. Đồng phục hội viên có thể bắt đầu từ áo workshop, áo retreat hoặc sản phẩm theo khóa học thay vì triển khai ngay một set tập đầy đủ.'],
  ['Univi có lưu file thiết kế để đặt bổ sung không?', 'Studio nên lưu bảng màu, logo, vị trí in, mã vải và size chart. Univi có thể hỗ trợ quy trình này để các đợt đặt bổ sung ổn định hơn và tránh lệch mẫu giữa các lần sản xuất.'],
  ['Chất liệu có được kiểm định an toàn không?', 'Theo tài liệu nội bộ, các dòng vải Univi được kiểm định theo QCVN 01:2017/BCT. Nói dễ hiểu, đây là bước kiểm tra để hạn chế các hóa chất không phù hợp tiếp xúc trực tiếp với da.'],
  ['Univi có giao hàng toàn quốc không?', 'Có. Univi hỗ trợ giao hàng toàn quốc cho các dự án đồng phục thể thao, bao gồm Yoga Studio, Pilates Studio, trung tâm Wellness, Fitness Center và đội nhóm thể thao.'],
  ['Studio nên chuẩn bị gì trước khi liên hệ tư vấn?', 'Bạn nên chuẩn bị logo, màu thương hiệu, số lượng dự kiến, nhóm người mặc, mô hình studio và mục tiêu sử dụng như HLV, lễ tân, hội viên, workshop, retreat hoặc chương trình wellness cho doanh nghiệp.'],
];

function Section({ id, title, children, className = '' }) {
  return (
    <article id={id} className={`scroll-mt-24 bg-white py-4 ${className}`}>
      <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900">
        {title}
      </h2>
      {children}
    </article>
  );
}

function InlineLink({ href, children }) {
  return (
    <Link href={href} className="font-semibold text-[#105d97] hover:underline">
      {children}
    </Link>
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

function ImageBlock({ src, alt, caption, priority = false }) {
  return (
    <figure className="overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 900px"
        priority={priority}
      />
      <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function YogaPilatesUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-800">
      <section className="bg-white pb-8">
        <p className="mb-2 text-sm font-semibold text-[#105d97]">UniFlow by Univi</p>
        <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
          Đồng Phục Yoga Pilates Thiết Kế Theo Yêu Cầu Cho Studio Và Cộng Đồng Wellness
        </h2>
        <div className="mt-4 space-y-2s text-base leading-relaxed text-gray-700">
          <p>
            Đừng chọn đồng phục Yoga Pilates chỉ vì đẹp. Một set đồ lên hình tốt vẫn có thể thất bại
            trong lớp học nếu vải bí nóng, legging tụt cạp, áo cuộn khi nâng tay hoặc dáng áo quá
            rộng khiến giáo viên khó quan sát chuyển động của học viên.
          </p>
          <p>
            Với Yoga Studio, Pilates Studio và Wellness Center,{' '}
            <InlineLink href="/gioi-thieu">Đồng Phục Univi</InlineLink> xem đồng phục là một phần của
            trải nghiệm dịch vụ: hỗ trợ chuyển động, tăng nhận diện, tạo cảm giác chuyên nghiệp và
            giúp studio xây dựng cộng đồng có bản sắc riêng.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f82]"
          >
            Nhận tư vấn
          </button>
          <Link
            href="#bo-suu-tap-uniflow"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem UniFlow
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

      <Section id="dong-phuc-yoga-pilates-la-gi" title="1. Đồng Phục Yoga Pilates Không Chỉ Là Trang Phục" className="border-t border-gray-100">
        <div className="space-y-3 leading-relaxed">
          <p>
            Đồng phục Yoga Pilates là bộ trang phục dành cho giáo viên, HLV, lễ tân, tư vấn viên,
            hội viên, lớp workshop, retreat hoặc chương trình wellness cho doanh nghiệp. Bộ này có
            thể gồm áo bra, legging, croptop, tank top, T-shirt, Polo thể thao, áo khoác nhẹ và sản
            phẩm sự kiện.
          </p>
          <p>
            Đồ tập cá nhân chỉ cần phù hợp một người. Đồng phục studio phải phù hợp nhiều vóc dáng,
            nhiều vai trò, nhiều tần suất sử dụng và vẫn giữ được hình ảnh thương hiệu thống nhất.
          </p>
          <p>
            Vì vậy, <InlineLink href="/bai-viet/dong-phuc-yoga-studio">đồng phục Yoga Studio</InlineLink>{' '}
            không nên bắt đầu từ câu hỏi màu nào đẹp, mà nên bắt đầu từ người mặc vận động như thế
            nào, cần cảm giác gì trên da và studio muốn tạo trải nghiệm ra sao.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="/images/banner-yoga.jpg"
            alt="Đồng phục Yoga Pilates cho studio và cộng đồng Wellness"
            caption="Đồng phục Yoga Pilates là một phần của trải nghiệm studio, không chỉ là một bộ đồ tập."
            priority
          />
        </div>
      </Section>

      <Section id="nang-luc-Univi" title="2. Năng Lực Sản Xuất Và Thông Tin Nhanh">
        <p className="mb-3 leading-relaxed">
          Các dự án đồng phục Yoga Pilates cần một đối tác hiểu cả sản phẩm lẫn cách vận hành phòng
          tập. Khi studio mở thêm lớp, tuyển thêm HLV hoặc tổ chức workshop mới,{' '}
          <InlineLink href="/xuong-may-dong-phuc-univi">xưởng sản xuất đồng phục thể thao</InlineLink>{' '}
          cần bảo đảm khả năng tái sản xuất và kiểm soát chất lượng. Studio có thể xem thêm{' '}
          <InlineLink href="/ho-so-nang-luc">hồ sơ năng lực Univi</InlineLink> trước khi lựa chọn đối tác.
        </p>
        <div className="mb-6 overflow-hidden border border-gray-200">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/0AABoh2a-Sk"
            title="Năng lực sản xuất đồng phục thể thao Univi"
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

      <Section id="vi-sao-studio-can-dong-phuc" title="3. Vì Sao Yoga Studio Và Pilates Studio Cần Đồng Phục Riêng?">
        <p className="mb-4 leading-relaxed">
          Khi studio muốn tăng nhận diện, mở thêm cơ sở hoặc xây cộng đồng hội viên, trang phục rời
          rạc bắt đầu tạo ra khoảng trống thương hiệu. Đồng phục giúp biến hình ảnh đội ngũ từ mỗi
          người một phong cách thành một hệ nhận diện thống nhất hơn.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {studioReasons.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          Nếu studio muốn tách đồng phục đội ngũ và đồng phục hội viên, có thể tham khảo{' '}
          <InlineLink href="/giai-phap-2s">giải pháp 2S Uniform</InlineLink>
          .
        </p>
      </Section>

      <Section id="giai-phap-theo-vai-tro" title="4. Giải Pháp Đồng Phục Theo Từng Vai Trò Trong Studio">
        <p className="mb-4 leading-relaxed">
          Sai lầm phổ biến là chọn một mẫu cho tất cả. Univi thường tư vấn theo cách giữ chung màu
          sắc và logo, nhưng không ép mọi vị trí mặc giống hệt nhau.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {roleSolutions.map((item) => (
            <TextCard key={item.title} title={item.title}>
              <p>{item.text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="/images/dong-phuc-yoga-pilates.jpg"
            alt="Đồng phục theo vai trò trong Yoga Pilates Studio"
            caption="Mỗi vai trò trong studio cần tiêu chí riêng về chất liệu, dáng mặc và mức độ nhận diện."
          />
        </div>
      </Section>

      <Section id="chat-lieu" title="5. Đừng Chọn Đồng Phục Yoga Chỉ Vì Đẹp, Hãy Chọn Vì Chất Vải">
        <div className="space-y-3 leading-relaxed">
          <p>
            Chất liệu là phần quan trọng nhất của đồng phục Yoga Pilates. Da tiếp xúc trực tiếp với
            vải trong thời gian dài; người tập có thể giữ tư thế, nằm trên thảm, xoắn người hoặc vận
            động trong không gian kín.
          </p>
          <p>
            <InlineLink href="/vai-super-cool-la-gi">Vải Super Cool</InlineLink>{' '}
            phù hợp với HLV Yoga, giáo viên Pilates và các sản phẩm ôm như bra, legging hoặc croptop.
            Với các vị trí cần áo đứng dáng hơn, UNI BLENDED có thể là lựa chọn cân bằng.
          </p>
          <p>
            Với HLV dạy nhiều ca hoặc lớp đông người, công nghệ UNI DRY hỗ trợ kiểm soát cảm giác
            ẩm bết tốt hơn. Studio cũng có thể kết hợp giải pháp 2S Uniform để tách cấu hình vải cho
            đội ngũ và hội viên mà vẫn giữ chung nhận diện.
          </p>
        </div>
        <div className="mt-6">
          <FabricCardComponent />
        </div>
        <div className="mt-6">
          <SimpleTable
            headers={['Chất liệu', 'Cấu tạo / định vị', 'Ưu điểm', 'Phù hợp']}
            rows={materials}
          />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextCard title="Không nên chỉ chọn Cotton">
            <p>
              Cotton có thể mềm khi mặc nhẹ, nhưng dễ ẩm, nặng và bết khi giữ mồ hôi lâu. Yoga và
              Pilates cần vải đi theo chuyển động, hỗ trợ thoát ẩm và giữ dáng sau nhiều lần kéo giãn.
            </p>
          </TextCard>
          <TextCard title="Kiểm tra bằng chuyển động thật">
            <p>
              Studio nên thử mẫu bằng động tác gập, xoắn, squat, nâng tay, plank hoặc nằm trên máy
              Reformer trước khi sản xuất số lượng lớn.
            </p>
          </TextCard>
        </div>
      </Section>

      <Section id="thiet-ke" title="6. Hai Triết Lý Thiết Kế Mà Univi Theo Đuổi">
        <p className="mb-4 leading-relaxed">
          Chất liệu là nền tảng, nhưng thiết kế quyết định chất liệu đó hoạt động tốt hay không. Một
          loại vải co giãn vẫn có thể gây khó chịu nếu rập sai; một chiếc legging mềm vẫn có thể tụt
          nếu cạp không ổn định.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {designPrinciples.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55331826240_0abf20a194_b.jpg"
            alt="Thiết kế ôm sát hỗ trợ vận động Yoga Pilates"
            caption="Form đúng giúp trang phục không cuộn, không vướng và không che mất đường chuyển động."
          />
        </div>
      </Section>

      <Section id="uni-dry" title="7. Công Nghệ Vải Chuyên Dụng Của Univi">
        <div className="space-y-3 leading-relaxed">
          <p>
            <InlineLink href="/cong-nghe-uni-dry">Công nghệ UNI DRY</InlineLink>{' '}
            là công nghệ xử lý thoát ẩm được Univi ứng dụng trên các dòng chất liệu thể thao chuyên
            dụng. Với Yoga và Pilates, điều này giúp giảm cảm giác ẩm bết khi giữ tư thế hoặc hướng
            dẫn lớp trong thời gian dài.
          </p>
          <p>
            UNI SUPER COOL được ưu tiên vì bề mặt Polyamide mềm mịn, nhẹ và tạo cảm giác mát khi
            tiếp xúc da. Với khí hậu nóng ẩm tại Việt Nam, cảm giác này rất quan trọng trong các lớp
            đông người hoặc studio có lịch dạy liên tục.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55348273291_68c639f37b_b.jpg"
            alt="Vải Super Cool cho đồng phục Yoga Pilates"
            caption="Công nghệ vải chỉ có ý nghĩa khi người mặc cảm nhận được trong điều kiện sử dụng thật."
          />
        </div>
      </Section>

      <Section id="mo-hinh-studio" title="8. Giải Pháp Theo Từng Mô Hình Studio Và Wellness">
        <p className="mb-4 leading-relaxed">
          Không có một công thức đồng phục cố định cho mọi studio. Boutique Yoga Studio khác{' '}
          <InlineLink href="/bai-viet/dong-phuc-pilates">Pilates Reformer</InlineLink>; chuỗi studio
          khác resort Wellness, còn Wellness doanh nghiệp cần sản phẩm dễ mặc và phù hợp hình ảnh
          công ty.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {modelSolutions.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="bo-suu-tap-uniflow" title="9. Bộ Sưu Tập UniFlow Cho Yoga Pilates Wellness">
        <p className="mb-4 leading-relaxed">
          UniFlow là cách tổ chức hệ đồng phục Yoga Pilates theo vai trò, để studio có thể chọn đúng
          sản phẩm cho đúng người mặc. Tinh thần của UniFlow là gốc vững rồi mới diện sang: trước
          khi nói về màu sắc, sản phẩm phải giải quyết cảm giác mặc, chuyển động và độ bền sử dụng.
        </p>
        <ul className="mb-6 grid gap-3 md:grid-cols-2">
          {uniflowProducts.map((item) => (
            <li key={item} className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {item}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
          {uniflowModels.map(([code, name, summary, image, href, fit]) => (
            <Link key={code} href={href} className="block pb-6">
              <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-gray-50">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 220px"
                />
              </div>
              <div className="mt-1 space-y-1">
                <p className="text-sm font-bold text-[#105d97]">{code}</p>
                <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
                <p className="text-sm font-semibold text-gray-900">Phù hợp: {fit}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="quy-trinh" title="10. Năng Lực Sản Xuất Và Quy Trình Triển Khai">
        <p className="mb-5 leading-relaxed">
          Một dự án đồng phục tốt cần chất liệu, thiết kế và năng lực sản xuất đi cùng nhau. Studio
          nên đối chiếu hồ sơ năng lực và khả năng vận hành thực tế của xưởng may đồng phục Univi.
          Nếu chỉ có mẫu đẹp nhưng không tái sản xuất ổn định, studio sẽ gặp khó khi tuyển thêm nhân
          sự hoặc tổ chức chương trình mới.
        </p>
        <ProcessSteps variant="vertical" />
        <div className="mt-6">
          <SimpleTable
            headers={['Hạng mục', 'Cần chuẩn bị']}
            rows={processChecklist}
          />
        </div>
      </Section>

      <Section id="sai-lam-case-study-checklist" title="11. Sai Lầm, Case Study Mẫu Và Checklist Đặt May">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {painPoints.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {caseStudies.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-gray-50 p-5">
          <p className="text-lg font-bold text-gray-900">Checklist trước khi chốt đơn</p>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-gray-700 md:grid-cols-2">
            {[
              'Studio đã xác định rõ vai trò người mặc chưa?',
              'Mỗi vai trò có yêu cầu chất liệu và dáng mặc riêng chưa?',
              'Mẫu đã được mặc thử bằng chuyển động thật chưa?',
              'Bảng màu thương hiệu đã được chuẩn hóa chưa?',
              'Logo đã có vị trí cố định chưa?',
              'Studio có cần đồng phục cho hội viên, workshop hoặc retreat không?',
              'Nhà cung cấp có khả năng đặt bổ sung không?',
              'Có lưu file thiết kế, mã vải và size chart không?',
            ].map((item) => (
              <li key={item} className="border-l-2 border-[#105d97]/20 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="internal-link-hub" title="12. Bài Viết Liên Quan">
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

      <Section id="footer-seo" title="13. Đồng Phục Yoga Pilates Theo Yêu Cầu Tại Univi">
        <div className="space-y-4 leading-relaxed">
          <p>
            Đồng phục Yoga Pilates tốt không bắt đầu từ một mẫu đẹp, mà bắt đầu từ trải nghiệm người
            mặc. Với Yoga, đó là cảm giác mềm, mịn, thoải mái và không làm gián đoạn hơi thở. Với
            Pilates, đó là dáng mặc gọn, ổn định và đủ rõ để hỗ trợ căn chỉnh chuyển động.
          </p>
          <p>
            Ở góc độ studio, đồng phục còn là công cụ nhận diện, truyền thông và xây dựng cộng đồng.
            Khi đồng phục đội ngũ và đồng phục hội viên được triển khai đúng cách, studio có thể tăng
            giá trị cảm nhận của dịch vụ và tạo nền tảng cho workshop, retreat hoặc chương trình
            wellness doanh nghiệp.
          </p>
          <p>
            Nếu bạn đang xây dựng Yoga Studio, Pilates Studio, trung tâm Wellness hoặc chương trình
            wellness doanh nghiệp, hãy để Univi tư vấn một hệ đồng phục phù hợp với mô hình thực tế
            của bạn.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="/images/yoga-1.jpg"
            alt="Đồng phục Yoga Pilates theo yêu cầu tại Univi"
            caption="Univi phát triển đồng phục Yoga Pilates theo nguyên tắc đúng chất liệu, đúng vai trò, đúng chuyển động và đúng nhận diện thương hiệu."
          />
        </div>
      </Section>

      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
              Univi SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl font-bold md:text-2xl">
              Liên Hệ Với Xưởng May Đồng Phục Univi Ngay Hôm Nay
            </h2>

            <div className="mt-3 grid gap-1 text-sm text-blue-50">
              <p><span className="font-bold">Văn phòng:</span> Nhà D14, đường Thanh Bình, phường Hà Đông, Hà Nội</p>
              <p><span className="font-bold">Xưởng sản xuất:</span> Xã Thọ An, Huyện Đan Phượng, Hà Nội</p>
              <p><span className="font-bold">Hotline:</span> 0834.204.999 / 096.156.7997</p>
              <p><span className="font-bold">Email:</span> dongphucUnivi@gmail.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#105d97] hover:bg-blue-50"
          >
            Nhận tư vấn đồng phục Yoga Pilates
          </button>
        </div>
      </section>

      <Section id="faq" title="Câu Hỏi Thường Gặp Về Đồng Phục Yoga Pilates">
        <div className="space-y-3">
          {yogaPilatesFaqs.map(([question, answer]) => (
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
        source="Đồng phục Yoga Pilates - Nhận tư vấn"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}

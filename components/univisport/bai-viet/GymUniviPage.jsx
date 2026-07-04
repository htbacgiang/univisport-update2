import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import FabricCardComponent from '../FabricCardComponent';
import ProcessSteps from '../ProcessSteps';

const heroStats = [
  'Xưởng 2.000m2 tại Đan Phượng',
  'Công suất 100.000 sản phẩm/tháng',
  'Công nghệ UNI DRY',
  'Phòng R&D riêng',
  'Thiết kế miễn phí',
  'Giao hàng toàn quốc',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m2 tại Đan Phượng', 'Chủ động sản xuất, kiểm soát chất lượng và tiến độ cho phòng Gym, PT Studio và chuỗi Fitness Center.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp đơn B2B, chuỗi phòng tập, sự kiện hội viên và nhu cầu đặt bổ sung theo từng cơ sở.'],
  ['Công nghệ UNI DRY', 'Hỗ trợ thoát ẩm một chiều, giảm cảm giác bí bách ở vùng lưng, vai, nách và cổ áo.'],
  ['Phòng R&D riêng', 'Nghiên cứu chất liệu, form dáng, trải nghiệm vận động và khả năng tái sản xuất đồng bộ.'],
  ['Thiết kế miễn phí', 'Lên concept theo màu thương hiệu, logo, vai trò nhân sự, Staff Uniform và Member Uniform.'],
  ['Đặt từ 10 áo ở dòng phù hợp', 'Phòng tập mới có thể bắt đầu gọn với đồng phục PT, lễ tân hoặc áo member.'],
];

const reasons = [
  ['Tạo ấn tượng đầu tiên', 'Đồng phục chỉn chu giúp khách mới thấy phòng tập có hệ thống vận hành rõ ràng ngay tại quầy lễ tân và sàn tập.'],
  ['Xây dựng thương hiệu', 'Đội ngũ trở thành bộ nhận diện di động trong ảnh lớp nhóm, video tư vấn, livestream và nội dung social.'],
  ['Phân vai đội ngũ', 'Hội viên dễ nhận ra ai là PT, HLV sàn, lễ tân, sale consultant, quản lý ca hoặc nhân sự vận hành.'],
  ['Gia tăng trải nghiệm hội viên', 'Hội viên mới dễ tìm đúng người hỗ trợ, còn hội viên lâu năm có thêm cảm giác cộng đồng qua áo member, challenge hoặc workshop.'],
  ['Hỗ trợ bán hàng và marketing', 'Hình ảnh đội ngũ ổn định giúp phòng tập sản xuất nội dung, chạy quảng cáo và truyền thông sự kiện tốt hơn.'],
];

const roleSolutions = [
  {
    title: 'Personal Trainer',
    text: 'Cần form gọn, co giãn tốt, thoát ẩm, đủ tôn dáng nhưng không bó đến mức cản trở động tác. Polo thể thao phù hợp PT senior; T-shirt thể thao hợp môi trường năng động và thị phạm liên tục.',
  },
  {
    title: 'Huấn luyện viên GroupX',
    text: 'Ưu tiên T-shirt thể thao, tanktop trainer hoặc áo co giãn 4 chiều. Lớp HIIT, cardio, dance fitness cần áo nhẹ, thoáng và không vướng vai.',
  },
  {
    title: 'Lễ tân phòng Gym',
    text: 'Cần khác HLV ở độ chỉn chu, đứng form, bền màu và tạo cảm giác dịch vụ. Polo thể thao hoặc áo phối nhận diện thương hiệu là lựa chọn thực tế.',
  },
  {
    title: 'Sale Consultant',
    text: 'Cần trang phục tạo cảm giác tin cậy khi tư vấn gói tập và đưa khách tham quan. Có thể dùng cùng hệ màu thương hiệu nhưng khác chi tiết cổ áo, bo tay hoặc bảng tên.',
  },
  {
    title: 'Quản lý CLB',
    text: 'Nên dùng Polo thể thao cao cấp, màu trung tính hoặc tone phụ thương hiệu, có dấu hiệu nhận diện riêng để hội viên và đội ngũ dễ tìm khi cần xử lý vận hành.',
  },
  {
    title: 'Kỹ thuật viên và vận hành',
    text: 'Cần đồng phục bền, thoáng, dễ giặt, ít nhăn, không cản trở thao tác, màu khó bám bẩn và logo đủ rõ trong khu vực thiết bị, locker hoặc hậu cần.',
  },
  {
    title: 'Hội viên VIP và sự kiện',
    text: 'Áo member, áo VIP, áo challenge hoặc áo workshop giúp phòng tập xây cộng đồng và có thể phát triển thành merchandise nếu cộng đồng đủ mạnh.',
  },
];

const materialRows = [
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm', 'Hỗ trợ đưa hơi ẩm từ da ra lớp ngoài vải để giảm bết lưng, bí nách và ẩm cổ áo.', 'HLV, PT, Functional Training, cardio, ca làm việc dài'],
  ['UNI QUICK DRY', 'Polyester cao cấp nhanh khô', 'Nhẹ, khô nhanh, dễ bảo quản, phù hợp số lượng lớn và tần suất giặt cao.', 'Áo member, áo challenge, T-shirt Gym, áo sự kiện'],
  ['UNI SUPER COOL', 'Polyamide mềm mịn', 'Mềm, mượt, mát, mịn, co giãn tốt và giảm ma sát khi tiếp xúc da.', 'PT cao cấp, boutique gym, GroupX, Yoga trong Fitness Center'],
  ['UNI BLENDED', 'Nhóm vải pha cân bằng', 'Đứng form hơn, dễ mặc hằng ngày, cân bằng hiệu năng vận động và hình ảnh dịch vụ.', 'Lễ tân, sale, quản lý, Polo thể thao'],
  ['UNI POWERZIP', 'Polo thể thao khóa kéo', 'Gọn, hiện đại, cao cấp hơn T-shirt nhưng vẫn giữ tính vận động.', 'PT senior, quản lý sàn, HLV lớp premium, đội sự kiện'],
];

const painPoints = [
  ['Chọn vải quá dày', 'Dày không đồng nghĩa với bền. Nếu thoát ẩm kém, áo sẽ nặng, nóng bí và nhanh bị đội ngũ bỏ qua.'],
  ['Mockup đẹp nhưng mặc không tốt', 'Logo lớn ở vùng kéo căng, phối màu rườm rà ở vai, form quá bó hoặc cổ áo cứng đều có thể cản trở vận động.'],
  ['Không phân vai màu sắc', 'HLV, PT, sale, lễ tân và hội viên dùng chung một mẫu khiến khách khó nhận diện người hỗ trợ trong giờ cao điểm.'],
  ['Không lưu file thiết kế', 'Đợt đặt sau dễ lệch màu, lệch logo hoặc lệch form nếu không lưu mã vải, file thiết kế, size chart và kỹ thuật hoàn thiện.'],
  ['Không tính mở rộng hệ thống', 'Chuỗi phòng tập cần xác định từ đầu mẫu cho nhân sự, hội viên, sự kiện và sản phẩm có thể tái sản xuất khi mở cơ sở mới.'],
];

const designPrinciples = [
  ['Athletic Fit', 'Phù hợp HLV và PT vì tạo hình ảnh gọn, khỏe và thể thao. Form cần ôm vừa, không siết nách hoặc kéo vai khi thị phạm.'],
  ['Raglan tăng biên độ vai', 'Đường ráp chéo từ cổ xuống nách giúp vai linh hoạt hơn khi nâng tay, kéo xô, plank, stretching hoặc demo động tác.'],
  ['Đường may giảm ma sát', 'Nên kiểm tra vùng vai, nách, cổ áo và sườn áo vì đây là các điểm dễ ma sát khi tập lặp lại.'],
  ['Logo không cản chuyển động', 'Logo ngực trái, sau lưng hoặc tay áo nên có thứ bậc rõ; tránh đặt logo quá lớn ở vùng thường xuyên kéo căng.'],
  ['Hỗ trợ cường độ cao', 'Với HIIT, cardio, bootcamp hoặc functional training, áo cần nhẹ, thoát ẩm, co giãn và không gây vướng.'],
];

const modelSolutions = [
  ['Gym Private', 'Ưu tiên đồng phục PT và HLV trước: Polo hoặc T-shirt Athletic Fit, màu tiết chế, logo gọn và chất liệu SUPER COOL hoặc BLENDED theo định vị.'],
  ['Boutique Fitness Studio', 'Cần nhận diện rõ trong ảnh, video và social. HLV lớp nhóm có thể dùng T-shirt, tanktop hoặc áo phối màu theo bộ nhận diện.'],
  ['Fitness Center', 'Có nhiều điểm chạm: lễ tân, sale, PT, HLV sàn, quản lý, hội viên, lớp nhóm và sự kiện. Nên triển khai theo hệ thống thay vì từng mẫu rời.'],
  ['Chuỗi phòng tập', 'Cần chuẩn hóa form, màu, chất liệu, vị trí logo và file thiết kế để mỗi cơ sở mới không lệch hình ảnh.'],
  ['Cross Training Studio', 'Ưu tiên chất liệu thoát ẩm, nhanh khô, co giãn và form không cản vai lưng cho HIIT, bootcamp hoặc lớp cường độ cao.'],
  ['Functional Training Studio', 'Cần kiểm tra kỹ vùng vai, nách, lưng trên và gấu áo. Nếu có sự kiện ngoài trời, nên có thêm áo member nhanh khô.'],
  ['Hybrid Training và Strength & Conditioning', 'Cần form Athletic Fit, biên độ vai rộng và chất liệu chịu được cả bài sức mạnh, conditioning lẫn các buổi tập hỗn hợp cường độ cao.'],
  ['Recovery Zone', 'Nhân sự hỗ trợ phục hồi cần trang phục mềm, gọn, đứng form vừa đủ và khác màu đội HLV để hội viên nhận diện đúng khu vực dịch vụ.'],
];

const productGroups = [
  ['Polo PT', 'PT senior, Head Coach, quản lý sàn hoặc phòng tập cần hình ảnh tư vấn cao hơn.', 'SUPER COOL, BLENDED hoặc cấu hình Polo thể thao', 'https://live.staticflickr.com/65535/55265084647_9069991283_b.jpg'],
  ['T-shirt PT', 'HLV lớp nhóm, functional training, HIIT hoặc đội ngũ thường xuyên thị phạm.', 'UNI DRY, UNI QUICK DRY, vải co giãn thoát ẩm', 'https://live.staticflickr.com/65535/55266185304_dc8d39cfde_b.jpg'],
  ['Áo dài tay raglan', 'Phòng máy lạnh, mùa lạnh, lớp ngoài trời, PT Studio hoặc đội nhóm cần hình ảnh gọn hơn.', 'QUICK DRY, UNI DRY', 'https://live.staticflickr.com/65535/55344727492_5af4cfe3e6_b.jpg'],
  ['Đồng phục lễ tân, sale, quản lý', 'Nhóm cần hình ảnh dịch vụ, đứng form và khác biệt vừa đủ với HLV.', 'UNI BLENDED, Polo thể thao', 'https://live.staticflickr.com/65535/55358736832_0baa501a38_b.jpg'],
  ['Áo member, VIP, challenge', 'Hội viên, cộng đồng lớp nhóm, workshop, sự kiện hoặc merchandise.', 'QUICK DRY, UNI DRY, cấu hình dễ mặc', 'https://live.staticflickr.com/65535/55342902322_3613b86d05_b.jpg'],
];


const rolloutScenarios = [
  ['Gym Private', 'Bắt đầu từ đồng phục PT và HLV, sau đó mở rộng sang áo member hoặc VIP.'],
  ['Fitness Center', 'Triển khai theo vai trò: lễ tân, sale, PT, HLV, quản lý và hội viên để vận hành rõ ràng hơn.'],
  ['Chuỗi phòng tập', 'Ưu tiên bộ quy chuẩn tái sản xuất để các cơ sở không lệch màu, lệch form hoặc lệch nhận diện theo thời gian.'],
  ['Franchise', 'Đưa đồng phục vào brand manual: màu, logo, chất liệu, size, vị trí in và quy trình đặt bổ sung.'],
];

const relatedLinks = [
  ['Giải pháp 2S Uniform', '/giai-phap-2s'],
  ['Công nghệ UNI DRY', '/cong-nghe-uni-dry'],
  ['Vải Super Cool là gì', '/vai-super-cool-la-gi'],
  ['Đồng phục Fitness Center', '/dong-phuc-fitness-center'],
  ['Đồng phục PT Gym', '/dong-phuc-pt'],
  ['Đồng phục lễ tân phòng Gym', '/bai-viet/dong-phuc-le-tan-phong-gym'],
  ['Đồng phục phòng tập theo yêu cầu', '/bai-viet/dong-phuc-phong-tap-theo-yeu-cau'],
  ['Xưởng may đồng phục thể thao UNIVI', '/xuong-may-dong-phuc-univi'],
];

export const gymFaqs = [
  ['Đồng phục Gym nên dùng chất liệu gì?', 'Đồng phục Gym nên chọn chất liệu theo vai trò. HLV và PT nên ưu tiên UNI SUPER COOL hoặc cấu hình vải co giãn, thoát ẩm tốt. Hội viên, áo sự kiện và áo member có thể dùng UNI QUICK DRY vì nhẹ, nhanh khô và dễ bảo quản. Lễ tân, sale và quản lý phù hợp với UNI BLENDED hoặc Polo thể thao đứng form.'],
  ['Đồng phục Gym có cần co giãn 4 chiều không?', 'Có, đặc biệt với HLV, PT và Fitness Instructor. Co giãn 4 chiều giúp người mặc nâng tay, xoay vai, cúi người, plank, squat và thị phạm động tác linh hoạt hơn, từ đó giảm cảm giác bị kéo căng ở vai, lưng và nách.'],
  ['Phòng Gym nên chọn Polo hay T-shirt cho HLV?', 'Polo phù hợp với PT senior, Head Coach, quản lý sàn hoặc mô hình cần hình ảnh dịch vụ cao hơn. T-shirt thể thao phù hợp với HLV lớp nhóm, functional training, cardio và môi trường phòng Gym năng động. Nhiều phòng tập nên kết hợp cả hai theo vai trò.'],
  ['Đồng phục PT khác gì đồng phục hội viên?', 'Đồng phục PT ưu tiên nhận diện rõ, form gọn, hình ảnh chuyên nghiệp và khả năng hỗ trợ vận động khi huấn luyện trực tiếp. Đồng phục hội viên ưu tiên sự thoải mái, dễ mặc, nhanh khô và phù hợp nhiều vóc dáng.'],
  ['Phòng tập có nên bán đồng phục cho hội viên không?', 'Có. Áo hội viên, áo challenge, áo workshop hoặc áo VIP giúp tăng nhận diện thương hiệu, tạo cảm giác cộng đồng và mở thêm giá trị merchandise cho phòng tập. Đây là một phần quan trọng của Member Uniform trong hệ 2S Uniform.'],
  ['UNIVI có hỗ trợ thiết kế theo màu thương hiệu không?', 'Có. UNIVI hỗ trợ tư vấn phối màu, vị trí logo, form dáng, chất liệu và mockup theo bộ nhận diện thương hiệu của từng phòng Gym, PT Studio hoặc Fitness Center.'],
  ['Có lên mockup trước khi sản xuất không?', 'Có. Mockup giúp phòng tập hình dung phối màu, logo, vị trí in, vai trò nhân sự và tổng thể hệ đồng phục trước khi chuyển sang sản xuất.'],
  ['Số lượng đặt tối thiểu là bao nhiêu?', 'Theo chính sách đối tác trong dữ liệu sản phẩm, một số dòng phù hợp có thể bắt đầu từ 10 áo. Với mẫu riêng hoàn toàn theo yêu cầu, số lượng tối thiểu có thể thay đổi theo cấu hình sản phẩm, chất liệu và mức độ tùy chỉnh.'],
  ['Có đặt bổ sung sau khi tuyển thêm nhân sự không?', 'Có. Để đặt bổ sung không lệch màu hoặc lệch logo, phòng tập nên lưu lại file thiết kế, mã màu, chất liệu, form, bảng size và kỹ thuật hoàn thiện ngay từ đơn đầu tiên.'],
  ['UNIVI có hỗ trợ chuỗi phòng tập nhiều cơ sở không?', 'Có. Với chuỗi phòng tập, UNIVI có thể tư vấn hệ đồng phục theo 2S Uniform, gồm Staff Uniform cho nhân sự và Member Uniform cho hội viên, đồng thời lưu chuẩn tái sản xuất để triển khai đồng bộ cho nhiều cơ sở.'],
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

export default function GymUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-800">
      <section className="bg-white pb-8">
        <p className="mb-2 text-sm font-semibold text-[#105d97]">Smart Sport Uniform by UNIVI</p>
        <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
          Đồng Phục Gym Thiết Kế Theo Yêu Cầu Cho Phòng Tập Và Chuỗi Fitness Center
        </h2>
        <div className="mt-4 space-y-3 text-base leading-relaxed text-gray-700">
          <p>
            Một phòng Gym có thể đầu tư mạnh vào thiết bị, ánh sáng, gói hội viên và truyền thông,
            nhưng hình ảnh đội ngũ trên sàn tập vẫn là điểm chạm hội viên nhìn thấy mỗi ngày.
          </p>
          <p>
            Đồng phục Gym không chỉ là áo để nhân sự mặc trong ca làm việc. Với{' '}
            <Link href="/gioi-thieu" className="font-semibold text-[#105d97] hover:underline">
              Đồng Phục Univi
            </Link>
            , đây là hệ thống nhận diện giúp phân vai đội ngũ, hỗ trợ vận hành, tăng sự chuyên nghiệp
            và tạo cảm giác tin cậy cho hội viên.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f82]"
          >
            Nhận thiết kế miễn phí
          </button>
          <Link
            href="#bo-suu-tap-gym"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem bộ sưu tập
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

      <Section id="dong-phuc-gym-khong-chi-de-mac" title="1. Đồng Phục Gym Không Chỉ Để Mặc" className="border-t border-gray-100">
        <div className="space-y-3 leading-relaxed">
          <p>
            Đồng phục Gym là một phần của trải nghiệm hội viên. Khi khách mới bước vào quầy lễ tân,
            nhìn thấy HLV trên sàn tập hoặc tham gia buổi tư vấn đầu tiên với PT, họ không chỉ đánh
            giá thiết bị mà còn đánh giá cách phòng tập vận hành.
          </p>
          <p>
            Một hệ đồng phục tốt cần xử lý đồng thời năm việc: tăng độ chuyên nghiệp, tạo nhận diện
            thương hiệu, phân vai đội ngũ rõ ràng, hỗ trợ bán hàng và chăm sóc hội viên, đồng thời
            giúp người mặc vận động thoải mái.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55231241008_13de6ef716_b.jpg"
            alt="Đồng phục Gym thiết kế theo yêu cầu cho phòng tập và Fitness Center"
            caption="Hệ đồng phục Gym giúp phòng tập tạo nhận diện ngay từ điểm chạm đầu tiên."
            priority
          />
        </div>
      </Section>

      <Section id="nang-luc-univi" title="2. Năng Lực Sản Xuất Và Proof Point">
        <p className="mb-3 leading-relaxed">
          Với UNIVI, đồng phục không bắt đầu từ câu hỏi mẫu nào đẹp. Câu hỏi đúng hơn là: ai mặc,
          mặc trong bối cảnh nào, vận động ra sao, cần hình ảnh thương hiệu thế nào và phòng tập có
          cần đặt bổ sung cho giai đoạn sau không. Chủ đầu tư có thể đối chiếu{' '}
          <Link href="/ho-so-nang-luc" className="font-semibold text-[#105d97] hover:underline">
            hồ sơ năng lực
          </Link>{' '}
          và khả năng vận hành của{' '}
          <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97] hover:underline">
            xưởng may đồng phục thể thao
          </Link>{' '}
          trước khi triển khai cho toàn hệ thống.
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

      <Section id="vi-sao-phong-gym-can-dong-phuc" title="3. Vì Sao Phòng Gym Cần Đồng Phục Chuyên Nghiệp?">
        <p className="mb-4 leading-relaxed">
          Đồng phục Gym ảnh hưởng trực tiếp đến cách hội viên cảm nhận dịch vụ. Một đội ngũ mặc đồng
          phục đồng bộ tạo cảm giác phòng tập có quy trình, có tiêu chuẩn và có tổ chức.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {reasons.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="giai-phap-theo-vai-tro" title="4. Giải Pháp Đồng Phục Theo Từng Vai Trò Trong Phòng Tập">
        <p className="mb-4 leading-relaxed">
          Một hệ thống đồng phục Gym hiệu quả nên bắt đầu từ bản đồ vai trò. Mỗi vị trí có cường độ
          vận động, tần suất giao tiếp và mục tiêu hình ảnh khác nhau.
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
            src="https://live.staticflickr.com/65535/55266071574_010d6a37ab_b.jpg"
            alt="Giải pháp đồng phục Gym theo từng vai trò trong phòng tập"
            caption="Mỗi vai trò trong phòng Gym cần một cấu hình đồng phục riêng nhưng vẫn chung ngôn ngữ thương hiệu."
          />
        </div>
      </Section>

      <Section id="chat-lieu" title="5. Chọn Chất Liệu Quyết Định Trải Nghiệm Tập Luyện">
        <div className="space-y-3 leading-relaxed">
          <p>
            Chất liệu là phần quyết định đồng phục có được đội ngũ sử dụng lâu dài hay không. Một
            mẫu áo nhìn đẹp trên mockup nhưng nóng, giữ mồ hôi hoặc thiếu co giãn sẽ nhanh chóng bị
            bỏ qua trong vận hành thật.
          </p>
          <p>
            <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97] hover:underline">
              Công nghệ UNI DRY
            </Link>{' '}
            hỗ trợ đưa hơi ẩm từ bề mặt da ra lớp ngoài vải, giúp giảm cảm giác bí bách khi HLV và
            PT vận động trong ca dài.
          </p>
        </div>
        <div className="mt-6">
          <FabricCardComponent />
        </div>
        <div className="mt-6">
          <SimpleTable
            headers={['Chất liệu', 'Cấu tạo / định vị', 'Ưu điểm', 'Phù hợp']}
            rows={materialRows}
          />
        </div>
      </Section>

      <Section id="sai-lam" title="6. Những Sai Lầm Khi Đặt Đồng Phục Gym">
        <p className="mb-4 leading-relaxed">
          Phần lớn lỗi đồng phục Gym không xuất hiện ở bản thiết kế. Chúng xuất hiện sau khi đội ngũ
          mặc thật: áo nóng, nhanh bết, logo lệch, form không hợp vai trò, hoặc các đợt đặt sau
          không giống đợt đầu.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {painPoints.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="/images/gym/495197135_1002214318712300_1164714111580418290_n.jpg"
            alt="Nhóm huấn luyện viên trong hệ đồng phục cho các mô hình phòng Gym"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Mỗi mô hình phòng tập cần cấu hình riêng, nhưng toàn đội ngũ vẫn nên giữ chung màu sắc, form dáng và hệ nhận diện.
          </figcaption>
        </figure>
      </Section>

      <Section id="cong-nghe-vai" title="7. Công Nghệ Vải Chuyên Dụng Của UNIVI">
        <div className="space-y-3 leading-relaxed">
          <p>
            UNIVI phát triển chất liệu theo triết lý đúng bộ môn, đúng chất liệu, đúng trải nghiệm.
            Gym khác{' '}
            <Link href="/dong-phuc-yoga-pilates" className="font-semibold text-[#105d97] hover:underline">
              Yoga Pilates
            </Link>
            , Running khác{' '}
            <Link href="/dong-phuc-pickleball" className="font-semibold text-[#105d97] hover:underline">
              Pickleball
            </Link>
            , vì vậy không nên dùng một loại vải cho mọi vai trò.
          </p>
          <p>
            <Link href="/vai-super-cool-la-gi" className="font-semibold text-[#105d97] hover:underline">
              UNI SUPER COOL
            </Link>{' '}
            phù hợp với PT cao cấp, boutique gym hoặc phòng tập định vị dịch vụ cao. UNI QUICK DRY
            phù hợp áo member và sự kiện; UNI BLENDED phù hợp lễ tân, sale, quản lý hoặc Polo đứng
            form.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextCard title="UNI DRY">
            <p>Hỗ trợ thoát ẩm ở vùng lưng, vai, nách và cổ áo, nơi dễ bết khi HLV vận động liên tục.</p>
          </TextCard>
          <TextCard title="UNI QUICK DRY">
            <p>Nhẹ, nhanh khô, thực dụng cho áo T-shirt Gym, áo dài tay vận động, áo challenge và áo cộng đồng.</p>
          </TextCard>
          <TextCard title="UNI SUPER COOL">
            <p>Mềm, mượt, mát, mịn, giảm ma sát và phù hợp môi trường PT cao cấp hoặc lớp GroupX cần cảm giác da tốt hơn.</p>
          </TextCard>
          <TextCard title="UNI POWERZIP">
            <p>Polo khóa kéo cân bằng giữa hình ảnh dịch vụ, sự gọn gàng và hiệu suất vận động.</p>
          </TextCard>
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="https://live.staticflickr.com/65535/55315579235_f3b9bc6d41_b.jpg"
            alt="Cận cảnh vải UNI SUPER COOL chuyên dụng cho đồng phục Gym"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Bề mặt vải UNI SUPER COOL mềm mịn, co giãn và phù hợp với đồng phục PT, HLV và Boutique Fitness.
          </figcaption>
        </figure>
      </Section>

      <Section id="thiet-ke" title="8. Thiết Kế Tối Ưu Hiệu Suất Vận Động">
        <p className="mb-4 leading-relaxed">
          Thiết kế đồng phục Gym không nên chỉ xử lý màu sắc và logo. Một mẫu áo tốt cần hỗ trợ
          chuyển động thật: nâng tay, xoay vai, cúi người, chống đẩy, kéo giãn, chạy ngắn, hướng dẫn
          máy và giao tiếp với hội viên trong nhiều giờ.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {designPrinciples.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="mo-hinh-phong-tap" title="9. Giải Pháp Theo Từng Mô Hình Phòng Tập">
        <p className="mb-4 leading-relaxed">
          Không phải mọi phòng Gym đều cần cùng một cấu hình đồng phục. Boutique Fitness, Hybrid
          Training, Strength & Conditioning, Cross Training và Recovery Zone có bản đồ vai trò
          khác nhau; mô hình vận hành sẽ quyết định số nhóm người mặc, mức độ phân vai, chất liệu và
          ngân sách.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {modelSolutions.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="https://live.staticflickr.com/65535/55348303761_ed7662817d_b.jpg"
            alt="Đồng phục PT, HLV tại phòng tập"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Mỗi mô hình phòng tập cần cấu hình riêng, nhưng toàn đội ngũ vẫn nên giữ chung màu sắc, form dáng và hệ nhận diện.
          </figcaption>
        </figure>
      </Section>

      <Section id="bo-suu-tap-gym" title="10. Bộ Sưu Tập Đồng Phục Gym UNIVI">
        <p className="mb-5 leading-relaxed">
          Catalog sản phẩm Gym của UNIVI có thể được quy hoạch thành một product hub cho nhiều nhu
          cầu: áo nền tảng, áo PT cao cấp, áo phối màu nhận diện, áo dài tay raglan, Polo khóa kéo
          và áo member.
        </p>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-6">
          {productGroups.map(([title, text, material, image]) => (
            <div key={title} className="pb-6">
              <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden bg-gray-50">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 280px"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-700">{text}</p>
                <p className="text-sm font-semibold text-gray-900">Hướng chất liệu: {material}</p>
              </div>
            </div>
          ))}
        </div>

      </Section>

      <Section id="giai-phap-2s" title="11. Giải Pháp 2S Uniform Và Năng Lực Sản Xuất">
        <div className="space-y-3 leading-relaxed">
          <p>
            Với phòng tập có nhiều nhóm nhân sự hoặc chuỗi đang mở rộng, đặt từng mẫu áo riêng lẻ
            thường tạo ra hệ thống rời rạc. Đây là lý do{' '}
            <Link href="/giai-phap-2s" className="font-semibold text-[#105d97] hover:underline">
              giải pháp 2S Uniform
            </Link>{' '}
            phù hợp với Gym và Fitness Center.
          </p>
          <p>
            2S Uniform gồm Staff Uniform cho HLV, PT, lễ tân, sale, quản lý và vận hành; Member
            Uniform cho hội viên, VIP, lớp cộng đồng, sự kiện, workshop hoặc merchandise.
          </p>
        </div>
        <div className="mt-6">
          <ProcessSteps variant="vertical" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rolloutScenarios.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55315396424_112c185301_b.jpg"
            alt="Quy trình triển khai đồng phục Gym theo giải pháp 2S Uniform"
            caption="2S Uniform giúp phòng tập đồng bộ Staff Uniform và Member Uniform theo cùng một ngôn ngữ thương hiệu."
          />
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

      <Section id="footer-seo" title="13. Đồng Phục Gym Theo Yêu Cầu Tại UNIVI">
        <div className="space-y-4 leading-relaxed">
          <p>
            Đồng phục Gym không chỉ là trang phục cho nhân sự phòng tập. Đó là một phần của vận hành
            thương hiệu, trải nghiệm hội viên và khả năng mở rộng hệ thống.
          </p>
          <p>
            Phòng Gym không nên chọn đồng phục theo một mẫu áo chung cho tất cả. Cách đúng hơn là
            phân vai đội ngũ, chọn chất liệu theo cường độ vận động, thiết kế theo nhận diện thương
            hiệu và lưu chuẩn tái sản xuất cho dài hạn.
          </p>
          <p>
            Với nền tảng R&D, công nghệ UNI DRY, hệ chất liệu thể thao chuyên dụng và giải pháp 2S
            Uniform, UNIVI có thể đồng hành với Gym Owner, PT Studio và chuỗi Fitness Center trong
            việc xây dựng hệ đồng phục chuyên dụng, đồng bộ và có giá trị thương hiệu rõ ràng.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55231505620_c9ef4cb492_b.jpg"
            alt="Đồng phục Gym theo yêu cầu tại UNIVI"
            caption="Một bộ đồng phục đúng giúp hội viên nhận diện người hỗ trợ, giúp đội ngũ tự tin hơn và giúp phòng tập duy trì hình ảnh nhất quán."
          />
        </div>
      </Section>

      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
              UNIVI SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl font-bold md:text-2xl">
              Liên Hệ Với Xưởng May Đồng Phục UNIVI Ngay Hôm Nay
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-50">
              Gửi UNIVI logo, màu thương hiệu, vai trò nhân sự, số lượng dự kiến, mô hình phòng tập
              và ngày cần hàng để được tư vấn chất liệu, mockup và giải pháp 2S Uniform phù hợp.
            </p>
            <div className="mt-3 grid gap-1 text-sm text-blue-50">
              <p><span className="font-bold">Văn phòng:</span> Nhà D14, đường Thanh Bình, phường Hà Đông, Hà Nội</p>
              <p><span className="font-bold">Xưởng sản xuất:</span> Xã Thọ An, Huyện Đan Phượng, Hà Nội</p>
              <p><span className="font-bold">Hotline:</span> 0834.204.999 / 096.156.7997</p>
              <p><span className="font-bold">Email:</span> dongphucunivi@gmail.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#105d97] hover:bg-blue-50"
          >
            Nhận tư vấn đồng phục Gym
          </button>
        </div>
      </section>

      <Section id="faq" title="Câu Hỏi Thường Gặp Về Đồng Phục Gym">
        <div className="space-y-3">
          {gymFaqs.map(([question, answer]) => (
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
        source="Đồng phục Gym - Nhận tư vấn"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}

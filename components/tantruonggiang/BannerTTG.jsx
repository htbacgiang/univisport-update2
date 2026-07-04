import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaChevronRight } from "react-icons/fa";
import ContactForm from "../header/ContactForm";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  // hasSlideChanged: chỉ true sau khi user/auto đã chuyển slide ít nhất 1 lần
  // → animation slideImg/content chỉ chạy khi chuyển slide, không chạy lúc mount đầu
  const [hasSlideChanged, setHasSlideChanged] = useState(false);
  const modalRef = useRef(null);

  const slides = [
    {
      image: "/images/slide-01.webp",
      mobileImage: "/images/slide-01.jpg",
      smallHeading: "ĐỒNG PHỤC HUẤN LUYỆN VIÊN",
      heading: "Chuyên nghiệp & Phong cách",
      description:
        "Không chỉ tối đa hiệu suất tập luyện mà còn là biểu tượng của một hệ thống chuyên nghiệp",
      collectionLink: "/san-pham",
    },
    {
      image: "/images/slide-03.webp",
      mobileImage: "/images/slide-03.jpg",
      smallHeading: "ĐỒNG PHỤC THỂ THAO",
      heading: "Năng Động & Sáng Tạo",
      description:
        "Bộ sưu tập đồng phục thể thao Univi đa dạng bộ môn, thiết kế theo ý tưởng riêng của các đội nhóm",
      collectionLink: "/san-pham",
    },
    {
      image: "/images/slide-02.webp",
      mobileImage: "/images/slide-02.jpg",
      smallHeading: "GIẢI PHÁP SMART SPORT UNIFORM",
      heading: "Cho Các Phòng Tập",
      description:
        "Được đánh giá cao nhờ tính ứng dụng vượt trội, tối ưu hiệu suất tập luyện. BST 2S Uniform không chỉ tạo sự đồng bộ thương hiệu mà còn mang đến diện mạo trẻ trung, năng động.",
      collectionLink: "/san-pham",
    },
  ];
  const heroHeading =
    "Đồng Phục Thể Thao Chuyên Nghiệp Cho Phòng Tập & Doanh Nghiệp";
  const activeSlide = slides[currentSlide] || slides[0];

  const changeSlide = useCallback((newIndex) => {
    if (animating) return;
    setAnimating(true);
    setHasSlideChanged(true); // đánh dấu đã chuyển slide ít nhất 1 lần
    setCurrentSlide(newIndex);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  useEffect(() => {
    if (isPaused || isFormOpen) return;
    const interval = setInterval(() => {
      changeSlide((currentSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length, isPaused, isFormOpen, changeSlide]);

  const goToPreviousSlide = useCallback(() => {
    changeSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  }, [currentSlide, slides.length, changeSlide]);

  const goToNextSlide = useCallback(() => {
    changeSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, changeSlide]);

  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFormOpen) return;
      if (e.key === "ArrowLeft") goToPreviousSlide();
      if (e.key === "ArrowRight") goToNextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPreviousSlide, goToNextSlide, isFormOpen]);

  useEffect(() => {
    if (!isFormOpen) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") toggleForm(); };
    const modal = modalRef.current;
    const elems = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = elems[0];
    const last = elems[elems.length - 1];
    const trapTab = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    first?.focus();
    modal.addEventListener("keydown", trapTab);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      modal.removeEventListener("keydown", trapTab);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen, toggleForm]);

  return (
    <>
      <section aria-labelledby="homepage-heading">
        <h1 id="homepage-heading"
          className="sr-only"
        >
          {heroHeading}
        </h1>
      </section>
      <section
        className="banner-ttg relative overflow-hidden w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* Background images - crossfade */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease",
              zIndex: currentSlide === index ? 1 : 0,
            }}
          >
            {/* Desktop Image — slide 0: priority + fetchPriority high, còn lại lazy */}
            <Image
              src={slide.image}
              alt={slide.smallHeading}
              fill
              className={`hidden sm:block ${hasSlideChanged && currentSlide === index ? "slide-img-enter" : ""}`}
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={90}
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "low"}
              sizes="100vw"
            />
            {/* Mobile Image — slide 0: priority, còn lại lazy */}
            <Image
              src={slide.mobileImage || slide.image}
              alt={slide.smallHeading}
              fill
              className={`block sm:hidden ${hasSlideChanged && currentSlide === index ? "slide-img-enter" : ""}`}
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={85}
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "low"}
              sizes="100vw"
            />
            {/* Gradient overlay mobile: full ảnh */}
            <div
              className="absolute inset-0 block sm:hidden"
              style={{ background: "rgba(0,0,0,0.45)" }}
            />
            {/* Gradient overlay desktop */}
            <div
              className="absolute inset-0 hidden sm:block"
              style={{
                background: index === 1
                  ? "radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 80%)"
                  : "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 80%)",
              }}
            />
          </div>
        ))}

        {/* Content - bên trái hoặc chính giữa */}
        <div className={`absolute inset-0 flex items-center z-10 justify-center text-center ${currentSlide === 1 ? "sm:justify-center sm:text-center" : "sm:justify-start sm:text-left"}`}>
          <div
            className={currentSlide === 1 ? "px-5" : "px-5 sm:px-10 md:pl-24 mb-4 sm:mb-0"}
            style={{ maxWidth: currentSlide === 1 ? "800px" : "" }}
          >
            <div
              key={currentSlide}
              className={`${hasSlideChanged ? "content-enter" : ""} flex flex-col items-center ${currentSlide === 1 ? "sm:items-center" : "sm:items-start"}`}
            >
              <p
                className="line1 text-white font-semibold uppercase mb-1 sm:mb-3 md:mb-4 mt-2"
                style={{
                  fontSize: "0.82rem",
                  letterSpacing: "0.18em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {activeSlide.smallHeading}
              </p>

              <p
                className="line2 text-white/95 font-semibold mb-2 md:mb-4 text-sm md:text-xl uppercase block"
                style={{
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  lineHeight: 1.2,
                }}
              >
                {activeSlide.heading}
              </p>
              <p
                className="line3 hidden md:block text-white/90 leading-relaxed mb-1 md:mb-4"
                style={{
                  fontSize: "1rem",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {activeSlide.description}
              </p>
              <div
                className={`line4 flex flex-wrap gap-2 sm:gap-3 justify-center ${currentSlide === 1 ? "" : "sm:justify-start"}`}
              >
                <a href={activeSlide.collectionLink} className="btn-shop">
                  Mua Ngay <FaChevronRight size={10} />
                </a>
                <button onClick={toggleForm} className="btn-contact">
                  Liên Hệ Ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow trái */}
        <div className="absolute inset-y-0 left-5 flex items-center z-20">
          <button onClick={goToPreviousSlide} className="nav-arrow" aria-label="Slide trước">
            <FaArrowLeft className="text-white text-lg" />
          </button>
        </div>

        {/* Arrow phải */}
        <div className="absolute inset-y-0 right-5 flex items-center z-20">
          <button onClick={goToNextSlide} className="nav-arrow" aria-label="Slide tiếp theo">
            <FaArrowRight className="text-white text-lg" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot-nav ${currentSlide === idx ? "active" : ""}`}
              onClick={() => changeSlide(idx)}
              aria-label={`Chuyển đến slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Modal liên hệ */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && toggleForm()}
          >
            <div
              ref={modalRef}
              className="my-4 w-full max-w-[1100px]"
              role="dialog"
              aria-labelledby="banner-contact-form-title"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                  <h2 id="banner-contact-form-title" className="text-lg font-bold uppercase">Liên hệ nhận báo giá</h2>
                  <button
                    onClick={toggleForm}
                    aria-label="Đóng form liên hệ"
                    className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-white"><ContactForm source="Banner TTG" /></div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

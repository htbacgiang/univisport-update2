import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import parse from 'html-react-parser';
import ContactForm from '../header/ContactForm';
import ProductSlider from './ProductSlider';
import {
  setColorIndex,
  setSize,
  resetSelection,
} from '../../store/productSlice';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TableOfContents from '../common/TableOfContents';
import { parseToc } from '../../utils/toc';
import { normalizeInternalLinkAttributes } from '../../utils/internalLinks';

// ─── Lightbox Component ──────────────────────────────────────────────────────
function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh trước"
      >
        <FaChevronLeft className="text-xl md:text-2xl" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh sau"
      >
        <FaChevronRight className="text-xl md:text-2xl" />
      </button>

      <div
        className="relative inline-flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-2 md:-top-7 md:-right-10 bg-gray-600 hover:bg-red-700 text-white rounded-full p-2 md:p-2.5 z-10 transition-colors shadow-lg"
          aria-label="Đóng"
        >
          <FaTimes className="text-base md:text-lg" />
        </button>
        <div className="relative w-[85vw] h-[85vh] md:w-[90vw] md:h-[90vh]">
          <Image
            src={photo}
            alt={`Ảnh ${currentIndex + 1}`}
            fill
            className="object-contain rounded-lg shadow-2xl"
            unoptimized={photo.startsWith('http')}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

// ─── Helper: map category slug → tên tiếng Việt ───────────────
const CATEGORY_NAMES = {
  'dong-phuc-gym': 'Đồng Phục Gym',
  'dong-phuc-yoga-pilates': 'Đồng Phục Yoga - Pilates',
  'dong-phuc-pickleball': 'Đồng Phục Pickleball',
  'dong-phuc-ao-gio': 'Đồng Phục Áo Gió',
  'dong-phuc-ao-polo': 'Đồng Phục Áo Polo',
  'dong-phuc-golf-tennis': 'Đồng Phục Golf - Tennis',
  'dong-phuc-chay-bo': 'Đồng Phục Chạy Bộ',
  'dong-phuc-mma': 'Đồng Phục MMA',
  'dong-phuc-cong-so': 'Đồng Phục Công Sở',
  'dong-phuc-team-building': 'Đồng Phục Team Building',
  'dong-phuc-ao-thun': 'Đồng Phục Áo Thun',
  'dong-phuc-le-tan': 'Đồng Phục Lễ Tân',
  'dong-phuc-su-kien': 'Đồng Phục Sự Kiện',
};

const SIZE_GUIDE_BY_SHIRT_TYPE = {
  'ao-thun': {
    label: 'Áo thun',
    image: '/images/bang-size-ao-thun.jpg',
  },
  'ao-polo': {
    label: 'Áo polo',
    image: '/images/bang-size-ao-polo.jpg',
  },
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useBodyScrollLock(isLocked) {
  useIsomorphicLayoutEffect(() => {
    if (!isLocked) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
    };

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyStyles.overflow;
    };
  }, [isLocked]);
}

const normalizeShirtType = (product) => {
  const rawType = product?.shirtType || product?.loaiAo || '';
  const normalized = rawType
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-');

  if (['ao-thun', 'thun', 't-shirt', 'tshirt'].includes(normalized)) return 'ao-thun';
  if (['ao-polo', 'polo'].includes(normalized)) return 'ao-polo';
  return '';
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return `/${imagePath}`;
};

const getGalleryItemSrc = (item) => {
  if (typeof item === 'string') return item;
  return item?.src || item?.url || item?.image || item?.secure_url || '';
};

const getGalleryDimensions = (item) => {
  const aspectRatio = item?.aspectRatio || 'landscape-3-4';
  const fallbackMap = {
    square: { width: 1, height: 1 },
    portrait: { width: 3, height: 4 },
    'landscape-3-4': { width: 4, height: 3 },
    landscape: { width: 4, height: 3 },
  };
  const fallback = fallbackMap[aspectRatio] || fallbackMap['landscape-3-4'];
  const width = Number(item?.width);
  const height = Number(item?.height);

  return {
    width: Number.isFinite(width) && width > 0 ? width : fallback.width,
    height: Number.isFinite(height) && height > 0 ? height : fallback.height,
  };
};

const getPhotoRatio = (photo) => {
  const width = Number(photo?.width);
  const height = Number(photo?.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return 4 / 3;
  }

  return width / height;
};

const buildGalleryRows = (photos, targetRatio = 5.2, maxPerRow = 5) => {
  const rows = [];
  let currentRow = [];
  let currentRatio = 0;

  photos.forEach((photo) => {
    currentRow.push(photo);
    currentRatio += getPhotoRatio(photo);

    if (currentRatio >= targetRatio || currentRow.length >= maxPerRow) {
      rows.push(currentRow);
      currentRow = [];
      currentRatio = 0;
    }
  });

  if (currentRow.length > 0) {
    const previousRow = rows[rows.length - 1];

    while (
      currentRow.length < 3 &&
      previousRow &&
      previousRow.length > 3 &&
      previousRow.length <= maxPerRow
    ) {
      currentRow.unshift(previousRow.pop());
    }

    rows.push(currentRow);
  }

  return rows;
};

// Breadcrumb Component
function Breadcrumb({ product }) {
  const category = product?.category || 'Đồng phục';
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const productName = product?.name || 'Sản phẩm';
  const categoryNameVN = product?.categoryNameVN || 'Đồng phục';

  return (
    <nav aria-label="Breadcrumb" className="mb-3 mt-[60px] md:mt-[70px]">
      <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-[#105d97] transition-colors">
            Trang chủ
          </Link>
        </li>
        <li><span className="text-gray-400">/</span></li>
        <li>
          <Link
            href={`/${categorySlug}`}
            className="hover:text-[#105d97] transition-colors"
          >
            {categoryNameVN}
          </Link>
        </li>
        <li><span className="text-gray-400">/</span></li>
        <li className="text-gray-700 font-medium" aria-current="page">
          {productName}
        </li>
      </ol>
    </nav>
  );
}

// ─── ProductReviews Component ────────────────────────────────────────────────
function formatRating(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '0.0';
  return (Math.floor(numericValue * 10) / 10).toFixed(1);
}

function StarRating({ value, onChange, size = 'lg', interactive = true }) {
  const [hovered, setHovered] = useState(0);
  const sizeCls = size === 'lg' ? 'text-2xl' : 'text-sm';

  // Non-interactive: phần thập phân từ .1 đến .9 hiển thị thành nửa sao.
  if (!interactive) {
    const numericValue = Number(value);
    const clampedValue = Number.isFinite(numericValue)
      ? Math.min(5, Math.max(0, numericValue))
      : 0;
    const fullStars = Math.floor(clampedValue);
    const hasHalfStar = clampedValue > fullStars;

    return (
      <div
        className={`inline-flex gap-0.5 ${sizeCls}`}
        aria-label={`${formatRating(value)} sao`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            return <FaStar key={star} className="text-yellow-400" />;
          }

          if (hasHalfStar && star === fullStars + 1) {
            return (
              <span key={star} className="relative inline-flex">
                <FaStar className="text-gray-300" />
                <FaStarHalfAlt className="absolute inset-0 text-yellow-400" />
              </span>
            );
          }

          return <FaStar key={star} className="text-gray-300" />;
        })}
      </div>
    );
  }

  // Interactive: bấm chọn số sao
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Chọn số sao">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-transform duration-150 cursor-pointer hover:scale-125 focus:outline-none ${sizeCls}`}
          aria-label={`${star} sao`}
          role="radio"
          aria-checked={value === star}
          tabIndex={0}
        >
          <FaStar
            className={`transition-colors duration-150 ${star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'
              }`}
          />
        </button>
      ))}
    </div>
  );
}

function ProductReviews({ productSlug, initialRating, initialReviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reviewCount, setReviewCount] = useState(initialReviewCount ?? 0);
  const [baseRating, setBaseRating] = useState(null);
  const [baseReviewCount, setBaseReviewCount] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [nameError, setNameError] = useState('');
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productSlug}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        if (data.reviewCount !== undefined) setReviewCount(data.reviewCount);
        if (data.baseRating !== undefined && data.baseRating !== null) setBaseRating(data.baseRating);
        if (data.baseReviewCount !== undefined && data.baseReviewCount !== null) setBaseReviewCount(data.baseReviewCount);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setNameError('');
    setRatingError('');
    setSubmitError('');

    if (!name.trim()) { setNameError('Vui lòng nhập tên của bạn'); valid = false; }
    if (!rating) { setRatingError('Vui lòng chọn số sao'); valid = false; }
    if (!valid) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');
      setReviews((prev) => [data.review, ...prev]);
      setReviewCount(data.reviewCount);
      if (data.baseRating !== undefined && data.baseRating !== null) setBaseRating(data.baseRating);
      if (data.baseReviewCount !== undefined && data.baseReviewCount !== null) setBaseReviewCount(data.baseReviewCount);
      setName('');
      setRating(0);
      setComment('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const numericReviewCount = Number(reviewCount);
  const fallbackReviewCount = Number.isFinite(numericReviewCount) ? numericReviewCount : 0;
  const numericBaseReviewCount = Number(baseReviewCount);
  const bCount = baseReviewCount !== null && Number.isFinite(numericBaseReviewCount)
    ? Math.max(0, numericBaseReviewCount)
    : Math.max(0, fallbackReviewCount - reviews.length);

  const numericBaseRating = Number(baseRating ?? initialRating);
  const bRating = Number.isFinite(numericBaseRating)
    ? Math.min(5, Math.max(0, numericBaseRating))
    : 5;
  const userRatingsSum = reviews.reduce((sum, review) => {
    const reviewRating = Number(review.rating);
    return Number.isFinite(reviewRating) ? sum + reviewRating : sum;
  }, 0);
  const totalCount = bCount + reviews.length;
  const averageRating = totalCount > 0
    ? ((bRating * bCount) + userRatingsSum) / totalCount
    : bRating;

  // Phân phối số lượng theo từng mức sao
  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const userCount = reviews.filter((r) => Number(r.rating) === star).length;
    const baseForStar = bCount > 0 && Math.round(bRating) === star ? bCount : 0;
    const count = userCount + baseForStar;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { star, count, pct };
  });


  return (
    <section className="mt-6 mx-auto" aria-labelledby="product-reviews-title">
      <div className="bg-white md:p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#105d97] rounded-full"></div>
          <h3 id="product-reviews-title" className="text-xl font-bold">
            Đánh giá sản phẩm
          </h3>
          <span className="ml-auto text-xs bg-[#105d97]/10 text-[#105d97] font-semibold px-2.5 py-1 rounded-full">
            {totalCount} đánh giá
          </span>
        </div>

        {/* Rating summary */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-4 bg-gray-50 rounded-2xl">
          <div className="flex flex-col items-center justify-center min-w-[120px] gap-1">
            <span className="text-5xl font-extrabold text-gray-900 leading-none">
              {formatRating(averageRating)}
            </span>
            <StarRating value={averageRating} interactive={false} size="sm" />
            <span className="text-xs text-gray-400 mt-1">{totalCount} đánh giá</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBars.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8 text-right">{star} ★</span>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review form */}
        <div className="mb-8 border border-gray-200 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-white to-blue-50/30">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
          {submitSuccess && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cảm ơn bạn đã đánh giá! Đánh giá của bạn đã được gửi thành công.
            </div>
          )}
          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  placeholder="Nhập tên của bạn..."
                  maxLength={100}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white focus:border-[#105d97]'
                    }`}
                />
                {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
              </div>
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-1.5">
                  Số sao <span className="text-red-500">*</span>
                </p>
                <StarRating value={rating} onChange={(v) => { setRating(v); setRatingError(''); }} size="lg" />
                {ratingError && <p className="text-xs text-red-500 mt-1">{ratingError}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nội dung đánh giá <span className="text-xs text-gray-400">(không bắt buộc)</span>
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                rows={3}
                maxLength={1000}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
              />
              <p className="text-xs text-gray-400 text-right mt-0.5">{comment.length}/1000</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-[#105d97] hover:bg-[#0e4a7a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-200 shadow hover:shadow-md"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Đang gửi...
                </>
              ) : 'Gửi đánh giá'}
            </button>
          </form>
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex gap-3 p-4 border border-gray-100 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )
          : (
            <div className="space-y-4">
              {reviews.slice().reverse().map((review, idx) => {
                const initial = (review.name || 'A').charAt(0).toUpperCase();
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                const color = colors[review.name.charCodeAt(0) % colors.length];
                return (
                  <div key={review._id || idx} className="flex gap-3 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900 truncate">{review.name}</span>
                        <StarRating value={review.rating} interactive={false} size="sm" />
                        <span className="text-xs text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
}

// Main Component
export default function ProductDetailView({ product, relatedProducts = [] }) {
  const dispatch = useDispatch();

  const parseOptions = {
    replace(domNode) {
      if (domNode.type === "tag" && domNode.name === "a") {
        normalizeInternalLinkAttributes(domNode.attribs);
      }

      if (
        domNode.type === "tag" &&
        domNode.name === "img" &&
        domNode.attribs?.["data-caption"] &&
        domNode.parent?.name !== "figure"
      ) {
        const { class: className, style, ...attribs } = domNode.attribs;
        const caption = attribs["data-caption"];
        return (
          <figure className="image-caption-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img className={className || ""} {...attribs} />
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
    }
  };

  const { colorIndex: selectedColorIndex, size: selectedSize } = useSelector((s) => s.product);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState(false);

  const { headings, content: processedContent } = useMemo(() => {
    return parseToc(product.content || '');
  }, [product.content]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const modalRef = useRef(null);
  const productDetailsRef = useRef(null);

  const handleCollapseContent = useCallback(() => {
    setIsContentExpanded(false);
    requestAnimationFrame(() => {
      productDetailsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryPhotos = useMemo(() => {
    if (!Array.isArray(product.gallery) || product.gallery.length === 0) return [];
    return product.gallery
      .map((item, index) => {
        const src = getGalleryItemSrc(item);
        if (!src) return null;
        const { width, height } = getGalleryDimensions(item);

        return {
          src: getImageUrl(src),
          width,
          height,
          alt: item?.alt || item?.altText || `${product.name} - gallery ${index + 1}`,
        };
      })
      .filter(Boolean);
  }, [product.gallery, product.name]);
  const galleryRows = useMemo(() => buildGalleryRows(galleryPhotos), [galleryPhotos]);

  const openLightbox = useCallback((event, { index }) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % (galleryPhotos.length || 1));
  }, [galleryPhotos.length]);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + (galleryPhotos.length || 1)) % (galleryPhotos.length || 1));
  }, [galleryPhotos.length]);

  const sizeGuide = useMemo(() => {
    const shirtType = normalizeShirtType(product);
    return SIZE_GUIDE_BY_SHIRT_TYPE[shirtType] || null;
  }, [product]);

  const updateSwipers = useCallback((index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    dispatch(setColorIndex(index));
    if (mainSwiperRef.current) mainSwiperRef.current.slideToLoop(index);
    if (thumbsSwiperRef.current) thumbsSwiperRef.current.slideTo(index);
  }, [activeIndex, dispatch]);

  const handleThumbnailClick = useCallback((index) => {
    updateSwipers(index);
  }, [updateSwipers]);

  const handleMainSlideChange = (swiper) => {
    updateSwipers(swiper.realIndex);
  };

  const handleThumbnailNavigation = (direction) => {
    const len = product?.colors?.length || 1;
    const newIndex = direction === 'next'
      ? (activeIndex + 1) % len
      : (activeIndex - 1 + len) % len;
    updateSwipers(newIndex);
  };

  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  }, []);

  useBodyScrollLock(isFormOpen || isSizeGuideOpen);

  useEffect(() => {
    if (!isFormOpen) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") toggleForm(); };
    const modal = modalRef.current;
    const elems = modal?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = elems?.[0];
    const last = elems?.[elems.length - 1];
    const trapTab = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    first?.focus();
    modal?.addEventListener("keydown", trapTab);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      modal?.removeEventListener("keydown", trapTab);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen, toggleForm]);

  useEffect(() => {
    if (!isSizeGuideOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSizeGuideOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSizeGuideOpen]);

  useEffect(() => {
    dispatch(resetSelection());
  }, [product?.slug, dispatch]);

  const images = product.colors && product.colors.length > 0
    ? product.colors.map((color) => color.image)
    : ['/images/placeholder.jpg'];

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-0">
        <Breadcrumb product={product} />
        <div className="bg-white overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 p-2 lg:px-8">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation={false}
                spaceBetween={10}
                slidesPerView={1}
                loop={images.length > 1}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                onSlideChange={handleMainSlideChange}
                onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                className="w-full aspect-[3/4] lg:aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200"
                role="region"
                aria-label="Product image carousel"
                id="main-swiper"
              >
                {images.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full aspect-[3/4] lg:aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={imageErrors[index] ? '/images/placeholder.jpg' : getImageUrl(src)}
                        alt={`${product.name} màu ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        className="rounded-xl transition-all duration-300 hover:scale-[1.02]"
                        priority={index === 0}
                        onError={() => handleImageError(index)}
                        unoptimized={getImageUrl(src).startsWith('http')}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {images.length > 1 && (
                <div className="relative mt-4">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    spaceBetween={8}
                    slidesPerView={4}
                    loop={images.length > 1}
                    watchSlidesProgress
                    onSwiper={(swiper) => { setThumbsSwiper(swiper); thumbsSwiperRef.current = swiper; }}
                    className="w-full"
                    role="tablist"
                    id="thumb-swiper"
                  >
                    {images.map((src, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className="relative w-full aspect-square cursor-pointer group"
                          onClick={() => handleThumbnailClick(index)}
                          role="tab"
                          aria-selected={activeIndex === index}
                          aria-label={`Chọn màu ${index + 1}`}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleThumbnailClick(index)}
                        >
                          <Image
                            src={imageErrors[index] ? '/images/placeholder.jpg' : getImageUrl(src)}
                            alt={`${product.name} thumbnail màu ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            className={`rounded-lg border transition-all duration-200 ${activeIndex === index
                              ? 'border-[#105d97] border-2 shadow-md ring-1 ring-[#105d97]/20'
                              : 'border-gray-200 hover:border-[#105d97]/50 group-hover:shadow-sm'
                              }`}
                            loading="lazy"
                            onError={() => handleImageError(index)}
                            unoptimized={getImageUrl(src).startsWith('http')}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button
                    className="thumb-swiper-button-prev absolute top-1/2 left-[-8px] transform -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-200"
                    onClick={() => handleThumbnailNavigation('prev')}
                    aria-label="Hình ảnh trước"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="thumb-swiper-button-next absolute top-1/2 right-[-8px] transform -translate-y-1/2 z-10 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-[#105d97] hover:text-white hover:border-[#105d97] transition-all duration-200"
                    onClick={() => handleThumbnailNavigation('next')}
                    aria-label="Hình ảnh tiếp theo"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="w-full lg:w-1/2 p-2 mt-2 ">
              <span className="text-sm text-gray-400 font-normal">Giá tham khảo</span>
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <span className="text-2xl font-bold text-red-500">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice > 0 && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through font-normal">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
              <h1 className="text-xl text-gray-900 mb-2 leading-tight">{product.name}</h1>
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-700 mb-3">
                    Màu sắc: <span className="font-medium">{product.colors[selectedColorIndex]?.name || ''}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, idx) => {
                      const hex1 = color.hex || '#cccccc';
                      const hex2 = color.hex2 || hex1;
                      const isSplit = hex2 !== hex1;
                      return (
                        <button
                          key={idx}
                          onClick={() => { dispatch(setColorIndex(idx)); updateSwipers(idx); }}
                          aria-label={`Chọn màu ${color.name}`}
                          title={isSplit ? `${hex1} / ${hex2}` : hex1}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 overflow-hidden ${selectedColorIndex === idx ? 'border-[#f5a623] ring-2 ring-[#f5a623]/30 scale-110' : 'border-gray-300 hover:border-gray-400'}`}
                          style={{
                            background: isSplit
                              ? `linear-gradient(90deg, ${hex1} 50%, ${hex2} 50%)`
                              : hex1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-700">
                    Kích thước: <span className="font-medium">{selectedSize || ''}</span>
                  </p>
                  {sizeGuide && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-sm text-[#105d97] hover:underline font-medium"
                    >
                      Hướng dẫn chọn size
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', '2XL', '3XL']).map((size) => (
                    <button
                      key={size}
                      onClick={() => dispatch(setSize(size))}
                      aria-label={`Chọn size ${size}`}
                      className={`min-w-[44px] h-11 px-3 rounded-full text-sm font-medium border-2 transition-all duration-200 ${selectedSize === size ? 'border-[#f5a623] text-[#f5a623]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <button
                  onClick={toggleForm}
                  className="w-full flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#e09510] text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
                >
                  Liên hệ nhận báo giá
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-gray-900">Univisport cam kết</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                    <svg className="w-8 h-8 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-bold">Đổi, trả miễn phí</span> tại nhà nếu không hài lòng</p>
                      <Link href="/chinh-sach-doi-tra" className="text-xs text-[#105d97] hover:underline mt-0.5 inline-block">Xem chính sách ↗</Link>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                    <svg className="w-8 h-8 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <p className="text-sm text-gray-700">Giao trong 3-5 ngày và freeship đơn từ 498k</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                    <svg className="w-8 h-8 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <p className="text-sm text-gray-700">Cam kết bảo mật thông tin khách hàng</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <Image src="/zalo-icon.png" alt="Zalo" width={28} height={28} className="object-contain" unoptimized />
                    </div>
                    <a href="https://zalo.me/0834204999" target="_blank" rel="noopener noreferrer" className="text-sm text-[#105d97] font-medium hover:underline self-start mt-0.5">
                      Cần tư vấn thêm? Chat ngay!
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        {galleryPhotos.length > 0 && (
          <div className="mt-8 bg-white mx-auto md:px-4 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#105d97] rounded-full"></div>
              <h3 className="text-xl font-bold">Thư viện hình ảnh</h3>
              <span className="ml-auto text-xs text-gray-400">{galleryPhotos.length} ảnh</span>
            </div>

            <div className="gallery-container">
              <style jsx>{`
                .gallery-container {
                  display: flex;
                  flex-direction: column;
                  gap: 0.25rem;
                }

                .gallery-row {
                  display: grid;
                  grid-template-columns: var(--gallery-columns);
                  gap: 0.25rem;
                  align-items: start;
                }

                @media (min-width: 640px) {
                  .gallery-container {
                    gap: 0.5rem;
                  }

                  .gallery-row {
                    gap: 0.5rem;
                  }
                }
              `}</style>

              {galleryRows.map((row, rowIndex) => {
                let globalIndex = galleryRows
                  .slice(0, rowIndex)
                  .reduce((total, currentRow) => total + currentRow.length, 0);

                return (
                  <div
                    key={`gallery-row-${rowIndex}`}
                    className="gallery-row"
                    style={{
                      '--gallery-columns': row
                        .map((photo) => `${getPhotoRatio(photo)}fr`)
                        .join(' '),
                    }}
                  >
                    {row.map((photo) => {
                      const photoIndex = globalIndex;
                      globalIndex += 1;

                      return (
                        <button
                          key={`${photo.src}-${photoIndex}`}
                          type="button"
                          className="gallery-item group block w-full overflow-hidden rounded-lg bg-gray-100 text-left shadow-sm transition-shadow hover:shadow-md"
                          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                          onClick={(event) => openLightbox(event, { index: photoIndex })}
                          aria-label={`Xem ảnh ${photoIndex + 1} trong thư viện`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            decoding="async"
                            className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div ref={productDetailsRef} className="mt-6 mx-auto scroll-mt-24">
          <div className="bg-white md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#105d97] rounded-full"></div>
              <h3 className="text-xl font-bold">Chi tiết sản phẩm</h3>
            </div>

            {headings.length > 0 && (
              <TableOfContents
                headings={headings}
                onHeadingClick={() => setIsContentExpanded(true)}
              />
            )}

            <div className="relative">
              <div className={`prose blog prose-base md:prose-lg max-w-none text-gray-700 transition-all duration-500 ${!isContentExpanded ? 'max-h-96 overflow-hidden' : ''}`}>
                <style jsx>{`
                  .blog :global(img) { display: block; margin: 1.5em auto; }
                  .blog :global(figure) { margin: 1.5em 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                  .blog :global(figure img) { display: block; margin: 0 auto; }
                  .blog :global(figcaption) { margin-top: 0; padding-bottom: 0.2rem; font-size: 0.875em; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%; }
                  :global(.dark) .blog :global(figcaption) { color: #9ca3af; }
                  .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
                  .blog :global(td), .blog :global(th) { padding: 0.5em 0.5em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
                  .blog :global(th) { background-color: #f3f4f6; font-weight: 600; color: #111827; }
                  .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
                  .blog :global(h1), .blog :global(h2), .blog :global(h3), .blog :global(h4), .blog :global(h5), .blog :global(h6) { scroll-margin-top: 100px; }
                `}</style>
                {parse(processedContent || '<p class="text-gray-600">Không có thông tin chi tiết sản phẩm.</p>', parseOptions)}
              </div>
              {!isContentExpanded && (
                <>
                  <div className="absolute bottom-3 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)' }}></div>
                  <div className="relative mt-3 flex justify-center">
                    <button onClick={() => setIsContentExpanded(true)} className="bg-[#105d97] text-white px-4 py-2 rounded-xl hover:bg-[#0e4a7a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5" aria-label="Xem đầy đủ bài viết">
                      Xem chi tiết
                    </button>
                  </div>
                </>
              )}
              {isContentExpanded && (
                <div className="mt-3 flex justify-center">
                  <button onClick={handleCollapseContent} className="bg-[#105d97] text-white px-4 py-2 rounded-xl hover:bg-[#0e4a7a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5" aria-label="Thu gọn bài viết">
                    Thu gọn bài viết
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {product.faqs && product.faqs.length > 0 && (
          <section className="mt-6 mx-auto bg-white md:p-6" aria-labelledby="product-faq-title">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#105d97] rounded-full"></div>
              <h3 id="product-faq-title" className="text-xl font-bold">Câu hỏi thường gặp</h3>
            </div>
            <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
              {product.faqs.map((faq, index) => (
                <details key={index} className="group p-4" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-900">
                    <span>{faq.question}</span>
                    <span className="text-[#105d97] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Product Reviews */}
        <ProductReviews
          productSlug={product.slug}
          initialRating={product.rating}
          initialReviewCount={product.reviewCount}
        />

        {relatedProducts && relatedProducts.length > 0 && (
          <ProductSlider title="Sản phẩm liên quan" products={relatedProducts} />
        )}
      </div>

      {isFormOpen && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && toggleForm()}>
          <div ref={modalRef} className="my-4 mx-4 container max-w-[1100px]" role="dialog" aria-labelledby="contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="contact-form-title" className="text-lg font-bold uppercase">Liên hệ nhận báo giá</h2>
                <button onClick={toggleForm} aria-label="Đóng" className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white"><ContactForm source={`Sản phẩm: ${product.name}`} /></div>
            </div>
          </div>
        </div>
      )}

      {isSizeGuideOpen && sizeGuide && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsSizeGuideOpen(false)}
        >
          <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-base font-semibold text-gray-900">
                Bảng size {sizeGuide.label}
              </h2>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Đóng bảng size"
              >
                <FaTimes />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-b-xl">
              <Image
                src={sizeGuide.image}
                alt={`Bảng size ${sizeGuide.label}`}
                fill
                className="object-contain pb-4"
                sizes="(max-width: 768px) 94vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={galleryPhotos.map(p => p.src)}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}

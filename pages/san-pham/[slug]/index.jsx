import DefaultLayout from "../../../components/layout/DefaultLayout";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import ProductDetailView from "../../../components/univisport/ProductDetailView";

// ─── CATEGORY NAMES MAP ──────────────────────────────────────────────────────
const CATEGORY_NAMES = {
  'dong-phuc-gym': 'Đồng Phục Gym',
  'dong-phuc-yoga-pilates': 'Đồng Phục Yoga - Pilates',
  'dong-phuc-pickleball': 'Đồng Phục Pickleball',
  'dong-phuc-ao-gio': 'Đồng Phục Áo Gió',
  'dong-phuc-ao-polo': 'Đồng Phục Áo Polo',
  'dong-phuc-ao-thun': 'Đồng Phục Áo Thun',
  'dong-phuc-golf-tennis': 'Đồng Phục Golf - Tennis',
  'dong-phuc-chay-bo': 'Đồng Phục Chạy Bộ',
  'dong-phuc-mma': 'Đồng Phục MMA',
};

const ProductDetailPage = ({ product, relatedProducts, meta }) => {
  return (
    <DefaultLayout meta={meta}>
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </DefaultLayout>
  );
};

export default ProductDetailPage;

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  if (!slug) return { notFound: true };

  try {
    await db.connectDb();
    const productDoc = await Product.findOne({ slug }).lean();
    if (!productDoc) return { notFound: true };

    const product = JSON.parse(JSON.stringify(productDoc));

    // Fetch related products
    const relatedProductsDocs = await Product.find({
      category: product.category,
      slug: { $ne: slug },
      visibleOnArticle: { $ne: false },
    }).sort({ displayOrder: 1, createdAt: -1 }).limit(6).lean();

    const relatedProducts = relatedProductsDocs.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      maxPrice: p.originalPrice || p.price,
      discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
      image: p.colors?.[0]?.image || p.image || '',
      slug: p.slug || '',
    }));

    const categoryNameVN = product.categoryNameVN || CATEGORY_NAMES[product.category] || 'Đồng Phục';
    const canonicalUrl = `https://dongphucunivi.com/san-pham/${slug}`;
    const productImage = product.colors?.[0]?.image || product.image || 'https://dongphucunivi.com/images/banner-1.webp';
    const validFaqs = Array.isArray(product.faqs)
      ? product.faqs
        .map((faq) => ({
          question: faq.question?.trim() || '',
          answer: faq.answer?.trim() || '',
        }))
        .filter((faq) => faq.question && faq.answer)
      : [];
    product.faqs = validFaqs;

    const meta = {
      title: `${product.name} - Đồng Phục Univi`,
      description: product.description || `Đồng phục ${categoryNameVN} từ Univi.`,
      author: 'Đồng Phục Univi',
      canonical: canonicalUrl,
      robots: 'index, follow',
      keywords: `${product.name},đồng phục Univi, ${categoryNameVN}`,
      og: {
        title: `${product.name} — Đồng Phục Univi`,
        description: product.description || "",
        type: 'product',
        image: productImage,
        imageWidth: '1200',
        imageHeight: '630',
        imageAlt: product.name,
        url: canonicalUrl,
        site_name: 'Đồng Phục Univi',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} — Đồng Phục Univi`,
        description: product.description || "",
        image: productImage,
      },
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
            { '@type': 'ListItem', 'position': 2, 'name': categoryNameVN, 'item': `https://dongphucunivi.com/${product.category}` },
            { '@type': 'ListItem', 'position': 3, 'name': product.name, 'item': canonicalUrl },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          'name': product.name,
          'image': [
            productImage,
            ...(product.colors?.map((c) => c.image).filter(Boolean) || []),
          ],
          'description': product.description,
          'sku': product.maSanPham || `SP${product._id}`,
          'brand': { '@type': 'Brand', 'name': 'Đồng Phục Univi' },
          'offers': {
            '@type': 'Offer',
            'url': canonicalUrl,
            'priceCurrency': 'VND',
            'price': product.price,
            ...(product.originalPrice && product.originalPrice > product.price
              ? { 'highPrice': product.originalPrice }
              : {}),
            'availability': 'https://schema.org/InStock',
            'priceValidUntil': `${new Date().getFullYear()}-12-31`,
            'seller': {
              '@type': 'Organization',
              '@id': 'https://dongphucunivi.com/#organization',
            },
          },
        },
        ...(validFaqs.length > 0 ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': validFaqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer,
            },
          })),
        }] : []),
      ],
    };

    return { props: { product, meta, relatedProducts } };
  } catch (error) {
    console.error("Error in ProductDetailPage:", error);
    return { notFound: true };
  }
}

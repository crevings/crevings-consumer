/**
 * CompanyPromotion — a platform-level promotional card served from the backend.
 * The `design` JSON drives the card's full visual style so the consumer app
 * renders it with a single dynamic engine (no hardcoded colours).
 */
export interface PromotionDesign {
  backgroundColor?: string;
  borderColor?: string;
  taglineColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonBackground?: string;
  buttonTextColor?: string;
  borderRadius?: number;
  imageBorderRadius?: number;
  taglineItalic?: boolean;
  taglineUppercase?: boolean;
}

export interface CompanyPromotion {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  ctaUrl?: string;
  design: PromotionDesign;
  isActive: boolean;
  sortOrder: number;
}

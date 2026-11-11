export type PublishStatus = "draft" | "published";

export interface Post {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  status: PublishStatus;
  published_at: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  legacy_url?: string | null;
  updated_at?: string;
}

export interface Stay {
  id?: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  country: string | null;
  location?: string | null;
  date_text: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration_text: string | null;
  price_text: string | null;
  capacity?: string | null;
  cover_image: string | null;
  gallery?: string[];
  content: string | null;
  cta_text: string | null;
  booking_url?: string | null;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
  legacy_url?: string | null;
  updated_at?: string;
}

export const POST_CATEGORIES = ["Přírodní léčba", "Byliny a houby", "Cesty a rituály", "Ženská péče"] as const;
export const STAY_COUNTRIES = ["Mexiko", "Peru", "Česko"] as const;

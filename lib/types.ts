export type CategorySlug = string;

export type WorkStatus = "draft" | "published";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface WorkFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  extension: string;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  category: CategorySlug;
  excerpt: string;
  content: string;
  publishedAt: string;
  featured?: boolean;
  status: WorkStatus;
  files?: WorkFile[];
  updatedAt?: string;
}

export interface WorkSummary {
  slug: string;
  title: string;
  category: CategorySlug;
  categoryName: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
}

export interface Experience {
  period: string;
  title: string;
  place: string;
  description: string;
}

export interface Publication {
  year: string;
  title: string;
  note: string;
}

export interface AuthorProfile {
  name: string;
  initials: string;
  role: string;
  location: string;
  shortBio: string;
  bio: string[];
  quote: string;
  experience: Experience[];
  publications: Publication[];
}

/** Bentuk file penyimpanan lokal (.data/store.json). */
export interface StoreData {
  version: number;
  categories: Category[];
  works: Work[];
  profile: AuthorProfile;
}

export interface WorkInput {
  id?: string;
  title: string;
  slug?: string;
  category: CategorySlug;
  excerpt: string;
  content: string;
  publishedAt: string;
  status: WorkStatus;
  featured: boolean;
  files?: WorkFile[];
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description: string;
}

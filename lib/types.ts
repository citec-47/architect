export type Project = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  description: string | null;
  category: string | null;
  featured: boolean;
  hero_image_url: string | null;
  hero_image_public_id: string | null;
  floor_plan_image_url: string | null;
  floor_plan_public_id: string | null;
  total_area_sqm: number | null;
  watermark_handle: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectMedia = {
  id: number;
  project_id: number;
  media_type: "image" | "video";
  url: string;
  cloudinary_public_id: string | null;
  caption: string | null;
  display_order: number;
};

export type ProjectService = {
  id: number;
  project_id: number;
  service_number: number;
  title: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  display_order: number;
};

export type ProjectRoom = {
  id: number;
  project_id: number;
  room_name: string;
  area_sqm: number | null;
  display_order: number;
};

export type ProjectDetail = Project & {
  media: ProjectMedia[];
  services: ProjectService[];
  rooms: ProjectRoom[];
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

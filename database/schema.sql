-- ============================================
--  Architect Silas Portfolio — NeonDB schema
--  Designed for GLASSHAVEN-style project pages
-- ============================================

-- One admin row (the studio's account). More can be added later.
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- A project = one architecture commission. Maps to a card on the
-- homepage grid AND a full GLASSHAVEN-style detail page.
CREATE TABLE IF NOT EXISTS projects (
  id                  SERIAL PRIMARY KEY,
  slug                VARCHAR(255) UNIQUE NOT NULL,
  title               VARCHAR(255) NOT NULL,        -- "GLASSHAVEN"
  subtitle            VARCHAR(255),                 -- "A NEW STANDARD OF MODERN LIVING"
  location            VARCHAR(255),                 -- "QUEBEC, CANADA"
  description         TEXT,
  category            VARCHAR(100),                 -- Residential / Commercial / ...
  featured            BOOLEAN      DEFAULT false,
  hero_image_url      TEXT,                         -- Big hero behind the title
  hero_image_public_id TEXT,                        -- Cloudinary public_id (for deletion)
  floor_plan_image_url TEXT,                        -- "HOUSE PLAN" visual
  floor_plan_public_id TEXT,
  total_area_sqm      DECIMAL(10,2),                -- "92"
  watermark_handle    VARCHAR(100),                 -- "@glasshaven" on the floor plan
  published           BOOLEAN      DEFAULT true,    -- false = draft, hidden from public site
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- For projects created before this column existed.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- All extra images/videos for a project's gallery.
CREATE TABLE IF NOT EXISTS project_media (
  id                   SERIAL PRIMARY KEY,
  project_id           INT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type           VARCHAR(10)  NOT NULL CHECK (media_type IN ('image','video')),
  url                  TEXT         NOT NULL,
  cloudinary_public_id TEXT,
  caption              VARCHAR(255),
  display_order        INT          DEFAULT 0,
  created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- The numbered "OUR SERVICES" cards (01/02/03/04) shown on the detail page.
CREATE TABLE IF NOT EXISTS project_services (
  id             SERIAL PRIMARY KEY,
  project_id     INT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_number INT          NOT NULL,           -- 1, 2, 3, 4 ...
  title          VARCHAR(255) NOT NULL,           -- "PROPERTY SHOWCASE"
  description    TEXT,
  image_url      TEXT,
  image_public_id TEXT,
  display_order  INT          DEFAULT 0
);

-- The room-by-room table under "THE AREA IS X M²".
CREATE TABLE IF NOT EXISTS project_rooms (
  id            SERIAL PRIMARY KEY,
  project_id    INT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  room_name     VARCHAR(255) NOT NULL,            -- "Living Room"
  area_sqm      DECIMAL(10,2),                    -- 21
  display_order INT          DEFAULT 0
);

-- Contact form submissions.
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  read       BOOLEAN      DEFAULT false,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_featured     ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_published    ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_slug         ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category     ON projects(category);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_project_rooms_project ON project_rooms(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_project_services_project ON project_services(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_contact_read          ON contact_messages(read, created_at DESC);

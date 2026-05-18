-- ═══════════════════════════════════════════════════════════════════════════
-- MovOS · Supabase Schema
-- Platform: Supabase (PostgreSQL 15+)
-- Roles: admin | management | operator
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ═══════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TYPE user_role            AS ENUM ('admin', 'management', 'operator');
CREATE TYPE vehicle_status       AS ENUM ('available', 'assigned', 'maintenance', 'inspection', 'retired');
CREATE TYPE vehicle_category     AS ENUM ('sedan', 'suv', 'pickup', 'van', 'truck', 'minibus', 'motorcycle');
CREATE TYPE fuel_type            AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid', 'lpg');
CREATE TYPE engine_type          AS ENUM ('combustion', 'electric', 'hybrid');
CREATE TYPE transmission_type    AS ENUM ('manual', 'automatic', 'cvt');
CREATE TYPE document_type        AS ENUM ('insurance', 'registration', 'technical_inspection', 'other');
CREATE TYPE service_scope        AS ENUM ('fleet', 'category', 'location', 'vehicle');
CREATE TYPE trigger_type         AS ENUM ('km', 'days', 'both');
CREATE TYPE inspection_type      AS ENUM ('pickup', 'return', 'periodic', 'damage');
CREATE TYPE inspection_status    AS ENUM ('draft', 'in_progress', 'completed', 'voided');
CREATE TYPE item_result          AS ENUM ('pass', 'fail', 'warning', 'na');
CREATE TYPE damage_severity      AS ENUM ('minor', 'moderate', 'severe', 'total_loss');
CREATE TYPE responsible_party    AS ENUM ('client', 'company', 'third_party', 'unknown');
CREATE TYPE ticket_status        AS ENUM ('open', 'in_progress', 'waiting_parts', 'completed', 'cancelled');
CREATE TYPE ticket_severity      AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE maintenance_stage    AS ENUM ('reported', 'diagnosed', 'waiting_parts', 'in_repair', 'quality_check', 'completed');
CREATE TYPE alert_type           AS ENUM ('damage', 'service_due', 'document_expiry', 'insurance_expiry', 'inspection_due', 'manager_report', 'gps', 'other');
CREATE TYPE alert_level          AS ENUM ('info', 'warning', 'critical');
CREATE TYPE alert_status         AS ENUM ('open', 'acknowledged', 'resolved', 'dismissed');
CREATE TYPE alert_source         AS ENUM ('system', 'manager', 'client', 'technician');
CREATE TYPE contract_status      AS ENUM ('active', 'expiring', 'expired', 'cancelled');
CREATE TYPE reservation_status   AS ENUM ('confirmed', 'active', 'completed', 'cancelled', 'no_show');
CREATE TYPE parts_urgency        AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE parts_status         AS ENUM ('requested', 'approved', 'ordered', 'received', 'installed', 'cancelled');
CREATE TYPE vendor_type          AS ENUM ('dealer', 'workshop', 'parts_supplier', 'towing', 'other');
CREATE TYPE event_type           AS ENUM ('status_change', 'inspection', 'damage', 'repair', 'service', 'contract', 'reservation', 'document', 'alert', 'note');


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLES  (dependency order — circular FK between reservations ↔ inspections
--          resolved via deferred ALTER TABLE after both tables exist)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── AUTH ────────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT        NOT NULL,
  role         user_role   NOT NULL DEFAULT 'operator',
  location_id  UUID,                                       -- FK added after locations
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── CORE ────────────────────────────────────────────────────────────────────

CREATE TABLE locations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  country     TEXT        NOT NULL DEFAULT 'Uruguay',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attach FK now that locations exists
ALTER TABLE profiles
  ADD CONSTRAINT profiles_location_id_fkey
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

CREATE TABLE vehicles (
  id                   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id              TEXT               NOT NULL UNIQUE,
  vin                  TEXT               UNIQUE,
  plate                TEXT               NOT NULL UNIQUE,
  make                 TEXT               NOT NULL,
  model                TEXT               NOT NULL,
  year                 SMALLINT           NOT NULL CHECK (year BETWEEN 1990 AND 2100),
  color                TEXT,
  category             vehicle_category   NOT NULL,
  location_id          UUID               NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  status               vehicle_status     NOT NULL DEFAULT 'available',
  odometer             INTEGER            NOT NULL DEFAULT 0 CHECK (odometer >= 0),
  fuel_type            fuel_type          NOT NULL DEFAULT 'gasoline',
  engine_type          engine_type        NOT NULL DEFAULT 'combustion',
  transmission         transmission_type  NOT NULL DEFAULT 'manual',
  acquisition_date     DATE,
  acquisition_cost     NUMERIC(12,2)      CHECK (acquisition_cost >= 0),
  has_gps              BOOLEAN            NOT NULL DEFAULT false,
  has_dashcam          BOOLEAN            NOT NULL DEFAULT false,
  has_toll_tag         BOOLEAN            NOT NULL DEFAULT false,
  has_wheelchair_lift  BOOLEAN            NOT NULL DEFAULT false,
  has_refrigeration    BOOLEAN            NOT NULL DEFAULT false,
  has_roof_rack        BOOLEAN            NOT NULL DEFAULT false,
  has_tow_hook         BOOLEAN            NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_documents (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   UUID           NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type         document_type  NOT NULL,
  file_url     TEXT           NOT NULL,
  expiry_date  DATE,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- ─── SERVICE INTERVALS ───────────────────────────────────────────────────────

CREATE TABLE manufacturer_services (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id            UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_name          TEXT        NOT NULL,
  interval_km           INTEGER     CHECK (interval_km > 0),
  interval_months       SMALLINT    CHECK (interval_months > 0),
  service_contents      TEXT,
  warning_km            INTEGER     CHECK (warning_km >= 0),
  warning_days          SMALLINT    CHECK (warning_days >= 0),
  last_service_date     DATE,
  last_service_odometer INTEGER     CHECK (last_service_odometer >= 0),
  next_due_date         DATE,
  next_due_odometer     INTEGER     CHECK (next_due_odometer >= 0),
  authorized_dealer     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE internal_service_rules (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  scope         service_scope  NOT NULL DEFAULT 'fleet',
  category      vehicle_category,
  location_id   UUID           REFERENCES locations(id) ON DELETE CASCADE,
  vehicle_id    UUID           REFERENCES vehicles(id)  ON DELETE CASCADE,
  rule_name     TEXT           NOT NULL,
  trigger_type  trigger_type   NOT NULL,
  interval_km   INTEGER        CHECK (interval_km > 0),
  interval_days INTEGER        CHECK (interval_days > 0),
  warning_km    INTEGER        CHECK (warning_km >= 0),
  warning_days  INTEGER        CHECK (warning_days >= 0),
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TABLE service_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id      UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type    TEXT        NOT NULL,
  performed_at    DATE        NOT NULL,
  odometer        INTEGER     CHECK (odometer >= 0),
  cost            NUMERIC(10,2) CHECK (cost >= 0),
  technician      TEXT,
  shop_name       TEXT,
  stamp_reference TEXT,
  notes           TEXT,
  document_url    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── RESERVATIONS (created before inspections — circular FK resolved below) ───

CREATE TABLE reservations (
  id                   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id          TEXT               UNIQUE,
  vehicle_id           UUID               NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  customer_name        TEXT,
  customer_contact     TEXT,
  pickup_date          TIMESTAMPTZ,
  return_date          TIMESTAMPTZ,
  pickup_inspection_id UUID,              -- FK added after inspections
  return_inspection_id UUID,              -- FK added after inspections
  status               reservation_status NOT NULL DEFAULT 'confirmed',
  branch_id            UUID               REFERENCES locations(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ        NOT NULL DEFAULT now(),
  CONSTRAINT reservations_dates_check CHECK (return_date IS NULL OR return_date >= pickup_date)
);

-- ─── INSPECTIONS ─────────────────────────────────────────────────────────────

CREATE TABLE inspections (
  id                     UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id             UUID               NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  type                   inspection_type    NOT NULL,
  reservation_id         UUID               REFERENCES reservations(id) ON DELETE SET NULL,
  inspector_id           UUID               REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name          TEXT,
  customer_signature_url TEXT,
  odometer               INTEGER            CHECK (odometer >= 0),
  fuel_level             SMALLINT           CHECK (fuel_level BETWEEN 0 AND 100),
  status                 inspection_status  NOT NULL DEFAULT 'draft',
  started_at             TIMESTAMPTZ,
  completed_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ        NOT NULL DEFAULT now()
);

-- Resolve circular FK: reservations ↔ inspections
ALTER TABLE reservations
  ADD CONSTRAINT reservations_pickup_inspection_id_fkey
  FOREIGN KEY (pickup_inspection_id) REFERENCES inspections(id) ON DELETE SET NULL;

ALTER TABLE reservations
  ADD CONSTRAINT reservations_return_inspection_id_fkey
  FOREIGN KEY (return_inspection_id) REFERENCES inspections(id) ON DELETE SET NULL;

CREATE TABLE inspection_items (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id  UUID         NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  item_name      TEXT         NOT NULL,
  category       TEXT         NOT NULL,
  result         item_result  NOT NULL DEFAULT 'pass',
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ─── DAMAGE ──────────────────────────────────────────────────────────────────

CREATE TABLE damage_records (
  id                UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id     UUID               REFERENCES inspections(id) ON DELETE SET NULL,
  vehicle_id        UUID               NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  zone              TEXT               NOT NULL,
  damage_type       TEXT               NOT NULL,
  severity          damage_severity    NOT NULL DEFAULT 'minor',
  notes             TEXT,
  responsible_party responsible_party  NOT NULL DEFAULT 'unknown',
  rental_reference  TEXT,
  created_at        TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE TABLE damage_photos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  damage_record_id UUID        NOT NULL REFERENCES damage_records(id) ON DELETE CASCADE,
  photo_url        TEXT        NOT NULL,
  zone             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── MAINTENANCE ─────────────────────────────────────────────────────────────

CREATE TABLE repair_tickets (
  id                   UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id           UUID             NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  damage_record_id     UUID             REFERENCES damage_records(id) ON DELETE SET NULL,
  issue_description    TEXT             NOT NULL,
  severity             ticket_severity  NOT NULL DEFAULT 'medium',
  status               ticket_status    NOT NULL DEFAULT 'open',
  assigned_to          UUID             REFERENCES profiles(id) ON DELETE SET NULL,
  shop_name            TEXT,
  estimated_completion DATE,
  actual_completion    DATE,
  labor_cost           NUMERIC(10,2)    CHECK (labor_cost >= 0),
  parts_cost           NUMERIC(10,2)    CHECK (parts_cost >= 0),
  -- computed total avoids sync bugs; use labor_cost + parts_cost directly in queries
  total_cost           NUMERIC(10,2)    GENERATED ALWAYS AS
                                          (COALESCE(labor_cost, 0) + COALESCE(parts_cost, 0)) STORED,
  created_at           TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE TABLE maintenance_stages (
  id               UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id       UUID               NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  repair_ticket_id UUID               REFERENCES repair_tickets(id) ON DELETE SET NULL,
  stage            maintenance_stage  NOT NULL,
  moved_by         UUID               REFERENCES profiles(id) ON DELETE SET NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT now()
);

-- ─── ALERTS ──────────────────────────────────────────────────────────────────

CREATE TABLE alerts (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  UUID          NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type        alert_type    NOT NULL,
  level       alert_level   NOT NULL DEFAULT 'warning',
  message     TEXT          NOT NULL,
  source      alert_source  NOT NULL DEFAULT 'system',
  recipients  UUID[],
  status      alert_status  NOT NULL DEFAULT 'open',
  created_by  UUID          REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_by UUID          REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ─── CONTRACTS ───────────────────────────────────────────────────────────────

CREATE TABLE contracts (
  id                UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name       TEXT             NOT NULL,
  contract_type     TEXT             NOT NULL,
  start_date        DATE             NOT NULL,
  end_date          DATE             NOT NULL,
  monthly_rate      NUMERIC(12,2)    CHECK (monthly_rate >= 0),
  mileage_allowance INTEGER          CHECK (mileage_allowance >= 0),
  status            contract_status  NOT NULL DEFAULT 'active',
  branch_id         UUID             REFERENCES locations(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT now(),
  CONSTRAINT contracts_dates_check CHECK (end_date > start_date)
);

CREATE TABLE contract_vehicles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id  UUID        NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  vehicle_id   UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  removed_at   TIMESTAMPTZ
);

-- One active assignment per vehicle per contract at any time
CREATE UNIQUE INDEX contract_vehicles_active_unique
  ON contract_vehicles (contract_id, vehicle_id)
  WHERE removed_at IS NULL;

-- ─── VENDORS & PARTS ─────────────────────────────────────────────────────────

CREATE TABLE vendors (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT         NOT NULL,
  type          vendor_type  NOT NULL DEFAULT 'workshop',
  location_id   UUID         REFERENCES locations(id) ON DELETE SET NULL,
  contact_name  TEXT,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  speciality    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE parts_requests (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id       UUID           NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  repair_ticket_id UUID           REFERENCES repair_tickets(id) ON DELETE SET NULL,
  part_name        TEXT           NOT NULL,
  part_number      TEXT,
  quantity         SMALLINT       NOT NULL DEFAULT 1 CHECK (quantity > 0),
  urgency          parts_urgency  NOT NULL DEFAULT 'medium',
  status           parts_status   NOT NULL DEFAULT 'requested',
  vendor_id        UUID           REFERENCES vendors(id) ON DELETE SET NULL,
  branch_id        UUID           REFERENCES locations(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- ─── VEHICLE TIMELINE ────────────────────────────────────────────────────────

CREATE TABLE vehicle_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  event_type  event_type  NOT NULL,
  summary     TEXT        NOT NULL,
  detail      TEXT,
  actor_id    UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  actor_name  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

-- vehicles
CREATE INDEX idx_vehicles_location_id  ON vehicles (location_id);
CREATE INDEX idx_vehicles_status       ON vehicles (status);
CREATE INDEX idx_vehicles_unit_id      ON vehicles (unit_id);
CREATE INDEX idx_vehicles_plate        ON vehicles (plate);
CREATE INDEX idx_vehicles_category     ON vehicles (category);

-- vehicle_documents
CREATE INDEX idx_vehicle_docs_vehicle  ON vehicle_documents (vehicle_id);
CREATE INDEX idx_vehicle_docs_expiry   ON vehicle_documents (expiry_date) WHERE expiry_date IS NOT NULL;

-- manufacturer_services
CREATE INDEX idx_mfr_svc_vehicle       ON manufacturer_services (vehicle_id);
CREATE INDEX idx_mfr_svc_next_due_date ON manufacturer_services (next_due_date)      WHERE next_due_date IS NOT NULL;
CREATE INDEX idx_mfr_svc_next_due_odo  ON manufacturer_services (next_due_odometer)  WHERE next_due_odometer IS NOT NULL;

-- internal_service_rules
CREATE INDEX idx_isr_vehicle           ON internal_service_rules (vehicle_id)   WHERE vehicle_id   IS NOT NULL;
CREATE INDEX idx_isr_location          ON internal_service_rules (location_id)  WHERE location_id  IS NOT NULL;

-- service_logs
CREATE INDEX idx_service_logs_vehicle  ON service_logs (vehicle_id);
CREATE INDEX idx_service_logs_date     ON service_logs (performed_at DESC);

-- inspections
CREATE INDEX idx_inspections_vehicle   ON inspections (vehicle_id);
CREATE INDEX idx_inspections_status    ON inspections (status);
CREATE INDEX idx_inspections_reserv    ON inspections (reservation_id)  WHERE reservation_id IS NOT NULL;
CREATE INDEX idx_inspections_inspector ON inspections (inspector_id)    WHERE inspector_id   IS NOT NULL;

-- inspection_items
CREATE INDEX idx_items_inspection      ON inspection_items (inspection_id);

-- damage_records
CREATE INDEX idx_damage_vehicle        ON damage_records (vehicle_id);
CREATE INDEX idx_damage_inspection     ON damage_records (inspection_id) WHERE inspection_id IS NOT NULL;
CREATE INDEX idx_damage_severity       ON damage_records (severity);

-- damage_photos
CREATE INDEX idx_photos_damage_record  ON damage_photos (damage_record_id);

-- repair_tickets
CREATE INDEX idx_tickets_vehicle       ON repair_tickets (vehicle_id);
CREATE INDEX idx_tickets_status        ON repair_tickets (status);
CREATE INDEX idx_tickets_assigned      ON repair_tickets (assigned_to)     WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_tickets_severity      ON repair_tickets (severity);

-- maintenance_stages
CREATE INDEX idx_stages_vehicle        ON maintenance_stages (vehicle_id);
CREATE INDEX idx_stages_ticket         ON maintenance_stages (repair_ticket_id) WHERE repair_ticket_id IS NOT NULL;
CREATE INDEX idx_stages_created        ON maintenance_stages (created_at DESC);

-- alerts
CREATE INDEX idx_alerts_vehicle        ON alerts (vehicle_id);
CREATE INDEX idx_alerts_status         ON alerts (status);
CREATE INDEX idx_alerts_level          ON alerts (level);
CREATE INDEX idx_alerts_created        ON alerts (created_at DESC);

-- contracts
CREATE INDEX idx_contracts_status      ON contracts (status);
CREATE INDEX idx_contracts_end_date    ON contracts (end_date);
CREATE INDEX idx_contracts_branch      ON contracts (branch_id) WHERE branch_id IS NOT NULL;

-- contract_vehicles
CREATE INDEX idx_cv_contract           ON contract_vehicles (contract_id);
CREATE INDEX idx_cv_vehicle            ON contract_vehicles (vehicle_id);

-- reservations
CREATE INDEX idx_reserv_vehicle        ON reservations (vehicle_id);
CREATE INDEX idx_reserv_status         ON reservations (status);
CREATE INDEX idx_reserv_branch         ON reservations (branch_id)    WHERE branch_id   IS NOT NULL;
CREATE INDEX idx_reserv_external       ON reservations (external_id)  WHERE external_id IS NOT NULL;
CREATE INDEX idx_reserv_pickup_date    ON reservations (pickup_date);

-- parts_requests
CREATE INDEX idx_parts_vehicle         ON parts_requests (vehicle_id);
CREATE INDEX idx_parts_status          ON parts_requests (status);
CREATE INDEX idx_parts_urgency         ON parts_requests (urgency);
CREATE INDEX idx_parts_branch          ON parts_requests (branch_id) WHERE branch_id IS NOT NULL;

-- vendors
CREATE INDEX idx_vendors_location      ON vendors (location_id) WHERE location_id IS NOT NULL;
CREATE INDEX idx_vendors_type          ON vendors (type);

-- vehicle_events
CREATE INDEX idx_events_vehicle        ON vehicle_events (vehicle_id);
CREATE INDEX idx_events_type           ON vehicle_events (event_type);
CREATE INDEX idx_events_created        ON vehicle_events (created_at DESC);
-- JSONB GIN index for metadata queries (e.g. find events by contract_id in metadata)
CREATE INDEX idx_events_metadata       ON vehicle_events USING gin (metadata) WHERE metadata IS NOT NULL;

-- profiles
CREATE INDEX idx_profiles_user_id      ON profiles (user_id);
CREATE INDEX idx_profiles_location     ON profiles (location_id) WHERE location_id IS NOT NULL;
CREATE INDEX idx_profiles_role         ON profiles (role);


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS — updated_at
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER repair_tickets_updated_at
  BEFORE UPDATE ON repair_tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ═══════════════════════════════════════════════════════════════════════════
-- RLS HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Cached per-transaction: avoids N round-trips in policies with JOINs
CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION auth_location_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT location_id FROM profiles WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION auth_profile_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid()
$$;


-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
--
-- Three roles:
--   admin      — unrestricted access to every table
--   management — full CRUD scoped to their location_id
--   operator   — SELECT everywhere in their location + write inspections
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_documents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_service_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_records         ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_photos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_tickets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_stages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_vehicles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_events         ENABLE ROW LEVEL SECURITY;


-- ─── profiles ────────────────────────────────────────────────────────────────

CREATE POLICY "profiles·admin·all"
  ON profiles FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "profiles·own·row"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "profiles·management·read·same·location"
  ON profiles FOR SELECT
  USING (
    auth_role() = 'management'
    AND location_id = auth_location_id()
  );


-- ─── locations ───────────────────────────────────────────────────────────────

CREATE POLICY "locations·admin·all"
  ON locations FOR ALL
  USING (auth_role() = 'admin');

-- All authenticated users can read locations (used in dropdowns/filters)
CREATE POLICY "locations·authenticated·read"
  ON locations FOR SELECT
  USING (auth.uid() IS NOT NULL);


-- ─── vehicles ────────────────────────────────────────────────────────────────

CREATE POLICY "vehicles·admin·all"
  ON vehicles FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "vehicles·management·all·own·location"
  ON vehicles FOR ALL
  USING (
    auth_role() = 'management'
    AND location_id = auth_location_id()
  );

CREATE POLICY "vehicles·operator·read·own·location"
  ON vehicles FOR SELECT
  USING (
    auth_role() = 'operator'
    AND location_id = auth_location_id()
  );


-- ─── vehicle_documents ───────────────────────────────────────────────────────

CREATE POLICY "vehicle_documents·admin·all"
  ON vehicle_documents FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "vehicle_documents·management·all·own·location"
  ON vehicle_documents FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_documents.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "vehicle_documents·operator·read·own·location"
  ON vehicle_documents FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_documents.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── manufacturer_services ───────────────────────────────────────────────────

CREATE POLICY "manufacturer_services·admin·all"
  ON manufacturer_services FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "manufacturer_services·management·all·own·location"
  ON manufacturer_services FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = manufacturer_services.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "manufacturer_services·operator·read·own·location"
  ON manufacturer_services FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = manufacturer_services.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── internal_service_rules ──────────────────────────────────────────────────

CREATE POLICY "isr·admin·all"
  ON internal_service_rules FOR ALL
  USING (auth_role() = 'admin');

-- Management reads fleet-wide rules + rules scoped to their location or their vehicles
CREATE POLICY "isr·management·read"
  ON internal_service_rules FOR SELECT
  USING (
    auth_role() = 'management'
    AND (
      scope = 'fleet'
      OR location_id = auth_location_id()
      OR EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = internal_service_rules.vehicle_id
          AND v.location_id = auth_location_id()
      )
    )
  );

CREATE POLICY "isr·management·write·own·location"
  ON internal_service_rules FOR INSERT
  WITH CHECK (
    auth_role() = 'management'
    AND (
      location_id = auth_location_id()
      OR EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = vehicle_id
          AND v.location_id = auth_location_id()
      )
    )
  );

CREATE POLICY "isr·operator·read"
  ON internal_service_rules FOR SELECT
  USING (auth_role() = 'operator');


-- ─── service_logs ────────────────────────────────────────────────────────────

CREATE POLICY "service_logs·admin·all"
  ON service_logs FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "service_logs·management·all·own·location"
  ON service_logs FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = service_logs.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "service_logs·operator·read·own·location"
  ON service_logs FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = service_logs.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── inspections ─────────────────────────────────────────────────────────────

CREATE POLICY "inspections·admin·all"
  ON inspections FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "inspections·management·all·own·location"
  ON inspections FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = inspections.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "inspections·operator·read·own·location"
  ON inspections FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = inspections.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

-- Operators can create inspections for vehicles at their location
CREATE POLICY "inspections·operator·insert"
  ON inspections FOR INSERT
  WITH CHECK (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

-- Operators can update only their own in-progress inspections
CREATE POLICY "inspections·operator·update·own"
  ON inspections FOR UPDATE
  USING (
    auth_role() = 'operator'
    AND inspector_id = auth_profile_id()
    AND status IN ('draft', 'in_progress')
  );


-- ─── inspection_items ────────────────────────────────────────────────────────

CREATE POLICY "inspection_items·admin·all"
  ON inspection_items FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "inspection_items·management·all·own·location"
  ON inspection_items FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM inspections i
      JOIN vehicles v ON v.id = i.vehicle_id
      WHERE i.id = inspection_items.inspection_id
        AND v.location_id = auth_location_id()
    )
  );

-- Operators can read + write items on their own inspections
CREATE POLICY "inspection_items·operator·all·own·inspection"
  ON inspection_items FOR ALL
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = inspection_items.inspection_id
        AND i.inspector_id = auth_profile_id()
    )
  );


-- ─── damage_records ──────────────────────────────────────────────────────────

CREATE POLICY "damage_records·admin·all"
  ON damage_records FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "damage_records·management·all·own·location"
  ON damage_records FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = damage_records.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "damage_records·operator·read·own·location"
  ON damage_records FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = damage_records.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "damage_records·operator·insert"
  ON damage_records FOR INSERT
  WITH CHECK (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── damage_photos ───────────────────────────────────────────────────────────

CREATE POLICY "damage_photos·admin·all"
  ON damage_photos FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "damage_photos·management·all·own·location"
  ON damage_photos FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM damage_records dr
      JOIN vehicles v ON v.id = dr.vehicle_id
      WHERE dr.id = damage_photos.damage_record_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "damage_photos·operator·read·own·location"
  ON damage_photos FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM damage_records dr
      JOIN vehicles v ON v.id = dr.vehicle_id
      WHERE dr.id = damage_photos.damage_record_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "damage_photos·operator·insert"
  ON damage_photos FOR INSERT
  WITH CHECK (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM damage_records dr
      JOIN vehicles v ON v.id = dr.vehicle_id
      WHERE dr.id = damage_record_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── repair_tickets ──────────────────────────────────────────────────────────

CREATE POLICY "repair_tickets·admin·all"
  ON repair_tickets FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "repair_tickets·management·all·own·location"
  ON repair_tickets FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = repair_tickets.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "repair_tickets·operator·read·own·location"
  ON repair_tickets FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = repair_tickets.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── maintenance_stages ──────────────────────────────────────────────────────

CREATE POLICY "maintenance_stages·admin·all"
  ON maintenance_stages FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "maintenance_stages·management·all·own·location"
  ON maintenance_stages FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = maintenance_stages.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "maintenance_stages·operator·read·own·location"
  ON maintenance_stages FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = maintenance_stages.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── alerts ──────────────────────────────────────────────────────────────────

CREATE POLICY "alerts·admin·all"
  ON alerts FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "alerts·management·all·own·location"
  ON alerts FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = alerts.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "alerts·operator·read·own·location"
  ON alerts FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = alerts.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ─── contracts ───────────────────────────────────────────────────────────────

CREATE POLICY "contracts·admin·all"
  ON contracts FOR ALL
  USING (auth_role() = 'admin');

-- Management reads contracts linked to their branch (or fleet-wide contracts)
CREATE POLICY "contracts·management·read·own·branch"
  ON contracts FOR SELECT
  USING (
    auth_role() = 'management'
    AND (branch_id = auth_location_id() OR branch_id IS NULL)
  );

CREATE POLICY "contracts·management·write·own·branch"
  ON contracts FOR INSERT
  WITH CHECK (
    auth_role() = 'management'
    AND branch_id = auth_location_id()
  );

CREATE POLICY "contracts·operator·read"
  ON contracts FOR SELECT
  USING (auth_role() = 'operator');


-- ─── contract_vehicles ───────────────────────────────────────────────────────

CREATE POLICY "contract_vehicles·admin·all"
  ON contract_vehicles FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "contract_vehicles·management·read·own·location"
  ON contract_vehicles FOR SELECT
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = contract_vehicles.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "contract_vehicles·management·write·own·location"
  ON contract_vehicles FOR INSERT
  WITH CHECK (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "contract_vehicles·operator·read"
  ON contract_vehicles FOR SELECT
  USING (auth_role() = 'operator');


-- ─── reservations ────────────────────────────────────────────────────────────

CREATE POLICY "reservations·admin·all"
  ON reservations FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "reservations·management·all·own·branch"
  ON reservations FOR ALL
  USING (
    auth_role() = 'management'
    AND (branch_id = auth_location_id() OR branch_id IS NULL)
  );

CREATE POLICY "reservations·operator·read·own·branch"
  ON reservations FOR SELECT
  USING (
    auth_role() = 'operator'
    AND (branch_id = auth_location_id() OR branch_id IS NULL)
  );


-- ─── parts_requests ──────────────────────────────────────────────────────────

CREATE POLICY "parts_requests·admin·all"
  ON parts_requests FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "parts_requests·management·all·own·branch"
  ON parts_requests FOR ALL
  USING (
    auth_role() = 'management'
    AND (branch_id = auth_location_id() OR branch_id IS NULL)
  );

CREATE POLICY "parts_requests·operator·read·own·branch"
  ON parts_requests FOR SELECT
  USING (
    auth_role() = 'operator'
    AND (branch_id = auth_location_id() OR branch_id IS NULL)
  );


-- ─── vendors ─────────────────────────────────────────────────────────────────

CREATE POLICY "vendors·admin·all"
  ON vendors FOR ALL
  USING (auth_role() = 'admin');

-- Vendors are readable by management and operators (needed for parts/repair forms)
CREATE POLICY "vendors·management·read"
  ON vendors FOR SELECT
  USING (auth_role() = 'management');

CREATE POLICY "vendors·operator·read"
  ON vendors FOR SELECT
  USING (auth_role() = 'operator');


-- ─── vehicle_events ──────────────────────────────────────────────────────────

CREATE POLICY "vehicle_events·admin·all"
  ON vehicle_events FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "vehicle_events·management·all·own·location"
  ON vehicle_events FOR ALL
  USING (
    auth_role() = 'management'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_events.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );

CREATE POLICY "vehicle_events·operator·read·own·location"
  ON vehicle_events FOR SELECT
  USING (
    auth_role() = 'operator'
    AND EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_events.vehicle_id
        AND v.location_id = auth_location_id()
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- ADDITIONS — Admin management tables
-- ═══════════════════════════════════════════════════════════════════════════

-- Extend user_role with inspector and mechanic
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'inspector';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mechanic';

-- Extend vendors table with missing columns
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS notes   TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS active  BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS category TEXT;

-- ─── SERVICE PROVIDERS ───────────────────────────────────────────────────────
-- Authorized dealers, internal workshops, specialists, mobile mechanics.
-- Distinct from vendors (parts suppliers) — these handle repair work.

CREATE TYPE service_provider_type AS ENUM ('internal', 'authorized_dealer', 'specialist', 'mobile');

CREATE TABLE service_providers (
  id              UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT                   NOT NULL,
  type            service_provider_type  NOT NULL DEFAULT 'internal',
  location_ids    UUID[]                 NOT NULL DEFAULT '{}',
  speciality      TEXT,
  contact_name    TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  avg_repair_days NUMERIC(4,1)           CHECK (avg_repair_days >= 0),
  active          BOOLEAN                NOT NULL DEFAULT true,
  notes           TEXT,
  created_at      TIMESTAMPTZ            NOT NULL DEFAULT now()
);

ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sp_type   ON service_providers (type);
CREATE INDEX idx_sp_active ON service_providers (active) WHERE active = true;

CREATE POLICY "service_providers·admin·all"
  ON service_providers FOR ALL
  USING (auth_role() = 'admin');

CREATE POLICY "service_providers·management·read"
  ON service_providers FOR SELECT
  USING (auth_role() = 'management');

CREATE POLICY "service_providers·operator·read"
  ON service_providers FOR SELECT
  USING (auth_role() = 'operator');

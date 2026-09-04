CREATE TABLE locations (
    id            BIGSERIAL PRIMARY KEY,
    location_id   VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    building      VARCHAR(50),
    floor         VARCHAR(20),
    is_public     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
    id              BIGSERIAL PRIMARY KEY,
    department_id   VARCHAR(50)  NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    head_of_dept    VARCHAR(100),
    location_id     BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE facilities (
    id            BIGSERIAL PRIMARY KEY,
    facility_id   VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    facility_type VARCHAR(50),
    location_id   BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    is_available  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE operations (
    id             BIGSERIAL PRIMARY KEY,
    operation_id   VARCHAR(50)  NOT NULL UNIQUE,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    status         VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    location_id    BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    operating_hours VARCHAR(100),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

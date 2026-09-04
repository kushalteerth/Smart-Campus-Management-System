CREATE TABLE routes (
    id                      BIGSERIAL PRIMARY KEY,
    route_id                VARCHAR(50) NOT NULL UNIQUE,
    source_location_id      BIGINT      NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    destination_location_id BIGINT      NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    distance                DECIMAL(10,2) NOT NULL CHECK (distance > 0),
    description             TEXT,
    bidirectional           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_no_self_loop CHECK (source_location_id != destination_location_id)
);

CREATE TABLE timetables (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject     VARCHAR(100) NOT NULL,
    day_of_week VARCHAR(20)  NOT NULL CHECK (day_of_week IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY')),
    start_time  TIME         NOT NULL,
    end_time    TIME         NOT NULL,
    location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    instructor  VARCHAR(100),
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

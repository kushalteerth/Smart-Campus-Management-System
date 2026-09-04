CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    user_id      VARCHAR(50)  NOT NULL UNIQUE,
    full_name    VARCHAR(100) NOT NULL,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','STUDENT','VISITOR')),
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE admins (
    id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE students (
    id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50)  NOT NULL UNIQUE,
    program    VARCHAR(100) NOT NULL,
    year       VARCHAR(20)  NOT NULL
);

CREATE TABLE visitors (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    entry_time TIMESTAMP    NOT NULL DEFAULT NOW(),
    exit_time  TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP   NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

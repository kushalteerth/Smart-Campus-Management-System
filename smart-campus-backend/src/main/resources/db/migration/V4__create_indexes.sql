CREATE INDEX idx_users_user_id   ON users(user_id);
CREATE INDEX idx_users_username  ON users(username);
CREATE INDEX idx_users_role      ON users(role);

CREATE INDEX idx_students_student_id ON students(student_id);

CREATE INDEX idx_locations_location_id ON locations(location_id);
CREATE INDEX idx_locations_name        ON locations(name);

CREATE INDEX idx_departments_name ON departments(name);

CREATE INDEX idx_facilities_name ON facilities(name);

CREATE INDEX idx_routes_source ON routes(source_location_id);
CREATE INDEX idx_routes_dest   ON routes(destination_location_id);

CREATE INDEX idx_timetable_student ON timetables(student_id);

CREATE INDEX idx_refresh_tokens_user   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token  ON refresh_tokens(token);

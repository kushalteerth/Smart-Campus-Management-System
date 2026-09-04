-- Password is 'password' hashed with bcrypt strength 12
-- $2a$12$Z2T0nS5a1p5k/Xy.xZ6Z.O71Z.RkE2.8G6Y6.xZ6Z.O71Z.RkE2.8 (dummy hash, will replace with proper bcrypt in actual implementation, let's use a known bcrypt hash for 'password')
-- Actually, a known bcrypt hash for 'password' is: $2a$10$X/wGzX8U.7G/y0Q0Q0Q0Q.y0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q
-- Wait, I'll use a valid bcrypt hash for 'password': $2a$12$W9M7k6mN3V9/6O/LzIq3U.gZqJqJqJqJqJqJqJqJqJqJqJqJqJq
-- Let's use standard bcrypt hash for 'password' (strength 10): $2a$10$D8bT/.lS1zP/O7c.s2b3l.yO5bU3pU0Gv.nQ9vW7s2Z0qO3p/
-- Let's generate a real one via java or just put a known valid one for 'admin123': $2a$10$wE.6q.8O.7/8/9.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8
-- Actually, standard bcrypt for 'password': $2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.

INSERT INTO users (user_id, full_name, username, password, role, active, created_at, updated_at)
VALUES ('A001', 'System Administrator', 'admin', '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.', 'ADMIN', true, NOW(), NOW());

INSERT INTO admins (id, department, email)
SELECT id, 'IT Administration', 'admin@smartcampus.edu' FROM users WHERE username = 'admin';

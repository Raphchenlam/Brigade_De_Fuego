INSERT INTO employee (first_name, last_name, role, color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_point, password_salt, password_hash)
VALUES
  ('Sarah', 'Johnson', 'Designer', '#FF9933', 40.25, 5476387465783321, 'sarah.johnson@example.com', '555-123-4567', FALSE, FALSE, TRUE, TRUE, 80, 'ghi789', 'hashed_password_3'),
  ('Michael', 'Williams', 'Developer', '#009933', 37.75, 7652875093748567, 'michael.williams@example.com', '444-567-8901', TRUE, FALSE, FALSE, TRUE, 65, 'jkl012', 'hashed_password_4'),
  ('Emily', 'Brown', 'Analyst', '#CC3366', 42.00, 1358711295876479, 'emily.brown@example.com', '222-789-0123', FALSE, FALSE, TRUE, TRUE, 70, 'mno345', 'hashed_password_5'),
  ('David', 'Miller', 'Manager', '#6600CC', 50.50, 2468905678456380, 'david.miller@example.com', '111-234-5678', TRUE, TRUE, FALSE, TRUE, 95, 'pqr678', 'hashed_password_6'),
  ('Sophia', 'Anderson', 'Designer', '#FF6600', 45.00, 7656748596793543, 'sophia.anderson@example.com', '666-876-5432', FALSE, FALSE, TRUE, TRUE, 85, 'stu901', 'hashed_password_7');

-- Insertion dans la table event_type
INSERT INTO event_type("name")
	VALUES
  ('Sportif'),
  ('Ferié');

-- Insertion dans la table event
INSERT INTO event("name", event_type, impact, is_active)
	VALUES
  ('Game du canadien', 'Sportif', 1.4, true),
  ('Fete des meres', 'Ferié', 2.5, true);

-- Insertion dans la table schedule_week
INSERT INTO schedule_week ("start_date", "end_date")
VALUES 
('2023-09-01', '2023-09-07'),
('2023-09-08', '2023-09-14');

-- Insertion dans la table shift
INSERT INTO shift ("name", start_time, end_time)
VALUES 
('Midi', '10:00:00', '16:00:00'),
('Soir', '16:00:00', '23:00:00');

  -- Insertion dans la table schedule_period
INSERT INTO schedule_period ("date", shift_name, schedule_week_id, average_traffic, expected_traffic, actual_traffic, average_cost_by_client, required_skill_points, expected_skill_points, scheduled_skill_points)
VALUES 
('2023-09-01', 'Midi', 1, 100, 100, 0, 50.0, 0, 50, 0),
('2023-09-01', 'Soir', 1, 120, 120, 0, 55.0, 0, 60, 0),
('2023-09-02', 'Midi', 1, 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-02', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-03', 'Midi', 1, 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-03', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-04', 'Midi', 1, 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-04', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-05', 'Midi', 1, 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-05', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-06', 'Midi', 1, 110, 110, 24, 52.0, 12, 55, 0),
('2023-09-06', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-07', 'Midi', 1, 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-07', 'Soir', 1, 130, 130, 0, 60.0, 0, 65, 0);

-- Insertion dans la table schedule_event
INSERT INTO schedule_event(schedule_period_id, event_id)
	VALUES
  (2, 1),
  (9, 2),
  (10, 2);

-- Insertion dans la table role
INSERT INTO role ("name", team)
VALUES 
('Gestionnaire', 'Service'),
('Serveur', 'Service'),
('Hotesse', 'Service');

-- Insertion dans la table leave_category
INSERT INTO leave_category ("name")
VALUES 
('Personel'),
('Vacance'),
('Maladie');

-- Insertion dans la table leave_status
INSERT INTO leave_status ("name")
VALUES 
('En attente'),
('Refusé'),
('Approuvé');


-- Insertion dans la table employee
INSERT INTO employee (employee_number, first_name, last_name, "role", color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
VALUES 
(1111, 'Genevieve', 'Dermers', 'Gestionnaire', '#FF2678', 40.0, '3998765498762980', 'genevieve@example.com', '555-555-555', true, true, false, true, null, 'salt123', 'hash123'),
(2222,'John', 'Doe', 'Serveur', '#FF5733', 30.0, '234458333957656', 'john@example.com', '123-456-7890', false, false, false, true, 8, 'salt123', 'hash123'),
(3333, 'Jane', 'Smith', 'Hotesse', '#3355FF', 35.0, '6547559223454321', 'jane@example.com', '987-654-3210', false, false, true, true, 3, 'salt456', 'hash456');

-- Insertion dans la table punch
INSERT INTO punch (employee_number, "date", punch_in, punch_out)
VALUES 
(2222, '2023-09-01', '08:00:00', '16:00:00'),
(3333, '2023-09-01', '09:00:00', '17:00:00');

-- Insertion dans la table leave
INSERT INTO leave (employee_number, "start_date", end_date, category, reason, "status")
VALUES 
(1111, '2023-09-05', '2023-09-05', 'Maladie', 'Rendez-vous medecin', 'En attente'),
(2222, '2023-09-10', '2023-09-15', 'Vacance', '1iere semaine de vacance', 'Approuvé');

  -- Insertion dans la table employee+schedule
INSERT INTO employee_schedule(employee_number, schedule_period_id, start_time, end_time)
VALUES 
(1111, 1, '08:00:00', '16:00:00'),
(1111, 2, '16:00:00', '22:00:00'),
(1111, 3, '8:00:00', '16:00:00'),
(1111, 4, '16:00:00', '22:00:00'),
(2222, 1, '10:00:00', '15:00:00'),
(3333, 2, '17:00:00', '20:00:00'),
(3333, 3, '11:00:00', '14:00:00'),
(2222, 4, '16:00:00', '22:00:00');


  -- Insertion dans la table client
INSERT INTO client (first_name, last_name, phone_number, allergy, is_favorite, is_blacklisted)
VALUES 
('Alice', 'Aupays', '123-456-7890', null, true, false),
('Bob', 'Gratton', '987-654-3210', 'Gluten', false, true);

-- Insertion dans la table reservation_status
INSERT INTO reservation_status ("name")
VALUES 
('Confirmé'),
('No Show');

-- Insertion dans la table table_state
INSERT INTO table_state ("name")
VALUES 
('Disponible'),
('Réservée'),
('Occupé');

-- Insertion dans la table "table"
INSERT INTO "table" (state_code, capacity, is_active)
VALUES 
(1, 4, true),
(1, 8, true),
(2, 6, true);

-- Insertion dans la table reservation
INSERT INTO reservation (table_number, client_id, status_code, people_count, "date", start_time, end_time, mention, has_minor, taken_by) VALUES 
(1, 1, 1, 3, '2023-09-10', '18:00:00', '20:00:00', null, false, 2),
(2, 1, 1, 5, '2023-09-12', '19:00:00', '22:00:00', 'Fete de Alice', true, 1);

-- Insertion dans la table assignation
INSERT INTO assignation(employee_number, table_number, "date", shift)
	VALUES 
  (2222, 1, '2023-09-01', 'Midi'),
  (2222, 2, '2023-09-01', 'Midi'),
  (3333, 3, '2023-09-01', 'Midi');
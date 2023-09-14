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
('2023-08-28', '2023-09-03'),
('2023-09-04', '2023-09-10'),
('2023-09-11', '2023-09-17'),
('2023-09-18', '2023-09-24'),
('2023-09-25', '2023-10-01');

-- Insertion dans la table shift
INSERT INTO shift ("name", start_time, end_time)
VALUES 
('Midi', '10:00:00', '16:00:00'),
('Soir', '16:00:00', '23:00:00');

  -- Insertion dans la table schedule_period
INSERT INTO schedule_period ("date", shift_name, schedule_week_id, average_traffic, expected_traffic, actual_traffic, average_cost_by_client, required_skill_points, expected_skill_points, scheduled_skill_points)
VALUES 
('2023-09-01', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-01' >= start_date AND '2023-09-01' <= end_date), 100, 100, 0, 50.0, 0, 50, 0),
('2023-09-01', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-01' >= start_date AND '2023-09-01' <= end_date), 120, 120, 0, 55.0, 0, 60, 0),
('2023-09-02', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-02' >= start_date AND '2023-09-02' <= end_date), 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-02', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-02' >= start_date AND '2023-09-02' <= end_date), 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-03', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-03' >= start_date AND '2023-09-03' <= end_date), 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-03', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-03' >= start_date AND '2023-09-03' <= end_date), 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-04', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-04' >= start_date AND '2023-09-04' <= end_date), 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-04', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-04' >= start_date AND '2023-09-04' <= end_date), 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-05', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-05' >= start_date AND '2023-09-05' <= end_date), 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-05', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-05' >= start_date AND '2023-09-05' <= end_date), 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-06', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-06' >= start_date AND '2023-09-06' <= end_date), 110, 110, 24, 52.0, 12, 55, 0),
('2023-09-06', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-06' >= start_date AND '2023-09-06' <= end_date), 130, 130, 0, 60.0, 0, 65, 0),
('2023-09-07', 'Midi', (SELECT id FROM schedule_week WHERE '2023-09-07' >= start_date AND '2023-09-07' <= end_date), 110, 110, 0, 52.0, 0, 55, 0),
('2023-09-07', 'Soir', (SELECT id FROM schedule_week WHERE '2023-09-07' >= start_date AND '2023-09-07' <= end_date), 130, 130, 0, 60.0, 0, 65, 0);
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
(2222,'John', 'Doe', 'Serveur', '#FF5733', 30.0, '2344583339576560', 'john@example.com', '123-456-7890', false, false, false, true, 8, 'salt123', 'hash123'),
(3333, 'Jane', 'Smith', 'Hotesse', '#3355FF', 35.0, '6547559223454321', 'jane@example.com', '987-654-3210', false, false, true, true, 3, 'salt456', 'hash456'),
(4444,'Johnny', 'Sins', 'Serveur', '#FF5733', 30.0, '2344588639576560', 'johnny@example.com', '987-654-7890', false, false, false, true, 10, 'salt123', 'hash123'),
(5555, 'Janette', 'Smithers', 'Hotesse', '#3355FF', 35.0, '6547598653454321', 'janette@example.com', '456-654-3210', false, false, true, true, 5, 'salt456', 'hash456'),
(6666,'Bobby', 'Doolittle', 'Serveur', '#FF5733', 30.0, '8964588639576560', 'johnny@example.com', '987-852-7890', false, false, false, true, 6, 'salt123', 'hash123'),
(7777, 'Annette', 'Shwartz', 'Serveur', '#3355FF', 35.0, '6547598653454784', 'janette@example.com', '125-654-3210', false, false, true, true, 10, 'salt456', 'hash456');

-- Insertion dans la table punch
INSERT INTO punch (employee_number, date_in, punch_in, date_out, punch_out)
VALUES 
(2222, '2023-09-01', '08:00:00', '2023-09-01', '16:00:00'),
(3333, '2023-09-01', '09:00:00', '2023-09-01', '17:00:00');

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
('Bob', 'Gratton', '987-654-3210', 'Gluten', false, true),
('Jean', 'Dupont', '555-123-4567', 'Poisson', true, false),
('Marie', 'Lefrançois', '888-555-1234', null, false, false),
('Pierre', 'Tremblay', '777-999-8888', 'Lait', true, true),
('Sophie', 'Gagnon', '555-777-9999', null, false, false),
('Louis', 'Martin', '444-333-2222', 'Noix', true, false),
('Isabelle', 'Roy', '111-222-3333', null, false, false),
('Michel', 'Leclerc', '999-888-7777', 'Oeufs', true, true),
('Élizabeth', 'Girard', '666-555-4444', 'Blé', true, false),
('François', 'Bouchard', '222-333-4444', null, false, false),
('Catherine', 'Lavoie', '333-444-5555', 'Arachides', true, true);

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
(1, 2, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, false),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, true),
(1, 4, true),
(2, 6, false),
(1, 8, true);

-- Insertion dans la table reservation
INSERT INTO reservation (table_number, client_id, status_code, people_count, "date", start_time, end_time, mention, has_minor, taken_by) 
VALUES 
(1, 1, 1, 3, '2023-09-10', '18:00:00', '20:00:00', null, false, '6547559223454321'),
(2, 1, 1, 5, '2023-09-12', '19:00:00', '22:00:00', 'Fete de Alice', true, '6547559223454321'),
(3, 2, 1, 4, '2023-09-15', '20:30:00', '22:30:00', 'Réunion d"affaires', false, '6547559223454321'),
(4, 3, 1, 6, '2023-09-18', '12:15:00', '15:30:00', null, true, '6547559223454321'),
(5, 4, 1, 2, '2023-09-20', '17:00:00', '18:30:00', 'Anniversaire de Marie', false, '6547559223454321'),
(6, 5, 1, 3, '2023-09-22', '18:45:00', '20:15:00', null, false, '6547559223454321'),
(7, 6, 1, 5, '2023-09-25', '11:00:00', '13:00:00', 'Réunion familiale', true, '6547598653454321'),
(8, 7, 1, 4, '2023-09-28', '19:30:00', '21:30:00', null, false, '6547598653454321'),
(9, 8, 1, 2, '2023-09-30', '12:30:00', '13:30:00', 'Dîner romantique', false, '6547598653454321'),
(10, 9, 1, 7, '2023-10-02', '18:15:00', '22:30:00', 'Fête d"anniversaire surprise', true, '6547598653454321'),
(11, 10, 1, 3, '2023-10-05', '19:00:00', '20:45:00', null, false, '6547598653454321'),
(12, 2, 1, 4, '2023-10-08', '20:00:00', '22:15:00', 'Réunion de groupe', false, '6547598653454321');

-- Insertion dans la table assignation
INSERT INTO assignation(employee_number, table_number, "date", shift)
	VALUES 
  (2222, 1, '2023-09-01', 'Midi'),
  (2222, 2, '2023-09-01', 'Midi'),
  (3333, 3, '2023-09-01', 'Midi');
-- Insertion dans la table event_type
INSERT INTO event_type("name")
VALUES
('Sportif'),
('Promotion'),
('Party Spécial'),
('Ferié');

-- Insertion dans la table shift
INSERT INTO shift ("name", start_time, end_time)
VALUES 
('Midi', '10:00:00', '16:00:00'),
('Soir', '16:00:00', '23:00:00');

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
('Pending'),
('PendingModified'),
('Refused'),
('Approved');

-- Insertion dans la table employee
INSERT INTO employee (employee_number, first_name, last_name, "role", color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
VALUES 
(1999, 'Francis', 'Maynard', 'Gestionnaire', '#4CAF50', 28.75, '1999199919991999', 'francis@gmail.com', '819-975-1678', true, false, true, true, null, '1FWoqQKDysX5Rla/6wfZgg==', 'hdvTc+tGgkgK32lHopmpPU8Bgjv0pHC2KUUsQl5bxapV3tmiSIkFWknLkD/scsKMCJlRM6ONKXMMGrOQWgCmeg==');


-- Insertion dans la table reservation_status
INSERT INTO reservation_status ("name")
VALUES 
('Confirmé'),
('En cours'),
('En retard'),
('Délai échu'),
('Terminé'),
('No Show'),
('Annulé'),
('Blacklisted');

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
(1, 12, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 12, true),
(1, 4, true),
(2, 6, true),
(1, 8, true),
(1, 2, true),
(1, 4, true),
(2, 6, true),
(1, 8, true);

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


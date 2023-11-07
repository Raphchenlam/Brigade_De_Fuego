-- Insertion dans la table event_type
INSERT INTO event_type("name")
VALUES
('Sportif'),
('Promotion'),
('Party Spécial'),
('Ferié');

-- Insertion dans la table event
INSERT INTO event("name", event_type, impact, is_active)
VALUES
('Fete Des Meres', 'Ferié', 194.68, true),
('Game Du Canadien', 'Sportif', 118.68, true),
('Midi Ole', 'Promotion', 122.29, true);

-- Insertion dans la table schedule_week
INSERT INTO schedule_week ("id", "start_date", "end_date", published)
VALUES 
('2023-W44', '2023-10-30', '2023-11-05', false),
('2023-W45', '2023-11-06', '2023-11-12', false);

-- Insertion dans la table shift
INSERT INTO shift ("name", start_time, end_time)
VALUES 
('Midi', '10:00:00', '16:00:00'),
('Soir', '16:00:00', '23:00:00');


-- Insertion dans la table schedule_period
INSERT INTO schedule_period ("date", shift_name, schedule_week_id, average_traffic, expected_traffic, actual_traffic, average_cost_by_client, required_skill_points, expected_skill_points, scheduled_skill_points)
VALUES 
('2023-10-30', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-10-30', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-10-31', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-10-31', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-01', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-01', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-02', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-02', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-03', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-03', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-04', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-04', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-05', 'Midi', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-05', 'Soir', '2023-W44', 0, 0, 0, 0, 0, 0, 0),
('2023-11-06', 'Midi', '2023-W45', 50, 0, 0, 20, 0, 0, 0),
('2023-11-06', 'Soir', '2023-W45', 60, 0, 0, 25, 0, 0, 0),
('2023-11-07', 'Midi', '2023-W45', 50, 0, 0, 20, 0, 0, 0),
('2023-11-07', 'Soir', '2023-W45', 60, 0, 0, 25, 0, 0, 0),
('2023-11-08', 'Midi', '2023-W45', 50, 0, 0, 20, 0, 0, 14),
('2023-11-08', 'Soir', 	'2023-W45', 60, 0, 0, 25, 0, 0, 14),
('2023-11-09', 'Midi', 	'2023-W45', 80, 0, 0, 25, 0, 0, 21),
('2023-11-09', 'Soir', 	'2023-W45', 90, 0, 0, 30, 0, 0, 33),
('2023-11-10', 'Midi', 	'2023-W45', 80, 0, 0, 25, 0, 0, 0),
('2023-11-10', 'Soir', 	'2023-W45', 150, 0, 0, 35, 0, 0, 5),
('2023-11-11', 'Midi', 	'2023-W45', 100, 0, 0, 40, 0, 0, 0),
('2023-11-11', 'Soir', 	'2023-W45', 150, 0, 0, 50, 0, 0, 5),
('2023-11-12', 'Midi', 	'2023-W45', 100, 0, 0, 40, 0, 0, 0),
('2023-11-12', 'Soir', 	'2023-W45', 100, 0, 0, 45, 0, 0, 5);


-- Insertion dans la table role
INSERT INTO role ("name", team)
VALUES 
('Gestionnaire', 'Service'),
('Serveur', 'Service'),
('Hotesse', 'Service');

-- Insertion dans la table schedule_event
INSERT INTO schedule_event(schedule_period_id, event_name)
VALUES
(19, 'Midi Ole'),
(22, 'Fete Des Meres'),
(26, 'Game Du Canadien');

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

INSERT INTO employee (employee_number, first_name, last_name, "role", color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
VALUES 
(1111, 'Johnny', 'Sins', 'Serveur', '#1A237E', 21, '3423535423523532', 'johnnysins@gmail.com','111-111-1111', false, false, true, true, 6,'OujRJN8PLrW0jsJMD4SZyg==', '3lEMyKLnZYX40I8M2Pb6iI+Qk77Y9zD3UKWseDu/C7RcZ6K7xgabsrYiS2clJdhX8QgXfqBeniwV35qnwtOLbA=='),
(2222, 'Francis', 'Maynard', 'Hotesse', '#F44336', 19, '5653673464236423', 'francismaynard@gmail.com','222-222-2222', false, false, true, true, 5,'NSTqSlsDXHK9ruXBqPyHlA==', '3rQ0w7ouSP3V8bwOzf6fjLMufEcbo+tvRtq6eFSx10Gw50TF9H/q4oDRzQtYVz83Z1KfIjDDuZ2B9p9FMOK1JQ=='),
(3333, 'Raphael', 'Chenard Lamothe','Serveur', '#4E342E', 22, '4675757577373734', 'raphalgiz@hotmail.com', '333-333-3333', false, false, true, true, 7,'uLyXuqWgpyElVc49AcKM+w==', '4i/yvtqgYNUAfN1b8FAg38DNYySNo62Xp59+jHwJgG7qfpmz1J6qVI2UIJqWrQC/SUpoUxz0mwrmKicVTqO48g=='),
(4444, 'David', 'Baudry', 'Serveur', '#FFEE58', 22, '6436346363636334', 'davidbeaudry@hotmail.com', '444-444-4444', false, false, true, true, 9,'1sWndfRT6tzDljGS14j30g==', 'qkxUtWALdqx2ltY/cXZx/EQUh5KAWZe8AL9VHkQIG46CYR9NQ+4AMEH6GoJkIqd/6e9xM9AydlVlbhg+39K2JA=='),
(5555, 'John', 'Doe', 'Serveur', '#283593', 18, '6547598653454321', 'johndoe@hotmail.com', '555-555-5555', false, false, true, true, 5, 'ZToEiXQXVyVOIWOtK6jO8Q==', 'srsyYU9FP89sYI2gJD/P/jH+SynBCUNlzfp1ou67ZNs5t6G6w9lT4wa2ZnBsRkMOUVIkTVVN1f75XCM3cvMlvw=='),
(6666, 'Maxime', 'Marchand', 'Serveur', '#AB47BC', 25,'3553253535252332', 'm.marchand22@hotmail.com', '666-666-6666', true, false, true, true, 8, 'VA2XZEr8q/oyAjaCCmvl0g==', 'EA22JxS0qkiX2Eqt48dlSz27oh4xZt9FqH4gxSlFTKE37eE7pPs/RS6qixH1imuEo+ADAITRTWnzwIPPu0Y3WQ=='),
(7777, 'Jane', 'Doe', 'Hotesse', '#880E4F', 18,'5353543545413414', 'janedoe@hotmail.com', '777-777-7777', false, false, true, true, 5, 'WDwmA30LrTjpd8bIRsi1zw==', 'rSSn6mI6iL4KSP8kAlzYzyQc/CfJOBJKwtCEwkDtTLqqc7xGhLEc0dF4IIuP3aNMXevNkeWJ4CtdJCkRypbo5g=='),
(9999, 'Genevieve', 'Demers', 'Gestionnaire', '#512DA8', 35, '3998765498762980', 'genevieve.g.demers@cegepsherbrooke.qc.ca', '555-555-5555', true, false, false, true, null, '4d6h6AaovKgyE8OZBzKmSw==', 'mlUsC/3jQrj/pEY57Df58LWR9wOBV4qW3w78fF7+CsMfdCyurxjywxZDadmi3HsFY5kxO5LLjP+uLs3j/0tMQg==');

-- Insertion dans la table punch
INSERT INTO punch (employee_number, date_in, punch_in, date_out, punch_out)
VALUES 
(2222, '2023-11-08', '10:30:00', '2023-11-08', '13:00:00'),
(3333, '2023-11-08', '11:00:00', null, null);

-- Insertion dans la table leave
INSERT INTO leave (employee_number, "start_date", end_date, category, reason, "status")
VALUES 
(1111, '2023-11-05', '2023-11-05', 'Maladie', 'Rendez-vous medecin', 'Pending'),
(4444, '2023-12-12', '2023-12-12', 'Maladie', 'Rendez-vous medecin', 'Refused'),
(4444, '2023-11-11', '2023-11-11', 'Maladie', 'Rendez-vous medecin', 'PendingModified'),
(5555, '2023-12-05', '2023-12-05', 'Maladie', 'Rendez-vous medecin', 'Pending'),
(2222, '2023-12-10', '2023-12-15', 'Vacance', '1iere semaine de vacance', 'Approved');


-- Insertion dans la table employee+schedule
INSERT INTO employee_schedule(employee_number, schedule_period_id, start_time, end_time)
VALUES
(1111, 20, '5:30:00', '19:30:00'),
(1111, 22, '16:00:00', '22:00:00'),
(2222, 22, '16:00:00', '20:00:00'),
(2222, 24, '16:00:00', '20:00:00'),
(2222, 26, '16:00:00', '20:00:00'),
(3333, 21, '10:30:00', '15:30:00'),
(4444, 19, '10:00:00', '16:00:00'),
(4444, 21, '10:00:00', '16:00:00'),
(4444, 22, '16:00:00', '19:00:00'),
(5555, 19, '09:30:00', '15:00:00'),
(5555, 21, '09:30:00', '15:00:00'),
(6666, 20, '16:00:00', '20:00:00'),
(6666, 22, '17:00:00', '23:00:00'),
(7777, 22, '17:00:00', '21:00:00'),
(7777, 28, '16:00:00', '20:00:00'),
(9999, 15, '10:00:00', '16:00:00'),
(9999, 16, '16:00:00', '20:00:00'),
(9999, 17, '10:00:00', '16:00:00'),
(9999, 18, '16:00:00', '20:00:00'),
(9999, 19, '10:00:00', '16:00:00'),
(9999, 20, '16:00:00', '20:00:00'),
(9999, 21, '10:00:00', '16:00:00'),
(9999, 22, '16:00:00', '20:00:00'),
(9999, 23, '10:00:00', '16:00:00'),
(9999, 24, '16:00:00', '20:00:00'),
(9999, 25, '10:00:00', '16:00:00'),
(9999, 26, '16:00:00', '20:00:00'),
(9999, 27, '10:00:00', '16:00:00'),
(9999, 28, '16:00:00', '20:00:00');

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

-- Insertion dans la table 'table'
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


-- Insertion dans la table reservation
INSERT INTO reservation (table_number, client_id, status_code, people_count, "date", start_time, end_time, mention, has_minor, taken_by) 
VALUES 
(null, 1, 1, 6, '2023-11-08', '13:00:00', '16:00:00', null,	false, '3998765498762980'),
(null, 3, 1, 4, '2023-11-08', '11:30:00', '14:30:00', null,	true, '3998765498762980'),
(null, 4, 1, 5, '2023-11-08', '14:08:00', '17:08:00', null,	false, '3998765498762980'),
(null, 6, 1, 8, '2023-11-08', '14:00:00', '17:00:00', 'Fete de Roger', true, '3998765498762980'),
(null, 7, 1, 5, '2023-11-08', '18:00:00', '21:00:00', null, false, '3998765498762980'),
(null, 8, 1, 8, '2023-11-08', '19:00:00', '22:00:00', 'Party de retraite de Angele', true, '3998765498762980'),
(null, 4, 1, 4, '2023-11-09', '14:00:00', '17:00:00', null, false, '3998765498762980'),
(null, 1, 1, 4, '2023-11-09', '12:00:00', '15:00:00', null, false, '3998765498762980'),
(null, 3, 1, 12, '2023-11-09', '19:00:00', '22:00:00', null, false, '3998765498762980'),
(null, 6, 1, 11, '2023-11-09', '19:30:00', '22:30:00', null, false, '3998765498762980'),
(null, 7, 1, 12, '2023-11-09', '18:15:00', '21:15:00', null, true, '3998765498762980');
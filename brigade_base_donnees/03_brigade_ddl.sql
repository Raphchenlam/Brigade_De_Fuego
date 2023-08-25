DROP TABLE IF EXISTS assignation;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_schedule;
DROP TABLE IF EXISTS "event";
DROP TABLE IF EXISTS event_type;
DROP TABLE IF EXISTS leave;
DROP TABLE IF EXISTS leave_category;
DROP TABLE IF EXISTS leave_status;
DROP TABLE IF EXISTS punch;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS reservation_status;
DROP TABLE IF EXISTS "role";
DROP TABLE IF EXISTS schedule_event;
DROP TABLE IF EXISTS schedule_period;
DROP TABLE IF EXISTS shift;
DROP TABLE IF EXISTS "table";
DROP TABLE IF EXISTS table_state;

CREATE TABLE assignation (
  id              SERIAL NOT NULL, 
  employee_number int4 NOT NULL, 
  table_number    int4 NOT NULL, 
  "date"          date NOT NULL, 
  shift           varchar(255) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE client (
  id             SERIAL NOT NULL, 
  name           varchar(255) NOT NULL, 
  phone_number   varchar(255) NOT NULL, 
  allergy        varchar(255), 
  is_favorite    bool NOT NULL, 
  is_blacklisted bool NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE employee (
  employee_number SERIAL NOT NULL, 
  first_name      varchar(255) NOT NULL, 
  last_name       varchar(255) NOT NULL, 
  role            varchar(255) NOT NULL, 
  color_hexcode   varchar(255) NOT NULL, 
  hourly_rate     float8 NOT NULL, 
  barcode_number  int8 NOT NULL UNIQUE, 
  email           varchar(255) NOT NULL, 
  phone_number    varchar(255) NOT NULL, 
  is_admin        bool NOT NULL, 
  is_super_admin  bool NOT NULL, 
  is_new_employee bool NOT NULL, 
  is_active       bool NOT NULL, 
  skill_point     int4 NOT NULL, 
  password_salt   varchar(255) NOT NULL, 
  password_hash   varchar(255) NOT NULL, 
  PRIMARY KEY (employee_number));
CREATE TABLE employee_schedule (
  employee_number    int4 NOT NULL, 
  schedule_period_id int4 NOT NULL, 
  start_time         date NOT NULL, 
  end_time           date NOT NULL, 
  PRIMARY KEY (employee_number, 
  schedule_period_id));
CREATE TABLE event (
  id         SERIAL NOT NULL, 
  name       varchar(255) NOT NULL, 
  event_type varchar(255) NOT NULL, 
  impact     float8 NOT NULL, 
  is_active  bool NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE event_type (
  name varchar(255) NOT NULL, 
  PRIMARY KEY (name));
CREATE TABLE leave (
  id               SERIAL NOT NULL, 
  eemployee_number int4 NOT NULL, 
  start_date       date NOT NULL, 
  end_date         date NOT NULL, 
  category         varchar(255) NOT NULL, 
  reason           varchar(255) NOT NULL, 
  status           varchar(255) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE leave_category (
  name varchar(255) NOT NULL, 
  PRIMARY KEY (name));
CREATE TABLE leave_status (
  name varchar(255) NOT NULL, 
  PRIMARY KEY (name));
CREATE TABLE punch (
  id              SERIAL NOT NULL, 
  employee_number int4 NOT NULL, 
  "date"          date NOT NULL, 
  punch_in        date NOT NULL, 
  punch_out       date NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE reservation (
  id           SERIAL NOT NULL, 
  table_number int4, 
  client_id    int4 NOT NULL, 
  status_code  int2 NOT NULL, 
  people_count int4 NOT NULL, 
  "date"       date NOT NULL, 
  start_time   date NOT NULL, 
  end_time     date NOT NULL, 
  mention      varchar(255), 
  has_minor    bool NOT NULL, 
  taken_by     int4, 
  PRIMARY KEY (id));
CREATE TABLE reservation_status (
  code SERIAL NOT NULL, 
  name varchar(255) NOT NULL, 
  PRIMARY KEY (code));
CREATE TABLE role (
  name varchar(255) NOT NULL, 
  team varchar(255) NOT NULL, 
  PRIMARY KEY (name));
CREATE TABLE schedule_event (
  schedule_period_id int4 NOT NULL, 
  event_id           int4 NOT NULL, 
  PRIMARY KEY (schedule_period_id, 
  event_id));
CREATE TABLE schedule_period (
  id                     SERIAL NOT NULL, 
  "date"                 date NOT NULL, 
  shift                  varchar(255) NOT NULL, 
  schedule_week_id       int4 NOT NULL, 
  average_traffic        int4 NOT NULL, 
  average_cost_by_client float8 NOT NULL, 
  required_skill_points  int4 NOT NULL, 
  actual_skill_points    int4 NOT NULL, 
  actual_traffic         int4 NOT NULL, 
  expected_traffic       int4 NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE schedule_week (
  id         SERIAL NOT NULL, 
  start_date date NOT NULL, 
  end_date   date NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE shift (
  Name       varchar(255) NOT NULL, 
  start_time date NOT NULL, 
  end_time   date NOT NULL, 
  PRIMARY KEY (Name));
CREATE TABLE "table" (
  number     SERIAL NOT NULL, 
  state_code int2 NOT NULL, 
  capacity   int4 NOT NULL, 
  is_active  bool NOT NULL, 
  PRIMARY KEY (number));
CREATE TABLE table_state (
  code SERIAL NOT NULL, 
  name varchar(255) NOT NULL, 
  PRIMARY KEY (code));
ALTER TABLE reservation ADD CONSTRAINT FKreservatio265176 FOREIGN KEY (status_code) REFERENCES reservation_status (code);
ALTER TABLE "table" ADD CONSTRAINT FKtable360609 FOREIGN KEY (state_code) REFERENCES table_state (code);
ALTER TABLE reservation ADD CONSTRAINT FKreservatio976569 FOREIGN KEY (table_number) REFERENCES "table" (number);
ALTER TABLE assignation ADD CONSTRAINT FKassignatio144871 FOREIGN KEY (employee_number) REFERENCES employee (employee_number);
ALTER TABLE assignation ADD CONSTRAINT FKassignatio129665 FOREIGN KEY (table_number) REFERENCES "table" (number);
ALTER TABLE schedule_event ADD CONSTRAINT FKschedule_e346697 FOREIGN KEY (event_id) REFERENCES event (id);
ALTER TABLE schedule_event ADD CONSTRAINT FKschedule_e359780 FOREIGN KEY (schedule_period_id) REFERENCES schedule_period (id);
ALTER TABLE employee_schedule ADD CONSTRAINT FKemployee_s279066 FOREIGN KEY (schedule_period_id) REFERENCES schedule_period (id);
ALTER TABLE employee_schedule ADD CONSTRAINT FKemployee_s627940 FOREIGN KEY (employee_number) REFERENCES employee (employee_number);

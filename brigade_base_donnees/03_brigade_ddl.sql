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

CREATE TABLE event_type (
  "name" varchar(255) NOT NULL, 
  PRIMARY KEY ("name"));

CREATE TABLE event ( 
  "name"     varchar(255) NOT NULL, 
  event_type varchar(255) NOT NULL REFERENCES event_type("name"), 
  impact     float4 NOT NULL, 
  is_active  bool NOT NULL,
  PRIMARY KEY ("name"));

CREATE TABLE schedule_week (
  id           varchar(255) NOT NULL, 
  "start_date" date NOT NULL, 
  end_date     date NOT NULL, 
  PRIMARY KEY (id));

  CREATE TABLE shift (
  "name"     varchar(255) NOT NULL, 
  start_time time NOT NULL, 
  end_time   time NOT NULL, 
  PRIMARY KEY ("name"));


-- average_traffic : historique en nombre de têtes d'après les données du passée
-- actual_traffic : calculer avec le nombre de personnes en réservation
-- expected_traffic : Calcul avec le average versus actuel et sera impacté par les events
CREATE TABLE schedule_period (
  id                     SERIAL NOT NULL, 
  "date"                 date NOT NULL, 
  shift_name             varchar(255) NOT NULL REFERENCES shift("name"), 
  schedule_week_id       varchar(255) NOT NULL REFERENCES schedule_week("id"),
  average_traffic        int4 NOT NULL,
  expected_traffic        int4 NOT NULL,
  actual_traffic         int4 NOT NULL, 
  average_cost_by_client float4 NOT NULL, 
  required_skill_points  int4 NOT NULL, 
  expected_skill_points    int4 NOT NULL,
  scheduled_skill_points int4 NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE schedule_event (
  schedule_period_id int4 NOT NULL REFERENCES schedule_period("id"), 
  event_name           varchar(255) NOT NULL REFERENCES "event"("name"), 
  PRIMARY KEY (schedule_period_id, event_name));

CREATE TABLE role (
  "name" varchar(255) NOT NULL, 
  team varchar(255) NOT NULL, 
  PRIMARY KEY ("name"));

CREATE TABLE leave_category (
  "name" varchar(255) NOT NULL, 
  PRIMARY KEY ("name"));

CREATE TABLE leave_status (
  "name" varchar(255) NOT NULL, 
  PRIMARY KEY ("name"));

CREATE TABLE employee (
  employee_number int4 NOT NULL, 
  first_name      varchar(255) NOT NULL, 
  last_name       varchar(255) NOT NULL, 
  "role"          varchar(255) NOT NULL REFERENCES "role"("name"), 
  color_hexcode   varchar(255) NOT NULL, 
  hourly_rate     float4 NOT NULL, 
  barcode_number  varchar(255) NOT NULL UNIQUE,
  email           varchar(255) NOT NULL, 
  phone_number    varchar(255) NOT NULL, 
  is_admin        bool NOT NULL, 
  is_super_admin  bool NOT NULL, 
  is_new_employee bool NOT NULL, 
  is_active       bool NOT NULL, 
  skill_points     int4, 
  password_salt   varchar(255) NOT NULL, 
  password_hash   varchar(255) NOT NULL, 
  PRIMARY KEY (employee_number));

CREATE TABLE punch (
  id              SERIAL NOT NULL, 
  employee_number int4 NOT NULL REFERENCES employee("employee_number") , 
  date_in         date NOT NULL, 
  punch_in        time NOT NULL, 
  date_out        date, 
  punch_out       time, 
  PRIMARY KEY (id));

CREATE TABLE leave (
  id               SERIAL NOT NULL, 
  employee_number int4 NOT NULL REFERENCES employee("employee_number"), 
  "start_date"     date NOT NULL, 
  end_date         date NOT NULL, 
  category         varchar(255) NOT NULL REFERENCES leave_category("name"), 
  reason           varchar(255) NOT NULL, 
  "status"         varchar(255) NOT NULL REFERENCES leave_status("name"), 
  PRIMARY KEY (id));

CREATE TABLE employee_schedule (
  employee_number    int4 NOT NULL REFERENCES employee("employee_number"), 
  schedule_period_id int4 NOT NULL REFERENCES schedule_period("id"), 
  start_time         time NOT NULL, 
  end_time           time NOT NULL, 
  PRIMARY KEY (employee_number, schedule_period_id));

CREATE TABLE client (
  id             SERIAL NOT NULL, 
  first_name     varchar(255) NOT NULL, 
  last_name      varchar(255) NOT NULL, 
  phone_number   varchar(255) NOT NULL, 
  allergy        varchar(255), 
  is_favorite    bool NOT NULL, 
  is_blacklisted bool NOT NULL, 
  PRIMARY KEY (id),
  UNIQUE (first_name, last_name, phone_number));
  
CREATE TABLE reservation_status (
  code SERIAL NOT NULL, 
  "name" varchar(255) NOT NULL, 
  PRIMARY KEY (code));

CREATE TABLE table_state (
  code SERIAL NOT NULL, 
  "name" varchar(255) NOT NULL, 
  PRIMARY KEY (code));

CREATE TABLE "table" (
  "number"   SERIAL NOT NULL, 
  state_code int2 NOT NULL REFERENCES table_state("code"), 
  capacity   int4 NOT NULL, 
  is_active  bool NOT NULL, 
  PRIMARY KEY ("number"));

CREATE TABLE reservation (
  id           SERIAL NOT NULL, 
  table_number int4 REFERENCES "table"("number"), 
  client_id    int4 NOT NULL REFERENCES client("id"), 
  status_code  int2 NOT NULL REFERENCES reservation_status("code"), 
  people_count int4 NOT NULL, 
  "date"       date NOT NULL, 
  start_time   time NOT NULL, 
  end_time     time NOT NULL, 
  mention      varchar(255), 
  has_minor    bool NOT NULL, 
  taken_by     varchar(255),
  PRIMARY KEY (id));

CREATE TABLE assignation (
  id              SERIAL NOT NULL, 
  employee_number int4 NOT NULL REFERENCES employee("employee_number"), 
  table_number    int4 NOT NULL REFERENCES "table"("number"), 
  "date"          date NOT NULL, 
  shift           varchar(255) NOT NULL, 
  assignation_is_active bool NOT NULL,
  PRIMARY KEY (id));

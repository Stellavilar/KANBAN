-- Création des tables pour l'API oKanban

-- ouverture d'une transaction 
-- une transaction est un bloc d'instructions contigues. Si l'une des instructions échoue, c'est tout le bloc qui est annulé
BEGIN;

-- drop all tables !
DROP TABLE IF EXISTS "list", "card", "label", "card_has_label";

-- table "list"
CREATE TABLE "list"(
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL UNIQUE,
  "position" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP
);

-- table "card"
CREATE TABLE "card"(
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "position" INT NOT NULL DEFAULT 0,
  "color" TEXT NOT NULL DEFAULT '#fff',
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP,
  "list_id" INT NOT NULL REFERENCES "list"("id")
);

-- table "label"
CREATE TABLE "label"(
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL UNIQUE,
  "color" TEXT NOT NULL DEFAULT '#fff',
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP
);

-- table de liaison "card_has_label"
CREATE TABLE "card_has_label"(
  "card_id" INT NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
  "label_id" INT NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("card_id", "label_id")
);

-- validation de la transaction
COMMIT;

-- deuxième transaction, seeding !
BEGIN;

-- table list
INSERT INTO "list" ("title", "position") VALUES
('A FAIRE', 1),
('EN COURS', 2),
('TERMINE', 3);

-- table card
INSERT INTO "card" ("title", "position", "color", "list_id") VALUES
('Rappeler maman', 1, '#f00', 1),
('Implémenter une API', 1, DEFAULT, 2),
('Soudoyer Chris',2, DEFAULT ,2),
('Conception de l''api', 1, DEFAULT, 3),
('Troller dans le chat', 2, 'yellow', 3);

-- table label
INSERT INTO "label" ("title", "color") VALUES
('Urgent', 'red'),
('Inutile', 'tomato');

-- table de liaison
INSERT INTO "card_has_label" ("card_id", "label_id") VALUES 
(3, 2),
(1, 1),
(2, 1);

COMMIT;
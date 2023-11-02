# Création de la base de donneés

## Étapes 
1. Ouvrez PG Admin ou autre logiciel pour géré votre base de donneés `POSTGRESQL`
2. Roulez le script du fichier 01_create_db.sql
3. Connectez vous manuellement sur la base de données `Brigade`
4. Roulez le script du fichier 02_create_user.sql
5. Roulez le script du fichier 03_brigade_ddl.sql
6. Roulez le script du fichier 04_insert_data_inital.sql
7. Roulez le script du fichier 05_grant_backend_user.sql


## Vérification 

Afin de vérifier que les ta  base de donneés soit bel et bien correct, vous pouvez roulez ce code :
> SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'
ORDER BY table_name ASC

ou également vous pouvez vérifier manuellement les tables que les donneés soient bel et bien insérées
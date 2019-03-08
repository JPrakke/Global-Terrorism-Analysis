SET SQL_SAFE_UPDATES = 0;
USE global_terrorism_db;

ALTER TABLE global_terrorism
ADD COLUMN index1 DOUBLE PRIMARY KEY AUTO_INCREMENT;

ALTER TABLE world_happiness_index
ADD COLUMN index1 DOUBLE PRIMARY KEY AUTO_INCREMENT;
    
DELETE FROM `global_terrorism` 
WHERE
    `iyear` = 1999;

INSERT INTO 
 world_happiness_index(year,life_ladder)
VALUES
 (2000,0);
 INSERT INTO 
 world_happiness_index(year,life_ladder)
VALUES
 (2001,0);
 INSERT INTO 
 world_happiness_index(year,life_ladder)
VALUES
 (2002,0);
 INSERT INTO 
 world_happiness_index(year,life_ladder)
VALUES
 (2003,0);
 INSERT INTO 
 world_happiness_index(year,life_ladder)
VALUES
 (2004,0);
 
delete from global_terrorism
where nkill is null;
-- 3465 rows affected

delete from global_terrorism
where nwound is null;
-- 3635 rows affected

select count(*) from global_terrorism;
-- 92700
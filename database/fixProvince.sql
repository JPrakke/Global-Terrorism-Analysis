select * from global_terrorism
where provstate like 'A•n Defla';
-- 29 rows returned

update global_terrorism
set provstate = 'Ain Defla'
where provstate like 'A•n Defla';
-- 29 row(s) affected Rows matched: 29  Changed: 29  Warnings: 0	0.453 sec

select * from global_terrorism
where provstate = 'BŽja•a';
-- 6 rows returned

update global_terrorism
set provstate = 'BZja'
where provstate = 'BŽja•a';
-- 6 row(s) affected  Rows matched: 6  Changed: 6  Warnings: 0	1.484 sec

select * from global_terrorism
where provstate like 'BŽja•a%';
-- 7 rows returned

update global_terrorism
set provstate = 'BZja Province'
where provstate in ('BŽja•a Province','BŽja•a (Province)');
-- 7 row(s) affected Rows matched: 7  Changed: 7  Warnings: 0	0.438 sec

select * from global_terrorism
where provstate = 'Bordj Bou ArrŽridj';
-- 2 rows returned

update global_terrorism
set provstate = 'Bordj Bou Arreridj'
where provstate = 'Bordj Bou ArrŽridj';
-- 2 rows affected

select * from global_terrorism
where provstate = 'Bou•ra Province';
-- 3 rows returned

update global_terrorism
set provstate = 'Bouira Province'
where provstate = 'Bou•ra Province';
-- 3 rows affected

select * from global_terrorism
where provstate like 'Cort%';
-- 2 rows returned

update global_terrorism
set provstate = 'Cortes'
where provstate = 'CortŽs';
-- 1 row affected

update global_terrorism
set provstate = 'Cortes (Department)'
where provstate = 'CortŽs (Department)';
-- 1 row affected

select * from global_terrorism
where provstate = 'MŽdŽa';
-- 20 rows returned

update global_terrorism
set provstate = 'Medea'
where provstate = 'MŽdŽa';
-- 20 rows affected

select * from global_terrorism
where provstate = 'MŽdŽa Province';
-- 1 row returned

update global_terrorism
set provstate = 'Medea Province'
where provstate = 'MŽdŽa Province';
-- 1 row affected

Select * from global_terrorism
where provstate = 'MŽxico';
-- 1 row returned

update global_terrorism
set provstate = 'Mexico'
where provstate = 'MŽxico';
-- 1 row affected

select * from global_terrorism
where provstate = 'Michoac‡n';
-- 1 row returned

update global_terrorism
set provstate = 'Michoacan'
where provstate = 'Michoac‡n';
-- 1 row affected

select * from global_terrorism
where provstate like 'Neuqu%n';
-- 1 row returned

update global_terrorism
set provstate = 'Neuquen'
where provstate = 'NeuquŽn';
-- 1 row affected

select * from global_terrorism
where provstate like 'S%tif';
-- 3 rows returned

update global_terrorism
set provstate = 'Setif'
where provstate = 'SŽtif';
-- 3 rows affected

select * from global_terrorism
where provstate like 'Sa%da';
-- 4 rows returned

update global_terrorism
set provstate = 'Saada'
where provstate = 'Sa•da';
-- 4 rows affected

select * from global_terrorism
where provstate = 'TŽbessa';
-- 16 rows returned

select * from global_terrorism
where provstate like 'T%bessa';
-- 37 rows returned

update global_terrorism
set provstate = 'Tebessa'
where provstate in ('TŽbessa','Tbessa')
and country_txt = 'Algeria';
-- 23 row affected, count 23 as 7 rows with Tbessa also needed to be corrected

select * from global_terrorism
where provstate = 'TŽbessa Province';
-- 1 row returned

update global_terrorism
set provstate = 'Tebessa Province'
where provstate = 'TŽbessa Province';
-- 1 row affected

select * from global_terrorism
where provstate = 'TillabŽri';
-- 1 row returned

update global_terrorism
set provstate = 'Tillaberi'
where provstate = 'TillabŽri';
-- 1 row affected

select * from global_terrorism
where provstate is null;

select count(*) from global_terrorism;
-- 92700
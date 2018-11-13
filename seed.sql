insert into tasks 
(name, active)
values
('go shopping', true),
('buy shoes', true),
('buy coat', true),
('yardwork', true),
('trim hedges', true),
('mow lawn', false),
('meals', true),
('breakfast', true),
('dinner', true),
('fun', true),
('ride bike', true),
('juggle', false),
('collin''s life', true),
('hallie''s life', true);

insert into users
(name, pwhash)
values
('collin', 'hello'),
('hallie', 'pumpkin');

insert into parents_children
(parent_task_id, child_task_id)
values
(13, 4),
(13, 7),
(13, 10),
(14, 1),
(14, 7),
(1, 2),
(1, 3),
(4, 5),
(4, 6),
(7, 8),
(7, 9),
(10, 11),
(10, 12);

insert into users_tasks
(user_id, task_id)
values
(1, 13),
(1, 5),
(1, 6),
(1, 8),
(1, 9),
(1, 11),
(1, 12),
(2, 14),
(2, 2),
(2, 3),
(2, 8),
(2, 9);

insert into tasks 
(name, active, time_created, time_changed)
values
('go shopping', true, 'today', 'today'),
('buy shoes', true, 'today', 'today'),
('buy coat', true, 'today', 'today'),
('yardwork', true, 'today', 'today'),
('trim hedges', true, 'today', 'today'),
('mow lawn', false, 'today', 'today'),
('meals', true, 'today', 'today'),
('breakfast', true, 'today', 'today'),
('dinner', true, 'today', 'today'),
('fun', true, 'today', 'today'),
('ride bike', true, 'today', 'today'),
('juggle', false, 'today', 'today'),
('collin''s life', true, 'today', 'today'),
('hallie''s life', true, 'today', 'today');

insert into users
(name, pwhash, root_task_id)
values
('collin', '$2b$10$fSgsCMP09txXoeKRY2qAbO3XbEv/rcvbhmZ88N1LTrnwqyETxj.Pq', 13),
('hallie', '$2b$10$tK7FMrsKZA3sEprZVqaIbOz/0cFuo.LOcsztiyJHjBrlrhqsWhMPm', 14);

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
(1, 4),
(1, 6),
(1, 7),
(1, 10),
(1, 5),
(1, 8),
(1, 9),
(1, 11),
(1, 12),
(2, 14),
(2, 1),
(2, 2),
(2, 3),
(2, 7),
(2, 8),
(2, 9);

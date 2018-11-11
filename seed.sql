insert into tasks 
(name, active)
values
('go shopping', true),
('mow lawn', false),
('ride bike', true),
('juggle', false);

insert into users
(name)
values
('Collin'),
('Hallie'),
('John'),
('Whatshisname'),
('Whatshername');

insert into children_parents
(parent_task_id, child_task_id)
values
(1, 2),
(1, 3),
(4, 3);

insert into users_tasks
(user_id, task_id)
values
(1, 2),
(2, 3),
(3, 4),
(4, 1),
(5, 2),
(1, 1)
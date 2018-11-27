create table users (
    id serial primary key,
    name varchar(60) unique not null,
    pwhash varchar(60) not null
);

create table tasks (
    id serial primary key,
    name text,
    active boolean
);

create table parents_children (
    id serial primary key,
    parent_task_id integer references tasks (id) on delete cascade,
    child_task_id integer references tasks (id) on delete cascade
);

create table users_tasks (
    id serial primary key,
    user_id integer references users (id) on delete cascade,
    task_id integer references tasks (id) on delete cascade
);
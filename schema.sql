create table tasks (
    id serial primary key,
    name text,
    active boolean,
    time_created timestamp,
    time_changed timestamp
);

create table users (
    id serial primary key,
    name varchar(60) unique not null,
    pwhash varchar(60) not null,
    root_task_id integer references tasks (id) not null
);

create table parents_children (
    parent_task_id integer references tasks (id) on delete cascade,
    child_task_id integer references tasks (id) on delete cascade
);

create table users_tasks (
    user_id integer references users (id) on delete cascade,
    task_id integer references tasks (id) on delete cascade
);
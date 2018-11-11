create table users (
    id serial primary key,
    name text
);

create table tasks (
    id serial primary key,
    name text,
    active boolean
);

create table children_parents (
    id serial primary key,
    child_task_id integer references tasks (id),
    parent_task_id integer references tasks (id)
)

create table users_tasks (
    id serial primary key,
    user_id integer references users (id),
    task_id integer references tasks (id)
);
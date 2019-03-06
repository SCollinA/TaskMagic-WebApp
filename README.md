#Task Magic
## Summary
Task Magic is a todo app with nested, shareable tasks! Use it to organize your tasks and see how they contribute to bigger goals! Share tasks with those who are involved!
## Demonstration
When you register for a Task Magic account, a root task is created for you. This task is the main task that all other tasks you create are subtasks of. In other words, it's your life! 
From here, you can begin adding tasks. Just touch the plus icon in the toolbar at the bottom of the screen. Then, type in the task name and press return. If a task has subtasks, just tap the task to view its task screen. When you add new tasks to this screen, they are added as subtasks of the selected task, in a green outline. To go back, select the parent task above the current task in a purple outline.
To mark a task as complete, simply touch the box on the right side of the task cell.
To rename a task, select the pencil icon in the toolbar. To delete a task, select the trash can icon from the toolbar.
To share a task, select the arrow icon in the toolbar. Type in the other user's name, then press return. Currently, there are no limits to sharing tasks with other users, nor is there a confirmation that the task was successfully shared. However, when the other user logs in, they will see the task on their screen. Now, any changes to this task included added or removed subtasks are visible to both users.
## Description
This app was built with the intent to provide a way to focus on the three most important things to accomplish everyday. It automatically sorts the tasks by whether they are completed or not, and then by date. That way, the user sees the tasks which have been on the list the longest at the top. The iOS version also included features like making the font size larger and allowing users to move tasks up or down the list.
## Challenges
* using PostgresQL for first time on my own, using linking tables and joins
* getting tasks to stack in the correct order when you scroll. The correct order is the parent tasks sliding under the current task, and subtasks also sliding under the current task. That way, the current task is always visible at the top of the screen.
## Plans
Currently, there's a troublesome bug that duplicates parent tasks when other tasks are added. I haven't had time to look into it, but everything else is pretty much functional. I'd like to clean up the appearance a lot, and even move into React Native, which would take the app back to iOS where it was born! Also, I want to add features like locations, pictures, and notifications for tasks. The app should be a smart, everyday personal assistant. 
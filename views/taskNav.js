const taskNav = function(currentTask, prevTask) {
    if (!prevTask) {
        prevTask = {name: 'undefined'}
    }
    return `
    <div class="header">
        <div class="navHeader">
            <a id="backNav" href="/back">
                <h4>${prevTask.name}</h4>
            </a>
            <div class="currentTask">
                <h2 id="currentTaskName">${currentTask.name}</h2>
            </div>
            <div>
                <form action="/logout" method="post">
                    <input type="submit" value="logout">
                </form>
            </div>
        </div>
        <form name="taskSearchForm" class="searchbar" method="post">
            <textarea name="taskSearch" id="taskSearch" cols="10" rows="0" wrap="off" maxlength="200"></textarea>
        </form>
    </div>
    `
}

module.exports = taskNav
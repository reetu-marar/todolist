function getTasksFromLocalStorage() {
	if(supports_html5_storage()) {
		return localStorage.getItem("todoTmpVars") != null ? localStorage.getItem("todoTmpVars") : "";
	}
}
function addTaskInLocalStorage(newTask, status) {
	if(supports_html5_storage() && newTask != null && newTask.length > 0) {
		var tasks = getTasksFromLocalStorage();
		newTask = newTask + "_" + status;
		tasks = tasks.length > 0 ? tasks + "," + newTask : newTask;
		localStorage.setItem("todoTmpVars", tasks);
	}
}
function supports_html5_storage() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
}
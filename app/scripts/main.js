var td = td || {};
// Common functionality and classes.
(function() {
	td.template = {
		render: function() {
			var completedTasks = td.storage.getCompletedTasks();
			var pendingTasks = td.storage.getPendingTasks();
			var source = $("#todo-list-template").html();
			var template = Handlebars.compile(source);
	
			$("#todo-body").append(template( {
				tasks : pendingTasks
			}));
			source = $("#completed-list-template").html();
			template = Handlebars.compile(source);
				$("#todo-body").append(template( {
					tasks : completedTasks
				}));
			if(completedTasks.length > 0) {
				$("#complete-title").show();
			}
		}	
	};
	td.task = {
		add: function() {
			var source = $("#task-template").html();
			var template = Handlebars.compile(source);
			var newTask = {};
			newTask.description = $("#add-task").val();
			var id = td.storage.add(newTask.description, false);
			newTask.id = id;
			newTask.status = false;
			$("#todoTableBodyDiv").append(template( {
				newTask : newTask
			}));
			$("#add-task").val('');
		},

		complete: function(id) {
			var source = $("#task" + id).remove();
			$("#completedTableDiv").append(source);
			$("#status" + id).attr("disabled", true);			
			$("#complete-title").show();
		},

		toggle:function(id) {
			var status = !td.storage.getStatus(id);
			td.storage.updateStatus(id,status);
			if(status) {
				td.task.complete(id);
			}
		}	
	};
	td.storage = {
		getCompletedTasks: function() {
			var todoList = [];
			var _todoCache = td.storage.get();
			for(var index in _todoCache) {
				var task = {};
				var status = td.storage.getStatus(index);
				task.id = index;
				task.description = _todoCache[index];
				if(status) {
					task.status = status 
					todoList.push(task);
				}
			}
			return todoList;
		},

		getPendingTasks: function() {
			var todoList = [];
			var _todoCache = td.storage.get();
			for(var index in _todoCache) {
				var task = {};
				var status = td.storage.getStatus(index);
				task.id = index;
				task.description = _todoCache[index];
				if(!status) {
					task.status = status 
					todoList.push(task);
				}
			}
			return todoList;
		},
		
		getLastIndex: function() {
			if(td.storage.supports_html5()) {
				return localStorage.getItem("_taskIndex") != null ? localStorage.getItem("_taskIndex") : 0;
			}
		},

		updateLastIndex: function(index) {
			if(td.storage.supports_html5()) {
				localStorage.setItem("_taskIndex", index);
			}
		},

		get: function() {
			if(td.storage.supports_html5()) {
				return localStorage.getItem("_todoCache") != null ? JSON.parse(localStorage.getItem("_todoCache")) : {};
			}
		},

		add: function(newTask) {
			if(td.storage.supports_html5() && newTask != null && newTask.length > 0) {
				var tasks = td.storage.get();
				var currentIndex = td.storage.getLastIndex();
				currentIndex++;
				tasks[currentIndex] = newTask;
				localStorage.setItem("_todoCache", JSON.stringify(tasks));
				td.storage.updateLastIndex(currentIndex);
				td.storage.updateStatus(currentIndex, false);
				return currentIndex;
			}
		},

		updateStatus: function(id, status) {
			if(td.storage.supports_html5()) {
				var _todoStatus = localStorage.getItem("_todoStatus") != null ? JSON.parse(localStorage.getItem("_todoStatus")) : {};
				_todoStatus[id] = status;
				localStorage.setItem("_todoStatus", JSON.stringify(_todoStatus));
			}
		},

		getStatus: function(id) {
			if(td.storage.supports_html5()) {
				var _todoStatus = localStorage.getItem("_todoStatus") != null ? JSON.parse(localStorage.getItem("_todoStatus")) : {};
				return _todoStatus[id];
			}
		},

		supports_html5: function() {
			  try {
			    return 'localStorage' in window && window['localStorage'] !== null;
			  } catch (e) {
			    return false;
			  }
		}	
	}
})();

$().ready(td.template.render());






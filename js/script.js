// Array to store all tasks
let tasks = [];

// Get DOM elements
const form = document.querySelector("form");
const taskInput = document.getElementById("tdl_input");
const deadlineInput = document.getElementById("tdl_deadline");
const taskListContainer = document.getElementById("taskListContainer");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

// Initialize app when page loads
document.addEventListener("DOMContentLoaded", function () {
  renderTasks();

  // Add event listeners for filter and sort
  filterSelect.addEventListener("change", renderTasks);
  sortSelect.addEventListener("change", renderTasks);
});

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  const taskDeadline = deadlineInput.value;

  // Validation
  if (!taskText || !taskDeadline) {
    alert("Please fill in both task and deadline!");
    return;
  }

  // Create task object
  const task = {
    id: Date.now(),
    text: taskText,
    deadline: taskDeadline,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  // Add to tasks array
  tasks.push(task);

  // Clear form inputs
  taskInput.value = "";
  deadlineInput.value = "";

  // Re-render tasks
  renderTasks();

  // Show success message (optional)
  console.log("Task added successfully!");
}

// Function to delete a task
function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
  }
}

// Function to toggle task completion
function toggleComplete(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// Function to check if deadline has passed
function isOverdue(deadline) {
  const today = new Date().toISOString().split("T")[0];
  return deadline < today;
}

// Function to check if deadline is today
function isToday(deadline) {
  const today = new Date().toISOString().split("T")[0];
  return deadline === today;
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Function to sort tasks by date
function sortTasks(tasksArray) {
  const sortType = sortSelect.value;
  const sorted = [...tasksArray];

  switch (sortType) {
    case "dateAsc":
      // Earliest deadline first (default)
      return sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    case "dateDesc":
      // Latest deadline first
      return sorted.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    default:
      // Default to earliest deadline first
      return sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }
}

// Function to filter tasks
function filterTasks(tasksArray) {
  const filterType = filterSelect.value;

  switch (filterType) {
    case "active":
      return tasksArray.filter((task) => !task.completed);
    case "completed":
      return tasksArray.filter((task) => task.completed);
    case "all":
    default:
      return tasksArray;
  }
}

// Function to render tasks to the DOM
function renderTasks() {
  // Filter tasks first
  let filteredTasks = filterTasks(tasks);

  // Then sort the filtered tasks
  const sortedTasks = sortTasks(filteredTasks);

  // If no tasks, show message
  if (sortedTasks.length === 0) {
    const filterType = filterSelect.value;
    let message = "No tasks yet. Add your first task above!";

    if (tasks.length > 0) {
      if (filterType === "active") {
        message = "No active tasks. All tasks are completed! 🎉";
      } else if (filterType === "completed") {
        message = "No completed tasks yet.";
      }
    }

    taskListContainer.innerHTML = `<p class="text-muted text-center mb-0">${message}</p>`;
    return;
  }

  // Build HTML for all tasks
  let tasksHTML = "";

  sortedTasks.forEach((task) => {
    const overdue = isOverdue(task.deadline);
    const today = isToday(task.deadline);
    const completedClass = task.completed ? "task-completed" : "";
    const borderColor = overdue ? "#dc3545" : today ? "#ffc107" : "#0d6efd";

    tasksHTML += `
            <div class="task-item" style="border-left: 4px solid ${borderColor}; padding: 15px; margin-bottom: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input 
                                type="checkbox" 
                                ${task.completed ? "checked" : ""} 
                                onchange="toggleComplete(${task.id})"
                                style="width: 18px; height: 18px; cursor: pointer;"
                            >
                            <span style="font-size: 16px; ${
                              task.completed
                                ? "text-decoration: line-through; opacity: 0.6;"
                                : ""
                            }">${task.text}</span>
                        </div>
                        <div style="margin-left: 28px; margin-top: 5px; font-size: 14px; color: #6c757d;">
                            📅 ${formatDate(task.deadline)}
                            ${
                              overdue
                                ? '<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-left: 8px;">Overdue</span>'
                                : ""
                            }
                            ${
                              today
                                ? '<span style="background: #ffc107; color: #000; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-left: 8px;">Today</span>'
                                : ""
                            }
                        </div>
                    </div>
                    <button 
                        onclick="deleteTask(${task.id})" 
                        style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;"
                        onmouseover="this.style.background='#bb2d3b'" 
                        onmouseout="this.style.background='#dc3545'"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
  });

  taskListContainer.innerHTML = tasksHTML;
}

// Add CSS for completed tasks
const style = document.createElement("style");
style.textContent = `
    .task-item {
        transition: all 0.3s ease;
    }
    .task-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
    }
`;
document.head.appendChild(style);

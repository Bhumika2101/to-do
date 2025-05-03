let currentUser = null;

window.onload = function () {
 const savedUser = localStorage.getItem("currentUser");

 if (savedUser) {
 currentUser = savedUser;
 showToDoSection();
 renderTasks();
 return;
 }

 const hasUsers = Object.keys(localStorage).some(key => key.startsWith("tasks_"));

 if (hasUsers) {
 document.getElementById("loginSection").style.display = "block";
 } else {
 currentUser = "guest";
 localStorage.setItem("currentUser", currentUser);
 showToDoSection();
 renderTasks();
 }
};

// --------- SIGNUP + LOGIN SYSTEM ---------

function getUsers() {
 const users = localStorage.getItem("user_credentials");
 return users ? JSON.parse(users) : {};
}

function setUsers(users) {
 localStorage.setItem("user_credentials", JSON.stringify(users));
}

function signup() {
 const username = document.getElementById("newUsername").value.trim();
 const password = document.getElementById("newPassword").value;

 if (!username || !password) return alert("Please fill in both fields.");

 const users = getUsers();

 if (users[username]) {
 return alert("Username already exists. Please choose another.");
 }

 users[username] = password;
 setUsers(users);

 alert("Signup successful! You can now log in.");
 document.getElementById("newUsername").value = '';
 document.getElementById("newPassword").value = '';
}

function login() {
 const username = document.getElementById("usernameInput").value.trim();
 const password = document.getElementById("passwordInput").value;

 if (!username || !password) return alert("Enter both username and password.");

 const users = getUsers();

 if (!users[username]) {
 return alert("User not found.");
 }
 if (users[username] !== password) {
 return alert("Incorrect password.");
 }

 currentUser = username;
 localStorage.setItem("currentUser", username);
 showToDoSection();
 renderTasks();
}

function logout() {
 localStorage.removeItem("currentUser");
 currentUser = "guest";
 localStorage.setItem("currentUser", currentUser);
 showToDoSection();
 renderTasks();
}



function continueAsGuest() {
 currentUser = "guest";
 localStorage.setItem("currentUser", currentUser);
 showToDoSection();
 renderTasks();
}

function showToDoSection() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("todoSection").style.display = "block";
  
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.querySelector("button[onclick='logout()']");
    const usernameDisplay = document.getElementById("username");

    if (usernameDisplay) {
      usernameDisplay.textContent = `Welcome, ${currentUser}!`;
    }
  
    if (currentUser === "guest") {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
    } else {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    }
  }
  

function showLoginPage() {
 document.getElementById("todoSection").style.display = "none";
 document.getElementById("loginSection").style.display = "block";
}
function showSignupForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
  }
  
  function showLoginForm() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }
  


function getStoredTasks() {
 const stored = localStorage.getItem(`tasks_${currentUser}`);
 return stored ? JSON.parse(stored) : [];
}

function setStoredTasks(tasks) {
 localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

function addTask() {
 const taskInput = document.getElementById('taskInput');
 const taskText = taskInput.value.trim();
 if (taskText === '') return;

 const taskList = getStoredTasks();
 taskList.push({ text: taskText, completed: false });
 setStoredTasks(taskList);

 taskInput.value = '';
 renderTasks();
}

function toggleComplete(index) {
 const taskList = getStoredTasks();
 taskList[index].completed = !taskList[index].completed;
 setStoredTasks(taskList);
 renderTasks();
}

function removeTask(index) {
 const taskList = getStoredTasks();
 taskList.splice(index, 1);
 setStoredTasks(taskList);
 renderTasks();
}

function editTask(index) {
 const inputField = document.getElementById(`task-text-${index}`);
 inputField.removeAttribute('readonly');
 inputField.focus();
}

function saveEditedTask(index, newText) {
 const taskList = getStoredTasks();
 taskList[index].text = newText.trim();
 setStoredTasks(taskList);
 renderTasks();
}

function renderTasks() {
 const taskList = getStoredTasks();
 const ul = document.getElementById('taskList');
 const filter = document.getElementById('filterSelect')?.value || 'all';

 ul.innerHTML = '';

 const filteredTasks = taskList.filter(task => {
 if (filter === 'completed') return task.completed;
 if (filter === 'incomplete') return !task.completed;
 return true;
 });

 filteredTasks.forEach((task, index) => {
 const li = document.createElement('li');
 li.className = task.completed ? 'completed' : '';

 li.innerHTML = `
 <input type="checkbox" onchange="toggleComplete(${index})" ${task.completed ? 'checked' : ''}>
 <input type="text" id="task-text-${index}" value="${task.text}" readonly 
class="${task.completed ? 'completed' : ''}" 
onkeydown="if(event.key === 'Enter') this.blur()">
 <div class="button-group">
 <button onclick="editTask(${index})">Edit</button>
 <button onclick="removeTask(${index})">Delete</button>
 </div>
 `;
 ul.appendChild(li);
 });
}

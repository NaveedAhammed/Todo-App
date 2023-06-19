"use strict";

let tasks = JSON.parse(localStorage.getItem("data")) || [];

let editIndex = -1;

const gridContainer = document.querySelector(".container__grid");

renderTasksHandler();

class Task {
	constructor(title, desc) {
		this.title = title;
		this.desc = desc;
		this.checked = false;
	}
}

const form = document.querySelector(".form");
const titleInput = document.querySelector("#task-title");
const descTextarea = document.querySelector("#task-desc");
const cancelBtn = document.querySelector(".btn-cancel");
document.querySelector(".add-item").addEventListener("click", () => {
	form.classList.remove("hidden");
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	saveTask();
});

function saveToLocalStorage() {
	localStorage.setItem("data", JSON.stringify(tasks));
}

function createHTMLElement(task, i) {
	const htmlContent = `
	<div class="task__item" id="${i}">
		<div class="edit"
			data-action="edit">
			<svg xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="edit__icon">
				<path stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
			</svg>
		</div>
		<div class="delete" data-action="delete">
			<svg xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="delete__icon">
				<path stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<div class="check ${task.checked ? "checked" : ""}" data-action="check">
			<svg xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="check__icon checked">
				<path stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<h2 class="task__title">${task.title}</h2>
		<p class="task__desc">${task.desc}</p>
	</div>`;
	return htmlContent;
}

function renderTasksHandler() {
	// clear before render
	gridContainer.innerHTML = "";

	// render
	tasks.forEach((task, i) => {
		gridContainer.innerHTML += createHTMLElement(task, i);
	});
}

function saveTask() {
	const title = titleInput.value;
	const desc = descTextarea.value;
	// validate inputs
	if (!title.trim() || !desc.trim()) {
		alert("Enter valid inputs");
		return;
	}
	// check for duplicate
	const isDuplicate = tasks.find((task) => task.title === title);
	if (isDuplicate && editIndex === -1) {
		alert("This task already exist!");
		return;
	}
	if (editIndex >= 0) {
		// update task
		tasks[editIndex].title = title;
		tasks[editIndex].desc = desc;
		editIndex = -1;
	} else {
		// create new task and add to array
		const newTask = new Task(title, desc);
		tasks.push(newTask);
	}
	// clear inputs
	clearInputsHandler();
	// closeForm
	closeFormHandler();
	// render tasks
	renderTasksHandler();
	// save to local storage
	saveToLocalStorage();
}

function deleteTask(id) {
	const newTasks = tasks.filter((t, i) => i !== id);
	tasks = newTasks;
	renderTasksHandler();
	saveToLocalStorage();
}

function checkTask(id) {
	tasks[id].checked = !tasks[id].checked;
	renderTasksHandler();
	saveToLocalStorage();
}

function editTask(id) {
	titleInput.value = tasks[id].title;
	descTextarea.value = tasks[id].desc;
	form.classList.remove("hidden");
	editIndex = id;
}

gridContainer.addEventListener("click", (e) => {
	const item = e.target.parentNode;
	if (item.className !== "task__item") return;

	const action = e.target.dataset.action;
	const id = Number(item.id);

	action === "check" && checkTask(id);

	action === "delete" && deleteTask(id);

	action === "edit" && editTask(id);
});

function closeFormHandler() {
	clearInputsHandler();
	form.classList.add("hidden");
}

function clearInputsHandler() {
	titleInput.value = "";
	descTextarea.value = "";
}

cancelBtn.addEventListener("click", closeFormHandler);

window.addEventListener("DOMContentLoaded", () => {

    const inputTask = document.getElementById("newTask");
    const confirmButton = document.getElementById("confirmButton");
    const selectColumn = document.getElementById("columnSelector");
    const columns = document.querySelectorAll("section");

    const lists = {
        list1: document.getElementById("list1"),
        list2: document.getElementById("list2"),
        list3: document.getElementById("list3")
    };

    columns.forEach(column => {

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();

            const dragged = document.querySelector(".dragging");
            if (!dragged) return;

            // Trouve la liste <ul> à l'intérieur de la colonne
            const targetList = column.querySelector("ul");

            if (targetList) {
                targetList.appendChild(dragged);
                saveTasks();
            }
        });
    });



    // ---------- SAVE ----------
    function saveTasks() {
        const tasks = [];

        document.querySelectorAll(".allLists li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector("input[type='checkbox']").checked,
                priority: li.dataset.priority,
                column: li.closest("ul").id
            });
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // ---------- LOAD ----------
    function loadTasks() {
        const saved = JSON.parse(localStorage.getItem("tasks")) || [];

        saved.forEach(task => {
            const li = createTask(task.text);
            li.querySelector("input").checked = task.completed;
            li.dataset.priority = task.priority;
            lists[task.column].appendChild(li);
        });
    }

    // ---------- CREATE LI ----------
    function createTask(text) {
        const li = document.createElement("li");
        li.dataset.priority = "normal";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked);
            saveTasks();
        });

        const span = document.createElement("span");
        span.textContent = text;

        const deleteBtn = createDeleteButton();

        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        li.append(checkbox, span, deleteBtn);

        li.draggable = true;
        li.addEventListener("dragstart", (e) => {
            li.classList.add("dragging");
            e.dataTransfer.setData("text/plain", ""); // nécessaire pour Firefox
        });

        li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
        });

        return li;
    }

    // ---------- ADD TASK ----------
    function handleAddTask() {
        const taskText = inputTask.value.trim();
        if (!taskText) return;

        const li = createTask(taskText);
        lists[selectColumn.value].appendChild(li);

        saveTasks();
        inputTask.value = "";
    }

    confirmButton.addEventListener("click", handleAddTask);

    // Entrée = ajoute la tâche
    inputTask.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleAddTask();
    });

    // ---------- PRIORITY CYCLE ----------
    function cyclePriority(li) {
        const order = ["normal", "important", "urgent"];
        const next = order[(order.indexOf(li.dataset.priority) + 1) % order.length];
        li.dataset.priority = next;
    }

    document.getElementById("container").addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            cyclePriority(event.target);
            saveTasks();
        }
    });

    //CREATION DU BOUTON SUPPRIMER
    function createDeleteButton() {
        const btn = document.createElement("button");
        btn.classList.add("delete-btn");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 24 24");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("d", "M18 6L6 18M6 6l12 12");

        svg.appendChild(path);
        btn.appendChild(svg);

        return btn;
    }


    // Load stored tasks
    loadTasks();
});

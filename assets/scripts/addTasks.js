window.addEventListener("DOMContentLoaded", async () => {

    let inputTask = document.getElementById("newTask");
    let confirmButton = document.getElementById("confirmButton");
    let list1 = document.getElementById("list1");
    let list2 = document.getElementById("list2");
    let list3 = document.getElementById("list3");

    confirmButton.addEventListener("click", () => {
        let newTask = inputTask.value;
        let selectColumnButton = document.getElementById("columnSelector");
        let selectColumn = selectColumnButton.value;
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        let span = document.createElement("span");
        span.textContent = newTask;
        li.appendChild(checkbox);
        li.appendChild(span);

        if(selectColumn === "sendToList1"){
            list1.appendChild(li);
        }else if(selectColumn === "sendToList2"){
            list2.appendChild(li);
        }else if(selectColumn === "sendToList3"){
            list3.appendChild(li);
        }
    });
});
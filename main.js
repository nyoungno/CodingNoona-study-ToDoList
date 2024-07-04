// 유저가 값을 입력한다.
// +버튼을 클릭하면, 할일이 추가된다
// delete버튼을 누르면 할일이 삭제된다.
// check버튼을 누르면 할일이 끝나면서 밑줄이 간다.
// 1.check버튼을 클릭하는 순각 false -> true 입니다.
// 2.true이면 끝난걸로 간주하고 밑줄 보여주기
// 3.false이면 안끝난걸로 간주하고 그대로

// 진행중 끝남 탬을 누르면, 언더바가 이동한다.
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만
// 전체 탭을 누르면 다시 전체아이템으로 돌아옴.

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];
let underLine = document.getElementById("tab-underline");

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addTask(event);
  }
});

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  let taskValue = taskInput.value;
  if (taskValue === "") return alert("할일을 입력해주세요");
  let task = {
    id: randomIDGenerator(),
    taskContent: taskInput.value,
    isComplete: false,
  };

  taskList.push(task);
  taskInput.value = "";
  console.log(taskList);
  filter();
}

function render() {
  // 1. 내가 선택한 탭에 따라서
  // 2. 리스트를 달리 보여준다.
  let list = [];
  if (mode === "all") {
    // all taskList
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    // ongoing, done  filterList
    list = filterList;
  }

  let resultHTML = ``;
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task task-done id="${list[i].id}">
      <span class>${list[i].taskContent}</span>
      <div class="button-box">
          <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
          <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash" style="color: #db5151;"></i></button>
      </div>
  </div>`;
    } else {
      resultHTML += `<div class="task id="${list[i].id}">
      <span>${list[i].taskContent}</span>
      <div class="button-box">
          <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-check" style="color: #0068b8;"></i></button>
          <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash" style="color: #db5151;"></i></button>
      </div>
  </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  } // 값을 업데이트하면
  // UI도 업데이트!!
  filter();
}
function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
    }
  }
  filter();
}

function filter(event) {
  if (event) {
    mode = event.target.id;
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
  } // 진행중 상태에서 끝남으로 표시하면 바로 사라지는 부분은 event가 없음 그래서 조건추가

  filterList = [];
  if (mode === "ongoing") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete == false) {
        filterList.push(taskList[i]);
      }
    }
  } else if (mode === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }
  }
  render();
}
function randomIDGenerator() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
}

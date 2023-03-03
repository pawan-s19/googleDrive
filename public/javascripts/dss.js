let gridViewBtn = document.querySelector("#gridView");
let listViewBtn = document.querySelector("#listView");
let allFolder = document.querySelectorAll(".folderDiv");
let optionsWrapper = document.querySelector(".optionsWrapper");

gridViewBtn.addEventListener("click", function () {
  this.classList.add("selectedIcon");
  listViewBtn.classList.remove("selectedIcon");
  allFolder.forEach((folder) => {
    folder.classList.remove("list");
    folder.classList.add("grid");
    // folder.style.minWidth = '15rem'
    // folder.style.width = 'fit-content'
  });
});
listViewBtn.addEventListener("click", function () {
  this.classList.add("selectedIcon");
  gridViewBtn.classList.remove("selectedIcon");
  allFolder.forEach((folder) => {
    folder.classList.add("list");
    folder.classList.remove("grid");
    // folder.style.width = '100%'
  });
});

document.querySelector(".folderWrapper").addEventListener("click", (e) => {
  // console.log(e.target.getElementsByTagName('p')[0].innerHTML + " is clicked")
  if (e.target.classList.contains("folderDiv")) {
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    e.target.classList.add("folderDivSelected");
    optionsWrapper.style.display = "flex";
  } else {
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    optionsWrapper.style.display = "none";
  }
});

allFolder.forEach((folder) => {
  folder.addEventListener("click", (e) => {
    console.log(e.target.classList);
  });
});

let collapseMenu = document.querySelector("#collapseExample");
window.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("folderDiv") &&
    !e.target.classList.contains("optionIcons")
  ) {
    optionsWrapper.style.display = "none";
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
  }
  if (collapseMenu.classList.contains("show")) {
    collapseMenu.classList.remove("show");
  }
});

let uploadFileIcon = document.querySelector(".upload-file-icon");
let fileInput = document.querySelector(".file-input");
let uploadFileForm = document.querySelector(".upload-file-form");
uploadFileIcon.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (dets) => {
  if (dets) {
    uploadFileForm.submit();
    console.log("s");
  }
});

var exampleModal = document.getElementById("exampleModal");
exampleModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  var parentId = button.getAttribute("data-bs-parentId");
  console.log(parentId.length);
  if (parentId.length < 1) {
    console.log("no parent i.e. root folder");
  } else {
    console.log("This folder is beind created inside " + parentId);
    var parentIdInput = document.querySelector(".parentId");
    parentIdInput.value = parentId;
  }
});

// previous and forward button
document.querySelector(".previousPage").addEventListener("click", () => {
  history.back();
});
document.querySelector(".forwardPage").addEventListener("click", () => {
  history.forward();
});

document.querySelector(".folderWrapper").addEventListener("dblclick", (e) => {
  // console.log(e.target.getElementsByTagName('p')[0].innerHTML + " is clicked")
  if (e.target.classList.contains("folderDiv")) {
    let folderId = e.target.getAttribute("data-bs-folderId");

    window.location.href = `http://localhost:3000/dashboard/${folderId}`;
  }
});

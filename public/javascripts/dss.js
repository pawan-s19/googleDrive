let gridViewBtn = document.querySelector("#gridView");
let listViewBtn = document.querySelector("#listView");
let allFolder = document.querySelectorAll(".folderDiv");
let allFile = document.querySelectorAll(".fileDiv");
let optionsWrapper = document.querySelector(".optionsWrapper");
let GLOBAL_ID;
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
    GLOBAL_ID = e.target.getAttribute("data-bs-folderId");
    console.log(GLOBAL_ID);
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    allFile.forEach((fileDiv) => {
      fileDiv.classList.remove("folderDivSelected");
    });
    e.target.classList.add("folderDivSelected");
    optionsWrapper.style.display = "flex";
    // document.querySelector('.addToStar').setAttribute(`href','http://localhost:3000/star/${GLOBAL_ID}`);
  } else {
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    optionsWrapper.style.display = "none";
  }
});

document.querySelector(".fileWrapper").addEventListener("click", (e) => {
  // console.log(e.target.getElementsByTagName('p')[0].innerHTML + " is clicked")
  if (e.target.classList.contains("fileDiv")) {
    GLOBAL_ID = e.target.getAttribute("data-bs-fileId");
    console.log(GLOBAL_ID);
    allFile.forEach((fileDiv) => {
      fileDiv.classList.remove("folderDivSelected");
    });
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    e.target.classList.add("folderDivSelected");
    optionsWrapper.style.display = "flex";
    // document.querySelector('.addToStar').setAttribute(`href','http://localhost:3000/star/${GLOBAL_ID}`);
  } else {
    allFile.forEach((fileDiv) => {
      fileDiv.classList.remove("folderDivSelected");
    });
    optionsWrapper.style.display = "none";
  }
});

allFile.forEach((folder) => {
  folder.addEventListener("click", (e) => {
    console.log(e.target.classList);
  });
});

window.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("folderDiv") &&
    !e.target.classList.contains("optionIcons") &&
    !e.target.classList.contains("fileDiv")
  ) {
    optionsWrapper.style.display = "none";
    allFolder.forEach((folderDiv) => {
      folderDiv.classList.remove("folderDivSelected");
    });
    allFile.forEach((fileDiv) => {
      fileDiv.classList.remove("folderDivSelected");
    });
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

document.querySelector(".folderWrapper").addEventListener("dblclick", (e) => {
  // console.log(e.target.getElementsByTagName('p')[0].innerHTML + " is clicked")
  if (e.target.classList.contains("folderDiv")) {
    let folderId = e.target.getAttribute("data-bs-folderId");

    window.location.href = `http://localhost:3000/dashboard/${folderId}`;
  }
});

document.querySelector(".shareRole").addEventListener("click", function (e) {
  console.log(e.target.classList);
  console.log(GLOBAL_ID);
});

// add ID to star option
let starFnc = document.querySelector('.addToStar');

starFnc.addEventListener('click',()=>{
  window.location.href =`http://localhost:3000/star/${GLOBAL_ID}`;
});


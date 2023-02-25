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

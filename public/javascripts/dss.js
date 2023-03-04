let gridViewBtn = document.querySelector("#gridView");
let listViewBtn = document.querySelector("#listView");
let allFolder = document.querySelectorAll(".folderDiv");
let allFile = document.querySelectorAll(".fileDiv");
let optionsWrapper = document.querySelector(".optionsWrapper");
let GLOBAL_ID;
let shareUrl;
let copyLinkButton = document.querySelector(".copyLink");
let sharePasswordDiv = document.querySelector(".share-password");
let sharePasswordForm = document.querySelector(".share-password form");
let isShareRolePublic = true;
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
    let pathCtn = document.querySelector('.pathCtn');

    console.log(pathCtn.offsetWidth);
    // if(pathCtn.offsetWidth > 550){
    //   console.log('bada ho gaya')
    //   console.log(pathCtn.offsetWidth)
    // }
  }
});

document
  .querySelector(".shareRole")
  .addEventListener("click", async function (e) {
    console.log(e.target.classList);
    console.log(GLOBAL_ID);
    if (e.target.classList[1] == "public") {
      isShareRolePublic = true;
      sharePasswordDiv.style.display = "none";
      copyLinkButton.style.display = "block";
    } else {
      isShareRolePublic = false;
      sharePasswordDiv.style.display = "block";
      copyLinkButton.style.display = "none";
    }
  });

sharePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let { data } = await axios.post(`/share/${GLOBAL_ID}`, {
    password: e.target[0].value,
  });
  shareUrl = data.url;
  copyLinkButton.style.display = "block";
});
copyLinkButton.addEventListener("click", async (e) => {
  if (isShareRolePublic) {
    let { data } = await axios.post(`/share/${GLOBAL_ID}`);
    shareUrl = data.url;
  }
  console.log(shareUrl);
  if (shareUrl) await navigator.clipboard.writeText(shareUrl);
});

// add ID to star option
let starFnc = document.querySelector('.addToStar');

starFnc.addEventListener('click',()=>{
  window.location.href =`http://localhost:3000/star/${GLOBAL_ID}`;
});
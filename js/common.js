import {get} from './router.js';

const profileFileId = localStorage.getItem("profileFileId");
const profileImg = document.getElementById("profileImg");
const profileDropdown = document.getElementById("profileDropdown");
const goLogout = document.getElementById("goLogout");
const goProfileEdit = document.getElementById("goProfileEdit");
const goPasswordEdit = document.getElementById("goPasswordEdit");

if(profileFileId != null){
    get(`files/${profileFileId}`)
    .then(result => {
        profileImg.src = "http://localhost:8080/" +result.data.filePath;
        profileImg.style.display = "block";
    }).catch(error => {
        localStorage.removeItem("profileFileId");
        localStorage.removeItem("userId");
        profileImg.style.display = "none";
    })
}

profileImg.addEventListener("click", () => {
    profileDropdown.classList.toggle("show");
});

goLogout.addEventListener("click", () => {
    location.replace("./login.html");
});

goProfileEdit.addEventListener("click", () => {
    location.replace("./profile_edit.html");
});

goPasswordEdit.addEventListener("click", () => {
    location.replace("./password_edit.html");
});


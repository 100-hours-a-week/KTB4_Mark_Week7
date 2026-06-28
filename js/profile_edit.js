import {get, patch, del} from "./router.js";

const profileUpload = document.getElementById("profileUpload");
const profilePreview = document.getElementById("profilePreview");
const nickname = document.getElementById("nickname");
const nicknameHelper = document.getElementById("nicknameHelper");
const userEmail = document.getElementById("userEmail");
const submitBtn = document.getElementById("submitBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const withdrawModal = document.getElementById("withdrawModal");
const withdrawCancel = document.getElementById("withdrawCancel");
const withdrawConfirm = document.getElementById("withdrawConfirm");

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

// 현재 유저 정보 불러오기
get("users")
.then(result => {
    userEmail.textContent = result.data.email;
    nickname.value = result.data.nickname;
    if(result.data.profileFileId){
        get(`files/${result.data.profileFileId}`)
        .then(user => {
            profilePreview.src = `http://localhost:8080/${user.data.filePath}`;
            profilePreview.style.display = "block";
        })
    }
})

profileUpload.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    if(imageInput.files[0]){
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePreview.src = e.target.result;
            profilePreview.style.display = "block";
        }
        reader.readAsDataURL(imageInput.files[0]);
    }
});

submitBtn.addEventListener("click", () => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify({
        nickname: nickname.value
    })], {type: "application/json"}));
    if(imageInput.files[0]){
        formData.append("image", imageInput.files[0]);
    }

    patch("users", formData)
    .then(result => {
        location.replace("./post_list.html");
    }).catch(error => {
        if(error.message == "중복된 닉네임 입니다."){
            nicknameHelper.textContent = "*" + error.message;
        }
    })
});

withdrawBtn.addEventListener("click", () => {
    withdrawModal.style.display = "flex";
});

withdrawCancel.addEventListener("click", () => {
    withdrawModal.style.display = "none";
});

withdrawConfirm.addEventListener("click", () => {
    del("users")
    .then(result => {
        localStorage.clear();
        location.replace("./login.html");
    })
});
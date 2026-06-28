import {post, get, patch, put} from "./router.js";

const IdempotencyKey = self.crypto.randomUUID();
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const imageUpload = document.getElementById("imageUpload");
const submitBtn = document.getElementById("submitBtn");
const imageFileName = document.getElementById("imageFileName");
const backBtn = document.getElementById("backBtn");
const tempModal = document.getElementById("tempModal");
const tempModalConfirm = document.getElementById("tempModalConfirm");
const tempModalCancel = document.getElementById("tempModalCancel");


let tempPostId = localStorage.getItem("tempPostId");
let interval;

if(tempPostId != null){
    tempModal.style.display = "flex";
    tempModalConfirm.addEventListener("click", () => {
        tempModal.style.display = "none";
        get(`posts/temp?postId=${tempPostId}`)
        .then(result => {
            postTitle.value = result.data.title;
            postContent.value = result.data.body;
            startInterval();
        })
    });
    tempModalCancel.addEventListener("click", () => {
        tempModal.style.display = "none";
        localStorage.removeItem("tempPostId");
        createTemp();
    });
} else {
    createTemp();
}

function startInterval(){
    interval = setInterval(() => {
        const formData = new FormData();
        formData.append("request", new Blob([JSON.stringify({
            title: postTitle.value,
            body: postContent.value
        })], {type: "application/json"}));
        patch(`posts/${tempPostId}/temp`, formData);
    }, 30000);
}

imageUploadBtn.addEventListener("click", () => {
    imageUpload.click();
});

imageUpload.addEventListener("change", () => {
    let fileNames = "";

    for(const file of imageUpload.files){
        fileNames += file.name + ", ";
    }

    if(fileNames.length != 0){
        imageFileName.textContent = fileNames;
    } else {
        imageFileName.textContent = "파일을 선택해주세요.";
    }
});

submitBtn.addEventListener("click", () => {
    const formData = new FormData;
    const request = {
        title: postTitle.value,
        body: postContent.value
    }

    formData.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));
    for(const file of imageUpload.files){
        formData.append("images",file);
    }

    put(`posts/${tempPostId}`, formData)
    .then(result => {
        clearInterval(interval);
        localStorage.removeItem("tempPostId");
        location.replace(`./post_view.html?postId=${result.data.postId}`);
    })
    .catch(error => {

    })
});

backBtn.addEventListener("click", () => {
    location.replace("./post_list.html");
});

function createTemp(){
    post("posts/temp", {}, {"Content-Type": "application/json", "Idempotency-Key": IdempotencyKey})
    .then(result => {
        tempPostId = result.data.postId;
        localStorage.setItem("tempPostId", tempPostId);
        startInterval();
    }).catch(error => {
        if(error.status == 401) location.replace("./login.html");
    })
}
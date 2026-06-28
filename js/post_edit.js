import {get, patch} from "./router.js";

const queryParams = new URLSearchParams(window.location.search);
const postId = queryParams.get("postId");

const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const imageFileName = document.getElementById("imageFileName");
const submitBtn = document.getElementById("submitBtn");
const backBtn = document.getElementById("backBtn");

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";
imageInput.multiple = true;
imageInput.style.display = "none";

get(`posts/${postId}`)
.then(result => {
    postTitle.value = result.data.title;
    postContent.value = result.data.body;
})

imageUploadBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    let fileNames = "";
    for(const file of imageInput.files){
        fileNames += file.name + ", ";
    }
    imageFileName.textContent = fileNames.length > 0
        ? fileNames.slice(0, -2)
        : "기존 파일 명";
});

submitBtn.addEventListener("click", () => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify({
        title: postTitle.value,
        body: postContent.value
    })], {type: "application/json"}));
    for(const file of imageInput.files){
        formData.append("images", file);
    }

    patch(`posts/${postId}`, formData)
    .then(result => {
        location.replace(`./post_view.html?postId=${postId}`);
    }).catch(error => {

    })
});

backBtn.addEventListener("click", () => {
    location.replace(`./post_view.html?postId=${postId}`);
});
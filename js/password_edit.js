import {patch} from "./router.js";

const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
const passwordHelper = document.getElementById("passwordHelper");
const passwordConfirmHelper = document.getElementById("passwordConfirmHelper");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", () => {
    if(!passwordValidate()){
        passwordHelper.textContent = "*비밀번호는 대문자, 소문자, 숫자, 특수문자 각각 1개를 포함해야합니다.";
        return;
    }
    if(password.value !== passwordConfirm.value){
        passwordConfirmHelper.textContent = "*비밀번호가 다릅니다";
        return;
    }

    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify({password: password.value})], {type: "application/json"}));
    
    patch("users", formData)
    .then(result => {
        location.replace("./post_list.html");
    }).catch(error => {
    })
});

function passwordValidate(){
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    return regexPassword.test(password.value);
}
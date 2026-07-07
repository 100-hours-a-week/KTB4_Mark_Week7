import {get, post} from "./router.js"

getCsrfToken();

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const goSignup = document.getElementById("goSignup");

const validates = {
    email : false,
    password : false
}

loginBtn.addEventListener("click", () =>{
    const request = {
        email : email.value,
        password : password.value
    }

    post("login", request, {"Content-Type" : "application/json"})
    .then(result => {
        localStorage.setItem("profileFileId", result.data.profileFileId);
        localStorage.setItem("userId", result.data.userId);
        localStorage.setItem("userRole", result.data.userRole);
        location.replace("./post_list.html");
    })
    .catch(error => {
        helperText("login").textContent = "*아이디 또는 비밀번호를 확인해주세요";
    });
})

email.addEventListener("change", () => {
    if(email.value.length == 0){
        helperText("email").textContent = "*이메일을 입력해주세요";
        validates.email = false;
    } else if(!emailValidate()) {
        helperText("email").textContent = "*올바른 이메일 주소 형식을 입력해주세요 (예:example@example.com)";
        validates.email = false;
    } else {
        helperText("email").textContent = "";
        validates.email = true;
    }
    checkAllValidate();
});


password.addEventListener("change", () => {
    if(password.value.length == 0){
        helperText("password").textContent = "*비밀번호를 입력해주세요"
        validates.password = false;
    } else if(!passwordValidate()) {
        helperText("password").textContent = "*비밀번호는 대문자, 소문자, 숫자, 특수문자 각각 1개를 포함해야합니다.";
        validates.password = false;
    } 
    else {
        helperText("password").textContent = ""
        validates.password = true;
    }
    checkAllValidate();
});

goSignup.addEventListener("click", () => {
    location.href = "./signup.html"
});


function emailValidate(){
    const regexEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email.value)
}

function passwordValidate(){
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    return regexPassword.test(password.value);
}

function helperText(type) {
    return document.getElementById(type + "Helper");
}

function checkAllValidate(){
    if(Object.values(validates).includes(false)){
        loginBtn.disabled = true;
    } else {
        loginBtn.disabled = false;
    }
}

async function getCsrfToken(){
    await cookieStore.delete("XSRF-TOKEN")
    await get("csrf");
}
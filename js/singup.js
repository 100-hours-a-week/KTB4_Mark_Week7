import {post} from "./router.js"


const submitBtn = document.getElementById("submitBtn");
const profileUpload = document.getElementById("profileUpload");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
const nickname = document.getElementById("nickname");
const profilePreview = document.getElementById("profilePreview");
const goLogin = document.getElementById("goLogin");

const validates = {
    profileUpload: false,
    email : false,
    password: false,
    passwordConfirm : false,
    nickname : false
}


submitBtn.addEventListener("click", () =>{
    const formData = new FormData();

    const request = {
        email : email.value,
        password : password.value,
        nickname : nickname.value
    }

    formData.append("request", new Blob([JSON.stringify(request)], {type : "application/json"}));
    if(profileUpload.files[0]) {
        formData.append("profileImage",profileUpload.files[0]);
    }

    post("users", formData)
    .then(result => {
        location.replace("./login.html");
    })
    .catch(error => {
        if(error.message == "중복된 이메일 입니다."){
            helperText("email").textContent = "*"+ error.message;
        } else if(error.message == "중복된 닉네임 입니다."){
            helperText("nickname").textContent = "*" + error.message;
        }
    });
})

profileUpload.addEventListener("change", () => {
    if(!profileUpload.files[0]) {
        helperText("profileUpload").textContent = "*프로필 사진을 추가해주세요";
        validates.profileUpload = false;
        profilePreview.src = "";
    } else {
        imageView();
        helperText("profileUpload").textContent = "";
        validates.profileUpload = true;
    }
    checkAllValidate();
});


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

passwordConfirm.addEventListener("change", () => {
    if (passwordConfirm.value.length == 0){
        helperText("passwordConfirm").textContent = "*비밀번호를 한번 더 입력해주세요";
        validates.passwordConfirm = false;
    } else if(password.value != passwordConfirm.value){
        helperText("passwordConfirm").textContent = "*비밀번호가 다릅니다";
        validates.passwordConfirm = false;
    } else {
        helperText("passwordConfirm").textContent = "";
        validates.passwordConfirm = true;
    }
    checkAllValidate();
});

nickname.addEventListener("change", () => {
    if(nickname.value.length == 0){
        helperText("nickname").textContent = "*닉네임을 입력해주세요";
        validates.nickname = false;
    } else if(nickname.value.search(/\s/) !== -1){
        helperText("nickname").textContent = "*띄어쓰기를 없애주세요";
        validates.nickname = false;
    } else {
        helperText("nickname").textContent = "";
        validates.nickname = true;
    }

    checkAllValidate();
});

goLogin.addEventListener("click", () => {
    location.replace("./login.html");
});



function emailValidate(){
    const regexEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email.value)
}

function passwordValidate(){
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    return regexPassword.test(password.value);
}


function imageView(){
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
        profilePreview.src = e.target.result;
    }
    fileReader.readAsDataURL(profileUpload.files[0]);
}

function helperText(type) {
    return document.getElementById(type + "Helper");
}

function checkAllValidate(){
    if(Object.values(validates).includes(false)){
        submitBtn.disabled = true;
    } else {
        submitBtn.disabled = false;
    }
}


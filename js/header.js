const headerRoot = document.getElementById("headerRoot");

if (headerRoot) {
    const showBack = headerRoot.dataset.back === "true";
    const showAuth = headerRoot.dataset.auth !== "false";
    const title = headerRoot.dataset.title || "CodeLounge";

    headerRoot.classList.add("header");
    if (showBack) {
        headerRoot.classList.add("header-with-back");
    } else {
        headerRoot.style.position = "relative";
    }

    const backBtnHtml = showBack
        ? `<button class="back-btn" id="backBtn">&#10094;</button>`
        : "";

    const authHtml = showAuth
        ? `
    <button id="notifBtn" class="header-notif-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span id="notifBadge" class="notif-badge notif-badge-hidden"></span>
    </button>
    <div class="notif-dropdown" id="notifDropdown">
      <div class="notif-dropdown-title">알림</div>
      <div class="notif-list" id="notifList"></div>
      <div class="notif-empty" id="notifEmpty">새로운 알림이 없습니다</div>
    </div>
    <button id="profileBtn" class="header-profile-btn">
      <img id="profileImg" src="" alt="" class="header-profile-img">
    </button>
    <div class="profile-dropdown" id="profileDropdown">
      <button class="dropdown-item" id="goProfileEdit">회원정보수정</button>
      <button class="dropdown-item" id="goPasswordEdit">비밀번호수정</button>
      <button class="dropdown-item" id="goLogout">로그아웃</button>
    </div>`
        : "";

    headerRoot.innerHTML = `${backBtnHtml}<span class="header-title">${title}</span>${authHtml}`;
}
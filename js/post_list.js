import {get} from "./router.js";

const postList = document.getElementById("postList");
const emptyMessage = document.getElementById("emptyMessage");
const writeBtn = document.getElementById("writeBtn");
const categoryToggle = document.getElementById("categoryToggle");
const categoryToggleLabel = document.getElementById("categoryToggleLabel");
const categoryChips = document.getElementById("categoryChips");

let lastPostId = null;
let isLoading = false;
let hasMore = true;

writeBtn.addEventListener("click", () => {
    location.href = "./post_write.html";
});
writePermission();
function loadPosts(){
    if(isLoading || !hasMore) return;
    isLoading = true;

    const url = lastPostId ? `posts?lastPostId=${lastPostId}` : "posts";

    get(url)
    .then(result => {
        if(result.data.total === 0 && lastPostId === null){
            emptyMessage.style.display = "block";
            return;
        }

        if(result.data.total < 10){
            hasMore = false;
        }

        for(const post of result.data.list){
            const card = document.createElement("div");
            card.className = "post-card";
            card.innerHTML = `
                <div class="post-card-top">
                    <span class="post-title">${post.title}</span>
                </div>
                <div class="post-meta">
                    <div class="post-stats">
                        <span>좋아요 ${post.counts.likes}</span>
                        <span>댓글 ${post.counts.comments}</span>
                        <span>조회수 ${post.counts.views}</span>
                    </div>
                    <span class="post-date">${post.postTime}</span>
                </div>
                <div class="post-divider"></div>
                <div class="post-author">
                    <div class="author-avatar">
                        <img id="authorImg-${post.postId}" style="display:none;">
                    </div>
                    <span class="author-name">${post.nickname}</span>
                </div>
            `;
            card.addEventListener("click", () => {
                location.href = `./post_view.html?postId=${post.postId}`;
            });
            postList.appendChild(card);
            lastPostId = post.postId;
            if(post.thumbnailId){
                const authorImg = document.getElementById(`authorImg-${post.postId}`);
                get(`files/${post.thumbnailId}`)
                .then(result => {
                    authorImg.src = `http://localhost:8080/${result.data.filePath}`;
                    authorImg.style.display = "block";
                })
            }
        }
    })
    .finally(() => {
        isLoading = false;
    })
}

loadPosts();

window.addEventListener("scroll", () => {
    if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 100){
        loadPosts();
    }
});

categoryToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    categoryChips.classList.toggle("show");
});

categoryChips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        categoryChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        categoryToggleLabel.textContent = chip.textContent;
        categoryChips.classList.remove("show");
    
    });
});

document.addEventListener("click", (event) => {
    if (!categoryChips.contains(event.target) && event.target !== categoryToggle) {
        categoryChips.classList.remove("show");
    }
});

function writePermission(){
    const userRole = localStorage.getItem("userRole");
    if(userRole !== "ROLE_AUTH_USER"){
        writeBtn.disabled = true;
    }
}
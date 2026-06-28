import {get, post, patch, del} from "./router.js";

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString);
const postId = queryParams.get('postId');

const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const likeCount = document.getElementById("likeCount");
const viewCount = document.getElementById("viewCount");
const commentCount = document.getElementById("commentCount");
const postImage = document.getElementById("postImage");
const postDate = document.getElementById("postDate");
const authorName = document.getElementById("authorName");
const authorImg = document.getElementById("authorImg");
const commentList = document.getElementById("commentList");
const postActions = document.getElementById("postActions");
const editBtn = document.getElementById("editBtn");
const deletePostBtn = document.getElementById("deletePostBtn");
const deletePostModal = document.getElementById("deletePostModal");
const deletePostCancel = document.getElementById("deletePostCancel");
const deletePostConfirm = document.getElementById("deletePostConfirm");
const deleteCommentModal = document.getElementById("deleteCommentModal");
const deleteCommentCancel = document.getElementById("deleteCommentCancel");
const deleteCommentConfirm = document.getElementById("deleteCommentConfirm");
const commentInput = document.getElementById("commentInput");
const commentSubmitBtn = document.getElementById("commentSubmitBtn");
const likeBtn = document.getElementById("likeBtn");
const backBtn = document.getElementById("backBtn");
const reportBtn = document.getElementById("reportBtn");
const reportModal = document.getElementById("reportModal");
const reportCancel = document.getElementById("reportCancel");
const reportConfirm = document.getElementById("reportConfirm");

let deleteTargetCommentId = null;

get(`posts/${postId}`)
.then(result => {
    postTitle.textContent = result.data.title;
    postContent.textContent = result.data.body;
    postDate.textContent = result.data.postTime;
    authorName.textContent = result.data.nickname;
    likeCount.textContent = result.data.counts.likes;
    viewCount.textContent = result.data.counts.views;
    commentCount.textContent = result.data.counts.comments;
    imageLoading(result.data.fileIds, result.data.thumbnailId);
    commentLoading(postId);
    if(result.data.permission){
        postActions.style.display = "flex";
    }
})

editBtn.addEventListener("click", () => {
    location.replace(`./post_edit.html?postId=${postId}`);
});

deletePostBtn.addEventListener("click", () => {
    deletePostModal.style.display = "flex";
});

deletePostCancel.addEventListener("click", () => {
    deletePostModal.style.display = "none";
});

deletePostConfirm.addEventListener("click", () => {
    del(`posts/${postId}`)
    .then(result => {
        location.replace("./post_list.html");
    })
});

commentSubmitBtn.addEventListener("click", () => {
    let IdempotencyKey = self.crypto.randomUUID();
    if(!commentInput.value.trim()) return;
    post(`posts/${postId}/comments`, {comment: commentInput.value}, {"Content-Type": "application/json", "Idempotency-Key" : IdempotencyKey})
    .then(result => {
        commentInput.value = "";
        commentLoading(postId);
    })
});

likeBtn.addEventListener("click", () => {
    
    post(`posts/${postId}/likes`, {}, {"Content-Type": "application/json"})
    .then(result => {
        likeCount.textContent = Number(likeCount.textContent) + 1;
    }).catch(error => {
        del(`posts/${postId}/likes`)
        .then(result => {
            likeCount.textContent = Number(likeCount.textContent) - 1;
        })
    })
});

deleteCommentCancel.addEventListener("click", () => {
    deleteCommentModal.style.display = "none";
});

deleteCommentConfirm.addEventListener("click", () => {
    del(`comments/${deleteTargetCommentId}`)
    .then(result => {
        deleteCommentModal.style.display = "none";
        commentLoading(postId);
    })
});

reportBtn.addEventListener("click", () => {
    reportModal.style.display = "flex";
});

reportCancel.addEventListener("click", () => {
    reportModal.style.display = "none";
});

reportConfirm.addEventListener("click", () => {
    post(`posts/${postId}/reports`, {}, {"Content-Type": "application/json"})
    .then(result => {
        reportModal.style.display = "none";
    })
});

backBtn.addEventListener("click", () => {
    location.replace("./post_list.html");
});

function imageLoading(postfileIds, thumbnailId){
    if(postfileIds && postfileIds.length > 0){
        postImage.style.display = "block";  
        get(`files?fileIds=${postfileIds.join(",")}`)
        .then(result => {
            for(const file of result.data){
                const img = document.createElement("img");
                img.src = `http://localhost:8080/${file.filePath}`;
                postImage.appendChild(img);
            }
        })
    }
    if(thumbnailId){
        get(`files/${thumbnailId}`)
        .then(result => {
            authorImg.src = `http://localhost:8080/${result.data.filePath}`;
            authorImg.style.display = "block";
        })
    }
}

function commentLoading(postId){
    get(`posts/${postId}/comments`)
    .then(result => {
        commentList.innerHTML = "";
        for(const comment of result.data){
            const item = document.createElement("div");
            item.className = "comment-item";
            item.innerHTML = `
                <div class="comment-meta">
                    <div class="comment-avatar"></div>
                    <span class="comment-author">${comment.nickname}</span>
                    <div class="comment-actions" style="display:none;" id="commentActions${comment.commentId}">
                        <button class="btn-comment-edit" data-id="${comment.commentId}">수정</button>
                        <button class="btn-comment-delete" data-id="${comment.commentId}">삭제</button>
                    </div>
                    <button class="btn-reply" data-id="${comment.commentId}">답글</button>
                </div>
                <div class="comment-content" id="commentContent${comment.commentId}">${comment.comment}</div>
                <div class="reply-input" id="replyInput${comment.commentId}" style="display:none;">
                    <input type="text" id="replyText${comment.commentId}" placeholder="답글을 입력하세요">
                    <button class="btn-reply-submit" data-id="${comment.commentId}">등록</button>
                </div>
            `;
            commentList.appendChild(item);
            if(comment.parentCommentId){
                item.style.paddingLeft = "32px";
            }

            if(comment.userId == localStorage.getItem("userId")){
                document.getElementById(`commentActions${comment.commentId}`).style.display = "flex";
            }
        }

        document.querySelectorAll(".btn-comment-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const commentId = btn.dataset.id;
                const contentEl = document.getElementById(`commentContent${commentId}`);
                const original = contentEl.textContent;
                contentEl.innerHTML = `
                    <input type="text" id="editInput${commentId}" value="${original}">
                    <button id="editSave${commentId}">저장</button>
                    <button id="editCancel${commentId}">취소</button>
                `;
                document.getElementById(`editSave${commentId}`).addEventListener("click", () => {
                    const newComment = document.getElementById(`editInput${commentId}`).value;
                    patch(`comments/${commentId}`, {comment: newComment}, {"Content-Type": "application/json"})
                    .then(result => {
                        commentLoading(postId);
                    })
                });
                document.getElementById(`editCancel${commentId}`).addEventListener("click", () => {
                    commentLoading(postId);
                });
            });
        });

        document.querySelectorAll(".btn-comment-delete").forEach(btn => {
            btn.addEventListener("click", () => {
                deleteTargetCommentId = btn.dataset.id;
                deleteCommentModal.style.display = "flex";
            });
        });

        document.querySelectorAll(".btn-reply").forEach(btn => {
            btn.addEventListener("click", () => {
                const commentId = btn.dataset.id;
                const replyInput = document.getElementById(`replyInput${commentId}`);
                replyInput.style.display = replyInput.style.display === "none" ? "flex" : "none";
            });
        });

        document.querySelectorAll(".btn-reply-submit").forEach(btn => {
            btn.addEventListener("click", () => {
                const parentCommentId = btn.dataset.id;
                const replyText = document.getElementById(`replyText${parentCommentId}`).value;
                if(!replyText.trim()) return;
                post(`posts/${postId}/comments`,
                    {comment: replyText, parentCommentId: Number(parentCommentId)},
                    {"Content-Type": "application/json", "Idempotency-Key": self.crypto.randomUUID()}
                ).then(result => {
                    commentLoading(postId);
                })
            });
        });
    })
}
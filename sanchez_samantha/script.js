const getElement = (id) => document.getElementById(id);
const nameInput = getElement("name_input");
const commentInput = getElement("comment_input");
const submitButton = getElement("submit_comment");
const commentsList = document.querySelector(".comments-list");

updateSubmitButton();

nameInput.addEventListener("input", updateSubmitButton);
commentInput.addEventListener("input", updateSubmitButton);
submitButton.addEventListener("click", addComment);
getElement("sort_asc").addEventListener("click", () => sortComments(true));
getElement("sort_desc").addEventListener("click", () => sortComments(false));
getElement("comment_Form").addEventListener
("submit", (event) => event.preventDefault());

function updateSubmitButton() {
    submitButton.disabled = !(nameInput.value.trim() && 
    commentInput.value.trim());
}

function addComment() {
    if (!nameInput.value.trim() || !commentInput.value.trim()) return;

    const newComment = document.createElement("li");
    newComment.innerHTML = `<strong>${nameInput.value}:</strong> 
    <span>${commentInput.value}</span>`;
    newComment.dataset.timestamp = new Date().toISOString();

    commentsList.appendChild(newComment);
    nameInput.value = "";
    commentInput.value = "";

    updateSubmitButton();
}

function sortComments(ascending) {
    const allComments = Array.from(document.querySelectorAll
        ('.comments-list > li'));
    const sortedComments = allComments.sort((a, b) => {
        const dateA = new Date(a.dataset.timestamp);
        const dateB = new Date(b.dataset.timestamp);
        return ascending ? dateA - dateB : dateB - dateA;
    });

    updateCommentsList(sortedComments);
}

function updateCommentsList(sortedComments) {
    commentsList.innerHTML = "";
    sortedComments.forEach((comment) => commentsList.appendChild(comment));
}


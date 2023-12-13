document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const commentInput = document.getElementById("comment");
    const commentButton = document.getElementById("comment_button");
    const commentsList = document.getElementById("comments_list");

    const updateCommentButtonState = () => {
        commentButton.disabled = !(
            nameInput.value.trim() && commentInput.value.trim());
    };

    const addComment = (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        if (name && comment) {
            const newComment = document.createElement("li");
            const commentText = document.createElement("p");

            newComment.setAttribute(
                "data-date", new Date().toLocaleDateString());
            commentText.textContent = `${name}: ${comment}`;

            newComment.appendChild(commentText);
            commentsList.appendChild(newComment);

            nameInput.value = "";
            commentInput.value = "";
            commentButton.disabled = true;
        }
    };

    const sortComments = (order) => {
        const comments = Array.from(commentsList.children);
        const sortFunction = (a, b) => {
            const dateA = new Date(a.getAttribute("data-date"));
            const dateB = new Date(b.getAttribute("data-date"));
            return order === "asc" ? dateA - dateB : dateB - dateA;
        };

        comments.sort(sortFunction);
        commentsList.innerHTML = "";
        comments.forEach(comment => commentsList.appendChild(comment));
    };

    nameInput.addEventListener("input", updateCommentButtonState);
    commentInput.addEventListener("input", updateCommentButtonState);
    commentButton.addEventListener("click", addComment);

    const sortAscButton = document.getElementById("sort_asc");
    sortAscButton.addEventListener("click", () => sortComments("asc"))
    
    const sortDescButton = document.getElementById("sort_desc");
    sortDescButton.addEventListener("click", () => sortComments("desc"));
});
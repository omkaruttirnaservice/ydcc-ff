$(document).ready(() => {
	console.log("Home");

	function getValidCandidateList(postId, postName) {
		try {
			fetch(`/valid-list?postId=${postId}&postName=${postName}`)
				.then(data => data.json())
				.then(response => {
					console.log(response);
					const html = response.usrMsg;
					$("#valid-list-modal-body").html(html);
				})
				.catch(error => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
		}
	}

	$(".valid-candidate-list").on("click", function () {
		const postId = $(this).data("post-id");
		const postName = $(this).data("post-name");
		console.log(postId, postName);
		getValidCandidateList(postId, postName);
		openModal();
	});

	function openModal() {
		const modal = document.getElementById("simpleModal");
		modal.classList.remove("hidden");
		modal.classList.add("flex");
	}

	$(document).on("click", "#close-modal", function () {
		closeModal();
	});

	function closeModal() {
		const modal = document.getElementById("simpleModal");
		modal.classList.add("hidden");
		modal.classList.remove("flex");
	}
});

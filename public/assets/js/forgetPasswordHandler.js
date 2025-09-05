$(function () {
	$("#get-password").click(function (event) {
		event.preventDefault();
		let $this = $(this);
		if ($("#forget-password").valid()) {
			$this.prop("disabled", true).html("Validating Details...");
			$.ajax({
				method: "post",
				url: "/getVerifyRecoveryDetails",
				data: {
					aadharNumber: $('input[name="forAadharNumber"]').val(),
					userId: $('input[name="forgetUserName"]').val(),
				},
			})
				.done(function (data) {
					$this.prop("disabled", false).html("Verify Details");
					var json_data = data;
					switch (json_data._call) {
						case 1:
							$("#password").html(
								`<td colspan="2">
									Your Password is <strong>${json_data.data.password}</strong>
								</td>`,
							);
							$("#user").prop("readonly", true);
							$("#addhar").prop("readonly", true);
							break;
						case 0:
							alert("details not found,try again");
							break;
					}
				})
				.fail(function (error) {
					$this.prop("disabled", false).html("Verify Details");
					alertjs.error(function () {
						console.log(error);
					});
				})
				.always(function () {
					$this.prop("disabled", false).html("Verify Details");
					console.log("Done");
				});
		}
	});
});
$("#forget-password").validate({
	rules: {
		forgetUserName: {
			required: true,
			number: true,
			minlength: 1,
			maxlength: 8,
		},
		forAadharNumber: {
			required: true,
			number: true,
			minlength: 12,
			maxlength: 12,
		},
	},
	messages: {
		forgetUserName: {
			required: "&nbsp;Enter User ID",
			number: "&nbsp;Invalid User ID",
			minlength: "&nbsp;User ID Must Be {0} Digits",
			maxlength: "&nbsp;User ID     Be At Least {0} Digits",
		},
		forAadharNumber: {
			required: "&nbsp;Enter Aadhaar Card Number",
			number: "&nbsp;Invalid Aadhaar Card Number",
			minlength: "&nbsp;Aadhaar Card Number Must Be {0} Digits",
			maxlength: "&nbsp;Aadhaar Card Number Be At Least {0} Digits",
		},
	},
	errorPlacement: function (error, element) {
		error.insertAfter(element);
		$("label[class='error']").addClass("text-danger font-weight-bolder");
	},
});

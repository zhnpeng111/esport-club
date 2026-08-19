$(document).ready(function () {
    const $contactForm = $('#contactForm');
    const $formAlert = $('#formAlert');

    if ($contactForm.length) {
        $contactForm.on('submit', function (e) {
            e.preventDefault(); 

            const fullName = $('#fullName').val();
            const email = $('#email').val();
            const preferredGame = $('#preferredGame').val();
            const message = $('#message').val();

            const postData = {
                title: fullName,
                email: email,
                game: preferredGame,
                body: message
            };

            $.ajax({
                url: 'https://jsonplaceholder.typicode.com/posts', 
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(postData),
                success: function (response) {
                    console.log("API Success Response:", response);

                    $formAlert
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .html(`Thank you, <strong>${fullName}</strong>! Your application for the <strong>${preferredGame}</strong> team has been submitted successfully.`);

                    $contactForm[0].reset();
                },
                error: function (xhr, status, error) {
                    console.error("API Error:", error);

                    $formAlert
                        .removeClass('d-none alert-success')
                        .addClass('alert-danger')
                        .html(`Something went wrong (Status: ${xhr.status || 'Network Error'}). Please try again.`);
                }
            });
        });
    }
});
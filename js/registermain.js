(function ($) {

        var firebaseConfig = {
                apiKey: "AIzaSyBBe_h_aIgSRbT-xwXhlGkSmbUB2zmZGNc",
                authDomain: "huluradiox.firebaseapp.com",
                databaseURL: "https://huluradiox.firebaseio.com",
                projectId: "huluradiox",
                storageBucket: "huluradiox.appspot.com",
                messagingSenderId: "701196878506",
                appId: "1:701196878506:web:09e72de08f77c460ac46d3",
                measurementId: "G-Y50XR144GX"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        function init() {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sendCode', {
                        'size': 'invisible',
                        'callback': function (recaptchaToken) {
                                // reCAPTCHA solved, send recaptchaToken and phone number to backend.

                                // a REST call to your backend
                                console.dir({ phoneNumber: document.getElementById('phoneNumber').value, recaptchaToken })

                                var myHeaders = new Headers();
                                myHeaders.append('Content-Type', 'application/json');

                                $.post("https://afrigebeta.herokuapp.com/api/user/sendCode", {
                                        phoneNumber: document.getElementById('phoneNumber').value,
                                        recaptchaToken: recaptchaToken
                                }, function (data, status) {

                                        if (status === 'success') {

                                                window.sessionOTPId = res.sessionInfo
                                                document.getElementById("otp_input").style.display = "block"
                                                document.getElementById("otp_button").style.display = "block"

                                        }
                                }).fail(function (jqXHR, textStatus, errorThrown) {

                                        console.log(jqXHR)
                                });


                                /*
                                fetch("https://afrigebeta.herokuapp.com/api/user/sendCode", {
                                                method: "post",
                                                headers: { 'Content-Type': 'application/json' },
                                                mode: 'cors',
                                                cache: 'no-cache',
                                                body: JSON.stringify({
                                                        phoneNumber: document.getElementById('phoneNumber').value,
                                                        recaptchaToken: recaptchaToken
                                                })
                                        })
                                        .then(response => response.json())
                                        .then(res => {
                                                window.sessionOTPId = res.sessionInfo
                                                document.getElementById("otp_input").style.display = "block"
                                                document.getElementById("otp_button").style.display = "block"
                                        });*/
                        }
                });

                function sendOTP() {
                        const sessionId = window.sessionId
                        const otp = document.getElementById("otp_input").value

                        fetch("http://localhost:3000/api/user/acceptOTP", {
                                        method: "post",
                                        headers: { 'Content-Type': 'application/json' },
                                        mode: 'cors',
                                        cache: 'no-cache',
                                        body: JSON.stringify({
                                                code: otp,
                                                sessionInfo: sessionId
                                        })
                                })
                                .then(response => response.json())
                                .then(res => {
                                        console.dir(res)
                                                // TODO: Well some kind of success or error 
                                });
                }

                // render the rapchaVerifier. 
                window.recaptchaVerifier.render().then(function (widgetId) {
                        window.recaptchaWidgetId = widgetId;
                });
        }

        let t = 0;

        let firstname = ""
        let username = ""
        let lastname = ""
        let phone = ""
        let password = ""
        let age = ""

        var form = $("#signup-form");
        form.validate({
                errorPlacement: function errorPlacement(error, element) {
                        element.before(error);
                },
                rules: {
                        first_name: {
                                required: true,
                        },
                        last_name: {
                                required: true,
                        },
                        username: {
                                required: true,
                        },
                        email: {
                                required: true,
                                email: true
                        },
                        code: {
                                required: true
                        },
                        age: {
                                required: true
                        }
                },
                messages: {
                        first_name: {
                                required: "Please enter your first name"
                        },
                        last_name: {
                                required: "Please enter your last name"
                        },
                        username: {
                                required: "Please enter your username"
                        },
                        email: {
                                required: "Please enter your first name",
                                email: "Please enter a valid email address!"
                        },

                        code: {
                                required: "Please enter your the code"
                        },
                        age: {
                                required: "Please enter your Age"
                        }
                },
                onfocusout: function (element) {
                        $(element).valid();
                },
                highlight: function (element, errorClass, validClass) {
                        $(element).parent().parent().find('.form-group').addClass('form-error');
                        $(element).removeClass('valid');
                        $(element).addClass('error');
                },
                unhighlight: function (element, errorClass, validClass) {
                        $(element).parent().parent().find('.form-group').removeClass('form-error');
                        $(element).removeClass('error');
                        $(element).addClass('valid');
                }
        });
        form.steps({
                headerTag: "h3",
                bodyTag: "fieldset",
                transitionEffect: "fade",
                labels: {
                        previous: 'Previous',
                        next: 'Next',
                        finish: 'Finish',
                        current: ''
                },
                titleTemplate: '<h3 class="title">#title#</h3>',
                onInit: function (event, currentIndex) {
                        // Suppress (skip) "Warning" step if the user is old enough.

                        if (currentIndex === 0) {

                                form.find('.actions').addClass('test');
                        }
                },
                onStepChanging: function (event, currentIndex, newIndex) {

                        form.validate().settings.ignore = ":disabled,:hidden";
                        return form.valid();
                },
                onFinishing: function (event, currentIndex) {
                        form.validate().settings.ignore = ":disabled";
                        return form.valid();
                },
                onFinished: function (event, currentIndex) {
                        //check the data and send
                },
                onStepChanged: function (event, currentIndex, priorIndex) {
                        if (currentIndex == 1) {

                                firstname = document.getElementById("first_name").value;
                                lastname = document.getElementById("last_name").value;
                                username = document.getElementById("username").value;
                        } else if (currentIndex == 2) {
                                password = document.getElementById("password").value;
                                phone = document.getElementById("phoneNumber").value;
                                age = document.getElementById("age").value;
                        }


                        t = t + 1;


                }
        });

        jQuery.extend(jQuery.validator.messages, {
                required: "",
                remote: "",
                email: "",
                url: "",
                date: "",
                dateISO: "",
                number: "",
                digits: "",
                creditcard: "",
                equalTo: ""
        });

        // $('#country').parent().append('<ul id="newcountry" class="select-list" name="country"></ul>');
        // $('#country option').each(function(){
        //     $('#newcountry').append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
        // });
        // $('#country').remove();
        // $('#newcountry').attr('id', 'country');
        // $('#country li').first().addClass('init');
        // $("#country").on("click", ".init", function() {
        //     $(this).closest("#country").children('li:not(.init)').toggle();
        // });

        // var allOptions = $("#country").children('li:not(.init)');
        // $("#country").on("click", "li:not(.init)", function() {
        //     allOptions.removeClass('selected');
        //     $(this).addClass('selected');
        //     $("#country").children('.init').html($(this).html());
        //     allOptions.toggle();
        // });

        // var inputs = document.querySelectorAll( '.inputfile' );
        // Array.prototype.forEach.call( inputs, function( input )
        // {
        // 	var label	 = input.nextElementSibling,
        // 		labelVal = label.innerHTML;

        // 	input.addEventListener( 'change', function( e )
        // 	{
        // 		var fileName = '';
        // 		if( this.files && this.files.length > 1 )
        // 			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        // 		else
        // 			fileName = e.target.value.split( '\\' ).pop();

        // 		if( fileName )
        // 			label.querySelector( 'span' ).innerHTML = fileName;
        // 		else
        // 			label.innerHTML = labelVal;
        // 	});

        // 	// Firefox bug fix
        // 	input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
        // 	input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
        // });


})(jQuery);

function readURL(input) {
        if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                        $('.your_picture_image')
                                .attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
        }
}
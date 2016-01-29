$(document).ready(function(){
    /*  hide steps 2-4*/
    $('#step2').hide();
    $('#step3').hide();
    $('#step4').hide();

    /* type of action */
    var action;
});

$(function(){

    /* step 1 click 'encrypt' button */
    $('#step1 .encrypt').click(function(){
        action = 'encrypt';					// signifies that we want to encrypt a file
        $('#step1').css('opacity',0.6);		// lower the opacity of the first step
        $('#step2 .encrypt').show();		// show the encryption part of the second step <div>
        $('#step2 .decrypt').hide();		// hide the decryption part of the second step <div>
        $('#step3').slideUp();				// we slide the 3rd step element up 
        $('#step4').slideUp();				// we slide the 4th step element up 
		$('#step2').slideDown(500);			// sliding down the next step (step 2)
    });

    /* step 1 click 'decrypt' button */
    $('#step1 .decrypt').click(function(){
        action = 'decrypt';					// signifies that we want to decrypt a file
        $('#step1').css('opacity',0.6);		// lower the opacity of the first step
        $('#step2').css('opacity',1.0);		// increase the opacity of the second step
        $('#step2 .decrypt').show();		// show the decryption part of the second step element
        $('#step2 .encrypt').hide();		// hide the encryption part of the second step element
        $('#step3').slideUp();				// we slide the 3rd step element up 
		$('#step4').slideUp();				// we slide the 4th step element up 
        $('#step2').slideDown(500);			// sliding down the next step (step 2)
    });

    /* step 2 click 'browse' button to encrypt file */
    /* set up events for the file inputs */
    var file = null
    $('#step2').on('change','#encrypt-input',function(e){
        /* check if file was selected */
        if(e.target.files.length !=1){
            alert('Please select a file to encrypt!');
            return false;
        }

        file = e.target.files[0];

		/* check if the file size is less than 1mb */			// HTML5 'download' attribute, which we used to offer the
        if(file.size > 1024*1024){								// the encrypted file for download. doesn't play well with 
            alert('Please, choose files smaller than 1mb');		// large amounts of data. Otherwise it would cause the browser to crash
            return;												
        }

        $('#step2').css('opacity','0.6');	// lower the opacity of the second step element
        $('#step3 .decrypt').hide();		// hide the decryption part of the third step element
        $('#step3 .encrypt').show();		// show the encryption part of the third step element
        $('#step3').slideDown(500);			// slide down the 3rd step element
    });

    /* step 2 click 'browse' button to encrypt file */
    $('#step2').on('change','#decrypt-input',function(e){
		/* check if the file was chosen */
        if(e.target.files.length !=1){
            alert('Please select a file to decrypt!');
            return false;
        }

        file = e.target.files[0];

        $('#step2').css('opacity','0.6');	// lower the opacity of the second step element
        $('#step3 .encrypt').hide();		// hide the encryption part of the third step element
        $('#step3 .decrypt').show();		// show the decryption part of the third step element
        $('#step3').slideDown(500);			// slide down the 3rd step element
    });

	/* THE CODE BELOW SHOW THE USAGE OF CRYPTO.JS */
    // step 3 clicking on the button to submit the pass phrase
    $('.button.process').click(function(){
	
        var input = $(this).parent().find('input[type=password]'),
            a = $('#step4 a.download'),
            password = input.val();

        input.val('');
		
		// verifying that the passphrase is strong enough
        if(password.length < 5){
            alert('Pass phrase must be at least 5 characters!');
            return;
        }

        // The HTML FileReader object will allow us
        // to read the contents of the selected file
        var reader = new FileReader();

        if(action == 'encrypt'){
            // encrypt the file
            reader.onload = function(e){
                // Using the CryptoJS library and the AES cypher to encrypt
                // the contents of the file, held in e.target.result,
                // with the pass phrase
                var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
                // the download attribute will cause the contents of the href
                // attribute to be downloaded when clicked. The download attribute
                // also holds the name of the file that is offered for download
                a.attr('href','data:application/octet-stream,'+encrypted);
                a.attr('download',file.name+'.encrypted');

                // show step 4
                $('#step1').css('opacity',1.0);	// increase the opacity of the 1st step element
                $('#step2').slideUp(500);		// slide up the 2nd step element
                $('#step3').slideUp(500);		// slide up the 3rd step element
                $('#step4').slideDown(500);		// slide up the 4th step element
             };

            // This will encode the contents of the file into a data-uri
            // It will trigger the onload handler above, with the result
            reader.readAsDataURL(file);
        } else {
            // decrypt it
            reader.onload = function(e){

                var decrypted = CryptoJS.AES.decrypt(e.target.result,password).toString(CryptoJS.enc.Latin1);

                // checking if the file is encrypted and the pass phrase is correct
                if(!/^data:/.test(decrypted)){
                    alert("Invalid pass phrase or file! Please try again.");
                    return false;
                }

                a.attr('href', decrypted);
                a.attr('download', file.name.replace('.encrypted',''));

                // show step 4
                $('#step1').css('opacity',1.0);	// increase the opacity of the 1st step element
                $('#step2').slideUp(500);		// slide up the 2nd step element
                $('#step3').slideUp(500);		// slide up the 3rd step element
                $('#step4').slideDown(500);		// slide up the 4th step element
            };

            reader.readAsText(file);
        }
		// clear the input
        $("#decrypt-input").val('');
    });

});
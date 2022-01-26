

$("#Password, #rePassword").on("keyup",function(){

    if($("#Password").val().length != 0){
    
        if($("#Password").val() === $("#rePassword").val()){
            $("#message").html("Matching").css("color","green");
            $("#submitButton").disabled = false;

        } else {
            $("#message").html("Not Matching").css("color","red");
            $("#submitButton").disabled = true;

        }
    }

});
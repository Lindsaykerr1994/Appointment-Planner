$(document).ready(function(){
    window.userList = getListOfUsers()
    window.emailList = getEmailsOfUsers()
})
function getListOfUsers(){
    var rawUserList = $(".profile-user-data-unit").text()
    var userList = rawUserList.replace("[","").replace("]","").replace(/'/g,"").split(", ")
    return userList
}
function getEmailsOfUsers(){
    var rawUserList = $(".profile-email-data-unit").text()
    var emailList = rawUserList.replace("[","").replace("]","").replace(/'/g,"").split(", ")
    return emailList
}
function checkUsername(){
    var usernameTaken = false;
    var userInput = $("#create-user-input").val()
    for(i=0;i<userList.length;i++){
        var checkUser = userList[i];
        if(userInput==checkUser){
            $("#user-input-response").text(`Username: ${userInput} already taken`);
            usernameTaken = true;
            break;
        } else {
            $("#user-input-response").text(`Username: ${userInput} is available`)
        }
    }
    return usernameTaken
};
function confirmPassword(){
    var passwordsMatch = false;
    var confirmPwordInput = $("#second-pword-input").val()
    var firstPwordInput = $("#first-pword-input").val()
    if(confirmPwordInput==firstPwordInput){
        $("#pword-match-response").text(`Passwords match!`);
        passwordsMatch = true;
    } else {
        $("#pword-match-response").text(`Passwords do not match.`);
    }
    return passwordsMatch;
};
//This function to check if an input has a number was originally written by user: https://www.reddit.com/user/jcready/ 
//And was submitted to: https://www.reddit.com/r/javascript/comments/2hhq1n/how_can_i_check_if_a_string_contains_a_number/
//I then adapted it as my needs required.
function checkPasswordCriteria(){
    var passwordValid = false;
    var testPassword = $("#first-pword-input").val();
    var specChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var hasNumber = /\d/;
    var hasNumberResult = hasNumber.test(testPassword);
    if (testPassword.length<6){
            $("#pword-criteria-response").text(`Password must be contain 6 characters or more`);
    } else {
        if(hasNumberResult == false){
            $("#pword-criteria-response").text(`Password must contain a number`);
        } else {
            $("#pword-criteria-response").text("");
            var specCharResult = specChar.test(testPassword);
            if (specCharResult == true){
                $("#pword-criteria-response").text(`Password must not contain: '${specChar}'`);
            } else {
                passwordValid = true;
            }
        }
    }
    return passwordValid
};
function checkEmail(){
    var allowEmail = false;
    var emailTaken = false;
    var emailInput = $("#profile-email-input").val()
    for(i=0;i<emailList.length;i++){
        var checkEmail = emailList[i];
        if(emailInput==checkEmail){
            $("#email-input-response").text(`This email has already been used to create an account.`);
            emailTaken = true;
            break;
        } else {
            var emailValid = validEmail();
            if (emailValid = true){
                $("#email-input-response").text("Email address is not valid");
            } else {
                $("#email-input-response").text("");
            }
        }
    }
    if (emailTaken==false && emailValid==false){
        allowEmail = true;
    }
    return allowEmail
};
//This function to check the validity of emails was resources from:
// https://www.w3resource.com/javascript/form/email-validation.php
// And then adapted to further fit my forms specifications.
function validEmail(){
    var emailAddress = $("#profile-email-input").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailValid = mailformat.test(emailAddress);
    return emailValid
}
function submitForm(){
    if(checkUsername()==false && checkPasswordCriteria()==true && confirmPassword()==true && allowEmaill()==true){
        $("#create-account-form").submit()
    }
};
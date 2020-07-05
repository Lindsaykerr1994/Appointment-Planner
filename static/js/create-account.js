$(document).ready(function(){
    window.userList = getListOfUsers()
})
function getListOfUsers(){
    var rawUserList = $(".profile-data-unit").text()
    var userList = rawUserList.replace("[","").replace("]","").replace(/'/g,"").split(", ")
    return userList
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
function validEmail(){
    var emailAddress = $("#profile-email-input").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailValid = mailformat.test(emailAddress);
    return emailValid
}
function submitForm(){
    if(checkUsername()==false && checkPasswordCriteria()==true && confirmPassword()==true && validEmail()==false){
        $("#create-account-form").submit()
    }
};
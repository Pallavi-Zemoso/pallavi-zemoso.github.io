const sendButton = document.getElementById("send");
const userNameInput = document.messageForm.userName;
const emailInput = document.messageForm.email;
const messageInput = document.messageForm.message;
const messageForm = document.messageForm;

userNameInput.addEventListener("blur", validateUserName);
emailInput.addEventListener("blur", validateEmail);
messageInput.addEventListener("blur", validateMessage);

const validateMessageForm = function validateWriteToUsForm(event){
    clearErrorMessage();
    let errorMessage = validateUserName();

    if(errorMessage == ""){
        errorMessage = validateEmail();
    }

    if(errorMessage == ""){
        errorMessage = validateMessage();
    }

    if(errorMessage == ""){
        alert("Form Submitted");
    }
}


function validateUserName(event){
    console.log(event);
    let errorMessage = "";
    const userNamePattern = new RegExp(/[a-zA-Z]{5,40}/, "g");
    //clearErrorMessage();
    userNameInput.setCustomValidity("");
    let userName = userNameInput.value;
    if(userNameInput.validity.valueMissing){
        errorMessage = "Username is required";
    }else if(userNameInput.validity.tooShort){
        errorMessage = "Username should be atleast "+ userNameInput.minLength + " characters";
    }else if(userNameInput.validity.tooLong){
        errorMessage = "Username should not exeed " +  userNameInput.maxLength + " characters";
    }else{
        const result = userNamePattern.exec(userNameInput.value);
        if(!result){
            errorMessage = "Only Alphabet characters are allowed";
        }
    }
    processErrorMessage(userNameInput, errorMessage, event);
    return errorMessage;
}

function validateEmail(event){
    //clearErrorMessage();
    emailInput.setCustomValidity("");
    let errorMessage = "";
    if(emailInput.value != "" && emailInput.validity.typeMismatch){
        console.log(";" +emailInput.valid+";")
        errorMessage = "Invalid email";
    }
    processErrorMessage(emailInput, errorMessage, event);
    return errorMessage;
}

function validateMessage(event){
    //clearErrorMessage();
    messageInput.setCustomValidity("");
    let errorMessage = "";
    if(messageInput.validity.valueMissing){
        errorMessage = "Please enter message";
    }else if(messageInput.validity.tooShort){
        errorMessage = "Message should be atleast "+ messageInput.minLength + " characters";
    }else if(messageInput.validity.tooLong){
        errorMessage = "Message should not exeed " +  messageInput.maxLength + " characters";;
    }
    processErrorMessage(messageInput, errorMessage, event);
    return errorMessage;
}

function processErrorMessage(element, message, event){
    if( message !== ""){
        element.setCustomValidity(message);
        element.reportValidity();
        //event.preventDefault();
        console.log("Error: " + message);
    }
}

function clearErrorMessage(){
    userNameInput.setCustomValidity("");
    emailInput.setCustomValidity("");
    messageInput.setCustomValidity("");
}
sendButton.addEventListener('click',validateMessageForm);
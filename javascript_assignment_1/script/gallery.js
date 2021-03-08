const role = "admin";
const base_url = "http://my-json-server.typicode.com/pallavi-zemoso/datafiles/customImages";
const galleryFrame = document.getElementById("galleryDiv");

class CustomImage {
    constructor(id, name, url, information, uploadedDate){
        this.id = id;
        this.name = name;
        this.url = url;
        this.information = information;
        this.uploadedDate = uploadedDate;
    }

    static fromJSON(jsonObject){
        return new CustomImage(jsonObject.id, jsonObject.name, jsonObject.url, jsonObject.information, jsonObject.uploadedDate);
    }
}

let getJSON = async function getJSONData(event){
    let customImages = await fetch(base_url)
                         .then( response => response.json())
                         .catch( error => console.error(error));
    console.log(customImages);
    Object.values(customImages).forEach(element => {
    let currentImage = CustomImage.fromJSON(element);
        renderImage(currentImage);
    });
}

function renderImage(customImage){

    let imageFrame = document.createElement("div");
    imageFrame.classList.add("frame");
    imageFrame.setAttribute("data-id", customImage.id);
    galleryFrame.appendChild(imageFrame);

    let uploadedDate = document.createElement("div");
    uploadedDate.classList.add("date-div");
    uploadedDate.textContent = customImage.uploadedDate;
    imageFrame.appendChild(uploadedDate);

    let description = document.createElement("div");
    description.classList.add("desc");
    description.textContent = customImage.information;
    imageFrame.appendChild(description);

    renderFrameButtons(imageFrame, customImage);

    new Promise(function(resolve, reject){
        let newImageElement = document.createElement('img')
        newImageElement.src= customImage.url;
        newImageElement.alt = customImage.name;
        newImageElement.onload = resolve();
        newImageElement.onerror = reject();
        uploadedDate.before(newImageElement);
     })
     .then( img => {
         console.log("Image loaded");
     })
     .catch( error => console.log("Image fetching failed: " + customImage.src));
}


function renderFrameButtons(parentNode, customImage){
    if(role == "admin"){
        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttonsDiv");
        parentNode.appendChild(buttonsDiv);
    
        let updateButton = document.createElement("button");
        updateButton.classList.add("gallery-button");
        updateButton.textContent ="Update";
        updateButton.setAttribute("update-id", customImage.id);
        buttonsDiv.appendChild(updateButton);
        updateButton.addEventListener("click", (event) => {
            renderModal(event, customImage);
        });

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("gallery-button");
        deleteButton.textContent ="Delete";
        deleteButton.setAttribute("delete-id", customImage.id);
        buttonsDiv.appendChild(deleteButton);
        deleteButton.addEventListener("click", deleteImage);
    }
}

function deleteImage(event){
    let id = event.target.getAttribute("delete-id");
    let currentURL = base_url + "/" + id;
    fetch(currentURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
          },
        body: null
    })
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data);
        let currentImageFrame = event.target.closest(".frame").remove();
        alert("Image is deleted!!");
    })
    .catch(error => {
        console.log("Delete failed with error:" + error);
        alert("Delete failed!!");
    });

}

function renderAddButton(event){
    if(role == "admin"){
        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttonsDiv");
        galleryFrame.before(buttonsDiv);
    
        let addButton = document.createElement("button");
        addButton.classList.add("add-button");
        addButton.textContent ="Add Image";
        buttonsDiv.appendChild(addButton);
        addButton.addEventListener("click", renderModal);
    }
}

function renderModal(event, customImage){
    let modalContainer = document.querySelector(".modal-container");
    let modalWindow = document.querySelector(".modal-window");
    let okButton = document.querySelector(".ok-button");
    let cancelButton = document.querySelector(".cancel-button");
    let header = document.querySelector(".modal-header");

    modalWindow.style.transition = "none";
    modalWindow.style.transform = "scale(0,0)";

    requestAnimationFrame(function(){
        modalWindow.style.transition = "all 0.5s ease";
        modalWindow.style.transform = "scale(1,1)";
    });

    modalContainer.style.pointerEvents = "auto";
    modalContainer.style.opacity = 1;

    console.log(event.target.classList);

    let id = event.target.getAttribute("update-id");
    if(id){
        header.textContent = "Update Image details";
        okButton.addEventListener("click", updateImage);
        renderDataToForm(customImage);
    }else{
        header.textContent = "Add Image";
        okButton.addEventListener("click", addImage);
    }

    cancelButton.addEventListener("click", hideModal);
}

function renderDataToForm(customImage){
    const nameInput = document.getElementById("img_name");
    const urlInput = document.getElementById("img_url");
    const infoInput = document.getElementById("img_info");
    const dateInput = document.getElementById("img_date");
    const okButton = document.querySelector(".ok-button");

    nameInput.value = customImage.name;
    urlInput.value = customImage.url;
    infoInput.textContent = customImage.information;
    dateInput.value = customImage.uploadedDate;
    okButton.setAttribute("update-id", customImage.id);
}

function validateImageData(event){
    const nameInput = document.getElementById("img_name");
    const urlInput = document.getElementById("img_url");
    const infoInput = document.getElementById("img_info");
    const dateInput = document.getElementById("img_date");

    clearErrorMessage();

    let errorMessage = "";
    if(nameInput.validity.valueMissing){
        errorMessage = "Please enter name of image";
    }else if(nameInput.validity.tooShort){
        errorMessage = "Name should be atleast "+ nameInput.minLength + " characters";
    }else if(nameInput.validity.tooLong){
        errorMessage = "Name should not exeed " +  nameInput.maxLength + " characters";;
    }
    processErrorMessage(nameInput, errorMessage, event);

    if(errorMessage === ""){
        if(urlInput.validity.valueMissing){
            errorMessage = "Please enter an url";
        }else if(!urlInput.validity.valid){
            errorMessage = "Invalid url";
        }
        processErrorMessage(urlInput, errorMessage, event);
    }

    if(errorMessage === ""){
        if(infoInput.validity.valueMissing){
            errorMessage = "Please enter image information";
        }else if(infoInput.validity.tooShort){
            errorMessage = "Information should be atleast "+ infoInput.minLength + " characters";
        }else if(infoInput.validity.tooLong){
            errorMessage = "Information should not exeed " +  infoInput.maxLength + " characters";;
        }
        processErrorMessage(infoInput, errorMessage, event);
    }

    if(errorMessage === ""){
        console.log("Date:"+dateInput.value);
        if(dateInput.validity.valueMissing){
            errorMessage = "Please enter a date";
        }else if(!dateInput.validity.valid){
            errorMessage = "Invalid date";
        }else{
            if( new Date(dateInput.value).getTime() > Date.now() ){
                errorMessage = "Future date is not allowed";
            }
        }
        processErrorMessage(dateInput, errorMessage, event);
    }

    if(errorMessage === ""){
        return true;
    }
    return false;
}

function updateImage(event){
    const nameInput = document.getElementById("img_name");
    const urlInput = document.getElementById("img_url");
    const infoInput = document.getElementById("img_info");
    const dateInput = document.getElementById("img_date");
    const okButton = document.querySelector("ok-button");
    let isValid = validateImageData(event);

    if(isValid){
        let id = event.target.getAttribute("update-id");
        if( !id ){
            alert("Update failed due to internal error!!");
            return;
        }
        let newCustomImage = new CustomImage(id, nameInput.value, urlInput.value, infoInput.value, dateInput.value);
        let dataInJSON = JSON.stringify(newCustomImage);
        let currentURL = base_url + "/" + id;
        fetch(currentURL, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
              },
            body: dataInJSON
        })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert("Image details are updated!!");
            hideModal(event);
            getJSON(event);
        })
        .catch(error => {
            console.log("Update failed with error:" + error);
            alert("Update failed!!");
        });
    }
}

function addImage(event){
    const nameInput = document.getElementById("img_name");
    const urlInput = document.getElementById("img_url");
    const infoInput = document.getElementById("img_info");
    const dateInput = document.getElementById("img_date");
    let isValid = validateImageData(event);

    if(isValid){
        let newCustomImage = new CustomImage(0, nameInput.value, urlInput.value, infoInput.value, dateInput.value);
        let dataInJSON = JSON.stringify(newCustomImage);
        fetch(base_url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: dataInJSON
        })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert("Image is added!!");
            hideModal(event);
            getJSON(event);
        })
        .catch(error => {
            console.log("Insert failed with error:" + error);
            alert("Insert failed!!");
        });
    }
}

function processErrorMessage(element, message, event){
    if( message !== ""){
        element.setCustomValidity(message);
        element.reportValidity();
        console.log("Error: " + message);
    }
}

function clearErrorMessage(){
    const formElements = document.forms["image-form"].elements;
    for( const element of formElements){
        if(element.willValidate){
            element.setCustomValidity("");
        }
    }
}

function hideModal(event){
    let modalContainer = document.querySelector(".modal-container");
    modalContainer.style.pointerEvents = "none";
    modalContainer.style.opacity = 0;
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", (event) =>  {
    getJSON(event);
    renderAddButton(event);
});
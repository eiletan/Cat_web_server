var messagetimeout = 10000;


function reroll() {
    let xmlhttp = new XMLHttpRequest();
    let url = "/newcat";
    xmlhttp.open("GET", url);
    xmlhttp.responseType = "json";
    xmlhttp.send();

    xmlhttp.onload = function () {
        if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 200) {
            let cat = xmlhttp.response["result"];

            cat["image"] = cat["image"].substring(1);
            cat["image"] = cat["image"].replace("public","");

            document.getElementsByClassName("cat-container-namespan")[0].innerHTML = cat["name"];
            document.getElementsByClassName("cat-container-description")[0].innerHTML = cat["description"];
            document.getElementById("cat-image").src = cat["image"];
        } else if (xmlhttp.status === 500) {
            displayError(document.getElementsByClassName("titlecard")[0],"The cat database could not be refreshed at this time, please try again.");
        }
    }
}

function refresh(num = 2) {
    let message = document.getElementsByClassName("titlecard")[0]; 
    let xmlhttp = new XMLHttpRequest();
    let actualnum;
    if (typeof num !== "number" || isNaN(num)) {
        actualnum = 2;
    } else {
        actualnum = num;
    }
    let url = "/replace/" + actualnum.toString();
    xmlhttp.open("PUT",url);
    xmlhttp.send();

    xmlhttp.onload = function () {
        if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 201) {
            message.innerHTML = "The cat database has been refreshed successfully!"
            message.style.display = "block";

            setTimeout(function() {
                message.style.display = "none";
            },messagetimeout);
        } else if (xmlhttp.status === 501) {
            displayError(message,"The cat database could not be refreshed at this time. Please try again");
        }
    }
}

function displayError(element, message) {
    element.innerHTML = message;

    setTimeout(function() {
        element.style.display = "none";
    },messagetimeout);
}



function reroll() {
    let xmlhttp = new XMLHttpRequest();
    let url = "localhost:8080/newcat";
    xmlhttp.open("GET",url);
    xmlhttp.responseType = "json";
    xmlhttp.send();

    xmlhttp.onload = function() {
        if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 200) {
            let cat = xmlhttp.response;
            document.getElementsByClassName("cat-container-namespan")[0].innerHTML = cat["name"];
            document.getElementsByClassName("cat-container-description")[0].innerHTML = cat["description"];
            // document.getElementById("cat-image").src = cat["image"];
        } else if (xmlhttp.status === 500){
            alert("Cat reroll could not be completed at this time. Please try again or refresh the cat database");
        }
    }
}
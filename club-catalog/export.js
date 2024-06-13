// export function loadCatalog(){
//     const request = new XMLHttpRequest();
//     // request.onload = function() {
//     // }
//     request.open("POST", "http://127.0.0.1:8081");
//     const object = {request: "loadCatalog"}
//     request.send(JSON.stringify(object));
// }

export function loadCatalog(){
    const request = new XMLHttpRequest();
    
    // Handle the response from the server
    request.onload = function() {
        if (request.status >= 200 && request.status < 300) {
            // Parse the response JSON and handle it
            const response = JSON.parse(request.responseText);
            console.log(response);
            // You can update the DOM or perform other actions with the response data here
            const box = document.createElement("p");
            box.textContent = this.responseText;
            box.style.height = "min-content";
            document.querySelector("#catalog").append(box)
        } else {
            console.error('Request failed with status:', request.status);
        }
    };

    // Handle any errors that occur
    request.onerror = function() {
        console.error('Request failed due to a network error');
    };

    request.open("POST", "http://127.0.0.1:8081");
    request.setRequestHeader("Content-Type", "application/json"); // Set the content type header
    const object = {request: "loadCatalog"};
    request.send(JSON.stringify(object));
}

export function example(){
    const request = new XMLHttpRequest();
    request.onload = function() {
    }
    request.open("POST", "http://127.0.0.1:8081");
    const object = {request: "example"}
    request.send(JSON.stringify(object));
}
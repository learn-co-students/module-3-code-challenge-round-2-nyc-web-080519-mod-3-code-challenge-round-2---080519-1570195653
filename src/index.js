const beerList = document.querySelector("#list-group")
const beerDetail = document.querySelector("#beer-detail")
//query selected my list. did not use getElement as it gives an HTML collection which can not be iterated
//over with forEach
fetch("http://localhost:3000/beers")
.then(resp => resp.json())
.then(function(data){
    //retrieved my data, now iterating over
    data.forEach(function(beer){
        //saving my new HTML as a complete string saved to a variable in BACKTICKS to interpolate name from data
        const str = 
        `
        <li class="list-group-item" id=${beer.id} data-id="beer-list-item">${beer.name}</li>
        `
        //appending to the DOM within the ul already provided passing in the str variable I created
        beerList.insertAdjacentHTML("afterbegin", str)
    })

beerList.addEventListener("click", function(event){
    //new event listener with a CLICK function within first fetch so we can persist beer data (name, description, etc)
    if(event.target.dataset.id === "beer-list-item"){
    fetch(`http://localhost:3000/beers/${event.target.id}`)
        //setting a fetch with a URL with interpolated ID 
    .then(resp => resp.json())
    .then(function(beer){
        const string = 
        `
        <h1>${beer.name}</h1>
            <img src=${beer.image_url}>
            <h3>${beer.tagline}</h3>
            <textarea id="desc-input">${beer.description}</textarea>
        <button id=${beer.id} class="btn btn-info" data-id="save">Save</button>
        `
        //all info is here from the JSON object from the GET fetch so I can interpolate in the string
        beerDetail.innerHTML = ""
        beerDetail.insertAdjacentHTML("afterbegin", string)
        const beerButton = beerDetail.querySelector(".btn.btn-info")
        //had to find out how to query a class with 2 classes (you list both by saying . to signify class in a row "chained")
            beerButton.addEventListener("click", function(event){
                if(event.target.tagName === "BUTTON") {
                    //found from the tag name AFTER this was appended to the DOM
                    //this is not here when the page loads, so it had to be saved when appropriate after the beerDetail was fetched
                    let newText = event.target.closest("#beer-detail").querySelector("#desc-input")
                    let newDescription = newText.value
                    //originally had it set as newText.innerText, but really we wanted the value
                    fetch(`http://localhost:3000/beers/${event.target.id}`, {
                        method: "PATCH",
                        //setting a PATCH request with interpolated id
                        headers:   {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({description: newDescription})
                        //JSON data is a series of keys and associated values
                        //I'm updating the new value of the description key for the object here to pass through the body
                    })// fetch
                    .then(resp => resp.json())
                    .then(function(text){
                        newText = newDescription
                        //thsi saves the new text (which is just the text area) with the new description (new input's VALUE)
                    })
                }

            })


        })

    }

// const beerButton = beerDetail.querySelector(".btn.btn-info")
// console.log(beerButton)



})//end of beerList EL


})// end of get fetch
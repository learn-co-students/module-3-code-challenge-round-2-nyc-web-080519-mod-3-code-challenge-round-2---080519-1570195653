//Global variables

let beerList;
let beerDetails;
let newDescription

//Initial fetch of beer data
fetch('http://localhost:3000/beers')
.then(function(response){
    let beers = response.json()
    return beers
})
.then(function(beers){
    beerList = document.querySelector('ul#list-group')
    beers.forEach(beer => {
        beerList.insertAdjacentHTML('beforeend', `<li class="list-group-item" data-type='beer' data-id=${beer.id}>${beer.name}</li>`) 
    });
})

//Event delegation for document
document.addEventListener('click', function(e){
    //If I click on a beer - send a get request to that beers "showpage" to retrieve
    //info/details about the beer - use those details to create a beer card
    if (e.target.dataset.type === 'beer'){
        fetch(`http://localhost:3000/beers/${e.target.dataset.id}`)
        .then(function(response){
            let beer = response.json()
            return beer
        })
        .then(function(beer){
            beerDetails = document.querySelector('div#beer-detail')
            beerDetails.innerHTML = 
            `<h1>${beer.name}</h1>
            <img src=${beer.image_url}>
             <h3>${beer.tagline}</h3>
            <textarea data-id=${beer.id}>${beer.description}</textarea>
            <button data-id=${beer.id} data-action='edit-beer' id="edit-beer" class="btn btn-info">
                Save
                </button>`
        })
    }
    //If I click on the edit button - capture the value of the text area
    //Use that value to update the description of that specific beer
    else if(e.target.dataset.action === 'edit-beer'){
        newDescription = document.querySelector(`textarea[data-id="${e.target.dataset.id}"]`)
        
        fetch(`http://localhost:3000/beers/${e.target.dataset.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            body: JSON.stringify({
                description: newDescription.value
            })
            
        })
        .then(function(response){
            if (response.status === 200){
                alert('Successfully saved')
            }
            else {
                alert('Something went wrong')
            }
        })
        
    }
})
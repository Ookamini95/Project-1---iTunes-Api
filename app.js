// Queries
const testBtn = document.querySelector(".test");
const quitBtn = document.querySelector(".quit__focus");
const itemFocus = document.querySelector(".item__focus_box");
const searchBox = document.querySelector(".search__box");
const inputForm = document.querySelector(".search__form");
const collectionBox = document.querySelector(".collection__box");

// Templates


// Functions
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// let temp;
// getData().then(data => {
//     temp = data
//     console.log(data);
//     console.log(temp);
// });

function search([name, type, num]) {

    const url = `https://itunes.apple.com/search?limit=${num}&media=${type.toLowerCase()}&term=${name}`
    getData(url).then(dataObj => {
        console.log(dataObj);
        showCollection(dataObj)
    })
    // console.log(data, data[0].artistName, data[0].artworkUrl100, data[0].trackCensoredName
}

function showCollection(data) {
    collectionBox.innerHTML = ``;
    data.forEach(el => {
        let html = `
        <div class="item">
            <img src="${el.artworkUrl100}" class="img__item">
            <br>
            <p>${el.artistName}</p>
            <p>${el.trackCensoredName}</p>
        </div>
        `
        collectionBox.insertAdjacentHTML(`beforeend`, html);
    });

}

//// Helper functions
function toggleFocus() {
    itemFocus.classList.toggle("hidden");
    searchBox.classList.toggle("hidden");
}

// Event Listeners
////  Focus box
testBtn.addEventListener("click", toggleFocus);
quitBtn.addEventListener("click", toggleFocus);
document.addEventListener("keydown", event => {
    if (event.key === `Escape` && !itemFocus.classList.contains("hidden")) toggleFocus();
})

////  Search bar misc
inputForm.addEventListener(`submit`, event => {
    event.preventDefault();
    const queryInput = [...event.target].map(key => key.value);
    // console.log(queryInput);
    search(queryInput);
    event.target[0].value = ``;
})

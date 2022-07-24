// Queries
const testBtn = document.querySelector(".test");
const quitBtn = document.querySelector(".quit__focus");
const itemFocus = document.querySelector(".item__focus_box");
const searchBox = document.querySelector(".search__box");
const inputForm = document.querySelector(".search__form")

// Functions
async function getData() {
    const response = await fetch(`https://itunes.apple.com/search?limit=5&media=music&term=disturbed`);
    const data = await response.json();
    console.log(response);
    console.log(data);
}

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

    console.log(event.target[0].value);
    event.target[0].value = ``;
})

// Queries
const testBtn = document.querySelector('.test')
const itemFocus = document.querySelector('.item__focus_box')
const searchBox = document.querySelector('.search__box')
const inputForm = document.querySelector('.search__form')
const collectionBox = document.querySelector('.collection__box')
const focusBox = document.querySelector('.item__focus_box')

// Variables
let dataArray = []

// Functions
async function getData (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    dataArray = data.results
    // console.log(dataArray);
    return data.results
  }
  // Non sono sicuro se va bene così
  catch (err) {
    console.log('error fetching data')
    return new Error(err)
  }
}

function search ([name, type, num]) {
  const url = `https://itunes.apple.com/search?limit=${num}&media=${type.toLowerCase()}&term=${name}`
  getData(url)
    .then(dataObj => {
      // console.log(dataObj);
      showCollection(dataObj)
      return dataObj
    })
    .catch(err => console.error(err))

  // console.log(data, data[0].artistName, data[0].artworkUrl100, data[0].trackCensoredName
}

function showCollection (data) {
  collectionBox.innerHTML = ''
  let index = 0
  data.forEach(el => {
    const html = `
        <div class="item" data-index="${index}">
            <img src="${el.artworkUrl100}" class="img__item">
            <br>
            <p><strong>${el.artistName.slice(0, 30)}</strong></p>
            <p>${el.trackCensoredName}</p>
        </div>
        `
    index++
    collectionBox.insertAdjacentHTML('beforeend', html)
  })
}

// TODO: Focus box implementation
function loadOnFocus (data) {
  console.log(data)
  console.log(data.previewUrl)
  const html = `<audio src="${data.previewUrl}" controls></audio>`
  focusBox.insertAdjacentHTML('beforeend', html)
}

/// / Helper functions
function toggleFocus () {
  itemFocus.classList.toggle('hidden')
  searchBox.classList.toggle('hidden')
}

// Event Listeners
/// /  Focus box
/// // Misc
testBtn.addEventListener('click', toggleFocus) // TEST
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !itemFocus.classList.contains('hidden')) toggleFocus()
})

/// // Show focus
collectionBox.addEventListener('click', event => {
  const item = event.target.closest('.item')
  const index = item.dataset.index
  console.log(dataArray)
  loadOnFocus(dataArray[index]) // WORKING!!
  toggleFocus()
  // console.log(dataArray[index])
})

/// /  Search bar
inputForm.addEventListener('submit', event => {
  event.preventDefault()
  const queryInput = [...event.target].map(key => key.value)
  // console.log(queryInput);
  search(queryInput)
  event.target[0].value = ''
})

// Additional TODOs
// TODO: hover on text
// TODO: fail to fetch => print
// TODO: stop music when toggle

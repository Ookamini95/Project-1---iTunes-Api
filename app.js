// Queries
const quitBtn = document.querySelector('.quit_btn')
const itemFocus = document.querySelector('.item__focus_box')
const searchBox = document.querySelector('.search__box')
const inputForm = document.querySelector('.search__form')
const collectionBox = document.querySelector('.collection__box')
const focusBox = document.querySelector('.element__focus_box')
const moreResBtn = document.querySelector('.more-results')
const orderResBtn = document.querySelector('.order-results')

const filterForm = document.querySelector('.filter-form')

const loadingQuery = document.querySelector('.loading')
const errorQuery = document.querySelector('.error')

// Variables
let dataArray = []

let queryInfo = []
let offsetValue = 0
// test
// Functions
async function getData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    data.results.forEach((item) => dataArray.push(item))
    //console.log(data)
    if (data.results === undefined || !data.results[0]) throw new Error('No item found')
    return data.results
  } catch (err) {
    errorQuery.classList.toggle('hidden')
    console.error(err)
    throw err
  }
}

//fixed
function search([query, _, type, num], offset = 0, index = 0) {
  const url = `https://itunes.apple.com/search?limit=${num}&media=${type.toLowerCase()}&term=${query}&offset=${offset}`
  getData(url)
    .then(dataObj => {
      // console.log(dataObj);
      showCollection(dataObj, index)
      return dataObj
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => loadingQuery.classList.toggle('hidden'))
  // .catch(err => console.error(err))

  // console.log(data, data[0].artistName, data[0].artworkUrl100, data[0].trackCensoredName
}

function addMoreQueries() {
  offsetValue += 5
  loadingQuery.classList.toggle('hidden')
  const index = dataArray.length
  search(queryInfo, offsetValue, index)
}

function dateCompare(a, b) {
  const date_a = a.dataset.date.split('-')
  const date_b = b.dataset.date.split('-')

  for (let i = 0; i < 3; i++) {
    const diff = date_a[i] - date_b[i]
    if (diff !== 0) return diff > 0 ? -1 : 1
  }
  return 0
}

function orderResults() {
  let collectionArray = [...collectionBox.children].sort(dateCompare)
  console.log(collectionArray)
  collectionArray.forEach(item => collectionBox.appendChild(item))
}
function filterSongs(value) {
  console.log(value)
  let collectionArray = [...collectionBox.children].filter(el => Number(el.dataset.date.split('-')[0]) === Number(value))
  console.log(collectionArray)
  // Number(el.dataset.date.split('-')[0]) === value
  console.log(collectionArray)
  collectionBox.innerHTML = ''
  collectionArray.forEach(item => collectionBox.appendChild(item))
}

function showCollection(data, index) {
  data.forEach(el => {
    const html = `
        <div class="item" data-index="${index}" data-date=${el.releaseDate.split('T')[0]}>
            <img src="${el.artworkUrl100}" alt="artwork img" class="img__item">
            <br>
            <p><strong>${el.artistName.slice(0, 24)}</strong></p>
            <p>${el.trackCensoredName}</p>
        </div>
        `

    index++
    collectionBox.insertAdjacentHTML('beforeend', html)
  })
}

// TODO: Focus box implementation
function loadOnFocus(data) {
  focusBox.innerHTML = ''
  console.log(data)
  const html = `
  <table>
      <tr>
          <td>
              <img src="${data.artworkUrl100}" alt="artwork img" class="img__item img__focus">
          </td>
      </tr>

      <tr>
          <td>
              <p class="element__entry">Artist:</p>
          </td>
          <td>
              <input type="text" value="${data.artistName}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Title:</p>
          </td>
          <td>
              <input type="text" value="${data.trackName}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Genre:</p>
          </td>
          <td>
              <input type="text" value="${data.primaryGenreName}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Release Date:</p>
          </td>
          <td>
              <input type="text" value="${data.releaseDate.split('T')[0]}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Preview:</p>
          </td>
          <td>
              <audio src="${data.previewUrl}" class="audio_box" controls></audio>
              
          </td>
      </tr>
      <tr>
          <td></td>
          <td>
              <input type="text" value="${data.previewUrl}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Artwork Small (300x300):</p>
          </td>
          <td>
              <input type="text" value="${data.artworkUrl30}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Artwork Medium (600x600):</p>
          </td>
          <td>
              <input type="text" value="${data.artworkUrl60}" class="element__entry_value" readonly>
          </td>
      </tr>
      <tr>
          <td>
              <p class="element__entry">Artwork Large (1000x1000):</p>
          </td>
          <td>
              <input type="text" value="${data.artworkUrl100}" class="element__entry_value" readonly>
          </td>
      </tr>
    </table>
  
  `
  focusBox.insertAdjacentHTML('beforeend', html)
}

/// / Helper functions
function toggleFocus() {
  itemFocus.classList.toggle('hidden')
  // searchBox.classList.toggle('hidden')
  quitBtn.classList.toggle('hidden')
}

// Event Listeners
/// /  Focus box
/// // Misc

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !itemFocus.classList.contains('hidden')) {
    const audio = document.querySelector?.('.audio_box')
    toggleFocus()
    audio.src = ''
  }
})

quitBtn.addEventListener('click', () => {
  const audio = document.querySelector?.('.audio_box')
  toggleFocus()
  audio.src = ''
})

/// // Show focus
collectionBox.addEventListener('click', event => {
  const item = event.target.closest('.item')
  const index = item.dataset.index
  loadOnFocus(dataArray[index])
  toggleFocus()
})

/// /  Search bar
inputForm.addEventListener('submit', event => {
  event.preventDefault()
  if (!event.target[0].value.trim()) {
    event.target[0].value = ''
    return
  }
  // Reset
  offsetValue = 0
  dataArray = []
  collectionBox.innerHTML = ''
  // ClassList
  moreResBtn.classList.remove('hidden')
  orderResBtn.classList.remove('hidden')
  filterForm.classList.remove('hidden')
  errorQuery.classList.add('hidden')
  loadingQuery.classList.toggle('hidden')
  const queryInput = [...event.target].map(key => key.value)
  // console.log(queryInput)
  queryInfo = queryInput
  search(queryInput)
  event.target[0].value = ''
})

filterForm.addEventListener('submit', (e) => {
  e.preventDefault()
  filterSongs(e.target[0].value)
})

moreResBtn.addEventListener('click', addMoreQueries)
orderResBtn.addEventListener('click', orderResults)

// TODOs
// TODO: hover on text

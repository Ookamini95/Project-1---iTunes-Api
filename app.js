// Queries
const quitBtn = document.querySelector('.quit_btn')
const itemFocus = document.querySelector('.item__focus_box')
const searchBox = document.querySelector('.search__box')
const inputForm = document.querySelector('.search__form')
const collectionBox = document.querySelector('.collection__box')
const focusBox = document.querySelector('.element__focus_box')

const loadingQuery = document.querySelector('.loading')
const errorQuery = document.querySelector('.error')

// Variables
let dataArray = []

// Functions
async function getData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    dataArray = data.results
    console.log(!Boolean(data.results))
    if (data.results === undefined || !data.results[0]) throw new Error('No item found')
    return data.results
  } catch (err) {
    errorQuery.classList.toggle('hidden')
    console.error(err)
    throw err
  }
}

//fixed
function search([name, _, type, num]) {
  const url = `https://itunes.apple.com/search?limit=${num}&media=${type.toLowerCase()}&term=${name}`
  getData(url)
    .then(dataObj => {
      // console.log(dataObj);
      showCollection(dataObj)
      return dataObj
    })
    .catch(err => console.log(`Error: ${err.message}`))
    .finally(() => loadingQuery.classList.toggle('hidden'))
  // .catch(err => console.error(err))

  // console.log(data, data[0].artistName, data[0].artworkUrl100, data[0].trackCensoredName
}

function showCollection(data) {
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
function loadOnFocus(data) {
  focusBox.innerHTML = ''
  console.log(data)
  const html = `
  <table>
      <tr>
          <td>
              <img src="${data.artworkUrl100}" class="img__item img__focus">
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
  collectionBox.innerHTML = ''
  errorQuery.classList.add('hidden')
  loadingQuery.classList.toggle('hidden')
  const queryInput = [...event.target].map(key => key.value)
  // console.log(queryInput)
  search(queryInput)
  event.target[0].value = ''
})

// TODOs
// TODO: hover on text

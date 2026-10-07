export function createMenu(onStart) {
  const menu = document.createElement('section')

  menu.id = 'start-menu'

  menu.innerHTML = `
    <div class="menu-atmosphere"></div>

    <div class="menu-grid"></div>

    <div class="menu-content">

      <div class="menu-system">
        KISPAT DREAMS INTERACTIVE
      </div>

      <div class="menu-title">
        <div class="title-main">TETRIS</div>
        <div class="title-sub">DEADSPACE</div>
      </div>

      <div class="menu-line"></div>

      <p class="menu-subtitle">
        A SYSTEM WITHOUT PURPOSE
        <br>
        STILL BUILDS
      </p>

      <div class="menu-options">

        <button class="menu-button primary" id="start-button">
          START
        </button>

        <button class="menu-button" id="options-button">
          OPTIONS
        </button>

        <button class="menu-button" id="exit-button">
          EXIT
        </button>

      </div>

      <div class="menu-status">

        <span>SYSTEM // ACTIVE</span>

        <span>BUILD 01</span>

      </div>

    </div>
  `

  const startButton =
    menu.querySelector('#start-button')

  startButton.addEventListener('click', () => {
    menu.classList.add('menu-exit')

    setTimeout(() => {
      menu.remove()
      onStart()
    }, 500)
  })

  const optionsButton =
    menu.querySelector('#options-button')

  optionsButton.addEventListener('click', () => {
    menu.classList.toggle('show-options')
  })

  const exitButton =
    menu.querySelector('#exit-button')

  exitButton.addEventListener('click', () => {
    document.body.innerHTML = `
      <div class="deadspace-terminated">
        SYSTEM TERMINATED
      </div>
    `
  })

  document
    .querySelector('#app')
    .appendChild(menu)

  return menu
}
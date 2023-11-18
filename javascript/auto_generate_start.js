onUiLoaded(() => {
  const DEBOUNCE_TIME = 1000

  let debounceTimer
  const debounce = (callback) => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(callback, DEBOUNCE_TIME)
  }

  const createCheckbox = (id, text) => {
    const _checkbox = gradioApp().querySelector('input[type="checkbox"]')
    const checkbox = _checkbox.cloneNode(true)
    checkbox.id = id
    const checkboxText = _checkbox.nextElementSibling.cloneNode(true)
    checkboxText.innerText = text

    const checkboxContainer = _checkbox.parentElement.cloneNode()
    checkboxContainer.appendChild(checkbox)
    checkboxContainer.appendChild(checkboxText)

    return checkboxContainer
  }

  const tabs = ['txt2img', 'img2img']
  tabs.forEach((tab) => {
    const checkbox = createCheckbox(`${tab}_auto_generate_start`, 'Auto Generate Start')
    gradioApp().getElementById(`${tab}_generate_box`).before(checkbox)

    const promptTextarea = gradioApp().querySelector(`#${tab}_prompt textarea`)
    const negativePromptTextarea = gradioApp().querySelector(`#${tab}_neg_prompt textarea`)
    const generateButton = gradioApp().querySelector(`#${tab}_generate`)

    const textareas = [promptTextarea, negativePromptTextarea]
    textareas.forEach((textarea) => {
      let previousPrompt = ''

      textarea.addEventListener('input', () => {
        if (!gradioApp().querySelector(`#${tab}_auto_generate_start`).checked) return

        debounce(() => {
          const currentPrompt = textarea.value.trim()

          if (currentPrompt !== '' && currentPrompt !== previousPrompt) {
            previousPrompt = currentPrompt
            generateButton.click()
          }
        })
      })
    })
  })
})

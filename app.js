const inputElement = document.querySelector('#title')
const buttonElement = document.querySelector('#btn')
const listElement = document.querySelector('#list')
const textErrorElement = document.querySelector('#text-error')

let array = []

// Проверяем есть ли сохраненные данные в localstorage
if (localStorage.getItem('array')) {
    array = JSON.parse(localStorage.getItem('array'))
}

function render() {
    listElement.innerHTML = ''
    textErrorElement.innerHTML = ''
    
    if (array.length === 0) {
        listElement.innerHTML = `<p>Нет ни одной задачи</p>`
    }
    
    for (let i = 0; i < array.length; i++) {
        listElement.insertAdjacentHTML('beforeend', getNotTemplate(array[i], i))
    }
}

render()

function checkArrayEmpty() {
    if (array.length === 0) {
        listElement.innerHTML = ''
    }
}

buttonElement.addEventListener('click', function() {
    let date = new Date().toISOString().slice(0,10).split('-').reverse().join('.')
    let time = new Date().toLocaleTimeString()
    
    if (inputElement.value.match(/^\s*$/)) {
        inputElement.focus()
        textErrorElement.innerHTML = `<p class="text-red">Ошибка! Поле не может быть пустым!</p>`
        
        checkArrayEmpty()
        return
    }
    if (inputElement.value.match(/["№;%:?*()_\-+=\/.,`!@#$^&|]/)) {
        inputElement.focus()
        textErrorElement.innerHTML = `
            <p class="text-red">Ошибка! Поле содержит запрещенные символы!</p>
            <p class="text-red">Разрешены только буквы и цифры</p>`
        
        checkArrayEmpty()
        return
    }
    
    const newItem = {
        title: inputElement.value,
        completed: false,
        date: date,
        time: time,
    }
    
    array.push(newItem)
    render()
    inputElement.value = ''
    inputElement.focus()
    
    localStorage.setItem('array', JSON.stringify(array))
})

listElement.addEventListener('click', function(e) {
    if (e.target.dataset.index) {
        const index = parseInt(e.target.dataset.index)
        const type = e.target.dataset.type
        
        if (type === 'toggle') {
            array[index].completed = !array[index].completed
        } else if (type === 'remove') {
            array.splice(index, 1)
            inputElement.focus()
        }
        
        localStorage.setItem('array', JSON.stringify(array))
        render()
    } 
})



function getNotTemplate(note, index, date, time) {
    return `
        <li
          class="list-group-item d-flex justify-content-between align-items-center ${note.completed ? 'li-background' : ''}"
        >
          <span class="${note.completed ? 'text-done' : ''}">${note.title}</span>
          <span class="${note.completed ? 'text-done' : ''}">${note.date} ${note.time}</span>
          <span>
            <span class="btn btn-small btn--br btn-${note.completed ? 'warning' : 'success'}" data-index="${index}" data-type="toggle">&check;</span>
            <span class="btn btn-small btn-danger btn--br" data-index="${index}" data-type="remove">&times;</span>
          </span>
        </li>
    `
}

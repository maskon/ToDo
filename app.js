const inputElement = document.querySelector('#title')
const buttonElement = document.querySelector('#btn')
const listElement = document.querySelector('#list')
const textErrorElement = document.querySelector('#text-error')

let array = [] // Создаем массив

// Проверяем есть ли сохраненные данные в localstorage
if (localStorage.getItem('array')) {
    array = JSON.parse(localStorage.getItem('array'))
}

// Функция запускает цикл
function render() {
    listElement.innerHTML = '' // Очищаем список задач
    textErrorElement.innerHTML = '' // Очищаем поле с ошибками
    
    // Проверка, что массив не пустой
    if (array.length === 0) {
        listElement.innerHTML = `<p class="text-16">Нет ни одной задачи</p>`
    }
    
    // Цикл
    for (let i = 0; i < array.length; i++) {
        listElement.insertAdjacentHTML('beforeend', getNotTemplate(array[i], i))
    }
}

render() // Запускаем функцию

// Функция (если массив пустой)
function checkArrayEmpty() {
    if (array.length === 0) {
        listElement.innerHTML = '' // Очищаем список задач
    }
}

// Клик по кнопке
buttonElement.addEventListener('click', function() {
    let date = new Date().toISOString().slice(0,10).split('-').reverse().join('.') // Создаем дату
    let time = new Date().toLocaleTimeString() // Создаем время
    
    // Проверка если поле инпут не заполнено
    if (inputElement.value.match(/^\s*$/)) {
        inputElement.focus() // Фокус на поле инпут
        textErrorElement.innerHTML = `<p class="text-red">Ошибка! Поле не может быть пустым!</p>`
        
        checkArrayEmpty() // Запускаем функцию
        return // Выходим из функции
    }
    // Проверка поле инпут не содержит запрещеных символов
    if (inputElement.value.match(/[№;%*_\+=\/`!@#$^&|]/)) {
        inputElement.focus() // Фокус на поле инпут
        textErrorElement.innerHTML = `
            <p class="text-red">Ошибка! Поле содержит запрещенные символы!</p>`
        
        checkArrayEmpty() // Запускаем функцию
        return // Выходим из функции
    }
    
    // Проверка на введеное кол-во символов
    if (inputElement.value.length < 3) {
        textErrorElement.innerHTML = `<p class="text-red">Введите не менее 3-х символов!</p>`
        
        checkArrayEmpty() // Запускаем функцию
        inputElement.focus() // Фокус на поле инпут
        return // Выходим из функции
    }
    
    // Создаем объект
    const newItem = {
        title: inputElement.value,
        completed: false,
        date: date,
        time: time,
    }
    
    array.push(newItem) // Добавляем объект в массив
    render() // Запускаем функцию
    inputElement.value = '' // Очищаем поле инпут
    inputElement.focus() // Фокус на поле инпут
    
    localStorage.setItem('array', JSON.stringify(array)) // Записываем в localStorage
})

// Запускаем функцию по нажатию 'enter'
inputElement.addEventListener('keypress', function (e) {
    let key = e.which || e.keyCode
    if (key === 13) { // Код клавиши Enter
        buttonElement.click() // Запускаем функцию
    }
})

// Отслеживаем клик по кнопкам "выполнено" и "удалить"
listElement.addEventListener('click', function(e) {
    if (e.target.dataset.index) {
        const index = parseInt(e.target.dataset.index) // Получаем индекс кнопки
        const type = e.target.dataset.type // Получаем нужную кнопку ('toggle' || 'remove')
        
        if (type === 'toggle') {
            array[index].completed = !array[index].completed // Кнопка "выполнено"
        } else if (type === 'remove') {
            array.splice(index, 1) // Кнопка "удалить"
            inputElement.focus() // Фокус на поле инпут
        }
        
        localStorage.setItem('array', JSON.stringify(array)) // Записываем в localStorage
        render() // Запускаем функцию
    } 
})

// Функция создания html шаблона
function getNotTemplate(note, index, date, time) {
    return `
        <li
          class="list-group-item d-flex justify-content-between align-items-center ${note.completed ? 'li-background' : ''}"
        >
          <div>
            <p class="${note.completed ? 'text-done' : ''}">${index < 9 ? 0 : ''}${index + 1}. ${note.title}</p>
            <p class="${note.completed ? 'text-done' : ''} text--size">${note.date} ${note.time}</p>
          </div>
          <span>
            <span class="btn btn-small btn--br btn-${note.completed ? 'warning' : 'success'}" data-index="${index}" data-type="toggle">&check;</span>
            <span class="btn btn-small btn-danger btn--br" data-index="${index}" data-type="remove">&times;</span>
          </span>
        </li>

    `
}

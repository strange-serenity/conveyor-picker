document.addEventListener('DOMContentLoaded', function () {
    const monthPicker = document.getElementById('monthPicker');
    const yearPicker = document.getElementById('yearPicker');
    const calendarBody = document.querySelector('#calendar tbody');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const todayButton = document.getElementById('todayButton');

    // Инициализация годов
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 50; year <= currentYear + 50; year++) {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        yearPicker.appendChild(option);
    }

    // Установка начального значения даты
    let selectedDate = localStorage.getItem('selectedDate');
    if (selectedDate) {
        selectedDate = new Date(selectedDate);
        monthPicker.value = selectedDate.getMonth();
        yearPicker.value = selectedDate.getFullYear();
    } else {
        selectedDate = new Date(currentYear, new Date().getMonth(), new Date().getDate());
        monthPicker.value = selectedDate.getMonth();
        yearPicker.value = selectedDate.getFullYear();
    }

    monthPicker.addEventListener('change', () => {
        selectedDate.setMonth(monthPicker.value);
        updateCalendar();
    });

    yearPicker.addEventListener('change', () => {
        selectedDate.setFullYear(yearPicker.value);
        updateCalendar();
    });

    todayButton.addEventListener('click', () => {
        const today = new Date();
        selectedDate = today;
        monthPicker.value = today.getMonth();
        yearPicker.value = today.getFullYear();
        localStorage.setItem('selectedDate', selectedDate);
        updateCalendar();
        displaySelectedDate();
    });

    calendarBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD' && event.target.textContent !== '') {
            const day = event.target.textContent;
            selectedDate.setDate(day);
            localStorage.setItem('selectedDate', selectedDate);
            updateCalendar();
            displaySelectedDate();
        }
    });

    function updateCalendar() {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Очистка предыдущего содержимого таблицы
        calendarBody.innerHTML = '';

        let date = 1;
        for (let i = 0; i < 6; i++) { // Создание 6 строк (максимум)
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDayOfMonth) {
                    cell.textContent = '';
                } else if (date > daysInMonth) {
                    cell.textContent = '';
                } else {
                    cell.textContent = date.toString();
                    if (date === selectedDate.getDate() &&
                        month === selectedDate.getMonth() &&
                        year === selectedDate.getFullYear()) {
                        cell.classList.add('selected');
                    }
                    date++;
                }
                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    function displaySelectedDate() {
        selectedDateDisplay.textContent = 'Выбранная дата: ' + selectedDate.toLocaleDateString('ru-RU');
    }

    // Инициализация календаря и отображение выбранной даты при загрузке страницы
    updateCalendar();
    displaySelectedDate();
});

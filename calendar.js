document.addEventListener('DOMContentLoaded', function () {
    const monthPicker = document.getElementById('monthPicker');
    const yearPicker = document.getElementById('yearPicker');
    const calendarBody = document.querySelector('#calendar tbody');
    const todayButton = document.getElementById('todayButton');
    const statusBar = document.getElementById('statusBar');
    const buttonSmenaDay = document.getElementById('button-smena-day');
    const buttonSmenaNight = document.getElementById('button-smena-night');
    const buttonSmenaSutki = document.getElementById('button-smena-sutki');
    const buttonManual = document.getElementById('manual-button');
    const dateS = document.getElementById('datepicker-minusday');
    const timeS = document.getElementById('timeSelect-minusday');
    const datePo = document.getElementById('datepicker');
    const timePo = document.getElementById('timeSelect');
    const submitButton = document.getElementById('submitButton');

    function convertToUTCinUnix(dt) {
        const dtUTC = new Date(dt.toISOString())
        dtUTC.setHours(dtUTC.getHours() + 2)
        return dtUTC.getTime();
    }

    let d1 = "";
    let d2 = "";
    let t1 = "07:00";
    let t2 = "19:00";

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
    });

    calendarBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD' && event.target.textContent !== '') {
            const day = event.target.textContent;
            selectedDate.setDate(day);
            localStorage.setItem('selectedDate', selectedDate);
            updateCalendar();
        }
    });

    function updateFrameContent() {
        // Обновление StatusBar
        statusBar.textContent = `Выбран промежуток: ${d1} ${t1} - ${d2} ${t2}`;
    }

    buttonSmenaDay.addEventListener('click', (event) => {
        t1 = "07:00";
        t2 = "19:00";
        updateFrameContent();
    })

    buttonSmenaNight.addEventListener('click', (event) => {
        t1 = "19:00";
        t2 = "07:00";
        updateFrameContent();
    })

    buttonSmenaSutki.addEventListener('click', (event) => {
        t1 = "19:00";
        t2 = "19:00";
        updateFrameContent();
    })

    buttonManual.addEventListener('click', (event) => {
        d1 = dateS.value;
        d2 = datePo.value;
        t1 = timeS.value;
        t2 = timePo.value;

        updateFrameContent();
    })

    dateS.addEventListener('change', (event) => {
        d1 = dateS.value;
        updateFrameContent();
    })

    datePo.addEventListener('change', (event) => {
        d2 = datePo.value;
        updateFrameContent();
    })

    timeS.addEventListener('change', (event) => {
        t1 = timeS.value;
        updateFrameContent();
    })

    timePo.addEventListener('change', (event) => {
        t2 = timePo.value;
        updateFrameContent();
    })

    submitButton.addEventListener('click', (event) => {
        let dt1 = new Date(`${d1}T${t1}`);
        let dt2 = new Date(`${d2}T${t2}`);
        alert(dt1);
        const dt1Unix = convertToUTCinUnix(dt1);
        const dt2Unix = convertToUTCinUnix(dt2);
        statusBar.textContent =`Выбран промежуток: ${dt1Unix} - ${dt2Unix}`;
    })
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

        d1 = selectedDate.toLocaleDateString();

        // Преобразуем строку в объект даты
        let parts = d1.split(".");
        let dateObj = new Date(parts[2], parts[1] - 1, parts[0]);

        // Вычитаем один день
        dateObj.setDate(dateObj.getDate() - 1);

        // Преобразуем обратно в строку в нужном формате
        d1 = dateObj.getDate().toString().padStart(2, '0') + '.' +
            (dateObj.getMonth() + 1).toString().padStart(2, '0') + '.' +
            dateObj.getFullYear();

        d2 = selectedDate.toLocaleDateString();

        updateFrameContent();
    }

    // Инициализация календаря и отображение выбранной даты при загрузке страницы
    updateCalendar();

    let dateMinusDay = new Date();
    dateMinusDay.setDate(dateMinusDay.getDate() - 1);
    let datepickerMinusDay = document.getElementById("datepicker-minusday");
    datepickerMinusDay.valueAsDate = dateMinusDay;

    let datepickerCurrent = document.getElementById("datepicker");
    datepickerCurrent.valueAsDate = new Date();

    datepickerMinusDay.addEventListener('change', function () {
        const minusDayValue = datepickerMinusDay.value;
        if (minusDayValue) {
            datepickerCurrent.setAttribute('min', minusDayValue);
        } else {
            datepickerCurrent.removeAttribute('min');
        }
    });

    datepickerCurrent.addEventListener('change', function () {
        const datepickerValue = datepickerCurrent.value;
        if (datepickerValue) {
            datepickerMinusDay.setAttribute('max', datepickerValue);
        } else {
            datepickerMinusDay.removeAttribute('max');
        }
    });
});

import './bootstrap';
import $ from 'jquery';
window.$ = window.jQuery = $;

// scrollbar settings

const $content = $('#scrollable-content');
const $scrollbar = $('#custom-scrollbar');

if ($content.height()) {
    // Изменяем высоту скроллбара относительно контента
    const scrollbarHeight = $content.height() / $content[0].scrollHeight * $content.height();
    $scrollbar.height(scrollbarHeight);

    // Функция для обновления позиции скроллбара
    function updateScrollbarPosition() {
        const scrollPercentage = $content.scrollTop() / ($content[0].scrollHeight - $content.height());
        const scrollbarPosition = scrollPercentage * ($content.height() - $scrollbar.height());
        $scrollbar.css('top', scrollbarPosition + 16 + 'px');
    }

    // Обновляем позицию скроллбара при скролле контента
    $content.on('scroll', updateScrollbarPosition);

    // Обрабатываем скролл по кастомному скроллу
    $scrollbar.on('mousedown', function(e) {
        const startY = e.pageY;
        const startTop = $scrollbar.position().top;

        const onMouseMove = function(e) {
            const deltaY = e.pageY - startY;
            const newTop = Math.min($content.height() - $scrollbar.height(), Math.max(0, startTop + deltaY));
            $scrollbar.css('top', newTop + 16 + 'px');

            const scrollPercentage = newTop / ($content.height() - $scrollbar.height());
            $content.scrollTop(scrollPercentage * ($content[0].scrollHeight - $content.height()));
        };

        const onMouseUp = function() {
            $(document).off('mousemove', onMouseMove);
            $(document).off('mouseup', onMouseUp);
        };

        $(document).on('mousemove', onMouseMove);
        $(document).on('mouseup', onMouseUp);

        return false; // предотвращаем выделение текста при скролле
    });

    // Изначально обновляем позицию скроллбара
    updateScrollbarPosition();
}


//Switching between versions of the weather page

$('#version1-btn').on('click', function() {
    $('#version1').show();
    $('#version2').hide();
    $(this).addClass('bg-blue-500 text-white').removeClass('bg-gray-300 text-black');
    $('#version2-btn').addClass('bg-gray-300 text-black').removeClass('bg-blue-500 text-white');
});

$('#version2-btn').on('click', function() {
    $('#version1').hide();
    $('#version2').show();
    $(this).addClass('bg-blue-500 text-white').removeClass('bg-gray-300 text-black');
    $('#version1-btn').addClass('bg-gray-300 text-black').removeClass('bg-blue-500 text-white');
});


//Switching between versions of the agroplan page
$('#calendar-view').on('click', function() {
    $('#calendar').removeClass('hidden');
    $('#gantt').addClass('hidden');
    $(this).addClass('bg-blue-500').removeClass('bg-gray-500');
    $('#gantt-view').addClass('bg-gray-500').removeClass('bg-blue-500');
});

$('#gantt-view').on('click', function() {
    $('#gantt').removeClass('hidden');
    $('#calendar').addClass('hidden');
    $(this).addClass('bg-blue-500').removeClass('bg-gray-500');
    $('#calendar-view').addClass('bg-gray-500').removeClass('bg-blue-500');
});


// Calendar view

let currentDate = new Date();

function renderCalendar(year, month) {
    $.ajax({
        url: `/calendar-data/${year}/${month}`,
        method: 'GET',
        success: function(response) {
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let firstDayOfMonth = new Date(year, month, 1).getDay();
            let calendarHtml = '';

            for (let i = 1; i < (firstDayOfMonth || 7); i++) {
                calendarHtml += '<div></div>';
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = `${day < 10 ? '0' + day : day}.${month + 1 < 10 ? '0' + (month + 1) : (month + 1)}.${year}`;
                const dayEvents = response.events.filter(event => isDateInRange(date, event.start_date, event.end_date));
                const dayTasks = response.tasks.filter(task => isDateInRange(date, task.start_date, task.end_date));

                calendarHtml += `
                    <div class="p-2 bg-white border rounded-md hover:bg-gray-100 cursor-pointer calendar-day" data-date="${date}">
                        ${date}<br>${dayEvents.length} события<br>${dayTasks.length} план
                    </div>
                `;
            }

            $('#calendar-grid').html(calendarHtml);
            $('#current-month').text(`${year} ${month + 1}`);

            function isDateInRange(date, startDate, endDate) {
                const arrayDate = date.split('.');
                const usefulDate = new Date(parseInt(arrayDate[2]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[0]));
                const lastDate = usefulDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const lastStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const lastEndDate = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                return lastDate >= lastStartDate && lastDate <= lastEndDate;
            }
        }
    });
}

$('#prev-month').on('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

$('#next-month').on('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

renderCalendar(currentDate.getFullYear(), currentDate.getMonth());


// Main-modal

// Open main-modal
$('#calendar').on('click', '.calendar-day', function() {
    let date = $(this).data('date');
    $('#modal-date').text(date);
    loadModalData(date);
    $('#modal').removeClass('hidden');
});

// Close main-modal
$('#modal').on('click', function(event) {
    if ($(event.target).is('#modal')) {
        closeModal('#modal');
    }
});

function closeModal(modal) {
    $(modal).addClass('hidden');
}

function loadModalData(date) {
    $.ajax({
        url: '/get-day-data',
        method: 'GET',
        data: { start_date: date },
        success: function(response) {
            let events = response.events;
            let tasks = response.tasks;

            $('#event-list').empty();
            $('#task-list').empty();

            events.forEach(event => {
                $('#event-list').append(`
                    <li>
                        ${event.name}
                        <button class="set-range" data-id="${event.id}" data-type="event">Диапазон</button>
                        <button class="delete-event" data-id="${event.id}">Удалить</button>
                    </li>
                `);
            });

            tasks.forEach(task => {
                $('#task-list').append(`
                    <li>
                        ${task.name}
                        <button class="set-range" data-id="${task.id}" data-type="task">Диапазон</button>
                        <button class="delete-task" data-id="${task.id}">Удалить</button>
                    </li>
                `);
            });
        }
    });
}

$('#add-event').on('click', function() {
    let eventName = prompt("Введите название события:");
    if (eventName) {
        $.ajax({
            url: '/add-event',
            method: 'POST',
            data: {
                name: eventName,
                start_date: $('#modal-date').text(),
                end_date: $('#modal-date').text(),
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadModalData($('#modal-date').text());
                renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            }
        });
    }
});

// Delete event
$(document).on('click', '.delete-event', function() {
    let eventId = $(this).data('id');
    $.ajax({
        url: `/delete-event/${eventId}`,
        method: 'DELETE',
        data: { _token: $('meta[name="csrf-token"]').attr('content') },
        success: function() {
            loadModalData($('#modal-date').text()); // Обновляем данные после удаления
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        }
    });
});

$('#add-task').on('click', function() {
    let taskName = prompt("Введите название плановой работы:");
    if (taskName) {
        $.ajax({
            url: '/add-task',
            method: 'POST',
            data: {
                name: taskName,
                start_date: $('#modal-date').text(),
                end_date: $('#modal-date').text(),
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadModalData($('#modal-date').text());
                renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            }
        });
    }
});

$(document).on('click', '.delete-task', function() {
    let taskId = $(this).data('id');
    $.ajax({
        url: `/delete-task/${taskId}`,
        method: 'DELETE',
        data: { _token: $('meta[name="csrf-token"]').attr('content') },
        success: function() {
            loadModalData($('#modal-date').text());
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        }
    });
});


//miniCalendar
//Opens mini-calendar
$(document).on('click', '.set-range', function() {
    let id = $(this).data('id');
    let type = $(this).data('type');
    
    $.ajax({
        url: `/get-${type}-range/${id}`,
        method: 'GET',
        cache: false,
        success: function(response) {
            $('#start-date').val(response.start_date);
            $('#end-date').val(response.end_date);

            $('#mini-calendar').data('id', id);
            $('#mini-calendar').data('type', type);

            $('#range-modal').removeClass('hidden');
            loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
        }
    });
});

function loadMiniCalendar(year, month) {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let calendarHtml = '';
    let dayClass = 'bg-white';

    let startDate = $('#start-date').val();
    let endDate = $('#end-date').val();

    for (let i = 1; i < (firstDayOfMonth || 7); i++) {
        calendarHtml += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${day < 10 ? '0' + day : day}.${month + 1 < 10 ? '0' + (month + 1) : (month + 1)}.${year}`;
        dayClass = checkDate(date, startDate, endDate);

        calendarHtml += `
            <div class="p-2 ${dayClass} border rounded-md cursor-pointer mini-calendar-day" data-date="${date}">
                ${date.split('.')[0]}
            </div>
        `;
    }

    console.log($('#start-date').val(), $('#end-date').val())

    $('#mini-calendar').html(calendarHtml);
    $('#current-month-calendar').text(`${year} ${month + 1}`);
    let numberOfClicks = 0;
    let lastStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });


    $('#mini-calendar').on('click', '.mini-calendar-day', function() {
        let selectedDate = $(this).data('date');
        const arrayDate = selectedDate.split('.');
        const usefulDate = new Date(parseInt(arrayDate[2]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[0]));
        const lastDate = usefulDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        
        switch (numberOfClicks) {
            case 0:
                $('#start-date').val(lastDate);
                $('#end-date').val(null);
                $('.mini-calendar-day').removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white');
                $(this).addClass('bg-green-400');
                lastStartDate = new Date($('#start-date').val()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                numberOfClicks++;
                break;
            case 1:
                if (lastDate > lastStartDate) {
                    $('#end-date').val(lastDate);
                    $(this).addClass('bg-blue-500');
                    saveDateRange(); 
                    loadModalData($('#modal-date').text());
                    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
                    numberOfClicks++;
                    updateCalendarDayStyles();
                }
                break;
            default:
                numberOfClicks = 1;
                $('#start-date').val(lastDate);
                $('#end-date').val(null);
                lastStartDate = new Date($('#start-date').val()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                $('.mini-calendar-day').removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white');
                $(this).addClass('bg-green-400');
                break;
        }
    });
    updateCalendarDayStyles();
}

function updateCalendarDayStyles() {
    let startDate = $('#start-date').val();
    let endDate = $('#end-date').val();
    $('.mini-calendar-day').each(function() {
        let dayDate = $(this).data('date');
        let dayClass = 'bg-white';

        dayClass = checkDate(dayDate, startDate, endDate, dayClass);

        $(this).removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white').addClass(dayClass);
    });
}

function checkDate(date, startDate, endDate) {
    const arrayDate = date.split('.');
    const usefulDate = new Date(parseInt(arrayDate[2]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[0]));
    const lastDate = usefulDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const lastStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const lastEndDate = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let dayClass = 'bg-white';

    if ((lastDate > lastStartDate && lastDate < lastEndDate) || (lastDate === lastStartDate && lastDate === lastEndDate)) {
        return dayClass = 'bg-red-300';
    } else if (lastDate === lastStartDate) {
        return dayClass = 'bg-green-400';
    } else if (lastDate === lastEndDate) {
        return dayClass = 'bg-blue-500';
    } else {
        return dayClass = 'bg-white';
    }
}

$('#prev-month-calendar').on('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

$('#next-month-calendar').on('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

function saveDateRange() {
    let id = $('#mini-calendar').data('id');
    let type = $('#mini-calendar').data('type');
    let startDate = $('#start-date').val();
    let endDate = $('#end-date').val();

    // AJAX-запрос для сохранения диапазона
    $.ajax({
        url: `/set-${type}-range/${id}`,
        method: 'POST',
        data: {
            start_date: startDate,
            end_date: endDate,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function() {
            loadModalData($('#modal-date').text());
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        }
    });
}

// Закрытие модального окна
$('#range-modal').on('click', function(event) {
    if ($(event.target).is('#range-modal')) {
        closeModal('#range-modal');
    }
});



//Gantt
function drawGantt(data, precision) {
    let $tableBody = $('#gantt-table-body');
    $tableBody.empty();

    data.forEach(function(item, index) {
        let duration = Math.ceil((new Date(item.end_date) - new Date(item.start_date)) / (1000 * 60 * 60 * 24));

        let row = `<tr>
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${item.name}</td>
            <td class="border px-4 py-2">${duration}</td>
            <td class="border px-4 py-2">${item.start_date}</td>
            <td class="border px-4 py-2">${item.end_date}</td>
        </tr>`;

        let columns = generateGanttColumns(item.start_date, item.end_date, precision);
        row += columns;

        $tableBody.append(row);
    });
}

function generateGanttColumns(startDate, endDate, precision) {
    let columns = '';

    if (precision === 'day') {
        let currentDate = new Date(startDate);
        let end = new Date(endDate);

        while (currentDate <= end) {
            columns += `<td class="border px-4 py-2 bg-blue-200">${formatDate(currentDate)}</td>`;
            currentDate.setDate(currentDate.getDate() + 1); // Переходим к следующему дню
        }
    }

    return columns;
}

function formatDate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

$('#view-day').on('click', function() {
    $.ajax({
        url: '/get-gantt-data',
        method: 'GET',
        data: { precision: 'day' },
        success: function(response) {
            drawGantt(response.data, 'day');
        }
    });
});

$('#view-week').on('click', function() {
    $.ajax({
        url: '/get-gantt-data',
        method: 'GET',
        data: { precision: 'week' },
        success: function(response) {
            drawGantt(response.data, 'week');
        }
    });
});

$('#view-month').on('click', function() {
    $.ajax({
        url: '/get-gantt-data',
        method: 'GET',
        data: { precision: 'month' },
        success: function(response) {
            drawGantt(response.data, 'month');
        }
    });
});

$('#view-quarter').on('click', function() {
    $.ajax({
        url: '/get-gantt-data',
        method: 'GET',
        data: { precision: 'quarter' },
        success: function(response) {
            drawGantt(response.data, 'quarter');
        }
    });
});

$('#view-year').on('click', function() {
    $.ajax({
        url: '/get-gantt-data',
        method: 'GET',
        data: { precision: 'year' },
        success: function(response) {
            drawGantt(response.data, 'year');
        }
    });
});

$('#view-week').trigger('click');
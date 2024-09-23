import "./bootstrap";
import $ from "jquery";
window.$ = window.jQuery = $;

if ($("header").length > 0) {
    $.ajax({
        url: "/show-weather",
        method: "GET",
        success: function (data) {
            if (data) {
                const iconUrl =
                    "http://openweathermap.org/img/w/" +
                    data.weather[0].icon +
                    ".png";
                $("#weather-widget").html(`
                    <div class="mr-2"><img src=${iconUrl} alt="icon"></div>
                    <div class="flex flex-col justify-evenly">
                        <div>${Math.round(data.main.temp - 273.15)}°C</div>
                        <div>${data.wind.speed} м/с</div>
                    </div>
                `);
            }
        },
        error: function () {
            $("#weather-widget").html("<div>Не удалось загрузить погоду</div>");
        },
    });
}

$("#burger").on("click", function () {
    $(this).toggleClass("open");
});

const $content = $("#scrollable-content");
const $scrollbar = $("#custom-scrollbar");

if ($content.height()) {
    // Изменяем высоту скроллбара относительно контента
    const scrollbarHeight =
        ($content.height() / $content[0].scrollHeight) * $content.height();
    $scrollbar.height(scrollbarHeight);

    // Функция для обновления позиции скроллбара
    function updateScrollbarPosition() {
        const scrollPercentage =
            $content.scrollTop() /
            ($content[0].scrollHeight - $content.height());
        const scrollbarPosition =
            scrollPercentage * ($content.height() - $scrollbar.height());
        $scrollbar.css("top", scrollbarPosition + 16 + "px");
    }

    // Обновляем позицию скроллбара при скролле контента
    $content.on("scroll", updateScrollbarPosition);

    // Обрабатываем скролл по кастомному скроллу
    $scrollbar.on("mousedown", function (e) {
        const startY = e.pageY;
        const startTop = $scrollbar.position().top;

        const onMouseMove = function (e) {
            const deltaY = e.pageY - startY;
            const newTop = Math.min(
                $content.height() - $scrollbar.height(),
                Math.max(0, startTop + deltaY)
            );
            $scrollbar.css("top", newTop + 16 + "px");

            const scrollPercentage =
                newTop / ($content.height() - $scrollbar.height());
            $content.scrollTop(
                scrollPercentage *
                    ($content[0].scrollHeight - $content.height())
            );
        };

        const onMouseUp = function () {
            $(document).off("mousemove", onMouseMove);
            $(document).off("mouseup", onMouseUp);
        };

        $(document).on("mousemove", onMouseMove);
        $(document).on("mouseup", onMouseUp);

        return false; // предотвращаем выделение текста при скролле
    });

    // Изначально обновляем позицию скроллбара
    updateScrollbarPosition();
}

//Переключение между версиями Погоды

$("#version1-btn").on("click", function () {
    $("#version1").show();
    $("#version2").hide();
    $(this)
        .addClass("bg-blue-500 text-white")
        .removeClass("bg-gray-300 text-black");
    $("#version2-btn")
        .addClass("bg-gray-300 text-black")
        .removeClass("bg-blue-500 text-white");
});

$("#version2-btn").on("click", function () {
    $("#version1").hide();
    $("#version2").show();
    $(this)
        .addClass("bg-blue-500 text-white")
        .removeClass("bg-gray-300 text-black");
    $("#version1-btn")
        .addClass("bg-gray-300 text-black")
        .removeClass("bg-blue-500 text-white");
});

//Switching between versions of the agroplan page
$("#calendar-view").on("click", function () {
    $("#calendar").removeClass("hidden");
    $("#gantt").addClass("hidden");
    $(this).addClass("bg-blue-500").removeClass("bg-gray-500");
    $("#gantt-view").addClass("bg-gray-500").removeClass("bg-blue-500");
});

$("#gantt-view").on("click", function () {
    $("#gantt").removeClass("hidden");
    $("#calendar").addClass("hidden");
    $(this).addClass("bg-blue-500").removeClass("bg-gray-500");
    $("#calendar-view").addClass("bg-gray-500").removeClass("bg-blue-500");
    $(".view-button")
        .removeClass("bg-gray-500 bg-blue-500")
        .addClass("bg-gray-500");
    $("#view-week").removeClass("bg-gray-500").addClass("bg-blue-500");
    loadGantt("week");
});

// Calendar view

let currentDate = new Date();
let currentDateMiniCalendar = new Date();

function renderCalendar(year, month) {
    $.ajax({
        url: `/calendar-data/${year}/${month}`,
        method: "GET",
        success: function (response) {
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let firstDayOfMonth = new Date(year, month, 1).getDay();
            let calendarHtml = "";

            for (let i = 1; i < (firstDayOfMonth || 7); i++) {
                calendarHtml += "<div></div>";
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = `${day < 10 ? "0" + day : day}.${
                    month + 1 < 10 ? "0" + (month + 1) : month + 1
                }.${year}`;
                const dayEvents = response.events.filter((event) =>
                    isDateInRange(date, event.start_date, event.end_date)
                );
                const dayTasks = response.tasks.filter((task) =>
                    isDateInRange(date, task.start_date, task.end_date)
                );

                calendarHtml += `
                    <div class="p-2 bg-white border rounded-md hover:bg-gray-100 cursor-pointer calendar-day" data-date="${date}">
                        ${date}<br>${dayEvents.length} события<br>${dayTasks.length} план
                    </div>
                `;
            }

            $("#calendar-grid").html(calendarHtml);
            $("#current-month").text(`${year} ${month + 1}`);

            function isDateInRange(date, startDate, endDate) {
                const arrayDate = date.split(".");
                const usefulDate = new Date(
                    parseInt(arrayDate[2]),
                    parseInt(arrayDate[1]) - 1,
                    parseInt(arrayDate[0])
                );
                const lastDate = usefulDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
                const lastStartDate = new Date(startDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "2-digit", day: "2-digit" }
                );
                const lastEndDate = new Date(endDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "2-digit", day: "2-digit" }
                );
                return lastDate >= lastStartDate && lastDate <= lastEndDate;
            }
        },
    });
}

$("#prev-month").on("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDateMiniCalendar.setMonth(currentDate.getMonth());
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

$("#next-month").on("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDateMiniCalendar.setMonth(currentDate.getMonth());
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

renderCalendar(currentDate.getFullYear(), currentDate.getMonth());

// Main-modal

// Open main-modal
$("#calendar").on("click", ".calendar-day", function () {
    let date = $(this).data("date");
    $("#modal-date").text(date);
    loadModalData(date);
    $("#modal").removeClass("hidden");
});

// Close main-modal
$("#modal").on("click", function (event) {
    if ($(event.target).is("#modal")) {
        closeModal("#modal");
    }
});

function closeModal(modal) {
    $(modal).addClass("hidden");
}

function loadModalData(date) {
    $.ajax({
        url: "/get-day-data",
        method: "GET",
        data: { start_date: date },
        success: function (response) {
            let events = response.events;
            let tasks = response.tasks;

            $("#event-list").empty();
            $("#task-list").empty();

            events.forEach((event) => {
                $("#event-list").append(`
                    <li>
                        ${event.name}
                        <button class="set-range" data-id="${event.id}" data-type="event">Диапазон</button>
                        <button class="delete-event" data-id="${event.id}">Удалить</button>
                    </li>
                `);
            });

            tasks.forEach((task) => {
                $("#task-list").append(`
                    <li>
                        ${task.name}
                        <button class="set-range" data-id="${task.id}" data-type="task">Диапазон</button>
                        <button class="delete-task" data-id="${task.id}">Удалить</button>
                    </li>
                `);
            });
        },
    });
}

$("#add-event").on("click", function () {
    let eventName = prompt("Введите название события:");
    if (eventName) {
        $.ajax({
            url: "/add-event",
            method: "POST",
            data: {
                name: eventName,
                start_date: $("#modal-date").text(),
                end_date: $("#modal-date").text(),
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function () {
                loadModalData($("#modal-date").text());
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
            },
        });
    }
});

// Delete event
$(document).on("click", ".delete-event", function () {
    let eventId = $(this).data("id");
    $.ajax({
        url: `/delete-event/${eventId}`,
        method: "DELETE",
        data: { _token: $('meta[name="csrf-token"]').attr("content") },
        success: function () {
            loadModalData($("#modal-date").text()); // Обновляем данные после удаления
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        },
    });
});

$("#add-task").on("click", function () {
    let taskName = prompt("Введите название плановой работы:");
    if (taskName) {
        $.ajax({
            url: "/add-task",
            method: "POST",
            data: {
                name: taskName,
                start_date: $("#modal-date").text(),
                end_date: $("#modal-date").text(),
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function () {
                loadModalData($("#modal-date").text());
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
            },
        });
    }
});

$(document).on("click", ".delete-task", function () {
    let taskId = $(this).data("id");
    $.ajax({
        url: `/delete-task/${taskId}`,
        method: "DELETE",
        data: { _token: $('meta[name="csrf-token"]').attr("content") },
        success: function () {
            loadModalData($("#modal-date").text());
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        },
    });
});

let numberOfClicks = 0; // Глобальная переменная для отслеживания количества кликов
let startDate;
let endDate;

$(document).on("click", ".set-range", function () {
    let id = $(this).data("id");
    let type = $(this).data("type");

    $.ajax({
        url: `/get-${type}-range/${id}`,
        method: "GET",
        cache: false,
        success: function (response) {
            $("#start-date").val(response.start_date);
            $("#end-date").val(response.end_date);
            startDate = $("#start-date").val();
            endDate = $("#end-date").val();

            $("#mini-calendar").data("id", id);
            $("#mini-calendar").data("type", type);

            $("#range-modal").removeClass("hidden");
            loadMiniCalendar(
                currentDateMiniCalendar.getFullYear(),
                currentDateMiniCalendar.getMonth(),
                startDate,
                endDate
            );
        },
    });
});

function loadMiniCalendar(year, month, startDate, endDate) {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let calendarHtml = "";
    console.log("start Date: " + startDate + "End Date: " + endDate);

    // Добавляем пустые ячейки для выравнивания первого дня месяца
    for (let i = 1; i < (firstDayOfMonth || 7); i++) {
        calendarHtml += "<div></div>";
    }

    // Получаем startDate и endDate из полей ввода

    console.log(`Start Date: ${startDate}`);
    console.log(`End Date: ${endDate}`);

    // Генерация HTML для календаря
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${day < 10 ? "0" + day : day}.${
            month + 1 < 10 ? "0" + (month + 1) : month + 1
        }.${year}`;
        const dayClass = checkDate(date, startDate, endDate);

        calendarHtml += `
            <div class="p-2 ${dayClass} border rounded-md cursor-pointer mini-calendar-day" data-date="${date}">
                ${day}
            </div>
        `;
    }

    $("#mini-calendar").html(calendarHtml);
    $("#current-month-calendar").text(`${year}-${month + 1}`);

    updateCalendarDayStyles(startDate, endDate);
}

// Обработчик кликов по дням в мини-календаре
$("#mini-calendar").on("click", ".mini-calendar-day", function () {
    let selectedDate = $(this).data("date");
    let day = selectedDate.split(".")[0];
    let month = selectedDate.split(".")[1];
    let year = selectedDate.split(".")[2];
    const formattedDate = formatDateCalendar(new Date(year, month - 1, day));

    switch (numberOfClicks) {
        case 0:
            startDate = formattedDate;
            endDate = null;
            $("#start-date").val(startDate);
            $("#end-date").val(null);
            $(".mini-calendar-day").removeClass(
                "bg-red-300 bg-blue-500 bg-green-400"
            );
            $(this).addClass("bg-green-400");
            numberOfClicks++;
            break;
        case 1:
            if (formattedDate < startDate) {
                break;
            }
            endDate = formattedDate;
            $("#end-date").val(endDate);
            $(".mini-calendar-day").removeClass(
                "bg-red-300 bg-blue-500 bg-green-400"
            );
            $(this).addClass("bg-blue-500");
            saveDateRange();
            numberOfClicks = 0;
            break;
        default:
            break;
    }
    updateCalendarDayStyles(startDate, endDate);
});

function formatDateCalendar(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Месяцы начинаются с 0
    let year = date.getFullYear();
    return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
    }`;
}

function updateCalendarDayStyles(startDate, endDate) {
    $(".mini-calendar-day").each(function () {
        let dayDate = $(this).data("date");
        let dayClass = checkDate(dayDate, startDate, endDate);
        $(this)
            .removeClass("bg-red-300 bg-blue-500 bg-green-400 bg-white")
            .addClass(dayClass);
    });
}

function checkDate(date, startDate, endDate) {
    const [day, month, year] = date.split(".").map((num) => parseInt(num, 10));
    const currentDateNow = new Date(year, month - 1, day); // Корректное создание даты
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    currentDateNow.setHours(0, 0, 0, 0);
    start ? start.setHours(0, 0, 0, 0) : null;
    end ? end.setHours(0, 0, 0, 0) : null;

    console.log(currentDateNow, start, end);

    if (start && end) {
        if (currentDateNow >= start || currentDateNow <= end) {
            if (
                currentDateNow.toLocaleDateString() ===
                start.toLocaleDateString()
            ) {
                console.log("= start");
                return "bg-green-400";
            } else if (
                currentDateNow.toLocaleDateString() === end.toLocaleDateString()
            ) {
                console.log("= end");
                return "bg-blue-500";
            } else if (currentDateNow < start) {
                console.log("< start");
                return "bg-white";
            } else if (currentDateNow > end) {
                console.log("< end");
                return "bg-white;";
            } else {
                console.log("else");
                return "bg-red-300";
            }
        }
    } else if (start) {
        if (
            currentDateNow.toLocaleDateString() === start.toLocaleDateString()
        ) {
            return "bg-green-400";
        }
    } else if (end) {
        if (currentDateNow.toLocaleDateString() === end.toLocaleDateString()) {
            return "bg-blue-500";
        }
    }

    return "bg-white";
}

$("#prev-month-calendar").on("click", function () {
    currentDateMiniCalendar.setMonth(currentDateMiniCalendar.getMonth() - 1);
    loadMiniCalendar(
        currentDateMiniCalendar.getFullYear(),
        currentDateMiniCalendar.getMonth(),
        startDate,
        endDate
    );
});

$("#next-month-calendar").on("click", function () {
    currentDateMiniCalendar.setMonth(currentDateMiniCalendar.getMonth() + 1);
    loadMiniCalendar(
        currentDateMiniCalendar.getFullYear(),
        currentDateMiniCalendar.getMonth(),
        startDate,
        endDate
    );
});

function saveDateRange() {
    let id = $("#mini-calendar").data("id");
    let type = $("#mini-calendar").data("type");

    // AJAX-запрос для сохранения диапазона
    $.ajax({
        url: `/set-${type}-range/${id}`,
        method: "POST",
        data: {
            start_date: $("#start-date").val(),
            end_date: $("#end-date").val(),
            _token: $('meta[name="csrf-token"]').attr("content"),
        },
        success: function () {
            loadModalData($("#modal-date").text());
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        },
    });
}

// Закрытие модального окна
$("#range-modal").on("click", function (event) {
    if ($(event.target).is("#range-modal")) {
        closeModal("#range-modal");
    }
});

// //miniCalendar
// //Opens mini-calendar
// $(document).on('click', '.set-range', function() {
//     let id = $(this).data('id');
//     let type = $(this).data('type');

//     $.ajax({
//         url: `/get-${type}-range/${id}`,
//         method: 'GET',
//         cache: false,
//         success: function(response) {
//             $('#start-date').val(response.start_date);
//             $('#end-date').val(response.end_date);

//             $('#mini-calendar').data('id', id);
//             $('#mini-calendar').data('type', type);

//             $('#range-modal').removeClass('hidden');
//             loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
//         }
//     });
// });

// function loadMiniCalendar(year, month) {
//     let daysInMonth = new Date(year, month + 1, 0).getDate();
//     let firstDayOfMonth = new Date(year, month, 1).getDay();
//     let calendarHtml = '';
//     let dayClass = 'bg-white';

//     let startDate = $('#start-date').val();
//     let endDate = $('#end-date').val();

//     for (let i = 1; i < (firstDayOfMonth || 7); i++) {
//         calendarHtml += '<div></div>';
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//         const date = `${day < 10 ? '0' + day : day}.${month + 1 < 10 ? '0' + (month + 1) : (month + 1)}.${year}`;
//         dayClass = checkDate(date, startDate, endDate);

//         calendarHtml += `
//             <div class="p-2 ${dayClass} border rounded-md cursor-pointer mini-calendar-day" data-date="${date}">
//                 ${date.split('.')[0]}
//             </div>
//         `;
//     }

//     $('#mini-calendar').html(calendarHtml);
//     $('#current-month-calendar').text(`${year} ${month + 1}`);
//     let numberOfClicks = 0;
//     let lastStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

//     $('#mini-calendar').on('click', '.mini-calendar-day', function() {
//         let selectedDate = $(this).data('date');
//         const arrayDate = selectedDate.split('.');
//         const usefulDate = new Date(parseInt(arrayDate[2]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[0]));
//         const lastDate = usefulDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

//         switch (numberOfClicks) {
//             case 0:
//                 $('#start-date').val(lastDate);
//                 $('#end-date').val(null);
//                 $('.mini-calendar-day').removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white');
//                 $(this).addClass('bg-green-400');
//                 lastStartDate = new Date($('#start-date').val()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//                 numberOfClicks++;
//                 break;
//             case 1:
//                 if (lastDate > lastStartDate) {
//                     $('#end-date').val(lastDate);
//                     $(this).addClass('bg-blue-500');
//                     saveDateRange();
//                     loadModalData($('#modal-date').text());
//                     renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
//                     numberOfClicks++;
//                     updateCalendarDayStyles();
//                 }
//                 break;
//             default:
//                 numberOfClicks = 1;
//                 $('#start-date').val(lastDate);
//                 $('#end-date').val(null);
//                 lastStartDate = new Date($('#start-date').val()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//                 $('.mini-calendar-day').removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white');
//                 $(this).addClass('bg-green-400');
//                 break;
//         }
//     });
//     updateCalendarDayStyles();
// }

// function updateCalendarDayStyles() {
//     let startDate = $('#start-date').val();
//     let endDate = $('#end-date').val();
//     $('.mini-calendar-day').each(function() {
//         let dayDate = $(this).data('date');
//         let dayClass = 'bg-white';

//         dayClass = checkDate(dayDate, startDate, endDate, dayClass);

//         $(this).removeClass('bg-red-300 bg-blue-500 bg-green-400 bg-white').addClass(dayClass);
//     });
// }

// function checkDate(date, startDate, endDate) {
//     const arrayDate = date.split('.');
//     const usefulDate = new Date(parseInt(arrayDate[2]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[0]));
//     const lastDate = usefulDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//     const lastStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//     const lastEndDate = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//     let dayClass = 'bg-white';

//     if ((lastDate > lastStartDate && lastDate < lastEndDate) || (lastDate === lastStartDate && lastDate === lastEndDate)) {
//         return dayClass = 'bg-red-300';
//     } else if (lastDate === lastStartDate) {
//         return dayClass = 'bg-green-400';
//     } else if (lastDate === lastEndDate) {
//         return dayClass = 'bg-blue-500';
//     } else {
//         return dayClass = 'bg-white';
//     }
// }

// $('#prev-month-calendar').on('click', function() {
//     currentDate.setMonth(currentDate.getMonth() - 1);
//     loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
// });

// $('#next-month-calendar').on('click', function() {
//     currentDate.setMonth(currentDate.getMonth() + 1);
//     loadMiniCalendar(currentDate.getFullYear(), currentDate.getMonth());
// });

// function saveDateRange() {
//     let id = $('#mini-calendar').data('id');
//     let type = $('#mini-calendar').data('type');
//     let startDate = $('#start-date').val();
//     let endDate = $('#end-date').val();

//     // AJAX-запрос для сохранения диапазона
//     $.ajax({
//         url: `/set-${type}-range/${id}`,
//         method: 'POST',
//         data: {
//             start_date: startDate,
//             end_date: endDate,
//             _token: $('meta[name="csrf-token"]').attr('content')
//         },
//         success: function() {
//             loadModalData($('#modal-date').text());
//             renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
//         }
//     });
// }

// // Закрытие модального окна
// $('#range-modal').on('click', function(event) {
//     if ($(event.target).is('#range-modal')) {
//         closeModal('#range-modal');
//     }
// });

//Gantt
// Изначально загружаем диаграмму с недельной точностью
loadGantt("week");

// Обработчики кликов для переключения точности
$(".view-button").on("click", function () {
    const view = $(this).attr("id").split("-")[1];
    $(".view-button")
        .removeClass("bg-gray-500 bg-blue-500")
        .addClass("bg-gray-500");
    $(this).removeClass("bg-gray-500").addClass("bg-blue-500");
    loadGantt(view);
});

function loadGantt(view) {
    $.ajax({
        url: "/get-gantt-data", // эндпоинт для получения данных
        method: "GET",
        dataType: "json",
        success: function (response) {
            buildGanttTable(response.data, view);
        },
        error: function (error) {
            console.log("Ошибка при загрузке данных: ", error);
        },
    });
}

function buildGanttTable(data, view) {
    const $ganttTableBody = $("#gantt-table-body");
    let $dynamicColumns = $("#dynamic-columns");
    $ganttTableBody.empty();
    $dynamicColumns.empty();

    // Определяем количество колонок в зависимости от выбранной точности
    let columnCount;
    let startDate = new Date();

    if (view === "day") {
        columnCount = 10;
    } else if (view === "week") {
        columnCount = 8;
        // Определяем начальную дату для недельного вида
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Переходим к началу недели
    } else if (view === "month") {
        columnCount = 9;
        // Определяем начальную дату для месячного вида
        startDate.setDate(1); // Переходим к началу месяца
    } else if (view === "quarter") {
        columnCount = 9;
        // Определяем начальную дату для квартального вида
        startDate.setMonth(startDate.getMonth() - (startDate.getMonth() % 3)); // Переходим к началу квартала
        startDate.setDate(1);
    } else if (view === "year") {
        columnCount = 4;
        // Определяем начальную дату для годового вида
        startDate.setMonth(0); // Переходим к началу года
        startDate.setDate(1);
    }

    $dynamicColumns.append(`
        <th class="border px-4 py-2">№</th>
        <th class="border px-4 py-2">Название</th>
        <th class="border px-4 py-2">Длительность</th>
        <th class="border px-4 py-2">Начало</th>
        <th class="border px-4 py-2">Конец</th>
    `);

    for (let i = 0; i < columnCount; i++) {
        const columnDate = new Date(startDate);
        if (view === "day") {
            columnDate.setDate(startDate.getDate() + i);
        } else if (view === "week") {
            columnDate.setDate(startDate.getDate() + i * 7);
        } else if (view === "month") {
            columnDate.setMonth(startDate.getMonth() + i);
            columnDate.setDate(1);
        } else if (view === "quarter") {
            columnDate.setMonth(startDate.getMonth() + i * 3);
            columnDate.setDate(1);
        } else if (view === "year") {
            columnDate.setFullYear(startDate.getFullYear() + i);
            columnDate.setMonth(0);
            columnDate.setDate(1);
        }

        $dynamicColumns.append(
            `<th class="border px-2 py-2">${getColumnLabel(
                columnDate,
                view
            )}</th>`
        );
    }

    // Отрисовываем строки с событиями
    data.forEach((item, index) => {
        const startItemDate = new Date(item.start_date);
        const endItemDate = new Date(item.end_date);
        const duration =
            Math.round((endItemDate - startItemDate) / (1000 * 60 * 60 * 24)) +
            1;

        const $row = $(`
            <tr>
                <td class="border px-4">${index + 1}</td>
                <td class="border px-4">${item.name}</td>
                <td class="border px-4">${duration} дней</td>
                <td class="border px-4">${formatDate(startItemDate)}</td>
                <td class="border px-4">${formatDate(endItemDate)}</td>
            </tr>
        `);

        // Добавляем ячейки для каждой динамической колонки
        for (let i = 0; i < columnCount; i++) {
            const columnStartDate = new Date(startDate);
            const columnEndDate = new Date(startDate);

            if (view === "day") {
                columnStartDate.setDate(columnStartDate.getDate() + i);
                columnEndDate.setDate(columnStartDate.getDate());
                columnEndDate.setHours(23, 59, 59, 999); // Устанавливаем конец дня
            } else if (view === "week") {
                // Находим начало недели
                columnStartDate.setDate(startDate.getDate() + i * 7);
                // Конец недели — это минимальная дата: либо конец месяца, либо стандартная неделя (7 дней)
                const daysInMonth = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth() + 1,
                    0
                ).getDate();
                const maxWeekEndDate = Math.min(
                    columnStartDate.getDate() + 6,
                    daysInMonth
                );
                columnEndDate.setMonth(columnStartDate.getMonth());
                columnEndDate.setDate(maxWeekEndDate);
            } else if (view === "month") {
                columnStartDate.setMonth(columnStartDate.getMonth() + i);
                columnEndDate.setMonth(columnStartDate.getMonth() + 1);
                columnEndDate.setDate(0); // Последний день месяца
            } else if (view === "quarter") {
                columnStartDate.setMonth(columnStartDate.getMonth() + i * 3);
                columnEndDate.setMonth(columnStartDate.getMonth() + 3);
                columnEndDate.setDate(0); // Последний день квартала
            } else if (view === "year") {
                columnStartDate.setFullYear(columnStartDate.getFullYear() + i);
                columnEndDate.setFullYear(columnStartDate.getFullYear() + 1);
                columnEndDate.setDate(0); // Последний день года
            }

            let $cell = $('<td class="border border-[#00CC6680] px-2"></td>');

            // Логика окрашивания клеток в зависимости от событий
            if (
                shouldPaintCell(
                    startItemDate,
                    endItemDate,
                    columnStartDate,
                    columnEndDate
                )
            ) {
                applyPartialCellPaint(
                    $cell,
                    startItemDate,
                    endItemDate,
                    columnStartDate,
                    columnEndDate
                );
            }

            $row.append($cell);
        }

        $ganttTableBody.append($row);
    });
}

function getColumnLabel(date, view) {
    // Генерация заголовков колонок в зависимости от точности
    let label = "";

    if (view === "day") {
        label =
            formatDate(date).split(".")[0] +
            "." +
            formatDate(date).split(".")[1];
    } else if (view === "week") {
        label = `${
            formatDate(date).split(".")[1] +
            "." +
            formatDate(date).split(".")[2]
        }<br>${Math.ceil(date.getDate() / 7)} нед.`;
    } else if (view === "month") {
        label = `${formatMonth(date)} ${date.getFullYear()}`;
    } else if (view === "quarter") {
        label = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
    } else if (view === "year") {
        label = `${date.getFullYear()}`;
    }

    return label;
}

function formatDate(date) {
    return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }.${date.getFullYear()}`;
}

function formatMonth(date) {
    const months = [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
    ];
    return months[date.getMonth()];
}

function shouldPaintCell(startDate, endDate, columnStartDate, columnEndDate) {
    const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    const endDateOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
    );

    // Логика пересечения: событие должно начинаться до конца ячейки и заканчиваться после начала ячейки
    const overlaps =
        startDateOnly < columnEndDate && endDateOnly > columnStartDate;

    // Если событие начинается в будущем месяце, то отображаем его в соответствующих ячейках
    const inFutureMonth = startDateOnly.getMonth() > columnStartDate.getMonth();

    return overlaps || inFutureMonth;
}

function applyPartialCellPaint(
    $cell,
    startDate,
    endDate,
    columnStartDate,
    columnEndDate
) {
    if (columnStartDate.getDate() === columnEndDate.getDate()) {
        startDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );
        endDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23,
            59,
            59,
            999
        );
        columnStartDate = new Date(
            columnStartDate.getFullYear(),
            columnStartDate.getMonth(),
            columnStartDate.getDate()
        );
        columnEndDate = new Date(
            columnEndDate.getFullYear(),
            columnEndDate.getMonth(),
            columnEndDate.getDate(),
            23,
            59,
            59,
            999
        );
    }
    const cellStart = Math.max(startDate, columnStartDate);
    const cellEnd = Math.min(endDate, columnEndDate);

    // Если событие не охватывает эту колонку, выходим
    if (cellStart > cellEnd) {
        return;
    }

    // Рассчитываем ширину закрашенной части ячейки
    const totalColumnDuration =
        (columnEndDate - columnStartDate) / (1000 * 60 * 60 * 24) + 1; // Включаем последний день
    const eventStartInColumn =
        (cellStart - columnStartDate) / (1000 * 60 * 60 * 24);
    const eventEndInColumn =
        (cellEnd - columnStartDate) / (1000 * 60 * 60 * 24);

    // Ограничиваем значения
    const startPercentage = Math.max(
        0,
        (eventStartInColumn / totalColumnDuration) * 100
    );
    const endPercentage = Math.min(
        100,
        ((eventEndInColumn + 1) / totalColumnDuration) * 100
    );

    // Убираем предыдущий фон
    $cell.css("background", "");

    // Создаем элемент для частичного закрашивания
    const $overlay = $("<div></div>").css({
        position: "absolute",
        top: 0,
        left: `${startPercentage}%`,
        width: `${endPercentage - startPercentage}%`,
        height: "100%",
        background: "#00CC6680",
        zIndex: 1,
    });

    // Добавляем элемент в ячейку
    $cell
        .css({
            position: "relative",
            overflow: "hidden",
        })
        .append($overlay);
}

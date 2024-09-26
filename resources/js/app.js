"use strict";

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
const MONTH_NAMES = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

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

//Switching between versions of the weather page

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
    $(this)
        .addClass("bg-[#00CC66]")
        .removeClass("bg-transparent hover:bg-[#00CC66AA]");
    $("#gantt-view")
        .addClass("bg-transparent hover:bg-[#00CC66AA]")
        .removeClass("bg-[#00CC66]");
});

$("#gantt-view").on("click", function () {
    $("#gantt").removeClass("hidden");
    $("#calendar").addClass("hidden");
    $(this)
        .addClass("bg-[#00CC66]")
        .removeClass("bg-transparent hover:bg-[#00CC66AA]");
    $("#calendar-view")
        .addClass("bg-transparent hover:bg-[#00CC66AA]")
        .removeClass("bg-[#00CC66]");
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
                calendarHtml +=
                    '<div class="w-full border-r-2 border-b-2 border-white bg-[#00CC6680]"></div>';
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
                    <div class="w-full flex flex-col justify-evenly items-center bg-[#00CC6680] border-r-2 border-b-2 border-white cursor-pointer calendar-day" data-date="${date}">
                        <div class="text-white text-[9px]">${date}</div>
                        <div class="w-[120px] h-[30px] rounded-[5px] bg-white flex justify-center items-center text-[10px]">События - ${dayEvents.length}</div>
                        <div class="w-[120px] h-[30px] rounded-[5px] bg-white flex justify-center items-center text-[10px]">Плановые работы - ${dayTasks.length}</div>
                    </div>
                `;
            }

            $("#calendar-grid").html(calendarHtml);
            $("#current-month").text(`${MONTH_NAMES[month]} ${year}`);

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

    // Устанавливаем display:flex, а затем анимируем
    $("#modal").removeClass("hidden").addClass("flex").hide().fadeIn(300); // Плавное появление с display: flex
});

// Close main-modal
$("#modal").on("click", function (event) {
    if ($(event.target).is("#modal")) {
        closeModal("#modal");
    }
});

function closeModal(modal) {
    // Плавное скрытие
    $(modal).fadeOut(300, function () {
        $(this).addClass("hidden").removeClass("flex"); // Устанавливаем display: none после завершения анимации
    });
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
                    <li class="flex justify-between items-center w-full px-4 mb-2 bg-white rounded-[8px] text-black text-[20px]">
                        <p class="w-2/3 break-words">${event.name}</p>
                        <div class="w-1/4 flex justify-between items-center">
                            <button class="set-range bg-[#00CC66] rounded-md w-[23px] h-[23px] flex justify-center items-center" data-id="${event.id}" data-type="event">${window.calendarIcon}</button>
                            <button class="delete-event w-[21px] h-[21px]" data-id="${event.id}">${window.bucketIcon}</button>
                        </div>
                    </li>
                `);
            });

            tasks.forEach((task) => {
                $("#task-list").append(`
                    <li class="flex justify-between items-center w-full px-4 mb-2 bg-white rounded-[8px] text-black text-[20px]">
                        <p class="w-2/3 break-words">${task.name}</p>
                        <div class="w-1/4 flex justify-between items-center">
                            <button class="set-range bg-[#00CC66] rounded-md w-[23px] h-[23px] flex justify-center items-center" data-id="${task.id}" data-type="task">${window.calendarIcon}</button>
                            <button class="delete-task w-[21px] h-[21px]" data-id="${task.id}">${window.bucketIcon}</button>
                        </div>
                    </li>
                `);
            });
        },
    });
}

$("#add-event").on("click", function () {
    // Показываем модальное окно
    $("#event-modal").removeClass("hidden").addClass("flex").hide().fadeIn(300);
    $("#event-name-input").trigger("focus");
});

$("#add-task").on("click", function () {
    // Показываем модальное окно
    $("#task-modal").removeClass("hidden").addClass("flex").hide().fadeIn(300);
    $("#task-name-input").trigger("focus");
});

$("#event-modal").on("click", function (event) {
    if ($(event.target).is("#event-modal")) {
        closeModal("#event-modal");
    }
});

$("#task-modal").on("click", function (event) {
    if ($(event.target).is("#task-modal")) {
        closeModal("#task-modal");
    }
});

// Сохранение события
$("#event-name-input").on("keydown", function (e) {
    if (e.key === "Enter") {
        let eventName = $("#event-name-input").val();
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
                    $("#event-name-input").val("");
                    // Закрываем модальное окно
                    closeModal("#event-modal");
                },
            });
        }
    } else if (e.key === "Escape") {
        // Отменяем ввод, удаляя input
        $("#event-name-input").val("");
        closeModal("#event-modal");
    }
});

// Сохранение события
$("#task-name-input").on("keydown", function (e) {
    if (e.key === "Enter") {
        let taskName = $("#task-name-input").val();
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
                    $("#task-name-input").val("");
                    // Закрываем модальное окно
                    closeModal("#task-modal");
                },
            });
        }
    } else if (e.key === "Escape") {
        // Отменяем ввод, удаляя input
        $("#task-name-input").val("");
        closeModal("#task-modal");
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

            $("#range-modal")
                .removeClass("hidden")
                .addClass("flex")
                .hide()
                .fadeIn(300);
            loadMiniCalendar(
                currentDateMiniCalendar.getFullYear(),
                currentDateMiniCalendar.getMonth(),
                startDate,
                endDate
            );
        },
    });
});

// Закрытие модального окна
$("#range-modal").on("click", function (event) {
    if ($(event.target).is("#range-modal")) {
        closeModal("#range-modal");
    }
});

function loadMiniCalendar(year, month, startDate, endDate) {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let calendarHtml = "";

    // Добавляем пустые ячейки для выравнивания первого дня месяца
    for (let i = 1; i < (firstDayOfMonth || 7); i++) {
        calendarHtml += "<div></div>";
    }

    // Генерация HTML для календаря
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${day < 10 ? "0" + day : day}.${
            month + 1 < 10 ? "0" + (month + 1) : month + 1
        }.${year}`;
        const dayClass = checkDate(date, startDate, endDate);

        calendarHtml += `
            <div class="m-2 p-2 ${dayClass} rounded-md cursor-pointer mini-calendar-day" data-date="${date}">
                ${day}
            </div>
        `;
    }

    $("#mini-calendar").html(calendarHtml);
    $("#current-month-calendar").text(`${MONTH_NAMES[month]} ${year}`);

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
            .removeClass("bg-green-300 bg-green-500 bg-green-400 bg-white")
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

    if (start && end) {
        if (currentDateNow >= start || currentDateNow <= end) {
            if (
                currentDateNow.toLocaleDateString() ===
                start.toLocaleDateString()
            ) {
                return "bg-green-300";
            } else if (
                currentDateNow.toLocaleDateString() === end.toLocaleDateString()
            ) {
                return "bg-green-500";
            } else if (currentDateNow < start) {
                return "bg-white";
            } else if (currentDateNow > end) {
                return "bg-white;";
            } else {
                return "bg-green-400";
            }
        }
    } else if (start) {
        if (
            currentDateNow.toLocaleDateString() === start.toLocaleDateString()
        ) {
            return "bg-green-300";
        }
    } else if (end) {
        if (currentDateNow.toLocaleDateString() === end.toLocaleDateString()) {
            return "bg-green-500";
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

//Gantt
// Изначально загружаем диаграмму с недельной точностью
loadGantt("week");

// Обработчики кликов для переключения точности
$(".view-button").on("click", function () {
    const view = $(this).attr("id").split("-")[1];
    $(".view-button")
        .removeClass("text-white text-black")
        .addClass("text-black");
    $(this).removeClass("text-black").addClass("text-white");
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
        columnCount = 14;
    } else if (view === "week") {
        columnCount = 10;
        // Определяем начальную дату для недельного вида
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Переходим к началу недели
    } else if (view === "month") {
        columnCount = 14;
        // Определяем начальную дату для месячного вида
        startDate.setDate(1); // Переходим к началу месяца
    } else if (view === "quarter") {
        columnCount = 9;
        // Определяем начальную дату для квартального вида
        startDate.setMonth(startDate.getMonth() - (startDate.getMonth() % 3)); // Переходим к началу квартала
        startDate.setDate(1);
    } else if (view === "year") {
        columnCount = 8;
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

let numberOfClicksExport = 0; // Глобальная переменная для отслеживания количества кликов
let startDateExport = null;
let endDateExport = null;
let currentDateExport = new Date();

loadExport(currentDateExport.getFullYear(), currentDateExport.getMonth());

function loadExport(year, month) {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let calendarHtml = "";

    // Добавляем пустые ячейки для выравнивания первого дня месяца
    for (let i = 1; i < (firstDayOfMonth || 7); i++) {
        calendarHtml += "<div></div>";
    }

    // Генерация HTML для календаря
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${day < 10 ? "0" + day : day}.${
            month + 1 < 10 ? "0" + (month + 1) : month + 1
        }.${year}`;
        const dayClass = "bg-white";

        calendarHtml += `
            <div class="m-2 p-2 ${dayClass} rounded-md cursor-pointer mini-calendar-day" data-date="${date}">
                ${day}
            </div>
        `;
    }

    $("#mini-calendar-export").html(calendarHtml);
    $("#current-month-export").text(`${MONTH_NAMES[month]} ${year}`);
}

// Обработчик кликов по дням в мини-календаре
$("#mini-calendar-export").on("click", ".mini-calendar-day", function () {
    let selectedDate = $(this).data("date");
    let day = selectedDate.split(".")[0];
    let month = selectedDate.split(".")[1];
    let year = selectedDate.split(".")[2];
    const formattedDate = formatDateCalendar(new Date(year, month - 1, day));

    switch (numberOfClicksExport) {
        case 0:
            startDateExport = formattedDate;
            endDateExport = null;
            $("#start-date-export").val(startDateExport);
            $("#end-date-export").val(null);
            $(".mini-calendar-day").removeClass(
                "bg-red-300 bg-blue-500 bg-green-400"
            );
            $(this).addClass("bg-green-400");
            numberOfClicksExport++;
            break;
        case 1:
            if (formattedDate < startDateExport) {
                break;
            }
            endDateExport = formattedDate;
            $("#end-date-export").val(endDateExport);
            $(".mini-calendar-day").removeClass(
                "bg-red-300 bg-blue-500 bg-green-400"
            );
            $(this).addClass("bg-blue-500");
            numberOfClicksExport = 0;
            updateLists();
            break;
        default:
            break;
    }
    updateCalendarDayStyles(startDateExport, endDateExport);
});

function updateLists() {
    let startDate = $("#start-date-export").val();
    let endDate = $("#end-date-export").val();

    $.ajax({
        url: "/get-events-tasks",
        method: "GET",
        data: {
            start_date: startDate,
            end_date: endDate,
        },
        success: function (response) {
            // Обновляем списки событий и задач
            $("#events-select").empty();
            $("#tasks-select").empty();

            // Добавляем события в список
            response.events.forEach(function (event) {
                $("#events-select").append(
                    `
                    <label>
                        <input type="checkbox" name="events[]" value="${event.id}">
                        ${event.name} (${event.start_date} - ${event.end_date})
                    </label><br>
                    `
                );
            });

            // Добавляем задачи в список
            response.tasks.forEach(function (task) {
                $("#tasks-select").append(
                    `<option value="${task.id}">${task.name} (${task.start_date} - ${task.end_date})</option>`
                );
            });
        },
    });
}

$("#prev-month-export").on("click", function () {
    currentDateExport.setMonth(currentDateExport.getMonth() - 1);
    loadExport(currentDateExport.getFullYear(), currentDateExport.getMonth());
});

$("#next-month-export").on("click", function () {
    currentDateExport.setMonth(currentDateExport.getMonth() + 1);
    loadExport(currentDateExport.getFullYear(), currentDateExport.getMonth());
});

$("#next-btn").on("click", function () {
    if (startDateExport && endDateExport) {
        // Собираем все выбранные события (чекбоксы с именем events[])
        const events = $("input[name='events[]']:checked")
            .map(function () {
                return this.value;
            })
            .get();

        // Собираем все выбранные плановые работы (чекбоксы с именем tasks[])
        const tasks = $("input[name='tasks[]']:checked")
            .map(function () {
                return this.value;
            })
            .get();

        const comment = $("#comment").val() || "";

        if (events.length !== 0 || tasks.length !== 0) {
            $.ajax({
                url: "/export/step-2",
                type: "GET",
                data: {
                    start_date: startDateExport,
                    end_date: endDateExport,
                    events: events, // если это массив, передаем напрямую
                    tasks: tasks, // если это массив или строка
                    comment: comment, // комментарий
                },
                success: function (response) {
                    $("#content").html(response);
                },
                error: function (xhr, status, error) {
                    // Здесь обрабатываем ошибку
                    console.log("Ошибка: ", error);
                },
            });
        } else {
            alert(
                "Необходимо выбрать хотя бы одно событие или плановую работу!"
            );
        }
    } else {
        alert("Сначала нужно выбрать диапазон дат для экспорта!");
    }
});

$("#backup-btn").on("click", function () {
    $.ajax({
        url: "/export/backup",
        type: "POST",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (data) {
            alert(data.message);
        },
    });
});

$(document).on("click", "#back-btn", function () {
    location.reload(); // Перезагружает страницу
});

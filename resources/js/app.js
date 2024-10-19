"use strict";

import "./bootstrap";
$(document).ready(function () {
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
                $("#weather-widget").html(
                    "<div>Не удалось загрузить погоду</div>"
                );
            },
        });
    }

    $("#burger").on("click", function () {
        $(this).toggleClass("open");
        if ($(this).hasClass("open")) {
            $("#burger-modal")
                .removeClass("hidden")
                .addClass("flex")
                .hide()
                .fadeIn(300);
        } else {
            closeModal("#burger-modal");
        }
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
                    const lastStartDate = new Date(
                        startDate
                    ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });
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
                let direct = response.direct;

                $("#event-list").empty();
                $("#task-list").empty();
                $("#direct-list").empty();

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

                direct.forEach((directElement) => {
                    $("#direct-list").append(`
                        <li class="flex justify-between items-center w-full px-4 mb-2 bg-white rounded-[8px] text-black text-[20px]">
                            <p class="w-2/3 break-words">${directElement.name}</p>
                            <div class="w-1/4 flex justify-between items-center">
                                <button class="set-range bg-[#00CC66] rounded-md w-[23px] h-[23px] flex justify-center items-center" data-id="${directElement.id}" data-type="direct">${window.calendarIcon}</button>
                                <button class="delete-direct w-[21px] h-[21px]" data-id="${directElement.id}">${window.bucketIcon}</button>
                            </div>
                        </li>
                    `);
                });
            },
        });
    }

    $("#add-event").on("click", function () {
        // Показываем модальное окно
        $("#event-modal")
            .removeClass("hidden")
            .addClass("flex")
            .hide()
            .fadeIn(300);
        $("#event-name-input").trigger("focus");
    });

    $("#add-task").on("click", function () {
        // Показываем модальное окно
        $("#task-modal")
            .removeClass("hidden")
            .addClass("flex")
            .hide()
            .fadeIn(300);
        $("#task-name-input").trigger("focus");
    });

    $("#add-direct").on("click", function () {
        $.ajax({
            url: "/get-table-list", // Роут для получения списка таблиц
            method: "GET",
            data: {
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (tables) {
                $("#tableList").empty(); // Очищаем старый список

                // Добавляем таблицы в список
                Object.entries(tables).forEach(function ([key, value]) {
                    $("#tableList").append(
                        `<li class="table-item" data-table="${key}">${value}</li>`
                    );
                });

                // Открываем модальное окно
                $("#tableModal")
                    .removeClass("hidden")
                    .addClass("flex")
                    .hide()
                    .fadeIn(300);
                $(".table-item").first().trigger("click");
            },
        });
    });

    $(document).on("click", ".table-item", function () {
        let tableName = $(this).data("table");
        $(".table-item").removeClass("active");
        $(this).addClass("active");

        // Получаем данные выбранной таблицы
        $.ajax({
            url: "/get-table-data",
            method: "POST",
            data: {
                table: tableName,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                let columns = response.columns;
                let data = response.data;

                // Очищаем старые данные
                $("#dynamicTable thead tr").empty();
                $("#dynamicTable tbody").empty();

                // Добавляем заголовки
                $("#dynamicTable thead tr").append("<th></th>"); // Заголовок для чекбокса
                columns.forEach(function (column) {
                    $("#dynamicTable thead tr").append(
                        "<th>" + column + "</th>"
                    );
                });

                // Добавляем данные
                data.forEach(function (row) {
                    const values = Object.values(row).slice(0, -2); // Получаем все элементы, кроме последних двух
                    let rowHtml = "<tr>";
                    rowHtml +=
                        '<td><input type="checkbox" class="row-select" data-row-id="' +
                        row.id +
                        '"></td>'; // Чекбокс для выбора
                    values.forEach(function (rowElement) {
                        if (rowElement) {
                            rowHtml += "<td>" + rowElement + "</td>";
                        } else {
                            rowHtml += "<td></td>";
                        }
                    });
                    rowHtml += "<td></td>";
                    rowHtml += "</tr>";
                    $("#dynamicTable tbody").append(rowHtml);
                });

                // Показываем таблицу
                $("#dynamicTableContainer")
                    .removeClass("hidden")
                    .addClass("flex")
                    .hide()
                    .fadeIn(300);
            },
        });
    });

    $("#saveSelectionAgro").on("click", function () {
        let selectedRows = [];
        let tableName = $("#tableList .table-item.active").data("table");

        // Получаем все выбранные строки
        $(".row-select:checked").each(function () {
            const rowIdOther = $(this).data("row-id");
            const rowName = $(this).closest("tr").find("td:eq(2)").text();

            selectedRows.push({
                name: rowName,
                tableName: tableName,
                rowId: rowIdOther,
            }); // Сохраняем id выбранной строки
        });

        console.log(selectedRows);

        if (selectedRows.length === 0) {
            alert("Выберите хотя бы одно мероприятие!");
            return;
        }

        // Отправляем выбранные строки на сервер
        $.ajax({
            url: `/add-direct`, // Не забудьте обновить путь
            method: "POST",
            data: {
                selectedRows: selectedRows,
                start_date: $("#modal-date").text(),
                end_date: $("#modal-date").text(),
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                loadModalData($("#modal-date").text());
                closeModal("#tableModal"); // Закрываем модальное окно
                closeModal("#dynamicTableContainer"); // Закрываем модальное окно
            },
            error: function (err) {
                console.error("Error saving selection:", err);
            },
        });
    });

    $("#tableModal").on("click", function (e) {
        if (e.target === this) {
            closeModal("#tableModal");
            closeModal("#dynamicTableContainer");
        }
    });

    $("#dynamicTableContainer").on("click", function (e) {
        if (e.target === this) {
            closeModal("#tableModal");
            closeModal("#dynamicTableContainer");
        }
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
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
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
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
            },
        });
    });

    $(document).on("click", ".delete-direct", function () {
        let directId = $(this).data("id");
        $.ajax({
            url: `/delete-direct/${directId}`,
            method: "DELETE",
            data: { _token: $('meta[name="csrf-token"]').attr("content") },
            success: function () {
                loadModalData($("#modal-date").text());
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
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
    if ($("#calendar").length > 0) {
        $("#mini-calendar").on("click", ".mini-calendar-day", function () {
            let selectedDate = $(this).data("date");
            let day = selectedDate.split(".")[0];
            let month = selectedDate.split(".")[1];
            let year = selectedDate.split(".")[2];
            const formattedDate = formatDateCalendar(
                new Date(year, month - 1, day)
            );

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
    }

    function formatDateCalendar(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1; // Месяцы начинаются с 0
        let year = date.getFullYear();
        return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
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
        const [day, month, year] = date
            .split(".")
            .map((num) => parseInt(num, 10));
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
                    currentDateNow.toLocaleDateString() ===
                    end.toLocaleDateString()
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
                currentDateNow.toLocaleDateString() ===
                start.toLocaleDateString()
            ) {
                return "bg-green-300";
            }
        } else if (end) {
            if (
                currentDateNow.toLocaleDateString() === end.toLocaleDateString()
            ) {
                return "bg-green-500";
            }
        }

        return "bg-white";
    }

    $("#prev-month-calendar").on("click", function () {
        currentDateMiniCalendar.setMonth(
            currentDateMiniCalendar.getMonth() - 1
        );
        loadMiniCalendar(
            currentDateMiniCalendar.getFullYear(),
            currentDateMiniCalendar.getMonth(),
            startDate,
            endDate
        );
    });

    $("#next-month-calendar").on("click", function () {
        currentDateMiniCalendar.setMonth(
            currentDateMiniCalendar.getMonth() + 1
        );
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
                renderCalendar(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
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
            error: function (error) {},
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
            startDate.setMonth(
                startDate.getMonth() - (startDate.getMonth() % 3)
            ); // Переходим к началу квартала
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
                Math.round(
                    (endItemDate - startItemDate) / (1000 * 60 * 60 * 24)
                ) + 1;

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
                    columnStartDate.setMonth(
                        columnStartDate.getMonth() + i * 3
                    );
                    columnEndDate.setMonth(columnStartDate.getMonth() + 3);
                    columnEndDate.setDate(0); // Последний день квартала
                } else if (view === "year") {
                    columnStartDate.setFullYear(
                        columnStartDate.getFullYear() + i
                    );
                    columnEndDate.setFullYear(
                        columnStartDate.getFullYear() + 1
                    );
                    columnEndDate.setDate(0); // Последний день года
                }

                let $cell = $(
                    '<td class="border border-[#00CC6680] px-2"></td>'
                );

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
            label = `${date.getFullYear()} Q${
                Math.floor(date.getMonth() / 3) + 1
            }`;
        } else if (view === "year") {
            label = `${date.getFullYear()}`;
        }

        return label;
    }

    function formatDate(date) {
        return `${
            date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        }.${date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}`;
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

    function shouldPaintCell(
        startDate,
        endDate,
        columnStartDate,
        columnEndDate
    ) {
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
        const inFutureMonth =
            startDateOnly.getMonth() > columnStartDate.getMonth();

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
        const formattedDate = formatDateCalendar(
            new Date(year, month - 1, day)
        );

        switch (numberOfClicksExport) {
            case 0:
                startDateExport = formattedDate;
                endDateExport = null;
                $("#start-date-export").val(startDateExport);
                $("#end-date-export").val(null);
                $(".mini-calendar-day").removeClass(
                    "bg-green-300 bg-green-500 bg-green-400"
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
                    "bg-green-300 bg-green-500 bg-green-400"
                );
                $(this).addClass("bg-green-500");
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
        loadExport(
            currentDateExport.getFullYear(),
            currentDateExport.getMonth()
        );
    });

    $("#next-month-export").on("click", function () {
        currentDateExport.setMonth(currentDateExport.getMonth() + 1);
        loadExport(
            currentDateExport.getFullYear(),
            currentDateExport.getMonth()
        );
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

    //Field Journal
    let isProcessing = false; // Флаг для предотвращения многократных запросов

    $(".field-input").on("input", function () {
        let row = $(this).closest("tr");
        let id = row.find(".field-id").data("db-id"); // Получаем ID из строки

        let fullName = row.find(".full-name").val().trim();
        let rowBush = row.find(".row-bush").val().trim();
        let greenOperations = row.find(".green-operations").val().trim();
        let soilOperations = row.find(".soil-operations").val().trim();
        let fertilizerOperations = row
            .find(".fertilizer-operations")
            .val()
            .trim();
        let comments = row.find(".comments").val().trim();

        // Удаление строки, если все поля пустые и есть ID
        if (
            id !== "" &&
            fullName === "" &&
            rowBush === "" &&
            greenOperations === "" &&
            soilOperations === "" &&
            fertilizerOperations === "" &&
            comments === ""
        ) {
            $.ajax({
                url: "/field-journal/delete/" + id,
                type: "DELETE",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    row.find(".photo-preview").empty();
                    let photoInput = row.find(".photo-upload");
                    photoInput.removeClass("hidden");
                    photoInput.val("");
                    $("#photo-modal").addClass("hidden");
                    row.find(".field-id").data("db-id", "");
                    row.find(".created-at").text("");
                    row.find("input, textarea").val("");
                },
                error: function (xhr, status, error) {},
            });
        }

        // Создание новой записи, если ID пустой и данные введены, и операция не обрабатывается
        if (
            id === "" &&
            !isProcessing &&
            (fullName !== "" ||
                rowBush !== "" ||
                greenOperations !== "" ||
                soilOperations !== "" ||
                fertilizerOperations !== "" ||
                comments !== "")
        ) {
            isProcessing = true; // Блокируем повторное создание
            $.ajax({
                url: "/field-journal/create",
                type: "POST",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                    full_name: fullName,
                    row_bush: rowBush,
                    green_operations: greenOperations,
                    soil_operations: soilOperations,
                    fertilizer_operations: fertilizerOperations,
                    comments: comments,
                },
                success: function (response) {
                    // Присваиваем новый ID строке
                    row.find(".field-id").data("db-id", response.id);
                    row.find(".created-at").text(response.created_at);
                },
                error: function (xhr, status, error) {},
                complete: function () {
                    isProcessing = false; // Разблокируем после завершения
                },
            });
        }

        // Обновление записи, если есть ID и операция не обрабатывается
        if (id !== "" && !isProcessing) {
            $.ajax({
                url: "/field-journal/update/" + id,
                type: "POST",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                    full_name: fullName,
                    row_bush: rowBush,
                    green_operations: greenOperations,
                    soil_operations: soilOperations,
                    fertilizer_operations: fertilizerOperations,
                    comments: comments,
                },
                success: function (response) {},
                error: function (xhr, status, error) {},
            });
        }
    });

    // Обработка загрузки фото
    $(".photo-upload").on("change", function () {
        let row = $(this).closest("tr");
        let id = row.find(".field-id").data("db-id");
        let formData = new FormData();
        formData.append("photo", this.files[0]);
        formData.append("_token", $('meta[name="csrf-token"]').attr("content"));

        $.ajax({
            url: "/field-journal/upload-photo/" + id,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Прячем инпут загрузки и отображаем превью
                row.find(".photo-upload").addClass("hidden");
                row.find(".photo-preview").html(
                    `<img src="${response.photo}" class="w-16 h-16 object-cover cursor-pointer">`
                );
            },
            error: function (xhr) {},
        });
    });

    // Открытие модального окна для фото
    $(document).on("click", ".photo-preview img", function () {
        let imgSrc = $(this).attr("src");
        let row = $(this).closest("tr");
        let id = row.find(".field-id").data("db-id");

        $("#modal-photo").attr("src", imgSrc);
        $("#photo-modal")
            .removeClass("hidden")
            .addClass("flex")
            .hide()
            .fadeIn(300);

        // Замена фото
        $("#replace-photo-input").on("change", function () {
            let formData = new FormData();
            formData.append("photo", this.files[0]);
            formData.append(
                "_token",
                $('meta[name="csrf-token"]').attr("content")
            );

            $.ajax({
                url: "/field-journal/upload-photo/" + id,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    row.find(".photo-preview img").attr("src", response.photo);
                    $("#modal-photo").attr("src", response.photo);
                },
                error: function (xhr) {},
            });
        });

        // Удаление фото
        $("#delete-photo-btn").on("click", function () {
            $.ajax({
                url: "/field-journal/delete-photo/" + id,
                type: "DELETE",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    row.find(".photo-preview").empty();
                    let photoInput = row.find(".photo-upload");
                    photoInput.removeClass("hidden");
                    photoInput.val("");
                    $("#photo-modal").addClass("hidden");
                },
                error: function (xhr) {},
            });
        });
    });

    // Закрытие модального окна
    $("#photo-modal").on("click", function (e) {
        if (e.target === this) {
            closeModal("#photo-modal");
        }
    });

    //DIRECTORIES
    if ($("#table-container").length > 0) {
        let tableName = $(".table-btn.active").data("table"); // Имя текущей таблицы
        let currentRowId; // ID текущей строки, для которой открыто модальное окно

        let operCurrentRow = 0;

        let startDateDirect = null;
        let endDateDirect = null;
        let numberOfClicksDirect = 0;
        const storagePath = $("#storage").data("storage");

        const columnHandlers = {
            phenophases: {
                "Агротехнические операции": (row) =>
                    `мероприятия - ${
                        row.operations ? row.operations.length : 0
                    }`,
                Наименование: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                Месяц: () => `
                    <div class="flex items-center">
                        <img src="/svg/calendar_icon.svg" alt="Calendar Icon" class="w-6 h-6">
                    </div>`,
                Описание: (row) =>
                    `<textarea class="direct-input resize-none" name="description">${
                        row.description || ""
                    }</textarea>`,
            },
            agro_operations: {
                Наименование: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                Сроки: () => `
                    <div class="flex items-center">
                        <img src="/svg/calendar_icon.svg" alt="Calendar Icon" class="w-6 h-6">
                    </div>`,
                Описание: (row) =>
                    `<textarea class="direct-input resize-none" name="description">${
                        row.description || ""
                    }</textarea>`,
            },
            meteodatas: {
                "Дата обновления": (row) =>
                    `<input type="text" class="direct-input" name="date" value="${
                        row.date || ""
                    }" />`,
                Батарея: (row) =>
                    `<input type="text" class="direct-input" name="battery" value="${
                        row.battery || ""
                    }" />`,
                "Солнечная активность": (row) =>
                    `<input type="text" class="direct-input" name="sun_activity" value="${
                        row.sun_activity || ""
                    }" />`,
                "min t°": (row) =>
                    `<input type="number" class="direct-input" name="min_t" value="${
                        row.min_t || ""
                    }" />`,
                "max t°": (row) =>
                    `<input type="number" class="direct-input" name="max_t" value="${
                        row.max_t || ""
                    }" />`,
                "avg t°": (row) =>
                    `<input type="number" class="direct-input" name="avg_t" value="${
                        row.avg_t || ""
                    }" />`,
                "Относительная влажность": (row) =>
                    `<input type="text" class="direct-input" name="humidity" value="${
                        row.humidity || ""
                    }" />`,
                "Влажность листа": (row) =>
                    `<input type="text" class="direct-input" name="humidity_letter" value="${
                        row.humidity_letter || ""
                    }" />`,
                "Почва t°": (row) =>
                    `<input type="number" class="direct-input" name="ground_t" value="${
                        row.ground_t || ""
                    }" />`,
            },
            climatic_parametres: {
                "Сумма температур, 10 ℃": (row) =>
                    `<input type="number" class="direct-input" name="sum_t_ten" value="${
                        row.sum_t_ten || ""
                    }" />`,
                "Сумма температур, 20 ℃": (row) =>
                    `<input type="number" class="direct-input" name="sum_t_twenty" value="${
                        row.sum_t_twenty || ""
                    }" />`,
                "Хуглина Индекс": (row) =>
                    `<input type="number" class="direct-input" name="ind_hug" value="${
                        row.ind_hug || ""
                    }" />`,
                "Уинклера Индекс": (row) =>
                    `<input type="number" class="direct-input" name="ind_uink" value="${
                        row.ind_uink || ""
                    }" />`,
                "Средняя температура в сентября, ℃": (row) =>
                    `<input type="number" class="direct-input" name="avg_t_spt" value="${
                        row.avg_t_spt || ""
                    }" />`,
                "Средняя температура за вегетационный период, ℃": (row) =>
                    `<input type="number" class="direct-input" name="avg_t_veget" value="${
                        row.avg_t_veget || ""
                    }" />`,
                ГТК: (row) =>
                    `<input type="number" class="direct-input" name="gtk" value="${
                        row.gtk || ""
                    }" />`,
                "Годовое количество осадков, мм": (row) =>
                    `<input type="number" class="direct-input" name="ann_precip" value="${
                        row.ann_precip || ""
                    }" />`,
                "Количество осадков за вегетационный период, мм": (row) =>
                    `<input type="number" class="direct-input" name="precip" value="${
                        row.precip || ""
                    }" />`,
                "Количество осадков в сентябре, мм": (row) =>
                    `<input type="number" class="direct-input" name="spt_precip" value="${
                        row.spt_precip || ""
                    }" />`,
            },
            plotdatas: {
                Владелец: (row) =>
                    `<input type="text" class="direct-input" name="host" value="${
                        row.host || ""
                    }" />`,
                "Номер участка": (row) =>
                    `<input type="text" class="direct-input" name="plot_num" value="${
                        row.plot_num || ""
                    }" />`,
                "Географические координаты": (row) =>
                    `<input type="text" class="direct-input" name="coords" value="${
                        row.coords || ""
                    }" />`,
                Площадь: (row) =>
                    `<input type="text" class="direct-input" name="square" value="${
                        row.square || ""
                    }" />`,
                "Ряды кол-во": (row) =>
                    `<input type="text" class="direct-input" name="rows_num" value="${
                        row.rows_num || ""
                    }" />`,
                "Год и месяц посадки": (row) =>
                    `<input type="text" class="direct-input" name="year_mon" value="${
                        row.year_mon || ""
                    }" />`,
                Сорт: (row) =>
                    `мероприятия - ${
                        row.operations ? row.operations.length : 0
                    }`,
                "Подвой/привой": (row) =>
                    `<input type="text" class="direct-input" name="rootstock" value="${
                        row.rootstock || ""
                    }" />`,
                "Схема посадки": (row) =>
                    `<input type="text" class="direct-input" name="schema" value="${
                        row.schema || ""
                    }" />`,
                "Кол-во кустов": (row) =>
                    `<input type="text" class="direct-input" name="bush_num" value="${
                        row.bush_num || ""
                    }" />`,
                "Способ посадки": (row) =>
                    `<input type="text" class="direct-input" name="ways" value="${
                        row.ways || ""
                    }" />`,
                "Способ орошения": (row) =>
                    `<input type="text" class="direct-input" name="ways_orosh" value="${
                        row.ways_orosh || ""
                    }" />`,
                Шпалера: (row) =>
                    `<input type="text" class="direct-input" name="shpalera" value="${
                        row.shpalera || ""
                    }" />`,
            },
            sorts: {
                Название: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                Описание: (row) =>
                    `<textarea class="direct-input resize-none" name="description">${
                        row.description || ""
                    }</textarea>`,
                "Фото ягод": (row) =>
                    `<div class="photo-upload">
                        ${
                            row.photo_berry
                                ? `<img src="${
                                      storagePath + "/" + row.photo_berry
                                  }" class="thumbnail h-[75px]" alt="Фото ягод" />
                            <button class="delete-photo-btn" data-photo="photo_berry">Удалить фото</button>`
                                : `<input type="file" name="photo_berry" class="upload-photo" />`
                        }
                    </div>`,
                "Фото листа": (row) =>
                    `<div class="photo-upload">
                        ${
                            row.photo_piece
                                ? `<img src="${
                                      storagePath + "/" + row.photo_piece
                                  }" class="thumbnail h-[75px]" alt="Фото листа" />
                            <button class="delete-photo-btn" data-photo="photo_piece">Удалить фото</button>`
                                : `<input type="file" name="photo_piece" class="upload-photo" />`
                        }
                    </div>`,
                "Хар-ки": (row) =>
                    `<input type="text" class="direct-input" name="parametres" value="${
                        row.parametres || ""
                    }" />`,
                "Сроки созревания": (row) =>
                    `<input type="text" class="direct-input" name="time_to_grow" value="${
                        row.time_to_grow || ""
                    }" />`,
                Сахаристость: (row) =>
                    `<input type="text" class="direct-input" name="sugar" value="${
                        row.sugar || ""
                    }" />`,
                Кислотность: (row) =>
                    `<input type="text" class="direct-input" name="toxic" value="${
                        row.toxic || ""
                    }" />`,
                "Коэфф-т плодоносности": (row) =>
                    `<input type="text" class="direct-input" name="koef_baby" value="${
                        row.koef_baby || ""
                    }" />`,
                "Нагрузка куста": (row) =>
                    `<input type="text" class="direct-input" name="bush_u" value="${
                        row.bush_u || ""
                    }" />`,
                Урожайность: (row) =>
                    `<input type="text" class="direct-input" name="babywork" value="${
                        row.babywork || ""
                    }" />`,
                "Устойчивость к болезням": (row) =>
                    `<input type="text" class="direct-input" name="stable_sick" value="${
                        row.stable_sick || ""
                    }" />`,
                "Устойчивость к засухе": (row) =>
                    `<input type="text" class="direct-input" name="stable_thirst" value="${
                        row.stable_thirst || ""
                    }" />`,
                Морозоустойчивость: (row) =>
                    `<input type="text" class="direct-input" name="stable_froze" value="${
                        row.stable_froze || ""
                    }" />`,
            },
            sicks: {
                Наименование: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                Возбудитель: (row) =>
                    `<input type="text" class="direct-input" name="pathogen" value="${
                        row.pathogen || ""
                    }" />`,
                Вредоносность: (row) =>
                    `<input type="text" class="direct-input" name="severity" value="${
                        row.severity || ""
                    }" />`,
                Симптомы: (row) =>
                    `<input type="text" class="direct-input" name="symptoms" value="${
                        row.symptoms || ""
                    }" />`,
                Фото: (row) =>
                    `<div class="photo-upload">
                        ${
                            row.photo_url
                                ? `<img src="${
                                      storagePath + "/" + row.photo_url
                                  }" class="thumbnail h-[75px]" alt="Фото листа" />
                            <button class="delete-photo-btn" data-photo="photo_url">Удалить фото</button>`
                                : `<input type="file" name="photo_url" class="upload-photo" />`
                        }
                    </div>`,
                "Биология патогена": (row) =>
                    `<input type="text" class="direct-input" name="biology" value="${
                        row.biology || ""
                    }" />`,
                "Защитные мероприятия": (row) =>
                    `<input type="text" class="direct-input" name="shield" value="${
                        row.shield || ""
                    }" />`,
            },
            people: {
                ФИО: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                "Функциональные обязанности": (row) =>
                    `<input type="text" class="direct-input" name="func_needs" value="${
                        row.func_needs || ""
                    }" />`,
                Телефон: (row) =>
                    `<input type="phone" class="direct-input" name="phone" value="${
                        row.phone || ""
                    }" />`,
                Комментарии: (row) =>
                    `<textarea class="direct-input resize-none" name="comments">${
                        row.comments || ""
                    }</textarea>`,
            },
            func_needs: {
                ФИО: (row) =>
                    `<input type="text" class="direct-input" name="name" value="${
                        row.name || ""
                    }" />`,
                "Функциональные обязанности": (row) =>
                    `<input type="text" class="direct-input" name="func_needs" value="${
                        row.func_needs || ""
                    }" />`,
            },
            green_defends: {
                "Фазы развития": (row) =>
                    `<input type="text" class="direct-input" name="phases" value="${
                        row.phases || ""
                    }" />`,
                Период: () => `
                    <div class="flex items-center">
                        <img src="/svg/calendar_icon.svg" alt="Calendar Icon" class="w-6 h-6">
                    </div>`,
                "Обработка от болезней": (row) =>
                    `<input type="text" class="direct-input" name="processing" value="${
                        row.processing || ""
                    }" />`,
                "Количество операций": (row) =>
                    `<input type="text" class="direct-input" name="number_operations" value="${
                        row.number_operations || ""
                    }" />`,
            },
        };

        $(".table-btn").on("click", function (e) {
            e.preventDefault();
            $(".table-btn").removeClass("active");
            $(this).addClass("active");
            tableName = $(this).data("table");
            loadRows(tableName);
        });

        // Загрузка сохранённых строк при загрузке страницы
        loadRows(tableName);

        // Функция для загрузки строк
        function loadRows(tableName) {
            $("#table-container tbody").empty();
            $("#phenophases-table-thead").empty();

            $.ajax({
                url: `/directory/${tableName}`,
                method: "GET",
                success: function (data) {
                    data.tableHeads.forEach(function (header) {
                        appendHead(header);
                    });
                    data.rows.forEach(function (row) {
                        appendRow(row, tableName, data.headerMapping);
                    });
                },
                error: function (err) {
                    console.error("Error loading rows:", err);
                },
            });
        }

        $(document).on("click", ".agro-operations-cell", function () {
            const rowId = $(this).closest("tr").data("id");
            openAgroModal(rowId);
        });

        function openAgroModal(rowId) {
            operCurrentRow = currentRowId = rowId;
            $("#modal-agro-operations")
                .removeClass("hidden")
                .addClass("flex")
                .hide()
                .fadeIn(300);

            // Получаем список мероприятий для строки
            $.ajax({
                url: `/directory/${tableName}/${rowId}/operations`,
                method: "GET",
                success: function (response) {
                    const operations = response.operations;
                    const operationsList = $("#agro-operations-list");
                    operationsList.empty();

                    operations.forEach(function (operation) {
                        const listItem = `<li data-id="${operation.id}">
                        ${operation.name}
                        <button class="delete-operation-btn" data-id="${operation.id}">Удалить</button>
                    </li>`;
                        operationsList.append(listItem);
                    });
                },
                error: function (err) {
                    console.error("Error fetching operations:", err);
                },
            });
        }

        $("#modal-agro-operations").on("click", function (e) {
            if (e.target === this) {
                closeModal("#modal-agro-operations");
            }
        });

        $(document).on("click", ".delete-operation-btn", function () {
            const operationId = $(this).data("id");

            $.ajax({
                url: `/directory/${tableName}/${currentRowId}/operations/delete/${operationId}`,
                method: "DELETE",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    openAgroModal(currentRowId); // Обновляем список мероприятий
                    const operationsCount = response.operations.length;
                    $(
                        `tr[data-id="${currentRowId}"] .agro-operations-cell`
                    ).text(`мероприятия - ${operationsCount}`);
                },
                error: function (err) {
                    console.error("Error deleting operation:", err);
                },
            });
        });

        // Добавить пустую строку
        $("#add-row-btn").on("click", function () {
            $.ajax({
                url: `/directory/${tableName}/create`,
                method: "POST",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    const newRow = response.row;
                    appendRow(newRow, tableName, response.tableHeads); // Добавляем строку с уже сгенерированным ID
                },
                error: function (err) {
                    console.error("Error creating row:", err);
                },
            });
        });

        // Функция для добавления строки в таблицу
        function appendRow(row, tableName, headerMapping) {
            const headers = columnHandlers[tableName] || {};
            const newRow = $("<tr>")
                .attr("data-id", row.id)
                .addClass("h-[75px]");

            // Итерируемся по заголовкам, которые пришли с сервера
            const tableHeads = Object.keys(headerMapping); // Получаем заголовки из маппинга
            tableHeads.forEach((header) => {
                let cellContent;

                // Проверяем, есть ли обработчик для текущего заголовка
                if (headers[header]) {
                    cellContent = headers[header](row);
                    if (headerMapping[header] === "month") {
                        newRow.append(
                            $("<td>")
                                .addClass("date-cell cursor-pointer h-full")
                                .attr("data-table", tableName)
                                .attr("data-id", row.id)
                                .html(cellContent)
                        );
                    } else if (
                        headerMapping[header] === "agrotechnical_operations" ||
                        headerMapping[header] === "sort"
                    ) {
                        newRow.append(
                            $("<td>")
                                .addClass("agro-operations-cell h-full")
                                .attr("data-table", tableName)
                                .attr("data-id", row.id)
                                .html(cellContent)
                        );
                    } else {
                        newRow.append(
                            $("<td>").html(cellContent).addClass("h-full")
                        );
                    }
                } else {
                    // Получаем английский ключ для текущего заголовка
                    const rowKey = headerMapping[header]; // Получаем ключ из headerMapping

                    if (rowKey === "actions") {
                        return;
                    }

                    if (rowKey === "duration") {
                        cellContent = row[rowKey] ? row[rowKey] : 0;
                        newRow.append($("<td>").html(cellContent));
                        return;
                    }

                    // Проверяем наличие свойства в row
                    cellContent = row[rowKey] ? row[rowKey] : "";
                    newRow.append(
                        $("<td>").html(cellContent).addClass("h-full")
                    );
                }
            });

            // Добавляем кнопку удаления в последнюю ячейку
            newRow.append(`
            <td>
                <button class="delete-row-btn" data-id="${row.id}" data-table="${tableName}">Удалить</button>
            </td>
        `);

            // Добавляем новую строку в таблицу
            $("#phenophases-table-body").append(newRow);
        }

        function appendHead(header) {
            const head = `<th>${header}</th>`;
            $("#phenophases-table-thead").append(head);
        }

        // Автосохранение при изменении инпутов
        $(document).on("change", ".direct-input", function () {
            const rowElement = $(this).closest("tr"); // Находим строку таблицы
            const rowId = rowElement.data("id"); // Получаем ID строки
            const formData = {}; // Объект для хранения данных инпутов

            // Проходим по всем инпутам с классом .direct-input в текущей строке
            rowElement.find(".direct-input").each(function () {
                const inputName = $(this).attr("name"); // Получаем имя инпута (name атрибут)
                const inputValue = $(this).val(); // Получаем значение инпута
                // Проверяем, что инпут не пустой
                formData[inputName] = inputValue; // Добавляем данные в объект
            });

            // Добавляем CSRF токен
            formData._token = $('meta[name="csrf-token"]').attr("content");

            // Отправляем данные на сервер
            $.ajax({
                url: `/directory/${tableName}/update/${rowId}`,
                method: "POST",
                data: formData, // Передаем объект с данными инпутов
                success: function (response) {},
                error: function (err) {
                    console.error("Error updating row:", err);
                },
            });
        });

        // Удалить строку
        $(document).on("click", ".delete-row-btn", function () {
            const rowId = $(this).data("id");
            const table = $(this).data("table");
            $.ajax({
                url: `/directory/${table}/delete/${rowId}`,
                type: "DELETE",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    $(`button[data-id="${rowId}"]`).closest("tr").remove();
                },
                error: function (xhr) {},
            });
        });

        $(document).on("click", ".date-cell", function () {
            let table = $(this).data("table");
            let rowId = $(this).data("id");

            updateCalendarDayStyles(null, null);

            loadDateRanges(rowId);

            $("#range-modal")
                .data("table", table)
                .data("rowId", rowId)
                .removeClass("hidden")
                .addClass("flex")
                .hide()
                .fadeIn(300);
            loadMiniCalendar(
                currentDateMiniCalendar.getFullYear(),
                currentDateMiniCalendar.getMonth(),
                null,
                null
            );
        });

        $(document).on("click", "#add-date-range", function () {
            loadMiniCalendar(
                currentDateMiniCalendar.getFullYear(),
                currentDateMiniCalendar.getMonth(),
                null,
                null
            );
            $("#mini-calendar-container")
                .removeClass("hidden")
                .addClass("flex")
                .hide()
                .fadeIn(300);
        });

        function loadDateRanges(rowId) {
            $.ajax({
                url: `/get-date-ranges/${tableName}/${rowId}`,
                method: "GET",
                success: function (response) {
                    $("#date-ranges-list").empty();
                    response.forEach((range) => {
                        $("#date-ranges-list").append(`
                        <div class="date-range-item" data-range-id="${
                            range.id
                        }">
                            ${new Date(range.start_date).toLocaleDateString(
                                "ru-RU",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }
                            )} - 
                            ${new Date(range.end_date).toLocaleDateString(
                                "ru-RU",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }
                            )}
                            <button class="remove-date-range" data-range-id="${
                                range.id
                            }">Удалить</button>
                        </div>
                    `);
                    });
                },
            });
        }

        $("#mini-calendar").on("click", ".mini-calendar-day", function () {
            let selectedDate = $(this).data("date");
            let day = selectedDate.split(".")[0];
            let month = selectedDate.split(".")[1];
            let year = selectedDate.split(".")[2];
            const formattedDate = formatDateCalendar(
                new Date(year, month - 1, day)
            );

            switch (numberOfClicksDirect) {
                case 0:
                    startDateDirect = formattedDate;
                    endDateDirect = null;
                    $("#start-date-direct").val(startDateDirect);
                    $("#end-date-direct").val(null);
                    $(".mini-calendar-day").removeClass(
                        "bg-green-300 bg-green-500 bg-green-400"
                    );
                    $(this).addClass("bg-green-400");
                    numberOfClicksDirect++;
                    break;
                case 1:
                    if (formattedDate < startDateDirect) {
                        startDateDirect = formattedDate;
                        endDateDirect = null;
                        $("#start-date-direct").val(startDateDirect);
                        $("#end-date-direct").val(null);
                        $(".mini-calendar-day").removeClass(
                            "bg-green-300 bg-green-500 bg-green-400"
                        );
                        $(this).addClass("bg-green-400");
                        break;
                    }
                    endDateDirect = formattedDate;
                    $("#end-date-direct").val(endDateDirect);
                    $(".mini-calendar-day").removeClass(
                        "bg-green-300 bg-green-500 bg-green-400"
                    );
                    $(this).addClass("bg-green-500");
                    numberOfClicksDirect = 0;
                    saveDateRangeDirect();
                    closeModal("#mini-calendar-container");
                    break;
                default:
                    break;
            }
            updateCalendarDayStyles(startDateDirect, endDateDirect);
        });

        function saveDateRangeDirect() {
            let table = $("#range-modal").data("table");
            let rowId = $("#range-modal").data("rowId");

            $.ajax({
                url: `/set-date-range/${table}/${rowId}`,
                method: "POST",
                data: {
                    start_date: $("#start-date-direct").val(),
                    end_date: $("#end-date-direct").val(),
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    loadDateRanges(rowId);
                    loadRows(tableName);
                },
            });
        }

        $(document).on("click", ".remove-date-range", function () {
            let rangeId = $(this).data("range-id");
            let table = $("#range-modal").data("table");
            let rowId = $("#range-modal").data("rowId");

            $.ajax({
                url: `/remove-date-range/${table}/${rowId}/${rangeId}`,
                method: "POST",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    loadDateRanges(rowId); // Перезагружаем список
                    loadRows(tableName);
                },
            });
        });

        $(document).on("change", ".upload-photo", function () {
            const rowId = $(this).closest("tr").data("id"); // Получаем ID строки
            let formData = new FormData();
            formData.append("photo", this.files[0]);
            formData.append("column", $(this).attr("name"));
            formData.append(
                "_token",
                $('meta[name="csrf-token"]').attr("content")
            );

            $.ajax({
                url: `/upload-photo/${tableName}/${rowId}`,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    // Заменяем инпут миниатюрой загруженного фото
                    loadRows(tableName);
                },
                error: function (xhr) {
                    alert("Ошибка загрузки фото");
                },
            });
        });

        $(document).on("click", ".delete-photo-btn", function () {
            let column = $(this).data("photo");
            let rowId = $(this).closest("tr").data("id");

            $.ajax({
                url: `/delete-photo/${tableName}/${rowId}`,
                type: "DELETE",
                data: {
                    column: column,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    // Заменяем миниатюру инпутом для загрузки
                    loadRows(tableName);
                },
                error: function (xhr) {
                    alert("Ошибка удаления фото");
                },
            });
        });

        $(document).on("click", "#add-operation-btn", function () {
            let rowId = operCurrentRow;
            $.ajax({
                url: "/get-table-list", // Роут для получения списка таблиц
                method: "GET",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (tables) {
                    $("#tableList").empty(); // Очищаем старый список

                    // Добавляем таблицы в список
                    Object.entries(tables).forEach(function ([key, value]) {
                        $("#tableList").append(
                            `<li class="table-item" data-table="${key}">${value}</li>`
                        );
                    });

                    // Открываем модальное окно
                    $("#tableModal")
                        .removeClass("hidden")
                        .addClass("flex")
                        .hide()
                        .fadeIn(300);
                    $(".table-item").first().trigger("click");
                },
            });
            $("#saveSelection").attr("data-id", rowId);
        });

        // Сохранение выбранных данных (если нужно)
        $("#saveSelection").on("click", function () {
            let currentRowId = $(this).data("id");
            let tableName = $(".table-btn.active").data("table");
            let selectedRows = [];

            // Получаем все выбранные строки
            $(".row-select:checked").each(function () {
                const rowIdOther = $(this).data("row-id");
                const rowName = $(this).closest("tr").find("td:eq(2)").text();

                selectedRows.push({
                    id: rowIdOther,
                    name: rowName,
                }); // Сохраняем id выбранной строки
            });

            if (selectedRows.length === 0) {
                alert("Выберите хотя бы одно мероприятие!");
                return;
            }

            console.log(selectedRows);

            // Отправляем выбранные строки на сервер
            $.ajax({
                url: `/directory/${tableName}/${currentRowId}/operations/add`, // Не забудьте обновить путь
                method: "POST",
                data: {
                    selectedRows: selectedRows,
                    rowId: currentRowId,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    const operationsCount = response.operations.length;
                    $(
                        `tr[data-id="${currentRowId}"] .agro-operations-cell`
                    ).text(`мероприятия - ${operationsCount}`);
                    openAgroModal(currentRowId);
                    closeModal("#tableModal"); // Закрываем модальное окно
                    closeModal("#dynamicTableContainer"); // Закрываем модальное окно
                },
                error: function (err) {
                    console.error("Error saving selection:", err);
                },
            });
        });
    }
});

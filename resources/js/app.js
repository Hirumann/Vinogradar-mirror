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

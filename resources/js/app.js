import './bootstrap';
import $ from 'jquery';
window.$ = window.jQuery = $;

const $content = $('#scrollable-content');
const $scrollbar = $('#custom-scrollbar');

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

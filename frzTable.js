(function ($) {
  const tableConfigs = {};
  $.fn.frzTable = function (options) {
    const $table = $(this);
    const defaults = {
      // 此為預設參數: usage 的參數透過 options 覆蓋掉
      count: { slide: 1, show: 3 },
      speed: 0.3,
      whenClick: whenClick,
    };
    // frzTable fn 帶入的 options 傳入的規格，會取代上面的 settings
    const settings = $.extend(defaults, options);

    // 計算表格滾動的位置
    let position = 0;

    // whenClick 點擊效果 (options 的 whenClick 會覆蓋原有設定)
    function whenClick() {
      $element.addClass('choose');
    }

    $(function () {
      if ($(window).width() <= 980) {
        checkWidth();
      } else {
        const column = $table.children('.content').children('.column');
        column.css({ width: '' });
      }
    });

    // 每次 resize 都要重置箭頭是否出現、和position位置
    function resizeHandler() {
      if ($(window).width() <= 980) {
        resetPositionAndButtons();
        checkWidth();
      } else {
        resetColumnsAndPosition();
      }
    }
    function resetPositionAndButtons() {
      position = 0;
      $table.children('.content').css({ right: 0 });
      $table.children('.previous').hide();
      $table.children('.next').show();
    }

    function resetColumnsAndPosition() {
      const column = $table.children('.content').children('.column');
      column.css({ width: '' });
      $table.children('.content').css({ right: 0 });
      position = 0;
    }

    $(window).on('resize', debounce(resizeHandler, 200));

    $(function () {
      const length = $table.children('.content').children('.column').length;
      $table.children('.next').on('click', function () {
        if (position >= length) {
          return;
        }
        slideColumns(settings, '+');
      });
      $table.children('.previous').on('click', function () {
        if (position == 0) {
          return;
        }
        slideColumns(settings, '-');
      });
    });

    const type = $table.hasClass('default') ? 'default' : 'rel';
    // 將不同 options config 存入 tableConfigs'
    tableConfigs[type] = options;

    function checkWidth() {
      const tableColumns = {};
      const tableLengths = {};
      const type = $table.hasClass('default') ? 'default' : 'rel';
      const typeColumns = $table.children('.content').children('.column');
      tableColumns[type] = typeColumns;
      tableLengths[type] = typeColumns.length;

      if ($table.hasClass('default')) {
        const defaultSettings = tableConfigs[type];
        adjustColumns($table, defaultSettings.count, tableColumns[type]);
      } else if ($table.hasClass('rel')) {
        const relSettings = tableConfigs[type];
        adjustColumns($table, relSettings.count, tableColumns[type]);
      }
    }

    function adjustColumns($table, count, columns) {
      // 現在螢幕寬度
      const screenWidth = $(window).width();
      // first-col width
      const firtsCol = $table.find('.first-col').width();
      // 需要顯示的欄位數量
      const showCol = count.show;
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度
      const columnWidth = (screenWidth - firtsCol - 32) / showCol;
      const frzTableWidth = firtsCol + columnWidth * showCol;

      $('.frzTable').width(frzTableWidth);
      $(columns).width(columnWidth);

      // 按照 adjustColumns 去調整 previous/next 出現的位置
      $table.children('.previous').hide();
      $table.children('.next').css({
        left: `${firtsCol + columnWidth * showCol - 18}px`,
      });
    }

    function checkBottomPosition(slide, showCol, length) {
      return position + showCol + slide > length - 1;
    }

    function checkStartPosition(slide) {
      return position - slide < 0;
    }

    function slideColumns(setting, direction) {
      const column = $table.children('.content').children('.column');
      const colWidth = column.width();
      const length = column.length;

      const showCol = setting.count.show;
      const slide = setting.count.slide;
      const speed = setting.speed;
      const distance = colWidth * slide;

      const overEndPoint =
        direction === '+' && checkBottomPosition(slide, showCol, length);
      const overStartPoint = direction === '-' && checkStartPosition(slide);
      //  在用原本的position 判斷完是否超過起點或終點，在計算新的 position
      if (direction === '+') {
        position = position + slide;
      } else if (direction === '-') {
        position = position - slide;
      }
      // 並用CSS 更新新的位置
      if (overEndPoint) {
        position = length - showCol;
        $table
          .children('.content')
          .animate(
            { right: `${(length - showCol) * colWidth}` },
            { duration: speed * 1000, easing: 'linear' }
          );
      } else if (overStartPoint) {
        position = 0;
        $table
          .children('.content')
          .animate({ right: 0 }, { duration: speed * 1000, easing: 'linear' });
      } else {
        $table
          .children('.content')
          .animate(
            { right: `${direction}=${distance}` },
            { duration: speed * 1000, easing: 'linear' }
          );
      }

      if (position >= length - 1 || position + showCol === length) {
        $table.children('.next').hide();
      } else {
        $table.children('.next').show();
      }
      if (position > 0) {
        $table.children('.previous').show();
      } else {
        $table.children('.previous').hide();
      }
    }

    return this.each(function () {
      // 將目前處理的 .frzTable 元素（即插件套用的元素）轉換成 jQuery 物件
      const $table = $(this);
      // 分別有 default 和 rel table
      const whenClick = settings.whenClick;

      // 其他插件的邏輯
      $table.find('.item').click(function () {
        whenClick($(this)); // 呼叫 whenClick 函數
      });
    });
  };
})(jQuery);

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

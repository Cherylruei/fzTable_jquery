(function ($) {
  const tableConfigs = {};
  $.fn.frzTable = function (options) {
    const settings = $.extend(
      {
        // 此為預設參數: usage 的參數透過 options 覆蓋掉
        count: { slide: 1, show: 3 },
        speed: 0.3,
        whenClick: whenClick,
      },
      // frzTable fn 帶入的 options 傳入的規格，會取代上面的 settings
      options
    );

    // whenClick 點擊效果 (options 的 whenClick 會覆蓋原有設定)
    function whenClick() {
      $element.addClass('choose');
    }

    // 計算表格滾動的位置
    let defaulPosition = 0;
    let relPosition = 0;

    $(window).on(
      'resize',
      debounce(function () {
        if ($(window).width() < 430) {
          checkWidth();
        } else {
          // 大於430 恢復本來的寬度
          $('.default .column').width(100);
          $('.rel .column').width(136);
          defaulPosition = 0;
          relPosition = 0;
        }
      }, 300)
    );

    $(function () {
      if ($(window).width() < 430) {
        checkWidth();
        $('.previous.default').hide();
        $('.previous.rel').hide();
      } else {
        $('.default .column').width(100);
        $('.rel .column').width(136);
      }
    });

    $(function () {
      const defaultSetting = tableConfigs['default'];
      const relSetting = tableConfigs['rel'];
      $('.next.default').on('click', function () {
        defaulPosition++;
        slideColumns(defaultSetting, '+=');
      });
      $('.previous.default').on('click', function () {
        if (defaulPosition == 0) {
          return;
        }
        defaulPosition--;
        slideColumns(defaultSetting, '-=');
      });
      $('.next.rel').on('click', function () {
        relPosition++;
        slideColumns(relSetting, '+=');
      });

      $('.previous.rel').on('click', function () {
        relPosition--;
        slideColumns(relSetting, '-=');
      });
    });

    const $table = $(this);
    const type = $table.hasClass('default') ? 'default' : 'rel';
    // 將不同 options config 存入 tableConfigs'
    tableConfigs[type] = options;

    function checkWidth() {
      $('.content').css({ position: 'relative', right: 0 });
      const tableColumns = {};
      const tableLengths = {};
      const type = $table.hasClass('default') ? 'default' : 'rel';
      const typeColumns = $table.children('.content').children('.column');
      tableColumns[type] = typeColumns;
      tableLengths[type] = typeColumns.length;

      if ($table.hasClass('default')) {
        const defaultSettings = tableConfigs[type];
        adjustColumns(defaultSettings.count, tableColumns[type]);
      } else if ($table.hasClass('rel')) {
        const relSettings = tableConfigs[type];
        adjustColumns(relSettings.count, tableColumns[type]);
      }
    }

    function slideColumns(setting, direction) {
      // 現在螢幕寬度
      const screenWidth = $(window).width();
      // first-col width
      const defaultFirstCol = $('.default .first-col').width();
      const relFirstCol = $('.rel .first-col').width();
      const mode = setting.mode;
      const speed = setting.speed;
      // slide 一格 (default/rel 的寬度不同)
      // 需要顯示的欄位數量
      const showCol = setting.count.show;
      const slide = setting.count.slide;
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度 - border
      const defaultDistance =
        ((screenWidth - defaultFirstCol) / showCol / 2 - 1) * slide;
      const relDistance = ((screenWidth - relFirstCol) / showCol / 2) * slide;

      if (mode === 'default') {
        $('.content.default').animate(
          { right: `${direction}${defaultDistance}` },
          { duration: speed * 1000, easing: 'linear' }
        );
        if (defaulPosition == 0) {
          $('.previous.default').hide();
        } else {
          $('.previous.default').show();
        }
        if (defaulPosition == 3) {
          $('.next.default').hide();
        } else {
          $('.next.default').show();
        }
      } else if (mode === 'rel') {
        $('.content.rel').animate(
          { right: `${direction}${relDistance}` },
          { duration: speed * 1000, easing: 'linear' }
        );
        if (relPosition == 0) {
          $('.previous.rel').hide();
        } else {
          $('.previous.rel').show();
        }
        if (relPosition == 3) {
          $('.next.rel').hide();
        } else {
          $('.next.rel').show();
        }
      }
    }

    function adjustColumns(count, columns) {
      // 現在螢幕寬度
      const screenWidth = $(window).width();
      // first-col width
      const firtsCol = $('.first-col').width();
      // 需要顯示的欄位數量
      const showCol = count.show;
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度
      const columnWidth = (screenWidth - firtsCol - 16) / showCol;
      $(columns).width(columnWidth);
    }

    return this.each(function () {
      // 將目前處理的 .frzTable 元素（即插件套用的元素）轉換成 jQuery 物件
      const $table = $(this);
      // 分別有 default 和 rel table
      const speed = settings.speed;
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

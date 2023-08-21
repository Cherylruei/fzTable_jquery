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
      console.log('click');
    }

    $(window).on('resize', function () {
      checkWidth();
    });

    const tableColumns = {};
    const tableLengths = {};
    const $table = $(this);
    const type = $table.hasClass('default') ? 'default' : 'rel';
    // 將不同 options config 存入 tableConfigs
    tableConfigs[type] = options;

    function checkWidth() {
      $('.frzTable').each(function () {
        const typeColumns = $table.children('.content').children('.column');
        tableColumns[type] = typeColumns;
        tableLengths[type] = typeColumns.length;

        // // 視窗可見寬度
        // console.log($(window).width());
        // // 內容寬度
        // console.log(this.scrollWidth);
        // // 視窗可見寬度 > 內容寬度 = overflow

        if ($table.hasClass('default')) {
          const defaultSettings = tableConfigs[type];
          adjustColumns(defaultSettings.count, tableColumns[type]);

          $('.next').on('click', function () {
            slideColumns(
              defaultSettings.count,
              defaultSettings.speed,
              tableColumns[type]
            );
          });
        } else if ($table.hasClass('rel')) {
          const relSettings = tableConfigs[type];
          adjustColumns(relSettings.count, tableColumns[type]);
        }
      });
    }

    // // 如果螢幕寬度小於等於 425px 可以捲動內容
    // if ($(window).width() <= 425) {
    // }

    // 現在螢幕寬度
    const screenWidth = $(window).width();
    // first-col width
    const firtsCol = $('.first-col').width();

    function slideColumns(count, speed, columns) {
      // slide 一格 (default/rel 的寬度不同)
      // 需要顯示的欄位數量
      const showCol = count.show;
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度
      const columnWidth = (screenWidth - firtsCol - 16) / showCol;
      // 您可以在這裡執行滾動的操作，使用 $('.content').scrollLeft() 方法
      // 設定或獲取水平滾動的位置
      const currentScrollLeft = $('.content').scrollLeft();
      const newScrollLeft = currentScrollLeft + columnWidth; // 向右滾動
      $('.content').scrollLeft(newScrollLeft);
    }

    function adjustColumns(count, columns) {
      // 需要顯示的欄位數量
      const showCol = count.show;
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度
      const columnWidth = (screenWidth - firtsCol - 16) / showCol;
      $(columns).width(columnWidth);
    }

    return this.each(function () {
      // 將目前處理的 .frzTable 元素（即插件套用的元素）轉換成 jQuery 物件
      const $table = $(this);
      const speed = settings.speed;
      const whenClick = settings.whenClick;

      // 其他插件的邏輯
      $table.find('.item').click(function () {
        whenClick($(this)); // 呼叫 whenClick 函數
      });
    });
  };
})(jQuery);

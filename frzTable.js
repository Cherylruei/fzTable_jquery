(function ($) {
  // 宣告全局變數

  const tableConfigs = [];
  // console.log($(".frzTable.default").children(".column"));
  function adjustColumns(count, columns, length) {
    const screenWidth = $(window).width();
    const showCol = count.show;
    const slideCol = count.slide;

    if (screenWidth <= 425) {
      $(columns).slice(0, showCol).show();
      $(columns)
        .slice(showCol, length + 1)
        .hide();
    } else {
      $(columns).show();
    }
  }
  function whenClick() {
    console.log("click");
  }

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

    $(window).on("resize", function () {
      // const $this = $(this); // 使用此方法創建全局變數
      const mode = settings.mode;
      checkWindowWidth(mode, settings);
    });

    function checkWindowWidth($element, settings) {
      // 抓取(default) 7 個 column 的節點，除了需要出現的4個 column 其他隱藏
      const defaultColumns = $(".frzTable.default").children(".column");
      const defaultLength = defaultColumns.length; // 抓出節點的長度
      // 抓取(rel) 的節點和長度

      $(".frzTable").each(function () {
        const $table = $(this);
        if ($table.hasClass("default")) {
          const count = tableConfigs[0].count;
          adjustColumns(count, defaultColumns, defaultLength);
        } else if ($table.hasClass("rel")) {
          const count = tableConfigs[1].count;
          adjustColumns(count);
        }
      });
    }

    return this.each(function () {
      // 抓 options [0]: default, [1]: rel
      tableConfigs.push(options);

      // 將目前處理的 .frzTable 元素（即插件套用的元素）轉換成 jQuery 物件
      const $table = $(this);
      const speed = settings.speed;
      const whenClick = settings.whenClick;

      // 其他插件的邏輯
      $table.find(".item").click(function () {
        whenClick($(this)); // 呼叫 whenClick 函數
      });
    });
  };
})(jQuery);

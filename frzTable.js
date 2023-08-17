(function ($) {
  function adjustColumns() {
    const screenWidth = $(window).width();
    const $table = $(".frzTable");
    // 抓取 7 個 column 的節點，除了需要出現的4個 column 其他隱藏
    const columnsGroup = document.getElementsByClassName("column");

    if (screenWidth <= 425) {
      $(columnsGroup).slice(0, 4).show();
      $(columnsGroup).slice(4, 8).hide();
    } else {
      $(columnsGroup).show();
    }
  }
  function whenClick() {
    console.log("click");
  }

  $.fn.frzTable = function (options) {
    const settings = $.extend(
      {
        count: adjustColumns(1, 4),
        speed: 0.3,
        whenClick: whenClick,
      },
      // frzTable fn 帶入的 options 傳入的規格，會取代上面的 settings
      options
    );

    adjustColumns();
    $(window).on("resize", adjustColumns);

    return this.each(function () {
      // 將目前處理的 .frzTable 元素（即插件套用的元素）轉換成 jQuery 物件
      const $table = $(this);
      const count = settings.count;
      const speed = settings.speed;
      const whenClick = settings.whenClick;

      // 其他插件的邏輯
      $table.find(".item").click(function () {
        whenClick($(this)); // 呼叫 whenClick 函數
      });
    });
  };
})(jQuery);

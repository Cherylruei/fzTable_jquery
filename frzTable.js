(function ($) {
  function whenClick() {
    console.log("click");
  }

  $.fn.frzTable = function (options) {
    const settings = $.extend(
      {
        count: { slide: 1, show: 4 },
        speed: 0.3,
        whenClick: whenClick,
      },
      // frzTable fn 帶入的 options 傳入的規格，會取代上面的 settings
      options
    );

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

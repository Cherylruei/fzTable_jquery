$(".frzTable.default").frzTable({
  count: {
    // M版時每次點擊往前往後移動幾格儲存格
    slide: 1, // [number]
    // M版時一個畫面show幾格儲存格
    show: 4, // [number]
  },
  // 設定花多久時間移動完成
  speed: 0.3, // [number]
  // 每次點擊儲存格時會執行此callback，並帶入所點擊的儲存格jquery物件
  whenClick: function ($element) {
    $(".side").removeClass("side");
    if ($element.hasClass("choose")) {
      $element.removeClass("choose");
      return;
    } else {
      $(".choose").removeClass("choose");
      $element.addClass("choose");
      $element.parent().addClass("side");
      const clickedItem = $element.attr("class").split(" ")[1];
      $(".item." + clickedItem)
        .not(".choose")
        .addClass("side");
    }
  },
});
$(".frzTable.rel").frzTable({
  count: {
    slide: 1,
    show: 2,
  },
  whenClick: function ($element) {
    // console.log($element)
  },
});

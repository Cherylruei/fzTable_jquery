// usage 使用 .frzTable custom plugin

$('.frzTable.default').frzTable({
  mode: 'default',
  count: {
    // M版時每次點擊往前往後移動幾格儲存格
    slide: 2, // [number]
    // M版時一個畫面show幾格儲存格
    show: 3, // [number]
  },
  // 設定花多久時間移動完成
  speed: 0.3, // [number]
  // 每次點擊儲存格時會執行此callback，並帶入所點擊的儲存格jquery物件
  whenClick: function ($element) {
    $('.side').removeClass('side');
    if ($element.hasClass('choose')) {
      $element.removeClass('choose');
    } else {
      $('.choose').removeClass('choose');
      $element.addClass('choose');
      $element.parent().addClass('side');
      const clickedItem = $element.attr('class').split(' ')[1];
      $('.item.' + clickedItem)
        .not('.choose')
        .addClass('side');
    }
  },
});
$('.frzTable.rel').frzTable({
  mode: 'rel',
  count: {
    slide: 2,
    show: 2,
  },
  whenClick: function ($element) {
    // 移除 class 有".listed" 飛機的標記
    $('.listed').removeClass('listed');
    if ($element.hasClass('pick')) {
      $element.removeClass('pick');
    } else {
      $('.pick').removeClass('pick');
      $element.addClass('pick');
      // 增加小飛機被選取的 column
      const header = $element.parent().find('.title');
      header.addClass('listed');
      // 增加小飛機在被選取的 row
      // 抓到被點擊的 item 是該 column 的哪一排
      const columns = $('.rel .content .column')
      columns.on("click", ".item", function(){
        const items = $(this).closest('.column').find('.item')
        const index = items.index($(this))
        const headers = $('.rel .first-col .header').not(".direction")
       // 在相對應該排的 header 加上 listed
       $(headers[index]).addClass('listed');
      })

    }
  },
});

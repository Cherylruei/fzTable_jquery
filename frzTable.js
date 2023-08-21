(function ($) {
  const tableConfigs = {}
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
  
    $(window).on('resize', function () {
      const mode = settings.mode;
      checkWindowWidth(mode, settings);
    });

     
    // whenClick 點擊效果 (options 的 whenClick 會覆蓋原有設定)
    function whenClick() {
      console.log('click');
    }
   
    const tableColumns = {}
    const tableLengths = {}     
    const $table = $(this);    
      const type = $table.hasClass('default') ? "default" : "rel"
    // 將不同 options config 存入 tableConfigs
     tableConfigs[type] = options
 

     $('.frzTable').each(function () {
      // const $table = $(this);
      const typeColumns = $table.children('.column')
      tableColumns[type] = typeColumns;
      tableLengths[type] = typeColumns.length;
     
      if ($table.hasClass('default')) {
        const defaultSettings = tableConfigs[type]
        adjustColumns(defaultSettings.count, tableColumns[type],tableLengths[type] )
        console.log(defaultSettings)
        $(".next").on("click", function(){
          slideColumns(defaultSettings.count, defaultSettings.speed, tableColumns[type])
        })
    
        // 當 default table 至左底(this.getBoundingClitentRect) 會出現向右按鈕
        const right = this.getBoundingClientRect().right
        console.log(this.getBoundingClientRect())
        if(right < 700){
          $(this).css("background", "red")
        }
        // const count = tableConfigs[0].count;
        // adjustColumns(count, defaultColumns, defaultLength);
      } else if ($table.hasClass('rel')) {
        const relSettings = tableConfigs[type]
        adjustColumns(relSettings.count, tableColumns[type],tableLengths[type] )
      }
    });
    
    // 如果螢幕寬度小於等於 425px 可以捲動內容
    if($( window ).width() <= 425){
       
    }
    
    
    function slideColumns(count, speed, columns){
      // slide 一格 (default/rel 的寬度不同)
      const showCol = count.show;
      console.log(showCol)
      $(columns).slice(0, showCol).show();
      $(columns)
        .slice(showCol, length + 1)
        .hide();
    } 

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

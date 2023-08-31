(function ($) {
  const tableConfigs = {};
  $.fn.frzTable = function (options) {
    const target=$(this)
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
  
    // 每次 resize 都要去算箭頭出現的位置
    $(window).on(
      'resize',
      debounce(function () {
        if ($(window).width() < 980) {
          checkWidth();
        } else {
          $('.default .column').width(100);
          $('.rel .column').width(136);
          defaulPosition = 0;
          relPosition = 0;
        }
      }, 300)
    );

    $(function () {
      if ($(window).width() < 980) {
        checkWidth()
      } else {
        $('.default .column').width(100);
        $('.rel .column').width(136);
      }
    });

    $(function () {
      const defaultSetting = tableConfigs['default'];
      const relSetting = tableConfigs['rel'];
      const defaultSlideNum = defaultSetting.count.slide
      const relSlideNum = relSetting.count.slide
      $('.default .next').on('click', function () {
        defaulPosition += defaultSlideNum
    
        slideColumns(defaultSetting, '+=');
      });
      $('.default .previous').on('click', function () {
        if (defaulPosition == 0) {
          return;
        }
        defaulPosition-=defaultSlideNum
        slideColumns(defaultSetting, '-=');
      });
      $('.rel .next').on('click', function () {
       
        relPosition+= relSlideNum
        slideColumns(relSetting, '+=');
      });

      $('.rel .previous').on('click', function () {
        relPosition-= relSlideNum
        slideColumns(relSetting, '-=');
      });
    });

    const $table = $(this);
    const type = $table.hasClass('default') ? 'default' : 'rel';
    // 將不同 options config 存入 tableConfigs'
    tableConfigs[type] = options;

    function checkWidth() {
      // $('.content').css({ position: 'relative', right: 0 });
      const tableColumns = {};
      const tableLengths = {};
      const type = $table.hasClass('default') ? 'default' : 'rel';
      const typeColumns = $table.children('.content').children('.column');
      tableColumns[type] = typeColumns;
      tableLengths[type] = typeColumns.length;

      if ($table.hasClass('default')) {
        const defaultSettings = tableConfigs[type];
        adjustColumns(target,defaultSettings.count, tableColumns[type]);
      } else if ($table.hasClass('rel')) {
        const relSettings = tableConfigs[type];
        adjustColumns(target,relSettings.count, tableColumns[type]);
      }
    }

    function slideColumns(setting, direction) {
      // slide columns 要防呆:如果滑的格數，不能有滑超過
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
      const defaultColWidth = $('.default .column').width()
      const relColWidth = $('.rel .column').width()
      const defaultDistance = defaultColWidth/2 * slide;
      const relDistance = relColWidth/2 * slide;
    
      // console.log("relPO", relPosition) 
      // 如果要把最後一格放在底部，就要確保 showCol 的格數 4 滑動(7-4)沒入3格 defaultPO =3 
      // 隱藏的格數是 (7-showCol)*defaultColWidth
     
      // 直接將 .content(.animate)改成right:整個table的
      const defaultContentWidth = $('.default .content').width()

      if (mode === 'default') {
        const defaultLength = $(".default .column").length
        const defaultMaxClick = defaultLength - showCol
        const checkPosition = defaulPosition + showCol + slide
        // .default 如果 showCol + defaultPosition + slide > 7 
        // console.log("CheckPosition",checkPosition)
        $('.default .content').animate(
          { right: `${direction}${defaultDistance}` },
          { duration: speed * 1000, easing: 'linear' }
          )
        // if(checkPosition > 7) {
        //   $('.default .content').animate(
        //     { right: `${direction}${(7-showCol)*defaultColWidth/2}` },
        //     { duration: speed * 1000, easing: 'linear' }
        //   )
        // } else {
        //   $('.default .content').animate(
        //     { right: `${direction}${defaultDistance}` },
        //     { duration: speed * 1000, easing: 'linear' }
        //   );
        // }
        // console.log("defaultPO", defaulPosition)
        // console.log("slide", slide)
        console.log("relPosition", relPosition)
        if (defaulPosition == 0) {
          $('.default .previous').hide();
        } else {
          $('.default .previous').show();
        }
        if (defaulPosition == defaultMaxClick) {
          $('.default .next').hide();
        } else {
          $('.default .next').show();
        }
      } else if (mode === 'rel') {
        const relLength = $(".rel .column").length
        const relMaxClick = relLength - showCol
        $('.rel .content').animate(
          { right: `${direction}${relDistance}` },
          { duration: speed * 1000, easing: 'linear' }
        );
        if (relPosition == 0) {
          $('.rel .previous').hide();
        } else {
          $('.rel .previous').show();
        }
        if (relPosition == relMaxClick) {
          $('.rel .next').hide();
        } else {
          $('.rel .next').show();
        }
      }
    }

    function adjustColumns(target,count, columns) {
      // 現在螢幕寬度
      console.log('target',target)
      const screenWidth = $(window).width();
      console.log("screenWidth", screenWidth)
      // first-col width
      const firtsCol = target.find('.first-col').width();
      // 需要顯示的欄位數量
      const showCol = count.show;

      console.log("firstCol",firtsCol)
      // (螢幕寬度-首欄-left margin)/顯示欄位數=現在每一欄位的寬度
      const columnWidth = ((screenWidth - firtsCol - 32) / showCol)
      const frzTableWidth = firtsCol + columnWidth*showCol
      $(".frzTable").width(frzTableWidth)
      console.log('columnWidth', columnWidth)
      $(columns).width(columnWidth);
      
      // 按照 adjustColumns 去調整 previous/next 出現的位置
      $('.frzTable .previous').hide();
      $('.frzTable .next').css({
        "left": `${firtsCol + columnWidth * showCol - 18}px`
      });

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

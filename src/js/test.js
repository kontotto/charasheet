$(function(){
  $('.skill').click(function(e){
    // 変数の初期化
    let dataParent = $(this).attr('data-parent');
    let dest = `#${dataParent}`;
    let slider = `#${dataParent}_slider`;
    let button = `#${dataParent}_button`;
    let ini;

    // 初期値の決定
    if( typeof $(this).attr('data-current') == "undefined" ){
      ini = $(this).attr('data-ini');
    }else{
      ini = $(this).attr('data-current');
    }
    ini = Number(ini);

    // 初期化処理
    $(dest).html($(this).val() + ' ' + ini);
    $(dest).attr('data-target', $(this).attr('id'));
    $(button).prop('disabled', false);


    // sliderの設定
    $(slider).slider({
      range: "min",
      min: 0,
      max: 100,
      value: ini,
      slide: ( event, ui ) => {
        $(dest).html($(this).val() + ' ' + ui.value);
      }
    }); 
  });

  $('[id$=_button]').click(function(e){
    let dataParent = $(this).attr('data-parent');
    let slider = `#${dataParent}_slider`;
    let value = $(slider).slider('value');
    let dest = $('#' + dataParent);
    let target = $('#' + dest.attr('data-target'));
    console.log(dest.attr('data-target'));

    target.attr('data-current', value);
    target.html(target.val() + ' ' + target.attr('data-current'));
  });

  // 初期設定のスライダーの作成
  $('[id$=_slider]').slider();
});

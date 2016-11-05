const stats = {};
stats.STR = 'str';
stats.CON = 'con';
stats.POW = 'pow';
stats.DEX = 'dex';
stats.APP = 'app';
stats.SIZ = 'siz';
stats.EDU = 'edu';
stats.INT = 'int';
stats.HP = 'hp';
stats.MP = 'mp';
stats.SAN = 'san';
stats.IDEA = 'idea';
stats.LUCKY = 'lucky';
stats.WISDOM = 'wisdom';
stats.DODGE = 'dodge';

/* status */

function changeSum(pname){
  let oval = Number($(`#${pname}_origin`).val());
  let vval = Number($(`#${pname}_vary`).val());
  let sval = oval + vval;
  $(`#${pname}_sum`).val(sval);
}

function changeBase(pname){
  let srcVal = Number($(`#${pname}_sum`).val());
  let dest = new Array();
  
  switch(pname){
    case stats.INT:
      dest.push(
        { val: srcVal * 5, name: stats.IDEA}
      );
      break;
    case stats.POW:
      dest.push(
        { val: srcVal * 5, name: stats.SAN},
        { val: srcVal * 5, name: stats.LUCKY},
        { val: srcVal, name: stats.MP }
      );
      break;
    case stats.EDU:
      dest.push(
        { val: srcVal * 5, name: stats.WISDOM }
      );
      break;
    case stats.CON:
    case stats.SIZ:
      let conVal = Number($(`#${stats.CON}_sum`).val());
      let sizVal = Number($(`#${stats.SIZ}_sum`).val());
      dest.push(
        { val: Math.ceil((conVal + sizVal)/2), name: stats.HP }
      );
      break;
    case stats.DEX:
      dest.push(
        { val: srcVal * 2, name: stats.DODGE }
      );
      break;
  }

  for ( let i = 0, len = dest.length; i < len; i++ ){
    $(`#${dest[i].name}_origin`).val(dest[i].val);
    changeSum(dest[i].name);
  }
}

function changeAll(){
  for (let name in stats){
    changeSum(stats[name]);
    changeBase(stats[name]);
  }
}


// ページを読み込んだ際に実行する処理
$(function(){
  $('#output').on('click',function(e){
    let name = $('#user-name').val();
    let blob = new Blob([ name ], { "type" : "text/plain" });
    window.URL = window.URL || window.webkitURL;
    window.open(window.URL.createObjectURL(blob));
  });

  changeAll();

  $('table [id$=_vary], [id$=_origin]').change(function(){
    changeAll();
  });

  // スキルボタンが押された際の処理
  // 値の変更ができる
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

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

function outputFunc(){
    let name = '';
    name += '名前: ' +$('#user-name').val() + '\n';
    name += '職業: ' +$('#user-job').val() + '\n';
    name += '備考: ' +$('#user-note').val() + '\n\n';

    name += '*ステータス*\n';
    name += ' STR: ' + $(`#${stats.STR}_sum`).val() + '  ';
    name += 'CON: ' + $(`#${stats.CON}_sum`).val() + '  ';
    name += 'POW: ' + $(`#${stats.POW}_sum`).val() + '  ';
    name += 'DEX: ' + $(`#${stats.DEX}_sum`).val() + '  ';
    name += 'APP: ' + $(`#${stats.APP}_sum`).val() + '  ';
    name += 'SIZ: ' + $(`#${stats.SIZ}_sum`).val() + '  ';
    name += 'INT: ' + $(`#${stats.INT}_sum`).val() + '  ';
    name += 'EDU: ' + $(`#${stats.EDU}_sum`).val() + '  \n ';
    name += 'HP: ' + $(`#${stats.HP}_sum`).val() + '  ';
    name += 'MP: ' + $(`#${stats.MP}_sum`).val() + '  ';
    name += 'SAN: ' + $(`#${stats.SAN}_sum`).val() + '  ';
    name += 'アイデア: ' + $(`#${stats.IDEA}_sum`).val() + '  ';
    name += '幸運: ' + $(`#${stats.LUCKY}_sum`).val() + '  ';
    name += '知識: ' + $(`#${stats.WISDOM}_sum`).val() + '  ';
    name += '回避: ' + $(`#${stats.DODGE}_sum`).val() + '  \n\n';

    name += '*技能*\n';
    $.each($('.skill'), function(i, val){
      let ini = Number($(val).attr('data-ini'));
      let current = Number($(val).attr('data-current'));
      if(ini != current ){
        console.log($(val).val());
        name += $(val).val() + ': ' + $(val).attr('data-current') + '\n';
      }
    });

    let blob = new Blob([ name ], { "type" : "text/plain" });
    window.URL = window.URL || window.webkitURL;
    window.open(window.URL.createObjectURL(blob));
}

function diceRoll(number, max){
  let sum=0;
  for(let i=0; i < number; i++){
    sum += Math.floor( Math.random() * max ) + 1;
  }
  return sum;
}

function doDice(){
  console.log(diceRoll(1,6));
  $(`#${stats.STR}_origin`).val( diceRoll(3, 6) );
  $(`#${stats.CON}_origin`).val( diceRoll(3, 6) );
  $(`#${stats.POW}_origin`).val( diceRoll(3, 6) );
  $(`#${stats.DEX}_origin`).val( diceRoll(3, 6) );
  $(`#${stats.APP}_origin`).val( diceRoll(3, 6) );
  $(`#${stats.SIZ}_origin`).val( diceRoll(2, 6) + 6 );
  $(`#${stats.INT}_origin`).val( diceRoll(2, 6) + 6 );
  $(`#${stats.EDU}_origin`).val( diceRoll(3, 6) + 3 );
  changeAll();
}

// ページを読み込んだ際に実行する処理
$(function(){
  $('#output').click(outputFunc);

  changeAll();
  $('table [id$=_vary], [id$=_origin]').change(changeAll);
  $('#dice-random').click(doDice);
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

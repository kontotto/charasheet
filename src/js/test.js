$(function(){
  const STR = 'str';
  const CON = 'con';
  const POW = 'pow';
  const DEX = 'dex';
  const APP = 'app';
  const SIZ = 'siz';
  const EDU = 'edu';
  const INT = 'int';
  const HP = 'hp';
  const MP = 'mp';
  const SAN = 'san';
  const IDEA = 'idea';
  const LUCKY = 'lucky';
  const WISDOM = 'wisdom';
  const DODGE = 'dodge';

  // changeSum(string dataparent);
  // ステータスの合計値を変更
  function changeSum(dataParent){
    let sumVal=0;
    let originVal = Number($(`#${dataParent}_origin`).val());
    let varyVal   = Number($(`#${dataParent}_vary`).val());
    sumVal = originVal + varyVal;
    $(`#${dataParent}_sum`).val(sumVal);

    switch(dataParent){
      case INT: // アイデア
        $(`#${IDEA}_origin`).val(sumVal * 5);
        changeSum(IDEA);
        break;
      case POW: // 幸運, MP
        //SAN
        $(`#${SAN}_origin`).val(sumVal * 5);
        changeSum(SAN);
        //幸運
        $(`#${LUCKY}_origin`).val(sumVal * 5);
        changeSum(LUCKY);
        //MP
        $(`#${MP}_origin`).val(sumVal);
        changeSum(MP);
        break;
      case EDU: // 知識
        $(`#${WISDOM}_origin`).val(sumVal * 5);
        changeSum(WISDOM);
        break;
      case CON: // HP
      case SIZ:
        let conVal = Number($(`#${CON}_sum`).val());
        let sizVal = Number($(`#${SIZ}_sum`).val());
        let average = (conVal + sizVal)/2;
        let mod = (conVal + sizVal)%2;
        $(`#${HP}_origin`).val(Math.ceil(average));
        changeSum(HP);
        break;
      case DEX: //DODGE
        $(`#${DODGE}_origin`).val(sumVal * 2);
        changeSum(DODGE);
        break;
    }
  }

  $('table [id$=_vary], [id$=_origin]').change(function(){
    changeSum($(this).attr('data-parent'));
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

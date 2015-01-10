var translate_w = {
  'close': chrome.i18n.getMessage("close"),
  'check_code': chrome.i18n.getMessage("check_code"),
  'package_tracking_title': chrome.i18n.getMessage("package_tracking_title"),
  'enter_track_cod': chrome.i18n.getMessage("enter_track_cod"),
  'my_track_cod': chrome.i18n.getMessage("my_track_cod"),
  'track_code': chrome.i18n.getMessage("track_code"),
  'description': chrome.i18n.getMessage("description"),
  'track_code_is_save': chrome.i18n.getMessage("track_code_is_save"),
  'added_description': chrome.i18n.getMessage("added_description"),
  'add_cod': chrome.i18n.getMessage("add_cod")
};
$.nano = function (template, data) {
  return template.html().replace(/\{([\w\.]*)\}/g, function (str, key) {
    var keys = key.split("."), value = data[keys.shift()];
    $.each(keys, function () {
      value = value[this];
    });
    return (value === null || value === undefined) ? "" : ($.isArray(value) ? value.join('') : value);
  });
};

// сохранение трека
function addTrackCode(code, description) {
  var new_obj = {code: code, description: description};
  var my_track_list = localStorage.getItem("my_track_list");
  if (!my_track_list) {
    my_track_list = [];
    my_track_list.push(JSON.stringify(new_obj));
  } else {
    my_track_list = JSON.parse(my_track_list);
    // ищем такой трек, возможно он уже есть
    var index = false;
    $.each(my_track_list, function (i, o) {
      o = JSON.parse(o);
      if (o.code == code) {
        index = i;
      }
    });
    if (index)
      my_track_list[index] = JSON.stringify(new_obj);
    else
      my_track_list.push(JSON.stringify(new_obj));
  }
  //parseJSON
  localStorage.setItem("my_track_list", JSON.stringify(my_track_list));
  $('#message').html($.nano($('#success_add_div'), {}));
  refreshListTrack();
}
// обновление списка треков
function refreshListTrack() {
  var content = '';
  var my_track_list = localStorage.getItem("my_track_list");
  if (!my_track_list)
    return false;
  my_track_list = JSON.parse(my_track_list);

  $.each(my_track_list, function (i, o) {
    o = JSON.parse(o);
    content += $.nano($('#tr_track'), o);
  });
  $('#listTrackTable').html(content);
  $('.action .glyphicon-trash').on('click', function () {
    deleteTrack($(this).data('id'));
  });
  $('.action .glyphicon-repeat').on('click', function () {
    checkTrack($(this).data('id'));
  });
  $('.action .glyphicon-pencil').on('click', function () {
    editTrack($(this).data('id'));
  });
}
// удаление трека
function deleteTrack(track) {
  var my_track_list = localStorage.getItem("my_track_list");
  if (!my_track_list)
    return false;
  my_track_list = JSON.parse(my_track_list);
  var index;
  $.each(my_track_list, function (i, o) {
    o = JSON.parse(o);
    if (o.code == track) {
      index = i;
    }
  });
  my_track_list.splice(index, 1);
  localStorage.setItem("my_track_list", JSON.stringify(my_track_list));
  refreshListTrack();
}

//редактирование трека
function editTrack(track) {
  var my_track_list = localStorage.getItem("my_track_list");
  if (!my_track_list || !track)
    return false;
  my_track_list = JSON.parse(my_track_list);
  var index;
  $.each(my_track_list, function (i, o) {
    o = JSON.parse(o);
    if (o.code == track) {
      index = i;
    }
  });
  var obj = JSON.parse(my_track_list[index]);
  $('#trackNumber').val(obj.code);
  $('#trackDescription').val(obj.description);
}

// проверка трека
function checkTrack(track) {
  yqtrack_v4({
    container: document.getElementById('track_container'),
    width: 800,
    height: 600,
    num: track,
    et: 0,
    lng: 'ru'
  });
  $('#trackModal').modal();
}
// загрузка основных шаблонов, подстановка текста
function init_app() {
  $('#main_content').html($.nano($('#tpl_main_content'), translate_w));
  $('#trackModal').html($.nano($('#tpl_trackModal'), translate_w));
}

$(document).ready(function () {
  init_app();
  refreshListTrack();

  $('#add_track').on('click', function () {
    if ($('#trackNumber').val().length < 5) {
      $('#trackNumber').parent().addClass("has-error");
      return false;
    }
    $('#trackNumber').parent().removeClass("has-error");
    addTrackCode($('#trackNumber').val(), $('#trackDescription').val());
    $('#trackNumber').val('');
    $('#trackDescription').val('');
  });

});
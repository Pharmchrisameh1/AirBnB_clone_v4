$(document).ready(function () {
  const checkedAmenities = {};
  $('input').on('change', function () {
    if ($(this).prop('checked')) {
      checkedAmenities[`${$(this).attr('data-id')}`] = $(this).attr('data-name');
    } else {
      delete checkedAmenities[`${$(this).attr('data-id')}`];
    }
    let checkedStr = '';
    let sep = '';
    for (const name of Object.values(checkedAmenities)) {
      checkedStr += sep + name;
      sep = ', ';
    }
    $('div.amenities h4').text(checkedStr);
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    }
    else {
      $('div#api_status').removeClass('available');
    }
  });
});

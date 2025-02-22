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
  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search',
    data: '{}',
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (data) {
      data.sort((a, b) => a.name.localeCompare(b.name));
      for (const result of data) {
        console.log(result.description);
        const pluralGuest = result.max_guest > 1 ? 's' : '';
        const pluralBedroom = result.number_rooms > 1 ? 's' : '';
        const pluralBathroom = result.number_bathrooms > 1 ? 's' : '';
        $('section.places').append(`<article>
        <div class="title_box">
          <h2>${result.name}</h2>
          <div class="price_by_night">$${result.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${result.max_guest} Guest${pluralGuest}</div>
          <div class="number_rooms">${result.number_rooms} Bedroom${pluralBedroom}</div>
          <div class="number_bathrooms">${result.number_bathrooms} Bathroom${pluralBathroom}</div>
        </div>
        <div class="user">
          <b>Owner:</b> TBD
        </div>
        <div class="description">
          ${result.description}
        </div>
      </article>`);
      }
    }
  });
});

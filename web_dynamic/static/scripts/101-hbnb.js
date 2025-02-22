$(document).ready(function () {
  const checkedAmenities = {};
  const checkedCities = {};
  const checkedStates = {};

  $('input#am_check').on('change', function () {
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

  $('input#city_check, input#state_check').on('change', function () {
    if ($(this).prop('checked')) {
      if ($(this).attr('id') === 'city_check') {
        checkedCities[`${$(this).attr('data-id')}`] = $(this).attr('data-name');
      } else if ($(this).attr('id') === 'state_check') {
        checkedStates[`${$(this).attr('data-id')}`] = $(this).attr('data-name');
      }
    } else {
      if ($(this).attr('id') === 'city_check') {
        delete checkedCities[`${$(this).attr('data-id')}`];
      } else if ($(this).attr('id') === 'state_check') {
        delete checkedStates[`${$(this).attr('data-id')}`];
      }
    }
    let checkedStr = '';
    let sep = '';
    for (const name of Object.values(checkedStates)) {
      checkedStr += sep + name;
      sep = ', ';
    }
    for (const name of Object.values(checkedCities)) {
      checkedStr += sep + name;
      sep = ', ';
    }
    $('div.locations h4').text(checkedStr);
  });

  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  const initialLoad = $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search',
    data: '{}',
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (data) {
      data.sort((a, b) => a.name.localeCompare(b.name));
      for (const result of data) {
        const pluralGuest = result.max_guest > 1 ? 's' : '';
        const pluralBedroom = result.number_rooms > 1 ? 's' : '';
        const pluralBathroom = result.number_bathrooms > 1 ? 's' : '';
        $('section.places').append(`
        <article>
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
          <div class="reviews">
            <h2>Reviews<span class="showtoggle" place_id="${result.id}">Show</span></h2>
            <ul>
            </ul>
          </div>
        </article>
      `);
      }
    }
  });

  $('button').on('click', function () {
    const amIdList = [];
    for (const id of Object.keys(checkedAmenities)) {
      amIdList.push(id);
    }
    const stIdList = [];
    for (const id of Object.keys(checkedStates)) {
      stIdList.push(id);
    }
    const ctIdList = [];
    for (const id of Object.keys(checkedCities)) {
      ctIdList.push(id);
    }
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search',
      data: `{"states": ${JSON.stringify(stIdList)},
      "cities": ${JSON.stringify(ctIdList)},
      "amenities": ${JSON.stringify(amIdList)}}`,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (data) {
        $('section.places').empty();
        data.sort((a, b) => a.name.localeCompare(b.name));
        for (const result of data) {
          const pluralGuest = result.max_guest > 1 ? 's' : '';
          const pluralBedroom = result.number_rooms > 1 ? 's' : '';
          const pluralBathroom = result.number_bathrooms > 1 ? 's' : '';
          $('section.places').append(`
          <article>
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
            <div class="reviews">
              <h2>Reviews<span class="showtoggle" place_id="${result.id}" >Show</span></h2>
              <ul>
              </ul>
            </div>
          </article>
        `);
        }
      }
    }).then(function () {
      $('.showtoggle').on('click', function () {
        if ($(this).text() === 'Show') {
          $(this).text('Hide');
          const placeId = $(this).attr('place_id');
          const ulelem = $(this).closest('.reviews').find('ul');
          ulelem.empty();
          $.get(`http://localhost:5001/api/v1/places/${placeId}/reviews`, function (data) {
            for (const review of data) {
              ulelem.append(`
              <li>
                <p>${review.text}</p>
              </li>
              `);
            }
          });
        } else {
          $(this).text('Show');
          const ulelem = $(this).closest('.reviews').find('ul');
          ulelem.empty();
        }
      });
    });
  });

  initialLoad.then(function () {
    $('.showtoggle').on('click', function () {
      if ($(this).text() === 'Show') {
        $(this).text('Hide');
        const placeId = $(this).attr('place_id');
        const ulelem = $(this).closest('.reviews').find('ul');
        ulelem.empty();
        $.get(`http://localhost:5001/api/v1/places/${placeId}/reviews`, function (data) {
          for (const review of data) {
            ulelem.append(`
            <li>
              <p>${review.text}</p>
            </li>
            `);
          }
        });
      } else {
        $(this).text('Show');
        const ulelem = $(this).closest('.reviews').find('ul');
        ulelem.empty();
      }
    });
  });
});

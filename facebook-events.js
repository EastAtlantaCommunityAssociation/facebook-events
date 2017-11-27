$(function() {
  $eventCal = $('.fbEventCalendar');
  if ($eventCal.length == 0) { return }

  $upcomingCal = $('#fbUpcomingCalendar ul', $eventCal);
  $pastCal = $('#fbPastCalendar ul', $eventCal);

  function eventHtml(event) {
    html = '<li class="event">';

    html += '<div class="date">';
    html += '<div class="date-mon">' + event.month + '</div>';
    html += '<div class="date-day">' + event.day + '</div>';
    html += '</div>';

    html += '<div class="details">';
    html += '<div class="name"><a target="_blank" href="' + event.url + '">' + event.name + '</a></div>';
    html += '<div class="location"><a target="_blank" href="' + event.url + '">' + event.location + '</a></div>';
    html += '<div class="description">' + event.description + '</div>';
    html += '</div>';

    html += '</li>';

    return html;
  };

  function parseFbEvent(rawEvent) {
    mStart = moment(rawEvent.start_time)

    if(rawEvent.place !== undefined) {
      eventLocation = rawEvent.place.name;
    } else {
      eventLocation = ''
    }

    return {
      startTime: mStart,
      month: mStart.format('MMM'),
      day: mStart.format('Do'),
      url: 'https://facebook.com/' + rawEvent.id,
      description: rawEvent.description.substring(0, 250) + '...',
      name: rawEvent.name,
      location: eventLocation
    };
  }

  function fbEventManager(events) {
    var upcomingEvents = [],
      pastEvents = [];

    // Parse raw fb events and place them into the right upcoming/past boxes
    for(var i = 0; i < events.length; i++) {
      fbEvent = parseFbEvent(events[i]);

      if(moment().diff(fbEvent.startTime, 'days') <= 0) {
        upcomingEvents.push(fbEvent);
      } else {
        pastEvents.push(fbEvent);
      }
    };

    upcomingEvents.reverse();

    // Clear out loading message
    $upcomingCal.html('');
    $pastCal.html('');
    // Update the DOM with the upcoming events
    for(var i = 0; i < upcomingEvents.length; i++) {
      var event = upcomingEvents[i];
      $upcomingCal.append(eventHtml(event));
    }

    // Update the DOM with the past events
    for(var i = 0; i < pastEvents.length; i++) {
      var event = pastEvents[i];
      $pastCal.append(eventHtml(event));
    }
  };

  $.ajax({
    url: 'https://zbyaydlemg.execute-api.us-east-1.amazonaws.com/prod/fetch-eaca-facebook-events',
    type: 'GET',
    crossDomain: true,
    success: function(response) {
      fbEventManager(response);
    }
  });
});

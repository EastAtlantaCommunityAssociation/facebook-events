$(function() {
  eventCal = $('#fbEventCalendar ul');
  if (eventCal.length > 0) {
    function eventHtml(event) {
      var date = moment(event.start_time),
      date_mon = date.format('MMM'),
      date_day = date.format('Do'),
      description = event.description.substring(0, 250) + '...',
      url = 'https://facebook.com/' + event.id;

      html = '<li class="event">';

      html += '<div class="date">';
      html += '<div class="date-mon">' + date_mon + '</div>';
      html += '<div class="date-day">' + date_day + '</div>';
      html += '</div>';

      html += '<div class="details">';
      html += '<div class="name"><a href="' + url + '">' + event.name + '</a></div>';
      html += '<div class="location"><a href="' + url + '">' + event.place.name + '</a></div>';
      html += '<div class="description">' + description + '</div>';
      html += '</div>';

      html += '</li>';

      return html;
    }
    $.ajax({
      url: 'https://zbyaydlemg.execute-api.us-east-1.amazonaws.com/prod/fetch-eaca-facebook-events',
      type: 'GET',
      crossDomain: true,
      success: function(response) {
        for(var i =0; i < response.length; i++) {
          event = response[i];
          eventCal.append(eventHtml(event));
        }
      }
    });
  }
});

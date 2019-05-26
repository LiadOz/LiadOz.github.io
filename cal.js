var calendar, firstFlag = true

//initial render of the calendar
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'interaction', 'dayGrid', 'list'],
    defaultView: 'dayGridMonth',
    aspectRatio: 2.2,
    views: {
      dayGridMonth: {
        eventLimit: true
      }
    },
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
  });
});

function updateCalendar(newEvents) {  
  removeAllEvents()
  addEvents(newEvents)
};

function removeAllEvents(){
  var exEvents = calendar.getEventSources()
  for(var i = 0; i <exEvents.length; i++){
    exEvents[i].remove()
  }
}

function addEvents(newEvents){ 
  for(var i = 0; i < newEvents.length; i++){
    calendar.addEventSource(newEvents[i])
  }
  if(firstFlag){
    firstFlag = false
    calendar.render()
  }
}


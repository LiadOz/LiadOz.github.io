//the json does not check if the file exist beforehand, could be an issue later.
loadEvents()
//Loads the events into the calendar in from json file.
function loadEvents(){

    const COLORS = [['blue','white'], ['red','white'], ['yellow','black']]
    var username = document.getElementById('userInput').value;

    var user_calendars = [], user_locations = [], events = [], newEvents = [];
    var st ='';

    jQuery.getJSON('python//web//users//' + username + '.json', function(data){

    
        userCalendars = data.user_data.sub_calendars;
        userLocations = data.user_data.sub_locations;
        events = data.events;

        var colorIndex = 0
        for(var eventType of Object.keys(events)){

            var typeEv = {
                events: [],
                color: COLORS[colorIndex][0],
                textColor: COLORS[colorIndex][1]
            };
            colorIndex++

            for(var i = 0; i < events[eventType].length; i++){
                
                var ev =  events[eventType][i];
                var date = new Date(...ev.date.slice(0,3));
                var m = date.getMonth(), d = date.getDate();
                if (m < 10){
                    m = '0' + m;
                }
                if (d < 10){
                    d = '0' + d;
                }
                
                var oEvent = {title: ev.title, start: `${date.getFullYear()}-${m}-${d}`};
                typeEv.events.push(oEvent);
            }
            newEvents.push(typeEv)

        }

        console.log(newEvents)
        updateCalendar(newEvents);
        showProps(userCalendars, userLocations)
        
    });
        
}

//Shows information about user in the sidebar.
function showProps(calendars, locations){
    sideBar = document.getElementById("my-sidebar-content")

    var st = ''
    calendars.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${element}</li>`
    });

    locations.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${element}</li>`
    });

    sideBar.innerHTML = st
}


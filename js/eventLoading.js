var userCalendars = [], userLocations = [], availableCalendars = [], availableLocations = []

function userExist(path){

    var http = new XMLHttpRequest();
    http.open('HEAD', path, false);
    http.send();
    return http.status!=404;

}
//Loads the events into the calendar in from json file.
function loadEvents(){

    const COLORS = [['blue','white'], ['red','white'], ['yellow','black']]
    var username = document.getElementById('userInput').value;
    var path = 'python//web//users//' + username + '.json'
    var events = [], newEvents = [];
    var st ='';

    if(!userExist(path)){
        //createNewUserMenu(username)
        return
    }

    jQuery.getJSON(path, function(data){
    
        userCalendars = data.user_data.sub_calendars;
        userLocations = data.user_data.sub_locations;
        availableCalendars = data.user_data.available_calendars
        availableLocations = data.user_data.available_locations
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

        updateCalendar(newEvents);
        document.getElementById('description').innerHTML = ''
        showProps()
        
    });
        
}

function createNewUserMenu(username){
// Not implemented.
// Creates a menu for inputting a new user.
    const allEvents = 'python//web//users//all_events.json'
    jQuery.getJSON(allEvents, function(data){
        // Reading all available calendars and loctaions
        availableCalendars = data.aux_data.all_subscriptions
        availableLocations = data.aux_data.all_locations
        var str = `<h3>This user does not exist let's create a new user.</h3>
        <div class="jumbotron">
        <div class="text-center form-group">
        <h3>Choose Calendars:</h3>
        <div class="btn-group btn-group-lg">`;
        // Showing the calendars options
        availableCalendars.forEach(element => {
            str += `<label for="${upAllWords(element)}" class="btn btn-primary">${upAllWords(element)} <input name="inputCalendar" type="checkbox" id="${upAllWords(element)}" class="badgebox"><span class="badge">&check;</span></label>`
        });
        str += '</div></div>'

        str += `<div class="text-center">
        <h3>Choose Locations:</h3>
        <div class="row">`;
        str += `<div class="col-md-3">`
        str += `<div class="btn-group-vertical btn-group-vertical-sm btn-block">`
        var i = 0
        // Showing the locations options in four columns
        availableLocations.forEach(element => {
            
            str += `<label for="${upAllWords(element)}" class="btn btn-primary">${upAllWords(element)} <input name="inputLocation" type="checkbox" id="${upAllWords(element)}" class="badgebox"><span class="badge">&check;</span></label>`
            i++
            if(i == Math.floor(availableLocations.length/4)){
                i = 0
                str += '</div></div>'
                str += `<div class="col-md-3">`
                str += `<div class="btn-group-vertical btn-group-vertical-md btn-block">`
            }
        });  
         str += '</div></div>'
         str += `<button type="submit" class="btn btn-danger btn-block" onclick="createUser()">Submit</button>` // Submit button
         str += '</div>'

        document.getElementById('description').innerHTML = str

    });
}

function createUser(){
    var newCalendars = [], newLocations = [], inputCalendars = Array.from(document.getElementsByName('inputCalendar')), inputLocations = Array.from(document.getElementsByName('inputLocation'))
    inputCalendars.forEach(element => {
        if(element.checked == true){
            newCalendars.push(element.id)
        }
    });
    inputLocations.forEach(element => {
        if(element.checked == true){
            newLocations.push(element.id)
        }
    });
    console.log([newCalendars, newLocations])
}

//Shows information about user in the sidebar.
function showProps(){
    sideBar = document.getElementById("my-sidebar-content")

    var st = '<a href="#calendarsSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle list-group-item bg-light">Calendars</a>'
    st += '<ul class="collapse list-unstyled" id="calendarsSubmenu">'
    userCalendars.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${upAllWords(element)}</li>`
    });
    st+= '</ul>'
    st+= '<a href="#locationsSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle list-group-item bg-light">Locations</a>'
    st += '<ul class="collapse list-unstyled" id="locationsSubmenu">'
    userLocations.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${upAllWords(element)}</li>`
    });
    st+= '</ul>'

    //Showing the available subscriptions and calendars
    st+= '<a href="#avcalendarsSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle list-group-item bg-light">Available Calendars</a>'
    st += '<ul class="collapse list-unstyled" id="avcalendarsSubmenu">'
    console.log(availableCalendars)
    availableCalendars.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${upAllWords(element)}</li>`
    });
    st+= '</ul>'
    
    st+= '<a href="#avlocationsSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle list-group-item bg-light">Available Locations</a>'
    st += '<ul class="collapse list-unstyled" id="avlocationsSubmenu">'
    availableLocations.forEach(element => {
        st+= `<li class="list-group-item list-group-item-action bg-light">${upAllWords(element)}</li>`
    });
    st+= '</ul>'

    sideBar.innerHTML = st
}

function upAllWords(str){
    return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}


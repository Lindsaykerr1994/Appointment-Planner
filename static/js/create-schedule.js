$(document).ready(function(){
    //First, generate/retrieve all relevant data for events and clients.
    var profileInfo = getProfileInfo();
    var allEvents = getAppointmentInfo();
    var allClients = getClientInfo();
    var allEventsWithNames = addClientToEventInfo(allEvents,allClients);
    var thisWeeksDate = getThisWeeksDate(getTodaysDate());
    var thisWeeksEvents = getThisWeeksEvents(allEventsWithNames,thisWeeksDate);
    //Second, create the schedule layout as necessary.
    if(typeof profileInfo["startTime"]==='undefined' || typeof profileInfo["endTime"]==='undefined'){
        window.timelineStart = "09:00";
        window.timelineEnd = "17:00";
    } else {
       window.timelineStart = profileInfo["startTime"];
       window.timelineEnd = profileInfo["endTime"]
    }
    applyTimeline(timelineStart,timelineEnd);
    applyDatesToSchedule(thisWeeksDate);
    //Third, apply events to schedule.
    createThisWeeksEvents(thisWeeksEvents);
    setWelcomeMessage(profileInfo["firstName"]);
})
var timelineStart = "09:00";
var timelineEnd = "17:00";
var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
function getProfileInfo(){
    var profileSpan = $(".profile-data-container div").text();
    var profileSingle = profileSpan.split(" ")
    var profileInfo = {
        firstName: profileSingle.shift(),
        lastName: profileSingle.shift(),
        startTime: profileSingle.shift(),
        endTime: profileSingle.shift()
    };
    return profileInfo;
};
function getAppointmentInfo(){
    var count = $(".appointment-data-container div").length;
    var allEvents = [];
    for(i=0;i<count;i++){
        var eventSpan = $(".appointment-data-container div").eq(i).text();
        var eventSingle = eventSpan.split(" ")
        var addToEvents = {
            eventId: eventSingle.shift(),
            clientId: eventSingle.shift(),
            eventTime: eventSingle.shift(),
            eventDuration: eventSingle.shift(),
            eventDate: eventSingle.shift(),
            eventNotes: eventSingle.toString().replace(/,/g, " ")
        }
        allEvents.push(addToEvents)
    }
    return(allEvents)
}
function getClientInfo(){
    var count = $(".client-data-container div").length;
    var allClients = [];
    for(i=0;i<count;i++){
        var clientSpan = $(".client-data-container div").eq(i).text();
        var clientSingle = clientSpan.split(" ")
        var addToClients = {
            clientId: clientSingle[0],
            firstName: clientSingle[1],
            lastName: clientSingle[2],
            fullName: `${clientSingle[1]} ${clientSingle[2]}`,
            clientEmail: clientSingle[3],
            clientTel: clientSingle[4]
        };
        allClients.push(addToClients);
    }
    return(allClients);
}
function addClientToEventInfo(allEvents,allClients){
    var eventInfo = allEvents;
    var clientInfo = allClients;
    for (i=0;i<eventInfo.length;i++){
        var compareId1 = eventInfo[i]["clientId"];
        for (j=0;j<clientInfo.length;j++){
            var compareId2 = clientInfo[j]["clientId"];
            if(compareId1 == compareId2){
                var clientName = clientInfo[j]["fullName"];
                eventInfo[i]["clientName"] = `${clientName}`;
            }
        }
    }
    return(eventInfo);
}
//The following functions generate DateTime data
function getTodaysDate(){
    var newDate = new Date
    var dayToday = newDate.getDay();
    var dateToday = newDate.getDate();
    var monthToday = newDate.getMonth()+1;
    var yearToday = newDate.getFullYear();
    return [dayToday,dateToday,monthToday,yearToday];
}
function stringifyMonth(month){
    if(month<9){
        var monthString = `0${month}`;
    } else{
        monthString = `${month}`;
    }
    return monthString;
}
function getThisWeeksDate(requestDate){
    var thisWeeksDate = []
    var dayToday = requestDate[0];
    var dateToday = requestDate[1];
    var monthToday = requestDate[2];
    var monthTodayString = stringifyMonth(monthToday);
    var yearToday = requestDate[3];
    if(dayToday==0){//Today is Sunday
        if(dateToday<10){
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${dateToday}`);
        } else {
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-${dateToday}`);
        }
        for(i=1;i<7;i++){
            var nextDate = dateToday+i;
            if (monthToday == 2){//If the month is Feb. and date exceeds 28
                if (nextDate>28){//Does not consider Leap Years
                    var nextDateMonth = `0${nextDate-28}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Feb and date DOES NOT exceed 28.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                    
                }
            } else if(monthToday == 4 || monthToday == 6 || monthToday == 9 || monthToday == 11){//If month is Apr. June. Sept. or Nov. and date exceeeds 30
                if (nextDate>30){
                    var nextDateMonth = `0${nextDate-30}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Apr. June. Sept. or Nov. and date DOESN NOT exceed 30.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            } else if(monthToday == 12){//If month is Dec. and date exceeds 31
                if (nextDate>31){
                    var nextDateMonth = `0${nextDate-31}`;
                    var monthNext = 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Dec and date DOESN NOT exceed 31.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            } else {//If any other month
                if (nextDate>31){
                    var nextDateMonth = `0${nextDate-31}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Dec and date DOESN NOT exceed 31.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            }
        }
    } else if (dayToday==6){//Today is Saturday
        if(dateToday<10){
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${dateToday}`);
        } else {
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-${dateToday}`);
        }
        for(i=1;i<7;i++){
            var prevDate = dateToday-i;
            if (prevDate<1){//We must go back one month
                if(monthToday == 3){//If the month is March and the date is less that 1
                    var prevDateMonth = `${28 + prevDate}`; //We use '+' because prevDate value will be negative
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else if (monthToday == 5 || monthToday == 7 || monthToday == 10|| monthToday == 12){//If month is May, July, Oct. or Dec. and date is less than 1
                    var prevDateMonth = `${30 + prevDate}`; //We use '+' because prevDate value will be negative
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else if (monthToday == 1){ //If month is Jan. and date is less than 1
                    var prevDateMonth = `${31 + prevDate}`;
                    var monthPrev = 12;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else {
                    var prevDateMonth = `${31 + prevDate}`;
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                }
            } else {
                if (prevDate<10){
                        thisWeeksDate.unshift(`${yearToday}-${monthTodayString}-0${prevDate}`);
                } else {
                        thisWeeksDate.unshift(`${yearToday}-${monthTodayString}-${prevDate}`);
                }
            }
        }
    } else {//Today is a weekday
        if(dateToday<10){
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${dateToday}`);
        } else {
            thisWeeksDate.push(`${yearToday}-${monthTodayString}-${dateToday}`);
        }
        for (i=1;i<(dayToday+1);i++){
            var prevDate = dateToday-i;
            if (prevDate<1){//We must go back one month
                if(monthToday == 3){//If the month is March and the date is less that 1
                    var prevDateMonth = `0${28 + prevDate}`; //We use '+' because prevDate value will be negative
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else if (monthToday == 5 || monthToday == 7 || monthToday == 10|| monthToday == 12){//If month is May, July, Oct. or Dec. and date is less than 1
                    var prevDateMonth = `${30 + prevDate}`; //We use '+' because prevDate value will be negative
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else if (monthToday == 1){ //If month is Jan. and date is less than 1
                    var prevDateMonth = `${31 + prevDate}`;
                    var monthPrev = 12;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                } else {
                    var prevDateMonth = `${31 + prevDate}`;
                    var monthPrev = monthToday - 1;
                    var monthPrevString = stringifyMonth(monthPrev);
                    thisWeeksDate.unshift(`${yearToday}-${monthPrevString}-${prevDateMonth}`);
                }
            } else {
                if (prevDate<10){
                        thisWeeksDate.unshift(`${yearToday}-${monthTodayString}-0${prevDate}`);
                } else {
                        thisWeeksDate.unshift(`${yearToday}-${monthTodayString}-${prevDate}`);
                }
            }
        }
        for (i=1;i<(7-dayToday);i++){
            var nextDate = dateToday+i;
            if (monthToday == 2){//If the month is Feb. and date exceeds 28
                if (nextDate>28){//Does not consider Leap Years
                    var nextDateMonth = `0${nextDate-28}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Feb and date DOES NOT exceed 28.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            } else if(monthToday == 4 || monthToday == 6 || monthToday == 9 || monthToday == 11){//If month is Apr. June. Sept. or Nov. and date exceeeds 30
                if (nextDate>30){
                    var nextDateMonth = `0${nextDate-30}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Apr. June. Sept. or Nov. and date DOESN NOT exceed 30.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            } else if(monthToday == 12){//If month is Dec. and date exceeds 31
                if (nextDate>31){
                    var nextDateMonth = `0${nextDate-31}`;
                    var monthNext = 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Dec and date DOESN NOT exceed 31.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            } else {//If any other month
                if (nextDate>31){
                    var nextDateMonth = `0${nextDate-31}`;
                    var monthNext = monthToday + 1;
                    var monthNextString = stringifyMonth(monthNext);
                    thisWeeksDate.push(`${yearToday}-${monthNextString}-${nextDateMonth}`);
                } else {//If the month is Dec and date DOESN NOT exceed 31.
                    if (nextDate<10){
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-0${nextDate}`);
                    } else {
                        thisWeeksDate.push(`${yearToday}-${monthTodayString}-${nextDate}`);
                    }
                }
            }
        }
    }
    return(thisWeeksDate);
}
function getThisWeeksEvents(eventDict,weeksDate){
    var thisWeeksEvents = []
    for(i=0;i<eventDict.length;i++){
        var checkEvent = eventDict[i];
        for (j=0;j<weeksDate.length;j++){
            if(checkEvent["eventDate"]==weeksDate[j]){
                thisWeeksEvents.push(checkEvent);
            }
        }
    }
    return thisWeeksEvents;
}
//The following functions generate the schedule grid
function applyDatesToSchedule(weeksDates){
    for(i=0;i<7;i++){
        var applyDates = weeksDates[i];
        var applyDateSingle = `${applyDates[8]}${applyDates[9]}`;
        $(".sch-col-header-date").eq(i).text(applyDateSingle);
    }
}
function applyTimeline(startTime,endTime){
    var startTimeInt = parseIntOfTime(startTime);
    var endTimeInt = (parseIntOfTime(endTime)+1);
    var lengthOfTime = endTimeInt-startTimeInt;
    var timeDivisions = lengthOfTime*2;
    var currTime = startTimeInt;
    for(i=0;i<timeDivisions;i++){
        if(i%2 == 0){
            if(currTime<10){
                var timeListItem = `0${currTime}:00`;
            } else{
                timeListItem = `${currTime}:00`;
            }
        } else {
            if(currTime<10){
                timeListItem = `0${currTime}:30`;
            } else{
                timeListItem = `${currTime}:30`;
            }
            currTime ++;
        }
        var createListItem = `<li>${timeListItem}</li>`;
        $("#timeline-col ul").append(createListItem);
    }
}
//This function has an input of a string format of time, and returns the integer of that hour.
function parseIntOfTime(timeVar){
    if(timeVar[0]=="1"){
        var timeVarInt = parseInt(`${timeVar[0]}${timeVar[1]}`)
    } else {
        timeVarInt = parseInt(timeVar[1])
    }
    return timeVarInt;
}
//The following functions create the events for the schedule
function createThisWeeksEvents(eventList){
    for(i=0;i<eventList.length;i++){
        var eventDateFull = eventList[i]["eventDate"];
        var eventDate = `${eventDateFull[8]}${eventDateFull[9]}`;
        var eventStartTime = eventList[i]["eventTime"];
        var eventDuration = eventList[i]["eventDuration"];
        if(eventDuration == "2"){
            var eventEndTimeInt = parseInt(`${eventStartTime[0]}${eventStartTime[1]}`)+1;
            if (eventEndTimeInt<10){
                var eventEndTime = `0${eventEndTimeInt}:${eventStartTime[3]}0`;
            } else {
                eventEndTime = `${eventEndTimeInt}:${eventStartTime[3]}0`;
            }
        } else {
            if (`${eventStartTime[3]}`=="3"){
                eventEndTimeInt = parseInt(`${eventStartTime[0]}${eventStartTime[1]}`)+1;
                if (eventEndTimeInt<10){
                    var eventEndTime = `0${eventEndTimeInt}:00`;
                } else {
                    eventEndTime = `${eventEndTimeInt}:00`;
                }
            } else {
                eventEndTime = `${eventStartTime[0]}${eventStartTime[1]}:30`;
            }
        }
        var clientName = eventList[i]["clientName"];
        var eventId = eventList[i]["eventId"];
        var dataEntry = `data-event-id=${eventId}`;
        var cardStyleTop = calculateCardTop(eventStartTime);
        var setHeight = 50;
        var eventBlock = parseInt(eventList[i]["eventDuration"]);
        var cardStyleHeight = setHeight*eventBlock 
        var cardStyle = `style='top:${cardStyleTop}px;height:${cardStyleHeight}px;'`;
        var cardContent =`<span class="font-12 margin-left-5">${eventStartTime}-${eventEndTime}</span></br><span class="margin-left-5">${clientName}</span>`;
        var cardElement = `<div ${cardStyle} ${dataEntry} class="event-card-unit dropdown-trigger text-left" data-target="event-dropdown">${cardContent}</div>`;
        $(`.sch-col-header-date:contains(${eventDate})`).parent().after(`${cardElement}`)
    }
}
function calculateCardTop(eventStart){
    var eventStartFloat = parseInt(`${eventStart[0]}${eventStart[1]}`)
    if (eventStart[3]=="3"){
        eventStartFloat += 0.5;
    }
    var timelineStartFloat = parseInt(`${timelineStart[0]}${timelineStart[1]}`)
    if (timelineStart[3]=="3"){
        timelineStartFloat += 0.5;
    }
    var cardStyleTop = ((((eventStartFloat-timelineStartFloat)*2)*50)+50);
    return cardStyleTop;

}
//The following functions set the welcome message at the top of schedule.html
function setWelcomeMessage(firstName){
    $("#welcome-client-name").text(firstName);
    var todaysDate = getTodaysDate();
    var welcomeDate = `${dayNames[todaysDate[0]]}, ${todaysDate[1]} ${monthNames[todaysDate[2]]} ${todaysDate[3]}`;
    $("#todays-date-span").text(welcomeDate);
}
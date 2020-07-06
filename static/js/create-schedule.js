$(document).ready(function(){
    //First, generate/retrieve all relevant data for events and clients.
    var allEvents = getAppointmentInfo();
    var todaysDate = getTodaysDate();
    window.upcomingEvents = getUpcomingAppointments(todaysDate, allEvents);
    console.log(upcomingEvents)
    var thisWeeksDate = getThisWeeksDate(todaysDate);
    var thisWeeksEvents = getThisWeeksEvents(allEvents,thisWeeksDate);
    //Second, create the schedule layout as necessary.
    window.timelineStart = "09:00";
    window.timelineEnd = "17:00";
    applyTimeline(timelineStart,timelineEnd);
    applyDatesToSchedule(thisWeeksDate);
    setActiveDay(getTodaysDate()[1]);
    //Third, apply events to schedule.
    createThisWeeksEvents(thisWeeksEvents);
    setWelcomeMessage();
})
var timelineStart = "09:00";
var timelineEnd = "17:00";
var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
//The following functions collects the appointment data imported from Python/app.py
function getAppointmentInfo(){
    var count = $(".appointment-data-unit").length;
    var allEvents = [];
    for(i=0;i<count;i++){
        var addToEvents = {
            eventId: $(`.appointment-data-unit:nth-child(${i+1}) .app-id-data-field`).text(),
            profileId: $(`.appointment-data-unit:nth-child(${i+1}) .app-profid-data-field`).text(),
            clientId: $(`.appointment-data-unit:nth-child(${i+1}) .app-clientid-data-field`).text(),
            clientName: $(`.appointment-data-unit:nth-child(${i+1}) .app-clientname-data-field`).text(),
            startTime: $(`.appointment-data-unit:nth-child(${i+1}) .app-starttime-data-field`).text(),
            endTime: $(`.appointment-data-unit:nth-child(${i+1}) .app-endtime-data-field`).text(),
            eventDuration: $(`.appointment-data-unit:nth-child(${i+1}) .app-duration-data-field`).text(),
            eventDate: $(`.appointment-data-unit:nth-child(${i+1}) .app-startdate-data-field`).text(),
            eventNotes: $(`.appointment-data-unit:nth-child(${i+1}) .app-notes-data-field`).text()
        }
        allEvents.push(addToEvents)
    }
    return(allEvents)
}
function getUpcomingAppointments(todaysDate, allEvents){
    var upcomingEvents = [];
    if (todaysDate[1]<10){
        if (todaysDate[2]<10){
            var todaysDateStr = `${todaysDate[3]}0${todaysDate[2]}0${todaysDate[1]}`
        } else {
            todaysDateStr = `${todaysDate[3]}${todaysDate[2]}0${todaysDate[1]}`
        }
    } else if (todaysDate[2]<10){
        todaysDateStr = `${todaysDate[3]}0${todaysDate[2]}${todaysDate[1]}`
    } else {
        todaysDateStr = `${todaysDate[3]}${todaysDate[2]}${todaysDate[1]}`
    }
    var DateFloat = parseFloat(todaysDateStr);
    for (i=0;i<allEvents.length;i++){
        var checkDate = allEvents[i]['eventDate'].replace(/-/g,"")
        var checkDateFloat = parseFloat(checkDate)
        if (checkDateFloat>=DateFloat){
            upcomingEvents.push(allEvents[i]);
        }
    }
    return upcomingEvents;
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
};
function setActiveDay(todaysDate){
    if(todaysDate<10){
        var findDateStr = `0${todaysDate}`;
    } else {
        findDateStr = `${todaysDate}`;
    }
    $(`.sch-col-header-date:contains(${findDateStr})`).parent().parent().addClass("active-day-col")

};
//The following functions create the events for the schedule
function createThisWeeksEvents(eventList){
    for(i=0;i<eventList.length;i++){
        var eventDateFull = eventList[i]["eventDate"];
        var eventDate = `${eventDateFull[8]}${eventDateFull[9]}`;        
        var clientName = eventList[i]["clientName"];
        var eventId = eventList[i]["eventId"];
        var profileId = eventList[i]["profileId"]
        var dataEntry = `data-event-id=${eventId}`;
        var eventStartTime = eventList[i]["startTime"];
        var cardStyleTop = calculateCardTop(eventStartTime);
        var setHeight = 50;
        var eventBlock = parseInt(eventList[i]["eventDuration"]);
        var cardStyleHeight = setHeight*eventBlock 
        var cardStyle = `style='top:${cardStyleTop}px;height:${cardStyleHeight}px;'`;
        var cardContent =`<span class="font-12 margin-left-5">${eventList[i]["startTime"]}-${eventList[i]["endTime"]}</span></br><span class="margin-left-5">${clientName}</span>`;
        var cardElement = `<a href="/see_app_details/${profileId}/${eventId}" class="text-white text-decoration-none"><div ${cardStyle} ${dataEntry} class="event-card-unit dropdown-trigger text-left">${cardContent}</div></a>`;
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
function setWelcomeMessage(){
    console.log(upcomingEvents);
    var todaysDate = getTodaysDate();
    var welcomeDate = `${dayNames[todaysDate[0]]}, ${todaysDate[1]} ${monthNames[todaysDate[2]-1]} ${todaysDate[3]}`;
    $("#todays-date-span").text(welcomeDate);
    var arrayIndex = upcomingEvents.length-1;
    console.log(arrayIndex);
    $("#welcome-appt-name").text(upcomingEvents[arrayIndex]["clientName"])
    $("#welcome-appt-time").text(upcomingEvents[arrayIndex]["startTime"])
    $("#welcome-appt-date").text(upcomingEvents[arrayIndex]["eventDate"])
}



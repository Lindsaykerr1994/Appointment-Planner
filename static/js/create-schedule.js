$(document).ready(function(){
    var allEvents = getAppointmentInfo();
})
function getAppointmentInfo(){
    var count = $(".appointment-data-container div").length;
    var allEvents = [];
    for(i=0;i<count;i++){
        var eventSpan = $(".appointment-data-container div").eq(i).text();
        var eventSingle = eventSpan.split(" ")
        console.log(eventSingle)
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
    console.log(allEvents)
    return(allEvents)
}
function getClientInfo(){
    var count = $(".client-data-container span").length;
    var allClients = [];
    for(i=0;i<count;i++){
        var clientSpan = $(".client-data-container span").eq(i).text();
        var clientSingle = clientSpan.split(" ")
        var addToClients = {
            clientId: clientSingle[0],
            firstName: clientSingle[1],
            lastName: clientSingle[2],
            fullName: `${clientSingle[1]} ${clientSingle[2]}`
        };
        allClients.push(addToClients);
    }
    return(allClients);
}
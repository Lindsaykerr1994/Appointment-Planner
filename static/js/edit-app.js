$(document).ready(function(){
    $(".event-card-unit").click(updateEventDropdownLinks);
    updateSelectOptions();
});
function updateEventDropdownLinks(){
    var eventId = $(this).attr("data-event-id");
    var setJinjaModifyLink = `{{url_for('edit-appointment')}}`;
    $("#event-dropdown #see-app-details a").attr("href",`see_appt_details/${eventId}`);
    $("#event-dropdown #modify-app a").attr("href",`edit_appointment/${eventId}`);
    $("#event-dropdown #delete-app a").attr("href",`delete_appointment/${eventId}`)
    return eventId;
};
function getEventId(){
    var eventId = $("#event-id-span").text();
    return eventId;
}
function getStartTimes(){
    var startTime = $("#modify-appt-start-time").text();
    var startTimeHour = `${startTime[0]}${startTime[1]}`;
    var startTimeMinutes = `${startTime[3]}${startTime[4]}`;
    return [startTimeHour, startTimeMinutes];
}
function updateSelectOptions(){
    var clientId = $("#client-id-span").text();
    var count1 = $("#client-id-select option").length;
    for(i=0;i<count1;i++){
        var optionValue = $("#client-id-select option").eq(i).val();
        if(optionValue==clientId){
            $("#client-id-select option").eq(i).attr("selected","selected");
        };
    };
    var startTimeHour = getStartTimes()[0];
    var startTimeMinutes = getStartTimes()[1];
    var count2 = $("#start_time_hour option").length;
    for(i=0;i<count2;i++){
        var optionValue = $("#start_time_hour option").eq(i).val();
        if(optionValue==startTimeHour){
            $("#start_time_hour option").eq(i).attr("selected","selected");
        };
    };
    var count3 = $("#start_time_minute option").length;
    for(i=0;i<count3;i++){
        var optionValue = $("#start_time_minute option").eq(i).val();
        if(optionValue==startTimeMinutes){
            $("#start_time_minute option").eq(i).attr("selected","selected");
        };
    };
    var appointmentDuration = $("#appt-duration-span").text();
    var count4 = $("#appointment_duration-select option").length;
    for(i=0;i<count4;i++){
        var optionValue = $("#appointment_duration-select option").eq(i).val();
        if(optionValue==appointmentDuration){
            $("#appointment_duration-select option").eq(i).attr("selected","selected");
        };
    };
    $("select").css("display","none");
}
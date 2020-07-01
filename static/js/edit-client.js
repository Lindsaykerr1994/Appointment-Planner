$(document).ready(function(){
    $(".delete-button").click(updateModalLinks);
    $(".client-button").mouseenter(function(){
        $(".client-button i").text("person_add");
    })
    $(".client-button").mouseleave(function(){
        $(".client-button i").text("add");
    })
})
function updateModalLinks(){
    var clientId = $(this).attr("data-client-id");
    console.log(clientId)
    $("#delete-client-btn").attr("href",`delete_client/${clientId}`);
    return clientId;
};
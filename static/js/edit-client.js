$(document).ready(function(){
    $(".delete-button").click(updateModalLinks);
})
function updateModalLinks(){
    var clientId = $(this).attr("data-client-id");
    console.log(clientId)
    $("#delete-client-btn").attr("href",`delete_client/${clientId}`);
    return clientId;
};
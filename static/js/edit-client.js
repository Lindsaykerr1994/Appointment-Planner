$(document).ready(function(){
    $(".delete-button").click(updateModalLinks);
    $(".client-button").mouseenter(function(){
        $(".client-button i").text("person_add");
    })
    $(".client-button").mouseleave(function(){
        $(".client-button i").text("add");
    })
})

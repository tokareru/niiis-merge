$(function(){
    $("#1_layout").on("change", function(){
        alert("ad");
    var id1 = $("#1_layout").children("option:selected"). val();
    var id2 = $("#2_layout").children("option:selected"). val();
    $.ajax({
        url: "get_fields",
        data: {id1:id1, id2:id2},
        success:function(answer){
            $("#fields").html(answer);
        }
        });
    });
    $("#2_layout").on("change", function(){
    var id1 = $("#1_layout").children("option:selected"). val();
    var id2 = $("#2_layout").children("option:selected"). val();
    $.ajax({
        url: "get_fields",
        data: {id1:id1, id2:id2},
        success:function(answer){
            $("#fields").html(answer);
        }
        });
    });
   
    $("#save").on("click", function(){
        var id1 = $("#1_layout").children("option:selected"). val();
        var id2 = $("#2_layout").children("option:selected"). val();
        var id3 = $("#2_layout").children("option:selected"). val();
    });
});
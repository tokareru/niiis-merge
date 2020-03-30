$(function(){
    var saveObj = [];
    saveObj.push({
            id:1,
            status:'active'
        });
    
    var json = {data:saveObj}
        console.log(saveObj)
    
    $.ajax({
        url:"ajax/save_route_type",
        type:"POST",
        data: json,
        success: function(answer){
            console.log(answer);
        }
        
    });
});



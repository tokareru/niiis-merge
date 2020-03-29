$(function(){
    var saveObj = [];
    saveObj.push({
            name: "testovaya",
            equipment: "testovaya",
            tools: "testovaya"
        });
    saveObj.push({
            name: "testovaya1",
            equipment: "testovaya1",
            tools: "testovaya1"
        });
    var json = {data:saveObj}
        console.log(saveObj)
    
    $.ajax({
        url:"ajax/save_route_map_1_2",
        type:"POST",
        data: json,
        success: function(answer){
            console.log(answer);
        }
        
    });
});



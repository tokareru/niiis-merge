$(function(){
    var saveObj = [];
    saveObj.push({
            name: {id:1,lvl:2},
            equipment: {id:7,lvl:3},
            tools: {id:8, lvl:3}
        });
    saveObj.push({
            name: {id:1,lvl:2},
            equipment: [{id:3,lvl:3}, {id:5, lvl:3}],
            tools: {id:4, lvl:3}
        });
        saveObj.push({
            name: {id:1,lvl:2},
            equipment: [],
            tools: []
        });
        saveObj.push({
            name: {id:0,lvl:0},
            equipment: [],
            tools: []
        });
    var json = {data:saveObj}
        console.log(saveObj)
    
    $.ajax({
        url:"ajax/save_route_map_3",
        type:"POST",
        data: json,
        success: function(answer){
            console.log(answer);
        }
        
    });
});



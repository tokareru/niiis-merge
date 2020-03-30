$(function(){
    var json = {login:"test", productTasks:[{name:"test", job:"test", techOperation:"test", task:"test"}]};
//    saveObj.push({
//            id:1,
//            status:'active'
//        });
    
//    var json = {data:saveObj}
//        console.log(saveObj)
    
    $.ajax({
        url:"ajax/save_production_task_1_2",
        type:"POST",
        data: json,
        success: function(answer){
            console.log(answer);
        }
        
    });
});



$(function(){
    $("#save").on("click", function(){
       var array_1_layout = $(".1lvl");
       var array_2_layout = $(".2lvl");
       var tools = $(".tools");
       var equipment = $(".equipment");
       var json = new Object();
       json.layout1=[];
       json.layout2=[];
       json.layout3 = new Object();
       json.layout3.tools = [];
       json.layout3.equipment = [];
       for (var i = 0; i < array_1_layout.length; i++) {
           console.log(array_1_layout[i].value);
           var elem = new Object();
           elem.name = array_1_layout[i].value;
           elem.id = array_1_layout[i].id;
           json.layout1.push(elem);
       }
       
       for (var i = 0; i < array_2_layout.length; i++) {
           console.log(array_2_layout[i].name);
           var elem = new Object();
           elem.name = array_2_layout[i].value;
           elem.id = array_2_layout[i].id;
           elem.parent = array_2_layout[i].name;
           json.layout2.push(elem);
       }
       var str = '';
       for (var i = 0; i < tools.length; i++) {
           console.log(tools[i].name);
           if((i+1 < tools.length) && (tools[i].name === tools[i+1].name)){
                if(str == ''){
                   str += tools[i].value;
                }else{
                    str+= ', '+tools[i].value;
                }
           }
           else{
                if(str == ''){
                   str += tools[i].value;
                }else{
                    str+= ', '+tools[i].value;
                }
                var elem = new Object();
                elem.name = str;
                elem.parent = tools[i].name;
                json.layout3.tools.push(elem);
                str = '';
           }
           
       }
        for (var i = 0; i < equipment.length; i++) {
           console.log(equipment[i].name);
           if((i+1 < equipment.length) && (equipment[i].name === equipment[i+1].name)){
                if(str == ''){
                   str += equipment[i].value;
                }else{
                    str+= ', '+equipment[i].value;
                }
           }
           else{
                if(str == ''){
                   str += equipment[i].value;
                }else{
                    str+= ', '+equipment[i].value;
                }
                var elem = new Object();
                elem.name = str;
                elem.parent = equipment[i].name;
                json.layout3.equipment.push(elem);
                str = '';
           }
           
       }
       console.log(JSON.stringify(json));
       $.ajax({
        url: "save_technologist_info",
        type: "POST",
        data: {save:json},
        success: function (res) {
            console.log(res);
        }
    });
    });
  
});
//production_task_field
function initProductionTaskField () {
    $.ajax({
        type: "GET",
        url: "json/production_task.json",
        dataType: "json",
        success: function (json) {
            let selectUserBody = $("#productionTaskSelectUserBody");
            let nameUsers = getLoginNames("long_name");
            nameUsers.forEach(function (user) {
                selectUserBody.append("<option>" + user + "</option>");
            })

            let tableInfo = json.table;

            let html = downloadHTML("pages/production_task_field_table")
            $("#prod_task_table_container").append(html);
            generateTable(tableInfo, {
                table_block: "#prod_task_table_block",
                edit_mode_div: "#prod_task_table_edit",
                url: ""
            });
        },
        error: function (message) {
            console.log("Can't load the data");
        }
    })
}

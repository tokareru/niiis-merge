function initRouteMap() {
    getJsonByURL("json/route_map.json", generateTable,
        {table_block : "#routeMapBlock", edit_mode_div: "#routeMap_edit", url: "", save_url:""});
}


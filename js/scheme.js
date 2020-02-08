import * as THREE from './3D/stl/three.module.js';
import {STLLoader} from './3D/stl/STLLoader.js';

export function initScheme() {
    initTitleBlock();

    let FirstInitDownloaded = false;
    /*if (Round === 3)
    {
        $('#drawcanv').css({'display': 'none'});
    }*/

    window.lines1 = []; // массив координат всех нарисованных линий (x0, y0, xn, yn)
    window.lines2 = [];
    window.lines3 = [];
    window.crivie = [];
    window.arrcoor = [];
    window.arrcoor1 = [];
    window.showlines = [0,1];
    window.increment = 0;
    window.echo;
    window.echoarray = [0,0,0,0];

    window.areas1 = []; // массив круглых областей в которых происходит клик
    window.areas2 = []; // координаты кругов в размерах
    window.areas3 = []; // координаты стрелок в размерах
    window.r = 6;
    window.inCircle;
    window.clickedCircles;
    window.clickedCircles1;
    window.ctxs = [];
    window.dlinaarr = [];
    //window.imageid = {"std_component_1": "bolthideimg1", "std_component_2": "bolthideimg2", "std_component_3": "bolthideimg3"};

    window.isEnded = false;

    createCoor();
    createrazmer();
    //createKontur();

    var container, stats;

    var cameraTarget;

    var check = {
        checkbox: true,
    };

    var inc = 0;

    window.meshs = {};
    window.renderersc;
    window.camerasc;
    window.scenesc;
    window.MeshsLinesScheme = [];

    window.stldata =
        [
            ["./3dstl/pdm/11.stl", 0xffffff, "vis1"],
            ["./3dstl/pdm/22.stl", 0xffffff, "vis2"],
            ["./3dstl/pdm/33.stl", 0xffffff, "vis3"],
            ["./3dstl/pdm/44.stl", 0xffffff, "vis4"],
            ["./3dstl/standart/11.stl", 0xffffff, "vis5"],
            ["./3dstl/standart/22.stl", 0xffffff, "vis6"],
            ["./3dstl/standart/33.stl", 0xffffff, "vis7"]
        ];

    init();
    animate();
    look();

    /* var gui = new dat.GUI({autoPlace: false, width: 100+'%'});
    document.getElementById("scheme1").appendChild(gui.domElement);
    gui.domElement.id = 'gui';

    gui.add(check, 'checkbox').name('Вращение').onChange(function (value) {
        animate();
    }); */

    function init() {

        container = document.createElement('div');
        document.getElementById("scheme1").appendChild(container);

        /* $('#drawcanv').droppable(
            {
                drop: function (event, ui) {
                    let $checkboxid1 = $('#pdm_field').find("p").last();
                    let $checkboxid2 = $('#std_field').find("p").last();

                    let $children = ui.draggable[0]['children'][1];
                    let id = $children.id;
                    if(id.indexOf('std') !== -1)
                    {
                        $checkboxid2.find("input").click();
                    }
                    else {
                        $checkboxid1.find("input").click();
                    }
                    $('#' + id).click();

                }
            }
        ); */

        //window.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        //window.camerasc = new THREE.OrthographicCamera(window.innerWidth * 0.003 / -2, window.innerWidth * 0.003 / 2, window.innerHeight * 0.003 / 2, window.innerHeight * 0.003 / -2, 1, 15);
        window.camerasc = new THREE.OrthographicCamera($("#field3D")[0].clientWidth * 0.004 / -2, $("#field3D")[0].clientWidth * 0.004 / 2, $("#field3D")[0].clientHeight * 0.004 / 2, $("#field3D")[0].clientHeight * 0.004 / -2, 1, 15);
        camerasc.position.set(3, 0.15, 3);

        cameraTarget = new THREE.Vector3(0, 0.15, 0);

        window.scenesc = new THREE.Scene();
        scenesc.background = new THREE.Color(0xffffff/*0x72645b*/);
        //scenesc.fog = new THREE.Fog(/*0x72645b*/0xAAAAAA, 2, 15);


        // Ground

        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(40, 40),
            new THREE.MeshPhongMaterial({color: 0x999999, specular: 0x101010})
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.5;
        //scene.add(plane);

        plane.receiveShadow = true;


        // ASCII file
        window.loader = new STLLoader();

        for (let i = 0; i < stldata.length; i++) {
            loadSTL(stldata[i][0], stldata[i][1], stldata[i][2]);
        }


        // Colored binary STL

        // Lights

        scenesc.add(new THREE.HemisphereLight(0x443333, 0x111122));

        addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        //addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
        addShadowedLight(-1, -1, -1, 0xffffff, 1);
        // renderer

        window.renderersc = new THREE.WebGLRenderer({antialias: true, canvas: topcanv});
        //renderersc.setPixelRatio(window.devicePixelRatio);
        renderersc.setSize($('#scheme1').width(), $('#scheme1').width() * 9 / 16);

        renderersc.gammaInput = true;
        renderersc.gammaOutput = true;

        renderersc.shadowMap.enabled = true;

        container.appendChild(renderersc.domElement);

        // stats

        //stats = new Stats();
        //container.appendChild( stats.dom ); //счетчик фпс

        //

        $(window).on('resize', onWindowResize);
        $("#tabs li[aria-controls=\"scheme\"]").click(function () {
            onWindowResize();
        })
    }

    //-0.315
    var konturallow = true;
    function loadSTL(src, color = 0x808080, arrmesh, pos = {x: 1, y: 0.2, z: 1}, rot = {
        x: -Math.PI / 2,
        y: 0,
        z: Math.PI / 4
    }, scale = {x: 0.5, y: 0.5, z: 0.5}, angle = 20) {

        loader.load(src, function (geometry) {

            var material = new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 200});

            var mesh = new THREE.Mesh(geometry, material);

            //добавляем грани на модель
            var geometry = new THREE.EdgesGeometry(mesh.geometry, angle);

            var material = new THREE.LineBasicMaterial({color: 0x808080});

            var wireframe = new THREE.LineSegments(geometry, material);
            wireframe.rotation.set(rot.x, rot.y, rot.z);
            wireframe.scale.set(scale.x, scale.y, scale.z);
            wireframe.position.set(pos.x, pos.y, pos.z);

            mesh.visible = true;
            wireframe.visible = true;

            mesh.position.set(pos.x, pos.y, pos.z);//-0.6
            mesh.rotation.set(rot.x, rot.y, rot.z);
            mesh.scale.set(scale.x, scale.y, scale.z);

            mesh.castShadow = true;
            mesh.receiveShadow = false;

            var pleft = mesh.clone();
            var pleftgran = wireframe.clone();

            pleft.position.x = 1;
            pleftgran.position.x = 1;
            pleft.position.z = -1;
            pleftgran.position.z = -1;
            pleft.rotation.z = Math.PI - Math.PI / 4;
            pleftgran.rotation.z = Math.PI - Math.PI / 4;

            var pleft1 = mesh.clone();
            var pleftgran1 = wireframe.clone();

            pleft1.position.x = -1;
            pleftgran1.position.x = -1;

            pleft1.position.z = -1;
            pleftgran1.position.z = -1;

            pleft1.position.y = -0.7;
            pleftgran1.position.y = -0.7;

            pleft1.rotation.y = Math.PI / 4;
            pleftgran1.rotation.y = Math.PI / 4;

            pleft1.rotation.x = 0;
            pleftgran1.rotation.x = 0;

            pleft1.rotation.z = 0;
            pleftgran1.rotation.z = 0;

            window.MeshsLinesScheme[arrmesh] = [];
            /*window.MeshsLinesScheme[arrmesh].push(mesh);
            window.MeshsLinesScheme[arrmesh].push(wireframe);

            window.MeshsLinesScheme[arrmesh].push(pleft);
            window.MeshsLinesScheme[arrmesh].push(pleftgran);

            window.MeshsLinesScheme[arrmesh].push(pleft1);
            window.MeshsLinesScheme[arrmesh].push(pleftgran1);*/

            scenesc.add(mesh);
            scenesc.add(wireframe);
            scenesc.add(pleft);
            scenesc.add(pleftgran);
            scenesc.add(pleft1);
            scenesc.add(pleftgran1);

            //добавляем весь чертеж
            //Round = 2;
            console.log("Round: "+ Round);

            let getStatusDraw = setInterval(function () {
                try {
                    getDrawingStatus();
                    //console.log(echo.is_drawing_finished);
                    if ( echo.is_drawing_finished)
                    {
                        clearInterval(getStatusDraw);
                    }
                    else
                    {
                        if (konturallow)
                        {
                            createKontur();
                            konturallow = false;
                        }
                    }
                }catch (e) {
                }

            }, 5000);

            if (Round === 3)
            {
                if(!FirstInitDownloaded){
                    //$('#drawcanv').css({'display': 'none'});
                    $('#hidedraw').css({'display': 'block'});
                    $('#topcanv').css({'display': 'block'});
                    firstFieldInit();
                    razmerdrawfull();
                    $("#ready").click();
                    setDrawingStatus();
                }
            }
            else
            {
                if(!FirstInitDownloaded)
                {
                    //setDrawingStatus();
                    FirstInitDownloaded = true;
                    $('#hidedraw').css({'display': 'none'});
                    getDrawingStatus();
                    let inter = setInterval(function()
                    {
                        if (window.echo != undefined)
                        {
                            let inter1 = setInterval(function()
                            {
                                if (window.namerole != undefined)
                                {
                                    clearInterval(inter1);
                                }
                            }, 100) ;
                            //window.namerole = "kek";
                            //console.log(echo.is_drawing_finished);
                            if (echo.is_drawing_finished == false && window.namerole != "конструктор")
                            {
                                $('#drawcanv').css({'display': 'none'});
                                $('#topcanv').css({'display': 'none'});
                            }

                            if(echo.is_drawing_finished)
                            {
                                //console.log('finish');
                                $('#drawcanv').css({'display': 'block'});
                                $('#topcanv').css({'display': 'block'});
                                $('#hidedraw').css({'display': 'block'});
                                razmerdrawfull();
                                $("#ready").click();
                                clearInterval(inter);
                            }

                        }
                    }, 100);
                }
            }
            //Round = 3;
        });
    }

    function firstFieldInit() {
        let prev = window.isEnded;
        window.isEnded = true;
        let array = ["component_1", "component_2", "component_3", "component_4", "std_component_1", "std_component_2", "std_component_3"];
        for (let i = 0; i < 4; i++) {
            if (array.indexOf('component_' + (i + 1)) != -1) {
                //meshs[stldata[i][2]].visible = true;
                for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                    MeshsLinesScheme[stldata[i][2]][j].visible = true;
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            if (array.indexOf('std_component_' + (i + 1)) != -1) {
                //meshs[stldata[i+4][2]].visible = true;
                for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                    MeshsLinesScheme[stldata[i + 4][2]][j].visible = true;
                }
            }
        }
        if (typeof scene != "undefined") {
            window.renderer.render(scene, camera);
        }
        window.renderersc.render(scenesc, camerasc);

        FirstInitDownloaded = true;
        window.isEnded = false;
    }

    function addShadowedLight(x, y, z, color, intensity) {

        var directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        scenesc.add(directionalLight);

        directionalLight.castShadow = true;

        var d = 1;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;

        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 4;

        directionalLight.shadow.bias = -0.002;

    }

    function onWindowResize() {
        //camerasc.aspect = window.innerWidth / window.innerHeight;
        camerasc.updateProjectionMatrix();

        //renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );
        //renderersc.setSize($('#scheme1').width(), $('#scheme1').width() * 9 / 16);
        /*$("#scheme1").find("canvas").last().css({
            "width": "100%",
            "height": "100%"
        });*/
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        //stats.update();
    }

    function look() {
        camerasc.lookAt(cameraTarget);
        camerasc.position.x = 3.85;
        camerasc.position.y = -0.35;
    }

    function render() {
        /*    inc += 0.008;
           //var timer = Date.now() * 0.0005;
           camera.position.x = Math.cos(inc) * 3;
           camera.position.z = Math.sin(inc) * 3;*/
        //camera.lookAt(cameraTarget);

        renderersc.render(scenesc, camerasc);
    }

    /*function hide(ob) {
        if (ob["domElement"].children[0].checked == false) {
            meshs[ob.property].visible = false;
            renderer.render(scene, camera);
        } else {
            meshs[ob.property].visible = true;
            renderer.render(scene, camera);
        }
    }*/


    /* $('.canvimg')[2].style = "height: 28.3vw;";

    inter = setInterval(function ()
    {
        if ($('.canvimg')[0].width != 0 && $('.canvimg')[2].width != 0)
        {
            resizecanv();
            clearInterval(inter);
        }
    }, 10);
*/
    function resizecanv()
    {
        for (let i = 0; i < $("#drawcanv").length; i++)
        {
            //$("#field3D div div canvas")[i].width *= 1.2;
            //$("#field3D div div canvas")[i].height *= 1.2;
            $("#topcanv")[i].width = $("#field3D")[0].clientWidth-14;
            $("#topcanv")[i].height = $("#field3D")[0].clientHeight;

            $("#drawcanv")[i].width = $("#field3D")[0].clientWidth-7;
            $("#drawcanv")[i].height = $("#field3D")[0].clientHeight;

            $("#hidedraw").width($("#drawcanv").width());
            $("#hidedraw").height($("#drawcanv").height());

            $("#topcanv")[i].style = "";
            renderersc.setSize($("#field3D")[0].clientWidth-7, $("#field3D")[0].clientHeight);
            //$("#drawcanv")[i].style.cssText = $("#field3D div div canvas")[i].style.cssText;
            window.ctxs[i].lineWidth = 2;
            if (window.isEnded) {$("#topcanv")[0].style.cssText += " display:block;";}
        }
        ctxs[0].beginPath();
        if (isEnded==false)
        {
            for (let k=0; k<lines1.length; k++)
            {
                ctxs[0].moveTo(lines1[k][0], lines1[k][1]);
                ctxs[0].lineTo(lines1[k][2], lines1[k][3]);
                ctxs[0].stroke();
            }
        }
    }

    $(".field3DAll").resize(function() {
        resizecanv();
    });

    for (let i = 0; i < $("#drawcanv").length; i++) {
        window.ctxs[i] = $("#drawcanv")[i].getContext("2d");
        $("#topcanv")[i].width = $("#field3D")[0].clientWidth-14;
        $("#topcanv")[i].height = $("#field3D")[0].clientHeight;

        //$("#field3D div div canvas")[i].width *= 1.2;
        //$("#field3D div div canvas")[i].height *= 1.2;
        $("#drawcanv")[i].width = $("#field3D")[0].clientWidth-7;
        $("#drawcanv")[i].height = $("#field3D")[0].clientHeight;

        $("#hidedraw").width($("#drawcanv").width());
        $("#hidedraw").height($("#drawcanv").height());

        $("#topcanv")[i].style = "";
        renderersc.setSize($("#field3D")[0].clientWidth-7, $("#field3D")[0].clientHeight);
        //$("#drawcanv")[i].style.cssText = $("#field3D div div canvas")[i].style.cssText;
        window.ctxs[i].fillStyle = "black";
        window.ctxs[i].lineWidth = 2;
        //console.log($("#fcheme div div canvas")[i].width +';'+ $("#fcheme div div canvas")[i].height);
    }

    function CirclesRazmDraw()
    {
        let k;
        let arr = [];

        for (let i=0;i<lines2.length;i++)
        {
            for (let j=0;j<areas2.length;j++)
            {
                k=j;
                if (j == 0 && areas2[j].x == 156 && areas2[j].y == 54) {k = 1;}
                if (j == 2 && areas2[j].x == 156 && areas2[j].y == 460) {k = 3;}
                if (j == 4 && areas2[j].x == 558 && areas2[j].y == 129) {k = 5;}
                if ((lines2[i][0] == areas2[j].x && lines2[i][1] == areas2[j].y && lines2[i][2] == areas2[k].x && lines2[i][3] == areas2[k].y) ||
                    (lines2[i][2] == areas2[j].x && lines2[i][3] == areas2[j].y && lines2[i][0] == areas2[k].x && lines2[i][1] == areas2[k].y))
                {
                    arr.push(areas2[j], areas2[k]);
                }
                else
                {

                }
            }

            //if (i % 2==1) {k = i-1;} else {k = i;}
            /* if ((lines2[i][0] == areas2[k].x && lines2[i][1] == areas2[k].y) && (lines2[i][2] == areas2[k].x && lines2[i][3] == areas2[k].y))
            {

            }
            else
            {

            } */
        }
        if (lines2.length == 0)
        {
            for (let j=0;j<areas2.length;j++)
            {
                ctxs[0].beginPath();
                ctxs[0].arc(areas2[j].x, areas2[j].y, r, 0, 2 * Math.PI, 0);
                ctxs[0].stroke();
            }
        }
        else
        {
            for (let l=0;l<areas2.length;l++)
            {
                if (arr.indexOf(areas2[l]) == -1)
                {
                    ctxs[0].beginPath();
                    ctxs[0].arc(areas2[l].x, areas2[l].y, r, 0, 2 * Math.PI, 0);
                    ctxs[0].stroke();
                }
            }
        }
    }

    function circlesdraw()
    {
        for (let j=0;j<areas1.length;j++)
        {
            if (showlines.indexOf(j) != -1)
            {
                ctxs[0].beginPath();
                ctxs[0].arc(areas1[j].x, areas1[j].y, r, 0, 2 * Math.PI, 0);
                ctxs[0].stroke();
                ctxs[0].font = "italic 10pt Arial";
                ctxs[0].fillText(j+1, areas1[j].x+5, areas1[j].y+10);
            }
        }
    }

    function razmerdraw(dlina)
    {
        let razmID, echotext;
        let ar=[];
        for (let i=0; i<lines2.length; i++)
        {
            for (let ii=0; ii<lines2[i].length-1; ii++)
            {
                for (let k=0; k<areas2.length; k++)
                {
                    if (lines2[i][ii] == areas2[k].x && lines2[i][ii+1] == areas2[k].y)
                    {
                        ar.push(k);
                    }
                }

            }
        }

        dlinaarr[0]=112;
        dlinaarr[1]=345;
        dlinaarr[2]=248;

        for (let l=0; l<ar.length; l++)
        {
            let j = ar[l];
            let echo=[];
            let x = areas3[j].x;
            let y = areas3[j].y;
            let y1, x1;
            ctxs[0].beginPath();
            ctxs[0].moveTo(x, y);

            switch (areas3[j].rotation)
            {
                case "up":
                {
                    ctxs[0].lineTo(x-5, y+10);
                    ctxs[0].lineTo(x+5, y+10);
                    ctxs[0].fill();
                    ctxs[0].beginPath();
                    ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                    ctxs[0].lineTo(x-10, y);
                    if (j % 2 == 0)
                    {
                        ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                        ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                        ctxs[0].font = "italic 10pt Arial";
                        for (let i=0; i<ar.length; i++)
                        {
                            if (areas3[ar[i]].y == 472)
                            {
                                echo.push(dlinaarr[1]);
                            }
                            if (areas3[ar[i]].x == 144)
                            {
                                echo.push(dlinaarr[0]);
                            }
                            if (areas3[ar[i]].y == 170)
                            {
                                echo.push(dlinaarr[2]);
                            }

                            if (ar[i] == 0 || ar[i] == 1) {razmID = 1}
                            if (ar[i] == 2 || ar[i] == 3) {razmID = 2}
                            if (ar[i] == 4 || ar[i] == 5) {razmID = 3}
                        }

                        if (document.getElementById('razmNumber'+razmID) === null)
                        {
                            $( "#scheme1" ).append( "<input id='razmNumber"+razmID+"'>" );
                            $( "#razmNumber"+razmID ).val('100');
                            $( "#razmNumber"+razmID ).focus();
                            $( "#razmNumber"+razmID ).keypress(function( event )
                            {
                                if ( event.which == 13 )
                                {
                                    event.preventDefault();
                                    //echotext = this.value;
                                    //echoarray[razmID] = echotext;
                                    $( "#razmNumber"+razmID ).blur();
                                    //$( "#razmNumber"+razmID ).hide();
                                    //ctxs[0].fillText(echotext, areas3[j].x-25, areas3[j].y + Math.abs(areas3[j].y-areas3[j+1].y)/2); //echo[l]
                                }
                            });
                        }
                        //ctxs[0].fillText(echoarray[razmID], areas3[j].x-25, areas3[j].y + Math.abs(areas3[j].y-areas3[j+1].y)/2);
                    }
                    ctxs[0].stroke();
                    break;
                }

                case "down":
                {
                    ctxs[0].lineTo(x-5, y-10);
                    ctxs[0].lineTo(x+5, y-10);
                    ctxs[0].fill();
                    ctxs[0].beginPath();
                    ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                    ctxs[0].lineTo(x-10, y);
                    if (j % 2 == 0)
                    {
                        ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                        ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                    }
                    ctxs[0].stroke();
                    break;
                }

                case "left":
                {
                    ctxs[0].lineTo(x+10, y-5);
                    ctxs[0].lineTo(x+10, y+5);
                    ctxs[0].fill();
                    ctxs[0].beginPath();
                    ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                    ctxs[0].lineTo(x, y+10);
                    if (j % 2 == 0)
                    {
                        ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                        ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                        ctxs[0].font = "italic 10pt Arial";
                        for (let i=0; i<ar.length; i++)
                        {
                            if (areas3[ar[i]].y == 472)
                            {
                                echo.push(dlinaarr[1]);
                            }
                            if (areas3[ar[i]].x == 144)
                            {
                                echo.push(dlinaarr[0]);
                            }
                            if (areas3[ar[i]].y == 170)
                            {
                                echo.push(dlinaarr[2]);
                            }

                            if (ar[i] == 0 || ar[i] == 1) {razmID = 1}
                            if (ar[i] == 2 || ar[i] == 3) {razmID = 2}
                            if (ar[i] == 4 || ar[i] == 5) {razmID = 3}

                            //if (i % 2==0) {ctxs[0].fillText($( "#razmNumber"+razmID ).val(), areas3[j].x + Math.abs(areas3[j].x-areas3[j+1].x)/2, areas3[j].y-7);}
                        }
                        if (document.getElementById('razmNumber'+razmID) === null)
                        {
                            $( "#scheme1" ).append( "<input id='razmNumber"+razmID+"'>" );
                            $( "#razmNumber"+razmID ).val('100');
                            $( "#razmNumber"+razmID ).focus();
                            $( "#razmNumber"+razmID).keypress(function( event )
                            {
                                if ( event.which == 13 )
                                {
                                    event.preventDefault();
                                    //echotext = this.value;
                                    //echoarray[razmID] = echotext;
                                    $( "#razmNumber"+razmID ).blur();
                                    //$( "#razmNumber"+razmID ).hide();
                                    //ctxs[0].fillText(echotext, areas3[j].x + Math.abs(areas3[j].x-areas3[j+1].x)/2, areas3[j].y+15); //echo[l]
                                }
                            });
                        }
                        //ctxs[0].fillText($( "#razmNumber"+razmID ).val(), areas3[j].x + Math.abs(areas3[j].x-areas3[j+1].x)/2, areas3[j].y-7);
                    }
                    ctxs[0].stroke();
                    break;
                }

                case "right":
                {
                    ctxs[0].lineTo(x-10, y-5);
                    ctxs[0].lineTo(x-10, y+5);
                    ctxs[0].fill();
                    ctxs[0].beginPath();
                    ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                    ctxs[0].lineTo(x, y+10);
                    if (j % 2 == 0)
                    {
                        ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                        ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                    }
                    ctxs[0].stroke();
                    break;
                }
            }
        }

    }

    $("#ready").click(function () {
        for (let j = 0; j < 3; j++) {
            /*   eval('canv' + (j + 1).toString()).style.display = 'none';
             try {
                 $(".canvimg")[0].className += 'done';
             } catch (err) {
                 //alert('Отрисовка уже выполнена');
                 break;
             } */
            window.isEnded = true;
        }
    });

    $("#drawcanv").mousedown(function (e) {
        e.preventDefault();
        window.down = true;
        let n = $(this)[0].id;
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left - 1;
        let y = e.clientY - rect.top - 1;

        for (let i = 0; i < 3; i++) {
            if (n == ctxs[i].canvas.id) {
                window.gx = x;
                window.gy = y;

                if (isEnded == false) {circlesdraw();}

                for (let j = 0; j < areas1.length; j++) {
                    let dx = x - areas1[j].x;
                    let dy = y - areas1[j].y;
                    if (dx * dx + dy * dy < r * r) {
                        window.clickedCircles = j;
                        arrcoor = [];
                        window.arrcoor.push([areas1[j].x, areas1[j].y]);
                        //console.log('; '+areas1[j].x+'; '+areas1[j].y);
                        //console.log(arrcoor);
                        //info.innerText += 'down:В круге №' + (j + 1) + '\n';
                        break;
                        //clickedCircles.push(j);
                    } else {
                        window.clickedCircles = undefined;
                        //info.innerText += 'down:Не в круге №' + (j + 1) + '\n';
                        //clickedCircles.splice(j, 1);
                    }
                }
                if (isEnded == true)
                {
                    CirclesRazmDraw();
                    for (let j = 0; j < areas2.length; j++) {
                        let dx = x - areas2[j].x;
                        let dy = y - areas2[j].y;
                        if (dx * dx + dy * dy < r * r) {
                            window.clickedCircles1 = j;
                            arrcoor1 = [];
                            window.arrcoor1.push([areas2[j].x, areas2[j].y]);
                            console.log(arrcoor1);
                            break;
                        } else {
                            window.clickedCircles1 = undefined;
                        }
                    }
                    razmerdraw();
                }

                break;
            }
        }


    }).mouseup(function (e) {
        window.down = false;
        let n = $(this)[0].id;

        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left - 1;
        let y = e.clientY - rect.top - 1;
        //alert(x+'; '+y);

        for (let i = 0; i < 3; i++) {
            if (n == ctxs[i].canvas.id) {
                /*thisarrlines = eval('lines' + n[4]);
                thisarrlines.push([gx, gy, window.endx, window.endy]);
                drawall(ctxs[i]);*/
                let summ = 0;
                for (let l=0; l<window.crivie.length; l++)
                {
                    summ+=window.crivie[l];
                }
                window.crivie = [];
                ctxs[i].clearRect(0, 0, document.getElementsByTagName("canvas")[ctxs[i].canvas.id].width,
                    document.getElementsByTagName("canvas")[ctxs[i].canvas.id].height);

                if (isEnded == false) {circlesdraw();}
                //#lines32
                if (lines1.length<32)
                {
                    for (let k=0; k<lines1.length; k++)
                    {
                        ctxs[i].moveTo(lines1[k][0], lines1[k][1]);
                        ctxs[i].lineTo(lines1[k][2], lines1[k][3]);
                        ctxs[i].stroke();
                    }
                }



                if (window.clickedCircles != undefined) {
                    for (let j = 0; j < areas1.length; j++) {
                        let dx = x - areas1[j].x;
                        let dy = y - areas1[j].y;
                        if (dx * dx + dy * dy < r * r) {
                            //console.log(window.arrcoor);
                            let d = Math.sqrt((x-arrcoor[0][0])*(x-arrcoor[0][0])+(y-arrcoor[0][1])*(y-arrcoor[0][1]));
                            //console.log(d+'; '+summ);
                            if ((summ-d)/summ > 0.2) {return;}
                            window.arrcoor = [];
                            window.crivie = [];
                            //info.innerText += 'up:В круге №' + (j + 1) + '\n';
                            if (areas1[j].arr.indexOf(window.clickedCircles) == -1) {continue;}
                            lines1.push([areas1[clickedCircles].x, areas1[clickedCircles].y, areas1[j].x, areas1[j].y]);
                            ctxs[i].beginPath();

                            ctxs[i].clearRect(0, 0, document.getElementsByTagName("canvas")[ctxs[i].canvas.id].width,
                                document.getElementsByTagName("canvas")[ctxs[i].canvas.id].height);


                            if (lines1.length<32)
                            {
                                for (let k=0; k<lines1.length; k++)
                                {
                                    ctxs[i].moveTo(lines1[k][0], lines1[k][1]);
                                    ctxs[i].lineTo(lines1[k][2], lines1[k][3]);
                                    ctxs[i].stroke();
                                }
                            }

                            if (showlines.indexOf(lines1.length+1) == -1)
                            {
                                if (lines1.length == 8)
                                {
                                    areas1[0].arr.push(lines1.length);
                                }

                                if (lines1.length == 19)
                                {
                                    areas1[9].arr.push(lines1.length);
                                }

                                if (lines1.length == 31)
                                {
                                    areas1[20].arr.push(lines1.length);
                                }

                                if (lines1.length == 9 || lines1.length == 20)
                                {
                                    showlines.push(lines1.length);
                                    showlines.push(lines1.length+1);
                                    areas1[0].arr = [];
                                    areas1[9].arr = [];
                                    areas1[20].arr = [];
                                }
                                else
                                {
                                    if (lines1.length != 8 && lines1.length != 19)
                                    {
                                        showlines.push(lines1.length+1);
                                    }
                                }
                            }
                            if (lines1.length == 32)
                            {
                                $("#ready").click();
                                $("#scheme1 div canvas")[0].style.cssText += " display:block;";
                                $("#Kontur1").hide();

                            }
                            else
                            {
                                if (areas1.length >= lines1.length+2) {areas1[lines1.length+1].arr.push(lines1.length)};
                                areas1[lines1.length].arr = [];
                                circlesdraw();
                            }

                            /* ctxs[i].moveTo(areas1[clickedCircles].x, areas1[clickedCircles].y);
                            ctxs[i].lineTo(areas1[j].x, areas1[j].y);
                            ctxs[i].stroke(); */

                        } else {
                            /* window.arrcoor = [];
                            window.crivie = []; */
                            //info.innerText += 'up:Не в круге №' + (j + 1) + '\n';
                            //clickedCircles = undefined;
                        }
                    }
                }
                if (isEnded == true)
                {
                    CirclesRazmDraw();

                    if (window.clickedCircles1 != undefined) {
                        for (let j = 0; j < areas2.length; j++) {
                            let dx = x - areas2[j].x;
                            let dy = y - areas2[j].y;
                            if (dx * dx + dy * dy < r * r) {
                                //console.log(window.arrcoor);
                                let d = Math.sqrt((x-arrcoor1[0][0])*(x-arrcoor1[0][0])+(y-arrcoor1[0][1])*(y-arrcoor1[0][1]));
                                console.log(d+'; '+summ);
                                if ((summ-d)/summ > 0.2) {return;}
                                window.arrcoor1 = [];
                                window.crivie = [];
                                //info.innerText += 'up:В круге №' + (j + 1) + '\n';
                                if (areas2[j].arr.indexOf(window.clickedCircles1) == -1) {continue;}
                                lines2.push([areas2[clickedCircles1].x, areas2[clickedCircles1].y, areas2[j].x, areas2[j].y]);
                                ctxs[i].beginPath();

                                ctxs[i].clearRect(0, 0, document.getElementsByTagName("canvas")[ctxs[i].canvas.id].width,
                                    document.getElementsByTagName("canvas")[ctxs[i].canvas.id].height);
                                razmerdraw(d.toFixed());

                            } else {
                                /* window.arrcoor = [];
                                window.crivie = []; */
                                //info.innerText += 'up:Не в круге №' + (j + 1) + '\n';
                                //clickedCircles = undefined;
                            }
                        }
                    }
                    razmerdraw();
                    CirclesRazmDraw();
                }
                /* if (lines2.length ==3)
                {
                    window.increment++;
                    if (window.increment < 2)
                    {
                        setDrawingStatus();
                    }
                } */

                break;
            }
        }

    }).mouseout(function () {
        window.down = false;
    }).mouseover(function () {

    });


    $("#drawcanv").mousemove(function (e) {
        if (window.down == true) {
            let n = $(this)[0].id;
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left - 1;
            let y = e.clientY - rect.top - 1;
            window.endx = x;
            window.endy = y;
            for (let i = 0; i < 3; i++) {
                if (n == ctxs[i].canvas.id) {
                    drawline(ctxs[i], x, y);
                    break;
                }
            }
        }
    });



    $("#default1").click(function () {
        if (isEnded) {
            check1.click();
        } else {
            //('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#default2").click(function () {
        if (isEnded) {
            check2.click();
        } else {
            //alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#check1").click(function () {
        if (isEnded) {
            if ($(this)[0].checked) {
                for (let i = 1; i < 6; i++) {
                    eval('bolthideimg' + i).style.display = '';
                }
            } else {
                //for (j=0;j<3;j++) {document.getElementsByClassName("canvimgdone")[0].className = document.getElementsByClassName("canvimgdone")[0].className.substr(0,7);}
                for (let i = 1; i < 6; i++) {
                    eval('bolthideimg' + i).style.display = 'none';
                }
            }
        } else {
            $(this)[0].checked = false;
            //alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#check2").click(function () {
        if (isEnded) {
            if ($(this)[0].checked) {
                for (let i = 1; i < 6; i++) {
                    eval('bolthideimg' + i + i).style.display = '';
                }
            } else {
                //for (j=0;j<3;j++) {document.getElementsByClassName("canvimgdone")[0].className = document.getElementsByClassName("canvimgdone")[0].className.substr(0,7);}
                for (let i = 1; i < 6; i++) {
                    eval('bolthideimg' + i + i).style.display = 'none';
                }
            }
        } else {
            $(this)[0].checked = false;
            //alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    /*$("body").mousedown(function (e) {
        e.preventDefault();
    }).mousemove(function (e) {
        e.preventDefault();
    });*/

    async function initDrawStatus() {
        await getDrawingStatus();
    }
    initDrawStatus();
    let tempInt = setInterval(function () {
        try {
            if (Round !== 3 && window.namerole == 'конструктор' && echo.is_drawing_finished == false)
            {
                circlesdraw();
                clearInterval(tempInt);
            }
        }
        catch (e) {
        }

    });


}

function razmerdrawfull()
{
    let ObjectRazmer = {};
    $.ajax({
        type: "GET",
        url: "drawing_main_text_ajax/load_size",
        success: function (answer) {
            ObjectRazmer = answer;
            dlinaarr[0]=ObjectRazmer.razm1;
            dlinaarr[2]=ObjectRazmer.razm2;
            dlinaarr[4]=ObjectRazmer.razm3;
            for (let j=0; j<areas3.length; j++)
            {
                let echo;
                let x = areas3[j].x;
                let y = areas3[j].y;
                let y1, x1;
                ctxs[0].beginPath();
                ctxs[0].moveTo(x, y);

                switch (areas3[j].rotation)
                {
                    case "up":
                    {
                        ctxs[0].lineTo(x-5, y+10);
                        ctxs[0].lineTo(x+5, y+10);
                        ctxs[0].fill();
                        ctxs[0].beginPath();
                        ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                        ctxs[0].lineTo(x-10, y);
                        if (j % 2 == 0)
                        {
                            ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                            ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                            ctxs[0].font = "italic 10pt Arial";

                            $( "#scheme1" ).append("<canvas id='razmer1'></canvas>");
                            let ct = document.getElementById("razmer1").getContext("2d");
                            ct.beginPath();
                            ct.font = "italic 10pt Arial";
                            ct.fillText(dlinaarr[j], 105, 50);
                            ct.stroke();

                            //ctxs[0].fillText(dlinaarr[j], areas3[j].x-25, areas3[j].y + Math.abs(areas3[j].y-areas3[j+1].y)/2);
                        }
                        ctxs[0].stroke();
                        break;
                    }

                    case "down":
                    {
                        ctxs[0].lineTo(x-5, y-10);
                        ctxs[0].lineTo(x+5, y-10);
                        ctxs[0].fill();
                        ctxs[0].beginPath();
                        ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                        ctxs[0].lineTo(x-10, y);
                        if (j % 2 == 0)
                        {
                            ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                            ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                        }
                        ctxs[0].stroke();
                        break;
                    }

                    case "left":
                    {
                        ctxs[0].lineTo(x+10, y-5);
                        ctxs[0].lineTo(x+10, y+5);
                        ctxs[0].fill();
                        ctxs[0].beginPath();
                        ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                        ctxs[0].lineTo(x, y+10);
                        if (j % 2 == 0)
                        {
                            ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                            ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                            ctxs[0].font = "italic 10pt Arial";
                            ctxs[0].fillText(dlinaarr[j], areas3[j].x + Math.abs(areas3[j].x-areas3[j+1].x)/2, areas3[j].y-7);
                        }
                        ctxs[0].stroke();
                        break;
                    }

                    case "right":
                    {
                        ctxs[0].lineTo(x-10, y-5);
                        ctxs[0].lineTo(x-10, y+5);
                        ctxs[0].fill();
                        ctxs[0].beginPath();
                        ctxs[0].moveTo(areas2[j].x, areas2[j].y);
                        ctxs[0].lineTo(x, y+10);
                        if (j % 2 == 0)
                        {
                            ctxs[0].moveTo(areas3[j].x, areas3[j].y);
                            ctxs[0].lineTo(areas3[j+1].x, areas3[j+1].y);
                        }
                        ctxs[0].stroke();
                        break;
                    }
                }
            }
        }
    });
}

/* function PdmOrStdHandler(event, data) {
    if (data.message_id === "checkedPdmComponents") {
        let data = data.data;

    } else if (data.message_id === "checkedStdComponents") {
        let data = data.data.join(", ");

    }
} */


function line(ctx, x, y) {
    window.gx = x;
    window.gy = y;
}

function drawline(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(x, y);
    let d = Math.sqrt((x-gx)*(x-gx)+(y-gy)*(y-gy));
    //window.crivie.push([gx,gy,x,y]);
    window.crivie.push(d);
    window.gx = x;
    window.gy = y;
    //ctx.clearRect(0, 0, document.getElementsByTagName("canvas")[ctx.canvas.id].width, document.getElementsByTagName("canvas")[ctx.canvas.id].height);
    ctx.stroke();
    //drawall(ctx);
} // при движении мыши рисовать линию

function drawall(ctx) {
    for (let i = 0; i < 3; i++) {
        if (n == ctxs[i].canvas.id) {
            ctx.beginPath();
            let thisarrlines = eval('lines' + n[4]);
            for (let i = 0; i < thisarrlines.length; i++) {
                let aa = thisarrlines[i][0];
                let bb = thisarrlines[i][1];
                let aa1 = thisarrlines[i][2];
                let bb1 = thisarrlines[i][3];
                //ctx.arc(134, 134, 10, 0, 2*Math.PI, 0);
                //ctx.arc(288, 134, 10, 0, 2*Math.PI, 0);
                ctx.moveTo(aa, bb);
                ctx.lineTo(aa1, bb1);
                ctx.stroke();
            }
            break;
        }
    }

} // нарисовать все линии после очистки canvas

function createCoor()
{
    let delta = 0;
    let m = 1;
    let c = [{x: 152, y: 56, arr:[]}, {x: 228, y: 56, arr:[0]}, {x: 233, y: 19, arr:[]}, {x: 272, y: 19, arr:[]},
        {x: 276, y: 56, arr:[]}, {x: 499, y: 56, arr:[]}, {x: 499, y: 157, arr:[]}, {x: 234, y: 159, arr:[]},
        {x: 153, y: 161, arr:[]},

        {x: 558, y: 56, arr:[]}, {x: 752, y: 56, arr:[]}, {x: 757, y: 19, arr:[]}, {x: 795, y: 19, arr:[]},
        {x: 804, y: 56, arr:[]}, {x: 804, y: 129, arr:[]}, {x: 779, y: 129, arr:[]},
        {x: 779, y: 160, arr:[]}, {x: 586, y: 160, arr:[]}, {x: 586, y: 129, arr:[]}, {x: 558, y: 129, arr:[]},

        {x: 153, y: 215, arr:[]}, {x: 220, y: 215, arr:[]}, {x: 220, y: 194, arr:[]}, {x: 292, y: 194, arr:[]},
        {x: 292, y: 215, arr:[]}, {x: 358, y: 215, arr:[]}, {x: 358, y: 194, arr:[]}, {x: 430, y: 194, arr:[]},
        {x: 430, y: 215, arr:[]}, {x: 498, y: 215, arr:[]}, {x: 498, y: 462, arr:[]}, {x: 153, y: 462, arr:[]}];

    /* [{x: 152, y: 56, arr:[1,8]}, {x: 228, y: 56, arr:[0,2]}, {x: 233, y: 19, arr:[1,3]}, {x: 272, y: 19, arr:[2,4]},
    {x: 276, y: 56, arr:[3,5]}, {x: 499, y: 56, arr:[4,6]}, {x: 499, y: 157, arr:[5,7]}, {x: 234, y: 159, arr:[6,8]},
    {x: 153, y: 161, arr:[7,0]},

    {x: 558, y: 56, arr:[10,19]}, {x: 752, y: 56, arr:[9,11]}, {x: 757, y: 19, arr:[10,12]}, {x: 795, y: 19, arr:[11,13]},
    {x: 804, y: 56, arr:[12,14]}, {x: 804, y: 129, arr:[13,15]}, {x: 779, y: 129, arr:[14,16]},
    {x: 779, y: 160, arr:[15,17]}, {x: 586, y: 160, arr:[16,18]}, {x: 586, y: 129, arr:[17,19]}, {x: 558, y: 129, arr:[18,9]},

    {x: 153, y: 215, arr:[21,31]}, {x: 220, y: 215, arr:[20,22]}, {x: 220, y: 194, arr:[21,23]}, {x: 292, y: 194, arr:[22,24]},
    {x: 292, y: 215, arr:[23,25]}, {x: 358, y: 215, arr:[24,26]}, {x: 358, y: 194, arr:[25,27]}, {x: 430, y: 194, arr:[26,28]},
    {x: 430, y: 215, arr:[27,29]}, {x: 498, y: 215, arr:[28,30]}, {x: 498, y: 462, arr:[29,31]}, {x: 153, y: 462, arr:[30,20]}] */

    for (let i=0;i<c.length;i++)
    {
        let aaa={x: m*c[i].x+delta, y: m*c[i].y+delta, arr: c[i].arr};
        areas1.push(aaa);
    }

}

function createrazmer()
{
    let delta = 0;
    let m = 1;
    let c = [{x: 156, y: 54, arr:[1]}, {x: 156, y: 161, arr:[0]},
        {x: 156, y: 460, arr:[3]}, {x: 498, y: 460, arr:[2]},
        {x: 558, y: 129, arr:[5]}, {x: 804, y: 129, arr:[4]}];

    let razm = [{x: 132, y: 54, rotation: "up"}, {x: 132, y: 161, rotation: "down"},
        {x: 156, y: 488, rotation: "left"}, {x: 498, y: 488, rotation: "right"}, {x: 558, y: 184, rotation: "left"}, {x: 804, y: 184, rotation: "right"}
    ];

    for (let i=0;i<c.length;i++)
    {
        let aaa={x: m*c[i].x+delta, y: m*c[i].y+delta, arr: c[i].arr};
        areas2.push(aaa);
    }

    for (let i=0;i<razm.length;i++)
    {
        let aaa={x: m*razm[i].x+delta, y: m*razm[i].y+delta, rotation: razm[i].rotation};
        areas3.push(aaa);
    }

}

/* let sinterval = setInterval(function()
{
	getDrawingStatus();
	let inter = setInterval(function()
	{
	if (window.echo != undefined)
	{
		let inter1 = setInterval(function()
		{
			if (window.namerole != undefined)
			{
				clearInterval(inter1);
			}
		}, 100) ;
		//window.namerole = "kek";
		if (echo.is_drawing_finished == false && window.namerole != "конструктор")
		{
			$('#drawcanv').css({'display': 'none'});
			$('#topcanv').css({'display': 'none'});
		}
		else
		{
			$('#drawcanv').css({'display': 'block'});
			$('#topcanv').css({'display': 'block'});
		}
		clearInterval(inter);
	}
	}, 100);
}, 5000); */

function getDrawingStatus()
{
    $.ajax({
        type: "GET",
        url: "drawing_main_text_ajax/is_drawing_finished",
        dataType: "json",
        data: "type=get",
        success: function (answer) {
            // console.log(answer);
            window.echo = answer;
        }
    });
}

function setDrawingStatus()
{
    $.ajax({
        type: "GET",
        url: "drawing_main_text_ajax/is_drawing_finished",
        dataType: "json",
        data: "type=set",
        success: function (answer) {

        }
    });

    /*$.ajax({
        type: "POST",
        url: "/start_ajax/db_change_time",
        data: {
            login: login
        },
        success: function (answer) {
            console.log(answer);
        }
    })*/
}

function setRazmer(razm)
{
    $.ajax({
        type: "POST",
        url: "drawing_main_text_ajax/save_size",
        dataType: "json",
        data:
            {
                "scheme":"scheme",
                "razm1":1,
                "razm2":2,
                "razm3":3
            },
        success: function (answer) {
            console.log(answer);
        }
    });
}

function createKontur() {
    let areasCircles1 = [];
    let areasCircles2 = [];
    let areasCircles3 = [];

    for (let i = 0; i < areas1.length; i++) {
        if (i < 9) {
            areasCircles1.push(areas1[i]);
        }

        if (i > 8 && i < 20) {
            areasCircles2.push(areas1[i]);
        }

        if (i > 19) {
            areasCircles3.push(areas1[i]);
        }
    }

    let w = $("#drawcanv").width();
    let h = $("#drawcanv").height();
    $("#hidedraw").after('<canvas width=' + w + ' height=' + h + ' id=Kontur1>');

    let CX = $("#Kontur1")[0].getContext("2d");
    CX.strokeStyle = "#9aa197";
    for (let i = 0; i < areasCircles1.length - 1; i++) {
        CX.beginPath();
        CX.moveTo(areasCircles1[i].x, areasCircles1[i].y);
        CX.lineTo(areasCircles1[i + 1].x, areasCircles1[i + 1].y);
        CX.stroke();

        if (i == areasCircles1.length - 2) {
            CX.beginPath();
            CX.moveTo(areasCircles1[i + 1].x, areasCircles1[i + 1].y);
            CX.lineTo(areasCircles1[0].x, areasCircles1[0].y);
            CX.stroke();
        }
    }

    for (let i = 0; i < areasCircles2.length - 1; i++) {
        CX.beginPath();
        CX.moveTo(areasCircles2[i].x, areasCircles2[i].y);
        CX.lineTo(areasCircles2[i + 1].x, areasCircles2[i + 1].y);
        CX.stroke();

        if (i == areasCircles2.length - 2) {
            CX.beginPath();
            CX.moveTo(areasCircles2[i + 1].x, areasCircles2[i + 1].y);
            CX.lineTo(areasCircles2[0].x, areasCircles2[0].y);
            CX.stroke();
        }
    }

    for (let i = 0; i < areasCircles3.length - 1; i++) {
        CX.beginPath();
        CX.moveTo(areasCircles3[i].x, areasCircles3[i].y);
        CX.lineTo(areasCircles3[i + 1].x, areasCircles3[i + 1].y);
        CX.stroke();

        if (i == areasCircles3.length - 2) {
            CX.beginPath();
            CX.moveTo(areasCircles3[i + 1].x, areasCircles3[i + 1].y);
            CX.lineTo(areasCircles3[0].x, areasCircles3[0].y);
            CX.stroke();
        }
    }
}

/*
CX = $("#drawcanv")[0].getContext("2d");
for (let i=0;i<areas1.length;i++)
{
    CX.beginPath();
    CX.moveTo(gx, gy);
    CX.lineTo(x, y);
    CX.stroke();
}

w=$("#drawcanv").width();
h=$("#drawcanv").height();
$( "#hidedraw" ).after( '<canvas width='+w+' height='+h+' id=Kontur1>' );

areasCircles1 = [];
areasCircles2 = [];
areasCircles3 = [];
for (let i=0;i<areas1.length-1;i++)
{
    if (i<9)
    {
        areasCircles1.push(areas1[i]);
    }

    if (i>8 && i<20)
    {
        areasCircles2.push(areas1[i]);
    }

    if (i>19)
    {
        areasCircles3.push(areas1[i]);
    }
}


areasCircles1 = [];
areasCircles2 = [];
areasCircles3 = [];
for (let i=0;i<areas1.length;i++)
{
    if (i<9)
    {
        areasCircles1.push(areas1[i]);
    }

    if (i>8 && i<20)
    {
        areasCircles2.push(areas1[i]);
    }

    if (i>19)
    {
        areasCircles3.push(areas1[i]);
    }
}

w=$("#drawcanv").width();
h=$("#drawcanv").height();
$( "#hidedraw" ).after( '<canvas width='+w+' height='+h+' id=Kontur1>' );

CX = $("#Kontur1")[0].getContext("2d");
CX.strokeStyle = "#9aa197";
for (let i=0;i<areasCircles1.length-1;i++)
{
    CX.beginPath();
    CX.moveTo(areasCircles1[i].x, areasCircles1[i].y);
    CX.lineTo(areasCircles1[i+1].x, areasCircles1[i+1].y);
    CX.stroke();

    if (i==areasCircles1.length-2)
    {
        CX.beginPath();
        CX.moveTo(areasCircles1[i].x, areasCircles1[i].y);
        CX.lineTo(areasCircles1[0].x, areasCircles1[0].y);
        CX.stroke();
    }
}

for (let i=0;i<areasCircles2.length-1;i++)
{
    CX.beginPath();
    CX.moveTo(areasCircles2[i].x, areasCircles2[i].y);
    CX.lineTo(areasCircles2[i+1].x, areasCircles2[i+1].y);
    CX.stroke();

    if (i==areasCircles2.length-2)
    {
        CX.beginPath();
        CX.moveTo(areasCircles2[i].x, areasCircles2[i].y);
        CX.lineTo(areasCircles2[0].x, areasCircles2[0].y);
        CX.stroke();
    }
}

for (let i=0;i<areasCircles3.length-1;i++)
{
    CX.beginPath();
    CX.moveTo(areasCircles3[i].x, areasCircles3[i].y);
    CX.lineTo(areasCircles3[i+1].x, areasCircles3[i+1].y);
    CX.stroke();

    if (i==areasCircles3.length-2)
    {
        CX.beginPath();
        CX.moveTo(areasCircles3[i].x, areasCircles3[i].y);
        CX.lineTo(areasCircles3[0].x, areasCircles3[0].y);
        CX.stroke();
    }
}



*/


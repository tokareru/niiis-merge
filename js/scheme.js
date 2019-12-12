import * as THREE from './3D/stl/three.module.js';
import {STLLoader} from './3D/stl/STLLoader.js';

export function initScheme() {
    initTitleBlock();
    window.lines1 = []; // массив координат всех нарисованных линий (x0, y0, xn, yn)
    window.lines2 = [];
    window.lines3 = [];
    window.crivie = [];
    window.arrcoor = [];
    window.showlines = [0,1];

    window.areas1 = []; // массив круглых областей в которых происходит клик
    window.areas2 = [];
    window.areas3 = [];
    window.r = 6;
    window.inCircle;
    window.clickedCircles;
    window.ctxs = [];
    //window.imageid = {"std_component_1": "bolthideimg1", "std_component_2": "bolthideimg2", "std_component_3": "bolthideimg3"};

    window.isEnded = false;

    createCoor();

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
            //firstFieldInit()
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
        //scheme1.children[0].children[0].style = "width: 100%; height: 100%";
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
            $("#field3D div div canvas")[i].width = $("#field3D")[0].clientWidth-14;
            $("#field3D div div canvas")[i].height = $("#field3D")[0].clientHeight;

            $("#drawcanv")[i].width = $("#field3D")[0].clientWidth-7;
            $("#drawcanv")[i].height = $("#field3D")[0].clientHeight;
            $("#field3D div div canvas")[i].style = "";
            renderersc.setSize($("#field3D")[0].clientWidth-7, $("#field3D")[0].clientHeight);
            //$("#drawcanv")[i].style.cssText = $("#field3D div div canvas")[i].style.cssText;
            window.ctxs[i].lineWidth = 2;
            if (window.isEnded) {$("#scheme1 div canvas")[0].style.cssText += " display:block;";}
        }
        ctxs[0].beginPath();
        for (let k=0; k<lines1.length; k++)
        {
            ctxs[0].moveTo(lines1[k][0], lines1[k][1]);
            ctxs[0].lineTo(lines1[k][2], lines1[k][3]);
            ctxs[0].stroke();
        }
    }

    $(window).resize(function() {
        resizecanv();
    });

    for (let i = 0; i < $("#drawcanv").length; i++) {
        window.ctxs[i] = $("#drawcanv")[i].getContext("2d");
        $("#field3D div div canvas")[i].width = $("#field3D")[0].clientWidth-14;
        $("#field3D div div canvas")[i].height = $("#field3D")[0].clientHeight;

        //$("#field3D div div canvas")[i].width *= 1.2;
        //$("#field3D div div canvas")[i].height *= 1.2;
        $("#drawcanv")[i].width = $("#field3D")[0].clientWidth-7;
        $("#drawcanv")[i].height = $("#field3D")[0].clientHeight;
        $("#field3D div div canvas")[i].style = "";
        renderersc.setSize($("#field3D")[0].clientWidth-7, $("#field3D")[0].clientHeight);
        //$("#drawcanv")[i].style.cssText = $("#field3D div div canvas")[i].style.cssText;
        window.ctxs[i].fillStyle = "black";
        window.ctxs[i].lineWidth = 2;
        //console.log($("#fcheme div div canvas")[i].width +';'+ $("#fcheme div div canvas")[i].height);
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
        if (isEnded == false) {
            window.down = true;
            let n = $(this)[0].id;
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left - 1;
            let y = e.clientY - rect.top - 1;

            for (let i = 0; i < 3; i++) {
                if (n == ctxs[i].canvas.id) {
                    window.gx = x;
                    window.gy = y;

                    circlesdraw();

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
                    break;
                }
            }
        }


    }).mouseup(function (e) {
        if (isEnded == false) {
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

                    circlesdraw();

                    for (let k=0; k<lines1.length; k++)
                    {
                        ctxs[i].moveTo(lines1[k][0], lines1[k][1]);
                        ctxs[i].lineTo(lines1[k][2], lines1[k][3]);
                        ctxs[i].stroke();
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

                                for (let k=0; k<lines1.length; k++)
                                {
                                    ctxs[i].moveTo(lines1[k][0], lines1[k][1]);
                                    ctxs[i].lineTo(lines1[k][2], lines1[k][3]);
                                    ctxs[i].stroke();
                                }

                                if (showlines.indexOf(lines1.length+1) == -1)
                                {
                                    if (lines1.length == 9 || lines1.length == 20)
                                    {
                                        showlines.push(lines1.length);
                                        showlines.push(lines1.length+1);
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
                                }
                                else
                                {
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
                    break;
                }
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

    circlesdraw();

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
    let c = [{x: 152, y: 56, arr:[1,8]}, {x: 228, y: 56, arr:[0,2]}, {x: 233, y: 19, arr:[1,3]}, {x: 272, y: 19, arr:[2,4]},
        {x: 276, y: 56, arr:[3,5]}, {x: 499, y: 56, arr:[4,6]}, {x: 499, y: 157, arr:[5,7]}, {x: 234, y: 159, arr:[6,8]},
        {x: 153, y: 161, arr:[7,0]},

        {x: 558, y: 56, arr:[10,19]}, {x: 752, y: 56, arr:[9,11]}, {x: 757, y: 19, arr:[10,12]}, {x: 795, y: 19, arr:[11,13]},
        {x: 804, y: 56, arr:[12,14]}, {x: 804, y: 129, arr:[13,15]}, {x: 779, y: 129, arr:[14,16]},
        {x: 779, y: 160, arr:[15,17]}, {x: 586, y: 160, arr:[16,18]}, {x: 586, y: 129, arr:[17,19]}, {x: 558, y: 129, arr:[18,9]},
        //{x: 558, y: 81, arr:[21,23]}, {x: 538, y: 81, arr:[22,24]}, {x: 538, y: 75, arr:[23,25]}, {x: 558, y: 75, arr:[24,10]},

        {x: 153, y: 215, arr:[21,31]}, {x: 220, y: 215, arr:[20,22]}, {x: 220, y: 194, arr:[21,23]}, {x: 292, y: 194, arr:[22,24]},
        {x: 292, y: 215, arr:[23,25]}, {x: 358, y: 215, arr:[24,26]}, {x: 358, y: 194, arr:[25,27]}, {x: 430, y: 194, arr:[26,28]},
        {x: 430, y: 215, arr:[27,29]}, {x: 498, y: 215, arr:[28,30]}, {x: 498, y: 462, arr:[29,31]}, {x: 153, y: 462, arr:[30,20]}];
    //{x: 498, y: 215, arr:[66,68,26]}, {x: 498, y: 462, arr:[67,69]}, {x: 153, y: 462, arr:[68,26]}];


    /*{x: 220, y: 215, arr:[26,28]}, {x: 220, y: 194, arr:[27,29]}, {x: 224, y: 194, arr:[28,30]},
    {x: 224, y: 215, arr:[29,31]}, {x: 237, y: 215, arr:[30,32]}, {x: 237, y: 194, arr:[31,33]}, {x: 241, y: 194, arr:[32,34]},
    {x: 241, y: 215, arr:[33,35]}, {x: 254, y: 215, arr:[34,36]}, {x: 254, y: 194, arr:[35,37]}, {x: 258, y: 194, arr:[36,38]},
    {x: 258, y: 215, arr:[37,39]}, {x: 271, y: 215, arr:[38,40]}, {x: 271, y: 194, arr:[39,41]}, {x: 275, y: 194, arr:[40,42]},
    {x: 275, y: 215, arr:[41,43]}, {x: 288, y: 215, arr:[42,44]}, {x: 288, y: 194, arr:[43,45]}, {x: 292, y: 194, arr:[44,46]},

    {x: 292, y: 215, arr:[45,47]}, {x: 358, y: 215, arr:[46,48]}, {x: 358, y: 194, arr:[47,49]}, {x: 362, y: 194, arr:[48,50]},
    {x: 362, y: 215, arr:[49,51]}, {x: 375, y: 215, arr:[50,52]}, {x: 375, y: 194, arr:[51,53]}, {x: 379, y: 194, arr:[52,54]},
    {x: 379, y: 215, arr:[53,55]}, {x: 392, y: 215, arr:[54,56]}, {x: 392, y: 194, arr:[55,57]}, {x: 396, y: 194, arr:[56,58]},
    {x: 396, y: 215, arr:[57,59]}, {x: 409, y: 215, arr:[58,60]}, {x: 409, y: 194, arr:[59,61]}, {x: 413, y: 194, arr:[60,62]},
    {x: 413, y: 215, arr:[61,63]}, {x: 426, y: 215, arr:[62,64]}, {x: 426, y: 194, arr:[63,65]}, {x: 430, y: 194, arr:[64,66]},
    {x: 430, y: 215, arr:[65,67]},*/

    for (let i=0;i<c.length;i++)
    {
        let aaa={x: m*c[i].x+delta, y: m*c[i].y+delta, arr: c[i].arr};
        areas1.push(aaa);
    }

}



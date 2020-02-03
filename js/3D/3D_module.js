//тащерский топкек код // примечание: нет

import * as THREE from './stl/three.module.js';
/*import Stats from './stl/stats.module.js';*/
import {STLLoader} from './stl/STLLoader.js';
import { OrbitControls } from './OrbitControls.js';

export function init3dField() {
    var container, stats;

    var cameraTarget;

    var check = {
        checkbox: true,
    };

    var inc = 0;

    window.meshs = {};

    window.renderer;
    window.camera;
    window.scene;

    window.stldata =
        [
            ["./3dstl/pdm/11.stl", 0x808080, "vis1"],
            ["./3dstl/pdm/22.stl", 0x808080, "vis2"],
            ["./3dstl/pdm/33.stl", 0x808080, "vis3"],
            ["./3dstl/pdm/44.stl", 0x808080, "vis4"],
            ["./3dstl/standart/11.stl", 0x808080, "vis5"],
            ["./3dstl/standart/22.stl", 0x808080, "vis6"],
            ["./3dstl/standart/33.stl", 0x808080, "vis7"]
        ];

    init();
    animate();

    /* var gui = new dat.GUI({autoPlace: false, width: 100 + '%'});
    document.getElementById("canvas3D").appendChild(gui.domElement);
    gui.domElement.id = 'gui';

    gui.add(check, 'checkbox').name('Вращение').onChange(function (value) {
        animate();
    }); */

    function init() {

        container = document.createElement('div');
        document.getElementById("canvas3D").appendChild(container);

        window.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        camera.position.set(3, 0.15, 3);

        cameraTarget = new THREE.Vector3(0, -0.25, 0);

        window.scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff/*0x72645b*/);
        scene.fog = new THREE.Fog(/*0x72645b*/0xAAAAAA, 2, 15);


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

        scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

        addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        //addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
        addShadowedLight(-1, -1, -1, 0xffffff, 1);
        // renderer

        window.renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize($('#canvas3D').width(), ($('#canvas3D').width()) * 9 / 16);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.shadowMap.enabled = true;

        container.appendChild(renderer.domElement);

        window.controls = new OrbitControls( window.camera, window.renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.minDistance = 2;
        controls.maxDistance = 5;

        //controls.maxPolarAngle = Math.PI / 2;

        // stats

        //stats = new Stats();
        //container.appendChild( stats.dom ); //счетчик фпс

        //

        $("#fieldBlock").on('resize', onWindowResize);
        $("#tabs li[aria-controls=\"fieldBlock\"]").click(function () {
            onWindowResize();
        })
    }

    function loadSTL(src, color = 0x808080, arrmesh, pos = {x: 0, y: -0.315, z: 0}, rot = {
        x: -Math.PI / 2,
        y: 0,
        z: 0
    }, scale = {x: 0.5, y: 0.5, z: 0.5}, angle = 20) {

        loader.load(src, function (geometry) {

            var material = new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 200});

            var mesh = new THREE.Mesh(geometry, material);

            //добавляем грани на модель
            var geometry = new THREE.EdgesGeometry(mesh.geometry, angle);

            var material = new THREE.LineBasicMaterial({color: 0x000000});

            var wireframe = new THREE.LineSegments(geometry, material);
            wireframe.rotation.set(rot.x, rot.y, rot.z);
            wireframe.scale.set(scale.x, scale.y, scale.z);
            wireframe.position.set(pos.x, pos.y, pos.z);

            mesh.visible = false;
            mesh.position.set(pos.x, pos.y, pos.z);//-0.6
            mesh.rotation.set(rot.x, rot.y, rot.z);
            mesh.scale.set(scale.x, scale.y, scale.z);

            mesh.castShadow = true;
            mesh.receiveShadow = false;

            //window.meshs[arrmesh] = mesh;
            window.MeshsLinesScheme[arrmesh].push(mesh);
            scene.add(mesh);
            //scene.add( wireframe );

            //добавляем весь чертеж
            if (Round === 3 && $("#pdm_field").length){
                firstFieldInit(collectDataLabels(".left-side"));
            }else if(Round === 3 && !$("#pdm_field").length){
                let array;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: "spec_autoentered_table_ajax/load_product_checked",
                    success: function (data) {
                        array = data.checked;
                    }
                })
                //console.log(array)
                firstFieldInit(array);
            }else{
                firstFieldInit(["component_1", "component_2", "component_3",
                    "component_4", "std_component_1", "std_component_2", "std_component_3"])
            }
        });
    }

    function firstFieldInit(array) {
        let prev = window.isEnded;
        window.isEnded = true;
        //console.log(array)
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
        window.isEnded = prev;
    }

    function addShadowedLight(x, y, z, color, intensity) {

        var directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        scene.add(directionalLight);

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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        //renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );
        renderer.setSize($('#canvas3D').width(), ($('#canvas3D').width()) * 9 / 16);
        $("#canvas3D").find("canvas").css({
            "width": "100%",
            "height": "100%"
        });
    }

    function animate() {
        if (check.checkbox) {
            requestAnimationFrame(animate);
            controls.update();
            render();
        }
        //stats.update();
    }

    function render() {
        //inc += 0.008;
        //var timer = Date.now() * 0.0005;
        //camera.position.x = Math.cos(inc) * 3;
        //camera.position.z = Math.sin(inc) * 3;
        camera.lookAt(cameraTarget);

        renderer.render(scene, camera);
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

    /* $("#canvas3D").click(function()
    {
        animate()
    }) */


    $('#canvas3D').droppable(
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
    );
}


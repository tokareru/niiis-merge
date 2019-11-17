//тащерский топкек код

import * as THREE from './stl/three.module.js';
/*import Stats from './stl/stats.module.js';*/
import {STLLoader} from './stl/STLLoader.js';

export function init3dField() {
    var container, stats;

    var camera, cameraTarget, scene, renderer;

    var check = {
        checkbox: true,
        vis1: true,
        vis2: true,
        vis3: true,
        vis4: true,
        vis5: true,
    };

    var inc = 0;

    window.arr = {};
	
	window.stldata = 
	[
	["./3dstl/IronMan/Colour1.stl", 0xff5533, "vis1"], 
	["./3dstl/IronMan/Colour2.stl", 0xAAAAAA, "vis2"], 
	["./3dstl/IronMan/Colour5.stl", 0xFFE500, "vis3"], 
	["./3dstl/IronMan/Colour3.stl", 0x0000ff, "vis4"], 
	["./3dstl/IronMan/Colour4.stl", 0x800080, "vis5"]
	];

    init();
    animate();

    var gui = new dat.GUI({autoPlace: false, width: 100+'vw'});
    document.getElementById("canvas3D").appendChild(gui.domElement);
    gui.domElement.id = 'gui';

    gui.add(check, 'checkbox').name('Spin').onChange(function (value) {
        animate();
    });

    for (var i = 1; i < 6; i++) {
        var text = 'vis' + i;
        gui.add(check, text).name('VO' + i).onChange(function () {
            hide(this);
        });
    }

    function init() {

        container = document.createElement('div');
        document.getElementById("canvas3D").appendChild(container);

        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        camera.position.set(3, 0.15, 3);

        cameraTarget = new THREE.Vector3(0, -0.25, 0);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x72645b);
        scene.fog = new THREE.Fog(0x72645b, 2, 15);


        // Ground

        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(40, 40),
            new THREE.MeshPhongMaterial({color: 0x999999, specular: 0x101010})
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.5;
        scene.add(plane);

        plane.receiveShadow = true;


        // ASCII file
		window.loader = new STLLoader();
		
		for (i=0;i<5;i++)
		{
			loadSTL(stldata[i][0], stldata[i][1], stldata[i][2]);
		}
		
		

        // Colored binary STL

        // Lights

        scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

        addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
        // renderer

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize($('#canvas3D').width(), $('#canvas3D').height());

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.shadowMap.enabled = true;

        container.appendChild(renderer.domElement);

        // stats

        //stats = new Stats();
        //container.appendChild( stats.dom ); //счетчик фпс

        //

        window.addEventListener('resize', onWindowResize, false);

    }
	
	function loadSTL (src, color, arrmesh, pos = { x:0, y:0.07, z:0 }, rot = { x:-Math.PI / 2, y:0, z:-Math.PI / 2 }, scale = { x:0.015, y:0.015, z:0.015 })
	{
		
		loader.load(src, function (geometry) {

            var material = new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 200});

            var mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(pos.x, pos.y, pos.z);//-0.6
            mesh.rotation.set(rot.x, rot.y, rot.z);
            mesh.scale.set(scale.x, scale.y, scale.z);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            window.arr[arrmesh] = mesh;
            scene.add(mesh);

        });
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
		renderer.setSize( $('#canvas3D').width(), $('#canvas3D').height() );
		canvas3D.children[0].children[0].style="width: 100%; height: 100%";

    }

    function animate() {
        if (check.checkbox) {
            requestAnimationFrame(animate);
            render();
        }
        //stats.update();
    }

    function render() {
        inc += 0.008;
        //var timer = Date.now() * 0.0005;
        camera.position.x = Math.cos(inc) * 3;
        camera.position.z = Math.sin(inc) * 3;
        camera.lookAt(cameraTarget);

        renderer.render(scene, camera);
    }

    function hide(ob) {
        if (ob["domElement"].children[0].checked == false) {
            arr[ob.property].visible = false;
            renderer.render(scene, camera);
        } else {
            arr[ob.property].visible = true;
            renderer.render(scene, camera);
        }
    }
}

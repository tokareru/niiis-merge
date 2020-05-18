function trigger3dInit() {
    let field3D = import('./3D_module.js').then(function (module) {
        module.init3dField();
    });
}

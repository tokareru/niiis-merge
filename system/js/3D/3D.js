async function trigger3dInit() {
    let field3D = await import('./3D_module.js');
    field3D.init3dField();
}

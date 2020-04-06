async function trigger3dInit() {
    let field3D = await import('./3D_module.js');
    await field3D.init3dField();
}

async function _3dGovno() {
    let field3D = await import('./3D_module.js');
    return field3D;
}
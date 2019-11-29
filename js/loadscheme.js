async function triggerschemeInit() {
    let fieldscheme = await import('./scheme.js');
    fieldscheme.initScheme();
}

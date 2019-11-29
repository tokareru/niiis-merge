async function triggerschemeInit() {
    let fieldscheme = await import('./scheme.js');
    await fieldscheme.initScheme();
}

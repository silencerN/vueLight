const modulesFiles = import.meta.glob('./*/*.vue', { eager: true });

const modules = {};
for (const key in modulesFiles) {
    const moduleName = key.replace(/(.*\/)*([^.]+).*/gi, '$2');
    const value = modulesFiles[key];
    modules[moduleName] = value.default;
}

export default modules;

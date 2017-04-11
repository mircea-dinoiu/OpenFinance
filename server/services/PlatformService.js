const UAParser = require('ua-parser-js');

module.exports = {
    _detector: null,

    get detector() {
        return this._detector;
    },

    set detector(agent) {
        this._detector = new UAParser(agent);
    },

    isMobile() {
        const {name, version} = this.detector.getOS();

        return (name === 'iOS' && Number(version) >= 7) || name === 'Android';
    },

    isDesktop() {
        const {type} = this.detector.getDevice();

        return !(type === 'tablet' || type === 'mobile');
    },

    isSupported() {
        return this.isMobile() || this.isDesktop();
    },
};
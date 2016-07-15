export default class UserAgent {
    constructor() {
        this._os = null;
        this._browser = null;
        this._platform = null;
    }

    /**
     *
     * @returns {null|string}
     */
    get browser() {
        return this._browser;
    }

    /**
     *
     * @param browser
     */
    set browser(browser) {
        this._browser = browser;
    }

    get os() {
        return this._os;
    }

    /**
     *
     * @param os
     */
    set os(os) {
        this._os = os;
    }

    /**
     *
     * @returns {null|string}
     */
    get platform() {
        return this._platform;
    }

    /**
     *
     * @param platform
     */
    set platform(platform) {
        this._platform = platform;
    }
}
export default class Tweet {

    /**
     *
     * @param id
     * @param link
     * @param name
     * @param text
     * @param date
     * @param reTweets
     * @param favorites
     * @param geoLabel
     */
    constructor(id, link, name, text, date, reTweets, favorites, geoLabel) {
        this._id = id;
        this._link = link;
        this._name = name;
        this._text = text;
        this._date = date;
        this._retweets = reTweets;
        this._favorites = favorites;
        this._geolabel = geoLabel;
    }

    /**
     *
     * @param id
     */
    set id(id) {
        this._id = id;
    }

    /**
     *
     * @returns {*}
     */
    get id() {
        return this._id;
    }

    /**
     *
     * @param n
     */
    set link(n) {
        this._link = n;
    }

    /**
     *
     * @returns {*}
     */
    get link() {
        return this._link;
    }

    /**
     *
     * @param n
     */
    set name(n) {
        this._name = n;
    }

    /**
     *
     * @returns {*}
     */
    get name() {
        return this._name;
    }

    /**
     *
     * @param t
     */
    set text(t) {
        this._text = t;
    }

    /**
     *
     * @returns {*}
     */
    get text() {
        return this._text;
    }

    /**
     *
     * @param d
     */
    set date(d) {
        this._date = d;
    }

    /**
     *
     * @returns {*}
     */
    get date() {
        return this._date;
    }

    /**
     *
     * @param r
     */
    set reTweets(r) {
        this._retweets = r;
    }

    /**
     *
     * @returns {*}
     */
    get reTweets() {
        return this._retweets;
    }

    /**
     *
     * @param f
     */
    set favorites(f) {
        this._favorites = f;
    }

    /**
     *
     * @returns {*}
     */
    get favorites() {
        return this._favorites;
    }

    /**
     *
     * @param m
     */
    set geoLabel(m) {
        this._geolabel = m;
    }

    /**
     *
     * @returns {*}
     */
    get geoLabel() {
        return this._geolabel;
    }
};


module.exports = class User {
    
    /**
     *
     * @param name
     * @param since
     * @param query
     * @param until
     * @param count
     */
    constructor(name, since, query, until, count) {
        this._name = name;
        this._since = since;
        this._until = until;
        this._query = query;
        this._count = count;
    }

    countValidate(cnt) {

    }

    sinceValidate(since) {

    }

    untilValidate(until) {

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
     * @param s
     */
    set since(s) {
        this._since = s;
    }

    /**
     *
     * @returns {*}
     */
    get since() {
        return this._since;
    }

    /**
     *
     * @param u
     */
    set until(u) {
        this._until = u;
    }

    /**
     *
     * @returns {*}
     */
    get until() {
        return this._until;
    }

    /**
     *
     * @param q
     */
    set query(q) {
        this.query = q;
    }

    /**
     *
     * @returns {*}
     */
    get query() {
        return this._query;
    }

    /**
     *
     * @param c
     */
    set count(c) {
        this._count = c;
    }

    /**
     *
     * @returns {*}
     */
    get count() {
        return this._count;
    }
}


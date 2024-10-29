/**
 * @typedef ExtraRequestFeilds
 * @property {Boolean} json_resp If the request respond in json
 */

const DEFAULT_FETCH_INIT = {
    'Content-Type': "application/json"
}

const DEFAULT_EXTRA_SETTINGS = {
    json_resp: true
}

/**
 * A wrapper for JS native `fetch` API, default returns the response json or null if there's any error
 * @param {string | URL | globalThis.Request} input The request URL
 * @param {RequestInit} init The request init same to the native `fetch` API
 * @param {ExtraRequestFeilds} extra Extra settings
 * @returns {Promise<any?>} 
 */
export async function request(input, init = {}, extra = {}) {
    init = {
        ...DEFAULT_FETCH_INIT,
        ...init
    }
    const { json_resp } = {
        ...DEFAULT_EXTRA_SETTINGS,
        ...extra
    }
    try {
        const req = await fetch(input, init);
        if(req.ok) {
            if(json_resp) {
                const resp = await req.json();
                return resp;
            } else {
                return req;
            }
        } else {
            console.error(req.statusText);
            return null;
        }
    } catch(error) {
        console.error(error)
        return null;
    }
}

/**
 * @typedef Participant
 * @property {String} name
 * @property {Number} score
 * @property {String} group
 */

/**
 * Retrieves the leading top n participants
 * @param {Number} n The top n participants, default `10`
 * @returns {Promise<Participant[]>} 
 */
export async function getLeaders(n = 10) {
    const leaders = await request(`${import.meta.env.DEV ? 'http://localhost:3000':""}/api/scores/top/${Math.max(Math.floor(n), 1)}`);
    return leaders || [];
}
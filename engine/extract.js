const cheerio = require('cheerio');
const getFormItems = (html) => {
    const content = cheerio.load(html)
    const formItems = content('form').serializeArray();
    return formItems.reduce((p, c) => ({
        ...p,
        [c.name]: c.value
    }), {});
}
module.exports = { getFormItems }
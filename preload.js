const {contextBridge} = require('electron');
const axios = require('axios');

contextBridge.exposeInMainWorld('getCategories', async function () {
    return await axios.get('https://qr-api.terminalads.com/api/admin/category')
        .then(({data}) => data.data);
});

contextBridge.exposeInMainWorld('getDigikalaProduct', async function (productId) {
    return await axios.get(`https://api.digikala.com/v2/product/${productId}/`)
        .then(({data}) => data.data.product)
        .catch(console.log);
});

contextBridge.exposeInMainWorld('storeProduct', async function (request) {
    return await axios.post('https://qr-api.terminalads.com/api/template', request)
        .then(({data}) => data.data)
        .catch(console.log);
});

contextBridge.exposeInMainWorld('uploadFile', async function (request) {
    return await axios.post('https://robot-api.terminalads.com/api/files/upload/url', request)
        .then(({data}) => data)
        .catch(console.log);
})

contextBridge.exposeInMainWorld('getDigikalaProducts', async function (request) {
    return await axios.get(request.url, {
        params: {
            page: request.page
        }
    }).then(({data}) => data.data.products)
        .catch(console.log);
})
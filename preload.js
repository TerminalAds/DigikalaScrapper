const {contextBridge} = require('electron');
const axios = require('axios');
const jalaali = require('jalaali-js');

contextBridge.exposeInMainWorld('miladiToShamsi', function (year, month, day) {
	const {jy, jm, jd} = jalaali.toJalaali(year, month, day);
	return `${jy}/${jm}/${jd}`;
});

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

contextBridge.exposeInMainWorld('evanoRequestOtp', async function (phone) {
	return await axios.post('https://ebcom.mci.ir/services/auth/v1.0/otp', {
			msisdn: phone
		},
		{
			headers: {
				clientid: '75ce206c-e9af-4216-a527-49250dd4ceb5'
			}
		}
	);
});

contextBridge.exposeInMainWorld('evanoLogin', async function (phone, code) {
	return await axios.get(`https://ebcom.mci.ir/services/auth/v1.0/user/login/otp/${code}?mciquery=true`, {
		headers: {
			clientid: '75ce206c-e9af-4216-a527-49250dd4ceb5',
			scope: 'ewanoGroup',
			username: phone
		}
	});
});

contextBridge.exposeInMainWorld('evanoProfile', async function (token) {
	return await axios.get('https://ebcom.mci.ir/services/user/v1.0/profile', {
		headers: {
			clientid: '75ce206c-e9af-4216-a527-49250dd4ceb5',
			Authorization: 'Bearer ' + token
		}
	});
})
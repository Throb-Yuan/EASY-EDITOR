module.exports = {
	port: 4000,
	mongodb: {
		url: 'mongodb://192.168.101.250:18181/quark',
		options: {}
	},
	middleware:['handlerError'],
	jwt: {secret: 'huangwei9527'},
	crypto: {secret: '#*#*huangwei9527*#*#'},
	baseUrl: ''
}

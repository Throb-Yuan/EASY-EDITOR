(function () {
    var serverAddress = window.terminal.getServerAddress()
    var domain = serverAddress.split('')
    window.ipConfig = {
        baseUrl:serverAddress,//接口地址
        preViewUrl:domain+':8887',//预览地址
        transCoding: domain+':9205/live/',//流媒体转码地址
        clientId:'0FDB7E184501AC3FD5D0A4594A3B1550',//客户端id
        clientSecret:'19246F054CDBFDA9A8A88B1C90B094BD'//客户端密钥
    }
})()
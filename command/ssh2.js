



const Client = require('ssh2-sftp-client');
const sftp = new Client();      // 实例化



// 先配置一下,个人习惯
const config = {
    path: {
        localPath: 'E:/backup',
        remotePath: '/D:/phpstudy_pro/WWW/www.new_erp.com',
    },
    option: {
        host: '192.168.0.200',
        // port: '80',
        username: 'Administrator',
        password: '1'
    }
}

// const config = {
//     path: {
//         localPath: 'E:/backup',
//         remotePath: '/www/wwwroot/test.goyojo.com',
//     },
//     option: {
//         host: '120.76.100.97',
//         // port: '80',
//         username: 'root',
//         password: 'GYJ18@2022'
//     }
// }


/* 主方法
 * @method main
 * @param{String} localPath 本地路径,不用path模块,直接字符串就好了,这个包自己有格式化的
 * @param{String} remotePath 远程路径
 * @return{undefined} 返回个*
*/

function main(localPath, remotePath) {

    // 连接上远程服务器后返回一个 Promise
    sftp.connect(config.option)
        .then(() => {

            // return sftp.cwd();  // 当前工作目录

            // 连接成功后操作
            return sftp.list(remotePath);

            // 单文件上传
            // return sftp.put(localPath, remotePath)
            // 单文件下载
            // return sftp.downloadDir(remotePath, localPath)
        })
        .then(data => {
            console.log('data :>> ', data);
            console.log('完成')
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            // 断开连接
            sftp.end()
        })

    sftp.on('download', info => {
        console.log(`Listener: Download ${info.source}`);
    });
}

main(
    config.path.localPath,
    config.path.remotePath
)






// sftp.connect({
//     host: '192.168.0.200',
//     // port: '80',
//     username: 'Administrator',
//     password: '1'
// }).then((res) => {
//     // console.log('res :>> ', res);
//     // console.log('cwd（） :>> ', );
//     // return sftp.cwd();  // 当前工作目录
//     return sftp.list('/D:/phpstudy_pro/WWW');
//     // return sftp.list('/pathname');
// }).then(data => {
//     console.log(data, 'the data info');
// }).catch(err => {
//     console.log(err, 'catch error');
// });
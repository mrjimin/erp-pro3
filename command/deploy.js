const ftp = require('ftp');
const fs = require('fs');


// 默认开发模式
let deployConfig = {
    user: "root", //ftp账号
    password: "GYJ18@2022",  // 密码
    host: "120.76.100.97",       //ftp服务器ip
    port: 22, // ftp端口号，默认21
    localRoot: "./dist",    // 本地文件的路径
    remoteRoot: "/www/wwwroot/dev.goyojo.com",  //服务器web目录
}

const env = process.argv[2] ? process.argv[2].replace('--', "").toLowerCase() : null;  //抓取命令行的环境变量

if (env == 'test') {
    deployConfig = {
        user: "root", //ftp账号
        password: "GYJ18@2022",  // 密码
        host: "120.76.100.97",       //ftp服务器ip
        port: 22, // ftp端口号，默认21
        localRoot: "./test",    // 本地文件的路径
        remoteRoot: "/www/wwwroot/test.goyojo.com",  //服务器web目录
    }
} else if (env == 'net') {
    deployConfig = {
        user: "test_goyojo_com", //ftp账号
        password: "test_goyojo_com",  // 密码
        host: "120.76.100.97",       //ftp服务器ip
        port: 21, // ftp端口号，默认21
        localRoot: "./build",    // 本地文件的路径
        remoteRoot: "/dist",  //服务器web目录
    }
}


//本地文件夹路径；
const localPath = deployConfig.localRoot;
//远程地址，打开ftp以后的地址，不需要加入host；
const remotePath = deployConfig.remoteRoot;


const config = {
    host: deployConfig.host,                       //ftp地址；
    port: deployConfig.port,                       //端口；
    user: deployConfig.user,                       //用户名；
    password: deployConfig.password,                   //密码；
};
const client = new ftp();
// client.connect(config);


// // 连接服务器
// ftp.connect({
//     host: '192.168.10.107',
//     port: 21,
//     user: 'Administrator',
//     password: '1234',
//     connTimeout: 1000 * 10, // 连接超时时间
//     pasvTimeout: 1000 * 10, // PASV data 连接超时时间
//     keepalive: 1000 * 10, // 多久发送一次请求，以保持连接
// });



readingFile(localPath).then((fileArr) => {
    // console.log(fileArr.slice(0, 15));
    // return false;
    if (!fileArr.length) return console.log('本地文件为空，取消上传');
    console.log('config :>> ', client);
    // 上传文件 - 覆盖
    console.log(`连接${config.host}...`);

    client.connect(config);
    client.on('ready', async () => {
        console.log('object :>> ', 'success');
        return false;
        // 清理文件
        const clear = await removeFile()
        if (!clear) return;

        console.log('开始上传...');
        Promise.all(fileArr.map(async file => {
            try {
                return await uploadFiles(file.dir, file.filepath, file.fileData);
            } catch (err) {
                return reject(err);
            }
        })).then(() => {
            client.end();
            console.log(`上传完成～，已上传至${fileArr.length}个文件${config.host}服务器${deployConfig.remoteRoot}目录`);
        }).catch(err => {
            console.log(err);
        })

    });

}).catch(err => {
    console.log(err);
});


/**
 * 递归读取本地文件，转换成平级数组格式数据
 * @param {string} filePath 需要读取文件的文件路径
 * @returns 
 */
async function readingFile(filePath) {
    const res = []
    function forFn(filepath) {
        try {
            const data = fs.readdirSync(filepath, { withFileTypes: true })
            data.map(file => {
                const child_filepath = filepath + '/' + file.name;
                if (file.isFile()) { // 文件
                    try {
                        const readData = fs.readFileSync(child_filepath)
                        const dir = remotePath + filepath.replace(localPath, '').replace('\\', '/');
                        res.push({
                            dir,
                            filepath: dir + '/' + file.name,
                            fileData: readData
                        })
                    } catch (error) {
                        console.log('读取文件错误', error);
                    }
                } else { // 目录
                    forFn(child_filepath);
                }
            });
        } catch (error) {
            throw error(error)
        }
        // return res
    }
    forFn(filePath)

    return res
}


/**
 * 移除ftp服务器上原有的assets文件
 * @returns 
 */
function removeFile() {
    return new Promise((resolve, reject) => {
        const filePath = remotePath + '/assets'
        console.log(`连接成功，正在清理${filePath}文件夹...`);
        client.rmdir(filePath, true, err => {
            if (err) {
                console.log('目录不存在，无需清理');
                reject(err)
            }
            resolve(true);
        })
    })
}

/**
 * 覆盖上传文件，没有文件夹时，先创建文件夹，然后在上传文件
 * @param {string} dir 文件夹路径，没有文件夹时，先创建文件夹
 * @param {string} filepath 文件路径
 * @param {string|Buffer} fileData 文件数据内容
 * @returns 
 */
function uploadFiles(dir, filepath, fileData) {
    return new Promise((resolve, reject) => {
        client.mkdir(dir, true, err1 => {
            if (err1) reject(err1);
            client.put(fileData, filepath, err2 => {
                if (err2) reject(err2);
                console.log('put :>> ', filepath);
                resolve();
            });
        })
    })
}


// Administrator

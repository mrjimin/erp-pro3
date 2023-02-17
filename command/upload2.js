
const Client = require('ssh2-sftp-client');
const client = new Client();

const config = {
    "production": {
        "sftp": {
            "host": "192.168.1.8",
            // "port": 22,
            "username": "Administrator",
            "password": "1"
        },
        "pathConfig": {
            "localPath": "./dist",    // 本地文件的路径
            "remotePath": "/www/dist", //服务器web目录
            // "remoteBackupPath": "/www/backup/site/dev.goyojo.com", //服务器web备份目录
        }
    },
    "test": {
        "sftp": {
            "host": "192.168.0.200",
            // "port": 22,
            "username": "Administrator",
            "password": "1"
        },
        "pathConfig": {
            "localPath": "./dist-test",    // 本地文件的路径
            "remotePath": "/www/wwwroot/test.goyojo.com", //服务器web目录
            "remoteBackupPath": "/www/backup/site/test.goyojo.com", //服务器web备份目录
        }
    },
    "pro1": {
        "sftp": {
            "host": "192.168.0.200",
            // "port": 22,
            "username": "Administrator",
            "password": "1"
        },
        "pathConfig": {
            "localPath": "./dist-pro1",    // 本地文件的路径
            "remotePath": "/www/wwwroot/pro1.goyojo.com", //服务器web目录
            "remoteBackupPath": "/www/backup/site/pro1.goyojo.com", //服务器web备份目录
        }
    },
    "pro2": {
        "sftp": {
            "host": "192.168.0.200",
            // "port": 22,
            "username": "Administrator",
            "password": "1"
        },
        "pathConfig": {
            "localPath": "./dist-pro2",    // 本地文件的路径
            "remotePath": "/www/wwwroot/pro2.goyojo.com", //服务器web目录
            "remoteBackupPath": "/www/backup/site/pro2.goyojo.com", //服务器web备份目录
        }
    }
}
const env = process.argv[2] ? process.argv[2].replace('--', "").toLowerCase() : null;  //抓取命令行的环境变量
const { sftp, pathConfig } = config[env];

const main = async () => {
    try {
        console.log('sftp :>> ', sftp);
        console.log(pathConfig)
        await client.connect(sftp);
        client.on('upload', info => {
            console.log(`put :>>  ${info.destination}`);
        });
        //删除备份文件,如果有
        // if (await client.exists(pathConfig.remoteBackupPath)) {
        //     await client.rmdir(pathConfig.remoteBackupPath, true)
        //     console.log('删除备份文件成功')
        // }

        // // 重命名之前的文件作为备份文件
        // if (await client.exists(pathConfig.remotePath)) {
        //     await client.rename(pathConfig.remotePath, pathConfig.remoteBackupPath)
        //     console.log('新的备份文件重命名成功');
        // }
        // 上传本地文件
        await client.uploadDir(pathConfig.localPath, pathConfig.remotePath);
        console.log(`上传完成～，已上传至${sftp.host}服务器${pathConfig.remotePath}目录`);
    } catch (err) {
        console.log(err);
    } finally {
        client.end();
    }
}

main();
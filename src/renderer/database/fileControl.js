const fs = require('fs')

exports.loadFiles = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if(err){
                reject(err)
            }else{
                resolve(JSON.parse(data))
            }
        })
    })
}

exports.writeFiles = (filePath, fileData) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileData, (err) => {
            if(err){
                reject(err)
            }
        })
    })
}

/*!
 * Created by yinlu on 2018/4/25.
 * Author : YinLu <306677639@qq.com>
 */

class CleanEntryJsWebpackPlugin {

    constructor(paths=[]) {
        if (typeof paths == 'string' || paths instanceof String) {
            paths = [paths];
        }
        this.paths = paths;
    }

    apply(compiler) {

        if(this.paths.length<1) return;

        compiler.plugin('done', function () {
            console.log('Compiler 已完成，开始清除css.js,images.js。');

            const fs = require("fs");
            const outputPath = compiler.options.output.path;
            const mf = outputPath+'/manifest.json';
            const manifest = require(mf);

            this.paths.forEach(function (val) {
                for( let k in manifest ){
                    if( k == val ){
                        fs.unlink(outputPath+'/'+manifest[k],function (err) {
                            if(err) throw err;
                            console.log('删除'+outputPath+'/'+manifest[k]+'文件成功');
                        });
                    }
                }
            });

            /*fs.writeFile('./compiler.json',JSON.stringify(compiler.options),'utf-8',function(err){
                if(err)
                    console.log('写入失败')
            })*/
        });

    }

}


// function CleanEntryJsWebpackPlugin(){}
// CleanEntryJsWebpackPlugin.prototype.apply = function(compiler) {};


module.exports = CleanEntryJsWebpackPlugin;
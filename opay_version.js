let body = $request.body;
let url = $request.url;

const versionToReplace = "3.14.1.3149328"; // 原版本号
const newVersion = "7.13.0"; // 要替换的新版本号

// 替换版本号
body = body.replace(versionToReplace, newVersion);

$done({ body });

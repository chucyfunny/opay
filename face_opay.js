const fetchNewSelfie = () => {
    const url = "https://ninface.myngn.top.myngn.top/getChipperContent.php";

    const request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "request_chipper": true
        })
    };

    return $task.fetch(request).then(response => {
        if (response.statusCode === 200) {
            let response_data = JSON.parse(response.body);
            return response_data.file_content; // 返回新的 selfie 数据
        } else {
            console.log(`请求失败，HTTP 状态码：${response.statusCode}`);
            return null;
        }
    }, reason => {
        console.log("请求失败，错误信息如下：");
        console.log(reason.error);
        return null;
    });
};

// 第二步：拦截请求并替换 selfie 数据
const interceptRequest = (newSelfie) => {
    let body = $request.body;
    let bodyObj = JSON.parse(body);

    if (newSelfie) {
        // 替换 selfie 字段
        if (bodyObj.imageSecret) {
            bodyObj.imageSecret = newSelfie;
        }
    } else {
        console.log("No newselfie data found in storage.");
    }

    // 将修改后的 JSON 对象转回字符串
    body = JSON.stringify(bodyObj);

    // 返回修改后的请求体
    $done({ body });
};

// 执行流程
fetchNewSelfie().then(newSelfie => {
    // 拦截并修改 selfie 请求
    interceptRequest(newSelfie);
});

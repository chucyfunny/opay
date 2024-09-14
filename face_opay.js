// 第一步：获取新的 selfie 数据
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
            try {
                let responseData = JSON.parse(response.body);
                if (responseData && responseData.file_content) {
                    return responseData.file_content; // 返回新的 selfie 数据
                } else {
                    console.log("请求成功，但未找到 'file_content' 字段。");
                    return null;
                }
            } catch (error) {
                console.log("解析响应数据时出错：", error);
                return null;
            }
        } else {
            console.log(`请求失败，HTTP 状态码：${response.statusCode}`);
            return null;
        }
    }).catch(reason => {
        console.log("请求失败，错误信息如下：");
        console.log(reason);
        return null;
    });
};

// 第二步：拦截请求并替换 selfie 数据
const interceptRequest = (newSelfie) => {
    try {
        let body = $request.body;
        let bodyObj = JSON.parse(body);

        if (newSelfie) {
            // 替换 selfie 字段
            if (bodyObj.imageSecret) {
                bodyObj.imageSecret = newSelfie;
                console.log("成功替换 'imageSecret' 字段。");
            } else {
                console.log("'imageSecret' 字段未找到，无法替换。");
            }
        } else {
            console.log("未找到新的 selfie 数据，未进行替换。");
        }

        // 将修改后的 JSON 对象转回字符串
        body = JSON.stringify(bodyObj);

        // 返回修改后的请求体
        $done({ body });

    } catch (error) {
        console.log("拦截和修改请求时出错：", error);
        $done({});
    }
};

// 执行流程
fetchNewSelfie().then(newSelfie => {
    // 拦截并修改 selfie 请求
    interceptRequest(newSelfie);
});

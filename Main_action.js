/*
用户主界面所需的js函数
*/

// 下载文件
function Download(){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    params.append("func", "download");
    params.append("path", "/abc/");
    params.append("filename", "a.py");
    formData.append("auth", auth);
    formData.append("params", params);
    $.ajax({
        url: "/cgi-bin/serve.py", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var json = JSON.parse(response);
            window.open("/download.py?dl_token="+json.token);
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
}

function Display_the_files(files){
    var element = document.getElementById("file_list");
    element.remove()
    for (var i in files) {
        var filename = i[0].value;
        var is_dir = i[1].value;
        // var size = i[2].value;
        var para = document.createElement("li");
        var node = document.createTextNode(filename);
        if (is_dir != 0) {
            (function(fname){
                para.ondblclick = function() {
                    new_Path = Path + '/' + fname;
                    window.location.href = new_Path;
                }
            })(filename)
            para.style.color = '#06c';
        }
        para.appendChild(node);

        var element = document.getElementById("file_list");
        element.appendChild(para);
    }
}

function Backpage(Path){
    window.location.href = Path;
}

// Post a rm request and refresh the page
function Delete_file(Path, Filename){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localstorage.value);
    params.append("func", "rm");
    params.append("path", Path);
    params.append("filename", Filename);
    formData.append("auth", auth);
    formData.append("params", params);
    $.ajax({
        url: "/cgi-bin/serve.py", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if(errno==1)
                alert("Failed");
            else
                window.location.href = Path; // 可以采用refresh？
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
}

function Makedir(Path, Dirname){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localstorage.value);
    params.append("func", "mkdir");
    params.append("path", Path);
    params.append("filename", Dirname);
    formData.append("auth", auth);
    formData.append("params", params);
    $.ajax({
        url: "/cgi-bin/serve.py", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if(errno==1)
                alert("Failed");
            else
                window.location.href = Path; // 可以采用refresh？
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
}

function Copyfile(){
    alert("Not ready");
}

// 上传文件，还有不少需要完善
function upload(File, Proc){
    var file = File[0].files[0];
    var size = file.size;
    var chuck = 1000000;
    var num = Math.ceil(size / chuck);

    var md5list = new Array(num);
    var ajaxlist = new Array(num);

    var proc = 0;
    Proc[0].innerHTML = "process: " + proc.toFixed(0) + "%";

    for (var i = 0; i < num; i++) {
        var beg = i * chuck;
        var end = beg + chuck;
        if (end > size)
            end = size;
        var slice = file.slice(beg, end);

        var formData = new FormData();
        var auth = new URLSearchParams();
        auth.append("user", "root");
        var params = new URLSearchParams();
        params.append("func", "save_file");
        params.append("no", i);
        formData.append("auth", auth);
        formData.append("params", params);
        formData.append("file", slice);

        ajaxlist[i] = $.ajax({
            url: "/cgi-bin/serve.py",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                var json = JSON.parse(response)
                md5list[json.no] = json.md5;
                proc += 100 / num;
                $("#proc")[0].innerHTML = "process: " + proc.toFixed(0) + "%";
                // alert(response);
            }
            // error handler
        });
    }

    $.when.apply(null, ajaxlist).done(function () {
        var md5data = md5list.join('","');
        md5data = "[\"" + md5data + "\"]";

        var formData = new FormData();
        var auth = new URLSearchParams();
        auth.append("user", "root");
        var params = new URLSearchParams();
        params.append("func", "commit");
        params.append("filename", file.name);
        params.append("path", "/abc"); // TODO: now fixed in code
        params.append("size", size);
        params.append("md5", md5data);
        formData.append("auth", auth);
        formData.append("params", params);
        $.ajax({
            url: "/cgi-bin/serve.py",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert(response);
            },
            error: function (xhr) {
                alert(xhr.status + " " + xhr.statusText + "\n"
                    + xhr.responseText);
            }
        });
    });
}

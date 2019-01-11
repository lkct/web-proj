/*
用户主界面所需的js函数
*/

// 下载文件
function Download(path, filename){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    params.append("func", "download");
    params.append("path", path);
    params.append("filename", filename);
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
    element.remove();
    for (var i in files) {
        var filename = i.filename;
        var is_dir = i.is_dir;
        var para = document.createElement("li");
        if (is_dir != 0) {
            para.innerHTML = '<section class="cd-section" style="margin-top: 50px;">'
					+'<button class="cd-bouncy-nav-trigger" type="button" onclick="pasd('+filename+')">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal">'
					+'<nav><ul class="cd-bouncy-nav">'
                    +'<li class="enter">Enter</li>'
					+'<li class="copy">Copy</li>'
                    +'<li class="cut">Cut</li>'
					+'</ul></nav>'
                    +'<a class="cd-close">Close modal</a></div>';
            para.style.color='blue'
            element.appendChild(para)
        }
        else {
            para.innerHTML = '<section class="cd-section" style="margin-top: 50px;">'
					+'<button class="cd-bouncy-nav-trigger" type="button" onclick="pasf('+filename+')">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal">'
					+'<nav><ul class="cd-bouncy-nav">'
					+'<li class="down">Download</li>'
					+'<li class="copy">Copy</li>'
                    +'<li class="cut">Cut</li>'
					+'<li class="delete">Delete</li>'
					+'</ul></nav>'
					+'<a class="cd-close">Close modal</a></div>';
            element.appendChild(para);
        }
    }
}

function pasd(dname){
	jQuery(document).ready(function($){
		var is_bouncy_nav_animating = false;
		//open bouncy navigation
		$('.cd-bouncy-nav-trigger').on('click', function(){
			triggerBouncyNav(true);
		});
		//close bouncy navigation
		$('.cd-bouncy-nav-modal .cd-close').on('click', function(){
			triggerBouncyNav(false);
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .copy').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_dir = dname;
            localStorage.op_type = 'copy';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .cut').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_dir = dname;
            localStorage.op_type = 'cut';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .enter').on('click', function(){
            localStorage.path = localStorage.path + '/' + dname;
            window.location.href = window.location.href
        });
		$('.cd-bouncy-nav-modal').on('click', function(event){
			if($(event.target).is('.cd-bouncy-nav-modal')) {
				triggerBouncyNav(false);
			}
		});

		function triggerBouncyNav($bool) {
			//check if no nav animation is ongoing
			if( !is_bouncy_nav_animating) {
				is_bouncy_nav_animating = true;
				
				//toggle list items animation
				$('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
					$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
					if(!$bool) $('.cd-bouncy-nav-modal').removeClass('fade-out');
					is_bouncy_nav_animating = false;
				});
				
				//check if CSS animations are supported... 
				if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
					$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
					is_bouncy_nav_animating = false;
				}
			}
		}
	});
}

function pasf(fname){
	jQuery(document).ready(function($){
		var is_bouncy_nav_animating = false;
		//open bouncy navigation
		$('.cd-bouncy-nav-trigger').on('click', function(){
			triggerBouncyNav(true);
		});
		//close bouncy navigation
		$('.cd-bouncy-nav-modal .cd-close').on('click', function(){
			triggerBouncyNav(false);
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .copy').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_dir = fname;
            localStorage.op_type = 'copy';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .cut').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_dir = fname;
            localStorage.op_type = 'cut';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .delete').on('click', function(){
            Delete_file(localStorage.path, fname);
			triggerBouncyNav(false);
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .down').on('click', function(){
            Download(localStorage.path, fname);
			triggerBouncyNav(false);
        });
		$('.cd-bouncy-nav-modal').on('click', function(event){
			if($(event.target).is('.cd-bouncy-nav-modal')) {
				triggerBouncyNav(false);
			}
		});

		function triggerBouncyNav($bool) {
			//check if no nav animation is ongoing
			if( !is_bouncy_nav_animating) {
				is_bouncy_nav_animating = true;
				
				//toggle list items animation
				$('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
					$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
					if(!$bool) $('.cd-bouncy-nav-modal').removeClass('fade-out');
					is_bouncy_nav_animating = false;
				});
				
				//check if CSS animations are supported... 
				if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
					$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
					is_bouncy_nav_animating = false;
				}
			}
		}
	});
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
                window.location.href = window.location.href;
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
                window.location.href = window.location.href;
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
}

function refresh_token(){
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    auth.append("token", localStorage.token);
    params.append("func", "refresh");
    $.ajax({
        async: false,
        url: "./cgi-bin/serve.py", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var json = JSON.parse(response);
            if(json.errno==1){
                // Todo: Jump to Registraion
                alert("An error occurs! Please login again!");
                window.location.href = "/registraion.html";
            }
            else {
                localStorage.token = json.token;
            }                              
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
}

function Copyfile(src_file, src_path, to_file, to_path, mvpara){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localstorage.value);
    params.append("func", "cp");
    params.append("filename", src_file);
    params.append("path", src_path);
    params.append("filename2", to_file);
    params.append("path2", to_path);
    params.append("mvpara", mvpara);
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
                window.location.href = window.location.href;
        },
        error: function (xhr) {
            alert(xhr.status + " " + xhr.statusText + "\n"
                + xhr.responseText);
        }
    });
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

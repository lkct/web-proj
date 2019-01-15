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
            var json = xhr.responseText;
            if(json.errno==2){
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if(json.errno==3)
                alert("Access denied!");
        }
    });
}

function Display_the_files(files){
    var element = document.getElementById("file_list");
    while(element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
    var i;
    var len = files.length;
    for (i = 0; i < len; i++) {
        var filename = files[i].filename;
        var is_dir = files[i].is_dir;
        var para = document.createElement("li");
        if (is_dir != 0) {
            para.innerHTML = '<section class="cd-section" style="margin-top: 50px;">'
					+'<button class="cd-bouncy-nav-trigger" type="button" onclick="pasd(\''+filenam+'\')">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal">'
					+'<nav><ul class="cd-bouncy-nav">'
                    +'<li class="share">Share</li>'
                    +'<li class="enter">Enter</li>'
					+'<li class="copy">Copy</li>'
                    +'<li class="cut">Cut</li>'
					+'</ul></nav>'
                    +'<a class="cd-close">Close modal</a></div>';
            element.appendChild(para);
        }
        else {
            para.innerHTML = '<section class="cd-section" style="margin-top: 50px;">'
					+'<button class="cd-bouncy-nav-trigger" type="button" onclick="pasf(\''+filename+'\')">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal">'
					+'<nav><ul class="cd-bouncy-nav">'
                    +'<li class="share">Share</li>'
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
            localStorage.src_file = dname;
            localStorage.op_type = 'copy';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .cut').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_file = dname;
            localStorage.op_type = 'cut';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .enter').on('click', function(){
            localStorage.path = localStorage.path + '/' + dname;
            window.location.href = window.location.href;
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .share').on('click', function(){
            share(dname);
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
            localStorage.src_file = fname;
            localStorage.op_type = 'copy';
            triggerBouncyNav(false);
            // waiting for the"paste" to call the Copy function
        });
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .cut').on('click', function(){
            localStorage.src_path = localStorage.path;
            localStorage.src_file = fname;
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
        $('.cd-bouncy-nav-modal .cd-bouncy-nav .enter').on('click', function(){
            share(fname);
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
    auth.append("token", localStorage.token);
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
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = xhr.responseText;
            if(json.errno==2){
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if(json.errno==3)
                alert("Access denied!");
        }
    });
}

function Makedir(Path, Dirname){
    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localStorage.value);
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
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = xhr.responseText;
            if(json.errno==2){
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if(json.errno==3)
                alert("Access denied!");
            else if(json.errno==7)
                alert("Dirname should not be the same as any exist File or Dir!");
        }
    });
}

function refresh_token(){
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    auth.append("token", localStorage.token);
    params.append("func", "refresh");
    var formData = new FormData();
    formData.append("auth", auth);
    formData.append("params", params);
    $.ajax({
        async: false,
        url: "./cgi-bin/serve.py", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var json = JSON.parse(response);
            localStorage.token = json.token;
        },
        error: function (xhr) {
            alert("An error occurs! Please login again!");
            window.location.href = "/registration.html";
        }
    });
}

function Copyfile(to_path=localStorage.path){
    var src_file = localStorage.src_file;
    var src_path = localStorage.src_path;
    var to_file = localStorage.src_file;
    var mvpara = localStorage.mvpara;
    if (src_file == "") {
        alert('No file selected.');
    }

    var auth = new URLSearchParams();         
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localStorage.value);
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
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = xhr.responseText;
            if(json.errno==2){
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if(json.errno==3)
                alert("Access denied!");
        }
    });
    
    if (mvpara == 'cut') {
        localStorage.src_file = "";
        localStorage.src_path = "";
        localStorage.mvpara = "";
    }
}

function share(filename) {
    var tmp_src_file = localStorage.src_file;
    var tmp_src_path = localStorage.src_path;
    var tmp_mvpara = localStorage.mvpara;
    localStorage.src_file = filename;
    localStorage.src_path = localStorage.path;
    localStorage.mvpara = "copy";
    Copyfile(_________); // fill the shared path
    localStorage.src_file = tmp_src_file;
    localStorage.src_path = tmp_src_path;
    localStorage.mvpara = tmp_mvpara;
}

// 上传文件，还有不少需要完善
function upload(File){
    var token = localStorage.token;
    var path = localStorage.path;
    var file = File;
    var filename = file.name;
    var size = file.size;

    var need_upload = true;

    var chuck = 1000000;
    var nchunk = Math.ceil(size / chuck);

    var md5list = new Array(nchunk);
    var ajaxlist = new Array(nchunk);

    var spark = new SparkMD5.ArrayBuffer();
    var reader = new FileReader();
    reader.onload = function (event) {
        spark.append(event.target.result);
    };

    for (var i = 0; i < nchunk; i++) {
        var beg = i * chuck;
        var end = beg + chuck;
        if (end > size)
            end = size;
        reader.readAsArrayBuffer(file.slice(start, end));
    }

    var md5 = spark.end();

    var formData = new FormData();
    var auth = new URLSearchParams();
    auth.append("token", token);
    var params = new URLSearchParams();
    params.append("func", "diff");
    params.append("filename", filename);
    params.append("path", path);
    params.append("md5", md5);
    formData.append("auth", auth);
    formData.append("params", params);
    $.ajax({
        async: false,
        url: "/cgi-bin/serve.py",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var json = JSON.parse(response);
            need_upload = !json.exist;
        },
        error: function (xhr) {
            var json = xhr.responseText;
            if(json.errno==7){
                alert("Duplicate filename! Please rename your file before upload!");
            }
            else{
                alert("Access denied!");
                window.location.href = "/registration.html";
            }            
            // TODO: filename duplicate will give stat=400 error
        }
    });

    if (need_upload) {
        // var proc = 0;
        // $("#proc")[0].innerHTML = "process: " + proc.toFixed(0) + "%";

        for (var i = 0; i < nchunk; i++) {
            var beg = i * chuck;
            var end = beg + chuck;
            if (end > size)
                end = size;
            var slice = file.slice(beg, end);

            var formData = new FormData();
            var params = new URLSearchParams();
            params.append("func", "upload");
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
                    var json = JSON.parse(response);
                    md5list[json.no] = json.md5;
                    // proc += 100 / nchunk;
                    // $("#proc")[0].innerHTML = "process: " + proc.toFixed(0) + "%";
                },
                error: function (xhr) {
                    alert("Access denied!");
                    window.location.href = "/registration.html";
                }
            });
        }
    }
    else {
        ajaxlist = new Array(1);
        var dfd = $.Deferred();
        dfd.resolve();
        ajaxlist[0] = dfd.promise();
    }

    $.when.apply(null, ajaxlist).done(function () {
        var md5list_str = "";
        if (need_upload) {
            md5list_str = md5list.join('","');
            md5list_str = '["' + md5list_str + '"]';
        }
        else {
            md5list_str = "[]";
        }

        var formData = new FormData();
        var params = new URLSearchParams();
        params.append("func", "commit");
        params.append("filename", filename);
        params.append("path", path);
        params.append("size", size);
        params.append("md5list", md5list_str);
        params.append("filemd5", md5);
        formData.append("auth", auth);
        formData.append("params", params);
        $.ajax({
            async: false,
            url: "/cgi-bin/serve.py",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // TODO: upload complete
                alert("Upload finished!");
            },
            error: function (xhr) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
        });
    });
}

function Menu() {
    document.getElementById("myDropdown").classList.toggle("show");
};

// 点击下拉菜单意外区域隐藏
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

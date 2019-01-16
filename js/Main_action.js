/*
用户主界面所需的js函数
*/

// 下载文件
function Download(path, filename) {
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localStorage.token);
    params.append("func", "download");
    params.append("path", path);
    params.append("filename", filename);
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
            window.open("/cgi-bin/download.py?dl_token=" + json.dl_token);
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if (json.errno == 3)
                alert("Access denied!");
        }
    });
}

function Display_the_files(files) {
    var element = document.getElementById("file_list");
    while (element.hasChildNodes()) {
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
                    +'<button class="cd-bouncy-nav-trigger" type="button" id="'+filename+'"'
                    +'ondbclick="pasd()">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal-d">'
					+'<nav><ul class="cd-bouncy-nav">'
                    +'<li><a href=#0 onclick="click_share(\''+filename+'\')">Share</a></li>'
                    +'<li><a href=#0 onclick="click_cut(\''+filename+'\')">Cut</a></li>'
                    +'<li><a href=#0 onclick="click_copy(\''+filename+'\')">Copy</a></li>'
                    +'<li><a href=#0 onclick="click_enter(\''+filename+'\')">Enter</a></li>'
					+'<li><a href=#0></a></li>'
					+'<li><a href=#0></a></li>'
					+'</ul></nav>'
                    +'<a class="cd-close">Close modal</a></div>';
            element.appendChild(para);
        }
        else {
            para.innerHTML = '<section class="cd-section" style="margin-top: 50px;">'
                    +'<button class="cd-bouncy-nav-trigger" type="button" id="'+filename+'"'
                    +'ondbclick="pasf()">'+filename + '</button></section>'
					+'<div class="cd-bouncy-nav-modal-f">'
					+'<nav><ul class="cd-bouncy-nav">'
                    +'<li><a href=#0 onclick="click_share(\''+filename+'\')">Share</a></li>'
                    +'<li><a href=#0 onclick="click_cut(\''+filename+'\')">Cut</a></li>'
                    +'<li><a href=#0 onclick="click_copy(\''+filename+'\')">Copy</a></li>'
					+'<li><a href=#0></a></li>'
					+'<li><a href=#0 onclick="click_download(\''+filename+'\')">Download</a></li>'
					+'<li><a href=#0 onclick="click_delete(\''+filename+'\')">Delete</a></li>'
					+'</ul></nav>'
					+'<a class="cd-close">Close modal</a></div>';
            element.appendChild(para);
        }
    }
}

function click_share(file_name) {
    share(file_name);
}

function click_cut(file_name) {
    localStorage.src_path = localStorage.path;
    localStorage.src_file = file_name;
    localStorage.mvpara = 'mv';
}

function click_copy(file_name) {
    localStorage.src_path = localStorage.path;
    localStorage.src_file = file_name;
    localStorage.mvpara = 'cp';
}

function click_download(file_name) {
    Download(localStorage.path, file_name);
}

function click_delete(file_name) {
    Delete_file(localStorage.path, file_name);
}

function click_enter(file_name) {
    if (localStorage.path != '/') localStorage.path = localStorage.path + '/' + file_name;
    else localStorage.path = '/' + file_name;
    window.location.href = window.location.href;
}

function pasd() {
	jQuery(document).ready(function($){
		var is_bouncy_nav_animating = false;
		//open bouncy navigation
		$('.cd-bouncy-nav-trigger').unbind('click').bind('click', function(){
			triggerBouncyNav(true);
		});
		//close bouncy navigation
		$('.cd-bouncy-nav-modal-d .cd-close').unbind('click').bind('click', function(){
			triggerBouncyNav(false);
        });
		$('.cd-bouncy-nav-modal-d').on('click', function(event){
			if($(event.target).is('.cd-bouncy-nav-modal')) {
				triggerBouncyNav(false);
			}
		});

		function triggerBouncyNav($bool) {
			//check if no nav animation is ongoing
			if( !is_bouncy_nav_animating) {
				is_bouncy_nav_animating = true;
				
				//toggle list items animation
				$('.cd-bouncy-nav-modal-d').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
					$('.cd-bouncy-nav-modal-d').toggleClass('is-visible', $bool);
					if(!$bool) $('.cd-bouncy-nav-modal-d').removeClass('fade-out');
					is_bouncy_nav_animating = false;
				});
				
				//check if CSS animations are supported... 
				if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
					$('.cd-bouncy-nav-modal-d').toggleClass('is-visible', $bool);
					is_bouncy_nav_animating = false;
				}
			}
		}
	});
}

function pasf() {
	jQuery(document).ready(function($){
		var is_bouncy_nav_animating = false;
		//open bouncy navigation
		$('.cd-bouncy-nav-trigger').unbind('click').bind('click', function(){
			triggerBouncyNav(true);
		});
		//close bouncy navigation
		$('.cd-bouncy-nav-modal-f .cd-close').unbind('click').bind('click', function(){
			triggerBouncyNav(false);
        });
		$('.cd-bouncy-nav-modal-f').unbind('click').bind('click', function(event){
			if($(event.target).is('.cd-bouncy-nav-modal')) {
				triggerBouncyNav(false);
			}
		});

		function triggerBouncyNav($bool) {
			//check if no nav animation is ongoing
			if( !is_bouncy_nav_animating) {
				is_bouncy_nav_animating = true;
				
				//toggle list items animation
				$('.cd-bouncy-nav-modal-f').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
					$('.cd-bouncy-nav-modal-f').toggleClass('is-visible', $bool);
					if(!$bool) $('.cd-bouncy-nav-modal-f').removeClass('fade-out');
					is_bouncy_nav_animating = false;
				});
				
				//check if CSS animations are supported... 
				if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
					$('.cd-bouncy-nav-modal-f').toggleClass('is-visible', $bool);
					is_bouncy_nav_animating = false;
				}
			}
		}
	});
}

// Post a rm request and refresh the page
function Delete_file(Path, Filename) {
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
        async: false,
        url: "/cgi-bin/serve.py",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if (json.errno == 3)
                alert("Access denied!");
        }
    });
}

function Makedir(Path, Dirname) {
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localStorage.token);
    params.append("func", "mkdir");
    params.append("filename", Dirname);
    params.append("path", Path);
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
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if (json.errno == 3)
                alert("Access denied!");
            else if (json.errno == 7)
                alert("Dirname should not be the same as any exist File or Dir!");
        }
    });
}

function refresh_token() {
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    auth.append("token", localStorage.token);
    params.append("func", "refresh");
    var formData = new FormData();
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
            localStorage.token = json.token;
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("An error occurs! Please login again!");
                window.location.href = "/registration.html";
            }
        }
    });
}

function Copyfile(to_path = localStorage.path) {
    var src_file = localStorage.src_file;
    if (src_file == "") {
        alert('No file selected.');
        return;
    }
    var src_path = localStorage.src_path;
    var to_file = localStorage.src_file;
    var mvpara = -1;
    if (localStorage.mvpara == "mv") mvpara = 1;
    else if (localStorage.mvpara == "cp") mvpara = 0;

    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    var formData = new FormData();
    auth.append("token", localStorage.token);
    params.append("func", "cp");
    params.append("filename", src_file);
    params.append("path", src_path);
    params.append("filename2", to_file);
    params.append("path2", to_path);
    params.append("mv", mvpara);
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
            if (mvpara == 1) {
                localStorage.src_file = "";
                localStorage.src_path = "";
                localStorage.mvpara = "";
            }
            window.location.href = window.location.href;
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if (json.errno == 3)
                alert("Access denied!");
        }
    });
}

function share(filename) {
    var grp_name = prompt("Please enter the group to which you want to share the file(s):");
    if (!grp_name)
        return;

    var grp_check = false;
    var auth = new URLSearchParams();
    var params = new URLSearchParams();
    auth.append("token", localStorage.token);
    params.append("func", "lsgrps");
    var formData = new FormData();
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
            var lst = JSON.parse(json.list);
            var len = lst.length;
            var i;
            for (i = 0; i < len; i++) {
                if (lst[i].group == grp_name) {
                    grp_check = true;
                    break;
                }
            }
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
            else if (json.errno == 3)
                alert("Access denied!");
        }
    });

    if (grp_check == false) {
        alert("You are not in the wanted group!");
        return;
    }
    if (grp_name[0] != '/') grp_name = '/' + grp_name;

    var tmp_src_file = localStorage.src_file;
    var tmp_src_path = localStorage.src_path;
    var tmp_mvpara = localStorage.mvpara;
    localStorage.src_file = filename;
    localStorage.src_path = localStorage.path;
    localStorage.mvpara = "cp";
    Copyfile(grp_name); // fill the shared path
    localStorage.src_file = tmp_src_file;
    localStorage.src_path = tmp_src_path;
    localStorage.mvpara = tmp_mvpara;
}

function upload() {
    var token = localStorage.token;
    var path = localStorage.path;
    var file = $("#file")[0].files[0];
    var filename = file.name;
    var size = file.size;

    var need_upload = true;

    var chuck = 1000000;
    var nchunk = Math.ceil(size / chuck);

    var md5list = new Array(nchunk);
    var ajaxlist = new Array(nchunk);

    var spark = new SparkMD5.ArrayBuffer();
    var reader = new FileReader();
    var idx = 0;
    reader.onload = function (event) {
        spark.append(event.target.result);
        idx++;
        if (idx < nchunk)
            loadnext();
    };
    function loadnext(){
        var beg = idx * chuck;
        var end = beg + chuck;
        if (end > size)
            end = size;
        var slice = file.slice(beg, end);
        reader.readAsBinaryString(slice);
    }
    loadnext();

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
            var json = JSON.parse(xhr.responseText);
            if (json.errno == 7) {
                alert("Duplicate filename! Please rename your file before upload!");
            }
            else if (json.errno == 2) {
                alert("Access denied!");
                window.location.href = "/registration.html";
            }
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
                    var json = JSON.parse(xhr.responseText);
                    if (json.errno == 2) {
                        alert("Access denied!");
                        window.location.href = "/registration.html";
                    }
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
                alert("Upload finished!");
            },
            error: function (xhr) {
                var json = JSON.parse(xhr.responseText);
                if (json.errno == 2) {
                    alert("Access denied!");
                    window.location.href = "/registration.html";
                }
            }
        });
    });
	window.location.href = "/Main_page.html";
}

function Menu() {
    document.getElementById("myDropdown").classList.toggle("show");
};

// 点击下拉菜单意外区域隐藏
window.onclick = function (event) {
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

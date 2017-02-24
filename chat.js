(function () {
    var url = "ws://127.0.0.1:3000";
    var send_ws = document.getElementById('send_ws');
    var input_msg = document.getElementById('username');
    var content = document.getElementById('content');
    var mjr_send = document.getElementById('mjr_send');
    var s = Math.floor((Math.random() * 100) + 1);

    //连接到服务器
    var socket = io.connect(url);
    //回车发送消息
    document.onkeydown = function () {
        if (event.keyCode == 13) {
            btn();
        }
    };
    //点击发消息
    var btn = mjr_send.onclick = function () {
        var obj = {
            userid: s,
            username: input_msg.value,
            content: content.value
        };
        if (obj.content == "") {
            alert("请输入内容");
        } else {
            socket.emit("message", obj);
        }
    };
    //点击登录
   send_ws.onclick = function () {
       socket.emit("login", {
           userid: s,
           username: input_msg.value
       });
   }
    //监听用户登录
    socket.on("login", function (o) {
        //显示用户名
        var showusername = document.getElementById('showusername');
        showusername.innerHTML = input_msg.value;
        console.log(input_msg.value)
        //页面显示隐藏
        var loginbox = document.getElementById('loginbox');
        var chatbox = document.getElementById('chatbox');
        loginbox.style.display = "none";
        chatbox.style.display = "block";
        //用户人数
        var onlinecount = document.getElementById('onlinecount');
        var obj = o.onlineUsers;
        var users = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var ss = obj[key] + "、";
                users += ss;
            }
        }
        onlinecount.innerHTML = "当前共有" + o.onlineCount + "人在线;" + "用户列表:" + users;
        //用户进入聊天室
        var center = document.createElement('section');
        var message = document.getElementById('message');
        message.appendChild(center);
        var html = '';
        html += '<div class="msg-system">';
        html += o.user.username;
        html += ('login') ? ' 加入了聊天室' : ' 退出了聊天室';
        html += '</div>';
        center.innerHTML = html;
        center.className = 'system J-mjrlinkWrap J-cutMsg';

    });
    //用户退出
    socket.on("logout", function (o) {
        var center = document.createElement('section');
        var message = document.getElementById('message');
        message.appendChild(center);
        var html = '';
        html += '<div class="msg-system">';
        html += o.user.username;
        html += ' 退出了聊天室';
        html += '</div>';
        center.innerHTML = html;
        center.className = 'system J-mjrlinkWrap J-cutMsg';

        var log_out=document.getElementById('logout');
        log_out.onclick=function () {
            location.reload();
        }
        var onlinecount = document.getElementById('onlinecount');
        var obj = o.onlineUsers;
        var users = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var ss = obj[key] + "、";
                users += ss;
            }
        }
        onlinecount.innerHTML = "当前共有" + o.onlineCount + "人在线;" + "用户列表:" + users;
    });
    socket.on("message", function (obj) {
        //消息
        var section = document.createElement('section');
        var message = document.getElementById('message');
        message.appendChild(section);
        var content_div = '<div>' + obj.content + '</div>';
        var username_div = '<span>' + obj.username + '</span>';
        content.value = "";
        if (obj.userid == s) {
            section.className = 'user';
            section.innerHTML = username_div + content_div;
            window.scrollTo(0, document.getElementById('message').clientHeight);
        } else {
            section.className = 'service';
            section.innerHTML = username_div + content_div;
            window.scrollTo(0, document.getElementById('message').clientHeight);
        }
    });
}(window))
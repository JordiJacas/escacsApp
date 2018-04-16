/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var token;
 var text = $("#text");
 var friends = $("#friends");
 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        crearTablero();

        $("form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var password = $(this).find("input[name='password']").val();

            $.getJSON("https://escacsjordi.herokuapp.com/api/usuarios/login?email="+email+"&password="+password,function(data) {
                text.text(data.mensaje);
                token = data.token;
                console.log(data.token);
                conectado();

            }).fail( function(e) {
                alert("error");
                console.log(e);
            });
        });

        $('#logout').click(function(e){
            e.preventDefault();
            $.getJSON("https://escacsjordi.herokuapp.com/api/usuarios/logout?token="+token,function(data) {
                text.text(data.mensaje);
                friends.empty();
            })
        });
    }
};


function conectado(){
    $.getJSON("https://escacsjordi.herokuapp.com/api/usuarios/conectados?token="+token,function(data) {
        if(data.usernames === undefined){friends.text(data.mensaje);}
        else{

            for(var i = 0; i < data.usernames.length; i++){
                friends.append("<li>"+data.usernames[i]+"</li>")
            }
        }
    })
}


function crearTablero(){
    tablero = $('#tablero');
    for(var i=0;i<=8;i++){
        for(var j=0;j<=8;j++){ 
            if(i == 0 && j ==0){tablero.append("<th></th>");}
            else if(i == 0){tablero.append("<th>"+j+"</th>");}
            else if(j == 0){
                tablero.append("<tr></tr> ");
                tablero.append("<th>"+i+"</th>");
            }else{
                if(j > 8){tablero.append("<tr></tr>");}
                else{
                    if((i % 2 == 0 && j % 2 == 0)||(i % 2 != 0 && j % 2 != 0)){var cela = $("<td id="+i+j+" class='white'></td>");}
                    else{var cela = $("<td id="+i+j+" class='black'></td>");}
                    tablero.append(cela);
                }
            }
        }
    }
}

app.initialize();




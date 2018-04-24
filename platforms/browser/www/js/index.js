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
 var token = "5d539ec159b80e19b1be7997c73a15d0";
 var rival;
 var text = $("#text");
 var friends = $("#friends");
 var invitar = $("#invite");
 var conct;
 var inv;

 var url = "http://localhost:8080/api/"//"https://escacsjordi.herokuapp.com/api/";

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

        $('#logout').hide();
        $('#list').hide(),
        //$('table').hide();
        //crearTablero();
        
        $("form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var password = $(this).find("input[name='password']").val();

            $.getJSON(url+"usuarios/login?email="+email+"&password="+password,function(data) {
                text.text(data.mensaje);
                token = data.token;

                conct = setInterval(conectado,1500);
                inv = setInterval(invitaciones,1500);


            }).fail( function(e) {
                alert("error");
                console.log(e);
            });

            $('form').hide();
            $('#logout').show();
            $('#list').show();
        });

        $('#logout').click(function(e){
            e.preventDefault();
            $.getJSON(url+"usuarios/logout?token="+token,function(data) {
                text.text(data.mensaje);  
            })

            friends.empty();
            invitar.empty();

            clearInterval(conct);
            clearInterval(inv);

            $('#logout').hide();
            $('form').show();
            $('#list').hide();
        });
    }
};


function conectado(){
    friends.empty();
    var li = $('<li></li>');

    console.log("hola");

    $.getJSON(url+"usuarios/conectados?token="+token,function(data) {
        friends.append()
        if(data.usernames === undefined){friends.text(data.mensaje);}
        else{
            for(var i = 0; i < data.usernames.length; i++){
                var a = $("<a id='"+data.usernames[i]+"' href='#'>Invite</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON(url+"invitacion/invitar?token="+token+"&name="+e.target.id,function(data) {
                    console.log(data.mensaje);
                    })
                })

                li.append(data.usernames[i]);
                li.append(" --- ");
                li.append(a);
                friends.append(li);
            }
        }
    })
}

function crearTablero(){

    rival = "user2";
    var torre = "t";
    tablero = $('#tablero');

    $.getJSON(url+"tablero/ver?token="+token+"&name="+rival,function(data) {

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
                        if((i % 2 == 0 && j % 2 == 0)||(i % 2 != 0 && j % 2 != 0)){
                            if(data.tablero && data.tablero[0].fila == i && data.tablero[0].columna == j){    
                                var cela = $("<td id="+i+j+" class='white'>hola</td>");
                            
                            }else{
                                var cela = $("<td id="+i+j+" class='white'></td>");
                            }
                        }else{
                            if(data.tablero && data.tablero[1].fila == i && data.tablero[1].columna == j){
                                var cela = $("<td id="+i+j+" class='black'>hola</td>");
                            }else{
                             var cela = $("<td id="+i+j+" class='black'></td>");
                            }
                        }
                    }
                        tablero.append(cela);
                }
            }
        }
    }); 
}

function invitaciones(){

    invitar.empty();
    var li = $('<li></li>');
    console.log("hola2");

    $.getJSON(url+"invitacion/ver?token="+token,function(data) {
        for(var i = 0; i < data.mensaje.length; i++){

            var a1 = $("<a id='"+data.mensaje[i].name+"' href='#'>Aceptar</a>").click(function(e){

                    $.getJSON(url+"invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=1'",function(data) {
                    console.log(data.mensaje);
                    })

                    rival = e.target.id;
                    $('table').show();
                    crearTablero();
                })


            var a2 = $("<a id='"+data.mensaje[i].name+"' href='#'>Rechazar</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON(url+"invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=0'",function(data) {
                    console.log(data.mensaje);
                    })
                })

            li.append(data.mensaje[i].name);
            li.append(" --- ");
            li.append(a1);
            li.append(" --- ");
            li.append(a2);

            invitar.append(li);
        }
    });
}

app.initialize();
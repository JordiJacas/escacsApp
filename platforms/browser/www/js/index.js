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
 var token = "87366b59bc3f36d74525ee4442f23b14";
 var rival = "user2";
 var text = $("#text");
 var friends = $("#friends");
 var invitar = $("#invite");
 var conct;
 var inv;
 var tablero;
 var cMov = 1;
 var fila1;
 var col1;
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
        crearTablero();
        
        
        $("form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var password = $(this).find("input[name='password']").val();

            $.getJSON(url+"usuarios/login?email="+email+"&password="+password,function(data) {
                text.text(data.mensaje);
                token = data.token;

                conct = setInterval(conectado,1000);
                inv = setInterval(invitaciones,1000);

                //conectado();
                //invitaciones();
                //crearTablero();


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
            tablero.empty();

            
            clearInterval(tablero);
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

    $.getJSON(url+"usuarios/conectados?token="+token,function(data) {
        friends.append()
        if(data.usernames === undefined){friends.text(data.mensaje);}
        else{
            for(var i = 0; i < data.usernames.length; i++){
                clearInterval(conct);
                var a = $("<a id='"+data.usernames[i]+"' href='#'>Invite</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON(url+"invitacion/invitar?token="+token+"&name="+e.target.id,function(data) {
                        console.log(data.mensaje);  
                        rival = e.target.id;

                        clearInterval(tablero);
                        clearInterval(conct);
                        clearInterval(inv);

                        $('#list').hide();

                        tablero = setInterval(crearTablero,3000);
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
    var torre = "♖";
    tablero = $('#tablero');
    tablero.empty();
    
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
                                if(data.tablero){
                                    if(data.tablero[0].fila == i && data.tablero[0].columna == j || 
                                        data.tablero[1].fila == i && data.tablero[1].columna == j){ 
                                            var cela = $("<td id="+i+j+" class='white'>"+torre+"</td>");
                                        }else{
                                            var cela = $("<td id="+i+j+" class='white'></td>");
                                        }
                                }else{var cela = $("<td id="+i+j+" class='white'></td>");}
                            }else{
                                if(data.tablero){
                                    if(data.tablero[1].fila == i && data.tablero[1].columna == j || 
                                        data.tablero[0].fila == i && data.tablero[0].columna == j){
                                            var cela = $("<td id="+i+j+" class='black'>"+torre+"</td>");
                                        }else{
                                            var cela = $("<td id="+i+j+" class='black'></td>");
                                        }
                                }else{var cela = $("<td id="+i+j+" class='black'></td>");}
                            }
                        }   
                        cela.click(mov);
                        tablero.append(cela);
                    }
            }
        }
    }); 
}

function invitaciones(){

    var li = $('<li></li>');

    $.getJSON(url+"invitacion/ver?token="+token,function(data) {
        for(var i = 0; i < data.mensaje.length; i++){
            clearInterval(inv);

            var a1 = $("<a id='"+data.mensaje[i].name+"' href='#'>Aceptar</a>").click(function(e){

                    $.getJSON(url+"invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=1'",function(data) {
                    console.log(data.mensaje);
                        li.remove();
                        rival = e.target.id;

                        clearInterval(conct);
                        clearInterval(inv);
                        clearInterval(tablero);

                        $('#list').hide();

                        tablero = setInterval(crearTablero,3000);
                    })

                   
                    $('table').show();
                })


            var a2 = $("<a id='"+data.mensaje[i].name+"' href='#'>Rechazar</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON(url+"invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=0'",function(data) {
                        console.log(data.mensaje);
                        li.remove();
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

function mov(event){
    var str = event.target.id;
    var fila = str.substring(0,1);
    var col = str.substring(1,2);

    if(cMov == 2){
        $.getJSON(url+"tablero/mover?token="+token+"&name="+rival+"&toFila="+fila1+"&toColumna="+col1+"&fromFila="+fila+"&fromColumna="+col,function(data) {
            alert(data.mensaje);
        }) 

        cMov = 1;
    }else if(cMov == 1){

        fila1 = fila;
        col1 = col;
        cMov++;
    }
}
app.initialize();
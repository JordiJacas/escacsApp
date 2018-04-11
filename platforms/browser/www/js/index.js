var torre = "♖";
var tpos = 18;

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
    },

    crearTablero: function() {
        var tablero = $('#tablero');

        for(var i=0;i<=8;i++){
            for(var j=0;j<=8;j++){
                
                if(i == 0 && j ==0){
                    tablero.append("<th></th>");
                }else if(i == 0){
                    tablero.append("<th>"+j+"</th>");
                }else if(j == 0){
                    tablero.append("<tr></tr> ");
                    tablero.append("<th>"+i+"</th>");
                }else{
                    
                    if(j > 8){
                        tablero.append("<tr></tr>");
                    }else{
                        if((i % 2 == 0 && j % 2 == 0)||(i % 2 != 0 && j % 2 != 0)){
                            var cela = $("<td id="+i+j+" class='white'></td>");    
                        }else{
                            var cela = $("<td id="+i+j+" class='black'></td>");

                        }
                        cela.click(mov);
                        tablero.append(cela);
                    }
                }
            }
        }   
    }
};

app.initialize();
app.crearTablero();

function mov(event){
    alert(event.target.id);
}

var url = "http://localhost:8080";
var user = {email: "user@gmail.com",password: "123456"};
var token;

var api = {
    login: function(){
        $.getJSON(url+"/api/usuarios/login?email="+user["email"]+"&password="+user["password"],function(data) {
            alert("token="+data["token"]);
            token = data["token"];
        }).fail( function(e) {
            alert(data["token"]);
            console.log(e);
        });
    },

    logout: function(){
        $.getJSON(url+"/api/usuarios/logout?token="+token,function(data) {
            alert(data["mensaje"]);
        }).fail( function(e) {
            alert(data["mensaje"]);
            console.log(e);
        });
    },
};

$('#login').click(api.login);
$('#logout').click(api.logout);



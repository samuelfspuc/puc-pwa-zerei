/*
Variáveis Globais
*/

let quant_jogos = 10;
let contar = 0;
let endpoint_principal = "dados.json";
let endpoint_atual = endpoint_principal;
let data_json;
let content = document.getElementById("content");
let loadArea = document.getElementById("load-area");
let btLoad = document.getElementById("btLoadMore");
let catTitle = document.getElementById("catTitle");
let btInstall = document.getElementById("btInstall");
let filter_game = "";

/*
AJAX Carregar Jogos
*/

function loadGames(){

    let ajax = new XMLHttpRequest();

    ajax.open("GET", endpoint_principal, true);
    ajax.send();

    ajax.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
            data_json = JSON.parse(this.responseText);

            setTimeout(() => {
                //console.log(data_json);
                loadArea.style.display = "block";
                printCard();

            }, 500);

        }
    }

}

loadGames();

/*
Imprimir Card
*/
function printCard(){    

    let html_content = "";
    content.innerHTML = html_content;

    if(data_json.length > 0){
        
        loadMore();

    }else{
        html_content = msg_alert("Nenhum jogo cadastrado!", "warning");
        content.append = html_content;
    }

}

function loadMore(){

    let temp_json =  filter_game === "" ? data_json : data_json.filter(d => filter_game.includes(d.genre));

    let html_content = "";
    let final = (contar+quant_jogos);

    if(final > temp_json.length){
        final = temp_json.length
        loadArea.style.display = "none";
    }

    //console.log(temp_json);
    
    for(let i = contar; i < final; i++ ){
        html_content+=card(temp_json[i]);
    }

    contar+=quant_jogos;
    content.innerHTML += html_content;
}

/*
Filtro de Categoria
*/

var btCategoria = function(categoria)
{
    loadArea.style.display = "block";
    contar = 0;
    filter_game = categoria;
    document.getElementById("catTitle").innerHTML = categoria || "Todos os Gêneros";
    content.innerHTML = "";
    loadMore();
}


/*
Template Engine
*/

card = function ({thumbnail, title, genre, developer, platform,release_date,short_description,game_url}){

    let botao = navegacao == true ? `<div class="card-footer"><div class="d-grid gap-2"><a class="btn btn-info" target="_blank" href="${game_url}">Acessar Game</a></div></div>` : "";

    let thumb = navegacao == true ? thumbnail : "img/no_img.jpg";

    return `<div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <div class="card">
                <img src="${thumb}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <h6><span class="badge bg-secondary">${genre}</span>&nbsp;&nbsp;<span
                        class="badge bg-info">${developer}</span>&nbsp;&nbsp;<span class="badge bg-primary">${platform}</span></h6>
                    <p><strong>Lançamento: ${release_date}</strong></p>
                    <p class="card-text">${short_description}</p>

                </div>
                ${botao}
            </div>
        </div>`;
}

msg_alert = function (msg, tipo){

    return `<div class="col-12 col-md-6"><div class="alert alert-${tipo}" role="alert">${msg}</div></div>`;
}

/*
Botão de Instalação
*/

let windowInstall = null;

window.addEventListener('beforeinstallprompt', callInstallWindow);

function callInstallWindow(evt){
    windowInstall = evt;
}

let initInstall = function(){

    setTimeout(function(){
        if(windowInstall != null)
            btInstall.removeAttribute("hidden");
    }, 500);

    btInstall.addEventListener("click", function(){

        btInstall.setAttribute("hidden", true);

        windowInstall.prompt();
        
        windowInstall.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário instalou o app");
            }else{
                console.log("Usuário recusou instalação");
                btInstall.removeAttribute("hidden");
            }

        });

    });
}

/*
Status do Navegado
*/

let navegacao = true;

window.addEventListener("load", (event) => {
    //console.log(navigator.onLine ? "Online" : "OFFline");
    navigator.onLine ? navegacao = true : navegacao = false;
});
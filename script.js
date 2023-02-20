let teladois = document.querySelector(".teladois");
let telaum = document.querySelector(".telaum");
let header = document.querySelector('.header');
let footer = document.querySelector(".footer")
let telaregistar = document.querySelector(".telaregistrar")
let telalogin = document.querySelector(".telalogin")

telaregistar.className = "none"
header.className = "none"
footer.className = "none"
telaum.className = "none"
teladois.className = "none";

let perfilIcone = document.getElementById("perfil")
let houseIcone = document.getElementById("house");
let picles = document.querySelector(".PICLES");
let infoperfil = document.querySelector(".infoperfil");
let telapicles = document.querySelector(".telapicles")

telapicles.className = "none"
picles.className = "none"

perfilIcone.addEventListener("click",()=>{
    teladois.className = "teladois";
    telaum.className = "none";
    document.querySelector(".profileImg").id = "selected";
    document.querySelector(".houseImg").id = "";
})

houseIcone.addEventListener("click",()=>{
    teladois.className = "none";
    telaum.className = "telaum";
    document.querySelector(".profileImg").id = "";
    document.querySelector(".houseImg").id = "selected";
    
})

document.getElementById("linkpicles").addEventListener("click",()=>{
    infoperfil.className = "none"
    picles.className = "PICLES"
    telapicles.className = "none"
})

document.getElementById("linkperfil").addEventListener("click",()=>{
    infoperfil.className = "infoperfil"
    picles.className = "none"
    telapicles.className = "none"
})

document.getElementById("btn-picles").addEventListener("click",()=>{
    if(telapicles.className == "none"){
        telapicles.className = "telapicles"
    }else{
        telapicles.className = "none"
    }
})

let checkbox = document. getElementById('contrato-check');
let btnpicles = document. getElementById("desabled")

checkbox.addEventListener("change",()=>{
if(checkbox. checked) {
    btnpicles.id = "active"
} else {
    btnpicles.id = "desabled"
}
})

document. getElementById("linktermos").addEventListener("click", ()=>{
    setTimeout(() => {
        alert("Não foi possivel encontrar os termos")
    }, 400);
})

document.getElementById("noconta").addEventListener("click",()=>{
    telaregistar.className = "telaregistrar"
    telalogin.className = "none"
})

document.getElementById("siconta").addEventListener("click",()=>{
    telaregistar.className = "none"
    telalogin.className = "telalogin"
})

let uiduser;

const firebaseConfig = {
  apiKey: "AIzaSyCBZJAGW9HzZzPVRleTxbLjfbLgyJ3hRD0",
  authDomain: "banco-543be.firebaseapp.com",
  projectId: "banco-543be",
  storageBucket: "banco-543be.appspot.com",
  messagingSenderId: "639020300726",
  appId: "1:639020300726:web:12964186091692460c6917"
  };
  // Obtenha referências aos elementos de formulário
  firebase.initializeApp(firebaseConfig);
  
        // Obtenha uma referência para o Firestore
        const db = firebase.firestore();
  
        // Adicione um manipulador de envio de formulário
        const registerForm = document.querySelector(".telaregistrar");
        const registrarButton =document.querySelector("#btn-registrar")
        registrarButton.addEventListener("click", async (event) => {
          event.preventDefault();
  
          // Obtenha os valores do formulário
          const email = document.querySelector("#emailregistrar").value;
          const password = document.querySelector("#passwordregistrar").value;
  
          const name = document.querySelector("#nameregistrar").value;
  
          // Registre o usuário com o Firebase Auth
          try {
            const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
  
            // Adicione o usuário à coleção "users"
            await db.collection("users").doc(user.uid).set({ 
              userName : name,
              reais: 0
            });
  
            console.log("Registrado com sucesso!");
          } catch (error) {
            console.error(error);
          }
        });


        const loginForm = document.querySelector(".telalogin");
        const loginButton = document.querySelector('#btn-login');
      loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Obtenha os valores do formulário
        const emaillog = document.querySelector("#email").value;
        const passwordlog = document.querySelector("#password").value;

        // Faça o login do usuário com o Firebase Auth
        try {
          const { user } = await firebase.auth().signInWithEmailAndPassword(emaillog, passwordlog);

          // Obtenha as informações do usuário da coleção "users"
          const userRef = db.collection("users").doc(user.uid);
          const snapshot = await userRef.get();
          const userData = snapshot.data();

          console.log("Usuário logado:", userData.userName);
          console.log(userData.reais)
          console.log(user.uid)


          let nameperfil = document.getElementById("nameperfil")
          nameperfil.innerHTML = userData.userName

          let namesaldo = document.getElementById("namesaldo")
          namesaldo.innerHTML = "R$ " + userData.reais

          let nameuid = document.getElementById("nameuid")
          nameuid.innerHTML = "UID: " + user.uid

          telalogin.className = "none"
          header.className = "header"
          footer.className = "footer"
          telaum.className = "telaum"

          uiduser = user.uid

        } catch (error) {
          console.error(error);
          alert("Erro ao logar")
        }
      });

      btnpicles.addEventListener("click",()=>{
        if(btnpicles.id == "active"){
           const uidpicles = document.getElementById("uidpicles").value
           const valuepicles = document.getElementById("valuepicles").value
           const recibo = firebase.firestore().collection('users').doc(uidpicles);
           const pagante = firebase.firestore().collection('users').doc(uiduser)
        //     let reciboreais = recibo.reais
        //     reciboreais += parseFloat(valuepicles)
        //    console.log(reciboreais)

        //    console.log(reciboreais)

        recibo.get().then((doc) => {
            if (doc.exists) {
              // Obtenha o valor de um campo específico
              var valor = doc.data().reais;
              valor += parseFloat(valuepicles)
              console.log(valor);

              if(valuepicles > 0){
                recibo.update({
                    reais: valor
                })
                setTimeout(() => {
                pagante.get().then((doc) => {
                    if (doc.exists) {
                      // Obtenha o valor de um campo específico
                      var valordois = doc.data().reais;
                      valordois = valordois - valuepicles
                      console.log(valordois);

                        if(valuepicles > 0){
                            pagante.update({
                                reais: valordois
                            })
                        }

                    } else {
                      console.log('O documento não existe');
                    }
                  }).catch((error) => {
                    console.log('Erro ao obter o documento:', error);
                  });
                }, 500)
               }

            } else {
              console.log('O documento não existe');
            }
          }).catch((error) => {
            console.log('Erro ao obter o documento:', error);
          });

           
        }
      })

      const reloadreais = document.getElementById('reload-reais')

      reloadreais.addEventListener("click",()=>{
        const docRef = firebase.firestore().collection('users').doc(uiduser)

        docRef.get().then((doc) => {
            if (doc.exists) {
              // Obtenha o valor de um campo específico
              const valors = doc.data().reais;
              document.getElementById('namesaldo').innerHTML = "R$ " + valors
              console.log(valors);
            } else {
              console.log('O documento não existe');
            }
          }).catch((error) => {
            console.log('Erro ao obter o documento:', error);
          });
      })

      const matematicafree = document.getElementById('matematicafree')

      matematicafree.addEventListener("click",()=>{
        function bases(max){
            return Math.round( Math.floor(Math.random() * max))
        }

        let num1 = bases(300)
        let num2 = bases(300)
        let result = parseFloat(num1) + parseFloat(num2)

        var resultado = prompt("Escreva o resultado:  " + num1 + " + " + num2)

        if(resultado == result){
            const docRefe = firebase.firestore().collection('users').doc(uiduser);

            docRefe.get().then((doc) => {
                if (doc.exists) {
                  // Obtenha o valor de um campo específico
                  var valores = doc.data().reais;
                  valores += 5
                  console.log(valores);

                  docRefe.update({
                    reais: valores
                  })
                } else {
                  console.log('O documento não existe');
                }
              }).catch((error) => {
                console.log('Erro ao obter o documento:', error);
              });
            alert("Parabéns você ganhou R$ 5")
        }else{
            alert("Não foi desta vez :(")
        }
      })
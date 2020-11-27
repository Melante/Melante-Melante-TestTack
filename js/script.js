let button = document.querySelector('.footer__button');
let formOpen = document.querySelector('.modal-form');
let closeButton = formOpen.querySelector('.modal-close');

button.addEventListener('click', function(evt){
	evt.preventDefault();
	formOpen.classList.add('open');
});

closeButton.addEventListener('click', function(){
	formOpen.classList.remove('open');
});

function prov_form(obj){
	let name = obj.name.value;
	let email = obj.email.value;
	let message = obj.message.value;	

	let name_pattern = /[^(\w)|(\x7F-\xFF)|(\s)]/;
    let email_patern = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
    let message_pattern =  /\d\w{5,100}$/gm;

    var prov=name_pattern.test(name);
    var prov1=email_patern.test(email);
    var prov2=message_pattern.test(message);
    if (prov==true &&  prov1==true && prov2==true) {
          alert("Ваше сообщение отправлено");
    }
    else {
          alert("Введенные данные некорректны!");
    }
}
ymaps.ready(init);
    function init(){        
        var myMap = new ymaps.Map("map", {            
            center: [55.160902, 61.375282],           
            zoom: 15
        });
    }


//функция, которая проверяет может ли браузер отобразить webp
function testWebP(callback) {
	var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

if (support == true) {
         document.querySelector('body').classList.add('webp');
    }else{
      document.querySelector('body').classList.add('no-webp');
    }
});
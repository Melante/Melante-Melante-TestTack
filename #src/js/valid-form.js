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
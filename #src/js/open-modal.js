let button = document.querySelector('.footer__button');
let formOpen = document.querySelector('.modal-center');
let closeButton = formOpen.querySelector('.modal-close');
let body = document.querySelector('body');

button.addEventListener('click', function(evt){
	evt.preventDefault();
	formOpen.classList.add('open');
	body.style.overflow = "hidden";

});

closeButton.addEventListener('click', function(){
	formOpen.classList.remove('open');
	body.style.overflow = "visible";

});

formOpen.addEventListener('click', function(){
	formOpen.classList.remove('open');
	body.style.overflow = "visible";

});




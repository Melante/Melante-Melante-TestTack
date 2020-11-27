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

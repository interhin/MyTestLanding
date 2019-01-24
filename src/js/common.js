
$(function(){
    initializeVideo();
    responsiveFontAwesome();
    blogPostsHover();
    formValidation();
    wowInit();
});

function initializeVideo() {
    var video = document.querySelector('.c-video video'); // Само видео
    var videoContainer = document.querySelector('.c-video'); // Контейнер с видео и кнопками
    var playBut = document.querySelector('.controls .fa-play'); // Кнопка play
    var pauseBut = document.querySelector('.controls .fa-pause'); // Кнопка pause
    var canHide = false; // Флаг для того чтобы изначально не срабатывали события mouseenter/mouseleave


    // Исчезновение и появление кнопок play/pause
    videoContainer.addEventListener('mouseenter',function(){
        if (canHide) {
            setTimeout(showButs,0);
        }
    });

    videoContainer.addEventListener('mouseleave',function(){
        if (canHide) {
            setTimeout(hideButs,0); // 0 потому-что в debounce уже задана задержка
        }
    });


    // Обработка нажатий на play/pause
    playBut.addEventListener('click',function(){
        video.play();
        pauseBut.style.display = "block";
        playBut.style.display = "none";
        canHide = true;
    });
    
    pauseBut.addEventListener('click',function(){
        video.pause();
        pauseBut.style.display = "none";
        playBut.style.display = "block";
    });
    
    
    // Изначально пауза скрыта
    pauseBut.style.display = "none";


    // Стандартная реализация debounce
    function debounce(f,ms) {
        var timer = null;
        var savedThis;
        var savedArgs;
        return function() {
          savedThis = this;
          savedArgs = arguments;
          if (timer) clearTimeout(timer); // Если уже запущен таймер для функции, то останавливаем его.
          timer = setTimeout(function(){ // Запускаем новый таймер для последнего вызова функции
            f.apply(savedThis,savedArgs);
            timer = null; // Как только функция отработала очищаем таймер
          },ms);
        }
    }

    function showButs() {
        $('.controls').animate({"opacity":"1"},500);
    }
    function hideButs() {
        $('.controls').animate({"opacity":"0"},500);
    }

    hideButs = debounce(hideButs,500); // Убираем моргания кнопок в случае быстрого наведения и увода мышки с плеера
    // showButs выполняется сразу поэтому нет смысла применять на нее debounce
}

function responsiveFontAwesome() {
    var arrows = $(".slider-arrow");
    if (window.screen.width<600) {
        arrows.removeClass('fa-6x').addClass('fa-3x');
    }
}

function blogPostsHover() {
    var imgWrappers = document.querySelectorAll('.blogPosts_item__imgWrapper');

    for (var imgW of imgWrappers) {
        imgW.addEventListener('mouseenter',function() {
            var circles = this.querySelectorAll('.circle');
            var img = this.querySelector('img');
            img.style.filter = "blur(3px)";
            img.style.opacity = 0.7;
            for (var circle of circles) {
                circle.style.opacity = 1;
            }
        });
        imgW.addEventListener('mouseleave',function() {
            var circles = this.querySelectorAll('.circle');
            var img = this.querySelector('img');
            img.style.filter = "";
            img.style.opacity = 1;
            for (var circle of circles) {
                circle.style.opacity = 0;
            }
        });
    }
}

function formValidation() {
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
}

function wowInit() {
    new WOW().init();
}
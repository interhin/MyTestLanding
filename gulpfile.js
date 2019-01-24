var gulp         = require("gulp"), // gulp
    sass         = require("gulp-sass"), // sass
    browserSync  = require("browser-sync").create(), // Сервер для автообновления страницы
    concat       = require("gulp-concat"), // Слияние скриптов
    uglify       = require("gulp-uglifyjs"), // Минификация скрипта
    cssnano      = require("gulp-cssnano"), // Минификация CSS
    rename       = require("gulp-rename"), // Переименование файлов
    del          = require('del'), // Удаление директорий / файлов
    imagemin     = require('gulp-imagemin'), // Сжатие изображений
    pngquant     = require('imagemin-pngquant'), // Для сжатия PNG
    cache        = require('gulp-cache'), // Кэширование (в нашем случае для картинок)
    autoprefixer = require('gulp-autoprefixer'); // Авто расстановка префиксов для старых браузеров

var paths = new function() { // Пути

    this.src = 'src'; // Основная директория
    this.buildSrc = 'dist'; // Директория для production

    this.styles = { // Директория со стилями и Sass
        src:  this.src+'/sass/**/*.+(scss|sass)',
        dest: this.src+'/css/',
        cssSrc: this.src+"/css/**/*.css"
    };

    this.html = { // Директория с html файлами
        src:  this.src+'/*.html'
    };

    this.js = { // Директория со скриптами
        src:  this.src+'/js/**/*.js',
        dest: this.src+'/js/'
    };

    this.buildStyles = { // Путь стилей в production
        src:  this.buildSrc+'/css/',
    };

    this.buildJs = { // Путь скриптов в production
        src:  this.buildSrc+'/js/',
    };

    this.buildFonts = { // Путь шрифтов в production
        src:  this.buildSrc+'/fonts/',
    };

    this.buildImgs = { // Путь картинок в production
        src:  this.buildSrc+'/img/',
    };
}

gulp.task('clean',function(cb){
    del.sync(paths.buildSrc);
    cb(); // Костыль чтобы небыло лишних предупреждений
});

gulp.task('clearCache',function(){
    return cache.clearAll();
});

gulp.task('img',function(){
    return gulp.src(paths.src+'/img/**/*')
               .pipe(cache(imagemin({
                   interlaced: true,
                   progressive: true,
                   svgoPlugins: [{removeViewBox: false}],
                   use: [pngquant()]
               })))
               .pipe(gulp.dest(paths.buildImgs.src));
});

gulp.task('sass',function(){ // Компиляция Sass
    return gulp.src(paths.styles.src) // Берем Sass файлы
        .pipe(sass()) // Компилируем
        .pipe(autoprefixer(['last 15 versions','> 1%','ie 8','ie 7'], {cascade: true}))
        .pipe(gulp.dest(paths.styles.dest)) // Говорим куда сохранить CSS
        .pipe(browserSync.stream()); // Внесение изменений без обновления страницы
});

gulp.task('css-libs',gulp.series(function(){
    return gulp.src(paths.src+'/css/libs.css') // Берем не минифицированный libs.css
    .pipe(cssnano()) // Минифицируем его
    .pipe(rename({suffix:".min"})) // Добавляем к имени файла суффикс чтобы обозначить что он минифицирован
    .pipe(gulp.dest(paths.styles.dest)); // Указываем путь сохранения
}));

gulp.task('scripts',function(){
    return gulp.src([ // Список библиотек
        paths.src+'/libs/jquery/dist/jquery.min.js',
        paths.src+'/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        paths.src+'/libs/bootstrap/dist/js/bootstrap.min.js',
        paths.src+'/libs/wow/dist/wow.min.js'
    ]).pipe(concat('libs.min.js')) // Объединяем все библиотеки в одну
      .pipe(uglify()) // Сжимаем полученную библиотеку
      .pipe(gulp.dest(paths.js.dest)); // Указываем путь для сохранения
});

function browserSyncInit() {
    browserSync.init({ // Инициализация сервера
        server : {
            baseDir : paths.src // Основная директория
        },
        notify: false // Отключение уведомлений
    });
}

gulp.task('watch',function(){
    browserSyncInit();
    gulp.watch(paths.styles.src,gulp.series('sass')); // Подписка на автообновление для CSS
    gulp.watch(paths.html.src).on('change',browserSync.reload); // Подписка на автообновление для HTML
    gulp.watch(paths.js.src).on('change',browserSync.reload); // Подписка на автообновления для JS
});

gulp.task('build',gulp.series('clean','img','sass','scripts',function(cb){ // Формирование конечной версии для production
    var buildCss = gulp.src([
        paths.styles.dest+'libs.min.css',
        paths.styles.dest+'main.css'
    ])
                       .pipe(gulp.dest(paths.buildStyles.src));

    var buildFonts = gulp.src(paths.src+'/fonts/**/*')
                       .pipe(gulp.dest(paths.buildFonts.src));

    var buildJs = gulp.src(paths.js.src)
                       .pipe(gulp.dest(paths.buildJs.src));

    var buildHtml = gulp.src(paths.src+'/*.html')
                       .pipe(gulp.dest(paths.buildSrc));
    cb();
}));

gulp.task('default',gulp.series('css-libs','sass','scripts','watch'));



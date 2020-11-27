//У кого проблемы с плагином WEBPCSS нужно установить converter командой-npm install webp-converter@2.2.3 --save-dev
//указываем пути к папкам. Присваиваем папкам переменные, для того чтобы при зменении папок не искать их по всему gulp файлу.
let project_folder = require("path").basename(__dirname);//папка в которую выводится результат работы gulp/ Имеено эту папку выгружают на сервер или отдают заказчику. Папка будет иметь название проекта
let source_folder = "#src";//имя папки с исходниками

let fs = require('fs');

//path-содержит объекты, которые содержат различные пути к файлам и папкам
let path={
	build:{                                    //куда gulp выгружает обработанные файлы
		html:  project_folder + "/",           //html сразу в корне
		css:   project_folder + "/css/",       //сss файлы будут хранить в dist css
        js:    project_folder + "/js/",
        img:    project_folder + "/img/", 
       
	},
	src:{                                    //папка с исходниками
		html:  [source_folder + "/*.html", "!" + source_folder + "/_*.html"],          
		css:   source_folder + "/scss/style.scss",       
        js:    source_folder + "/js/*.js",
        img:    source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",//использовать расширения которые используются. ** - -переходим в любые подпапки
       
	},
	watch:{                                    //указываются пути к файлам, которые надо слущать постоянно. Улавливать их изменения и что то сразу выпонять. Слушать надо в исходной папке                                    
		html:  source_folder + "/**/*.html",   //** - переходим в любые подпапки *. - только определенное. В данном случае только html      
		css:   source_folder + "/scss/**/*.scss",       
        js:    source_folder + "/js/**/*.js",
        img:    source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",//использовать расширения которые используются 
        
	},
	//объект, который содержит путь к папке проекта. Этот объкт отвечает за удаление этой папки, когда запускается gupl
	clean:"./" + project_folder + "/"   
}

//пишем ряд переменных, которые помогут в написании сценария
let { src, dest } = require('gulp'),  //папкам src и dist присваивается сам gulp    
    gulp = require('gulp'),   //переменная gulp, которой присваиватся gulp для выполнения отдельных задач
    browsersync = require("browser-sync").create(),//обновление браузера при действиях
    fileinclude = require("gulp-file-include"),//шаблонизатор. Например для header или footer
    del = require("del"),//удаляет папку dist и создает ее только с теми файлами с которыми мы работаем 
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),//добавляет автопрефиксы к стилям
    group_media = require("gulp-group-css-media-queries"),//собирает медиа запросы по всему файлу и помещает их в конец css файла
    clean_css = require("gulp-clean-css"),//чистит и сжимает css файл, но его неудобно читать
    rename = require("gulp-rename"),//переименовываем сжатый файл
    uglify = require("gulp-uglify-es").default,//оптимизирует js файд
    imagemin = require("gulp-imagemin"),//оптимизирует image
    webp = require("gulp-webp"), //конвертирует в webp
    webphtml = require("gulp-webp-html"), //интегрирует webp в html
    webpcss = require("gulp-webpcss"),//интегрирует webp в css
    svgSprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"), //конвертируем шрифты
    fonter = require("gulp-fonter");


    //функция для обновления нашей страницы
    function browserSync(params){
    	browsersync.init({
    		server:{                 //настраиваеи сервер
    			baseDir: "./" + project_folder + "/"   //указываем базовую папку(выше объкт который содержит путь к папке)
    		},
    		port: 3000,         //настройки порта. Обычно он 3000
    		notify: false       // по умолчанию выскакивает табличка, что браузер обновился. Убираем ее
    	})
    }

 //функция для работы с html файлом
 function html(){
 	return src(path.src.html)
 	    .pipe(fileinclude())
        .pipe(webphtml())
 	    .pipe(dest(path.build.html))
 	    .pipe(browsersync.stream())
 }

 //функция для работы со стилями
 function css(){
 	return src(path.src.css)
 	    .pipe(
 	    	scss({
 	    		outputStyle: "expanded"
 	    	})
 	    )        
        .pipe(
            group_media()            
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist:["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss())
        .pipe(dest(path.build.css))//здесь выгрузка не сжатого css файла
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
 	    .pipe(dest(path.build.css))
 	    .pipe(browsersync.stream())
 }

 //функция сборки js
 function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
 }

 //функция сборки image
 function images(){
    return src(path.src.img)
        .pipe(
            webp({
               quality: 70 // качество изображения.Надо балансировать
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}], //работа с svg
                interlaced: true,
                optimizationLevel: 3 // 0 to 7 как сильно хотим сжать изображение. Здесь надо искать баланс.
            })
         )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
 }



 //Функция для отслеживания действий
 function wathFiles(params){
 	gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
 }

//функция для очистки папки dest
function clean(params){
	return del(path.clean);
}

//проверяем работоспособность
let build = gulp.series(clean,  gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, wathFiles, browserSync); //сценарии выполненияя

//подружим gulp с новыми переменными

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default =  watch;
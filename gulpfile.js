var gulp = require('gulp');
//生成sass行数
var sass = require('gulp-sass');
//自动刷新页面
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//更改提醒 
var notify = require('gulp-notify');
//压缩css代码 减小文件大小
var minify = require('gulp-minify-css');
//压缩js代码 减小文件大小
var uglify = require('gulp-uglify');
//文件重命名 
var rename = require('gulp-rename');
//合并js文件 减少网络请求
var concat = require('gulp-concat')
//校验js代码 
var jshint = require('gulp-jshint');
//生成sass文件的映射文件
var sourcemaps = require('gulp-sourcemaps');



//静态服务器 
gulp.task('serve',function(){
	browserSync.init({
		server:'./'
	});
	gulp.watch(['*.*','assets/html/*.html','assets/css/*.css','assets/js/*.js']).on('change',reload);
});

gulp.task('notify',function(){
	return gulp.src('./')
	.pipe(notify({message:'notify task complete!'}))
});

// 压缩css任务
gulp.task('minify',function(){
	return gulp.src('dev/scss/*.scss')
	//初始化
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(rename({suffix:'.min'}))
	.pipe(minify())
	//生成map文件
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('assets/css'))
})

// 校验并压缩和合并js代码
gulp.task('uglify',function(){
	return gulp.src('dev/js/*.js')
	//校验js代码
	//.pipe(jshint())
	//.pipe(jshint.reporter('default'))
	//合并js代码
	.pipe(concat('app.js'))
	//重命名js文件
	.pipe(rename({suffix:'.min'}))
	//压缩js代码
	.pipe(uglify())
	//输出目录
	.pipe(gulp.dest('assets/js'))
	.pipe(notify({message:'js task complete!'}))

})

gulp.task('default',function(){
	gulp.start('serve','minify','uglify');
})



# immoc

> 商城系统

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 实战心得

### 路由

+ 路由和单文件组件是分开的:单文件组件通过component嵌套,在上面你可以通过router-link设置跳转路径，

  vue会根据路径去查找该路径及其所对应的组件(如果路由有参数,会先渲染该组件在插入到父组件中)如果是一级路由则渲染到一级vue的router-view上,二级则渲染到二级的router-view上，以此类推.

+ 动态路由是根据:变量来设置变量所以接收也要用$route.params.变量名，但是**$router.push**(路径?id=4)则是根据对象来传的所以使用**$route.query**.变量名，**在vue中使用$route,在js中使用$router**

  

+ 跳转几种写法:

  ```javascript
  <router-link to='/cart'>                      //使用标签属性跳转
  this.$router.push('/cart?id=123')    //通过变成跳转
  this.$router.push({
      path：'/cart?id=123'
  })
  :to="{name:'cart',params:{id:456}}   //通过路由的name进行跳转注意参数是动态路由参数,to是动态属性，使用params必须有name属性不然无法接受params
  ```

+ ```html
  <!--根据路由名称来渲染视图并且可以像路由组件传递属性-->
  <router-view name='title' :seller="seller"></router-view>   
  ```

### 跨域

```javascript
//跨域的解决方法
proxyTable: {
      //解决跨域
      //截取/goods的请求转发到3000端口当前为8080
      '/goods':{
        target:'http://localhost:3000'
      }
    }
```

### axios

[详情](https://blog.csdn.net/qq383366204/article/details/80268007)

```javascript
//delete与post,put不同需要将参数放入data中,接收res.body
axios.delete(url,{data:{k:v}})
//get要使用params传参,接收使用res.query
axios.get(url,{params:{k:v}})
//post和put一样,将数据直接作为第二参数，接收res.body
axios.post(url,{k:v})
axios.put(url,{k:v})
```



### 异步请求

### KOA

+ **koa重定向 koa.redirect(url)，重定向再次发出请求的类型是GET**

+ koa.ctx.state  用于保存全局变量，包括中间件和模板引擎变量共享

+ koa 初始化时是不执行中间件的，发送请求是就会挨个执行中间件知道没有next()在挨个返回

+ await  next() 和 return next()都会使得后面的中间件异步函数同步执行，唯一区别return next()自身后面

  的代码就不会执行了

+ next只会同步执行自己前面的异步，到下一层中间件出现异步会跳过异步，如果异步设置了await则会跳过异步开始后的所有代码，所以如果后面中间件出现异步函数不要用next()不然会出现奇奇怪怪错误

+ ctx.body是ctx.response.body简写 和ctx.request.body不同他需要安装body-paeser才行

+ 在express中

  ```javascript
  //url的域名/static会被映射到项目里__dirname+/public
  app.use('/static', express.static(__dirname + '/public'));
  //url的域名/会被映射到项目里__dirname+/public
  app.use( express.static(__dirname + '/public'));
  ```

  在koa中需要额外下载koa-static插件来实现静态资源开放道理类似

  ```javascript
  //url的域名/会被映射到项目里__dirname+/public
  app.use(require('koa-static')(root, opts));
  ```

+ ctx.header ctx.headers 两个一样返回请求头

+ ctx.href 返回完整路径包括query参数

+ app.use(middleware) middleware是一个函数，需要加上next()以便让后面中间件执行

  ```
  XMLHttpRequest cannot load https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9a5ae39ece420bf…&response_type=code&scope=snsapi_userinfo&state=fromWechat#wechat_redirect. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://pxk.free.idcfengye.com' is therefore not allowed access.
  ```

  





### ES6

+ try catch 后面的代码也会执行即使出现错误

+ encodeURI和encodeURIComponent

  encodeURI只会对URL的空格进行编码，encodeURIComponent则会对许多特殊字符进行编码，常常被用在编码URL的query变量中因为这些变量如果含有除数字字母等特殊字符直接传输会丢失所以不加上encodeURIComponent编码，因为一般只加在query的value值上所以这是Component的含义

+ join()默认分隔符是,而不是""

+ sort()默认从小到大排序

+ ""为空白字符，{}和[]不是

+ class里面函数不需要加function,但是里一般函数是要声明的除非使用箭头函数

+ 立即执行函数的前面必须要有分号

  ```javascript
  (function(){alert("1")})();
  (function(){alert("2")})()
  ```

+ join和resolve

  ```javascript
  path.join('/a', '/b') // Outputs '/a/b'
  path.resolve('/a', '/b') // Outputs '/b'
  path.join("a", "b1", "..", "b2") // a/b2
  path.resolve("a", "b1", "..", "b2") // C:\\Users\\pxk\\a\\b2
  ```

+ Date

  格式: 

  默认格式

  + toString(正常new Date()输出格式) Mon Aug 26 2019 12:14:15 GMT+0800 (中国标准时间)

  UTC格式

  + toUTCString（UTC 格式） Mon, 26 Aug 2019 03:48:55 GMT

  toTimeString  12:02:59 GMT+0800 (中国标准时间)  转换时分秒

  Local格式

  + toLocaleDateString 2019/8/26   转换年月日

  + toLocaleString 2019/8/26 下午12:28:34
  + toLocaleTimeString 下午7:25:20

  ISO格式

  + toISOString(ISO格式)/toJSON 2019-08-26T04:11:40.444Z

  初始化方法:

  + new Date()
  + new Date(milllseconds)   距离1970.1.1的毫秒数
  + new Date(datestring)
  + new Date(year,month,date,hour,minute,second,millsecond)

  注意Date中的month是从0开始的，0代表一月

  获取参数(返回都是数字不是字符串):

  +  getFullYear
  
+  getMonth
  
  +  getHours
  
+  getMinutes
  
  +  getSeconds
  
+  getMillSeconds
  
+  Math.floor((this.getMonth()+3)/3)  获取季度
  
+ RegExp（检验符合条件的字符串，必要时可以获取满足条件的子串）

  + 一种是字面量一种是构造函数来表现正则

    + /pattern/flag
    + new RegExp('pattern','flag')

    pattern 是正则表达式本体，flag代表匹配的方式，比如g表示全局匹配，找出所有，i是忽略大小写

     两者的区别在于new RegExp运行时才编译，而字面量之前就编译完毕，然后字面量不需要引号，而RegExp需要引号而且有时还需要转义

  + 语法

    /d   匹配任意连续个数阿拉伯数字

    /w  匹配任意连续个数的数字或字母

    /s   匹配一个空白字符

    /S /D /W  上述规则取反

    . 匹配出空白字符的所有单个字符

    [abc]  匹配abc的其中单个字符

    (x) 匹配x并获取符合条件的字符串，可以通过$n或者[n]进行访问,但是如果不需要对匹配到的字符串进行操作知识简单判断是否匹配还是不要用()因为会带来性能的损耗，

    x+ 匹配一次或多次

    x* 匹配0次和多次

    x? 匹配0次或者1次  ？还可以作用到x+和x*上面，使得匹配变成非贪婪，正常会匹配更长的子串，加上?匹配到第一次就作为结果

    x(?=y)  匹配一个x,这个x后面必须跟着y

    x(?!y) 匹配一个x，这个x必须后面不跟着y

    x{n,m} 匹配连续的x,最少出现n次，最多出现m次，原则是你出现多少在我的容量下我都会匹配

    x{n}   匹配连续x出现必须n次

    x{n,}  匹配连续的x大于等于n次就可以了

    /^x/ 以x开头[^]*跳过所有包括换行符比\.\*强大\[^abc] 表示不匹配abc

  + 方法

    + 正则.test(字符串)  检验字符串是否能够匹配，返回正负

    + 正则.exec(字符串)  字符串.match(正则)  返回匹配的字符串，**结果放在数组0下标下**

      **剩余的用来存放正则中可能出现的()所匹配到的字符串**

+ foreach无法修改数组，遍历数组使用of不要用in,in代表数组下标

+ spread

  ```javascript
  [...arr1,...arr2] //数组拼接
  [a,b,c]="str"  //字符串拆分  a=s b=t c=r
  console.log(...[4,8]) //输出4 8而不是数组
  [a,...b]=[4,8,8,9]  //解构赋值
  {...{a:1,b:2}}={a:1,b:2}
  [...new Set([1,2,2,3,3])]  //去重
  //解构一般外面需要嵌套{},[]但是如果作为实参则不需要
  //则会将数组解构成两个对象分别传入c函数的两个新参中
  c(...[{a:1,b:2},{c:3,d:4}])
  //函数定义中的...是将实参组装成args数组，调用时使用是拆分实参
  function c(...args)
  ```

+ promise

  ```javascript
  const p =new Promise(resolve=>{
     let u = 1             //立即执行函数
     setTimeout(()=>{
         //模拟异步函数,3s后执行
        if (u===1) resolve(4)  //可异步函数执行的回调，可以通过resolve直接将回调结果4拿到最外面来
        resolve(5)   //promise遇到第一个resolve状态就被改变后面的resolve不起作用但代码还是会执行
     },3000)
  })
  ```

+ export,import

  ```javascript
  //ES6
  export default {}    import name from 'path'  //name={}
  export default function(){} import name from 'path'
  //函数和类本身就有名字所以就不用let额外定义了
  export function FunctionName(){} import {FunctionName} from 'path'
  export class ClassName {} import {ClassName} from 'path'
  export let x={}       import {x} from 'path'    //{x}={x:{}}1 解构赋值两者的key必须相同
  export let x={} export let y={} import * as util from 'path' //util={x:{},y:{}} 重新组装成一个对象
  //common.js
  //module.exports和exports只能选一个，谁先在前导出谁后者的导出形式无效
  module.exports={key:value}    name=require('path')或者{key}=require('path')直接拿到value
  exports.x={}    {x}=require('path')或者name=require('path') name.x为所取得值
  
  ```

+ requirejs(AMD),seajs(CMD),commonjs(node),ES6(import/export)

  + requirejs属于异步加载模块

  + seajs属于同步加载

  + commonjs只能用于后端

  + ES6官方的模块加载

    

+ Vue实例的写法

  ```javascript
  new Vue({
    render: h => h(App),  //render为Vue底层渲染方法
  }).$mount('#app')
  //等价于
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
  ```

+ Vue的模块引用

  ```html
  import '@/assets/css/product.css'   //在.vue文件中引用css文件
  import NavBread from '@/components/NavBread' //在.vue为文件中引用.vue文件
  import axios from 'axios' //加载node_modules包不需要写路径
  ```

+ Vue的插槽

  ```javascrip
  父组件文件:
  <子组件>
  	<template v-slot:666>
  	子组件填充物 （虽然是填充到子组件中这里能使用的为父组件方法和属性而不是子组件）
  	</template>
  </子组件>
  
  子组件文件:
  <slot name="666"></slot>
  ```

+ Vue的class绑定只能绑定动态不能将静态和动态进行拼接，静态的class直接用属性，动态的class使用:class

  ```html
  <div class="filter" :class="filterby?'filterby-show':'stopPop'" id="filter">
  <!--filter静态,filterby动态-->
      
  ```

+ Vue中每次通过前端先改变视图，再到数据库保存，而不是先去保存再取出来渲染，后者会使渲染速度变慢，降低体验

+ Vue实例属性

  filter:一般用来格式化数据data| 格式化数据方法(他放在过滤器中)

  mounted：第一次渲染调用的方法

  computed:计算属性需要return

+ Vue 完成全选思路

  一般将全选按钮作为计算属性由其他选项框的选中计算得到，对于表单类型的选中框，可以设置get,set的计算属性方法,get用来计算得到全选属性，set用来设置改变全选状态时候，现将上面选框设置为false在通过get来得到属性，但set触发依赖于v-model的双向绑定，如果不是表单控件要另外写一个点击事件来修改上述所有子选框状态然后通过计算属性间接修改它的值，最后存入数据库

+ Vue父组件可以动态传参，也可以传静态数据给子组件，组组件可以隐藏显示，子组件的自定义标签不能作为选择器使用

+ Vue只能监控已有数据更新，新增属性要通过Vue.set加入Vue的管理才能被监控

+ Vue通过$ref.方法名实现父元素访问子组件的方法，这样可以有效解决兄弟节点通行问题

+ Vue的el就是DOM元素，DOM元素都可以使用getElment方法并不只有document才能用还有childNode可以查找子结点，children为jq方法,[详情点击](https://www.cnblogs.com/zizaiwuyou/p/find_dom.html)

+ Vue的transition记得在所有执行过渡中加入transform不然不会执行，子元素也要加，另外可以将transition标签加到v-for内部子元素来避免使用transition-group标签

+ Vue可以使用@click.stop.prevent=myfunction来阻止myfunction默认事件

+ 计算属性中不能修改所有this.变量的变量，需要使用watch实现

+ Vue的$emit只能传到最近父节点若要传到爷爷节点则需要在父节点中继续调用$emit

+ Vue的template只能访问export default{}中的变量定义在script内部但在导出对象外部的访问不到

+ Vue的webpack配置

  ```
  //webpack的配置
  module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
      app: './src/main.js'
    },
    //publicPath静态请求绝对路径
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    //后缀名和别名
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },
    module: {
      rules: [
        //config.dev.useEslint为true就把语法检查引进来
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            //base64
            limit: 10000,
            //生成文件名/static/ig/name.hash.ext
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
         },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
  
  ```

  

### MongoDB

+ 安装

  4.0版本不需要配置，他会自动配置data和log文件并开启服务(不用手动mongod开启)，配置文件在bin目录下

  的mongod.cfg

+ 语法

  ```shell
  ##想dbname数据库的collectionname导入数据文件内容为filepath,注意必须退出mongo才能操作
  mongoimport -d dbname -u collectionname --file  filepath 
  mongo  ##使用命令行
  ##创建管理员，名字为myUserAdmin，密码abc123，拥有角色userAdminAnyDatabase(admin数据库的所有权)和readWriteAnyDatabase(对所有数据库读写)
  use admin
  db.createUser(
    {
      user: "myUserAdmin",
      pwd: "abc123",
      roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    }
  )
  show dbs ##展示所有数据库
  use dbname ##新建数据库
  db.dropDatabase() ##删除当前数据库
  db.createCollection("user")  ##创建一个集合(表)user
  show collections    ##显示当前数据库的所有表
  db.collectionname.drop()  ##删除当前数据库中名为collectionname的集合
  db.collectionname.insert({}) ##插入对象数据
  db.collectionname.find().pretty()  ##查找所有数据并格式化
  db.collectionname.findOne()  ##查询第一条数据
  ##更新数据，不设置参数只会更新第一条匹配数据
  ##upsert : 可选，这个参数的意思是，如果不存在update的记录，则将该查询条件作为新增的document来插入，默认是false，不插入。
  ##multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新
  ##不使用set更新相当于匹配的所有文档整个替换替换成class:{name:"tixudao",num:20}
  db.user.update({userName:"panxiakai"},{class:{name:"tixudao",num:20}})
  db.user.update({userName:"panxiakai"},{$set:{class:{name:"tixudao",num:20}}})
  ##匹配所有记录,multi默认为false,$inc匹配的字段加3，这里所有的age都加3
  ##当然也可以直接使用updateMany
  db.students.update({},{$inc:{"age": 3}},{"multi":true})
  
  ##匹配name为33的记录并把他的hobbies字段删除
  db.students.update({"name":"33"},{$inc:{"age": 3},$unset:{"hobbies":""}})
  ##修改name为33的记录字段名hobbies为哈哈
  db.students.update({"name":"33"},{$inc:{"age": 3},$set:{"hobbies":"哈哈"}})
  ##upsert 如果找不到name为潘夏开的文档就插入name:'潘夏开'，age:3这条记录
  db.students.update({"name":"潘夏开"},{$inc:{"age": 3}},{"upsert":true})
  ##$pull
  db.students.update({name:"22"},{$pull:{"list": 6}}) ##删除list字段中指定的数组元素所有6
  ##$pop
  db.students.update({name:"22"},{$pop:{"list": 1}}) ##删除list中的最后一个元素
  db.students.update({name:"22"},{$pop:{"list": -1}}) ##删除list中的第一个元素
  ##在list字段类型维数组，push表示在数组中追加元素，这里在末尾添加了888这个元素
  db.students.update({name:"22"},{$push:{"list": 888}})
  db.user.find({userName:"John"}).pretty() ##查询userName为John的记录
  db.user.find({userAge:{$gt:20}}).pretty() ##查询年龄大于20的记录
  ##多条件使用逗号分割，删选年纪小于20且班级名称为ioc的记录
  db.user.find({userAge:{$lt:20},"class.name":"ioc"}).pretty() 
  db.user.remove({userAge:28})  ##删除年龄为28的记录
  ##$where必须使用函数或者字符串
  db.category.find({$where:function(){return this.movie && this.movie.length>0}})
  ##跳过两个取6个
  db.students.aggregate([{$skip:2},{$limit:6}])
  ##输出固定字段
  db.students.select('field')
  ```

+ Mongoose

  https://www.cnblogs.com/code_fbi/p/5219670.html

  + Mongoose 的save是存储文档

    > ```javascript
    > //tank是model 可以向Model里面加字段属性不过字段必须在Schema定义不然无效
    > //生成document就可以调用save,document可以查询出来修改保存，也可以根据Model新建保存
    > var small = new Tank({ size: 'small' });
    > small.save(function (err) {
    >   if (err) return handleError(err);
    >   // saved!
    > });
    > //其中docs和a是等价的一个改变另一个也可以改变
    > query.exec((err,docs)=>{a=docs})
    > query.then((docs)=>{})
    > //返回指定名字字段
    > query.select(name) 
    > //对Token表进行保存前所执行的钩子函数注意不要使用用箭头next的回调中this代表将要插入的文档数据
    > TokenSchema.pre('save', function (next) {})
    > //定义静态方法不过Model的声明要放在静态方法之后，不然生成的Model将不包含静态方法
    > //使用Model才能调用
    > TokenSchema.statics = {}
    > //定义实体方法，需要Model实例化成具体的documnet才能调用
    > UserSchema.methods = {}
    > //可以只通过name获得已经声明过的model,这样就避免在进行导出和导入操作
    > var x = mongoose.model(name)
    > //document加入schema以外的属性是不可见的但是可以取到
    > //类似于计算属性但不存数据库，实时监控根据数据库某些字段运算得到值
    > UserSchema.virtual('islocked').get(function(){}
    > //保存前的钩子函数，里面的this指向要保存的document，不过如果内部还有第三方回调(如加密)则需要暂时保存this,记得要调用next()不然保存方法不执行
    > UserSchema.pre('save', function(next) {}
    > //ScnhemaType中对象类型使用OjectId表示
    > new Schema({ driver: ObjectId });
    > //delete和remove是一样的都不会触发中间件都用于删除文档
    > //mongoose的表连接
    > const personSchema = Schema({
    >   _id: Schema.Types.ObjectId,
    >   name: String,
    >   age: Number,
    >   stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
    > });
    > //一个personSchema 有多个story ，ref指向mongoose.model(name,schema)中的name
    > //这里表示一对多关系，stories存储的是另一张表的id
    > Story.findOne({ title: 'Casino Royale' }).populate('stories','name').
    > //populate会从stores中的id集合中去story寻找相同ID的数据取出来，这里还设置了name表示只获取name值，那么将得到的name值数组替换掉原来的id数组实现表连接，‘name’省略会拿出所有字段来替换id
    > ```

  + **findOne与find前者返回document后者为document数组(即便是一个，前端得到需要加上[0])**

  

  ```javascript
  
  ```

+ express

  ```javascript
  parseInt(req.param('pageSize'))  //获取到的参数都是字符串
  utl.parse(req.url,true).pageSize  //原生实现
  res.json({})//只是相应请求后序代码还会执行所以要return才行
  //取参数一律req,res可以查看到参数但是无法获取
  req.params
  req.body 
  //express只提供了cookie并没有提供session,若要使用必须使用插件
  res.cookie
  //对于next()会执行到下一个中间件执行完会返回执行next()后面代码所以如果不想在执行后面代码可以使用
  //return next()
  return next()
  ```

+ Vuex

+ state  全局数据,store内部访问里面变量需加上state，根组件或者单例访问加上store(store.state.count)，子组件访问this.$store.state.count，并将store置入到Vue实例中

+ getters 对全局数据state派生出来的数据，可以理解为计算属性，访问方式和state一样只不过把state改成getters(this.$store.getters.modeifyCount)，无法修改

+ mutations 修改state全局变量，在外部使用store.commit('方法名',参数)调用

+ actions 由于mutations 只能同步,actions可以在对他封装加入一些异步操作,调用store.dispatch(方法名,参数)

  即外部调用dispatch=>store对象的actions的方法，该方法调用commit(mutations方法)=>mutations的方法

  =>修改state=>重新渲染

+ modules 用于划分模块，对于大型项目有用

```html
<div id='app'>
    <span>{{num}}</span>
    <button @click='add'>点击加一</button>
    <button @click='sub'>点击减一</button>
    <son-component>
    </son-component>
</div>


    <script>
        const sonComponent={
            template:`<div>
                count={{times}}
                count*2={{doubleCount}}
                </div>`,
            computed:{
                times(){
                    return this.$store.state.count;
                },
                doubleCount(){
                    return this.$store.getters.modeifyCount;
                }

            }
        }
        const store=new Vuex.Store({
            state:{
                count:0,
            },
            getters:{
                modeifyCount(state){return state.count*2}
            },
            mutations:{
                increment(state){
                    state.count++;
                },
                reduction(state){
                    state.count--
                }
                
            },
            actions:{
                reduction(context){
                    context.commit({
                        type:'reduction'
                    })
                }
            }
        })
        new Vue({
            el:'#app',
            computed:{
                num(){return store.state.count}
            },
            store,
            methods:{
                add(){
                   store.commit('increment');
                },
                sub(){
                    store.dispatch('reduction');
                }

            },
            components:{
                sonComponent
            }
        })
        
    </script>
```

### Pug

+ a 标签的target属性表示怎么样打开连接，_blank表示新开个窗口打开，_self在当前窗口打开(默认)

+ radio和check中的标签中的checked和js中的checked不是一个东西，标签中加了checked就是选中除非移除

  被叫做attribute而js拿到DOM后的checked则可以通过设置true，false来控制

+ |用来消除空格也可以用来输出无标签的文本| #{comments.}，不过要有缩进,td: a 表示td下面的a,这是不使用缩进方式表现子孩子

+ if for也必须要有缩进

+ -来标记js代码

  ```javascript
  //state用于存储Pug的全局变量这里吧session.user设为全局所以以后就不需要请求user了
  ctx.state = Object.assign(ctx.state,{user:ctx.session.user})
  ```

+ ```html
  <--!点击啥都不执行超链接-->
  <a href='javascript:;'></a>
  ```

+ 

### Jquery

+ ```javascript
  <div data-test="this is test" ></div>
  $("div").data("test"); //this is test!;要加上引号不然读取的值是对象
  $(DOM元素或者选择器)
  $(form).serialize() //将表单虚拟化
  ```



### Webpack

+ loader
  + css-loader css
  + sass-loader/less-loader/node-sass   sass/less/stylus
  + file-loader/url-loader   图片文件
  + postcss-loader autoprefixer   前缀

+ plugin
  + html-webpack-plugin
  + extract-text-webpack-plugin
  + UglifyJsPlugin
  + CommonsChunkplugin
  + clean-webpack-plugin
  + copy-webpack-plugin







### 插件

1. vue-lazyloader   页面懒加载

2. vue-infinite-scroll 图片滚动加载

3. pm2  开进程执行web服务

   ```shell
   pm2 start 服务名
   pm2 list
   ```

4. [价格格式化插件](https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/currency.js)

5. better-scroll  移动端无滚动条滑动

6. glob 获取指定模式的所有文件

7. request-promise 封装request请求并返回promise

8. raw-body 

9. xml2js  解析xml

10. sha1  进行加密

11. koa-router koa的路由

12. koa-views koa配置模板引擎中间件（调用render加载html页面）

13. moment 时间库，用于格式化(放入koa-view使得pug能使用moment进行格式化)

14. pug 模板引擎

15. bcrypt 密码加密 （依赖于node-pre-gyp这个下载插件）

16. koa-bodyParser koa-session

17. koa-body  **可以用于文件上传和POST数据解析，不过文件上传标签的name必须是file**

18. koa-static 开放静态文件

19. standard，husky，snazzy （代码风格检查,Git提交检查，命令行结果高亮显示）



























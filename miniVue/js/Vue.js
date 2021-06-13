class Vue {
  constructor(options){
    // 1. 通属性保存选项的属性
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成getter和setter，注入到vue实例中
    this._proxyData(this.$data)
    // 3. 调用Observer对象，监听数据变化
    new Observer(this.$data)
    // 4. 调用Compiler对象，解析指令和差值表达式
    new Compile(this)
  }

  _proxyData(data){
    // 遍历data中的所有属性
    Object.keys(data).forEach(key=>{
      Object.defineProperty(this,key,{
        enumerable: true,
        configurable: true,
        get(){
          return data[key] // 触发Observer.defineReactive中的get
        },
        set(newValue){
          if(newValue == data[key]){
            return
          }
          data[key] = newValue;
        }
      })
    })
  }
}
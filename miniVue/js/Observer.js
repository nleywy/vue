class Observer {
  constructor(data){
    this.walk(data);
  }

  // 如果是对象，遍历对象的所有属性
  walk(data){
    // 1. 判断data是否是对象
    if(!data || typeof data != 'object'){
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key=>{
      this.defineReactive(data,key,data[key])
    })
  }

  // 调用Object.defineProperty把对象转换成get/set
  defineReactive(obj,key,val){
    // 注意2：如果值是一个对象，把对象的属性也变成响应式
    this.walk(val)
    const _this = this;

    // 收集依赖，并发送通知
    let dep = new Dep();


    Object.defineProperty(obj,key,{ // 真正监听$data中的数据的变化
      enumerable: true,
      configurable: true,
      get(){ // 注意1：此处要使用传入的val，不能使用obj[key],每次使用obj[key]，相当于每次都获取key，每次都会触发get形成死递归循环。此处还使用了闭包
        // return obj[key]

        Dep.target && dep.addSub(Dep.target)

        return val
      },
      set(newValue){
        if(newValue == val){
          return
        }
        val = newValue;
        _this.walk(newValue) // 注意3：对于新赋值的值(设置为对象)设置响应式

        // 发送通知
        dep.notify()
      }
    })
  }
}
/*
*/
class Watcher {
  constructor(vm,key,cb){
    this.vm = vm;

    // data中的属性名称
    this.key = key;

    // 回调函数负责更新视图
    this.cb = cb;
    
    // 创建watcher的时候，把watcher对象添加到Dep.subs数组中
    // 把当前Watcher对象添加到Dep.target
    Dep.target = this;
    this.oldValue = vm[key]; // 会触发Observer defineReative的get方法，就会把这个Watcher对象添加到Dep.subs
    Dep.target = null; // 防止重复添加
  }

  // 当数据发生变化的时候更新视图
  update(){
    let newValue = this.vm[this.key]
    if(this.oldValue === newValue){
      return
    }
    this.cb && this.cb(newValue)
  }
}
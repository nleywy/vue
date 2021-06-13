/*
 Dep收集依赖 在Observer的get方法中收集依赖，每一个响应式的属性(get)都会创建一个dep对象，负责收集依赖于该属性的地方
 所有依赖于该属性的地方都会创建一个watcher对象，所以dep对象收集的是所有依赖于该属性的watcher对象。
 
 Observer的set方法通知依赖，当属性的值变化的时候，会调用Dep的notify方法发送通知调用watcher的update方法。

 所以Dep的作用是在get中收集依赖添加观察者，在set中通知依赖。

 */

class Dep {
  constructor(){
    this.subs = []
  }

  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub)
    }
  }

  notify(){
    this.subs.forEach((sub)=>{
      sub.update()
    })
  }
}
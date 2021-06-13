class Compile {
  constructor(vm){
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }
  // 编译模板 处理文本节点和元素节点
  compile(el){ // el中所有中的节点
    // el.children 是所有的元素 childNodes 是所有的节点
    let childNodes = el.childNodes; // 仅仅是第一层子节点
    Array.from(childNodes).forEach(node=>{
      if(this.isTextNode(node)){
        this.compileText(node)
      }else if(this.isElementNode(node)){
        this.compileElement(node)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if(node.childNodes && node.childNodes.length){
        this.compile(node)
      }
    })

  }

  // 编译元素节点 处理指令v-text v-model
  compileElement (node){
    let attributes = node.attributes;
    Array.from(attributes).forEach(attr=>{
      let {name: attrName,value: key} = attr;
      
      if(this.isDirective(attrName)){
        attrName = attrName.substr(2);
        this.update(node,key,attrName)
      }
    })
  }

  update(node,key,attrName){
    let upDataFn = this[attrName+'Updater']
    // upDataFn && upDataFn(node,key,this.vm[key])
    // 此时的this并不是Compile的实例，如果是this.textUpdater这种调用方式，this为Compile的实例
    upDataFn && upDataFn.call(this,node,key,this.vm[key])
    // this.vm[key]触发的是Vue._proxyData中的get会触发Observer.defineReactive中的get，但是不会添加到Deps.subs中，因为Dep.target不存在
  }

  // 处理v-text指令
  textUpdater(node,key,value){
    node.textContent = value
    new Watcher(this.vm,key,(newValue)=>{
      node.textContent = newValue
    })
  }

  // 处理v-model指令
  modelUpdater(node,key,value){
    node.value = value
    new Watcher(this.vm,key,(newValue)=>{
      node.value = newValue
    })

    // 双向绑定
    node.addEventListener('input',()=>{
      // 此时会触发响应式机制，数据变化会更新视图
      this.vm[key] = node.value;
    })
  }

  // 编译文本节点，处理差值表达式 {{}}
  compileText(node){
    // {{ msg }}
    let reg = /\{\{(.+?)\}\}/g;
    let value = node.textContent;
    let key;
    value.replace(reg,($0,$1) => {
      key = $1.trim();
      node.textContent = this.vm[key]; // 触发的是Vue._proxyData中的get会触发Observer.defineReactive中的get，但是不会添加到Dep.subs中，因为Dep.target不存在

      // 创建Watcher对象 在watcher构造函数中，获取oldVlue的时候 才会被添加到Dep.subs中
      new Watcher(this.vm, key, (newValue)=>{
        node.textContent = newValue;
      })
    })
  }

  // 判断元素属性是否是指令
  isDirective(attrName){
    return attrName.startsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode(node){
    return node.nodeType === 3
  }

  // 判断节点是够是元素节点
  isElementNode(node){
    return node.nodeType === 1
  }
}
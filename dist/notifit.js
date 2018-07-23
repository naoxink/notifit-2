/*
 * notifIt2 - @naoxink
 */

var notif = function(options){

  function _notif(options){
    var _this = this

    _this.addClass = function(el, cl){
      if(el.classList){
        el.classList.add(cl)
      }else{
        el.className += ' ' + cl
      }
      return el
    }

    // Methods
    _this.newNotifID = function(){
      return 'notifit-' + Date.now()
    } // newNotifID

    _this.init = function(){
      _this.id = _this.newNotifID()
      _this.availablePositions = ['left', 'center', 'right', 'bottom']
      _this.config = Object.assign({
        'type': 'default',
        'position': 'right',
        'msg': 'This is my default message',
        'opacity': 1,
        'zindex': null,
        'callback': null,
        'clickable': false
      }, options)
      if(_this.availablePositions.indexOf(_this.config.position) === -1){
        _this.config.position = 'right'
      }
      _this.createNotification()
    } // init

    _this.createCloseButton = function(){
      var btn = document.createElement('span')
      _this.addClass(btn, 'notifit-close')
      btn.innerHTML = '&times;'
      _this.dismissOnClick(btn)
      return btn
    } // createCloseButton

    _this.addStyles = function(el, styles){
      for(var key in styles){
        el.style[key] = styles[key]
      }
      return el
    } // addStyles

    _this.setPosition = function(){
      var styles = {  }
      var notificationWidth = parseFloat(window.getComputedStyle(_this.notification).getPropertyValue('width'))
      var documentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if(_this.config.position === 'center'){
        styles.left =  parseInt((documentWidth / 2) - (notificationWidth / 2), 10) + 'px'
      }else{
        styles[_this.config.position] = 10 + 'px'
      }
      _this.addStyles(_this.notification, styles)
    }

    _this.dismissOnClick = function(el){
      el.addEventListener('click', function(e){
        e.preventDefault()
        _this.dismiss()
      })
    }

    _this.createNotification = function(){
      var n = document.createElement('div')
      n.id = _this.id
      _this.addClass(n, 'notifit')
      var p = document.createElement('p')
      p.innerHTML = _this.config.msg
      n.appendChild(p)
      if(_this.config.clickable){
        n.appendChild(_this.createCloseButton())
      }
      var styles = {  }
      if(_this.config.color) styles.color = _this.config.color
      if(_this.config.width) styles.width = _this.config.width
      if(_this.config.bgcolor){
        styles.backgroundColor = _this.config.bgcolor
      }
      if(_this.config.opacity < 1){
        styles.opacity = _this.config.opacity
      }
      if(_this.config.zindex){
        styles.zIndex = _this.config.zindex
      }
      _this.addStyles(n, styles)
      _this.addClass(n, _this.config.type)
      if(_this.config.timeout > 0){
        _this.timer = setTimeout(function(){
          _this.dismiss()
        }, _this.config.timeout)
      }
      if(!_this.config.clickable){
        _this.dismissOnClick(n)
      }
      _this.notification = n
      document.querySelector('body').appendChild(n)
      _this.setPosition()
      return n
    } // createNotification

    _this.destroy = function(){
      if(_this.timer){
        clearTimeout(_this.timer)
        _this.timer = null
      }
      _this.addClass(_this.notification, 'removing')
      setTimeout(function(){
        if(_this.notification && _this.notification.parentNode){
          _this.notification.parentNode.removeChild(_this.notification)
          _this.notification = null
        }
        if(typeof _this.config.callback === 'function'){
          _this.config.callback.call(_this)
        }
      }, 500)
    } // destroy

    _this.getConfigCopy = function(){
      return Object.assign({ 'id': _this.newNotifID() }, _this.config)
    }

    _this.dismiss = function(){
      // temporal
      _this.destroy()
    }

    _this.init()
  } // _notif

  return new _notif(options)

} // notif

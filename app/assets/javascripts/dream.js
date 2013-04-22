var DD = (function () {

  function Dream (params) {
    this.id = params.id;
    this.blurb = params.blurb;
  }


  Dream.prototype.create = function () {
    var that = this;

    $.post("/dreams.json", {
      dream: {
        id: that.id,
        blurb: that.blurb
      }
    }, function(response) {
      that.id = response.id;
      Dream.all.push(that);

      _(Dream.callbacks).each(function(callback) {
        callback();
      });
    });
  };


  Dream.prototype.update = function () {
    var that = this;

    $.post("/dreams/" + that.id + ".json", {
      dream: {
        id: that.id,
        blurb: that.blurb,
      },
      _method: "put"
    }, function(response) {
      // that.id = response.id;
      that.blurb = response.blurb;
      // Dream.all.push(that);

      _(Dream.callbacks).each(function(callback) {
        callback();
      });
    });
  };

  Dream.prototype.delete = function () {
    var that = this;

    $.post("/dreams/" + that.id + ".json", {
      dream: {
        id: that.id,
        blurb: that.blurb,
      },
      _method: "delete"
    }, function(response) {
      that.id = response.id;
      // Dream.all.push(that);
      Dream.all.splice(Dream.all.indexOf(that), 1);
      _(Dream.callbacks).each(function(callback) {
        callback();
      });
    });
  };

  Dream.prototype.save = function () {
    if (this.id) {
      this.update();
    } else {
      this.create();
    }
  }

  Dream.prototype.title = function () {
    return this.blurb.length < 26 ? this.blurb : this.blurb.slice(0,22) + "...";
  }

  Dream.all = [];
  Dream.callbacks = [];

  Dream.refresh = function () {
    $.getJSON("/dreams.json",
      function(data) {
        Dream.all = [];
        _.each(data, function(datum) {
          Dream.all.push(new Dream(datum));
        });

        _(Dream.callbacks).each(function(callback) {
          callback();
        });
      }
    );
  };

  // function DreamRouter($el) {
  //   this.$el = $el;
  //   this.currentView = null;
  //   this.router
  // }
  //
  // DreamRouter.prototype.index = function() {
  //
  // }

  function DreamIndexView(el, clickCallback) {
    var that = this;
    that.$el = $(el);

    Dream.callbacks.push(function (){
      that.render(clickCallback);
    });
  }

  DreamIndexView.prototype.render = function(clickCallback) {
    var that = this;
    var $ul = $("<ul></ul>");

    _.each(Dream.all,function(dream) {
      $button = $("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
      $dreamItem = $("<a></a>").attr("href", "#").addClass("dream-item").text(dream.title());
      $li = $("<li></li>").append($button).append($dreamItem);
      $ul.append($li);

      $dreamItem.click(function() {
        clickCallback(dream);
      });

      $button.click(function() {
        dream.delete();
        clickCallback(dream);
      });
    });

    that.$el.html($ul)
  };


  function DreamFormView(blurb, button, callback) {
    this.dream_id = null;
    this.$blurb = $(blurb);
    this.$button = $(button);
    this.callback = callback;
  }

  DreamFormView.prototype.bind = function() {
    var that = this;

    that.buttonClickHandler = function() {
      that.submit();
    }
    that.$button.click(that.buttonClickHandler);
  };

  DreamFormView.prototype.unbind = function() {
    var that = this;

    that.$button.off('click', buttonClickHandler);
    delete that.buttonClickHandler;
  };

  DreamFormView.prototype.submit = function() {
    var that = this;
    var newDream = new Dream({ id: that.dream_id, blurb: that.$blurb.val() });
    console.log(newDream);
    that.$blurb.text("");

    that.callback(newDream);
  };

  function Tag (params) {

  }

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    DreamFormView: DreamFormView
  };


})();
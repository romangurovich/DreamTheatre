var DD = (function () {

  function Dream (id, blurb) {
    this.id = id;
    this.blurb = blurb;
    this.existing = false;
  }

  Dream.prototype.save = function () {
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
        blurb: that.blurb
      }
    }, function(response) {
      that.id = response.id;
      // Dream.all.push(that);

      _(Dream.callbacks).each(function(callback) {
        callback();
      });
    });
  };

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
          Dream.all.push(new Dream(datum.id, datum.blurb));
        });

        _(Dream.callbacks).each(function(callback) {
          callback();
        });
      }
    );
  };

  function DreamIndexView(el, callback) {
    var that = this;
    that.$el = $(el);

    Dream.callbacks.push(function (){
      that.render(callback);
    });
  }

  DreamIndexView.prototype.render = function(callback) {
    var that = this;


    var $ul = $("<ul></ul>");
    _.each(Dream.all,function(dream) {
      $button = $("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
      $dreamItem = $("<div></div>").addClass("dream-item").text(dream.title());

      $dreamItem.click(function() {
        $("#dream-blurb").text(dream.blurb);
        dream.existing = true;
        callback(dream);
      });

      $li = $("<li></li>").append($button).append($dreamItem);
      $ul.append($li);
    });

    that.$el.html($ul)
  };


  function DreamFormView(blurb, button, callback) {
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

    var newDream = new Dream(null, that.$blurb.val());
    that.$blurb.val("");

    that.callback(newDream);
  };

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    DreamFormView: DreamFormView
  };


})();
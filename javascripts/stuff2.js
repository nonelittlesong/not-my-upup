let Haniboi;
Haniboi = function () {
  function Haniboi() {
    let t;
    t = this,
    this.setSize(),
    this.preloadImages(),
    this.init(),
    this.prepareAndSave(!1),
    this.groupChosen = '0'
  }
  Haniboi.prototype.setSize = function (t) {
    let i;
    return i = t,
    null == t && (t = 'facebook'), // @todo 改为默认全屏
    this.size = t,
    'facebook' === t ? this.dimensions = {
      canvas: {
        w: 850,
        h: 315,
      },
      start: {
        image: {
          x: 310,
          y: -30
        },
        text: {
          x: 53,
          y: -55.5
        }
      },
      image: {
        gapX: 63,
        gapY: 24,
        w: 90,
        h: 177
      },
      text: {
        gapX: 44,
        gapY: -1.5,
        scaleX: 1.3,
        scaleY: 1,
        skewH: .635,
        skewV: -1.5,
        moveX: 190,
        moveY: 33,
        fontSizeZh: 25,
        fontSizeEn: 27
      },
      linebreak: {
        image: {
          x: -60,
          y: 44
        },
        text: {
          x: .4,
          y: 42.3
        }
      }
    } : 'square' === t && (this.dimensions = {
      canvas: {
        w: 500,
        h: 500,
      },
      start: {
        image: {
          x: 120,
          y: 40
        },
        text: {
          x: 4,
          y: 34.5
        }
      },
      image: {
        gapX: 50,
        gapY: 22,
        w: 76,
        h: 149
      },
      text: {
        gapX: 37.7,
        gapY: 1.4,
        scaleX: 1.3,
        scaleY: 1,
        skewH: .6,
        skewV: -1.5,
        moveX: 191,
        moveY: 32,
        fontSizeZh: 20,
        fontSizeEn: 23
      },
      linebreak: {
        image: {
          x: -52,
          y: 36
        },
        text: {
          x: -.8,
          y: 35.5
        }
      }
    }),
    i ? $('#save').click() : void 0
  },
  Haniboi.prototype.init = function () {
    return this.base = {},
    this.base.ix = this.dimensions.start.image.x,
    this.base.iy = this.dimensions.start.image.y,
    this.base.tx = this.dimensions.start.text.x,
    this.base.ty = this.dimensions.start.text.y,
    this.img = $('#output'), // <img id="output" style="display: none;"/>
    // @todo 删除水印
    (this.watermark = new Image).src = 'materials/watermark.png',
    (this.booksWatermark = new Image).src = 'materials/books.png',
    this.peopleCanvas = $('#canvas-people').get(0),
    this.people = this.peopleCanvas.getContext('2d'),
    this.textCanvas = $('#canvas-text').get(0),
    this.text = this.textCanvas.getContext('2d'),
    this.bgCanvas = $('#canvas-bg').get(0),
    this.bg = this.bgCanvas.getContext('2d'),
    this.markCanvas = $('#canvas-mark').get(0),
    this.mark = this.markCanvas.getContext('2d'),
    this.markCanvas.width = this.peopleCanvas.width = this.textCanvas.width = this.bgCanvas.width = this.dimensions.canvas.w,
    this.markCanvas.height = this.peopleCanvas.height = this.textCanvas.height = this.bgCanvas.height = this.dimensions.canvas.h,
    this.transformed || (this.text.transform(this.dimensions.text.scaleX, this.dimensions.text.skewH, this.dimensions.text.skewV, this.dimensions.text.scaleY, this.dimensions.text.moveX, this.dimensions.text.moveY),
    this.text.rotate(-3 * Math.PI / 180),
    this.transformed = !0),
    this.ix = this.base.ix,
    this.iy = this.base.iy,
    this.tx = this.base.tx,
    this.ty = this.base.ty
  },
  Haniboi.prototype.clearCanvas = function () {
    return this.people.clearRect(0, 0, this.peopleCanvas.width, this.peopleCanvas.height),
    this.bg.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height),
    this.mark.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height),
    this.text.setTransform(1, 0, 0, 1, 0, 0),
    this.text.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height),
    this.transformed = !1,
    this.init()
  },
  Haniboi.prototype.processWords = function () {
    let t;
    return this.clearCanvas(),
    this.words = $('#words').val().toUpperCase().replace(/\n/g, '£'),
    t = this,
    this.lines = 1,
    $.each(this.words.split(''), (i, e) => {
      return '£' === e ? (t.ix = t.base.ix + t.dimensions.linebreak.image.x * t.lines,
      t.iy = t.base.iy + t.dimensions.linebreak.image.y * t.lines,
      t.tx = t.base.tx + t.dimensions.linebreak.text.x * t.lines,
      t.ty = t.base.ty + t.dimensions.linebreak.text.y * t.lines,
      t.lines = t.lines + 1) : t.createUnit(e)
    })
  },
  Haniboi.prototype.setBackground = function (bg, clicker) {
    let hex, hnb, img;
    return null == clicker && (clicker = !1),
    null == bg && (bg = '#fff'),
    hnb = this,
    this.bgChosen = bg,
    clicker && (this.text.setTransform(1, 0, 0, 1, 0, 0),
    this.text.clearCanvas(0, 0, this.textCanvas.width, this.textCanvas.height),
    this.text.transform(this.dimensions.text.scaleX, this.dimensions.text.skewH, this.dimensions.text.skewV, this.dimensions.text.scaleY, this.dimensions.text.moveX, this.dimensions.text.moveY),
    this.text.rotate(-3 * Math.PI / 180),
    this.transformed = !0),
    bg.match(/^#/) ? hex = bg : bg && (img = bg + '_' + this.size),
    hex ? (this.bg.fillStyle = this.bgChosen,
    this.bg.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height)) : img && (bg = eval('hnb.backgrounds.' + img),
    this.bg.drawImage(bg, 0, 0, this.dimensions.canvas.w, this.dimensions.canvas.h)),
    this.watermarking(), // @todo 删除水印
    this.prepareAndSave()
  },
  Haniboi.prototype.setGroup = function (t) {
    return null == t && (t = 1),
    this.groupChosen = t
  },
  Haniboi.prototype.shuffle = function (t) {
    return t.sort(() => .5 - Math.random())
  },
  Haniboi.prototype.getFileNames = function (t) {
    let i;
    return i = $.map(t, (t) => {
      let i;
      return i = t.toString().length,
      1 === i ? t = '00' + t.toString() : 2 === i && (t = '0' + t.toString()),
      'materials/' + t + '.png'
    })
  },
  Haniboi.prototype.preloadImages = function () {
    let t, i, e, s, a, n, o, r, h, c, g, l, m;
    for (this.imgs = [],
    this.groups = {},
    g = [],
    e = {
      0: function () {
        for (m = [],
        n = 404; 426 >= n; n++)
          m.push(n);
        return m
      }
      .apply(this)
    },
    e[0] = e[0].concat([401, 402]),
    t = this.getFileNames(g),
    o = 0,
    h = t.length; h > o; o++)
      l = t[o],
      a = new Image,
      a.src = l,
      this.imgs.push(a);
    for (s in e)
      for (i = e[s],
      t = this.getFileNames(i),
      this.groups[s] = [],
      r = 0,
      c = t.length; c > r; r++)
        l = t[r],
        a = new Image,
        a.src = l,
        this.groups[s].push(a);
    return this.backgrounds = {}
  },
  Haniboi.prototype.randImg = function () {
    let t;
    return t = this.groupChosen ? this.groups[this.groupChosen] : this.imgs,
    this.shuffle(t)
  },
  Haniboi.prototype.createUnit = function (t) {
    return this.createMan(' ' === t),
    this.createText(t)
  },
  Haniboi.prototype.createText = function (t) {
    let color;
    return this.tx = this.tx + this.dimensions.text.gapX,
    this.ty = this.ty + this.dimensions.text.gapY,
    color = '♥' === t ? '#ca2626' : '❤' === t ? '#d92b6d' : '#40210f',
    this.text.fillStyle = color,
    this.text.textAlign = 'center',
    this.text.beginPath(),
    this.text.webkitImageSmoothingEnabled = !1,
    encodeURIComponent(t).length > 1 ? this.text.font = "900 " + this.dimensions.text.fontSizeZh + "px 'LiHei Pro','微軟正黑體','Microsoft JhengHei'" : this.text.font = "bold " + this.dimensions.text.fontSizeEn + "px 'Conv_ITC Avant Garde Gothic LT Bold', 'Ariel Black', 'Ariel'",
    this.text.fillText(t, this.tx, this.ty),
    this.text.closePath()
  },
  Haniboi.prototype.createMan = function (t) {
    let man;
    return this.ix = this.ix + this.dimensions.image.gapX,
    this.iy = this.iy + this.dimensions.image.gapY,
    t || (this.people.beginPath,
    man = this.randImg(),
    this.people.drawImage(man, this.ix, this.iy, this.dimensions.image.w, this.dimensions.image.h))
  },
  Haniboi.prototype.prepareAndSave = function (t) {
    let i, e, s;
    return null == t && (t = !0),
    this.bg.save(),
    this.text.save(),
    this.people.save(),
    this.people.drawImage(this.textCanvas, 0, 0),
    this.bg.drawImage(this.peopleCanvas, 0, 0),
    s = this.bgCanvas.toDataURL('image/jpg'),
    t ? (this.img.attr('src', s),
    e = $('#output').attr('src'),
    i = navigator.userAgent.match(/(iPad|Android|iPhone|iPod)/g) ? e : e.replace('image/png', 'image/octet-stream'),
    $('#download').attr('href', i)) : void 0
  },
  Haniboi
}(),
jQuery(function () {
  return window.haniboi = new Haniboi,
  $('#save').click(() => {
    return '' !== $('textarea').val() ? (haniboi.processWords(),
    haniboi.setBackground(haniboi.bgChosen)) : $('textarea').focus()
  }),
  window.val = $('textarea').val(),
  $('[data-color]').each((t, i) => {
    return $(i).attr('style', 'background-color: ' + $(i).attr('data-color'))
  }),
  $('[data-size]').click(function () {
    let t;
    return t = $(this).attr('data-size'),
    haniboi.setSize(t)
  }),
  $('[data-color]').click(function () {
    let t;
    return t = $(this).attr('data-color'),
    haniboi.setBackground(t, !0)
  })
})
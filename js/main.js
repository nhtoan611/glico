$(document).ready(function () {
  countdownTimer();
  setCitySelect();
  customSelectbox(2);
  websiteRedirect();
  openMenu();
  closeMenu();
  if($(window).width()>375){
    setCarousel(0);
  };
  if($(window).width()<=375){
    setCarousel(20);
  };
});

function countdownTimer() {
  var countDownDate = new Date("Jan 1, 2020 00:00:00").getTime();

  // Update the count down every 1 second
  var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    var dayQuotient = Math.floor(distance / (1000 * 60 * 60 * 24) / 10);
    var dayRemainder = Math.floor(distance / (1000 * 60 * 60 * 24)) % 10;
    var hourQuotient = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) / 10);
    var hourRemainder = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) % 10;
    var minuteQuotient = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60) / 10);
    var minuteRemainder = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) % 10;
    var secondQuotient = Math.floor((distance % (1000 * 60)) / 1000 / 10);
    var secondRemainder = Math.floor((distance % (1000 * 60)) / 1000) % 10;

    $("#day-quotient").text(dayQuotient);
    $("#day-remainder").text(dayRemainder);
    $("#hour-quotient").text(hourQuotient);
    $("#hour-remainder").text(hourRemainder);
    $("#minute-quotient").text(minuteQuotient);
    $("#minute-remainder").text(minuteRemainder);
    $("#second-quotient").text(secondQuotient);
    $("#second-remainder").text(secondRemainder);

  }, 1000);
}

function customSelectbox(selectFlg) {
  var x, i, j, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  if (selectFlg == 1) {
    x = document.getElementsByClassName("custom-select");
  } else {
    x = document.getElementsByClassName("custom-select2");
  }

  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
}

function setCitySelect() {
  $.ajax({
    url: 'https://nhtoan611.github.io/glico/js/city.json',
    type: 'GET',
    success: function (data) {
      data.forEach(function (city) {
        $('#city-select')
          .append($("<option></option>")
            .attr("value", city.id)
            .text(city.name));
      });
      customSelectbox(1);
      $('.select-items').children().on('click', function () {
        var city = $(this).html();
        setDistrictSelect(city);
      });
    }
  });
}

function setDistrictSelect(city) {
  $.ajax({
    url: 'https://nhtoan611.github.io/glico/js/district.json',
    type: 'GET',
    success: function (data) {
      $(".custom-select2 option[value!='0']").remove();
      data.forEach(function (store) {
        if (store.city == city) {
          $('#district-select')
            .append($("<option></option>")
              .text(store.district));
        };
      });
      $('.custom-select2>div').remove();
      customSelectbox(2);
      $('.custom-select2 .select-items').children().on('click', function () {
        var district = $(this).html();
        displayStore(city, district);
      });
    }
  });
}

function displayStore(city, district) {
  $.ajax({
    url: 'https://nhtoan611.github.io/glico/js/store.json',
    type: 'GET',
    success: function (data) {
      $('.store-list>div').remove();
      data.forEach(function (store) {
        if ((store.city == city) && (store.district == district)) {
          $('.store-list').append('<div class="store-address"><p class="store-name">' + store.name + '</p><p>' + store.address + '</p></div>')
        };
      });
    }
  });
}

function openMenu() {
  $('#menu-logo').click(function () {
    $('.home').hide();
    $('.menu-mobile').show()
  })
}

function closeMenu() {
  $('.close-btn').click(function () {
    $('.home').show();
    $('.menu-mobile').hide();
  })
}

function websiteRedirect() {
  $("#btn-store").click(function () {
    $('html, body').animate({
      scrollTop: $("#store-location-page").offset().top
    }, 1000);
  });
  $("#btn-gift").click(function () {
    $('html, body').animate({
      scrollTop: $("#gift-page").offset().top
    }, 1000);
  });
  $('.header-facebook').click(function () {
    window.open("https://www.facebook.com/glicoicreoVietnam/");
  });
  $('.header-website').click(function () {
    window.open("http://glico.com.vn/");
  });
  $('.contact-facebook').click(function () {
    window.open("https://www.facebook.com/glicoicreoVietnam/");
  });
  $('.contact-website').click(function () {
    window.open("http://glico.com.vn/");
  });
  $('.menu-facebook').click(function () {
    window.open("https://www.facebook.com/glicoicreoVietnam/");
  });
  $('.menu-website').click(function () {
    window.open("http://glico.com.vn/");
  });
  $('.menu-hotline').click(function () {
    window.open("tel:190055599");
  });
  $('.dot').click(function(){
    $(this).parent().find('.dot-active').removeClass('dot-active');
    $(this).addClass('dot-active');
  });
  // gift img1
  $('.gift-img1 .dot-blue').click(function(){
    $('.gift-img1 img').attr('src', 'img/gift1-2.png');
  });
  $('.gift-img1 .dot-brown').click(function(){
    $('.gift-img1 img').attr('src', 'img/gift1-1.png');
  });
  $('.gift-img1 .dot-pink').click(function(){
    $('.gift-img1 img').attr('src', 'img/gift1.png');
  });
  // gift img2
  $('.gift-img2 .dot-red').click(function(){
    $('.gift-img2 img').attr('src', 'img/gift2-1.png');
  });
  $('.gift-img2 .dot-white').click(function(){
    $('.gift-img2 img').attr('src', 'img/gift2-2.png');
  });
  $('.gift-img2 .dot-cyan').click(function(){
    $('.gift-img2 img').attr('src', 'img/gift2.png');
  });
  //gift img3
  $('.gift-img3 .dot-cyan').click(function(){
    $('.gift-img3 img').attr('src', 'img/gift-m4.png');
  });
  $('.gift-img3 .dot-yellow').click(function(){
    $('.gift-img3 img').attr('src', 'img/gift-m6.png');
  });
  $('.gift-img3 .dot-pink').click(function(){
    $('.gift-img3 img').attr('src', 'img/gift4.png');
  });
  //gift img4
  $('.gift-img4 .dot-pink').click(function(){
    $('.gift-img4 img').attr('src', 'img/gift5.png');
  });
  $('.gift-img4 .dot-black').click(function(){
    $('.gift-img4 img').attr('src', 'img/gift5-1.png');
  });
  $('.gift-img4 .dot-cyan').click(function(){
    $('.gift-img4 img').attr('src', 'img/gift5-2.png');
  });
}

function setCarousel(x) {
  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    stagePadding: 100-x,
    responsive: {
      0: {
        items: 1
      }
    }
  })
}

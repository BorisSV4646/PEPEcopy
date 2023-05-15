$(document).ready(function () {
  $(".header-menu-close").click(function () {
    $(".header-menu").removeClass("active");
  });

  $(".header-burger").click(function () {
    if ($(".header-menu").hasClass("active")) {
      $(".header-menu").removeClass("active");
      $(".header-burger").removeClass("close");
      setTimeout(function () {
        $(".header-burger").removeClass("active");
      }, 300);
    } else {
      $(".header-menu").addClass("active");
      $(".header-burger").addClass("active");
      setTimeout(function () {
        $(".header-burger").addClass("close");
      }, 300);
    }
  });

  const roadmapSlider = new Swiper(".roadmap-slider", {
    spaceBetween: 20,
    navigation: {
      nextEl: ".roadmap-slider-next",
      prevEl: ".roadmap-slider-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      751: {
        slidesPerView: 2,
      },
      1051: {
        slidesPerView: 3,
      },
    },
  });

  let swapSelector;

  $(".swap-tokens-bg, .swap-tokens-block-close").click(function () {
    swapSelector = "";
    $(".swap-tokens-bg").removeClass("active");
    $(".swap-tokens-block").removeClass("active");
    setTimeout(function () {
      $(".swap-tokens-wrapper").removeClass("active");
    }, 300);
  });

  $(".swap-block-item-selector").click(function () {
    swapSelector = $(this);
    $(".swap-tokens-wrapper").addClass("active");
    setTimeout(function () {
      $(".swap-tokens-bg").addClass("active");
      $(".swap-tokens-block").addClass("active");
    }, 1);
  });

  $(".swap-tokens-block-item").click(function () {
    swapSelector.find(".swap-block-item-selector-text").text("");
    swapSelector
      .find(".swap-block-item-selector-text")
      .prepend(
        `<span>${$(this).find(".swap-tokens-block-item-text").text()}</span>`
      );
    swapSelector
      .find(".swap-block-item-selector-text")
      .prepend(
        `<img src="${$(this)
          .find(".swap-tokens-block-item-icon img")
          .attr("src")}" alt="">`
      );
    swapSelector = "";
    $(".swap-tokens-bg").removeClass("active");
    $(".swap-tokens-block").removeClass("active");
    setTimeout(function () {
      $(".swap-tokens-wrapper").removeClass("active");
    }, 300);
  });

  $(".staking-questions-block-item-top").click(function () {
    if ($(this).parents(".staking-questions-block-item").hasClass("active")) {
      $(this)
        .parents(".staking-questions-block-item")
        .find(".staking-questions-block-item-bottom")
        .slideUp(300);
      $(this).parents(".staking-questions-block-item").removeClass("active");
    } else {
      $(this)
        .parents(".staking-questions-block-item")
        .find(".staking-questions-block-item-bottom")
        .slideToggle(300);
      $(this).parents(".staking-questions-block-item").addClass("active");
    }
  });

  if ($(".staking-pool-range").length) {
    let slider1 = document.getElementById("slider1");
    let selector1 = document.getElementById("selector1");
    //let result1 = document.getElementById('result1');
    let rangeLine1 = document.getElementById("range-line1");

    //result1.innerHTML = slider1.value;
    selector1.style.left = slider1.value + "%";
    rangeLine1.style.width = slider1.value + "%";
    slider1.oninput = function () {
      selector1.style.left = this.value + "%";
      //result1.innerHTML = this.value;
      rangeLine1.style.width = this.value + "%";
    };

    let slider2 = document.getElementById("slider2");
    let selector2 = document.getElementById("selector2");
    //let result1 = document.getElementById('result1');
    let rangeLine2 = document.getElementById("range-line2");

    //result1.innerHTML = slider1.value;
    selector2.style.left = slider2.value + "%";
    rangeLine2.style.width = slider2.value + "%";
    slider2.oninput = function () {
      selector2.style.left = this.value + "%";
      //result1.innerHTML = this.value;
      rangeLine2.style.width = this.value + "%";
    };

    $(".staking-pool-tab").click(function () {
      $(".staking-pool-tab").removeClass("active");
      $(".staking-pool-content").removeClass("active");
      $(this).addClass("active");
      $(
        `.staking-pool-content[data-tab="${$(this).attr("data-tab")}"]`
      ).addClass("active");
    });

    $(".staking-item-btn-stake").click(function () {
      $(".staking-pool-wrapper").addClass("active");
      setTimeout(function () {
        $(".staking-pool-bg").addClass("active");
        $(".staking-pool-block").addClass("active");
      }, 1);
    });

    $(".staking-pool-bg, .staking-pool-close").click(function () {
      selector1.style.left = 0 + "%";
      rangeLine1.style.width = 0 + "%";
      selector2.style.left = 0 + "%";
      rangeLine2.style.width = 0 + "%";
      $(".staking-pool-bg").removeClass("active");
      $(".staking-pool-block").removeClass("active");
      setTimeout(function () {
        $(".staking-pool-wrapper").removeClass("active");
      }, 1);
    });
  }
});

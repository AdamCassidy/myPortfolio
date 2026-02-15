/*
	Big Picture by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
(function ($) {
  var $window = $(window),
    $body = $("body"),
    $header = $("#header"),
    $all = $body.add($header);

  // Breakpoints.
  breakpoints({
    xxlarge: ["1681px", "1920px"],
    xlarge: ["1281px", "1680px"],
    large: ["1001px", "1280px"],
    medium: ["737px", "1000px"],
    small: ["481px", "736px"],
    xsmall: [null, "480px"],
  });

  window.addEventListener('load', function() {
    document.body.classList.remove('is-preload');
    document.body.classList.add('is-loaded');
  });

  // Gallery.
  document.addEventListener('DOMContentLoaded', () => {
            const overlay = document.getElementById('pageOverlay');
            const cardContainers = document.querySelectorAll('.project-card-container');
            let activeContainer = null;

            cardContainers.forEach(container => {
                const card = container.querySelector('.project-card');
                const projectId = card.dataset.projectId;
                const contentHTML = document.getElementById(projectId).innerHTML;
                container.querySelector('.card-face--back').innerHTML = `<div class="project-card-content">${contentHTML}</div>`;

                card.addEventListener('click', () => {
                    if (activeContainer) return;
                    
                    activeContainer = container;
                    const cardRect = card.getBoundingClientRect();

                    const finalWidth = Math.min(window.innerWidth * 0.8, 800);
                    const scale = finalWidth / cardRect.width;
                    const translateX = (window.innerWidth / 2) - (cardRect.left + cardRect.width / 2);
                    const translateY = (window.innerHeight / 2) - (cardRect.top + cardRect.height / 2);

                    // Set CSS variables for the animation
                    container.style.setProperty('--start-top', `${cardRect.top}px`);
                    container.style.setProperty('--start-left', `${cardRect.left}px`);
                    container.style.setProperty('--start-width', `${cardRect.width}px`);
                    container.style.setProperty('--start-height', `${cardRect.height}px`);
                    container.style.setProperty('--end-x', `${translateX}px`);
                    container.style.setProperty('--end-y', `${translateY}px`);
                    container.style.setProperty('--end-scale', scale);

                    document.body.classList.add('modal-active');
                    overlay.classList.add('is-visible');
                    cardContainers.forEach(c => {
                        if (c !== container) c.classList.add('is-inactive');
                    });
                    
                    container.classList.add('is-expanded');

                    requestAnimationFrame(() => {
                        container.classList.add('is-animating');
                        container.classList.add('is-flipped');
                        document.getElementById("work").style.setProperty('padding-bottom', `${cardRect.height}px`);
                    });
                });
            });

            function closeModal() {
                if (!activeContainer) return;

                activeContainer.classList.remove('is-flipped');
                activeContainer.classList.remove('is-animating');

                setTimeout(() => {
                    overlay.classList.remove('is-visible');
                    document.body.classList.remove('modal-active');
                    cardContainers.forEach(c => c.classList.remove('is-inactive'));
                    
                    activeContainer.addEventListener('transitionend', () => {
                        document.getElementById("work").style.setProperty('padding-bottom', '0px');
                        activeContainer.classList.remove('is-expanded');
                        activeContainer.style = null;
                        activeContainer = null;
                    }, { once: true });
                    
                }, 500);
            }

            overlay.addEventListener('click', closeModal);

    // Hack: Adjust margins when 'small' activates.
  });

  // Section transitions.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
  });

  document.getElementById('showOrHideDetails').addEventListener('click', function(e) {
    const projectDetailsList = document.querySelector('.project-details-list')
    const projectGrid = document.querySelector('.projects-grid')
    projectDetailsList.classList.toggle('hidden');
    projectGrid.classList.toggle('hidden');
    if (projectDetailsList.classList.contains('hidden')) {
      e.target.innerHTML = "Show Details"
    } else {
      e.target.innerHTML = "Hide Details"
    }
  })
  const publicKey = "__EMAILJS_PUBLIC_KEY__";
  const serviceID = "__EMAILJS_SERVICE_ID__";
  const templateID = "__EMAILJS_TEMPLATE_ID__";

  emailjs.init(publicKey);

  document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();
    emailjs.sendForm(serviceID, templateID, this)
      .then(() => alert("Message sent!"))
      .catch(err => alert("Failed: " + JSON.stringify(err)));
  });

    // Events.
  var resizeTimeout, resizeScrollTimeout;

  $window
    .on("resize", function () {
      // Disable animations/transitions.
      $body.addClass("is-resizing");

      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function () {
        // Update scrolly links.
        $('a[href^="#"]').scrolly({
          speed: 1500,
          offset: $header.outerHeight() - 1,
        });

        // Re-enable animations/transitions.
        setTimeout(function () {
          $body.removeClass("is-resizing");
          $window.trigger("scroll");
        }, 0);
      }, 100);
    })
    .on("load", function () {
      $window.trigger("resize");
    });
})(jQuery);

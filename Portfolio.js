/*
   MOBILE MENU TOGGLE */
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-center");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

/* 
   CLOSE MENU ON CLICK */
document.querySelectorAll(".nav-center a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

/*
   ACTIVE NAV ON SCROLL */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-center a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/*
   SCROLL REVEAL ANIMATION */
const revealElements = document.querySelectorAll(
  ".about-container, .skill-card, .project-card, .contact-form"
);

const revealOnScroll = () => {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 80) {
      el.classList.add("show");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const successMsg = document.getElementById("success-message");

  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(() => {
    successMsg.style.display = "block";
    form.reset();

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 4000);
  })
  .catch(() => {
    alert("Something went wrong. Please try again.");
  });
}

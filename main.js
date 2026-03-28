document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loader-fill");

  const progressBar = document.getElementById("progress-bar");
  const parallaxBg = document.getElementById("parallax-bg");
  const themeToggle = document.getElementById("theme-toggle");

  const chapterDots = [...document.querySelectorAll(".chapter-dot")];
  const sections = [...document.querySelectorAll("main section[id]")];

  const heroQuoteBtn = document.getElementById("hero-quote-btn");
  const heroQuoteText = document.getElementById("hero-quote-text");

  const copyCodeBtn = document.getElementById("copy-code-btn");
  const heroCodeBlock = document.getElementById("hero-code-block");

  const runCodeBtn = document.getElementById("run-code-btn");
  const terminal = document.getElementById("terminal-animation");
  const terminalText = document.getElementById("terminal-text");

  const bugButtons = [...document.querySelectorAll(".bug")];
  const bugsFoundCount = document.getElementById("bugs-found-count");
  const fixErrorBtn = document.getElementById("fix-error-btn");
  const fixAnimation = document.getElementById("fix-animation");

  const addCoffeeBtn = document.getElementById("add-coffee-btn");
  const resetCoffeeBtn = document.getElementById("reset-coffee-btn");
  const coffeeCountEl = document.getElementById("coffee-count");
  const energyFill = document.getElementById("energy-fill");
  const energyLevelText = document.getElementById("energy-level-text");

  const typingText = document.getElementById("typing-text");
  const timerEl = document.getElementById("timer");

  const deployBtn = document.getElementById("deploy-btn");
  const confetti = document.getElementById("confetti");
  const deploySuccess = document.getElementById("deploy-success");
  const deployLog = document.getElementById("deploy-log");

  const moodFill = document.getElementById("mood-fill");
  const moodLabel = document.getElementById("mood-label");

  const achievementCount = document.getElementById("achievement-count");
  const achievementCards = [...document.querySelectorAll(".achievement-card")];

  const devQuotes = [
    "It works on my machine.",
    "One more bug fix and I will sleep.",
    "The code was fine until I touched it.",
    "Half of programming is naming things and searching errors.",
    "This bug is personal now.",
    "Good code comes after confused code.",
    "The semicolon was small, the damage was not."
  ];

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "That bug was tiny, but emotionally expensive.",
    "A missing character can ruin your whole evening.",
    "The code is innocent until proven guilty."
  ];

  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let terminalTyping = false;
  let foundBugs = 0;
  let coffeeCount = 0;
  let deadlineSeconds = 45;
  let timerStarted = false;
  let typingStarted = false;
  let interactions = 0;
  let deployTimeout;

  const achievements = {
    "first-code": false,
    "bug-hunter": false,
    "caffeine-core": false,
    "deployer": false,
    "collector": false
  };

  function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  applyTheme(currentTheme);

  themeToggle?.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
    bumpInteractions();
  });

  function simulateLoader() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;
      if (progress > 100) progress = 100;
      loaderFill.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add("hidden");
        }, 350);
      }
    }, 120);
  }

  simulateLoader();

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  function updateParallax() {
    const y = window.scrollY * 0.16;
    if (parallaxBg) {
      parallaxBg.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  }

  function updateChapterNav() {
    let currentId = "hero";

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35) {
        currentId = section.id;
      }
    });

    chapterDots.forEach(dot => {
      const href = dot.getAttribute("href")?.replace("#", "");
      dot.classList.toggle("active", href === currentId);
    });
  }

  function handleScrollEffects() {
    updateProgress();
    updateParallax();
    updateChapterNav();
  }

  window.addEventListener("scroll", handleScrollEffects, { passive: true });
  handleScrollEffects();

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach(item => revealObserver.observe(item));

  function typeText(element, text, speed = 60, callback) {
    let i = 0;
    element.textContent = "";

    function step() {
      if (i < text.length) {
        element.textContent += text[i];
        i += 1;
        setTimeout(step, speed);
      } else if (typeof callback === "function") {
        callback();
      }
    }

    step();
  }

  function randomQuote() {
    const index = Math.floor(Math.random() * devQuotes.length);
    heroQuoteText.textContent = `“${devQuotes[index]}”`;
  }

  heroQuoteBtn?.addEventListener("click", () => {
    randomQuote();
    bumpInteractions();
  });

  randomQuote();

  copyCodeBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(heroCodeBlock.textContent);
      copyCodeBtn.textContent = "Copied!";
      setTimeout(() => {
        copyCodeBtn.textContent = "Copy Code";
      }, 1400);
      bumpInteractions();
    } catch {
      copyCodeBtn.textContent = "Failed";
      setTimeout(() => {
        copyCodeBtn.textContent = "Copy Code";
      }, 1400);
    }
  });

  runCodeBtn?.addEventListener("click", () => {
    if (terminalTyping) return;

    terminalTyping = true;
    terminal.classList.remove("hidden");
    typeText(terminalText, "node app.js\nHello World 🚀\nJourney started successfully.", 50, () => {
      terminalTyping = false;
    });

    unlockAchievement("first-code");
    bumpInteractions();
    updateMood();
  });

  function markBugFound(button) {
    if (button.classList.contains("found")) return;

    button.classList.add("found");
    foundBugs += 1;
    bugsFoundCount.textContent = foundBugs;
    fixAnimation.textContent = jokes[Math.floor(Math.random() * jokes.length)];
    fixAnimation.classList.remove("hidden");
  }

  bugButtons.forEach(button => {
    button.addEventListener("click", () => {
      markBugFound(button);
      bumpInteractions();
      updateMood();
    });
  });

  fixErrorBtn?.addEventListener("click", () => {
    fixAnimation.classList.remove("hidden");

    if (foundBugs === bugButtons.length) {
      fixAnimation.textContent = "✅ All bugs fixed. System stable again.";
      fixAnimation.classList.add("success");
      unlockAchievement("bug-hunter");
    } else {
      fixAnimation.textContent = "⚠️ Find every bug first.";
      fixAnimation.classList.remove("success");
    }

    bumpInteractions();
    updateMood();
  });

  function updateEnergyUI() {
    coffeeCountEl.textContent = coffeeCount;

    const capped = Math.min(coffeeCount, 10);
    energyFill.style.width = `${capped * 10}%`;

    let level = "Low";
    if (coffeeCount >= 3 && coffeeCount < 6) level = "Rising";
    if (coffeeCount >= 6 && coffeeCount < 9) level = "High";
    if (coffeeCount >= 9) level = "Overclocked";

    energyLevelText.textContent = level;

    if (coffeeCount >= 5) {
      unlockAchievement("caffeine-core");
    }

    updateMood();
  }

  addCoffeeBtn?.addEventListener("click", () => {
    coffeeCount += 1;
    updateEnergyUI();
    bumpInteractions();
  });

  resetCoffeeBtn?.addEventListener("click", () => {
    coffeeCount = 0;
    updateEnergyUI();
    bumpInteractions();
  });

  updateEnergyUI();

  function startTypingAnimation() {
    if (typingStarted) return;
    typingStarted = true;
    typeText(typingText, "Beast Mode Activated... typing, fixing, shipping, repeating.", 35);
  }

  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;

    const interval = setInterval(() => {
      const min = String(Math.floor(deadlineSeconds / 60)).padStart(2, "0");
      const sec = String(deadlineSeconds % 60).padStart(2, "0");
      timerEl.textContent = `${min}:${sec}`;

      if (deadlineSeconds <= 0) {
        clearInterval(interval);
        timerEl.textContent = "00:00";
        updateMood("chaos");
      }

      deadlineSeconds -= 1;
    }, 1000);
  }

  const deadlineSection = document.getElementById("deadlines");
  if (deadlineSection) {
    const deadlineObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startTypingAnimation();
            startTimer();
          }
        });
      },
      { threshold: 0.35 }
    );

    deadlineObserver.observe(deadlineSection);
  }

  deployBtn?.addEventListener("click", () => {
    confetti.classList.remove("hidden");
    deploySuccess.classList.remove("hidden");

    deployLog.innerHTML = `
      <p>Initializing build pipeline...</p>
      <p>Compiling assets...</p>
      <p>Checking responsiveness...</p>
      <p>Uploading to production...</p>
      <p>Deployment complete. Project is live. 🚀</p>
    `;

    confetti.animate(
      [
        { transform: "scale(0.7)", opacity: 0 },
        { transform: "scale(1.15)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 650, fill: "forwards", easing: "ease-out" }
    );

    clearTimeout(deployTimeout);
    deployTimeout = setTimeout(() => {
      confetti.classList.add("hidden");
    }, 2200);

    unlockAchievement("deployer");
    bumpInteractions();
    updateMood("victory");
  });

  function updateMood(forceState) {
    let label = "Hopeful";
    let width = 28;

    if (forceState === "victory") {
      label = "Victorious";
      width = 100;
    } else if (forceState === "chaos") {
      label = "Panicking";
      width = 18;
    } else if (foundBugs >= bugButtons.length) {
      label = "Relieved";
      width = 72;
    } else if (coffeeCount >= 6) {
      label = "Overclocked";
      width = 82;
    } else if (coffeeCount >= 3) {
      label = "Focused";
      width = 62;
    } else if (interactions >= 4) {
      label = "Determined";
      width = 52;
    }

    moodLabel.textContent = label;
    moodFill.style.width = `${width}%`;
  }

  function unlockAchievement(key) {
    if (achievements[key]) return;

    achievements[key] = true;
    const card = document.querySelector(`[data-achievement="${key}"]`);
    if (card) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
    }

    updateAchievementCount();
  }

  function updateAchievementCount() {
    const unlocked = Object.values(achievements).filter(Boolean).length;
    achievementCount.textContent = `${unlocked} / 5`;

    if (interactions >= 5 && !achievements.collector) {
      achievements.collector = true;
      const collectorCard = document.querySelector('[data-achievement="collector"]');
      if (collectorCard) {
        collectorCard.classList.remove("locked");
        collectorCard.classList.add("unlocked");
      }
      const newUnlocked = Object.values(achievements).filter(Boolean).length;
      achievementCount.textContent = `${newUnlocked} / 5`;
    }
  }

  function bumpInteractions() {
    interactions += 1;
    updateAchievementCount();
  }

  updateMood();
  updateAchievementCount();
});
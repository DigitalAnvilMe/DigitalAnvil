;(() => {
  'use strict'

  /* ── Theme Toggle ── */
  const themeToggle = document.getElementById('themeToggle')
  const themeIcon = themeToggle?.querySelector('i')
  if (themeToggle) {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.add('light-mode')
      themeIcon.className = 'fa-solid fa-sun'
    }
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode')
      themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon'
      localStorage.setItem('theme', isLight ? 'light' : 'dark')
    })
  }

  document.body.classList.add('no-scroll')
  document.documentElement.classList.add('no-scroll')

  /* ── Matrix Code Rain ── */
  const canvas = document.createElement('canvas')
  canvas.id = 'codeRain'
  document.body.prepend(canvas)
  const ctx = canvas.getContext('2d')

  let cols, drops, rainRaf, lastRain = 0
  const fontSize = 24
  const frameInterval = 120
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEF<>/{}[]'

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cols = Math.floor(canvas.width / fontSize)
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -canvas.height / fontSize))
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  function drawRain(now) {
    if (now - lastRain < frameInterval) { rainRaf = requestAnimationFrame(drawRain); return }
    lastRain = now

    ctx.fillStyle = 'rgba(7, 7, 14, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px monospace`
    ctx.shadowBlur = 0

    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = Math.random() > 0.9 ? 'rgba(255,107,53,0.4)' : 'rgba(255,107,53,0.06)'
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize)
      drops[i]++
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
    }
    rainRaf = requestAnimationFrame(drawRain)
  }
  rainRaf = requestAnimationFrame(drawRain)

  /* ── Terminal Typing Effect ── */
  const terminalLine = document.getElementById('terminalLine')
  const heroTitle = document.getElementById('heroTitle')
  if (terminalLine) {
    const text = 'Find me on your favorite platform & let\'s play'
    let i = 0
    const cursor = document.createElement('span')
    cursor.className = 'terminal-cursor'
    cursor.textContent = '█'

    function type() {
      if (i < text.length) {
        terminalLine.textContent = text.slice(0, i + 1)
        i++
        setTimeout(type, 28 + Math.random() * 20)
      } else {
        terminalLine.after(cursor)
        if (heroTitle) {
          heroTitle.classList.add('hero-title-visible')
        }
        document.body.classList.remove('no-scroll')
        document.documentElement.classList.remove('no-scroll')
        document.querySelector('.scroll-indicator')?.classList.add('scroll-indicator-visible')
        setInterval(() => {
          cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0'
        }, 500)
      }
    }
    setTimeout(type, 1800)
  }

  /* ── Card mouse-tracking shine ── */
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--mx', x + '%')
      card.style.setProperty('--my', y + '%')
    })
  })

  /* ── Back to Top + Scroll Progress ── */
  const btn = document.getElementById('backToTop')
  const progress = document.getElementById('scrollProgress')
  if (btn && progress) {
    let ticking = false
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          progress.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%'
          btn.classList.toggle('visible', scrollTop > 400)
          ticking = false
        })
        ticking = true
      }
    }, { passive: true })

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  /* ── Copy Nintendo Code ── */
  const nintendoCard = document.querySelector('.card:has(.card-img-icon)')
  if (nintendoCard) {
    nintendoCard.addEventListener('click', (e) => {
      e.preventDefault()
      navigator.clipboard.writeText('SW-4814-9815-9198').then(() => {
        const action = nintendoCard.querySelector('.card-action')
        if (action) {
          const orig = action.innerHTML
          action.innerHTML = '<i class="fa-solid fa-check"></i> Copied!'
          setTimeout(() => { action.innerHTML = orig }, 2000)
        }
      }).catch(() => {})
    })
  }

  /* ── Card Reveal on Scroll ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    document.querySelectorAll('.card').forEach((card) => {
      card.classList.add('card-hidden')
      observer.observe(card)
    })
  }
})()

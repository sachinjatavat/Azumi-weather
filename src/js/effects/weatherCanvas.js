// src/js/effects/weatherCanvas.js

class WeatherCanvasEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.weatherCode = 0;
    this.isDay = 1;
    this.isRunning = false;
  }

  init(canvasId = 'weather-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  setWeather(weatherCode, isDay = 1) {
    this.weatherCode = weatherCode;
    this.isDay = isDay;
    this.createParticles();
  }

  createParticles() {
    if (!this.width || !this.height) return;
    this.particles = [];

    let count = 40;
    let type = 'clear';

    // Snow
    if ([71, 73, 75, 77, 85, 86].includes(this.weatherCode)) {
      count = 70;
      type = 'snow';
    } 
    // Rain
    else if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(this.weatherCode)) {
      count = 80;
      type = 'rain';
    }
    // Night Stars or Sun Glints
    else if (!this.isDay) {
      count = 50;
      type = 'stars';
    } else {
      count = 25;
      type = 'sun';
    }

    for (let i = 0; i < count; i++) {
      this.particles.push(this.generateParticle(type));
    }
  }

  generateParticle(type) {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;

    if (type === 'snow') {
      return {
        x, y,
        type,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.7 + 0.3
      };
    } else if (type === 'rain') {
      return {
        x, y,
        type,
        length: Math.random() * 15 + 8,
        speedY: Math.random() * 10 + 12,
        speedX: -2,
        opacity: Math.random() * 0.4 + 0.2
      };
    } else if (type === 'stars') {
      return {
        x, y,
        type,
        radius: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        opacity: Math.random()
      };
    } else {
      // Sun glints
      return {
        x, y,
        type,
        radius: Math.random() * 2 + 1,
        speedY: -Math.random() * 0.4 - 0.1,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.3 + 0.1
      };
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  loop() {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      if (p.type === 'snow') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > this.height) p.y = -5;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.fill();
      } else if (p.type === 'rain') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > this.height) {
          p.y = -15;
          p.x = Math.random() * this.width;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.speedX, p.y + p.length);
        this.ctx.strokeStyle = `rgba(209, 0, 105, ${p.opacity})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      } else if (p.type === 'stars') {
        p.opacity += p.twinkleSpeed;
        if (p.opacity > 1 || p.opacity < 0.1) p.twinkleSpeed = -p.twinkleSpeed;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(p.opacity)})`;
        this.ctx.fill();
      } else if (p.type === 'sun') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = this.height + 5;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 184, 217, ${p.opacity})`;
        this.ctx.fill();
      }
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }
}

export const weatherCanvasEngine = new WeatherCanvasEngine();

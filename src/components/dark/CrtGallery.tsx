import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './CrtGallery.css'

interface Photo {
  src: string
  date: string
  alt: string
}

// ponytail: full folder, compressed WebP per spec — neighbors preloaded, rest disposed
const PHOTOS: Photo[] = [
  { src: '/images/dark/opt/DSC03682-favorite.webp', date: '2026.10.18', alt: 'Wedding photograph' },
  { src: '/images/dark/opt/DSC03263.webp', date: '2015.03.21', alt: 'A memory' },
  { src: '/images/dark/opt/DSC03275.webp', date: '2015.09.05', alt: 'A memory' },
  { src: '/images/dark/opt/DSC03410.webp', date: '2016.04.17', alt: 'A memory' },
  { src: '/images/dark/opt/DSC03496.webp', date: '2015.06.14', alt: 'Playing drums' },
  { src: '/images/dark/opt/DSC03620.webp', date: '2018.05.19', alt: 'A memory' },
  { src: '/images/dark/opt/DSC03698.webp', date: '2020.09.27', alt: 'Time together' },
  { src: '/images/dark/opt/DSC03775-2.webp', date: '2021.05.08', alt: 'A memory' },
  { src: '/images/dark/opt/DSC03845-2.webp', date: '2023.12.24', alt: 'With the drums' },
  { src: '/images/dark/opt/DSC03992.webp', date: '2024.06.15', alt: 'A memory' },
]

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// ponytail: one shader, subtle only — photo first, texture second, never glitch art
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform sampler2D uTexB;
uniform vec2 uRes;
uniform float uTime;
uniform float uTexAspect;
uniform float uTexAspectB;
uniform float uPlaneAspect;
uniform float uMix;
uniform float uSyncAmt;
uniform float uLinePos;
uniform float uLineStr;
uniform float uPower;
uniform float uHold;
uniform float uPulse;
uniform float uReduced;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 samplePhoto(sampler2D tex, vec2 uv, float aspect) {
  float pa = uPlaneAspect;
  vec2 s = vec2(1.0);
  if (pa > aspect) { s.x = aspect / pa; } else { s.y = pa / aspect; }
  vec2 fuv = (uv - 0.5) / s + 0.5;
  float inside = step(0.0, fuv.x) * step(fuv.x, 1.0) * step(0.0, fuv.y) * step(fuv.y, 1.0);
  vec2 c = clamp(fuv, 0.0, 1.0);
  float sep = 0.0016 * (1.0 - uHold * 0.7);
  vec3 col;
  col.r = texture2D(tex, c + vec2(sep, 0.0)).r;
  col.g = texture2D(tex, c).g;
  col.b = texture2D(tex, c - vec2(sep, 0.0)).b;
  return col * inside + vec3(0.012, 0.012, 0.016) * (1.0 - inside);
}

// analog sync-loss: band shear + v-roll + travelling sync line, photos stay recognizable
vec3 syncLoss(vec2 uv, float amt) {
  vec2 tuv = uv;
  float band = floor(tuv.y * 9.0);
  float bh = hash(vec2(band, 7.0));
  float wob = sin(uTime * 43.0 + band * 3.1) * 0.5 + 0.5;
  vec2 off = vec2((bh - 0.5) * 0.12 * amt * (0.5 + wob * 0.5), 0.0);
  vec3 oldS = samplePhoto(uTex, clamp(tuv + off, -0.2, 1.2), uTexAspect);
  vec3 newS = samplePhoto(uTexB, clamp(tuv + off * 0.7, -0.2, 1.2), uTexAspectB);
  vec3 col = mix(oldS, newS, uMix);
  // brief local noise at band edges only — never fullscreen
  float f = fract(tuv.y * 9.0);
  float edge = 1.0 - smoothstep(0.0, 0.14, min(f, 1.0 - f));
  col += (hash(tuv * uRes + fract(uTime * 13.0) * 91.0) - 0.5) * 0.32 * amt * edge;
  // bright sync line crossing the display
  col += vec3(0.85, 0.88, 0.92) * smoothstep(0.012, 0.0, abs(tuv.y - uLinePos)) * uLineStr;
  return col;
}

void main() {
  vec2 uv = vUv;
  float eff = 1.0 - uHold * 0.8;

  // slight barrel distortion
  vec2 cc = uv - 0.5;
  float r2 = dot(cc, cc);
  uv = uv + cc * r2 * 0.10 * eff;

  // occasional horizontal instability (one band at a time, rare)
  float bandR = hash(vec2(floor(uv.y * 28.0), floor(uTime * 7.0)));
  if (bandR > 0.965 && uReduced < 0.5) {
    uv.x += (bandR - 0.965) * 0.6 * eff;
  }

  vec3 img = samplePhoto(uTex, clamp(uv, -0.2, 1.2), uTexAspect);

  // channel transition: sync loss overtakes the steady picture, then releases
  float tact = clamp(uSyncAmt + uMix, 0.0, 1.0);
  img = mix(img, syncLoss(uv, uSyncAmt), tact);

  // faint scanlines + grain + flicker
  float scan = sin(uv.y * uRes.y * 3.14159) * 0.5 + 0.5;
  img *= 1.0 - scan * 0.055 * eff;
  img += (hash(uv * uRes + fract(uTime) * 100.0) - 0.5) * 0.045 * eff;
  if (uReduced < 0.5) {
    img *= 1.0 + 0.012 * sin(uTime * 110.0);
  }
  img *= 1.0 + uPulse * 0.12;

  // grain seed shared with power-on
  float g = hash(uv * (uRes * 0.5) + fract(uTime * 13.0) * 91.0);

  // press-and-hold: clean photo
  img = mix(img, samplePhoto(uTex, clamp(vUv, 0.0, 1.0), uTexAspect), uHold * 0.55);

  // vignette + softened edges
  float d = distance(vUv, vec2(0.5));
  img *= smoothstep(0.85, 0.35, d) * 0.35 + 0.65;

  // CRT power-on sequence
  float p = uPower;
  vec3 col = img;
  if (p < 0.999) {
    if (p < 0.22) {
      float w = mix(0.04, 0.5, p / 0.22);
      float line = smoothstep(0.004, 0.0, abs(vUv.y - 0.5)) * step(abs(vUv.x - 0.5), w);
      col = vec3(0.85, 0.87, 0.9) * line;
    } else if (p < 0.62) {
      float h = mix(0.004, 0.55, (p - 0.22) / 0.40);
      float inband = step(abs(vUv.y - 0.5), h);
      float edge = smoothstep(h, h - 0.012, abs(vUv.y - 0.5)) * inband;
      col = mix(vec3(0.0), img * 0.6 + vec3(0.35) * g * 0.4, inband);
      col += vec3(0.7) * (inband - edge);
    } else {
      float k = smoothstep(0.62, 1.0, p);
      col = mix(vec3(0.6) * g + 0.15, img, k);
    }
    float dd = distance(vUv, vec2(0.5));
    col *= smoothstep(0.85, 0.35, dd) * 0.35 + 0.65;
  }

  gl_FragColor = vec4(col, 1.0);
}
`

const BLACK_TEX_DATA = new Uint8Array([4, 4, 6, 255])

export function CrtGallery() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ch, setCh] = useState(0)
  const [on, setOn] = useState(false)
  const [hold, setHold] = useState(false)
  const [failed, setFailed] = useState(false)
  const apiRef = useRef<{ go: (d: number) => void; power: () => void } | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.className = 'crt-canvas'
    host.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms: { [k: string]: THREE.IUniform } = {
      uTex: { value: new THREE.DataTexture(BLACK_TEX_DATA, 1, 1) },
      uTexB: { value: new THREE.DataTexture(BLACK_TEX_DATA, 1, 1) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uTexAspect: { value: 1 },
      uTexAspectB: { value: 1 },
      uPlaneAspect: { value: 1 },
      uMix: { value: 0 },
      uSyncAmt: { value: 0 },
      uLinePos: { value: -1 },
      uLineStr: { value: 0 },
      uPower: { value: reduced ? 1 : 0 },
      uHold: { value: 0 },
      uPulse: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
    }
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    mesh.frustumCulled = false
    scene.add(mesh)

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    const cache = new Map<number, THREE.Texture>()
    let index = 0
    let powered = reduced
    let powerT0 = -1
    let trans: { t0: number; wait0: number; pending: number | null; swapped: boolean } | null = null
    let holdTarget = 0
    let raf = 0
    let running = true
    let tActive = 0
    let lastNow = performance.now()
    let disposed = false

    const applyTexture = (i: number) => {
      const tex = cache.get(i)
      if (!tex) return
      uniforms.uTex.value = tex
      const img = tex.image as { width?: number; height?: number }
      if (img?.width && img?.height) uniforms.uTexAspect.value = img.width / img.height
    }

    const load = async (i: number) => {
      if (cache.has(i)) return
      try {
        const tex = await loader.loadAsync(PHOTOS[i].src)
        if (disposed) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.generateMipmaps = false
        cache.set(i, tex)
        if (i === index) applyTexture(i)
      } catch {
        /* keep black frame, OSD still works */
      }
    }

    const preload = (i: number) => {
      for (const j of [i - 1, i, i + 1]) {
        const k = (j + PHOTOS.length) % PHOTOS.length
        void load(k)
      }
      for (const [k, tex] of cache) {
        const dist = Math.min(Math.abs(k - i), PHOTOS.length - Math.abs(k - i))
        if (dist > 1) {
          tex.dispose()
          cache.delete(k)
        }
      }
    }

    // sync-loss transition, ~350ms: bands shear → v-roll + sync line → settle
    const SYNC_MS = reduced ? 0 : 350
    const POWER_MS = 1100
    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
      return t * t * (3 - 2 * t)
    }

    const setTexB = (i: number) => {
      const tex = cache.get(i)
      if (!tex) return false
      uniforms.uTexB.value = tex
      const img = tex.image as { width?: number; height?: number }
      if (img?.width && img?.height) uniforms.uTexAspectB.value = img.width / img.height
      return true
    }

    const resetTrans = () => {
      trans = null
      uniforms.uSyncAmt.value = 0
      uniforms.uMix.value = 0
      uniforms.uLineStr.value = 0
      uniforms.uPulse.value = 0
    }

    const go = (d: number) => {
      // watchdog: a stuck transition must never brick navigation
      if (trans && performance.now() - trans.wait0 > 2500) resetTrans()
      if (!powered || trans) return
      const next = (index + d + PHOTOS.length) % PHOTOS.length
      if (reduced) {
        // instant cut, no sync play
        index = next
        applyTexture(index)
        setCh(index)
        preload(index)
        uniforms.uPulse.value = 1
        return
      }
      void load(next)
      trans = { t0: -1, wait0: performance.now(), pending: next, swapped: false }
      navigator.vibrate?.(8)
    }

    const power = () => {
      if (powered) return
      powered = true
      powerT0 = performance.now()
      setOn(true)
      if (reduced) {
        uniforms.uPower.value = 1
      }
      preload(index)
      navigator.vibrate?.(12)
    }

    apiRef.current = { go, power }

    // ponytail: no tap-to-play gate — power on at mount
    power()

    const resize = () => {
      const w = Math.max(host.clientWidth, 1)
      const h = Math.max(host.clientHeight, 1)
      renderer.setSize(w, h, false)
      uniforms.uPlaneAspect.value = w / h
      ;(uniforms.uRes.value as THREE.Vector2).set(
        Math.floor(w * renderer.getPixelRatio()),
        Math.floor(h * renderer.getPixelRatio()),
      )
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // initial texture
    if (reduced) {
      void load(0).then(() => preload(0))
      setOn(true)
    } else {
      void load(0)
    }

    const loop = (now: number) => {
      if (!running || disposed) return
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - lastNow) / 1000, 0.1)
      lastNow = now
      tActive += dt
      uniforms.uTime.value = tActive

      // power-on progress
      if (powerT0 >= 0 && uniforms.uPower.value < 1) {
        const k = Math.min((now - powerT0) / POWER_MS, 1)
        uniforms.uPower.value = k
        if (k >= 1) {
          powerT0 = -1
          setOn(true)
          preload(index)
        }
      }

      // channel transition: wait for next texture, then sync-loss timeline
      if (trans && trans.pending !== null) {
        if (trans.t0 < 0) {
          if (cache.has(trans.pending)) {
            setTexB(trans.pending)
            trans.t0 = now
          } else if (now - trans.wait0 > 600) {
            // texture slow: begin anyway, cut through when it arrives
            trans.t0 = now
          } else {
            // holding old picture steady until the next channel is ready
          }
        }
        if (trans.t0 >= 0) {
          const el = now - trans.t0
          const k = Math.min(el / SYNC_MS, 1)
          const env = k < 0.25 ? k / 0.25 : k < 0.7 ? 1 : Math.max(1 - (k - 0.7) / 0.3, 0)
          uniforms.uSyncAmt.value = env
          uniforms.uMix.value = smoothstep(0.35, 0.65, k)
          if (k > 0.3 && k < 0.72) {
            const lk = (k - 0.3) / 0.42
            uniforms.uLinePos.value = lk
            uniforms.uLineStr.value = Math.sin(lk * Math.PI) * 0.85
          } else {
            uniforms.uLineStr.value = 0
          }
          uniforms.uPulse.value = Math.max(1 - k * 2.2, 0)
          if (k >= 0.5 && !trans.swapped) {
            if (cache.has(trans.pending)) {
              index = trans.pending
              applyTexture(index)
              setTexB(index)
              setCh(index)
              preload(index)
            }
            trans.swapped = true
          }
          if (k >= 1) {
            if (!trans.swapped && cache.has(trans.pending)) {
              index = trans.pending
              applyTexture(index)
              setCh(index)
              preload(index)
            }
            trans = null
            uniforms.uSyncAmt.value = 0
            uniforms.uMix.value = 0
            uniforms.uLineStr.value = 0
            uniforms.uPulse.value = 0
          }
        }
      } else if (!trans && (uniforms.uSyncAmt.value as number) > 0) {
        // drag-preview wobble decays when released below threshold
        uniforms.uSyncAmt.value = Math.max((uniforms.uSyncAmt.value as number) - dt * 3, 0)
      }

      // hold easing
      const h = uniforms.uHold.value as number
      uniforms.uHold.value = h + (holdTarget - h) * Math.min(dt * 7, 1)

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame((n) => {
      lastNow = n
      loop(n)
    })

    const pause = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const resume = () => {
      if (running || disposed) return
      running = true
      lastNow = performance.now()
      raf = requestAnimationFrame((n) => {
        lastNow = n
        loop(n)
      })
    }
    const onVis = () => (document.hidden ? pause() : resume())
    document.addEventListener('visibilitychange', onVis)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? resume() : pause()), {
      threshold: 0.02,
    })
    io.observe(host)

    // gestures: horizontal = channel, vertical = native scroll (never blocked)
    let sx = 0
    let sy = 0
    let downT = 0
    let tracking = false
    let vertical = false
    let holdTimer = 0
    let held = false
    let pid = -1

    const clearHold = () => {
      window.clearTimeout(holdTimer)
      if (held) {
        held = false
        holdTarget = 0
        setHold(false)
      }
    }

    const onDown = (e: PointerEvent) => {
      resume() // loop may have paused while visible — never eat a tap
      if (tracking) {
        // stale gesture (shouldn't happen with window-level up/cancel) — reset
        tracking = false
        pid = -1
      }
      tracking = true
      vertical = false
      pid = e.pointerId
      sx = e.clientX
      sy = e.clientY
      downT = performance.now()
      holdTimer = window.setTimeout(() => {
        if (tracking && !vertical) {
          held = true
          holdTarget = 1
          setHold(true)
        }
      }, 350)
    }

    const onMove = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== pid) return
      const dx = e.clientX - sx
      const dy = e.clientY - sy
      if (!vertical && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        // clearly horizontal: live sync-wobble hint, vertical scroll untouched
        if (!trans) uniforms.uSyncAmt.value = Math.min(Math.abs(dx) / 300, 0.3)
        window.clearTimeout(holdTimer)
      } else if (Math.abs(dy) > 24 && Math.abs(dy) >= Math.abs(dx)) {
        // vertical: hand back to browser scroll entirely
        vertical = true
        tracking = false
        clearHold()
        if (!trans) uniforms.uSyncAmt.value = 0
      } else if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        window.clearTimeout(holdTimer)
      }
    }

    const onUp = (e: PointerEvent) => {
      // NOTE: pointerup listens on window — releasing outside still ends the gesture,
      // otherwise tracking sticks and taps die ("photos don't advance")
      if (!powered || e.pointerId !== pid) return
      const wasHeld = held
      const wasVertical = vertical
      clearHold()
      tracking = false
      pid = -1
      if (wasVertical || wasHeld || trans) {
        return
      }
      const dx = e.clientX - sx
      const dt = performance.now() - downT
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - sy) * 1.2) {
        uniforms.uSyncAmt.value = 0
        go(dx < 0 ? 1 : -1)
      } else if (dt < 300 && Math.hypot(dx, e.clientY - sy) < 12) {
        const r = host.getBoundingClientRect()
        go(e.clientX - r.left > r.width * 0.4 ? 1 : -1)
      } else {
        if (!trans) uniforms.uSyncAmt.value = 0
      }
    }

    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== pid) return
      clearHold()
      tracking = false
      pid = -1
      if (!trans) uniforms.uSyncAmt.value = 0
    }

    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.clearTimeout(holdTimer)
      for (const tex of cache.values()) tex.dispose()
      ;(uniforms.uTex.value as THREE.Texture).dispose?.()
      mesh.geometry.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      apiRef.current = null
    }
  }, [])

  if (failed) {
    // ponytail: no-WebGL fallback, same OSD, tap zones only
    const prev = () => setCh((c) => (c - 1 + PHOTOS.length) % PHOTOS.length)
    const next = () => setCh((c) => (c + 1) % PHOTOS.length)
    return (
      <section className="crt-gallery" aria-label="Photo archive">
        <div className="crt-fallback">
          <img src={PHOTOS[ch].src} alt={PHOTOS[ch].alt} />
          <button type="button" className="crt-tapzone crt-tapzone--l" onClick={prev} aria-label="Previous photo" />
          <button type="button" className="crt-tapzone crt-tapzone--r" onClick={next} aria-label="Next photo" />
        </div>
        <CrtOsd ch={ch} dim={false} />
      </section>
    )
  }

  return (
    <section className="crt-gallery" aria-label="Photo archive — swipe sideways for channels, scroll down for details">
      <div ref={hostRef} className="crt-screen" role="region" aria-label={`Channel ${ch + 1} of ${PHOTOS.length}`}>
        {!on && (
          <div className="crt-tap-hint" aria-hidden="true">
            TAP&nbsp;TO&nbsp;PLAY&nbsp;▶
          </div>
        )}
        <CrtOsd ch={ch} dim={hold} hidden={!on} />
        <span className="crt-live" aria-live="polite">
          {on ? `Channel ${ch + 1} of ${PHOTOS.length}` : 'Screen off'}
        </span>
      </div>
    </section>
  )
}

function CrtOsd({ ch, dim, hidden }: { ch: number; dim: boolean; hidden?: boolean }) {
  if (hidden) return null
  return (
    <div className={`crt-osd${dim ? ' crt-osd--dim' : ''}`} aria-hidden="true">
      <span className="crt-osd--tl">CH&nbsp;{String(ch + 1).padStart(2, '0')}</span>
      <span className="crt-osd--br">SP</span>
    </div>
  )
}

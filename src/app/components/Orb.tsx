'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = { className?: string }

// minimal shape so we don't rely on THREE.BufferAttribute type
interface PositionAttr {
  count: number
  getX(i: number): number
  getY(i: number): number
  getZ(i: number): number
}

export default function Orb({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3)

    // Resize to wrapper
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.floor(r.width))
      const h = Math.max(1, Math.floor(r.height))
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    requestAnimationFrame(resize)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const p1 = new THREE.PointLight(0x66ccff, 1.0); p1.position.set(2.5, 2, 2); scene.add(p1)
    const p2 = new THREE.PointLight(0xff66aa, 0.9); p2.position.set(-2, -1.5, 1.5); scene.add(p2)

    // Group + geometry
    const group = new THREE.Group()
    scene.add(group)

    const geo = new THREE.SphereGeometry(1, 64, 64)

    // ---- Vertex colors (rainbow) without referencing BufferAttribute type ----
    const posAttr = geo.getAttribute('position') as unknown as PositionAttr
    const count = posAttr.count
    const colors = new Float32Array(count * 3)
    const tmp = new THREE.Vector3()
    const col = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // read vertex position
      tmp.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).normalize()
      // map to hue/lightness
      const u = Math.atan2(tmp.z, tmp.x) / (Math.PI * 2) + 0.5 // 0..1
      const v = tmp.y * 0.5 + 0.5                                // 0..1
      col.setHSL(u, 0.75, 0.45 + 0.25 * (v - 0.5))
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.25,
      roughness: 0.35,
      emissive: new THREE.Color(0x0b1020),
      emissiveIntensity: 0.15,
    })

    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)

    // Pointer parallax
    let targetRX = 0
    let targetRY = 0
    const onPointer = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width * 2 - 1
      const ny = (e.clientY - r.top) / r.height * 2 - 1
      targetRY = nx * 0.4
      targetRX = -ny * 0.3
    }
    wrap.addEventListener('pointermove', onPointer, { passive: true })

    // Animate
    let t = 0
    renderer.setAnimationLoop(() => {
      t += 0.016
      const s = 1 + Math.sin(t * 1.5) * 0.03
      mesh.scale.setScalar(s)
      group.rotation.x += (targetRX - group.rotation.x) * 0.08
      group.rotation.y += (targetRY - group.rotation.y) * 0.08
      group.rotation.y += 0.01
      renderer.render(scene, camera)
    })

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null)
      wrap.removeEventListener('pointermove', onPointer)
      ro.disconnect()
      geo.dispose(); mat.dispose(); renderer.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className={`relative touch-none ${className ?? 'w-28 h-28'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      <div className="pointer-events-none absolute inset-0 rounded-full
                      bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(244,114,182,.15),transparent_40%)]" />
    </div>
  )
}

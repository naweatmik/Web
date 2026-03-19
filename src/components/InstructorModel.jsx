import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export const MALE_URL   = 'https://threejs.org/examples/models/gltf/Soldier.glb'
export const FEMALE_URL = 'https://threejs.org/examples/models/gltf/Michelle.glb'

// 애니메이션 우선순위: 활동적인 것부터
const ACTIVE_PRIORITY  = /run|dance|walk|jump|wave/i
const IDLE_PRIORITY    = /idle|tpose/i

function pickAnim(names, pattern) {
  return names.find(n => pattern.test(n))
}

function Character({ modelUrl, hovered, baseRotation = Math.PI }) {
  const group   = useRef()
  const { scene, animations } = useGLTF(modelUrl)
  const cloned  = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions, names } = useAnimations(animations, group)
  const [current, setCurrent] = useState(null)

  // 초기 애니메이션 — 활동적인 것 우선
  useEffect(() => {
    if (!names.length) return
    const first = pickAnim(names, ACTIVE_PRIORITY) ?? names[0]
    actions[first]?.play()
    setCurrent(first)
  }, [actions, names])

  // 호버 시 다른 활동 애니메이션으로 전환
  useEffect(() => {
    if (!current || !names.length) return
    const active = pickAnim(names, ACTIVE_PRIORITY)
    const all    = names.filter(n => !IDLE_PRIORITY.test(n))
    // 호버: 현재와 다른 활동 애니메이션으로 순환
    const next = hovered
      ? (all.find(n => n !== current) ?? active ?? current)
      : (active ?? current)
    if (!next || next === current) return
    actions[current]?.fadeOut(0.35)
    actions[next]?.reset().fadeIn(0.35).play()
    setCurrent(next)
  }, [hovered]) // eslint-disable-line

  // 앞을 보면서 살짝 좌우 스웨이
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = baseRotation + Math.sin(state.clock.elapsedTime * 0.4) * 0.18
    }
  })

  return (
    <group ref={group} position={[0, -0.9, 0]} scale={1.1}>
      <primitive object={cloned} />
    </group>
  )
}

export default function InstructorModel({ modelUrl = MALE_URL, accent = '#9333ea', baseRotation = Math.PI }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="instructorModelWrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0.6, 3.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.6} castShadow />
        <pointLight position={[-3, 3, -1]} intensity={2}   color={accent} />
        <pointLight position={[3, 1, 2]}   intensity={1}   color="#60a5fa" />

        <Character modelUrl={modelUrl} hovered={hovered} baseRotation={baseRotation} />

        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.35}
          scale={3}
          blur={2}
          far={1.5}
        />

        <Environment preset="city" background={false} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.3, 0]}
        />
      </Canvas>

      <div className="instructorModelHint">
        {hovered ? '✨' : '드래그로 회전'}
      </div>
    </div>
  )
}

useGLTF.preload(MALE_URL)
useGLTF.preload(FEMALE_URL)

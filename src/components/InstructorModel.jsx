import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export const MALE_URL   = `${import.meta.env.BASE_URL}models/GangnamStyle.fbx`
export const FEMALE_URL = `${import.meta.env.BASE_URL}models/HipHopDancing.fbx`

const ACTIVE_PRIORITY = /run|dance|walk|jump|wave|sitting|angry/i

function GLBCharacter({ modelUrl, baseRotation }) {
  const outer = useRef()
  const root  = useRef()

  const { scene, animations } = useGLTF(modelUrl)
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const { actions, names } = useAnimations(animations, root)

  useMemo(() => {
    const box    = new THREE.Box3().setFromObject(cloned)
    const size   = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim <= 0 || !isFinite(maxDim)) return
    const scale  = 1.8 / maxDim
    cloned.scale.setScalar(scale)
    cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
  }, [cloned])

  useEffect(() => {
    if (!names.length) return
    const first = names.find(n => ACTIVE_PRIORITY.test(n)) ?? names[0]
    actions[first]?.play()
  }, [actions, names])

  useFrame((state) => {
    if (outer.current)
      outer.current.rotation.y = baseRotation + Math.sin(state.clock.elapsedTime * 0.4) * 0.18
  })

  return (
    <group ref={outer} position={[0, -0.9, 0]}>
      <primitive ref={root} object={cloned} />
    </group>
  )
}

function FBXCharacter({ modelUrl, baseRotation }) {
  const group = useRef()
  const fbx   = useLoader(FBXLoader, modelUrl)
  const { actions, names } = useAnimations(fbx.animations, group)

  useEffect(() => {
    if (!names.length) return
    actions[names[0]]?.reset().play()
  }, [actions, names])

  useFrame((state) => {
    if (group.current)
      group.current.rotation.y = baseRotation + Math.sin(state.clock.elapsedTime * 0.4) * 0.18
  })

  return (
    <group ref={group} position={[0, -1.2, 0]} scale={0.017}>
      <primitive object={fbx} />
    </group>
  )
}

export default function InstructorModel({ modelUrl = MALE_URL, accent = '#9333ea', baseRotation = Math.PI }) {
  const isFBX = modelUrl.toLowerCase().endsWith('.fbx')

  return (
    <div className="instructorModelWrap">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 46 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={1}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 8, 4]} intensity={1.6} />
        <pointLight position={[-3, 3, -1]} intensity={2} color={accent} />

        <Suspense fallback={null}>
          {isFBX
            ? <FBXCharacter modelUrl={modelUrl} baseRotation={baseRotation} />
            : <GLBCharacter modelUrl={modelUrl} baseRotation={baseRotation} />
          }
        </Suspense>

        <Environment preset="city" background={false} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.3, 0]}
        />
      </Canvas>

      <div className="instructorModelHint">드래그로 회전</div>
    </div>
  )
}


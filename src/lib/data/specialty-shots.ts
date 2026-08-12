export type SpecialtyMethod = 'Capture' | 'Generate' | 'Edit' | 'Hybrid';

export interface SpecialtyShot {
  slug: string;
  name: string;
  family: string;
  method: SpecialtyMethod;
  description: string;
  recipe: string;
}

export const specialtyShots: SpecialtyShot[] = [
  { slug: 'speed-ramp', name: 'Speed Ramp', family: 'Time', method: 'Edit', description: 'Acceleration and deceleration shaped around one decisive action.', recipe: 'High-frame-rate source · velocity curve · motion-aware retiming' },
  { slug: 'bullet-time', name: 'Bullet Time', family: 'Time', method: 'Hybrid', description: 'Time nearly freezes while viewpoint continues moving through the scene.', recipe: 'Multi-view capture or generated orbit · temporal interpolation' },
  { slug: 'dolly-zoom', name: 'Dolly Zoom', family: 'Lens', method: 'Generate', description: 'Subject scale holds while perspective stretches or compresses around them.', recipe: 'Opposed physical dolly and focal-length change' },
  { slug: 'snorricam', name: 'Snorricam', family: 'Rig', method: 'Generate', description: 'Camera locks to the performer while the world moves violently behind them.', recipe: 'Body-mounted viewpoint · fixed subject distance · wide lens' },
  { slug: 'bolt-cam', name: 'Bolt Cam', family: 'Rig', method: 'Generate', description: 'A rotating camera remains mechanically attached to a moving object.', recipe: 'Object-locked camera · axial roll · environmental motion' },
  { slug: 'fpv-dive', name: 'FPV Dive', family: 'Flight', method: 'Generate', description: 'Aggressive aerial descent threads through architecture at speed.', recipe: 'Continuous flight path · banking roll · proximity acceleration' },
  { slug: 'pass-through', name: 'Object Pass-Through', family: 'Impossible', method: 'Generate', description: 'The lens travels through a solid object into a connected scene.', recipe: 'Occlusion bridge · matched geometry · uninterrupted camera path' },
  { slug: 'locked-on', name: 'Locked-On Subject', family: 'Tracking', method: 'Generate', description: 'One body point stays pinned in frame as movement erupts around it.', recipe: 'Subject tracking · frame lock · stabilized background displacement' },
  { slug: 'infinite-zoom', name: 'Infinite Zoom', family: 'Impossible', method: 'Hybrid', description: 'Nested worlds continually reveal themselves without reaching an endpoint.', recipe: 'Recursive compositions · scale match · seamless nested transition' },
  { slug: 'match-motion', name: 'Match-Motion Transition', family: 'Transition', method: 'Hybrid', description: 'Two shots connect through identical direction, speed, and silhouette.', recipe: 'Motion vector match · subject alignment · hidden cut' },
  { slug: 'slit-scan', name: 'Slit-Scan', family: 'Optical', method: 'Edit', description: 'Different moments occupy different spatial slices of the same frame.', recipe: 'Temporal displacement · directional scan · controlled distortion' },
  { slug: 'step-print', name: 'Step-Print / Stutter', family: 'Time', method: 'Edit', description: 'Repeated or skipped frames turn natural motion into a rhythmic texture.', recipe: 'Frame cadence · repetition pattern · optional motion trails' }
];

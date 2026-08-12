export interface CameraMove {
  slug: string;
  name: string;
  family: string;
  description: string;
  intention: string;
  type: number;
  duration: number;
  lens: string;
  seedancePrompt: string;
  soraPrompt: string;
}

export const cameraMoves: CameraMove[] = [
  {
    slug: 'dolly-in', name: 'Dolly In', family: 'Linear', type: 0, duration: 5, lens: '50mm',
    description: 'The camera travels directly toward the subject while perspective naturally deepens.',
    intention: 'Attention · intimacy · realization',
    seedancePrompt: '5-second shot. Camera begins in a medium-wide 50mm composition and performs one smooth, constant-speed dolly directly toward the subject, ending in a tight medium close-up. Preserve natural parallax in foreground and background; the subject remains centered and holds eye line. No zoom, no orbit, no cuts, silent.',
    soraPrompt: 'A single silent five-second shot with a physical camera dolly moving smoothly toward the centered subject, beginning medium-wide on a 50mm lens and ending in a tight medium close-up. Foreground and background separate with realistic parallax; no lens zoom, orbit, shake, or cut.'
  },
  {
    slug: 'dolly-out', name: 'Dolly Out', family: 'Linear', type: 1, duration: 5, lens: '40mm',
    description: 'The camera retreats from the subject to reveal environment, isolation, or consequence.',
    intention: 'Reveal · isolation · scale',
    seedancePrompt: '5-second single take. Begin close on the subject with a 40mm lens, then dolly backward on a straight track at an even speed until the full environment is revealed. Maintain subject scale changes and convincing parallax. No zoom, no pan, no cuts, silent.',
    soraPrompt: 'A silent five-second physical dolly-out: start close on the subject with a 40mm cinematic lens and retreat in a perfectly straight, smooth path to reveal the complete environment. Keep perspective and parallax physically coherent; no zoom or edit.'
  },
  {
    slug: 'orbit-left', name: 'Orbit Left', family: 'Arc', type: 2, duration: 6, lens: '50mm',
    description: 'The camera circles the subject counterclockwise while maintaining a constant focal target.',
    intention: 'Presence · dimensionality · tension',
    seedancePrompt: '6-second single shot. Orbit counterclockwise 120 degrees around the subject at constant radius and height on a 50mm lens. Keep the subject locked to the center of frame while the background rotates with strong, natural parallax. Smooth stabilized movement, no zoom, no cuts, silent.',
    soraPrompt: 'A silent six-second counterclockwise orbit around one stationary subject, covering roughly 120 degrees at a fixed radius and camera height. The 50mm camera continuously looks at the subject while the background reveals realistic layered parallax.'
  },
  {
    slug: 'orbit-right', name: 'Orbit Right', family: 'Arc', type: 3, duration: 6, lens: '50mm',
    description: 'A clockwise circular move that reveals the subject and surrounding spatial relationships.',
    intention: 'Reveal · confidence · spectacle',
    seedancePrompt: '6-second single shot. Smooth clockwise orbit of 120 degrees around the subject, constant radius, constant eye-level height, 50mm lens. Aim continuously at the subject and preserve coherent background parallax. No zoom, no cuts, silent.',
    soraPrompt: 'A single silent six-second clockwise camera orbit around a stationary subject, fixed radius and eye-level height, with the camera continuously aimed at the subject. Natural 50mm perspective and coherent background parallax.'
  },
  {
    slug: 'truck-left', name: 'Truck Left', family: 'Lateral', type: 4, duration: 5, lens: '35mm',
    description: 'The camera moves laterally across the scene without changing its viewing direction.',
    intention: 'Discovery · geography · momentum',
    seedancePrompt: '5-second lateral tracking shot. Camera trucks left along a perfectly straight path at constant height using a 35mm lens, maintaining the same forward viewing direction. Foreground objects cross frame faster than the subject and background. No pan, no orbit, no cuts, silent.',
    soraPrompt: 'A silent five-second camera truck to the left on a straight parallel track, fixed height and fixed forward orientation, photographed on a 35mm lens. Emphasize clean multi-plane parallax without panning or orbiting.'
  },
  {
    slug: 'crane-down', name: 'Crane Down', family: 'Vertical', type: 5, duration: 6, lens: '32mm',
    description: 'The camera descends from an elevated overview into the subject’s immediate space.',
    intention: 'Scale-to-intimacy · arrival · focus',
    seedancePrompt: '6-second crane move. Start high and wide on a 32mm lens, descend smoothly while easing slightly toward the subject, and finish at eye level in a medium composition. Keep the subject as the focal target throughout. One continuous move, no zoom, no cuts, silent.',
    soraPrompt: 'A silent six-second crane descent beginning high above the location and moving smoothly down and slightly forward toward one subject, finishing at eye level. Natural 32mm perspective, continuous focal targeting, no cut or zoom.'
  },
  {
    slug: 'pedestal-up', name: 'Pedestal Up', family: 'Vertical', type: 6, duration: 4, lens: '65mm',
    description: 'The camera rises vertically while maintaining its angle and relationship to the subject.',
    intention: 'Reveal · elegance · transformation',
    seedancePrompt: '4-second pedestal-up shot. Raise the camera vertically from waist height to above eye level while holding distance, lens angle, and 65mm focal length constant. The subject stays framed consistently as new background detail is revealed. Silent, no cuts.',
    soraPrompt: 'A silent four-second vertical pedestal move, rising smoothly from waist height to above eye level without tilting, orbiting, zooming, or changing distance. Use a compressed 65mm perspective and reveal the background progressively.'
  },
  {
    slug: 'arc-rise', name: 'Arc Rise', family: 'Compound', type: 7, duration: 7, lens: '28mm',
    description: 'A compound move that circles and rises, revealing both subject and environment.',
    intention: 'Finale · expansion · wonder',
    seedancePrompt: '7-second compound camera move. Begin low at the subject’s right side on a 28mm lens, orbit counterclockwise while steadily craning upward, and finish in a high three-quarter wide view. Keep the subject as the look-at target; smooth radius and altitude changes, no cuts, silent.',
    soraPrompt: 'A silent seven-second rising arc around one subject: begin low and close at the subject’s right, circle counterclockwise while climbing, and resolve in a high three-quarter environmental view. Wide 28mm perspective with coherent changing parallax.'
  },
  {
    slug: 'push-pan', name: 'Push + Pan', family: 'Compound', type: 8, duration: 6, lens: '40mm',
    description: 'A forward move combined with a controlled pan to transfer attention between subjects.',
    intention: 'Hand-off · discovery · narrative connection',
    seedancePrompt: '6-second continuous shot. Dolly forward slowly on a 40mm lens while panning from the foreground subject to a second subject deeper in frame. Complete one deliberate attention hand-off and finish with the second subject centered. No cut, no orbit, silent.',
    soraPrompt: 'A silent six-second camera push that moves physically forward while executing one slow pan from a foreground subject to a second person deeper in the scene. End centered on the second subject with realistic 40mm parallax and no edit.'
  },
  {
    slug: 'handheld-creep', name: 'Handheld Creep', family: 'Organic', type: 9, duration: 7, lens: '55mm',
    description: 'A restrained forward drift with subtle human instability rather than mechanical motion.',
    intention: 'Unease · observation · vulnerability',
    seedancePrompt: '7-second restrained handheld creep toward the subject on a 55mm lens. The operator advances slowly with subtle breathing-scale lateral and vertical drift, never losing the subject or becoming chaotic. Natural body inertia, no digital shake, no cuts, silent.',
    soraPrompt: 'A silent seven-second observational handheld approach on a 55mm lens. The camera operator slowly creeps toward the subject with restrained breathing-scale drift and realistic body inertia—uneasy but readable, never aggressively shaky.'
  },
  {
    slug: 'overhead-drop', name: 'Overhead Drop', family: 'Vertical', type: 10, duration: 6, lens: '24mm',
    description: 'A top-down camera descends toward a graphic arrangement while preserving the overhead angle.',
    intention: 'Pattern · precision · impact',
    seedancePrompt: '6-second top-down shot on a 24mm lens. Camera points straight down and descends vertically toward the center of the composition, keeping the graphic layout aligned and symmetrical. Constant orientation, smooth deceleration, no rotation, no cuts, silent.',
    soraPrompt: 'A silent six-second overhead camera drop: the 24mm camera faces perfectly downward and descends toward the exact center of a graphic arrangement. Preserve symmetry and orientation with smooth physical acceleration and no rotation.'
  },
  {
    slug: 'reveal-slide', name: 'Reveal Slide', family: 'Lateral', type: 11, duration: 5, lens: '45mm',
    description: 'A foreground obstruction clears as the camera slides sideways, revealing the subject.',
    intention: 'Suspense · entrance · visual punctuation',
    seedancePrompt: '5-second reveal shot. Begin with the subject fully obscured by a close foreground object, then slide the camera right on a straight track until the subject is cleanly revealed and centered. Use a 45mm lens and strong foreground parallax. No pan, no cuts, silent.',
    soraPrompt: 'A silent five-second lateral reveal: start with a close foreground object completely hiding the subject, then slide the physical camera smoothly right until the subject appears centered. Strong natural 45mm parallax, no pan or edit.'
  }
];

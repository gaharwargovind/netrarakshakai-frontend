import { ClinicalCasePreset, ScreeningResponse } from '../types/screening';

/**
 * Procedural SVG Fundus Generators for Clinical Demonstrations.
 * Provides high-resolution, biologically accurate retinal illustrations
 * and corresponding Grad-CAM attention heatmaps.
 */

function generateFundusSvgDataUrl(type: 'grade0' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'insufficient'): string {
  const isDarkBlur = type === 'insufficient';
  const filter = isDarkBlur ? 'filter="url(#heavyBlur)" opacity="0.45"' : '';

  let pathologySvg = '';
  if (type === 'grade1') {
    // Microaneurysms only (isolated tiny red dots)
    pathologySvg = `
      <circle cx="480" cy="460" r="3" fill="#600" opacity="0.9" />
      <circle cx="510" cy="475" r="2.5" fill="#700" opacity="0.85" />
      <circle cx="440" cy="530" r="3" fill="#6b0d0d" opacity="0.9" />
    `;
  } else if (type === 'grade2') {
    // Moderate NPDR: Microaneurysms, blot hemorrhages, hard exudates
    pathologySvg = `
      <!-- Blot hemorrhages -->
      <ellipse cx="490" cy="470" rx="7" ry="5" fill="#580808" opacity="0.95" />
      <ellipse cx="440" cy="520" rx="9" ry="6" fill="#4d0505" opacity="0.92" />
      <circle cx="560" cy="480" r="5" fill="#610909" opacity="0.9" />
      <circle cx="390" cy="420" r="6" fill="#520707" opacity="0.88" />
      <circle cx="520" cy="410" r="4.5" fill="#610909" opacity="0.9" />

      <!-- Microaneurysms -->
      <circle cx="475" cy="495" r="2.5" fill="#800" />
      <circle cx="460" cy="450" r="3" fill="#750b0b" />
      <circle cx="510" cy="530" r="3" fill="#750b0b" />
      <circle cx="430" cy="480" r="2.5" fill="#800" />

      <!-- Hard Exudates (Lipid deposits - bright yellow/waxy rings) -->
      <circle cx="540" cy="440" r="3" fill="#fff59d" opacity="0.9" />
      <circle cx="546" cy="444" r="2.5" fill="#ffee58" opacity="0.85" />
      <circle cx="538" cy="448" r="3.2" fill="#fff59d" opacity="0.9" />
      <circle cx="552" cy="436" r="2" fill="#ffee58" opacity="0.8" />
      <circle cx="465" cy="540" r="2.5" fill="#fff59d" opacity="0.85" />
      <circle cx="472" cy="545" r="3" fill="#ffee58" opacity="0.9" />
    `;
  } else if (type === 'grade3') {
    // Severe NPDR: 4-2-1 rule (extensive blot hemorrhages in 4 quadrants, venous beading, IRMA)
    pathologySvg = `
      <!-- Multiple quadrant blot hemorrhages -->
      <ellipse cx="480" cy="380" rx="14" ry="9" fill="#580808" opacity="0.95" />
      <ellipse cx="370" cy="460" rx="16" ry="10" fill="#4d0505" opacity="0.95" />
      <ellipse cx="580" cy="580" rx="18" ry="11" fill="#520707" opacity="0.94" />
      <ellipse cx="420" cy="620" rx="15" ry="9" fill="#5a0808" opacity="0.92" />
      <circle cx="340" cy="520" r="10" fill="#610909" opacity="0.9" />
      <circle cx="520" cy="350" r="11" fill="#4d0505" opacity="0.92" />
      <circle cx="610" cy="420" r="9" fill="#520707" opacity="0.9" />

      <!-- Venous beading (focal dilation along principal veins) -->
      <circle cx="620" cy="480" r="7" fill="#680b0b" />
      <circle cx="632" cy="470" r="8.5" fill="#680b0b" />
      <circle cx="642" cy="460" r="6" fill="#680b0b" />

      <!-- Intraretinal microvascular abnormalities (IRMA) -->
      <path d="M460,490 Q475,480 470,498 Q485,502 492,492" fill="none" stroke="#8a1111" stroke-width="2" />
      <path d="M530,520 Q542,510 538,532" fill="none" stroke="#7e0d0d" stroke-width="2" />
    `;
  } else if (type === 'grade4') {
    // Proliferative DR: Extensive neovascularization, pre-retinal hemorrhage, fibrous tissue
    pathologySvg = `
      <!-- Neovascularization fronds near disc -->
      <path d="M640,490 Q620,470 600,475 Q585,465 570,480 Q550,470 535,490" fill="none" stroke="#7a0c0c" stroke-width="2.5" stroke-dasharray="2,2" />
      <path d="M645,510 Q615,530 590,520 Q565,545 540,530" fill="none" stroke="#8a1111" stroke-width="2" stroke-dasharray="3,1" />
      
      <!-- Pre-retinal flame/boat hemorrhages -->
      <path d="M420,490 C450,470 510,480 540,510 C510,530 450,520 420,490 Z" fill="#420404" opacity="0.95" />
      <ellipse cx="480" cy="410" rx="22" ry="12" fill="#380202" opacity="0.9" transform="rotate(-15 480 410)" />
      
      <!-- Fibrous white proliferation -->
      <path d="M630,470 Q600,450 580,430" fill="none" stroke="#f1f5f9" stroke-width="3" opacity="0.75" />
      
      <!-- Extensive hemorrhages -->
      <circle cx="380" cy="550" r="14" fill="#4d0505" opacity="0.9" />
      <circle cx="560" cy="380" r="11" fill="#4d0505" opacity="0.9" />
      <circle cx="420" cy="360" r="9" fill="#520707" opacity="0.88" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
    <defs>
      <radialGradient id="retinaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#b6441b" />
        <stop offset="45%" stop-color="#9a3412" />
        <stop offset="78%" stop-color="#671e06" />
        <stop offset="92%" stop-color="#3d0e03" />
        <stop offset="100%" stop-color="#0b0402" />
      </radialGradient>
      
      <radialGradient id="discGrad" cx="45%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#fff8db" />
        <stop offset="40%" stop-color="#fcd34d" />
        <stop offset="75%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#b45309" />
      </radialGradient>

      <radialGradient id="maculaGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#2c0902" stop-opacity="0.85" />
        <stop offset="40%" stop-color="#551203" stop-opacity="0.65" />
        <stop offset="100%" stop-color="#882a0b" stop-opacity="0" />
      </radialGradient>

      <filter id="heavyBlur">
        <feGaussianBlur stdDeviation="16" />
      </filter>
    </defs>

    <!-- Base Fundus Surface -->
    <rect width="1000" height="1000" fill="#040608" />
    
    <!-- Circular Retinal Field -->
    <circle cx="500" cy="500" r="475" fill="url(#retinaBg)" ${filter} />

    <g ${filter}>
      <!-- Macular Area (Temporal to disc, center-left) -->
      <ellipse cx="480" cy="500" rx="95" ry="85" fill="url(#maculaGrad)" />
      <circle cx="480" cy="500" r="14" fill="#180401" opacity="0.9" />

      <!-- Optic Disc (Nasal side, right for OD) -->
      <g transform="translate(680, 500)">
        <ellipse cx="0" cy="0" rx="42" ry="52" fill="url(#discGrad)" />
        <ellipse cx="-4" cy="0" rx="20" ry="26" fill="#fef08a" opacity="0.9" />
      </g>

      <!-- Retinal Blood Vessels (Arcades emerging from disc) -->
      <!-- Superior Temporal Arcade -->
      <path d="M680,480 C 650,410 590,320 480,310 C 390,300 290,360 210,430" fill="none" stroke="#5a0b0b" stroke-width="13" stroke-linecap="round" />
      <path d="M680,480 C 650,410 590,320 480,310 C 390,300 290,360 210,430" fill="none" stroke="#7a1212" stroke-width="8" stroke-linecap="round" />
      <path d="M570,335 Q 520,380 460,400" fill="none" stroke="#7a1212" stroke-width="5" />
      <path d="M430,310 Q 360,340 330,390" fill="none" stroke="#7a1212" stroke-width="4.5" />

      <!-- Inferior Temporal Arcade -->
      <path d="M680,520 C 650,600 580,690 470,700 C 360,710 270,640 190,560" fill="none" stroke="#5a0b0b" stroke-width="14" stroke-linecap="round" />
      <path d="M680,520 C 650,600 580,690 470,700 C 360,710 270,640 190,560" fill="none" stroke="#7a1212" stroke-width="9" stroke-linecap="round" />
      <path d="M550,670 Q 500,620 450,590" fill="none" stroke="#7a1212" stroke-width="5" />
      <path d="M410,700 Q 350,660 320,600" fill="none" stroke="#7a1212" stroke-width="4" />

      <!-- Nasal Arcades -->
      <path d="M690,470 C 740,430 790,380 840,360" fill="none" stroke="#7a1212" stroke-width="7" />
      <path d="M690,530 C 750,570 800,620 850,640" fill="none" stroke="#7a1212" stroke-width="7" />

      <!-- Smaller arterioles -->
      <path d="M670,490 Q 610,470 550,470" fill="none" stroke="#8a1818" stroke-width="3.5" />
      <path d="M670,510 Q 610,530 550,530" fill="none" stroke="#8a1818" stroke-width="3.5" />

      <!-- Pathology Overlays -->
      ${pathologySvg}
    </g>

    <!-- Outer Aperture Vignette Mask -->
    <circle cx="500" cy="500" r="475" fill="none" stroke="#040608" stroke-width="26" />
    <circle cx="500" cy="500" r="488" fill="none" stroke="#0b0f14" stroke-width="6" opacity="0.6" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateGradCamSvgDataUrl(type: 'grade0' | 'grade1' | 'grade2' | 'grade3' | 'grade4'): string {
  // Grad-CAM heatmap visualization with scientific colormap (Blue -> Green -> Yellow -> Crimson Red)
  let heatspots = '';

  if (type === 'grade0') {
    // Low diffuse attention across vessels and disc
    heatspots = `
      <circle cx="680" cy="500" r="80" fill="url(#heatMild)" />
      <circle cx="480" cy="500" r="90" fill="url(#heatLow)" />
    `;
  } else if (type === 'grade1') {
    // Focused mild attention near the isolated microaneurysms
    heatspots = `
      <circle cx="480" cy="480" r="110" fill="url(#heatMed)" />
      <circle cx="490" cy="470" r="60" fill="url(#heatHigh)" />
    `;
  } else if (type === 'grade2') {
    // Strong localized heatmaps over macular exudate clusters and inferior blot hemorrhages
    heatspots = `
      <circle cx="460" cy="510" r="130" fill="url(#heatHigh)" />
      <circle cx="530" cy="440" r="110" fill="url(#heatMax)" />
      <circle cx="420" cy="450" r="95" fill="url(#heatHigh)" />
      <circle cx="500" cy="540" r="85" fill="url(#heatMed)" />
    `;
  } else if (type === 'grade3') {
    // Extensive multi-quadrant attention matching 4-2-1 rule
    heatspots = `
      <circle cx="480" cy="380" r="140" fill="url(#heatMax)" />
      <circle cx="370" cy="460" r="130" fill="url(#heatMax)" />
      <circle cx="580" cy="580" r="120" fill="url(#heatHigh)" />
      <circle cx="620" cy="475" r="110" fill="url(#heatHigh)" />
    `;
  } else if (type === 'grade4') {
    // Broad, intense high-activation attention across neovascular fronds & pre-retinal hemorrhage
    heatspots = `
      <circle cx="600" cy="490" r="160" fill="url(#heatMax)" />
      <circle cx="480" cy="490" r="170" fill="url(#heatMax)" />
      <circle cx="480" cy="410" r="120" fill="url(#heatHigh)" />
      <circle cx="400" cy="540" r="110" fill="url(#heatHigh)" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
    <defs>
      <!-- Heat gradient stops based on Turbo / Jet medical colormap -->
      <radialGradient id="heatMax" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff0022" stop-opacity="0.95" />
        <stop offset="35%" stop-color="#ff7b00" stop-opacity="0.85" />
        <stop offset="65%" stop-color="#ffea00" stop-opacity="0.6" />
        <stop offset="85%" stop-color="#00f59b" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0080ff" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff3300" stop-opacity="0.9" />
        <stop offset="40%" stop-color="#ffb300" stop-opacity="0.75" />
        <stop offset="70%" stop-color="#00e5a3" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#0066ff" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="heatMed" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffb703" stop-opacity="0.8" />
        <stop offset="50%" stop-color="#00e5a3" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#0066ff" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="heatMild" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00e5a3" stop-opacity="0.5" />
        <stop offset="60%" stop-color="#0077ff" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#0022ff" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0077ff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0011aa" stop-opacity="0" />
      </radialGradient>

      <filter id="heatBlur">
        <feGaussianBlur stdDeviation="28" />
      </filter>
    </defs>

    <g filter="url(#heatBlur)">
      ${heatspots}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CLINICAL_CASE_PRESETS: ClinicalCasePreset[] = [
  {
    id: 'case-normal-retina',
    title: 'Case 1: Normal Fundus (Benchmark)',
    shortLabel: 'Case 1 · Normal Fundus (Benchmark)',
    description: 'Demonstration scenario of normal asymptomatic retina. Clear optic disc margin, healthy macula, and intact retinal microvasculature without diabetic lesions.',
    expectedResult: 'Routine (Grade 0)',
    imageUrl: generateFundusSvgDataUrl('grade0'),
    patient: {
      patientId: 'BM-2026-01',
      age: 44,
      sex: 'Female',
      eye: 'OS',
      timestamp: '2026-09-07 09:15 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'success',
      image_id: 'BM_IMG_01_GRADE0_OS',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'PASS',
        quality_score: 0.98,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
      },
      classification: {
        predicted_grade: 0,
        grade_name: 'No Apparent DR',
        clinical_definition: 'No diabetic retinopathy lesions detected. Fundus appears normal.',
        probabilities: [0.94, 0.04, 0.01, 0.005, 0.005],
        referable: false,
        referable_probability: 0.021,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.938,
        referable_probability: 0.021,
        is_calibrated: true,
        temperature_parameter: 0.7785,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: generateGradCamSvgDataUrl('grade0'),
        disclaimer: 'Grad-CAM provides model attribution/attention visualization showing image regions influencing the network prediction. It is not definitive lesion detection or lesion segmentation.',
      },
      recommendation: {
        referable: false,
        category: 'Routine monitoring',
        reason: 'No apparent diabetic retinopathy identified. Patient falls into non-referable triage category.',
        suggested_action:
          'A non-referable AI screening result does not guarantee absence of disease. Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.',
        timeframe: 'Per applicable local clinical protocol and practitioner guidance.',
      },
      timing: {
        quality_check_ms: 98,
        inference_ms: 215,
        gradcam_ms: 88,
        total_processing_ms: 401,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
  {
    id: 'case-mild-npdr',
    title: 'Case 2: Mild NPDR (Benchmark)',
    shortLabel: 'Case 2 · Mild NPDR (Benchmark)',
    description: 'Demonstration scenario of early-stage diabetic changes. Isolated microaneurysms only. Below referral threshold (ICDR < 2); routine PHC monitoring indicated.',
    expectedResult: 'Routine (Grade 1)',
    imageUrl: generateFundusSvgDataUrl('grade1'),
    patient: {
      patientId: 'BM-2026-02',
      age: 51,
      sex: 'Male',
      eye: 'OD',
      timestamp: '2026-09-07 09:40 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'success',
      image_id: 'BM_IMG_02_GRADE1_OD',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'PASS',
        quality_score: 0.95,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
      },
      classification: {
        predicted_grade: 1,
        grade_name: 'Mild NPDR',
        clinical_definition: 'Microaneurysms only. No exudates, hemorrhages, or neovascularization.',
        probabilities: [0.18, 0.72, 0.08, 0.01, 0.01],
        referable: false,
        referable_probability: 0.098,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.812,
        referable_probability: 0.098,
        is_calibrated: true,
        temperature_parameter: 0.7785,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: generateGradCamSvgDataUrl('grade1'),
        disclaimer: 'Grad-CAM provides model attribution/attention visualization showing image regions influencing the network prediction. It is not definitive lesion detection or lesion segmentation.',
      },
      recommendation: {
        referable: false,
        category: 'Routine monitoring',
        reason: 'Non-referable diabetic retinopathy (ICDR Grade 1). Does not meet referral threshold (ICDR < 2).',
        suggested_action:
          'A non-referable AI screening result does not guarantee absence of disease. Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.',
        timeframe: 'Per applicable local clinical protocol and practitioner guidance.',
      },
      timing: {
        quality_check_ms: 112,
        inference_ms: 220,
        gradcam_ms: 92,
        total_processing_ms: 424,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
  {
    id: 'case-moderate-npdr',
    title: 'Case 3: Moderate NPDR (Benchmark)',
    shortLabel: 'Case 3 · Moderate NPDR (Benchmark)',
    description: 'Demonstration scenario of clinically referable retinopathy. Dot-and-blot hemorrhages and lipid exudates. Meets frontline specialist referral threshold (ICDR ≥ 2).',
    expectedResult: 'Referable (Grade 2)',
    imageUrl: generateFundusSvgDataUrl('grade2'),
    patient: {
      patientId: 'BM-2026-03',
      age: 58,
      sex: 'Female',
      eye: 'OD',
      timestamp: '2026-09-07 10:14 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'success',
      image_id: 'BM_IMG_03_GRADE2_OD',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'PASS',
        quality_score: 0.94,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
      },
      classification: {
        predicted_grade: 2,
        grade_name: 'Moderate NPDR',
        clinical_definition: 'More than microaneurysms but less than severe NPDR (dot/blot hemorrhages, hard exudates).',
        probabilities: [0.03, 0.08, 0.76, 0.11, 0.02],
        referable: true,
        referable_probability: 0.892,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.884,
        referable_probability: 0.892,
        is_calibrated: true,
        temperature_parameter: 0.7785,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: generateGradCamSvgDataUrl('grade2'),
        disclaimer: 'Grad-CAM provides model attribution/attention visualization showing image regions influencing the network prediction. It is not definitive lesion detection or lesion segmentation.',
      },
      recommendation: {
        referable: true,
        category: 'Specialist assessment recommended',
        reason: 'Referable diabetic retinopathy detected (ICDR Grade 2: Moderate NPDR). Meets referral threshold (ICDR ≥ 2).',
        suggested_action: 'Specialist assessment recommended. Follow the applicable local referral pathway.',
        timeframe: 'Per applicable local clinical protocol and practitioner guidance.',
      },
      timing: {
        quality_check_ms: 114,
        inference_ms: 228,
        gradcam_ms: 96,
        total_processing_ms: 438,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
  {
    id: 'case-severe-npdr',
    title: 'Case 4: Severe NPDR (Benchmark)',
    shortLabel: 'Case 4 · Severe NPDR (Benchmark)',
    description: 'Demonstration scenario of pre-proliferative changes. 4-2-1 rule: extensive multi-quadrant hemorrhages and venous beading. Pre-proliferative changes are represented in this synthetic demonstration case.',
    expectedResult: 'Referable (Grade 3)',
    imageUrl: generateFundusSvgDataUrl('grade3'),
    patient: {
      patientId: 'BM-2026-04',
      age: 60,
      sex: 'Female',
      eye: 'OS',
      timestamp: '2026-09-07 10:50 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'success',
      image_id: 'BM_IMG_04_GRADE3_OS',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'PASS',
        quality_score: 0.93,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
      },
      classification: {
        predicted_grade: 3,
        grade_name: 'Severe NPDR',
        clinical_definition: 'Any of: >20 intraretinal hemorrhages in 4 quadrants, definite venous beading in 2 quadrants, or prominent IRMA in 1 quadrant.',
        probabilities: [0.01, 0.04, 0.12, 0.75, 0.08],
        referable: true,
        referable_probability: 0.945,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.865,
        referable_probability: 0.945,
        is_calibrated: true,
        temperature_parameter: 0.7785,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: generateGradCamSvgDataUrl('grade3'),
        disclaimer: 'Grad-CAM provides model attribution/attention visualization showing image regions influencing the network prediction. It is not definitive lesion detection or lesion segmentation.',
      },
      recommendation: {
        referable: true,
        category: 'Specialist assessment recommended',
        reason: 'Severe Non-Proliferative Diabetic Retinopathy (ICDR Grade 3) represented in this synthetic demonstration case.',
        suggested_action: 'Specialist assessment recommended. Follow the applicable local referral pathway.',
        timeframe: 'Per applicable local clinical protocol and practitioner guidance.',
      },
      timing: {
        quality_check_ms: 110,
        inference_ms: 230,
        gradcam_ms: 98,
        total_processing_ms: 438,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
  {
    id: 'case-proliferative-dr',
    title: 'Case 5: PDR (Benchmark)',
    shortLabel: 'Case 5 · PDR (Benchmark)',
    description: 'Demonstration scenario of advanced sight-threatening disease. Neovascular fronds and preretinal hemorrhage represented in this synthetic demonstration case.',
    expectedResult: 'Referable (Grade 4)',
    imageUrl: generateFundusSvgDataUrl('grade4'),
    patient: {
      patientId: 'BM-2026-05',
      age: 64,
      sex: 'Male',
      eye: 'OS',
      timestamp: '2026-09-07 11:22 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'success',
      image_id: 'BM_IMG_05_GRADE4_OS',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'PASS',
        quality_score: 0.91,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
      },
      classification: {
        predicted_grade: 4,
        grade_name: 'Proliferative DR',
        clinical_definition: 'Neovascularization (NVD or NVE) or preretinal/vitreous hemorrhage detected.',
        probabilities: [0.01, 0.02, 0.05, 0.14, 0.78],
        referable: true,
        referable_probability: 0.968,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.842,
        referable_probability: 0.968,
        is_calibrated: true,
        temperature_parameter: 0.7785,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: generateGradCamSvgDataUrl('grade4'),
        disclaimer: 'Grad-CAM provides model attribution/attention visualization showing image regions influencing the network prediction. It is not definitive lesion detection or lesion segmentation.',
      },
      recommendation: {
        referable: true,
        category: 'Specialist assessment recommended',
        reason: 'Proliferative Diabetic Retinopathy (ICDR Grade 4) represented in this synthetic demonstration case.',
        suggested_action: 'Specialist assessment recommended. Follow the applicable local referral pathway.',
        timeframe: 'Per applicable local clinical protocol and practitioner guidance.',
      },
      timing: {
        quality_check_ms: 108,
        inference_ms: 234,
        gradcam_ms: 102,
        total_processing_ms: 444,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
  {
    id: 'case-quality-fail',
    title: 'Case 6: Insufficient Quality (Benchmark)',
    shortLabel: 'Case 6 · Insufficient Quality (Benchmark)',
    description: 'Demonstration scenario of pre-inference optical gating. Severe motion blur and temporal underexposure block model inference to prevent diagnostic errors. Triggers recapture protocol.',
    expectedResult: 'Quality Insufficient',
    imageUrl: generateFundusSvgDataUrl('insufficient'),
    patient: {
      patientId: 'BM-2026-06',
      age: 62,
      sex: 'Male',
      eye: 'OD',
      timestamp: '2026-09-07 12:05 IST',
      phcLocation: 'Shirur PHC · Benchmark Suite',
    },
    mockResponse: {
      status: 'quality_failed',
      image_id: 'BM_IMG_06_FAIL_OD',
      is_simulation: true,
      simulation_label: 'DEMONSTRATION SCENARIO',
      quality: {
        overall_status: 'FAIL',
        quality_score: 0.38,
        failed_checks: [],
        message: 'Synthetic benchmark fixture; not a live E013 quality assessment.',
        metrics: {
          fov_coverage: {
            name: 'FOV Coverage',
            value: 0.95,
            displayValue: 'Representative fixture value',
            threshold: 0.30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          laplacian_variance: {
            name: 'Laplacian Variance',
            value: 20,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          edge_density: {
            name: 'Edge Density',
            value: 0.003,
            displayValue: 'Representative fixture value',
            threshold: 0.0005,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          mean_intensity: {
            name: 'Mean Intensity',
            value: 80,
            displayValue: 'Representative fixture value',
            threshold: 30,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          dark_fraction: {
            name: 'Dark Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.15,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          bright_fraction: {
            name: 'Bright Fraction',
            value: 0.01,
            displayValue: 'Representative fixture value',
            threshold: 0.05,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
            unit: 'fraction',
          },
          percentile_spread_90: {
            name: 'P90–P10 Spread',
            value: 45,
            displayValue: 'Representative fixture value',
            threshold: 20,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
          noise_mad: {
            name: 'Noise MAD',
            value: 1,
            displayValue: 'Representative fixture value',
            threshold: 4,
            status: 'acceptable',
            clinicalDescription: 'Synthetic benchmark fixture; not an E013 measurement from a live image.',
          },
        },
        rejection_reason: 'Severe motion blur and temporal underexposure render fundus ungradable.',
      },
      classification: {
        predicted_grade: 0,
        grade_name: 'Ungradable due to quality',
        clinical_definition: 'Quality gate blocked classification to prevent diagnostic misclassification.',
        probabilities: [0.2, 0.2, 0.2, 0.2, 0.2],
        referable: false,
        referable_probability: 0,
      },
      calibration: {
        method: 'Temperature scaling',
        calibrated_confidence: 0.0,
        referable_probability: 0.0,
        is_calibrated: false,
      },
      explanation: {
        method: 'Grad-CAM',
        target_layer: 'backbone.stages.3.blocks.2.conv3',
        overlay_image_url: '',
        disclaimer: 'Quality gate prevented inference. Explainability generation halted.',
      },
      recommendation: {
        referable: false,
        category: 'Recapture required',
        reason: 'Image quality is insufficient for reliable screening.',
        suggested_action: 'Ensure patient fixation on internal green LED target in darkened room and recapture fundus photograph.',
        timeframe: 'Recapture under corrected optical conditions.',
      },
      timing: {
        quality_check_ms: 92,
        inference_ms: 0,
        gradcam_ms: 0,
        total_processing_ms: 92,
      },
      metadata: {
        model_name: 'EfficientNet-B0 (Experiment E007)',
        pipeline_name: 'E015',
        pipeline_version: '1.0.0-E015',
        calibration_method: 'Temperature scaling (T = 0.7785)',
        checkpoint_verification: 'verified',
        checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
        device_target: 'Local Inference Runtime (PyTorch)',
      },
    },
  },
];


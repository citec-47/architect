import React from 'react';
import './ReelScript.css';

const scenes = [
  {
    id: 1,
    duration: '3-5 sec',
    textOnScreen: 'Who really builds a building? 🤔',
    voiceover: 'Is it the architect or the engineer?',
    keywords: [
      'city skyline timelapse',
      'construction site aerial',
      'modern buildings drone',
    ],
  },
  {
    id: 2,
    duration: '8 sec',
    textOnScreen: 'Architect = Design + Creativity',
    voiceover:
      'I am an Architect. I design buildings that are beautiful, functional, and comfortable.',
    keywords: [
      'architect drawing plans',
      'architectural design office',
      'blueprint sketch',
      'modern house design laptop',
    ],
  },
  {
    id: 3,
    duration: '8 sec',
    textOnScreen: 'Engineer = Strength + Safety',
    voiceover: 'I am a Structural Engineer. I make sure buildings are strong and safe.',
    keywords: [
      'construction site steel beams',
      'engineer helmet inspection',
      'concrete pouring',
      'structural framework building',
    ],
  },
  {
    id: 4,
    duration: '6 sec',
    textOnScreen: 'Architect vs Engineer',
    voiceover: 'Architects design it. Engineers make sure it stands.',
    keywords: [
      'split screen architecture vs construction',
      'blueprint vs building structure',
    ],
  },
  {
    id: 5,
    duration: '8 sec',
    textOnScreen: 'Together they build the world 🌍',
    voiceover: 'Without both, no building can exist safely or beautifully.',
    keywords: [
      'teamwork construction site',
      'building completion',
      'skyscraper finishing',
    ],
  },
  {
    id: 6,
    duration: '5 sec',
    textOnScreen: 'Architecture + Engineering = The World',
    voiceover: 'Creativity + Strength = Everything around us.',
    keywords: [
      'beautiful city night lights',
      'finished modern skyscraper',
      'cinematic city view',
    ],
  },
];

const ReelScript = () => {
  return (
    <section className="reel-script" id="reel-script">
      <div className="container">
        <div className="reel-script-header">
          <h2>Short Video Script</h2>
          <p>Architect vs Engineer (Who Really Builds Buildings?)</p>
        </div>

        <div className="scene-grid">
          {scenes.map((scene) => (
            <article key={scene.id} className="scene-card">
              <div className="scene-meta">
                <span className="scene-number">Scene {scene.id}</span>
                <span className="scene-duration">{scene.duration}</span>
              </div>

              <h3>{scene.textOnScreen}</h3>

              <p className="voiceover">
                <strong>Voiceover:</strong> {scene.voiceover}
              </p>

              <div className="keywords-block">
                <h4>CapCut Keywords</h4>
                <ul>
                  {scene.keywords.map((keyword) => (
                    <li key={`${scene.id}-${keyword}`}>{keyword}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelScript;
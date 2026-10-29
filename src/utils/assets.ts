// Asset references with Vite bundling and static public fallbacks
import fracterraRefereeImg from '../assets/images/fracterra_dayak_forest_referee_1793010185625.jpg';
import fracterraDayakAltImg from '../assets/images/robot_dayak_fracterra_1792997026451.jpg';
import borneoBgImg from '../assets/images/borneo_rainforest_arena_bg_1793010185668.jpg';
import forestTrophyImg from '../assets/images/forest_rainforest_trophy_1793010185822.jpg';

export const ASSETS = {
  fracterraReferee: fracterraRefereeImg || '/assets/images/fracterra_dayak_forest_referee_1793010185625.jpg',
  fracterraAlt: fracterraDayakAltImg || '/assets/images/robot_dayak_fracterra_1792997026451.jpg',
  borneoBg: borneoBgImg || '/assets/images/borneo_rainforest_arena_bg_1793010185668.jpg',
  trophy: forestTrophyImg || '/assets/images/forest_rainforest_trophy_1793010185822.jpg',
  publicFallbacks: {
    fracterraReferee: '/assets/images/fracterra_dayak_forest_referee_1793010185625.jpg',
    fracterraAlt: '/assets/images/robot_dayak_fracterra_1792997026451.jpg',
    borneoBg: '/assets/images/borneo_rainforest_arena_bg_1793010185668.jpg',
    trophy: '/assets/images/forest_rainforest_trophy_1793010185822.jpg',
  }
};


import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import Template3 from '../components/templates/Template3';
import Template4 from '../components/templates/Template4';
import Template5 from '../components/templates/Template5';
import Template6 from '../components/templates/Template6';
import Template7 from '../components/templates/Template7';
import Template8 from '../components/templates/Template8';
import Template9 from '../components/templates/Template9';
import Template10 from '../components/templates/Template10';
import Template11 from '../components/templates/Template11';
import Template12 from '../components/templates/Template12';
import Template13 from '../components/templates/Template13';
import Template14 from '../components/templates/Template14';
import Template15 from '../components/templates/Template15';
import Template16 from '../components/templates/Template16';

export const templates = [
  { name: 'Classic Blue', component: Template1 },
  { name: 'Professional', component: Template2 },
  { name: 'Modern Green', component: Template3 },
  { name: 'Corporate', component: Template4 },
  { name: 'Fresh Green', component: Template5 },
  { name: 'Elegant Blue', component: Template6 },
  { name: 'Simple Gray', component: Template7 },
  { name: 'Sky Blue', component: Template8 },
  { name: 'Warm Orange', component: Template9 },
  { name: 'Gradient Pro', component: Template10 },
  { name: 'Minimal Clean', component: Template11 },
  { name: 'Purple Elite', component: Template12 },
  { name: 'Bold Red', component: Template13 },
  { name: 'Ocean Cyan', component: Template14 },
  { name: 'Rustic Brown', component: Template15 },
  { name: 'Modern Dark', component: Template16 },
];

export const getTemplate = (templateNumber) => {
  return templates[templateNumber - 1]?.component || templates[0].component; // Default to Template1 if not found
};

export type ViewMode = 'portal' | 'space3d';

export type ColorTheme = 'tecnm' | 'cyber' | 'gold';

export interface ServiceModuleItem {
  id: string;
  title: string;
  code: string;
  description: string;
  url: string;
  isRestricted?: boolean;
  category: 'tutorias' | 'actualizacion' | 'calidad' | 'siape';
  badgeColor?: string;
  icon: string;
  node3DId?: string;
}

export interface Node3DData {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  accentColor: string;
  position: [number, number, number];
  radius: number;
  type: 'core' | 'tutorias' | 'actualizacion' | 'estadisticas' | 'calidad' | 'siape';
  description: string;
  actionUrl?: string;
  actionText?: string;
}

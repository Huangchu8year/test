export interface Work {
  id: string;
  category: 'video' | 'image' | 'digital';
  subCategory?: string;
  type: string;
  typeEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  responsibilities?: string;
  responsibilitiesEn?: string;
  keywords?: string[];
  link?: string;
}

export interface Skill {
  category: string;
  categoryEn: string;
  items: string[];
}

export interface Experience {
  id: string;
  title: string;
  titleEn: string;
  role: string;
  roleEn: string;
  period: string;
  description: string;
  descriptionEn: string;
}

export interface PortfolioData {
  hero: {
    name: string;
    positioning: string[];
    positioningEn: string[];
    subtitle: string;
    subtitleEn: string;
  };
  skills: Skill[];
  about: {
    content: string;
    contentEn: string;
  };
  contact: {
    methods: { label: string; value: string; icon: string }[];
  };
  works: Work[];
  experiences: Experience[];
}

export interface SiteConfig {
  name: string;
  description: string;
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

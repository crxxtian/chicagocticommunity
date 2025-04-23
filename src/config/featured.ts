// src/config/featured.ts
export interface FeaturedRef {
    type: "news" | "research" | "ransomware" | "miniReport";
    id: string; // for news: use the link; for research/paper: their URL/id; for miniReport: the array index or slug
  }
  
  // 🔧 Simply change this to point at whichever story you want to feature
  export const featuredRef: FeaturedRef = {
    type: "news",
    id: "https://www.securityweek.com/two-healthcare-orgs-hit-by-ransomware-confirm-data-breaches-impacting-over-100000/",
  };
  
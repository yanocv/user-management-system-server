export const DEPARTMENT = {
  DEV: 0,
  NW: 1,
  VERIFY: 2,
  OFFICE: 3,
  MANAGE: 4,
} as const;

export const HOUSE_STATUS = {
  JOIN: 0,
  RETIRE: 1,
  WAIT: 2,
  CANCEL: 3,
  REST: 4,
} as const;

export const COMMISSIONING_STATUS = {
  NOT_COMMIT: 0,
  COMMIT: 1,
} as const;

export const PERMISSION = {
  ROOT: 0,
  ADMINISTRATOR: 1,
  USER: 2,
} as const;

export const SEX = {
  MALE: 0,
  FEMALE: 1,
};

export type CompanyType = keyof typeof COMPANY;

export const COMPANY = {
  SIN: "Secure Industries Network",
  SWI: "Skyline Web Innovations",
  SIF: "Spectrum Integration Firm",
  SST: "Starlight Software Technologies",
  SOP: "Swift Operations Platform",
  SAX: "Silver Arrow Xpress",
  STR: "Summit Tech Resources",
  SIR: "Solaris Innovation Research",
  SGK: "Global Solutions Group",
  SSQ: "Sunrise Solutions Quality",
  PDA: "Prime Data Analytics",
  VPR: "Vanguard Performance Resources",
  PLD: "Pinnacle Logistics Development",
  PLK: "Peak Learning Kits",
  PFL: "Polaris Financial Logistics",
  PUS: "Prestige Utility Services",
  PGO: "Phoenix Growth Opportunities",
  LBQ: "Lunar Business Quest",
  LBA: "Lighthouse Business Advisors",
  VLB: "Visionary Leadership Board",
  LBG: "Liberty Business Group",
  LBC: "Luminous Business Cloud",
  LBJ: "Lunar Base Jupiter",
  LBS: "Lionheart Business Solutions",
  RIS: "Renaissance Information Systems",
  RKE: "Rocket Engineering Solutions",
  VRI: "Velocity Robotics Inc.",
  RLO: "Rapid Launch Operations",
  REX: "Rising Edge Xpertise",
  ZHD: "Zenith Holdings Dynamics",
  ZRK: "Zenith Resource Kingdom",
  ZRG: "Zenith Research Group",
  ZMR: "Zenith Media Relations",
} as const;

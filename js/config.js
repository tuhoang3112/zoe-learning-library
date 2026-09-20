/* Central configuration: site settings + taxonomy. Single source of truth. */
window.ZoeConfig = {
  // Final public URL of the deployed site (no trailing slash needed).
  // Used for canonical URLs and sitemap.xml (see scripts/build-seo.mjs).
  SITE_URL: "https://tuhoang3112.github.io/zoe-learning-library/",

  SUBSTACK_URL: "https://zoedatalens.substack.com/",

  TOPICS: [
    { name: "Marketing & Growth", blurb: "Digital Marketing · Growth · Content · Performance" },
    { name: "Data Analytics", blurb: "Excel · SQL · Statistics · Python · Analytics" },
    { name: "Data Engineering", blurb: "ETL · Data Warehouse · Cloud · Pipelines · APIs" },
    { name: "Product & Vibe Coding", blurb: "AI-assisted coding · Prototyping · Product" },
    { name: "AI Agents & Automation", blurb: "AI workflows · n8n · Agents · Automation" },
    { name: "Languages", blurb: "English · Chinese" }
  ],
  TYPES: ["Course", "Dataset", "Tools & Templates", "Resource"],
  TYPE_LABELS: { Course: "Courses", Dataset: "Datasets", "Tools & Templates": "Tools & Templates", Resource: "Resources" },
  LEVELS: ["Beginner", "Intermediate", "Advanced"],
  ACCESS: ["Free", "Paid"],

  SEARCH_DEBOUNCE_MS: 1000,
  SEARCH_MIN_CHARS: 2
};

#!/usr/bin/env node

const { listCmsItems, createCmsItem } = require("../lib/cms-store");

const CITY = "davao";
const PAGE = "index";

function sysTag(key, value) {
  return `@sys.${key}=${value}`;
}

async function main() {
  const existingIndex = await listCmsItems({ city: CITY, page: PAGE }, { includeDrafts: true });
  if (existingIndex.length) {
    console.log(`index already has ${existingIndex.length} items; skipping seed`);
    return;
  }

  const linkPlan = [
    { section: "things", sourcePage: "things", sourceSection: "cards", limit: 3 },
    { section: "events", sourcePage: "now", sourceSection: "events", limit: 3 },
    { section: "eat", sourcePage: "eat", sourceSection: "cards", limit: 3 },
    { section: "stay", sourcePage: "stay", sourceSection: "cards", limit: 3 },
    { section: "guides", sourcePage: "guides", sourceSection: "cards", limit: 3 }
  ];

  let created = 0;

  for (const plan of linkPlan) {
    const sourceItems = await listCmsItems({ city: CITY, page: plan.sourcePage, section: plan.sourceSection }, { includeDrafts: true });
    const pick = sourceItems.slice(0, plan.limit);

    for (let i = 0; i < pick.length; i += 1) {
      const source = pick[i];
      const tags = [
        sysTag("sourceMode", "linked"),
        sysTag("sourcePage", plan.sourcePage),
        sysTag("sourceId", source.id)
      ];

      if (plan.section === "things" && source.tag) {
        tags.push(String(source.tag));
      }

      await createCmsItem({
        city: CITY,
        page: PAGE,
        section: plan.section,
        title: "",
        text: "",
        image: "",
        meta: "",
        tag: "",
        tags,
        ctaLabel: "",
        ctaUrl: "",
        bookingMode: "none",
        bookingType: "",
        bookingInfo: "",
        sortOrder: i + 1,
        status: "published"
      });
      created += 1;
    }
  }

  console.log(`seeded ${created} linked homepage items`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

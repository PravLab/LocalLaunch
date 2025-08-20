"use client";

import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree"; // Create a placeholder if not made yet

export default function PosterTemplates({ template, siteName, fullURL, logo }) {
  const props = { siteName, fullURL, logo };

  switch (template) {
    case "template1":
      return <TemplateOne {...props} />;
    case "template2":
      return <TemplateTwo {...props} />;
    case "template3":
      return <TemplateThree {...props} />;
    default:
      return <TemplateOne {...props} />;
  }
}

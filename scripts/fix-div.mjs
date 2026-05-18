import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(name.name)) {
      let c = fs.readFileSync(p, "utf8");
      const next = c.replaceAll("motion.div", "div");
      if (next !== c) {
        fs.writeFileSync(p, next);
        console.log("fixed", p);
      }
    }
  }
}

walk(root);

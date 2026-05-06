import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Projects } from "./collections/Projects";
import { Templates } from "./collections/Templates";
import { Media } from "./collections/Media";
import { Subscribers } from "./collections/Subscribers";
import { Newsletters } from "./collections/Newsletters";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "light",
    meta: {
      titleSuffix: " — Kurt Morales CMS",
      description: "Kurt Morales portfolio content dashboard",
    },
    components: {
      beforeDashboard: ["/components/admin/DashboardWelcome#DashboardWelcome"],
      graphics: {
        Icon: "/components/admin/Brand#AdminIcon",
        Logo: "/components/admin/Brand#AdminLogo",
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Posts,
    Projects,
    Templates,
    Media,
    Subscribers,
    Newsletters,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "PLEASE-CHANGE-THIS-SECRET",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./data/payload.db",
    },
  }),
  sharp,
  cors: ["http://localhost:3000", "http://localhost:4321"],
});

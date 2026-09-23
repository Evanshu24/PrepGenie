// import Groq from "groq-sdk";
// import mongoose from "mongoose";
// import User from "../models/User.js";
// import dotenv from "dotenv";
// dotenv.config();
//
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });
//
// export const analyzeResume = async (userId) => {
//   const user = await User.findById(userId).select("parsedResume");
//
//   if (!user) {
//     throw new Error("User not found");
//   }
//
//   if (!user.parsedResume) {
//     throw new Error("parsedResume is empty");
//   }
//
//   const db = mongoose.connection.useDb("prepgenie", {
//     useCache: true,
//   });
//
//   const allowed = await db.collection("allowed").findOne({});
//
//   if (!allowed) {
//     throw new Error("Allowed roles and keywords not found");
//   }
//
//   const roles = allowed.roles || [];
//   const keywords = allowed.keywords || [];
//
//   if (roles.length === 0) {
//     throw new Error("No allowed roles found");
//   }
//
//   const response = await groq.chat.completions.create({
//     model: "openai/gpt-oss-20b",
//     messages: [
//       {
//         role: "system",
//         content: `
// You are a resume analyzer.
//
// Analyze the parsed resume and identify the candidate's most appropriate professional role and relevant keywords.
//
// Rules:
//
// 1. Select exactly ONE role from the allowed roles.
// 2. The role must match one of the allowed roles exactly.
// 3. Never create, modify, or invent a role.
// 4. Select the role that best represents the candidate's overall experience, skills, and work history.
// 5. Only select keywords from the allowed keywords.
// 6. Never create, modify, or invent keywords.
// 7. Only select keywords that are supported by the resume.
// 8. If there is no reasonable matching role, return null.
// 9. Return an empty array if no allowed keywords are supported.
//
// Allowed roles:
// ${JSON.stringify(roles)}
//
// Allowed keywords:
// ${JSON.stringify(keywords)}
// `,
//       },
//       {
//         role: "user",
//         content: JSON.stringify(user.parsedResume),
//       },
//     ],
//     response_format: {
//       type: "json_schema",
//       json_schema: {
//         name: "resume_analysis",
//         strict: true,
//         schema: {
//           type: "object",
//           properties: {
//             role: {
//               type: ["string", "null"],
//               enum: [...roles, null],
//             },
//             keywords: {
//               type: "array",
//               items: {
//                 type: "string",
//                 enum: keywords,
//               },
//             },
//           },
//           required: ["role", "keywords"],
//           additionalProperties: false,
//         },
//       },
//     },
//   });
//
//   const result = JSON.parse(response.choices[0].message.content);
//
//   await User.findByIdAndUpdate(userId, {
//     $set: {
//       resumeAnalysis: {
//         role: result.role,
//         keywords: result.keywords,
//       },
//     },
//   });
//
//   return {
//     role: result.role,
//     keywords: result.keywords,
//     allKeywords: keywords,
//   };
// };

import Groq from "groq-sdk";
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResume = async (userId) => {
  const user = await User.findById(userId).select("parsedResume");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.parsedResume) {
    throw new Error("parsedResume is empty");
  }

  const db = mongoose.connection.useDb("prepgenie", {
    useCache: true,
  });

  const allowed = await db.collection("allowed").findOne({});

  if (!allowed) {
    throw new Error("Allowed roles and keywords not found");
  }

  const roles = allowed.roles || [];
  const keywords = allowed.keywords || [];

  if (roles.length === 0) {
    throw new Error("No allowed roles found");
  }

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
You are a resume analyzer.

Analyze the parsed resume and identify the candidate's most appropriate professional role and relevant keywords describing their skills and experience.

Rules:

1. Select exactly ONE role from the allowed roles.
2. The role must match one of the allowed roles exactly.
3. Never create, modify, or invent a role.
4. Select the role that best represents the candidate's overall experience, skills, and work history.
5. List relevant keywords (skills, tools, technologies) that are clearly supported by the resume.
6. If there is no reasonable matching role, return null.
7. Return an empty array if no relevant keywords are found.

Allowed roles:
${JSON.stringify(roles)}
`,
      },
      {
        role: "user",
        content: JSON.stringify(user.parsedResume),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            role: {
              type: ["string", "null"],
              enum: [...roles, null],
            },
            keywords: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["role", "keywords"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content);

  // Filter model's free-text keywords down to only the allowed set
  const allowedSet = new Set(keywords.map((k) => k.toLowerCase()));
  const filteredKeywords = (result.keywords || []).filter((k) =>
    allowedSet.has(k.toLowerCase()),
  );

  await User.findByIdAndUpdate(userId, {
    $set: {
      resumeAnalysis: {
        role: result.role,
        keywords: filteredKeywords,
      },
    },
  });

  return {
    role: result.role,
    keywords: filteredKeywords,
    allKeywords: keywords,
  };
};

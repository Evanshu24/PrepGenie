import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PARSER_BINARY = path.resolve(__dirname, "../parser/build/resume_parser");

export function parseResume(filePath) {
  return new Promise((resolve, reject) => {
    execFile(
      PARSER_BINARY,
      [filePath],
      { maxBuffer: 5 * 1024 * 1024 },
      (error, stdout, stderr) => {
        let parsed;
        try {
          parsed = JSON.parse(stdout);
        } catch (parseErr) {
          reject(
            new Error(
              `Resume parser produced invalid output.\n` +
                `stderr: ${stderr}\n` +
                `stdout: ${stdout}\n` +
                `execFile error: ${error ? error.message : "none"}`,
            ),
          );
          return;
        }

        if (parsed.error) {
          reject(new Error(parsed.error));
          return;
        }

        resolve(parsed);
      },
    );
  });
}

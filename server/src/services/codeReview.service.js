const axios = require("axios");
const Analysis = require("../models/Analysis");
const {
  getAIReview
} = require(
  "./aiReview.service"
);

const VALID_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx"
];

const IGNORED_FOLDERS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "docs",
  "examples",
  "example",
  "test",
  "tests",
  "__tests__",
  "spec",
  ".storybook"
];

const githubHeaders = {
  "User-Agent": "DevInsight",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
};

const parseGitHubUrl = (repoUrl) => {

  const cleaned = repoUrl
    .trim()
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(".git", "")
    .split("?")[0]
    .split("#")[0]
    .replace("github.com/", "")
    .replace(/\/$/, "");

  const [owner, repo] = cleaned.split("/");

  if (!owner || !repo) {
    throw new Error("Invalid GitHub repository URL");
  }

  return { owner, repo };

};

const getSourceFiles = async (
  owner,
  repo,
  path = "",
  depth = 0
) => {

  if (depth > 3) return [];

  try {

    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: githubHeaders,
        timeout: 30000
      }
    );

    let files = [];

    for (const item of data) {

      if (
        item.type === "file" &&
        VALID_EXTENSIONS.some(ext =>
          item.name.endsWith(ext)
        )
      ) {
        files.push(item);
      }

      if (
        item.type === "dir" &&
        !IGNORED_FOLDERS.includes(item.name)
      ) {

        const nestedFiles =
          await getSourceFiles(
            owner,
            repo,
            item.path,
            depth + 1
          );

        files.push(...nestedFiles);

      }

      if (files.length >= 50) break;

    }

    return files;

  } catch (error) {

    console.log(
      "GitHub Fetch Error:",
      error.message
    );

    return [];

  }

};



const analyzeCode = async (repoUrl) => {

  try {

    const { owner, repo } =
      parseGitHubUrl(repoUrl);

    console.log(
      `Analyzing Repository: ${owner}/${repo}`
    );

    const sourceFiles =
      await getSourceFiles(owner, repo);

    console.log(
      "Source Files Found:",
      sourceFiles.length
    );

    if (!sourceFiles.length) {

      return {
        repository: repoUrl,
        score: 100,
        filesAnalyzed: [],
        issues: [
          {
            file: "global",
            type: "Info",
            message:
              "No JavaScript or TypeScript files found"
          }
        ]
      };

    }

    const filesToAnalyze =
      sourceFiles.slice(0, 2);

    const fileContents =
      await Promise.all(

        filesToAnalyze.map(
          async file => {

            try {

              const response =
                await axios.get(
                  file.download_url,
                  {
                    timeout: 30000
                  }
                );

              return response.data;

            } catch {

              return "";

            }

          }
        )

      );

      const aiReviews =
  await Promise.all(

    fileContents.map(
      code => {

        if (!code) {
          return "Empty file";
        }

        return getAIReview(code);

      }
    )

  );

    const issues = [];

    filesToAnalyze.forEach(
      (file, index) => {

        const code =
          fileContents[index];

        if (!code) return;

        const addIssue = (
          type,
          message
        ) => {

          issues.push({
            file: file.path,
            type,
            message
          });

        };

        if (
          code.includes(
            "console.log"
          )
        ) {

          addIssue(
            "Style",
            "Console statements found"
          );

        }

        if (
          code.includes("var ")
        ) {

          addIssue(
            "Style",
            "Legacy var keyword detected"
          );

        }

        if (
          code.includes(
            "eval("
          )
        ) {

          addIssue(
            "Security",
            "eval() usage detected"
          );

        }

        if (
          code.includes(
            "innerHTML"
          ) &&
          !code.includes(
            "DOMPurify"
          )
        ) {

          addIssue(
            "Security",
            "Potential unsafe innerHTML usage"
          );

        }
        if (
          /TODO|FIXME|HACK/i.test(
            code
          )
        ) {

          addIssue(
            "Maintainability",
            "Technical debt comment found"
          );

        }

        if (
            /(API_KEY|SECRET_KEY|PASSWORD\s*=|TOKEN\s*=)/i.test(
              code
            )
          ) {

            addIssue(
              "Security",
              "Possible hardcoded secret detected"
            );

          }

          if (
            code.includes("async") &&
            !code.includes("try")
          ) {

            addIssue(
              "Bug",
              "Async code without try/catch"
            );

          }

          if (
              code.split("\n").length > 500
            ) {

              addIssue(
                "Maintainability",
                "Large file detected"
              );

            }

            const forLoops =
                  (
                    code.match(
                      /for\s*\(/g
                    ) || []
                  ).length;

                if (
                  forLoops > 2
                ) {

                  addIssue(
                    "Performance",
                    "Multiple loops detected"
                  );

                }

                const lines =
                  code.split("\n");

                if (
                  lines.length > 500
                ) {

                  addIssue(
                    "Maintainability",
                    "Large file detected"
                  );

                }

      }
    );

    const seen = new Set();

    const uniqueIssues =
      issues.filter(issue => {

        const key =
          `${issue.file}-${issue.message}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;

      });

    let score = 100;

uniqueIssues.forEach(issue => {

  switch (issue.type) {

    case "Security":
      score -= 10;
      break;

    case "Bug":
      score -= 8;
      break;

    case "Performance":
      score -= 5;
      break;

    case "Maintainability":
      score -= 3;
      break;

    case "Style":
      score -= 2;
      break;

  }

});

score = Math.max(score, 20);

   const result = {
      repository: repoUrl,

      filesAnalyzed:
        filesToAnalyze.map(
          file => file.path
        ),

      score,

      issues: uniqueIssues,

      aiReviews
    };
    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

  
console.log(
  "RESULT BEFORE SAVE:"
);

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);



    await Analysis.create(result);

console.log(
  "Analysis Saved Successfully"
);

return result;

  } catch (error) {

    console.log(
      "Analysis Error:",
      error.message
    );

    return {
      repository: repoUrl,
      score: 0,
      filesAnalyzed: [],
      issues: [
        {
          file: "global",
          type: "Error",
          message:
            error.message
        }
      ]
    };

  }

};

module.exports = {
  analyzeCode
};
